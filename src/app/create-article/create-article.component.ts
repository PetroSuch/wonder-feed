import { Component, DestroyRef, inject } from "@angular/core";
import {
  NgbAccordionModule,
  NgbDropdownModule,
} from "@ng-bootstrap/ng-bootstrap";
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  IGenerateArticleForm,
  IGenerateArticle,
  IGenerateArticleResponse,
  IGenerateResultForm,
  IRegenerateTitle,
  ICreateArticle,
  IArticle,
  IProductItemForm,
  IGenerateProduct,
  IGenerateSEO,
} from "../shared/interfaces/article.interfaces";
import { CommonModule } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { catchError, finalize, tap } from "rxjs";
import { AlertService } from "../shared/services/alert.service";
import { LoadingComponent } from "../shared/components/loading/loading.component";
import { ArticleService } from "../shared/services/article.service";
import { ActivatedRoute } from "@angular/router";
import { DashboardService } from "../shared/services/dashboard.service";

@Component({
  selector: "app-create-article",
  standalone: true,
  imports: [
    CommonModule,
    NgbAccordionModule,
    NgbDropdownModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    LoadingComponent,
    ReactiveFormsModule,
  ],
  templateUrl: "./create-article.component.html",
  styleUrl: "./create-article.component.scss",
})
export class CreateArticleComponent {
  public form: FormGroup<IGenerateArticleForm> | undefined;
  public formResult: FormGroup<IGenerateResultForm> | undefined;
  public regeneratingTitleKey: string | undefined;
  public activeTab: number;
  public metadataActiveTab: number;
  public isSaving: boolean;
  public isGenerating: boolean;
  public showErrors: boolean;
  public articleData: IArticle | null = null;
  private categoriesMap: Map<number, string> = new Map();
  private destroyRef = inject(DestroyRef);

  public get articleId(): number | null {
    return this.route.snapshot.params["articleId"] as number;
  }

  public get navCategoryTitle(): string | null | undefined {
    const name = this.articleId
      ? this.categoriesMap.get(this.articleData?.id as number)
      : null;
    return this.articleId ? name : null;
  }

