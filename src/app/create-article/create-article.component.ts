import { Component } from "@angular/core";
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
import { ApiService } from "../shared/services/api.service";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  ICreateArticleForm,
  ICreateArticle,
  IGenerateArticleResponse,
  IGenerateResultForm,
  IRegenerateTitle,
} from "../shared/interfaces/article.interfaces";
import { CommonModule } from "@angular/common";
import { catchError, finalize, tap } from "rxjs";
import { AlertService } from "../shared/services/alert.service";
import { LoadingComponent } from "../shared/components/loading/loading.component";
import { TemplateService } from "../shared/services/template.service";
import { ITemplate } from "../shared/interfaces/template.interface";
import { CategoryService } from "../shared/services/category.service";
import { ICategory } from "../shared/interfaces/category.interfaces";
import { ArticleService } from "../shared/services/article.service";

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
  public templates: ITemplate[] = [];
  public categories: ICategory[] = [];
  public form: FormGroup<ICreateArticleForm> | undefined;
  public formResult: FormGroup<IGenerateResultForm> | undefined;
  public regeneratingTitleKey: string | undefined;
  public isGenerating: boolean;
  public showErrors: boolean;

  constructor(
    private alertService: AlertService,
    private articleService: ArticleService,
    private templateService: TemplateService,
    private categoryService: CategoryService,
  ) {
    this.isGenerating = false;
    this.showErrors = false;
    this.initForm();
    this.initValidation();
    this.fetchTemplates();
    this.fetchCategories();

    const data2 = {
      template_id: 3,
      article_title1: "The Ultimate Guide to Productivity",
      product_title1: "Time Management Techniques",
      product_title2: "Productivity Tools",
      product_title3: "Effective Planning Strategies",
    } as any;

    this.articleService.generateArticle(data2 as any).subscribe();
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
    const data: ICreateArticle = {
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
    this.form = new FormGroup<ICreateArticleForm>({
      category_id: new FormControl<null | number>(null),
      template_id: new FormControl<null | number>(null),
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

  private fetchTemplates() {
    this.templateService
      .getTemplates()
      .pipe(tap((data) => (this.templates = data)))
      .subscribe();
  }

  private fetchCategories() {
    this.categoryService
      .getCategories()
      .pipe(tap((data) => (this.categories = data)))
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
