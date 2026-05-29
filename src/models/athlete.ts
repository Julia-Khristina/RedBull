export interface Athlete {
  id: number;
  nome: string;
  status: string;
  email: string;
  telefone: string | null;
  cpf: string;
  equipe_id: number;
  criado_em: string;
}

export interface CreateAthleteInput {
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  status?: string;
  equipe_id: number;
}

export interface UpdateAthleteInput {
  nome?: string;
  email?: string;
  telefone?: string;
  status?: string;
}

export interface AthleteRepository {
  create(input: CreateAthleteInput): Promise<Athlete>;
  findById(id: number, equipe_id: number): Promise<Athlete | null>;
  findByTeam(equipe_id: number): Promise<Athlete[]>;
  countByTeam(equipe_id: number): Promise<number>;
  findTeamById(equipe_id: number): Promise<{ id: number } | null>;
  update(
    id: number,
    equipe_id: number,
    input: UpdateAthleteInput
  ): Promise<Athlete | null>;
  delete(id: number, equipe_id: number): Promise<boolean>;
}
