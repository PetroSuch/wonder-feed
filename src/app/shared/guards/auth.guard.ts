// auth guard

import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { RoutesNames } from "../enums/routes.enum";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate() {
    if (this.authService.getToken) {
      return true;
    }

    void this.router.navigate(["/", RoutesNames.Login]);
    return false;
  }
}
