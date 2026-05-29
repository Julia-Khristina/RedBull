export interface Team {
  id: number;
  nome: string;
  uuid: string;
  qr_code: unknown | null;
  competicao_id: number;
  criado_em: string;
}

export interface CreateTeamInput {
  nome: string;
  competicao_id: number;
}

export interface UpdateTeamInput {
  nome?: string;
}

export interface TeamRepository {
  create(input: CreateTeamInput): Promise<Team>;
  findById(id: number): Promise<Team | null>;
  findByCompetition(competicaoId: number): Promise<Team[]>;
  update(id: number, input: UpdateTeamInput): Promise<Team | null>;
  delete(id: number): Promise<boolean>;
}
