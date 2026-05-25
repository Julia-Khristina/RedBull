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

export interface CompetitionRepository {
  create(input: CreateCompetitionInput): Promise<Competition>;
}
