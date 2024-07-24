import { CommonModule } from "@angular/common";
import { Component, DestroyRef, inject } from "@angular/core";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { IArticle } from "../shared/interfaces/article.interfaces";
import { ActivatedRoute, Router } from "@angular/router";
import { ArticleService } from "../shared/services/article.service";
import { RoutesNames } from "../shared/enums/routes.enum";
import { ICategory } from "../shared/interfaces/category.interfaces";
import { CategoryService } from "../shared/services/category.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { filter, tap } from "rxjs";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, NgbDropdownModule],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent {
  public articles: IArticle[];
  private categoryData: ICategory | null = null;
  private readonly destroyRef = inject(DestroyRef);

  private get categoryId() {
    return this.route.snapshot.params["categoryId"] as number;
  }

  public get navLabel() {
    return this.categoryId ? this.categoryData?.name : "";
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private categoryService: CategoryService,
  ) {
    this.articles = [];
    const categoryId = this.route.snapshot.params["categoryId"] as number;
    this.categoryService.getCategory(categoryId).subscribe((response) => {
      this.categoryData = response;
    });
    this.fetchArticles();

    this.route.params
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((params) => !!params["categoryId"]),
        tap(() => this.fetchArticles()),
      )
      .subscribe();
  }

  public fetchArticles() {
    this.articleService
      .getArticlesByCategoryId(this.categoryId)
      .subscribe((response) => {
        this.articles = response;
      });
  }

  public onDeleteArticle(article: IArticle) {
    const conf = confirm("Are you sure you want to delete this article?");
    if (!conf) return;

    this.articleService.deleteArticle(article.id).subscribe(() => {
      this.fetchArticles();
    });
  }

  public onEditArticle(article: IArticle) {
    void this.router.navigate([
      "/",
      RoutesNames.Articles,
      RoutesNames.Create,
      article.id,
    ]);
  }

  public onDuplicateArticle(article: IArticle) {
    const conf = confirm("Are you sure you want to duplicate this article?");
    if (!conf) return;

    this.articleService.duplicateArticle(article.id).subscribe(() => {
      this.fetchArticles();
    });
  }
}
