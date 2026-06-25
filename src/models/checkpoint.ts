export interface Checkpoint {
  id: number;
  identifier: string;
  distance_km: number;
  pace: string | null;
  time: string | null;
  image: Record<string, unknown> | null;
  id_runner: number;
  id_competition: number;
  id_admin: number;
  created_at: string;
  runner?: {
    id: number;
    name: string;
    id_team: number;
    team?: {
      id: number;
      name: string;
    } | null;
  } | null;
  admin?: {
    id: number;
    name: string;
  } | null;
}

export interface CreateCheckpointInput {
  identifier: string;
  distance_km: number;
  pace?: string;
  time?: string;
  image?: Record<string, unknown>;
  id_runner: number;
  id_competition: number;
  id_admin: number;
  created_at?: Date;
}

export interface UpdateCheckpointInput {
  distance_km?: number;
  pace?: string;
  time?: string;
  created_at?: Date;
  image?: Record<string, unknown>;
}

export interface CheckpointRepository {
  create(input: CreateCheckpointInput): Promise<Checkpoint>;
  findAll(): Promise<Checkpoint[]>;
  findById(id: number): Promise<Checkpoint | null>;
  findByRunner(runnerId: number): Promise<Checkpoint[]>;
  findByCompetition(competitionId: number): Promise<Checkpoint[]>;
  findInconsistenciesByCompetition(competitionId: number): Promise<Checkpoint[]>;
  update(id: number, input: UpdateCheckpointInput): Promise<Checkpoint | null>;
  delete(id: number): Promise<boolean>;
}
