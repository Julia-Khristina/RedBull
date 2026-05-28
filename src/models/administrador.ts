export interface Administrador {
  id: number;
  nome: string;
  email: string;
  area: string;
  senha: string;
  criado_em: string;
}

export interface AdministradorInput {
  nome: string;
  email: string;
  area: string;
  senha: string;
}
