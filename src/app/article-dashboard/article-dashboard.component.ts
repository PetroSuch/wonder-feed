import { Component } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CategoryService } from "../shared/services/category.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CategoryPopupComponent } from "../shared/components/category-popup/category-popup.component";
import { ICategory } from "../shared/interfaces/category.interfaces";
import { filter, tap } from "rxjs";
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
  public activeTab: number = 0;
  public addNewTemplate: boolean = false;

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
    this.activeTab = +this.route.snapshot.queryParams["tab"] || 0;

    if (
      !this.activeTemplateId &&
      location.pathname.includes(RoutesNames.Template)
    ) {
      this.addNewTemplate = true;
    }
  }

  public openCategory(category: ICategory) {
    this.addNewTemplate = false;
    void this.router.navigate(["/", RoutesNames.Articles, category.id]);
  }

  public onCreateArticle() {
    this.addNewTemplate = false;
    void this.router.navigate(["/", RoutesNames.Articles, RoutesNames.Create]);
  }

  public openTab(tab: number) {
    this.activeTab = tab;
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: "merge",
    });
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
    this.addNewTemplate = false;
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
    this.addNewTemplate = false;
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
      .deleteTemplate(template.id!)
      .pipe(tap(() => this.dashboardService.fetchTemplates()))
      .subscribe();
  }

  public createTemplate() {
    this.addNewTemplate = true;
    void this.router.navigate([
      "/",
      RoutesNames.Articles,
      RoutesNames.Template,
    ]);
  }
}
