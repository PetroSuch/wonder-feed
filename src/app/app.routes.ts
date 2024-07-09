import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { CreateArticleComponent } from "./create-article/create-article.component";
import { ArticleDashboardComponent } from "./article-dashboard/article-dashboard.component";

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "articles",
    component: ArticleDashboardComponent,
    children: [
      {
        path: "create",
        component: CreateArticleComponent,
      },
      {
        path: "",
        component: DashboardComponent,
      },
    ],
  },
];
