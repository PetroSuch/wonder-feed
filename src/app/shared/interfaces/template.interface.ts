import { FormControl } from "@angular/forms";

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
}

export interface ITemplateForm {
  template_name: FormControl<null | string>;
  specify_topic: FormControl<null | string>;
  define_purpose: FormControl<null | string>;
  audience: FormControl<null | string>;
  tone_style: FormControl<null | string>;
  status: FormControl<null | string>;
  additional_requirements: FormControl<null | string>;
  seo_requirements: FormControl<null | string>;
  title_main_topic: FormControl<null | string>;
  title_primary_keywords: FormControl<null | string>;
  title_seo_rules: FormControl<null | string>;
  title_characters_limit: FormControl<null | string>;
  title_tone_style: FormControl<null | string>;
  title_power_words: FormControl<null | string>;
  title_examples: FormControl<null | string>;
  description_main_topic: FormControl<null | string>;
  description_primary_keywords: FormControl<null | string>;
  description_seo_rules: FormControl<null | string>;
  description_characters_limit: FormControl<null | string>;
  description_tone_style: FormControl<null | string>;
  description_power_words: FormControl<null | string>;
  description_examples: FormControl<null | string>;
  alt_text_main_topic: FormControl<null | string>;
  alt_text_primary_keywords: FormControl<null | string>;
  alt_text_seo_rules: FormControl<null | string>;
  alt_text_characters_limit: FormControl<null | string>;
  alt_text_tone_style: FormControl<null | string>;
  alt_text_power_words: FormControl<null | string>;
  alt_text_examples: FormControl<null | string>;
}
