import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { ITemplate } from "../interfaces/template.interface";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class TemplateService extends HttpService {
  public createTemplate(data: ITemplate): Observable<void> {
    return this.post<ITemplate, void>("templates", data);
  }

  public getTemplates(): Observable<ITemplate[]> {
    return this.get<ITemplate[]>("templates");
  }

  public getTemplate(template_id: number): Observable<ITemplate> {
    return this.get<ITemplate>("templates/" + template_id);
  }

  public updateTemplate(
    template_id: number,
    data: ITemplate,
  ): Observable<void> {
    return this.put<ITemplate, void>("templates/" + template_id, data);
  }

  public deleteTemplate(template_id: number): Observable<void> {
    return this.delete<void>("templates/" + template_id);
  }
}
