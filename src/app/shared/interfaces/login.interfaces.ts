import { FormControl } from "@angular/forms";

export interface ILoginCredentials {
  username: string;
  password: string;
}

export interface ILoginResponse {
  access_token: string;
}

export interface ILoginForm {
  username: FormControl<string>;
  password: FormControl<string>;
}
