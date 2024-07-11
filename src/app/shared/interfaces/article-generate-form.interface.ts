import { FormControl } from "@angular/forms";

export interface ICreateArticleForm {
  article_title1: FormControl<null | string>;
  product_title1: FormControl<null | string>;
  product_title2: FormControl<null | string>;
  product_title3: FormControl<null | string>;
}

export interface IGenerateResultForm {
  article_title1: FormControl<null | string>;
  article_title2: FormControl<null | string>;
  article_title3: FormControl<null | string>;
  alt_text: FormControl<null | string>;
  article_description: FormControl<null | string>;
}