import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { CreateArticleComponent } from "./create-article/create-article.component";
import { ArticleDashboardComponent } from "./article-dashboard/article-dashboard.component";
import { CreateTemplateComponent } from "./create-template/create-template.component";

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
        path: "template",
        component: CreateTemplateComponent,
      },
      {
        path: "",
        component: DashboardComponent,
      },
    ],
  },
];
