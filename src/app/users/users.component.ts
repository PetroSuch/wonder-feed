import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { NgbDropdownModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../shared/services/auth.service";
import {
  IRegisterCredentials,
  IUser,
} from "../shared/interfaces/login.interfaces";
import { UserPopupComponent } from "../shared/components/user-popup/user-popup.component";
import { filter, tap } from "rxjs";

@Component({
  selector: "app-users",
  standalone: true,
  imports: [CommonModule, NgbDropdownModule],
  templateUrl: "./users.component.html",
  styleUrl: "./users.component.scss",
})
export class UsersComponent {
  public users: IUser[] = [];

  constructor(
    private authService: AuthService,
    private modalService: NgbModal,
  ) {
    this.fetchUsers();
  }

  private fetchUsers() {
    this.authService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  public onAddUser() {
    const modalRef = this.modalService.open(UserPopupComponent);
    modalRef.closed
      .pipe(
        filter((refresh) => !!refresh),
        tap(() => this.fetchUsers()),
      )
      .subscribe();
  }

  public onEditUser(user: IUser) {
    const modalRef = this.modalService.open(UserPopupComponent);
    const component = modalRef.componentInstance as UserPopupComponent;
    component.userId = user.id;
    component.form.patchValue(user);

    modalRef.closed
      .pipe(
        filter((refresh) => !!refresh),
        tap(() => this.fetchUsers()),
      )
      .subscribe();
  }

  public onDeleteUser(user: IUser) {
    const conf = confirm("Are you sure you want to delete this user?");
    if (!conf) return;

    this.authService.removeUser(user.id).subscribe(() => {
      this.fetchUsers();
    });
  }
}
