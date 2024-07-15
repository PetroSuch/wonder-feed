import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { CreateArticleComponent } from "./create-article/create-article.component";
import { ArticleDashboardComponent } from "./article-dashboard/article-dashboard.component";
import { CreateTemplateComponent } from "./create-template/create-template.component";
import { RoutesNames } from "./shared/enums/routes.enum";
import { AuthGuard } from "./shared/guards/auth.guard";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: RoutesNames.Login,
  },
  {
    path: RoutesNames.Login,
    component: LoginComponent,
  },
  {
    path: RoutesNames.Articles,
    component: ArticleDashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: RoutesNames.Create,
        component: CreateArticleComponent,
      },
      {
        path: RoutesNames.Template,
        component: CreateTemplateComponent,
      },
      {
        path: "",
        component: DashboardComponent,
      },
    ],
  },
];
