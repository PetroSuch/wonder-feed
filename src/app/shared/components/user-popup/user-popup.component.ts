import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AlertService } from "../../services/alert.service";
import { LoadingComponent } from "../loading/loading.component";
import { AuthService } from "../../services/auth.service";
import {
  IRegisterCredentials,
  IRegisterForm,
  IUser,
} from "../../interfaces/login.interfaces";
import { catchError, finalize, Observable, tap } from "rxjs";

@Component({
  selector: "app-user-popup",
  templateUrl: "./user-popup.component.html",
  styleUrls: ["./user-popup.component.scss"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent],
})
export class UserPopupComponent {
  public isLoading: boolean = false;
  public userId: number | null = null;
  public activeModal = inject(NgbActiveModal);
  public form: FormGroup<IRegisterForm>;

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
  ) {
    this.form = new FormGroup<IRegisterForm>({
      username: new FormControl<string | null>(""),
      password: new FormControl<string | null>(""),
      first_name: new FormControl<string | null>(""),
      last_name: new FormControl<string | null>(""),
    });
  }

  public onSave() {
    this.isLoading = true;
    let api$: Observable<void>;
    const data = this.form.value as IRegisterCredentials;
    if (this.userId) {
      api$ = this.authService.updateUser(this.userId.toString(), data);
    } else {
      api$ = this.authService.register(data) as unknown as Observable<void>;
    }

    api$
      .pipe(
        tap(() => this.activeModal.close(true)),
        tap(() => this.alertService.success("user saved successfully.")),
        catchError(() => this.alertService.error()),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe();
  }
}
