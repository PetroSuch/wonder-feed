import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environment/environment";
import { Observable } from "rxjs";
import {
  IGenerateArticle,
  IGenerateArticleResponse,
  IRegenerateTitle,
  IRegenerateTitleResponse,
} from "../interfaces/api.interfaces";

@Injectable({ providedIn: "root" })
export class ApiService {
  constructor(private http: HttpClient) {}

  public get(endpoint: string) {
    const url = environment.API_BASE_URL + endpoint;
    return this.http.get(url);
  }

  public post<T_Payload, T_Response>(
    endpoint: string,
    data: T_Payload,
  ): Observable<T_Response> {
    const url = environment.API_BASE_URL + endpoint;
    return this.http.post<T_Response>(url, data);
  }

  public generateArticle(data: IGenerateArticle) {
    return this.post<IGenerateArticle, IGenerateArticleResponse>(
      "generate",
      data,
    );
  }

  public regenerateTitle(data: IRegenerateTitle) {
    return this.post<IGenerateArticle, IRegenerateTitleResponse>(
      "regenerate_title",
      data,
    );
  }
}
