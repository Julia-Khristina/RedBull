export type CompetitionStatus = "not_started" | "in_progress" | "closed";

export interface Competition {
  id: number;
  name: string;
  address: string;
  date: string;
  status: CompetitionStatus;
  created_at: string;
  /* Gravado por competitionRepository.activate() — marco zero do countdown
     de 24h exibido no Painel TV (US19 #519). Null enquanto a competição
     ainda está em "not_started". */
  started_at: string | null;
}

export interface CreateCompetitionInput {
  name: string;
  address: string;
  date: string;
}

export interface UpdateCompetitionInput {
  name: string;
  address: string;
  date: string;
}

export interface CompetitionRepository {
  create(input: CreateCompetitionInput): Promise<Competition>;
  findAll(): Promise<Competition[]>;
  findById(id: number): Promise<Competition | null>;
  update(id: number, input: UpdateCompetitionInput): Promise<Competition | null>;
  delete(id: number): Promise<boolean>;
  close(id: number): Promise<Competition | null>;
  activate(id: number): Promise<Competition | null>;
}
