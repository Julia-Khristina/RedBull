export interface Runner {
  id: number;
  name: string;
  status: string;
  email: string;
  phone: string | null;
  cpf: string;
  id_team: number;
  created_at: string;
}

export interface CreateRunnerInput {
  name: string;
  cpf: string;
  email: string;
  phone?: string;
  status?: string;
  id_team: number;
}

export interface UpdateRunnerInput {
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
}

export interface RunnerRepository {
  create(input: CreateRunnerInput): Promise<Runner>;
  findByTeamAndId(teamId: number, id: number): Promise<Runner | null>;
  findByTeam(teamId: number): Promise<Runner[]>;
  countByTeam(teamId: number): Promise<number>;
  findTeamById(teamId: number): Promise<{ id: number } | null>;
  updateByTeamAndId(
    teamId: number,
    id: number,
    input: UpdateRunnerInput
  ): Promise<Runner | null>;
  deleteByTeamAndId(teamId: number, id: number): Promise<boolean>;
}
