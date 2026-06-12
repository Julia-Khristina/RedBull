export interface Team {
  id: number;
  name: string;
  uuid: string;
  qr_code: unknown | null;
  id_competition: number;
  active_runner_id?: number | null;
  created_at: string;
}

export interface CreateTeamInput {
  name: string;
  id_competition: number;
}

export interface UpdateTeamInput {
  name?: string;
}

export interface SetActiveRunnerInput {
  runnerId: number;
}

export interface TeamRepository {
  create(input: CreateTeamInput): Promise<Team>;
  findByCompetition(competitionId: number): Promise<Team[]>;
  findByUuid(uuid: string): Promise<Team | null>;
  findByCompetitionAndId(competitionId: number, id: number): Promise<Team | null>;
  findRunnerByTeamAndId(teamId: number, runnerId: number): Promise<{ id: number } | null>;
  updateByCompetitionAndId(competitionId: number, id: number, input: UpdateTeamInput): Promise<Team | null>;
  setActiveRunnerByCompetitionAndId(competitionId: number, id: number, runnerId: number): Promise<Team | null>;
  deleteByCompetitionAndId(competitionId: number, id: number): Promise<boolean>;
}
