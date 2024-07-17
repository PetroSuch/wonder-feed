import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { IGenerateArticleResponse } from "../shared/interfaces/article.interfaces";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, NgbDropdownModule],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent {
  public articles: IGenerateArticleResponse[];
  constructor() {
    this.articles = [];
    this.fetchArticles();
  }

  public fetchArticles() {}
}
