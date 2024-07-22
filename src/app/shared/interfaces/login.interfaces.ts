import { FormControl } from "@angular/forms";

export interface IUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

export interface ILoginCredentials {
  username: string;
  password: string;
}

export interface IRegisterCredentials {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface ILoginResponse {
  access_token: string;
}

export interface ILoginForm {
  username: FormControl<string>;
  password: FormControl<string>;
}

export interface IRegisterForm {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
  first_name: FormControl<string | null>;
  last_name: FormControl<string | null>;
}
