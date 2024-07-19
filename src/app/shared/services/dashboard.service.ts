import { Injectable } from "@angular/core";
import { ICategory } from "../interfaces/category.interfaces";
import { ITemplate } from "../interfaces/template.interface";
import { CategoryService } from "./category.service";
import { TemplateService } from "./template.service";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class DashboardService {
  public templates: ITemplate[] = [];
  public categories: ICategory[] = [];
  public templates$: Subject<ITemplate[]>;
  public categories$: Subject<ICategory[]>;

  constructor(
    private categoryService: CategoryService,
    private templateService: TemplateService,
  ) {
    this.categories$ = new Subject<ICategory[]>();
    this.templates$ = new Subject<ITemplate[]>();
  }

  public fetchCategories() {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
      this.categories$.next(data);
    });
  }

  public fetchTemplates() {
    this.templateService.getTemplates().subscribe((data) => {
      this.templates = data;
      this.templates$.next(data);
    });
  }
}
