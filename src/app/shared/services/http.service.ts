import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environment/environment";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class HttpService {
  public readonly http: HttpClient = inject(HttpClient);

  public get<T_Response>(endpoint: string) {
    const url = environment.API_BASE_URL + endpoint;
    return this.http.get<T_Response>(url);
  }

  public delete<T_Response>(endpoint: string) {
    const url = environment.API_BASE_URL + endpoint;
    return this.http.delete<T_Response>(url);
  }

  public put<T_Payload, T_Response>(
    endpoint: string,
    data: T_Payload,
  ): Observable<T_Response> {
    const url = environment.API_BASE_URL + endpoint;
    return this.http.put<T_Response>(url, data);
  }

  public post<T_Payload, T_Response>(
    endpoint: string,
    data: T_Payload,
  ): Observable<T_Response> {
    const url = environment.API_BASE_URL + endpoint;
    return this.http.post<T_Response>(url, data);
  }
}
