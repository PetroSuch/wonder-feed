import { Component, DestroyRef, inject } from "@angular/core";
import {
  NgbAccordionModule,
  NgbDropdownModule,
} from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";
import {
  IGeneralFormGroup,
  INewTemplateForm,
  IProductFormGroup,
  ISeoFormGroup,
  ITemplate,
  ITemplateGroup,
} from "../shared/interfaces/template.interface";
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { AlertService } from "../shared/services/alert.service";
import { catchError, filter, finalize, tap } from "rxjs";
import { TemplateService } from "../shared/services/template.service";
import { LoadingComponent } from "../shared/components/loading/loading.component";
import { ActivatedRoute, Router } from "@angular/router";
import { DashboardService } from "../shared/services/dashboard.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AutoResizeDirective } from "../shared/directives/auto-resize.directive";

@Component({
  selector: "app-create-template",
  standalone: true,
  imports: [
    CommonModule,
    NgbAccordionModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    LoadingComponent,
    AutoResizeDirective,
  ],
  templateUrl: "./create-template.component.html",
  styleUrl: "./create-template.component.scss",
})
export class CreateTemplateComponent {
  public form: FormGroup<INewTemplateForm> | null = null;
  public isSaving: boolean = false;
  public showErrors: boolean = false;
  public activeTab: number = 1;
  public activeSubTab: number = 1;
  private templateId: number | null = null;
  private templateData: ITemplate | null = null;
  private readonly destroyRef = inject(DestroyRef);

  public get navLabel() {
    return this.templateId
      ? this.templateData?.template_name
      : "Create Template";
  }

  public get tabTitle(): string {
    switch (this.activeTab) {
      case 1:
        return "General Section";
      case 2:
        return "Product Section";
      case 3:
        return "Social Media";
      case 4:
        return "SEO Section";
      default:
        return "";
    }
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private templateService: TemplateService,
    private dashboardService: DashboardService,
  ) {
    this.initTemplateForm();
    // this.initValidation();
    // this.testPatch();
    this.activeSubTab = +this.route.snapshot.queryParams["subTab"] || 1;

    this.route.queryParams
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((params) => !!params["tab"]),
        tap((params) => (this.activeTab = +params["tab"])),
      )
      .subscribe();

