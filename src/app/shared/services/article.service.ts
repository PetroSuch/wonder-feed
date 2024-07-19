import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import {
  IArticle,
  ICreateArticle,
  IGenerateArticle,
  IGenerateArticleResponse,
  IRegenerateTitle,
  IRegenerateTitleResponse,
} from "../interfaces/article.interfaces";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class ArticleService extends HttpService {
  public generateArticle(data: IGenerateArticle) {
    return this.post<IGenerateArticle, IGenerateArticleResponse>(
      "generate",
      data,
    );
  }

  public regenerateTitle(data: IRegenerateTitle) {
    return this.post<IRegenerateTitle, IRegenerateTitleResponse>(
      "regenerate_title",
      data,
    );
  }

  public getArticles(): Observable<IArticle[]> {
    return this.get<IArticle[]>("articles");
  }

  public getArticlesByCategoryId(categoryId: number): Observable<IArticle[]> {
    return this.get<IArticle[]>("articles/category/" + categoryId);
  }

  public getArticle(article_id: number): Observable<IArticle> {
    return this.get<IArticle>("articles/" + article_id);
  }

  public updateArticle(
    article_id: number,
    data: ICreateArticle,
  ): Observable<void> {
    return this.put<ICreateArticle, void>("articles/" + article_id, data);
  }

  public deleteArticle(article_id: number): Observable<void> {
    return this.delete<void>("articles/" + article_id);
  }

  public createArticle(data: ICreateArticle) {
    return this.post("articles", data);
  }
}
