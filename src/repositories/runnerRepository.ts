import {
  Runner,
  RunnerRepository,
  CreateRunnerInput,
  UpdateRunnerInput,
} from "../models/runner";
import { getSupabaseClient } from "../database/supabaseClient";

const SELECT_COLUMNS =
  "id, name, status, email, phone, cpf, id_team, created_at";

export const runnerRepository: RunnerRepository = {
  async create(input: CreateRunnerInput): Promise<Runner> {
    const supabase = getSupabaseClient();

    const payload: Record<string, unknown> = {
      name: input.name,
      cpf: input.cpf,
      email: input.email,
      id_team: input.id_team,
    };
    if (input.phone !== undefined) payload.phone = input.phone;
    if (input.status !== undefined) payload.status = input.status;

    const { data, error } = await supabase
      .from("runner")
      .insert(payload)
      .select(SELECT_COLUMNS)
      .single();

    if (error) throw error;

    return data as unknown as Runner;
  },

  async findByTeamAndId(teamId: number, id: number): Promise<Runner | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("runner")
      .select(SELECT_COLUMNS)
      .eq("id", id)
      .eq("id_team", teamId)
      .maybeSingle();

    if (error) throw error;

    return data as unknown as Runner | null;
  },

  async findByTeam(teamId: number): Promise<Runner[]> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("runner")
      .select(SELECT_COLUMNS)
      .eq("id_team", teamId)
      .order("id", { ascending: true });

    if (error) throw error;

    return (data ?? []) as unknown as Runner[];
  },

  async countByTeam(teamId: number): Promise<number> {
    const supabase = getSupabaseClient();

    const { count, error } = await supabase
      .from("runner")
      .select("id", { count: "exact", head: true })
      .eq("id_team", teamId);

    if (error) throw error;

    return count ?? 0;
  },

  async findTeamById(teamId: number): Promise<{ id: number } | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("team")
      .select("id")
      .eq("id", teamId)
      .maybeSingle();

    if (error) throw error;

    return data as { id: number } | null;
  },

  async updateByTeamAndId(
    teamId: number,
    id: number,
    input: UpdateRunnerInput
  ): Promise<Runner | null> {
    const supabase = getSupabaseClient();

    const payload: Record<string, unknown> = {};
    if (input.name !== undefined) payload.name = input.name;
    if (input.email !== undefined) payload.email = input.email;
    if (input.phone !== undefined) payload.phone = input.phone;
    if (input.status !== undefined) payload.status = input.status;

    const { data, error } = await supabase
      .from("runner")
      .update(payload)
      .eq("id", id)
      .eq("id_team", teamId)
      .select(SELECT_COLUMNS)
      .maybeSingle();

    if (error) throw error;

    return data as unknown as Runner | null;
  },

  async deleteByTeamAndId(teamId: number, id: number): Promise<boolean> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("runner")
      .delete()
      .eq("id", id)
      .eq("id_team", teamId)
      .select("id");

    if (error) throw error;

    return (data ?? []).length > 0;
  },
};
