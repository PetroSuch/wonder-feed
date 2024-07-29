import { FormControl, FormGroup } from "@angular/forms";

export interface ITemplate {
  id?: number;
  status: string | null;
  template_name: string | null;
  specify_topic: string | null;
  define_purpose: string | null;
  audience: string | null;
  tone_style: string | null;
  additional_requirements: string | null;
  title_main_topic: string | null;
  title_primary_keywords: string | null;
  title_seo_rules: string | null;
  title_characters_limit: string | null;
  title_tone_style: string | null;
  title_power_words: string | null;
  title_examples: string | null;
  description_main_topic: string | null;
  description_primary_keywords: string | null;
  description_seo_rules: string | null;
  description_characters_limit: string | null;
  description_tone_style: string | null;
  description_power_words: string | null;
  description_examples: string | null;
  alt_text_main_topic: string | null;
  alt_text_primary_keywords: string | null;
  alt_text_seo_rules: string | null;
  alt_text_characters_limit: string | null;
  alt_text_tone_style: string | null;
  alt_text_power_words: string | null;
  alt_text_examples: string | null;
  general_main_topic: string | null;
  general_primary_keywords: string | null;
  general_seo_rules: string | null;
  general_characters_limit: string | null;
  general_power_words: string | null;
  general_examples: string | null;
  product_section_main_topic: string | null;
  product_section_primary_keywords: string | null;
  product_section_seo_rules: string | null;
  product_section_characters_limit: string | null;
  product_section_power_words: string | null;
  product_section_examples: string | null;
  seo_main_topic: string | null;
  seo_primary_keywords: string | null;
  seo_seo_rules: string | null;
  seo_characters_limit: string | null;
  seo_power_words: string | null;
  seo_examples: string | null;
  social_media_main_topic: string | null;
  social_media_primary_keywords: string | null;
  social_media_seo_rules: string | null;
  social_media_characters_limit: string | null;
  social_media_power_words: string | null;
  social_media_examples: string | null;
}

export interface INewTemplateForm {
  template_name: FormControl<null | string>;
  status: FormControl<null | string>;
  define_purpose: FormControl<null | string>;
  audience: FormControl<null | string>;
  tone_style: FormControl<null | string>;
  additional_requirements: FormControl<null | string>;
  // groups
  title_group: FormGroup<ITemplateGroup>;
  description_group: FormGroup<ITemplateGroup>;
  alt_text_group: FormGroup<ITemplateGroup>;
  general_group: FormGroup<ITemplateGroup>;
  product_section_group: FormGroup<ITemplateGroup>;
  social_media_group: FormGroup<ITemplateGroup>;
  seo_group: FormGroup<ITemplateGroup>;
}

export interface ITemplateGroup {
  field_main_topic: FormControl<null | string>;
  field_primary_keywords: FormControl<null | string>;
  field_seo_rules: FormControl<null | string>;
  field_characters_limit: FormControl<null | string>;
  field_power_words: FormControl<null | string>;
  field_examples: FormControl<null | string>;
}
