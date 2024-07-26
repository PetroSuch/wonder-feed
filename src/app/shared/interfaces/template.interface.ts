import { FormControl, FormGroup } from "@angular/forms";

export interface ITemplate {
  id: number;
  status: string;
  created_date: string;
  updated_date: string;
  template_name: string;
  specify_topic: string;
  define_purpose: string;
  audience: string;
  tone_style: string;
  additional_requirements: string;
  seo_requirements: string;
  title_main_topic: string;
  title_primary_keywords: string;
  title_seo_rules: string;
  title_characters_limit: string;
  title_tone_style: string;
  title_power_words: string;
  title_examples: string;
  description_main_topic: string;
  description_primary_keywords: string;
  description_seo_rules: string;
  description_characters_limit: string;
  description_tone_style: string;
  description_power_words: string;
  description_examples: string;
  alt_text_main_topic: string;
  alt_text_primary_keywords: string;
  alt_text_seo_rules: string;
  alt_text_characters_limit: string;
  alt_text_tone_style: string;
  alt_text_power_words: string;
  alt_text_examples: string;
  general_main_topic: string;
  general_primary_keywords: string;
  general_seo_rules: string;
  general_characters_limit: string;
  general_tone_style: string;
  general_power_words: string;
  general_examples: string;
  product_section_main_topic: string;
  product_section_primary_keywords: string;
  product_section_seo_rules: string;
  product_section_characters_limit: string;
  product_section_tone_style: string;
  product_section_power_words: string;
  product_section_examples: string;
  social_media_main_topic: string;
  social_media_primary_keywords: string;
  social_media_seo_rules: string;
  social_media_characters_limit: string;
  social_media_tone_style: string;
  social_media_power_words: string;
  social_media_examples: string;
  seo_main_topic: string;
  seo_primary_keywords: string;
  seo_seo_rules: string;
  seo_characters_limit: string;
  seo_tone_style: string;
  seo_power_words: string;
  seo_examples: string;
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
