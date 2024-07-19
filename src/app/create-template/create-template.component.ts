import { Component } from "@angular/core";
import {
  NgbAccordionModule,
  NgbDropdownModule,
} from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";
import {
  ITemplate,
  ITemplateForm,
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
import { ActivatedRoute } from "@angular/router";
import { DashboardService } from "../shared/services/dashboard.service";

@Component({
  selector: "app-create-template",
  standalone: true,
  imports: [
    CommonModule,
    NgbAccordionModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    LoadingComponent,
  ],
  templateUrl: "./create-template.component.html",
  styleUrl: "./create-template.component.scss",
})
export class CreateTemplateComponent {
  public form: FormGroup<ITemplateForm> | null = null;
  public isSaving: boolean = false;
  public showErrors: boolean = false;
  public activeTab: number = 1;
  private templateId: number | null = null;
  private templateData: ITemplate | null = null;

  public get navLabel() {
    return this.templateId
      ? this.templateData?.template_name
      : "Create Template";
  }

  public get isValidTitleTab() {
    const controls = this.form?.controls;
    if (!controls) return false;
    return [
      controls.title_main_topic,
      controls.title_primary_keywords,
      controls.title_seo_rules,
      controls.title_characters_limit,
      controls.title_tone_style,
      controls.title_power_words,
      controls.title_examples,
    ].every((c) => c.valid);
  }

  public get isValidDescriptionTab() {
    const controls = this.form?.controls;
    if (!controls) return false;
    return [
      controls.description_main_topic,
      controls.description_primary_keywords,
      controls.description_seo_rules,
      controls.description_characters_limit,
      controls.description_tone_style,
      controls.description_power_words,
      controls.description_examples,
    ].every((c) => c.valid);
  }

  public get isValidAltTextTab() {
    const controls = this.form?.controls;
    if (!controls) return false;
    return [
      controls.alt_text_main_topic,
      controls.alt_text_primary_keywords,
      controls.alt_text_seo_rules,
      controls.alt_text_characters_limit,
      controls.alt_text_tone_style,
      controls.alt_text_power_words,
      controls.alt_text_examples,
    ].every((c) => c.valid);
  }

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    private templateService: TemplateService,
    private dashboardService: DashboardService,
  ) {
    this.initForm();
    this.initValidation();

    if (this.route.snapshot.params["templateId"]) {
      this.templateId = +this.route.snapshot.params["templateId"];
      this.templateService
        .getTemplate(this.templateId)
        .pipe(
          filter(() => !!this.form),
          tap((data) => (this.templateData = data)),
          tap((data) => this.form!.patchValue({ ...data })),
        )
        .subscribe();
    }
  }

  public onSaveTemplate() {
    if (!this.form || !this.form.valid) {
      this.alertService.error("Please fill in all required fields!");
      this.showErrors = true;
      return;
    }

    this.isSaving = true;
    let api$;
    if (this.templateId) {
      api$ = this.templateService.updateTemplate(
        this.templateId,
        this.form.value as ITemplate,
      );
    } else {
      api$ = this.templateService.createTemplate(this.form.value as ITemplate);
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

  private initForm() {
    this.form = new FormGroup<ITemplateForm>({
      status: new FormControl(null),
      template_name: new FormControl(null),
      specify_topic: new FormControl(null),
      define_purpose: new FormControl(null),
      audience: new FormControl(null),
      tone_style: new FormControl(null),
      additional_requirements: new FormControl(null),
      seo_requirements: new FormControl(null),
      title_main_topic: new FormControl(null),
      title_primary_keywords: new FormControl(null),
      title_seo_rules: new FormControl(null),
      title_characters_limit: new FormControl(null),
      title_tone_style: new FormControl(null),
      title_power_words: new FormControl(null),
      title_examples: new FormControl(null),
      description_main_topic: new FormControl(null),
      description_primary_keywords: new FormControl(null),
      description_seo_rules: new FormControl(null),
      description_characters_limit: new FormControl(null),
      description_tone_style: new FormControl(null),
      description_power_words: new FormControl(null),
      description_examples: new FormControl(null),
      alt_text_main_topic: new FormControl(null),
      alt_text_primary_keywords: new FormControl(null),
      alt_text_seo_rules: new FormControl(null),
      alt_text_characters_limit: new FormControl(null),
      alt_text_tone_style: new FormControl(null),
      alt_text_power_words: new FormControl(null),
      alt_text_examples: new FormControl(null),
    });
  }

  private initValidation() {
    if (!this.form) return;

    const controls = this.form.controls;
    controls.template_name.setValidators([Validators.required]);
    controls.specify_topic.setValidators([Validators.required]);
    controls.define_purpose.setValidators([Validators.required]);
    controls.audience.setValidators([Validators.required]);
    controls.tone_style.setValidators([Validators.required]);
    controls.additional_requirements.setValidators([Validators.required]);
    controls.seo_requirements.setValidators([Validators.required]);
    controls.title_main_topic.setValidators([Validators.required]);
    controls.title_primary_keywords.setValidators([Validators.required]);
    controls.title_seo_rules.setValidators([Validators.required]);
    controls.title_characters_limit.setValidators([Validators.required]);
    controls.title_tone_style.setValidators([Validators.required]);
    controls.title_power_words.setValidators([Validators.required]);
    controls.title_examples.setValidators([Validators.required]);
    controls.description_main_topic.setValidators([Validators.required]);
    controls.description_primary_keywords.setValidators([Validators.required]);
    controls.description_seo_rules.setValidators([Validators.required]);
    controls.description_characters_limit.setValidators([Validators.required]);
    controls.description_tone_style.setValidators([Validators.required]);
    controls.description_power_words.setValidators([Validators.required]);
    controls.description_examples.setValidators([Validators.required]);
    controls.alt_text_main_topic.setValidators([Validators.required]);
    controls.alt_text_primary_keywords.setValidators([Validators.required]);
    controls.alt_text_seo_rules.setValidators([Validators.required]);
    controls.alt_text_characters_limit.setValidators([Validators.required]);
    controls.alt_text_tone_style.setValidators([Validators.required]);
    controls.alt_text_power_words.setValidators([Validators.required]);
    controls.alt_text_examples.setValidators([Validators.required]);
  }
}
