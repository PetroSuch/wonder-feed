import { Component, DestroyRef, inject } from "@angular/core";
import {
  NgbAccordionModule,
  NgbDropdownModule,
} from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";
import {
  INewTemplateForm,
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
        return "Article Title";
      case 2:
        return "Description";
      case 3:
        return "Alt Text";
      case 4:
        return "General Section";
      case 5:
        return "Product Section";
      case 6:
        return "Social Media";
      case 7:
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
    this.initValidation();

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

  public isValidTab(formGroup: FormGroup<ITemplateGroup>) {
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
    this.activeTab = tab;
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: "merge",
    });
  }

  public onSaveTemplate() {
    if (!this.form || !this.form.valid) {
      this.displayInvalidTabs();
      this.showErrors = true;
      return;
    }

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
    const {
      general_group,
      alt_text_group,
      title_group,
      product_section_group,
      description_group,
      social_media_group,
      seo_group,
    } = formValue;

    return {
      status: formValue.status!,
      template_name: formValue.template_name!,
      specify_topic: title_group!.field_main_topic!,
      define_purpose: formValue.define_purpose!,
      audience: formValue.audience!,
      tone_style: formValue.tone_style!,
      additional_requirements: formValue.additional_requirements!,
      title_main_topic: title_group!.field_main_topic!,
      title_primary_keywords: title_group!.field_primary_keywords!,
      title_seo_rules: title_group!.field_seo_rules!,
      title_characters_limit: title_group!.field_characters_limit!,
      title_tone_style: title_group!.field_power_words!,
      title_power_words: title_group!.field_power_words!,
      title_examples: title_group!.field_examples!,
      description_main_topic: description_group!.field_main_topic!,
      description_primary_keywords: description_group!.field_primary_keywords!,
      description_seo_rules: description_group!.field_seo_rules!,
      description_characters_limit: description_group!.field_characters_limit!,
      description_tone_style: description_group!.field_power_words!,
      description_power_words: description_group!.field_power_words!,
      description_examples: description_group!.field_examples!,
      alt_text_main_topic: alt_text_group!.field_main_topic!,
      alt_text_primary_keywords: alt_text_group!.field_primary_keywords!,
      alt_text_seo_rules: alt_text_group!.field_seo_rules!,
      alt_text_characters_limit: alt_text_group!.field_characters_limit!,
      alt_text_tone_style: alt_text_group!.field_power_words!,
      alt_text_power_words: alt_text_group!.field_power_words!,
      alt_text_examples: alt_text_group!.field_examples!,
      general_main_topic: general_group!.field_main_topic!,
      general_primary_keywords: general_group!.field_primary_keywords!,
      general_seo_rules: general_group!.field_seo_rules!,
      general_characters_limit: general_group!.field_characters_limit!,
      general_power_words: general_group!.field_power_words!,
      general_examples: general_group!.field_examples!,
      product_section_main_topic: product_section_group!.field_main_topic!,
      product_section_primary_keywords:
        product_section_group!.field_primary_keywords!,
      product_section_seo_rules: product_section_group!.field_seo_rules!,
      product_section_characters_limit:
        product_section_group!.field_characters_limit!,
      product_section_power_words: product_section_group!.field_power_words!,
      product_section_examples: product_section_group!.field_examples!,
      social_media_main_topic: social_media_group!.field_main_topic!,
      social_media_primary_keywords:
        social_media_group!.field_primary_keywords!,
      social_media_seo_rules: social_media_group!.field_seo_rules!,
      social_media_characters_limit:
        social_media_group!.field_characters_limit!,
      social_media_power_words: social_media_group!.field_power_words!,
      social_media_examples: social_media_group!.field_examples!,
      seo_main_topic: seo_group!.field_main_topic!,
      seo_primary_keywords: seo_group!.field_primary_keywords!,
      seo_seo_rules: seo_group!.field_seo_rules!,
      seo_characters_limit: seo_group!.field_characters_limit!,
      seo_power_words: seo_group!.field_power_words!,
      seo_examples: seo_group!.field_examples!,
    };
  }

  private displayInvalidTabs() {
    if (!this.form) return;
    const invalidTabs = [];
    const {
      title_group,
      description_group,
      alt_text_group,
      general_group,
      product_section_group,
      seo_group,
    } = this.form.controls;
    if (!this.isValidTab(title_group)) {
      invalidTabs.push("Article Title");
    }
    if (!this.isValidTab(description_group)) {
      invalidTabs.push("Description");
    }
    if (!this.isValidTab(alt_text_group)) {
      invalidTabs.push("Alt Text");
    }
    if (!this.isValidTab(general_group)) {
      invalidTabs.push("General Section");
    }
    if (!this.isValidTab(product_section_group)) {
      invalidTabs.push("Product Section");
    }
    // if (!this.isValidTab(social_media_group as FormGroup<ITemplateGroup>)) {
    //   invalidTabs.push("Social Media");
    // }
    if (!this.isValidTab(seo_group)) {
      invalidTabs.push("SEO Section");
    }

    if (invalidTabs.length) {
      const msg = `Please fill in all required fields in the following tabs: ${invalidTabs.join(
        ", ",
      )}`;
      this.alertService.error(msg, { duration: 10000 });
    }
  }

  private patchForm(data: ITemplate) {
    this.form?.patchValue(data);

    const altTextGroup = this.form?.controls
      .alt_text_group as FormGroup<ITemplateGroup>;
    altTextGroup.patchValue({
      field_characters_limit: data.alt_text_characters_limit,
      field_main_topic: data.alt_text_main_topic,
      field_power_words: data.alt_text_power_words,
      field_primary_keywords: data.alt_text_primary_keywords,
      field_seo_rules: data.alt_text_seo_rules,
      field_examples: data.alt_text_examples,
    });

    const descriptionGroup = this.form?.controls
      .description_group as FormGroup<ITemplateGroup>;
    descriptionGroup.patchValue({
      field_characters_limit: data.description_characters_limit,
      field_main_topic: data.description_main_topic,
      field_power_words: data.description_power_words,
      field_primary_keywords: data.description_primary_keywords,
      field_seo_rules: data.description_seo_rules,
      field_examples: data.description_examples,
    });

    const generalGroup = this.form?.controls
      .general_group as FormGroup<ITemplateGroup>;
    generalGroup.patchValue({
      field_characters_limit: data.description_characters_limit,
      field_main_topic: data.description_main_topic,
      field_power_words: data.description_power_words,
      field_primary_keywords: data.description_primary_keywords,
      field_seo_rules: data.description_seo_rules,
      field_examples: data.description_examples,
    });

    const productSectionGroup = this.form?.controls
      .product_section_group as FormGroup<ITemplateGroup>;
    productSectionGroup.patchValue({
      field_characters_limit: data.product_section_characters_limit,
      field_main_topic: data.product_section_main_topic,
      field_power_words: data.product_section_power_words,
      field_primary_keywords: data.product_section_primary_keywords,
      field_seo_rules: data.product_section_seo_rules,
      field_examples: data.product_section_examples,
    });

    const seoGroup = this.form?.controls.seo_group as FormGroup<ITemplateGroup>;
    seoGroup.patchValue({
      field_characters_limit: data.seo_characters_limit,
      field_main_topic: data.seo_main_topic,
      field_power_words: data.seo_power_words,
      field_primary_keywords: data.seo_primary_keywords,
      field_seo_rules: data.seo_seo_rules,
      field_examples: data.seo_examples,
    });

    const socialMediaGroup = this.form?.controls
      .social_media_group as FormGroup<ITemplateGroup>;
    socialMediaGroup.patchValue({
      field_characters_limit: data.social_media_characters_limit,
      field_main_topic: data.social_media_main_topic,
      field_power_words: data.social_media_power_words,
      field_primary_keywords: data.social_media_primary_keywords,
      field_seo_rules: data.social_media_seo_rules,
      field_examples: data.social_media_examples,
    });

    const titleGroup = this.form?.controls
      .title_group as FormGroup<ITemplateGroup>;
    titleGroup.patchValue({
      field_characters_limit: data.title_characters_limit,
      field_main_topic: data.title_main_topic,
      field_power_words: data.title_power_words,
      field_primary_keywords: data.title_primary_keywords,
      field_seo_rules: data.title_seo_rules,
      field_examples: data.title_examples,
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
      alt_text_group: new FormGroup<ITemplateGroup>({
        field_characters_limit: new FormControl(null),
        field_main_topic: new FormControl(null),
        field_power_words: new FormControl(null),
        field_primary_keywords: new FormControl(null),
        field_seo_rules: new FormControl(null),
        field_examples: new FormControl(null),
      }),
      description_group: new FormGroup<ITemplateGroup>({
        field_characters_limit: new FormControl(null),
        field_main_topic: new FormControl(null),
        field_power_words: new FormControl(null),
        field_primary_keywords: new FormControl(null),
        field_seo_rules: new FormControl(null),
        field_examples: new FormControl(null),
      }),
      general_group: new FormGroup<ITemplateGroup>({
        field_characters_limit: new FormControl(null),
        field_main_topic: new FormControl(null),
        field_power_words: new FormControl(null),
        field_primary_keywords: new FormControl(null),
        field_seo_rules: new FormControl(null),
        field_examples: new FormControl(null),
      }),
      product_section_group: new FormGroup<ITemplateGroup>({
        field_characters_limit: new FormControl(null),
        field_main_topic: new FormControl(null),
        field_power_words: new FormControl(null),
        field_primary_keywords: new FormControl(null),
        field_seo_rules: new FormControl(null),
        field_examples: new FormControl(null),
      }),
      seo_group: new FormGroup<ITemplateGroup>({
        field_characters_limit: new FormControl(null),
        field_main_topic: new FormControl(null),
        field_power_words: new FormControl(null),
        field_primary_keywords: new FormControl(null),
        field_seo_rules: new FormControl(null),
        field_examples: new FormControl(null),
      }),
      social_media_group: new FormGroup<ITemplateGroup>({
        field_characters_limit: new FormControl(null),
        field_main_topic: new FormControl(null),
        field_power_words: new FormControl(null),
        field_primary_keywords: new FormControl(null),
        field_seo_rules: new FormControl(null),
        field_examples: new FormControl(null),
      }),
      title_group: new FormGroup<ITemplateGroup>({
        field_characters_limit: new FormControl(null),
        field_main_topic: new FormControl(null),
        field_power_words: new FormControl(null),
        field_primary_keywords: new FormControl(null),
        field_seo_rules: new FormControl(null),
        field_examples: new FormControl(null),
      }),
    });

    this.form.valueChanges.subscribe(() => {
      console.log(this.form?.value);
    });
  }

  private initValidation() {
    if (!this.form) return;

    const titleGroup = this.form.controls.title_group.controls;
    titleGroup.field_main_topic.setValidators(Validators.required);
    titleGroup.field_primary_keywords.setValidators(Validators.required);
    titleGroup.field_seo_rules.setValidators(Validators.required);
    titleGroup.field_characters_limit.setValidators(Validators.required);
    titleGroup.field_power_words.setValidators(Validators.required);
    titleGroup.field_examples.setValidators(Validators.required);

    const descriptionGroup = this.form.controls.description_group.controls;
    descriptionGroup.field_main_topic.setValidators(Validators.required);
    descriptionGroup.field_primary_keywords.setValidators(Validators.required);
    descriptionGroup.field_seo_rules.setValidators(Validators.required);
    descriptionGroup.field_characters_limit.setValidators(Validators.required);
    descriptionGroup.field_power_words.setValidators(Validators.required);
    descriptionGroup.field_examples.setValidators(Validators.required);

    const altTextGroup = this.form.controls.alt_text_group.controls;
    altTextGroup.field_main_topic.setValidators(Validators.required);
    altTextGroup.field_primary_keywords.setValidators(Validators.required);
    altTextGroup.field_seo_rules.setValidators(Validators.required);
    altTextGroup.field_characters_limit.setValidators(Validators.required);
    altTextGroup.field_power_words.setValidators(Validators.required);
    altTextGroup.field_examples.setValidators(Validators.required);

    const generalGroup = this.form.controls.general_group.controls;
    generalGroup.field_main_topic.setValidators(Validators.required);
    generalGroup.field_primary_keywords.setValidators(Validators.required);
    generalGroup.field_seo_rules.setValidators(Validators.required);
    generalGroup.field_characters_limit.setValidators(Validators.required);
    generalGroup.field_power_words.setValidators(Validators.required);
    generalGroup.field_examples.setValidators(Validators.required);

    const productSection = this.form.controls.product_section_group.controls;
    productSection.field_main_topic.setValidators(Validators.required);
    productSection.field_primary_keywords.setValidators(Validators.required);
    productSection.field_seo_rules.setValidators(Validators.required);
    productSection.field_characters_limit.setValidators(Validators.required);
    productSection.field_power_words.setValidators(Validators.required);
    productSection.field_examples.setValidators(Validators.required);

    const socialMediaGroup = this.form.controls.social_media_group.controls;
    socialMediaGroup.field_main_topic.setValidators(Validators.required);
    socialMediaGroup.field_primary_keywords.setValidators(Validators.required);
    socialMediaGroup.field_seo_rules.setValidators(Validators.required);
    socialMediaGroup.field_characters_limit.setValidators(Validators.required);
    socialMediaGroup.field_power_words.setValidators(Validators.required);
    socialMediaGroup.field_examples.setValidators(Validators.required);

    const seoGroup = this.form.controls.seo_group.controls;
    seoGroup.field_main_topic.setValidators(Validators.required);
    seoGroup.field_primary_keywords.setValidators(Validators.required);
    seoGroup.field_seo_rules.setValidators(Validators.required);
    seoGroup.field_characters_limit.setValidators(Validators.required);
    seoGroup.field_power_words.setValidators(Validators.required);
    seoGroup.field_examples.setValidators(Validators.required);

    this.form.updateValueAndValidity();
  }
}
