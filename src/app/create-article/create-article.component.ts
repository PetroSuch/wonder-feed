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
  IGenerateResultForm,
} from "../shared/interfaces/article-generate-form.interface";
import { CommonModule } from "@angular/common";
import { catchError, finalize, tap } from "rxjs";
import {
  IGenerateArticle,
  IGenerateArticleResponse,
  IRegenerateTitle,
} from "../shared/interfaces/api.interfaces";
import { AlertService } from "../shared/services/alert.service";
import { LoadingComponent } from "../shared/components/loading/loading.component";

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
  public form: FormGroup<ICreateArticleForm> | undefined;
  public formResult: FormGroup<IGenerateResultForm> | undefined;
  public regeneratingTitleKey: string | undefined;
  public isGenerating: boolean;
  public showErrors: boolean;

  constructor(
    private apiService: ApiService,
    private alertService: AlertService,
  ) {
    this.isGenerating = false;
    this.showErrors = false;
    this.initForm();
    this.initValidation();
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
      article_title1: value.article_title1!,
      product_title1: value.product_title1!,
      product_title2: value.product_title2!,
      product_title3: value.product_title3!,
    };
    const errMsg = "Something went wrong. Please try again later.";

    this.apiService
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
      article_title1: value.article_title1!,
      product_title1: value.product_title1!,
      product_title2: value.product_title2!,
      product_title3: value.product_title3!,
      title_regenerate: currentTitle,
    };
    const errMsg = "Something went wrong. Please try again later.";

    this.regeneratingTitleKey = controlName;

    this.apiService
      .regenerateTitle(data)
      .pipe(
        tap((data) => control?.patchValue(data.newtitle)),
        tap(() => console.log(this.formResult?.value)),
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
      article_title1: new FormControl<null | string>(null),
      product_title1: new FormControl<null | string>(null),
      product_title2: new FormControl<null | string>(null),
      product_title3: new FormControl<null | string>(null),
    });

    this.formResult = new FormGroup<IGenerateResultForm>({
      article_title1: new FormControl<null | string>(null),
      article_title2: new FormControl<null | string>(null),
      article_title3: new FormControl<null | string>(null),
      alt_text: new FormControl<null | string>(null),
      article_description: new FormControl<null | string>(null),
    });
  }

  private initValidation() {
    if (!this.form) return;
    const { article_title1, product_title1, product_title2, product_title3 } =
      this.form.controls;

    [article_title1, product_title1, product_title2, product_title3].forEach(
      (control) => {
        control.setValidators([Validators.required]);
      },
    );
  }

  drop(event: CdkDragDrop<number[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }
}
