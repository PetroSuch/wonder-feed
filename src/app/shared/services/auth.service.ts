import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import {
  ILoginCredentials,
  ILoginResponse,
} from "../interfaces/login.interfaces";

@Injectable({ providedIn: "root" })
export class AuthService extends HttpService {
  public get getToken() {
    return localStorage.getItem("auth_token");
  }

  public login(username: string, password: string) {
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
