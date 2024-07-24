import { Component } from "@angular/core";
import { AuthService } from "../shared/services/auth.service";
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ILoginForm } from "../shared/interfaces/login.interfaces";
import { AlertService } from "../shared/services/alert.service";
import { CommonModule } from "@angular/common";
import { catchError, finalize, tap } from "rxjs";
import { LoadingComponent } from "../shared/components/loading/loading.component";
import { RoutesNames } from "../shared/enums/routes.enum";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LoadingComponent],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  public form: FormGroup<ILoginForm>;
  public loading: boolean = false;
  public showErrors: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService,
    private nonNullableBuilder: NonNullableFormBuilder,
  ) {
    this.form = new FormGroup<ILoginForm>({
      username: this.nonNullableBuilder.control<string>(""),
      password: this.nonNullableBuilder.control<string>(""),
    });

    this.authService
      .register({
        first_name: "John",
        last_name: "Doe",
        username: "admin2",
        password: "admin2",
      })
      .subscribe();

    const { username, password } = this.form.controls;
    username.setValidators([Validators.required]);
    password.setValidators([Validators.required]);
  }

  public login() {
    if (this.form.invalid) {
      this.showErrors = true;
      this.alertService.error("Please fill in all fields");
      return;
    }

    this.loading = true;
    const { username, password } = this.form.value;

    this.authService
      .login(username!, password!)
      .pipe(
        tap((data) => localStorage.setItem("auth_token", data.access_token)),
        tap(() => void this.router.navigate(["/", RoutesNames.Articles])),
        catchError((err: { msg: string }) => this.alertService.error(err?.msg)),
        finalize(() => {
          this.loading = false;
          this.form.reset();
        }),
      )
      .subscribe();
  }
}
