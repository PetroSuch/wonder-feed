import { FormControl } from "@angular/forms";

export interface IArticle {
  id: number;
  category_id: number;
  article_title1: string;
  article_title2: string;
  article_title3: string;
  alt_text: string;
  article_description: string;
  status: string;
  publication_date: string;
  last_edited: string;
}

export interface ICreateArticleForm {
  template_id: FormControl<null | number>;
  category_id: FormControl<null | number>;
  article: FormControl<null | string>;
  title1: FormControl<null | string>;
  title2: FormControl<null | string>;
  title3: FormControl<null | string>;
}

export interface IGenerateResultForm {
  article_title1: FormControl<null | string>;
  article_title2: FormControl<null | string>;
  article_title3: FormControl<null | string>;
  alt_text: FormControl<null | string>;
  article_description: FormControl<null | string>;
}

export interface ICreateArticle {
  template_id: number;
  category_id: number;
  article_title1: string;
  product_title1: string;
  product_title2: string;
  product_title3: string;
}

export interface IUpdateArticle extends ICreateArticle {
  id: number;
}

export interface IGenerateArticleResponse {
  title1: string;
  title2: string;
  title3: string;
  alt_text: string;
  article_description: string;
}

export interface IRegenerateTitle {
  template_id: number;
  article_title1: string;
  product_title1: string;
  product_title2: string;
  product_title3: string;
  title_regenerate: string;
}

export interface IRegenerateTitleResponse {
  newtitle: string;
}