  public get navArticleTitle(): string {
    return this.articleId
      ? (this.articleData?.article_title1 as string)
      : "Create Article";
  }

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    private articleService: ArticleService,
    public dashboardService: DashboardService,
  ) {
    this.activeTab = 1;
    this.metadataActiveTab = 1;
    this.isSaving = false;
    this.isGenerating = false;
    this.showErrors = false;
    this.initForm();
    this.initValidation();
    this.fetchArticleById();
    this.mapCategories();
  }

  private mapCategories() {
    this.dashboardService.categories$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.categoriesMap = new Map(data.map((c) => [c.id, c.name]));
      });
  }

  public onSaveArticle() {
    if (
      !this.formResult ||
      !this.form ||
      this.form.invalid ||
      this.formResult.invalid
    ) {
      this.alertService.error("Please fill out all required fields.");
      this.showErrors = true;
      return;
    }

    this.isSaving = true;

    const formResult = this.formResult.value;
    const formData = this.form?.value;
    const products_list = formResult.products!.map((product) => ({
      title: product.title,
      description: product.description,
      alt_text: product.alt_text,
    })) as IGenerateProduct[];

    const seo_data: IGenerateSEO = {
      title: formResult.seo_title!,
      description: formResult.seo_description!,
      keywords: formResult.seo_keywords!,
    };

    const data: ICreateArticle = {
      alt_text: formResult.alt_text!,
      article_description: formResult.article_description!,
      article_title1: formResult.article_title1!,
      article_title2: formResult.article_title2!,
      article_title3: formResult.article_title3!,
      status: formData.status!,
      products_list: products_list,
      seo: seo_data,
      seo_keywords: formResult.seo_keywords!,
      // metadata
      article: formData.article!,
      product_titles: formData.product_titles! as string[],
      template_id: formData.template_id!,
      category_id: formData.category_id!,
    };

    let api$;

    if (this.articleId) {
      api$ = this.articleService.updateArticle(this.articleId, data);
    } else {
      api$ = this.articleService
        .createArticle(data)
        .pipe(tap(() => this.dashboardService.fetchCategories()));
    }

    api$
      .pipe(
        tap(() => this.alertService.success("Article saved successfully!")),
        catchError(() => this.alertService.error()),
        finalize(() => (this.isSaving = false)),
      )
      .subscribe();
  }

  public onGenerateData() {
    if (!this.form || this.form.invalid) {
      this.alertService.error("Please fill out all required fields.");
      this.form?.updateValueAndValidity();
      this.showErrors = true;
      return;
    }

    this.isGenerating = true;

    const value = this.form.value;
    const data: IGenerateArticle = {
      category_id: +value.category_id!,
      template_id: +value.template_id!,
      article_title1: value.article!,
      product_titles: value.product_titles as string[],
      seo_keywords: value.seo_keywords!,
    };

    const errMsg = "Something went wrong. Please try again later.";

    this.articleService
      .generateArticle(data)
      .pipe(
        tap((data) => this.patchGenerateForm(data)),
        catchError(() => this.alertService.error(errMsg)),
        finalize(() => (this.isGenerating = false)),
      )
      .subscribe();
  }

  public onRegenerateTitle(controlName: string) {
    if (
      !this.formResult ||
      !this.form ||
      this.regeneratingTitleKey !== undefined
    ) {
      return;
    }

    const control = this.formResult.get(controlName);
    const currentTitle = control?.value as string;

    const value = this.form.value;
    const data: IRegenerateTitle = {
      template_id: 1,
      article_title1: value.article!,
      product_titles: value.product_titles as string[],
      title_regenerate: currentTitle,
      seo_keywords: value.seo_keywords!,
    };
    const errMsg = "Something went wrong. Please try again later.";

    this.regeneratingTitleKey = controlName;

    this.articleService
      .regenerateTitle(data)
      .pipe(
        tap((data) => control?.patchValue(data.newtitle)),
        catchError(() => this.alertService.error(errMsg)),
        finalize(() => (this.regeneratingTitleKey = undefined)),
      )
      .subscribe();
  }

  public onCopyToClipboard(controlName: string) {
    if (!this.formResult) return;

    const control = this.formResult.get(controlName);
    if (!control) return;

    void navigator.clipboard.writeText(control.value as string);
    this.alertService.success("Copied to clipboard!");
  }

  public onAddProductTitle() {
    if (!this.form) return;

    const validators = [Validators.required];
    const control = new FormControl<null | string>(null, { validators });
    (this.form.controls.product_titles as FormArray).push(control);
  }

  public onRemoveProductTitle(index: number) {
    if (!this.form) return;

    const conf = confirm("Are you sure you want to remove this product title?");
    if (!conf) return;

    (this.form.controls.product_titles as FormArray).removeAt(index);
  }

  private patchGenerateForm(data: IGenerateArticleResponse) {
    if (!this.formResult) return;

    this.formResult.patchValue({
      article_title1: data.general.title1,
      article_title2: data.general.title2,
      article_title3: data.general.title3,
      alt_text: data.general.alt_text,
      article_description: data.general.article_description,
      seo_title: data.seo.title,
      seo_description: data.seo.description,
      seo_keywords: data.seo.keywords,
    });

    const products = this.formResult.controls.products as FormArray;
    products.clear();
    data.products_list.forEach((product) => {
      const productForm = new FormGroup<IProductItemForm>({
        title: new FormControl(product.title),
        description: new FormControl(product.description),
        alt_text: new FormControl(product.alt_text),
      });
      products.push(productForm);
    });
  }

  private initForm() {
    const validators = [Validators.required];
    this.form = new FormGroup<IGenerateArticleForm>({
      category_id: new FormControl<null | number>(null),
      template_id: new FormControl<null | number>(null),
      status: new FormControl<null | string>(null),
      article: new FormControl<null | string>(null),
      seo_keywords: new FormControl<null | string>(null),
      product_titles: new FormArray<FormControl<null | string>>([
        new FormControl<null | string>(null, { validators }),
        new FormControl<null | string>(null, { validators }),
        new FormControl<null | string>(null, { validators }),
      ]),
    });

    this.form.valueChanges.subscribe((v) => {
      console.log(v);
    });

    this.formResult = new FormGroup<IGenerateResultForm>({
      article_title1: new FormControl<null | string>(null),
      article_title2: new FormControl<null | string>(null),
      article_title3: new FormControl<null | string>(null),
      alt_text: new FormControl<null | string>(null),
      article_description: new FormControl<null | string>(null),
      products: new FormArray<FormGroup<IProductItemForm>>([]),
      seo_title: new FormControl<null | string>(null),
      seo_description: new FormControl<null | string>(null),
      seo_keywords: new FormControl<null | string>(null),
    });

    const products = this.formResult.controls.products as FormArray;
    for (let i = 0; i < 3; i++) {
      const product = new FormGroup<IProductItemForm>({
        title: new FormControl<null | string>(null),
        description: new FormControl<null | string>(null),
        alt_text: new FormControl<null | string>(null),
      });
      products.push(product);
    }
  }

  private fetchArticleById() {
    if (!this.articleId) return;

    this.articleService
      .getArticle(this.articleId)
      .pipe(
        tap((data) => (this.articleData = data)),
        tap((data) => this.patchPageData(data)),
        catchError(() => this.alertService.error()),
      )
      .subscribe();
  }

  private patchPageData(data: IArticle) {
    if (!this.form) return;

    this.form.patchValue(data);
    this.form.patchValue(data.article_metadata);
    this.formResult?.patchValue({
      ...data,
      seo_description: data.seo.description,
      seo_title: data.seo.title,
      seo_keywords: data.seo.keywords,
    });
    const products = this.formResult?.controls.products as FormArray;
    products.clear();

    data.products_list.forEach((product) => {
      const productForm = new FormGroup<IProductItemForm>({
        title: new FormControl(product.title),
        description: new FormControl(product.description),
        alt_text: new FormControl(product.alt_text),
      });
      products.push(productForm);
    });
  }

  private initValidation() {
    if (!this.form) return;
    const { article, template_id, category_id, product_titles } =
      this.form.controls;

    [article, template_id, category_id, product_titles].forEach((control) => {
      control.setValidators([Validators.required]);
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      this.form?.controls.product_titles.controls as any[],
      event.previousIndex,
      event.currentIndex,
    );
  }
}
