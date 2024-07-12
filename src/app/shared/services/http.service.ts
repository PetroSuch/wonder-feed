import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environment/environment";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class HttpService {
  public readonly http: HttpClient = inject(HttpClient);

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
}
