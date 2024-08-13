import { FormControl, FormGroup } from "@angular/forms";

export interface ITemplate {
  id?: number;
  status: string | null;
  template_name: string | null;
  define_purpose: string | null;
  audience: string | null;
  tone_style: string | null;
  additional_requirements: string | null;
  general_alt_text_field_characters_limit: string | null;
  general_alt_text_field_examples: string | null;
  general_alt_text_field_main_topic: string | null;
  general_alt_text_field_power_words: string | null;
  general_alt_text_field_primary_keywords: string | null;
  general_alt_text_field_seo_rules: string | null;
  general_article_field_characters_limit: string | null;
  general_article_field_examples: string | null;
  general_article_field_main_topic: string | null;
  general_article_field_power_words: string | null;
  general_article_field_primary_keywords: string | null;
  general_article_field_seo_rules: string | null;
  general_description_field_characters_limit: string | null;
  general_description_field_examples: string | null;
  general_description_field_main_topic: string | null;
  general_description_field_power_words: string | null;
  general_description_field_primary_keywords: string | null;
  general_description_field_seo_rules: string | null;
  product_alt_text_field_characters_limit: string | null;
  product_alt_text_field_examples: string | null;
  product_alt_text_field_main_topic: string | null;
  product_alt_text_field_power_words: string | null;
  product_alt_text_field_primary_keywords: string | null;
  product_alt_text_field_seo_rules: string | null;
  product_article_field_characters_limit: string | null;
  product_article_field_examples: string | null;
  product_article_field_main_topic: string | null;
  product_article_field_power_words: string | null;
  product_article_field_primary_keywords: string | null;
  product_article_field_seo_rules: string | null;
  product_description_field_characters_limit: string | null;
  product_description_field_examples: string | null;
  product_description_field_main_topic: string | null;
  product_description_field_power_words: string | null;
  product_description_field_primary_keywords: string | null;
  product_description_field_seo_rules: string | null;
  seo_keywords_field_characters_limit: string | null;
  seo_keywords_field_examples: string | null;
  seo_keywords_field_main_topic: string | null;
  seo_keywords_field_power_words: string | null;
  seo_keywords_field_primary_keywords: string | null;
  seo_keywords_field_seo_rules: string | null;
  seo_title_field_characters_limit: string | null;
  seo_title_field_examples: string | null;
  seo_title_field_main_topic: string | null;
  seo_title_field_power_words: string | null;
  seo_title_field_primary_keywords: string | null;
  seo_title_field_seo_rules: string | null;
  seo_description_field_characters_limit: string | null;
  seo_description_field_examples: string | null;
  seo_description_field_main_topic: string | null;
  seo_description_field_power_words: string | null;
  seo_description_field_primary_keywords: string | null;
  seo_description_field_seo_rules: string | null;
}

export interface IGeneralGroup {
  general_article_group: ITemplateGroupValue;
  general_description_group: ITemplateGroupValue;
  general_alt_text_group: ITemplateGroupValue;
}

export interface IProductGroup {
  product_article_group: ITemplateGroupValue;
  product_description_group: ITemplateGroupValue;
  product_alt_text_group: ITemplateGroupValue;
}

export interface ISeoGroup {
  seo_title_group: ITemplateGroupValue;
  seo_description_group: ITemplateGroupValue;
  seo_keywords_group: ITemplateGroupValue;
}

export interface ITemplateGroupValue {
  field_main_topic: string | null;
  field_primary_keywords: string | null;
  field_seo_rules: string | null;
  field_characters_limit: string | null;
  field_power_words: string | null;
  field_examples: string | null;
}
export interface INewTemplateForm {
  template_name: FormControl<null | string>;
  status: FormControl<null | string>;
  define_purpose: FormControl<null | string>;
  audience: FormControl<null | string>;
  tone_style: FormControl<null | string>;
  additional_requirements: FormControl<null | string>;
  general_group: FormGroup<IGeneralFormGroup>;
  product_group: FormGroup<IProductFormGroup>;
  seo_group: FormGroup<ISeoFormGroup>;
}

export interface IGeneralFormGroup {
  general_article_group: FormGroup<ITemplateGroup>;
  general_description_group: FormGroup<ITemplateGroup>;
  general_alt_text_group: FormGroup<ITemplateGroup>;
}

export interface IProductFormGroup {
  product_article_group: FormGroup<ITemplateGroup>;
  product_description_group: FormGroup<ITemplateGroup>;
  product_alt_text_group: FormGroup<ITemplateGroup>;
}

export interface ISeoFormGroup {
  seo_title_group: FormGroup<ITemplateGroup>;
  seo_description_group: FormGroup<ITemplateGroup>;
  seo_keywords_group: FormGroup<ITemplateGroup>;
}

export interface ITemplateGroup {
  field_main_topic: FormControl<null | string>;
  field_primary_keywords: FormControl<null | string>;
  field_seo_rules: FormControl<null | string>;
  field_characters_limit: FormControl<null | string>;
  field_power_words: FormControl<null | string>;
  field_examples: FormControl<null | string>;
}
