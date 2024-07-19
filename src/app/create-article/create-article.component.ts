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
  public items = ["Product Title 1", "Product Title 2", "Product Title 3"];
  public form: FormGroup<IGenerateArticleForm> | undefined;
  public formResult: FormGroup<IGenerateResultForm> | undefined;
  public regeneratingTitleKey: string | undefined;
  public isSaving: boolean;
  public isGenerating: boolean;
  public showErrors: boolean;
  private articleData: IArticle | null = null;
  private categoriesMap: Map<number, string> = new Map();
  private destroyRef = inject(DestroyRef);

  private get articleId(): number | null {
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
    const data: ICreateArticle = {
      alt_text: formResult.alt_text!,
      article_description: formResult.article_description!,
      article_title1: formResult.article_title1!,
      article_title2: formResult.article_title2!,
      article_title3: formResult.article_title3!,
      status: formData.status!,
      // metadata
      article: formData.article!,
      product_titles: [formData.title1!, formData.title2!, formData.title3!],
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
      product_title1: value.title1!,
      product_title2: value.title2!,
      product_title3: value.title3!,
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
      product_title1: value.title1!,
      product_title2: value.title2!,
      product_title3: value.title3!,
      title_regenerate: currentTitle,
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

  private patchGenerateForm(data: IGenerateArticleResponse) {
    if (!this.formResult) return;

    this.formResult.patchValue({
      article_title1: data.title1,
      article_title2: data.title2,
      article_title3: data.title3,
      alt_text: data.alt_text,
      article_description: data.article_description,
    });
  }

  private initForm() {
    this.form = new FormGroup<IGenerateArticleForm>({
      category_id: new FormControl<null | number>(null),
      template_id: new FormControl<null | number>(null),
      status: new FormControl<null | string>(null),
      article: new FormControl<null | string>(null),
      title1: new FormControl<null | string>(null),
      title2: new FormControl<null | string>(null),
      title3: new FormControl<null | string>(null),
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
    });
  }

  private fetchArticleById() {
    if (!this.articleId) return;

    this.articleService
      .getArticle(this.articleId)
      .pipe(
        tap((data) => (this.articleData = data)),
        tap((data) => this.form?.patchValue(data)),
        tap((data) => this.formResult?.patchValue(data)),
        catchError(() => this.alertService.error()),
      )
      .subscribe();
  }

  private initValidation() {
    if (!this.form) return;
    const { title1, title2, title3, article, template_id, category_id } =
      this.form.controls;

    [title1, title2, title3, article, template_id, category_id].forEach(
      (control) => {
        control.setValidators([Validators.required]);
      },
    );
  }

  drop(event: CdkDragDrop<number[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }
}