    if (this.route.snapshot.params["templateId"]) {
      this.templateId = +this.route.snapshot.params["templateId"];
      this.templateService
        .getTemplate(this.templateId)
        .pipe(
          filter(() => !!this.form),
          tap((data) => (this.templateData = data)),
          tap((data) => this.patchForm(data)),
        )
        .subscribe();
    }
  }

  public isValidTab(formGroup: FormGroup<ITemplateGroup> | null) {
    if (!formGroup) return false;
    const controls = formGroup.controls;
    return [
      controls.field_characters_limit,
      controls.field_main_topic,
      controls.field_power_words,
      controls.field_primary_keywords,
      controls.field_seo_rules,
      controls.field_examples,
    ].every((c) => c.valid);
  }

  public openTab(tab: number) {
    this.activeSubTab = tab;
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { subTab: this.activeSubTab },
      queryParamsHandling: "merge",
    });
  }

  private testPatch() {
    this.form?.patchValue({
      general_group: {
        general_article_group: {
          field_characters_limit: "100",
          field_main_topic: "Test",
          field_power_words: "Test",
          field_primary_keywords: "Test",
          field_seo_rules: "Test",
          field_examples: "Test",
        },
        general_description_group: {
          field_characters_limit: "100",
          field_main_topic: "Test",
          field_power_words: "Test",
          field_primary_keywords: "Test",
          field_seo_rules: "Test",
          field_examples: "Test",
        },
        general_alt_text_group: {
          field_characters_limit: "100",
          field_main_topic: "Test",
          field_power_words: "Test",
          field_primary_keywords: "Test",
          field_seo_rules: "Test",
          field_examples: "Test",
        },
      },
      // product_group: {
      //   product_article_group: {
      //     field_characters_limit: "100",
      //     field_main_topic: "Test",
      //     field_power_words: "Test",
      //     field_primary_keywords: "Test",
      //     field_seo_rules: "Test",
      //     field_examples: "Test",
      //   },
      //   product_description_group: {
      //     field_characters_limit: "100",
      //     field_main_topic: "Test",
      //     field_power_words: "Test",
      //     field_primary_keywords: "Test",
      //     field_seo_rules: "Test",
      //     field_examples: "Test",
      //   },
      //   product_alt_text_group: {
      //     field_characters_limit: "100",
      //     field_main_topic: "Test",
      //     field_power_words: "Test",
      //     field_primary_keywords: "Test",
      //     field_seo_rules: "Test",
      //     field_examples: "Test",
      //   },
      // },
      // seo_group: {
      //   seo_title_group: {
      //     field_characters_limit: "100",
      //     field_main_topic: "Test",
      //     field_power_words: "Test",
      //     field_primary_keywords: "Test",
      //     field_seo_rules: "Test",
      //     field_examples: "Test",
      //   },
      //   seo_description_group: {
      //     field_characters_limit: "100",
      //     field_main_topic: "Test",
      //     field_power_words: "Test",
      //     field_primary_keywords: "Test",
      //     field_seo_rules: "Test",
      //     field_examples: "Test",
      //   },
      //   seo_keywords_group: {
      //     field_characters_limit: "100",
      //     field_main_topic: "Test",
      //     field_power_words: "Test",
      //     field_primary_keywords: "Test",
      //     field_seo_rules: "Test",
      //     field_examples: "Test",
      //   },
      // },
    });
  }

  public onSaveTemplate() {
    // if (!this.form || !this.form.valid) {
    //   this.displayInvalidTabs();
    //   this.showErrors = true;
    //   return;
    // }

    this.isSaving = true;
    let api$;
    if (this.templateId) {
      api$ = this.templateService.updateTemplate(
        this.templateId,
        this.mapFormToTemplate(),
      );
    } else {
      api$ = this.templateService.createTemplate(this.mapFormToTemplate());
    }

    api$
      .pipe(
        tap(() => this.dashboardService.fetchTemplates()),
        tap(() => this.alertService.success("Template saved!")),
        catchError(() => this.alertService.error("Failed to save template!")),
        finalize(() => (this.isSaving = false)),
      )
      .subscribe();
  }

  private mapFormToTemplate(): ITemplate {
    const formValue = this.form?.value;
    if (!formValue) return {} as ITemplate;
    const { general_group, product_group, seo_group } = formValue;
    const generalArticleGroup = general_group!.general_article_group;
    const generalDescriptionGroup = general_group!.general_description_group;
    const generalAltTextGroup = general_group!.general_alt_text_group;
    const productArticleGroup = product_group!.product_article_group;
    const productDescriptionGroup = product_group!.product_description_group;
    const productAltTextGroup = product_group!.product_alt_text_group;
    const seoTitleGroup = seo_group!.seo_title_group;
    const seoDescriptionGroup = seo_group!.seo_description_group;
    const seoKeywordsGroup = seo_group!.seo_keywords_group;

    return {
      status: formValue.status!,
      template_name: formValue.template_name!,
      define_purpose: formValue.define_purpose!,
      audience: formValue.audience!,
      tone_style: formValue.tone_style!,
      additional_requirements: formValue.additional_requirements!,
      general_alt_text_field_characters_limit:
        generalAltTextGroup!.field_characters_limit!,
      general_alt_text_field_examples: generalAltTextGroup!.field_examples!,
      general_alt_text_field_main_topic: generalAltTextGroup!.field_main_topic!,
      general_alt_text_field_power_words:
        generalAltTextGroup!.field_power_words!,
      general_alt_text_field_primary_keywords:
        generalAltTextGroup!.field_primary_keywords!,
      general_alt_text_field_seo_rules: generalAltTextGroup!.field_seo_rules!,
      general_article_field_characters_limit:
        generalArticleGroup!.field_characters_limit!,
      general_article_field_examples: generalArticleGroup!.field_examples!,
      general_article_field_main_topic: generalArticleGroup!.field_main_topic!,
      general_article_field_power_words:
        generalArticleGroup!.field_power_words!,
      general_article_field_primary_keywords:
        generalArticleGroup!.field_primary_keywords!,
      general_article_field_seo_rules: generalArticleGroup!.field_seo_rules!,
      general_description_field_characters_limit:
        generalDescriptionGroup!.field_characters_limit!,
      general_description_field_examples:
        generalDescriptionGroup!.field_examples!,
      general_description_field_main_topic:
        generalDescriptionGroup!.field_main_topic!,
      general_description_field_power_words:
        generalDescriptionGroup!.field_power_words!,
      general_description_field_primary_keywords:
        generalDescriptionGroup!.field_primary_keywords!,
      general_description_field_seo_rules:
        generalDescriptionGroup!.field_seo_rules!,

      product_alt_text_field_characters_limit:
        productAltTextGroup!.field_characters_limit!,
      product_alt_text_field_examples: productAltTextGroup!.field_examples!,
      product_alt_text_field_main_topic: productAltTextGroup!.field_main_topic!,
      product_alt_text_field_power_words:
        productAltTextGroup!.field_power_words!,
      product_alt_text_field_primary_keywords:
        productAltTextGroup!.field_primary_keywords!,
      product_alt_text_field_seo_rules: productAltTextGroup!.field_seo_rules!,
      product_article_field_characters_limit:
        productArticleGroup!.field_characters_limit!,
      product_article_field_examples: productArticleGroup!.field_examples!,
      product_article_field_main_topic: productArticleGroup!.field_main_topic!,
      product_article_field_power_words:
        productArticleGroup!.field_power_words!,
      product_article_field_primary_keywords:
        productArticleGroup!.field_primary_keywords!,
      product_article_field_seo_rules: productArticleGroup!.field_seo_rules!,
      product_description_field_characters_limit:
        productDescriptionGroup!.field_characters_limit!,
      product_description_field_examples:
        productDescriptionGroup!.field_examples!,
      product_description_field_main_topic:
        productDescriptionGroup!.field_main_topic!,
      product_description_field_power_words:
        productDescriptionGroup!.field_power_words!,
      product_description_field_primary_keywords:
        productDescriptionGroup!.field_primary_keywords!,
      product_description_field_seo_rules:
        productDescriptionGroup!.field_seo_rules!,

      seo_keywords_field_characters_limit:
        seoKeywordsGroup!.field_characters_limit!,
      seo_keywords_field_examples: seoKeywordsGroup!.field_examples!,
      seo_keywords_field_main_topic: seoKeywordsGroup!.field_main_topic!,
      seo_keywords_field_power_words: seoKeywordsGroup!.field_power_words!,
      seo_keywords_field_primary_keywords:
        seoKeywordsGroup!.field_primary_keywords!,
      seo_keywords_field_seo_rules: seoKeywordsGroup!.field_seo_rules!,
      seo_title_field_characters_limit: seoTitleGroup!.field_characters_limit!,
      seo_title_field_examples: seoTitleGroup!.field_examples!,
      seo_title_field_main_topic: seoTitleGroup!.field_main_topic!,
      seo_title_field_power_words: seoTitleGroup!.field_power_words!,
      seo_title_field_primary_keywords: seoTitleGroup!.field_primary_keywords!,
      seo_title_field_seo_rules: seoTitleGroup!.field_seo_rules!,
      seo_description_field_characters_limit:
        seoDescriptionGroup!.field_characters_limit!,
      seo_description_field_examples: seoDescriptionGroup!.field_examples!,
      seo_description_field_main_topic: seoDescriptionGroup!.field_main_topic!,
      seo_description_field_power_words:
        seoDescriptionGroup!.field_power_words!,
      seo_description_field_primary_keywords:
        seoDescriptionGroup!.field_primary_keywords!,
      seo_description_field_seo_rules: seoDescriptionGroup!.field_seo_rules!,
    };
  }

  private displayInvalidTabs() {
    if (!this.form) return;
    const invalidTabs = [];
    const { general_group, product_group } = this.form.controls;
    const generalArticleGroup = general_group.controls.general_article_group;
    const generalDescriptionGroup =
      general_group.controls.general_description_group;
    const generalAltTextGroup = general_group.controls.general_alt_text_group;
    const productArticleGroup = product_group.controls.product_article_group;
    const productDescriptionGroup =
      product_group.controls.product_description_group;
    const productAltTextGroup = product_group.controls.product_alt_text_group;

    if (
      !this.isValidTab(generalArticleGroup) ||
      !this.isValidTab(generalAltTextGroup) ||
      !this.isValidTab(generalDescriptionGroup)
    ) {
      invalidTabs.push("General Article");
    }

    if (
      !this.isValidTab(productArticleGroup) ||
      !this.isValidTab(productAltTextGroup) ||
      !this.isValidTab(productDescriptionGroup)
    ) {
      invalidTabs.push("Product Article");
    }

    if (invalidTabs.length) {
      const msg = `Please fill in all required fields in the following tabs: ${invalidTabs.join(
        ", ",
      )}`;
      this.alertService.error(msg, { duration: 10000 });
    }
  }

  private patchForm(data: ITemplate) {
    if (!this.form) return;
    this.form.patchValue(data);
    const {
      general_article_group,
      general_alt_text_group,
      general_description_group,
    } = this.form.controls.general_group.controls;

    const {
      product_article_group,
      product_description_group,
      product_alt_text_group,
    } = this.form.controls.product_group.controls;

    const { seo_title_group, seo_description_group, seo_keywords_group } =
      this.form.controls.seo_group.controls;

    general_article_group.patchValue({
      field_characters_limit: data.general_article_field_characters_limit,
      field_main_topic: data.general_article_field_main_topic,
      field_power_words: data.general_article_field_power_words,
      field_primary_keywords: data.general_article_field_primary_keywords,
      field_seo_rules: data.general_article_field_seo_rules,
      field_examples: data.general_article_field_examples,
    });

    general_alt_text_group.patchValue({
      field_characters_limit: data.general_alt_text_field_characters_limit,
      field_main_topic: data.general_alt_text_field_main_topic,
      field_power_words: data.general_alt_text_field_power_words,
      field_primary_keywords: data.general_alt_text_field_primary_keywords,
      field_seo_rules: data.general_alt_text_field_seo_rules,
      field_examples: data.general_alt_text_field_examples,
    });

    general_description_group.patchValue({
      field_characters_limit: data.general_description_field_characters_limit,
      field_main_topic: data.general_description_field_main_topic,
      field_power_words: data.general_description_field_power_words,
      field_primary_keywords: data.general_description_field_primary_keywords,
      field_seo_rules: data.general_description_field_seo_rules,
      field_examples: data.general_description_field_examples,
    });

    product_article_group.patchValue({
      field_characters_limit: data.product_article_field_characters_limit,
      field_main_topic: data.product_article_field_main_topic,
      field_power_words: data.product_article_field_power_words,
      field_primary_keywords: data.product_article_field_primary_keywords,
      field_seo_rules: data.product_article_field_seo_rules,
      field_examples: data.product_article_field_examples,
    });

    product_description_group.patchValue({
      field_characters_limit: data.product_description_field_characters_limit,
      field_main_topic: data.product_description_field_main_topic,
      field_power_words: data.product_description_field_power_words,
      field_primary_keywords: data.product_description_field_primary_keywords,
      field_seo_rules: data.product_description_field_seo_rules,
      field_examples: data.product_description_field_examples,
    });

    product_alt_text_group.patchValue({
      field_characters_limit: data.product_alt_text_field_characters_limit,
      field_main_topic: data.product_alt_text_field_main_topic,
      field_power_words: data.product_alt_text_field_power_words,
      field_primary_keywords: data.product_alt_text_field_primary_keywords,
      field_seo_rules: data.product_alt_text_field_seo_rules,
      field_examples: data.product_alt_text_field_examples,
    });

    seo_title_group.patchValue({
      field_characters_limit: data.seo_title_field_characters_limit,
      field_main_topic: data.seo_title_field_main_topic,
      field_power_words: data.seo_title_field_power_words,
      field_primary_keywords: data.seo_title_field_primary_keywords,
      field_seo_rules: data.seo_title_field_seo_rules,
      field_examples: data.seo_title_field_examples,
    });

    seo_description_group.patchValue({
      field_characters_limit: data.seo_description_field_characters_limit,
      field_main_topic: data.seo_description_field_main_topic,
      field_power_words: data.seo_description_field_power_words,
      field_primary_keywords: data.seo_description_field_primary_keywords,
      field_seo_rules: data.seo_description_field_seo_rules,
      field_examples: data.seo_description_field_examples,
    });

    seo_keywords_group.patchValue({
      field_characters_limit: data.seo_keywords_field_characters_limit,
      field_main_topic: data.seo_keywords_field_main_topic,
      field_power_words: data.seo_keywords_field_power_words,
      field_primary_keywords: data.seo_keywords_field_primary_keywords,
      field_seo_rules: data.seo_keywords_field_seo_rules,
      field_examples: data.seo_keywords_field_examples,
    });
  }

  private initTemplateForm() {
    this.form = new FormGroup<INewTemplateForm>({
      template_name: new FormControl(null),
      status: new FormControl(null),
      additional_requirements: new FormControl(null),
      audience: new FormControl(null),
      define_purpose: new FormControl(null),
      tone_style: new FormControl(null),
      general_group: new FormGroup<IGeneralFormGroup>({
        general_article_group: new FormGroup<ITemplateGroup>({
          field_characters_limit: new FormControl(null),
          field_main_topic: new FormControl(null),
          field_power_words: new FormControl(null),
          field_primary_keywords: new FormControl(null),
          field_seo_rules: new FormControl(null),
          field_examples: new FormControl(null),
        }),
        general_description_group: new FormGroup<ITemplateGroup>({
          field_characters_limit: new FormControl(null),
          field_main_topic: new FormControl(null),
          field_power_words: new FormControl(null),
          field_primary_keywords: new FormControl(null),
          field_seo_rules: new FormControl(null),
          field_examples: new FormControl(null),
        }),
        general_alt_text_group: new FormGroup<ITemplateGroup>({
          field_characters_limit: new FormControl(null),
          field_main_topic: new FormControl(null),
          field_power_words: new FormControl(null),
          field_primary_keywords: new FormControl(null),
          field_seo_rules: new FormControl(null),
          field_examples: new FormControl(null),
        }),
      }),
      product_group: new FormGroup<IProductFormGroup>({
        product_article_group: new FormGroup<ITemplateGroup>({
          field_characters_limit: new FormControl(null),
          field_main_topic: new FormControl(null),
          field_power_words: new FormControl(null),
          field_primary_keywords: new FormControl(null),
          field_seo_rules: new FormControl(null),
          field_examples: new FormControl(null),
        }),
        product_description_group: new FormGroup<ITemplateGroup>({
          field_characters_limit: new FormControl(null),
          field_main_topic: new FormControl(null),
          field_power_words: new FormControl(null),
          field_primary_keywords: new FormControl(null),
          field_seo_rules: new FormControl(null),
          field_examples: new FormControl(null),
        }),
        product_alt_text_group: new FormGroup<ITemplateGroup>({
          field_characters_limit: new FormControl(null),
          field_main_topic: new FormControl(null),
          field_power_words: new FormControl(null),
          field_primary_keywords: new FormControl(null),
          field_seo_rules: new FormControl(null),
          field_examples: new FormControl(null),
        }),
      }),

      seo_group: new FormGroup<ISeoFormGroup>({
        seo_title_group: new FormGroup<ITemplateGroup>({
          field_characters_limit: new FormControl(null),
          field_main_topic: new FormControl(null),
          field_power_words: new FormControl(null),
          field_primary_keywords: new FormControl(null),
          field_seo_rules: new FormControl(null),
          field_examples: new FormControl(null),
        }),
        seo_description_group: new FormGroup<ITemplateGroup>({
          field_characters_limit: new FormControl(null),
          field_main_topic: new FormControl(null),
          field_power_words: new FormControl(null),
          field_primary_keywords: new FormControl(null),
          field_seo_rules: new FormControl(null),
          field_examples: new FormControl(null),
        }),
        seo_keywords_group: new FormGroup<ITemplateGroup>({
          field_characters_limit: new FormControl(null),
          field_main_topic: new FormControl(null),
          field_power_words: new FormControl(null),
          field_primary_keywords: new FormControl(null),
          field_seo_rules: new FormControl(null),
          field_examples: new FormControl(null),
        }),
      }),
    });
  }

  private initValidation() {
    if (!this.form) return;

    const generalGroup = this.form.controls.general_group.controls;
    const generalArticleGroup = generalGroup.general_article_group.controls;
    const generalDescriptionGroup =
      generalGroup.general_description_group.controls;
    const generalAltTextGroup = generalGroup.general_alt_text_group.controls;

    const productGroup = this.form.controls.product_group.controls;
    const productArticleGroup = productGroup.product_article_group.controls;
    const productDescriptionGroup =
      productGroup.product_description_group.controls;
    const productAltTextGroup = productGroup.product_alt_text_group.controls;

    // const seoGroup = this.form.controls.seo_group.controls;
    // const seoMetaTitleGroup = seoGroup.seo_title_group.controls;
    // const seoMetaDescrGroup = seoGroup.seo_description_group.controls;
    // const seoMetaKeywordsGroup = seoGroup.seo_keywords_group.controls;

    /* eslint-disable */
    generalArticleGroup.field_main_topic.setValidators(Validators.required);
    generalArticleGroup.field_primary_keywords.setValidators(Validators.required);
    generalArticleGroup.field_seo_rules.setValidators(Validators.required);
    generalArticleGroup.field_characters_limit.setValidators(Validators.required);
    generalArticleGroup.field_power_words.setValidators(Validators.required);
    generalArticleGroup.field_examples.setValidators(Validators.required);

    generalDescriptionGroup.field_main_topic.setValidators(Validators.required);
    generalDescriptionGroup.field_primary_keywords.setValidators(Validators.required);
    generalDescriptionGroup.field_seo_rules.setValidators(Validators.required);
    generalDescriptionGroup.field_characters_limit.setValidators(Validators.required);
    generalDescriptionGroup.field_power_words.setValidators(Validators.required);
    generalDescriptionGroup.field_examples.setValidators(Validators.required);

    generalAltTextGroup.field_main_topic.setValidators(Validators.required);
    generalAltTextGroup.field_primary_keywords.setValidators(Validators.required);
    generalAltTextGroup.field_seo_rules.setValidators(Validators.required);
    generalAltTextGroup.field_characters_limit.setValidators(Validators.required);
    generalAltTextGroup.field_power_words.setValidators(Validators.required);
    generalAltTextGroup.field_examples.setValidators(Validators.required);

    productArticleGroup.field_main_topic.setValidators(Validators.required);
    productArticleGroup.field_primary_keywords.setValidators(Validators.required);
    productArticleGroup.field_seo_rules.setValidators(Validators.required);
    productArticleGroup.field_characters_limit.setValidators(Validators.required);
    productArticleGroup.field_power_words.setValidators(Validators.required);
    productArticleGroup.field_examples.setValidators(Validators.required);

    productDescriptionGroup.field_main_topic.setValidators(Validators.required);
    productDescriptionGroup.field_primary_keywords.setValidators(Validators.required);
    productDescriptionGroup.field_seo_rules.setValidators(Validators.required);
    productDescriptionGroup.field_characters_limit.setValidators(Validators.required);
    productDescriptionGroup.field_power_words.setValidators(Validators.required);
    productDescriptionGroup.field_examples.setValidators(Validators.required);

    productAltTextGroup.field_main_topic.setValidators(Validators.required);
    productAltTextGroup.field_primary_keywords.setValidators(Validators.required);
    productAltTextGroup.field_seo_rules.setValidators(Validators.required);
    productAltTextGroup.field_characters_limit.setValidators(Validators.required);
    productAltTextGroup.field_power_words.setValidators(Validators.required);
    productAltTextGroup.field_examples.setValidators(Validators.required);

    // seoMetaTitleGroup.field_main_topic.setValidators(Validators.required);
    // seoMetaTitleGroup.field_primary_keywords.setValidators(Validators.required);
    // seoMetaTitleGroup.field_seo_rules.setValidators(Validators.required);
    // seoMetaTitleGroup.field_characters_limit.setValidators(Validators.required);
    // seoMetaTitleGroup.field_power_words.setValidators(Validators.required);
    // seoMetaTitleGroup.field_examples.setValidators(Validators.required);
  
    // seoMetaDescrGroup.field_main_topic.setValidators(Validators.required);
    // seoMetaDescrGroup.field_primary_keywords.setValidators(Validators.required);
    // seoMetaDescrGroup.field_seo_rules.setValidators(Validators.required);
    // seoMetaDescrGroup.field_characters_limit.setValidators(Validators.required);
    // seoMetaDescrGroup.field_power_words.setValidators(Validators.required);
    // seoMetaDescrGroup.field_examples.setValidators(Validators.required);

    // seoMetaKeywordsGroup.field_main_topic.setValidators(Validators.required);
    // seoMetaKeywordsGroup.field_primary_keywords.setValidators(Validators.required);
    // seoMetaKeywordsGroup.field_seo_rules.setValidators(Validators.required);
    // seoMetaKeywordsGroup.field_characters_limit.setValidators(Validators.required);
    // seoMetaKeywordsGroup.field_power_words.setValidators(Validators.required);
    // seoMetaKeywordsGroup.field_examples.setValidators(Validators.required);
    /* eslint-enable */

    this.form.updateValueAndValidity();
  }
}
