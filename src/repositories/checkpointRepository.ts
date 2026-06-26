import {
  Checkpoint,
  CheckpointRepository,
  CreateCheckpointInput,
  UpdateCheckpointInput,
} from "../models/checkpoint";
import { getSupabaseClient } from "../database/supabaseClient";

const SELECT_COLUMNS =
  "id, identifier, distance_km, pace, time, image, id_runner, id_competition, id_admin, created_at, runner:id_runner(id, name, id_team, team:id_team(id, name)), admin:id_admin(id, name)";

type SupabaseCheckpoint = Record<string, unknown>;

function normalizeCheckpoint(data: SupabaseCheckpoint): Checkpoint {
  const runnerData = data.runner;
  const runner = Array.isArray(runnerData)
    ? (runnerData[0] as Checkpoint["runner"] ?? null)
    : (runnerData as Checkpoint["runner"] ?? null);

  return { ...data as unknown as Checkpoint, runner };
}

function normalizeCheckpoints(data: SupabaseCheckpoint[] | null): Checkpoint[] {
  return (data ?? []).map(normalizeCheckpoint);
}

export const checkpointRepository: CheckpointRepository = {
  async create(input: CreateCheckpointInput): Promise<Checkpoint> {
    const supabase = getSupabaseClient();

    const nowIso = new Date().toISOString();
    const payload: Record<string, unknown> = {
      identifier: input.identifier,
      distance_km: input.distance_km,
      id_runner: input.id_runner,
      id_competition: input.id_competition,
      id_admin: input.id_admin,
      created_at: input.created_at ? input.created_at.toISOString() : nowIso,
    };
    if (input.pace !== undefined) payload.pace = input.pace;
    if (input.time !== undefined) payload.time = input.time;
    if (input.image !== undefined) payload.image = input.image;

    const { data, error } = await supabase
      .from("checkpoint")
      .insert(payload)
      .select(SELECT_COLUMNS)
      .single();

    if (error) throw error;

    return normalizeCheckpoint(data as unknown as SupabaseCheckpoint);
  },

  async findAll(): Promise<Checkpoint[]> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("checkpoint")
      .select(SELECT_COLUMNS)
      .order("id", { ascending: true });

    if (error) throw error;

    return normalizeCheckpoints(data as unknown as SupabaseCheckpoint[]);
  },

  async findById(id: number): Promise<Checkpoint | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("checkpoint")
      .select(SELECT_COLUMNS)
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;

    return data ? normalizeCheckpoint(data as unknown as SupabaseCheckpoint) : null;
  },

  async findByRunner(runnerId: number): Promise<Checkpoint[]> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("checkpoint")
      .select(SELECT_COLUMNS)
      .eq("id_runner", runnerId)
      .order("id", { ascending: true });

    if (error) throw error;

    return normalizeCheckpoints(data as unknown as SupabaseCheckpoint[]);
  },

  async findByCompetition(competitionId: number): Promise<Checkpoint[]> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("checkpoint")
      .select(SELECT_COLUMNS)
      .eq("id_competition", competitionId)
      .order("id", { ascending: true });

    if (error) throw error;

    return normalizeCheckpoints(data as unknown as SupabaseCheckpoint[]);
  },

  async findInconsistenciesByCompetition(
    competitionId: number
  ): Promise<Checkpoint[]> {
    const checkpoints = await checkpointRepository.findByCompetition(
      competitionId
    );

    return checkpoints.filter((checkpoint) => {
      if (!checkpoint.runner) return true;

      const id = String(checkpoint.identifier ?? "").toUpperCase();
      const image = checkpoint.image as Record<string, unknown> | null;
      const correctedManually = image?.corrected_manually === true;

      return correctedManually || id.startsWith("OCR-EDITED-") || id.startsWith("CORRIGIDO-") || id.startsWith("CORREÇÃO-") || id.startsWith("REVISADO-");
    });
  },

  async update(
    id: number,
    input: UpdateCheckpointInput
  ): Promise<Checkpoint | null> {
    const supabase = getSupabaseClient();

    const payload: Record<string, unknown> = {
      created_at: new Date().toISOString(),
    };
    if (input.distance_km !== undefined) payload.distance_km = input.distance_km;
    if (input.pace !== undefined) payload.pace = input.pace;
    if (input.time !== undefined) payload.time = input.time;
    if (input.image !== undefined) payload.image = input.image;

    const { data, error } = await supabase
      .from("checkpoint")
      .update(payload)
      .eq("id", id)
      .select(SELECT_COLUMNS)
      .maybeSingle();

    if (error) throw error;

    return data ? normalizeCheckpoint(data as unknown as SupabaseCheckpoint) : null;
  },

  async delete(id: number): Promise<boolean> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("checkpoint")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) throw error;

    return (data ?? []).length > 0;
  },
};
