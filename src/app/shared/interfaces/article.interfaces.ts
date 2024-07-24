import { FormArray, FormControl, FormGroup } from "@angular/forms";

export interface IArticle {
  id: number;
  article_title1: string;
  article_title2: string;
  article_title3: string;
  alt_text: string;
  article_description: string;
  author: string;
  category_id: number;
  publication_date: string;
  last_edited: string;
  status: string;
  article_metadata: {
    article: string;
    product_titles: string[];
    template_id: number;
    seo_keywords: string;
  };
  products_list: IGenerateProduct[];
  seo: IGenerateSEO;
}

export interface ICreateArticle {
  article_title1: string;
  article_title2: string;
  article_title3: string;
  alt_text: string;
  article_description: string;
  status: string;
  seo_keywords: string;
  products_list: IGenerateProduct[];
  seo: IGenerateSEO;
  // metadata
  article: string;
  category_id: number;
  template_id: number;
  product_titles: string[];
}

export interface IGenerateArticleForm {
  template_id: FormControl<null | number>;
  category_id: FormControl<null | number>;
  status: FormControl<null | string>;
  article: FormControl<null | string>;
  product_titles: FormArray<FormControl<null | string>>;
  seo_keywords: FormControl<null | string>;
}

export interface IGenerateResultForm {
  article_title1: FormControl<null | string>;
  article_title2: FormControl<null | string>;
  article_title3: FormControl<null | string>;
  alt_text: FormControl<null | string>;
  article_description: FormControl<null | string>;
  products: FormArray<FormGroup<IProductItemForm>>;
  seo_title: FormControl<null | string>;
  seo_description: FormControl<null | string>;
  seo_keywords: FormControl<null | string>;
}

export interface IProductItemForm {
  title: FormControl<null | string>;
  description: FormControl<null | string>;
  alt_text: FormControl<null | string>;
}

export interface IGenerateArticle {
  template_id: number;
  category_id: number;
  article_title1: string;
  product_titles: string[];
  seo_keywords: string;
}

export interface IGenerateArticleResponse {
  seo: IGenerateSEO;
  general: IGenerateGeneral;
  products_list: IGenerateProduct[];
}

export interface IGenerateGeneral {
  alt_text: string;
  article_description: string;
  title1: string;
  title2: string;
  title3: string;
}

export interface IGenerateProduct {
  alt_text: string;
  description: string;
  title: string;
}

export interface IGenerateSEO {
  title: string;
  keywords: string;
  description: string;
}

export interface IRegenerateTitle {
  template_id: number;
  article_title1: string;
  product_titles: string[];
  title_regenerate: string;
  seo_keywords: string;
}

export interface IRegenerateTitleResponse {
  newtitle: string;
}
