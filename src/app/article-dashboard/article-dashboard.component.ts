import { Component } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CategoryService } from "../shared/services/category.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CategoryPopupComponent } from "../shared/components/category-popup/category-popup.component";
import { ICategory } from "../shared/interfaces/category.interfaces";
import { filter, first, tap } from "rxjs";
import { TemplateService } from "../shared/services/template.service";
import { ITemplate } from "../shared/interfaces/template.interface";
import { RoutesNames } from "../shared/enums/routes.enum";
import { CommonModule } from "@angular/common";
import { DashboardService } from "../shared/services/dashboard.service";

@Component({
  selector: "app-article-dashboard",
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: "./article-dashboard.component.html",
  styleUrl: "./article-dashboard.component.scss",
})
export class ArticleDashboardComponent {
  public get activeTemplateId(): number {
    return +this.route.snapshot.firstChild?.params["templateId"];
  }

  public get activeCategoryId(): number {
    return +this.route.snapshot.firstChild?.params["categoryId"];
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private templateService: TemplateService,
    public dashboardService: DashboardService,
    private modalService: NgbModal,
  ) {
    this.dashboardService.fetchTemplates();
    this.dashboardService.fetchCategories();
  }

  public openCategory(category: ICategory) {
    void this.router.navigate(["/", RoutesNames.Articles, category.id]);
  }

  public onCreateArticle() {
    void this.router.navigate(["/", RoutesNames.Articles, RoutesNames.Create]);
  }

  public createCategory() {
    const modalRef = this.modalService.open(CategoryPopupComponent);
    modalRef.closed
      .pipe(
        filter((refresh) => !!refresh),
        tap(() => this.dashboardService.fetchCategories()),
      )
      .subscribe();
  }

  public updateCategory(e: Event, category: ICategory) {
    e.stopPropagation();
    const modalRef = this.modalService.open(CategoryPopupComponent);
    const component = modalRef.componentInstance as CategoryPopupComponent;
    component.categoryId = category.id;
    component.categoryName = category.name;

    modalRef.closed
      .pipe(
        filter((refresh) => !!refresh),
        tap(() => this.dashboardService.fetchCategories()),
      )
      .subscribe();
  }

  public deleteCategory(e: Event, category: ICategory) {
    const conf = confirm("Are you sure you want to delete this category?");
    if (!conf) return;
    e.stopPropagation();

    this.categoryService
      .deleteCategory(category.id)
      .pipe(tap(() => this.dashboardService.fetchCategories()))
      .subscribe();
  }

  public updateTemplate(e: Event, template: ITemplate) {
    e.stopPropagation();
    void this.router.navigate([
      "/",
      RoutesNames.Articles,
      RoutesNames.Template,
      template.id,
    ]);
  }

  public deleteTemplate(e: Event, template: ITemplate) {
    const conf = confirm("Are you sure you want to delete this template?");
    if (!conf) return;
    e.stopPropagation();

    this.templateService
      .deleteTemplate(template.id)
      .pipe(tap(() => this.dashboardService.fetchTemplates()))
      .subscribe();
  }

  public createTemplate() {
    void this.router.navigate([
      "/",
      RoutesNames.Articles,
      RoutesNames.Template,
    ]);
  }
}
