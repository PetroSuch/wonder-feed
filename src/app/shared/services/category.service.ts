import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Observable } from "rxjs";
import { ICategory } from "../interfaces/category.interfaces";

@Injectable({ providedIn: "root" })
export class CategoryService extends HttpService {
  public get getToken() {
    return localStorage.getItem("auth_token");
  }

  public createCategory(name: string): Observable<void> {
    return this.post<{ name: string }, void>("category/create", { name });
  }

  public getCategories(): Observable<ICategory[]> {
    return this.get<ICategory[]>("category/all");
  }

  public getCategory(category_id: number): Observable<ICategory> {
    return this.get<ICategory>("category/" + category_id);
  }

  public updateCategory(category_id: number, name: string): Observable<void> {
    return this.put<{ name: string }, void>("category/" + category_id, {
      name,
    });
  }

  public deleteCategory(category_id: number): Observable<void> {
    return this.delete<void>("category/" + category_id);
  }
}
