import {
  Checkpoint,
  CheckpointRepository,
  CreateCheckpointInput,
  UpdateCheckpointInput,
} from "../models/checkpoint";
import { getSupabaseClient } from "../database/supabaseClient";

const SELECT_COLUMNS =
  "id, identificador:identifier, km:distance_km, pace, tempo:time, imagem:image, corredor_id:id_runner, competicao_id:id_competition, esteira_id:id_treadmill, administrador_id:id_admin, criado_em:created_at, runner:corredor_id(id, nome:name, equipe_id:id_team)";

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

    const payload: Record<string, unknown> = {
      identificador: input.identifier,
      km: input.distance_km,
      corredor_id: input.id_runner,
      competicao_id: input.id_competition,
      esteira_id: input.id_treadmill,
      administrador_id: input.id_admin,
    };
    if (input.pace !== undefined) payload.pace = input.pace;
    if (input.time !== undefined) payload.tempo = input.time;
    if (input.image !== undefined) payload.imagem = input.image;

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
      .eq("corredor_id", runnerId)
      .order("id", { ascending: true });

    if (error) throw error;

    return normalizeCheckpoints(data as unknown as SupabaseCheckpoint[]);
  },

  async findByCompetition(competitionId: number): Promise<Checkpoint[]> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("checkpoint")
      .select(SELECT_COLUMNS)
      .eq("competicao_id", competitionId)
      .order("id", { ascending: true });

    if (error) throw error;

    return normalizeCheckpoints(data as unknown as SupabaseCheckpoint[]);
  },

  async update(
    id: number,
    input: UpdateCheckpointInput
  ): Promise<Checkpoint | null> {
    const supabase = getSupabaseClient();

    const payload: Record<string, unknown> = {};
    if (input.distance_km !== undefined) payload.km = input.distance_km;
    if (input.pace !== undefined) payload.pace = input.pace;
    if (input.time !== undefined) payload.tempo = input.time;
    if (input.image !== undefined) payload.imagem = input.image;

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
