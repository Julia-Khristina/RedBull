export interface Team {
  id: number;
  name: string;
  uuid: string;
  qr_code: unknown | null;
  id_competition: number;
  created_at: string;
}

export interface CreateTeamInput {
  name: string;
  id_competition: number;
}

export interface UpdateTeamInput {
  name?: string;
}

export interface TeamRepository {
  create(input: CreateTeamInput): Promise<Team>;
  findByCompetition(competitionId: number): Promise<Team[]>;
  findByUuid(uuid: string): Promise<Team | null>;
  findByCompetitionAndId(competitionId: number, id: number): Promise<Team | null>;
  updateByCompetitionAndId(competitionId: number, id: number, input: UpdateTeamInput): Promise<Team | null>;
  deleteByCompetitionAndId(competitionId: number, id: number): Promise<boolean>;
}
