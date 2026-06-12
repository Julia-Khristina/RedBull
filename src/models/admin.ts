export interface Admin {
  id: number;
  name: string;
  email: string;
  area: string;
  password: string;
  created_at: string;
}

export interface AdminInput {
  name: string;
  email: string;
  area: string;
  password: string;
}
