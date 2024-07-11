import { Injectable } from "@angular/core";
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, of } from "rxjs";
const commonOptions: MatSnackBarConfig = {
  duration: 3000,
  verticalPosition: "top",
  horizontalPosition: "center",
};

@Injectable({
  providedIn: "root",
})
export class AlertService {
  horizontalPosition: MatSnackBarHorizontalPosition = "start";
  verticalPosition: MatSnackBarVerticalPosition = "bottom";

  constructor(
    private _snackBar: MatSnackBar,
    private modalService: NgbModal,
  ) {}

  public success(msg: string, config?: MatSnackBarConfig) {
    let options = config ?? {
      duration: 3000,
    };

    options = {
      ...options,
      ...commonOptions,
      panelClass: "snackbar-success",
    };
    this._snackBar.open(msg, "", options);
  }

  public error(msg?: string, config?: MatSnackBarConfig): Observable<null> {
    const message = msg ?? "Something went wrong. Please try again later.";
    let options = config ?? {
      duration: 3000,
    };

    options = {
      ...options,
      ...commonOptions,
      duration: 7000,
      panelClass: "snackbar-error",
    };
    this._snackBar.open(message, "", options);
    return of(null);
  }

  public info(msg: string, config?: MatSnackBarConfig): Observable<null> {
    let options = config ?? {
      duration: 7000,
    };

    options = {
      ...options,
      ...commonOptions,
      panelClass: "snackbar-info",
    };
    this._snackBar.open(msg, "", options);
    return of(null);
  }
}
