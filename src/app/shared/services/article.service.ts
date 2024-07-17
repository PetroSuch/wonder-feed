import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import {
  IArticle,
  ICreateArticle,
  IGenerateArticleResponse,
  IRegenerateTitle,
  IRegenerateTitleResponse,
  IUpdateArticle,
} from "../interfaces/article.interfaces";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class ArticleService extends HttpService {
  public generateArticle(data: ICreateArticle) {
    return this.post<ICreateArticle, IGenerateArticleResponse>(
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

  public getArticle(article_id: number): Observable<IArticle> {
    return this.get<IArticle>("articles/" + article_id);
  }

  public updateArticle(
    article_id: number,
    data: IUpdateArticle,
  ): Observable<void> {
    return this.put<IUpdateArticle, void>("articles/" + article_id, data);
  }

  public deleteArticle(article_id: number): Observable<void> {
    return this.delete<void>("articles/" + article_id);
  }

  public createArticle(data: any) {
    return this.post("articles", data);
  }
}
