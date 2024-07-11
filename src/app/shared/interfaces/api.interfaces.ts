export interface IGenerateArticle {
  article_title1: string;
  product_title1: string;
  product_title2: string;
  product_title3: string;
}

export interface IGenerateArticleResponse {
  title1: string;
  title2: string;
  title3: string;
  alt_text: string;
  article_description: string;
}

export interface IRegenerateTitle {
  article_title1: string;
  product_title1: string;
  product_title2: string;
  product_title3: string;
  title_regenerate: string;
}

export interface IRegenerateTitleResponse {
  newtitle: string;
}
