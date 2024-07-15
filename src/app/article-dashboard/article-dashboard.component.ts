import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CategoryService } from "../shared/services/category.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CategoryPopupComponent } from "../shared/components/category-popup/category-popup.component";
import { ICategory } from "../shared/interfaces/category.interfaces";
import { filter, first, tap } from "rxjs";

@Component({
  selector: "app-article-dashboard",
  standalone: true,
  imports: [RouterModule],
  templateUrl: "./article-dashboard.component.html",
  styleUrl: "./article-dashboard.component.scss",
})
export class ArticleDashboardComponent {
  public categories: ICategory[] = [];

  constructor(
    private categoryService: CategoryService,
    private modalService: NgbModal,
  ) {
    this.fetchCategories();
  }

  public createCategory() {
    const modalRef = this.modalService.open(CategoryPopupComponent);
    modalRef.closed
      .pipe(
        filter((refresh) => !!refresh),
        tap(() => this.fetchCategories()),
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
        tap(() => this.fetchCategories()),
      )
      .subscribe();
  }

  public deleteCategory(e: Event, category: ICategory) {
    const conf = confirm("Are you sure you want to delete this category?");
    if (!conf) return;
    e.stopPropagation();

    this.categoryService
      .deleteCategory(category.id)
      .pipe(tap(() => this.fetchCategories()))
      .subscribe();
  }

  private fetchCategories() {
    this.categoryService
      .getCategories()
      .pipe(
        first(),
        tap((data) => (this.categories = data)),
      )
      .subscribe();
  }
}
