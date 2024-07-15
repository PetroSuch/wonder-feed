import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import {
  ILoginCredentials,
  ILoginResponse,
  IUser,
} from "../interfaces/login.interfaces";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthService extends HttpService {
  public get getToken() {
    return localStorage.getItem("auth_token");
  }

  public getUsers(): Observable<IUser[]> {
    return this.get<IUser[]>("users");
  }

  public getUser(user_id: number): Observable<IUser> {
    return this.get<IUser>("user/get?id=" + user_id);
  }

  public removeUser(user_id: number): Observable<void> {
    return this.delete<void>("users/" + user_id);
  }

  public updateUser(
    user_id: number,
    username: string,
    password: string,
  ): Observable<void> {
    return this.put<ILoginCredentials, void>("users/" + user_id, {
      username,
      password,
    });
  }

  public login(username: string, password: string) {
    return this.post<ILoginCredentials, ILoginResponse>("login", {
      username,
      password,
    });
  }

  public logout(username: string, password: string) {
    return this.post<ILoginCredentials, ILoginResponse>("login", {
      username,
      password,
    });
  }

  public register(username: string, password: string) {
    return this.post<ILoginCredentials, ILoginResponse>("register", {
      username,
      password,
    });
  }
}
