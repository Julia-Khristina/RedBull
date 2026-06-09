export interface AuthAdmin {
  id: number;
  email: string;
  name: string;
  role: "admin";
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  admin: AuthAdmin;
}

export interface LoginInput {
  email: string;
  password: string;
}
