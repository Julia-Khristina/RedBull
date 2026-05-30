export type CompetitionStatus = "não iniciado" | "em andamento" | "encerrada";

export interface Competition {
  id: number;
  nome: string;
  endereco: string;
  data: string;
  status: CompetitionStatus;
  criado_em: string;
}

export interface CreateCompetitionInput {
  nome: string;
  endereco: string;
  data: string;
}

export interface UpdateCompetitionInput {
  nome: string;
  endereco: string;
  data: string;
}

export interface CompetitionRepository {
  create(input: CreateCompetitionInput): Promise<Competition>;
  findAll(): Promise<Competition[]>;
  findById(id: number): Promise<Competition | null>;
  update(id: number, input: UpdateCompetitionInput): Promise<Competition | null>;
  delete(id: number): Promise<boolean>;
  close(id: number): Promise<Competition | null>;
}
