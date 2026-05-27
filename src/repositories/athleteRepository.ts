import {
  Athlete,
  AthleteRepository,
  CreateAthleteInput,
  UpdateAthleteInput,
} from "../models/athlete";
import { getSupabaseClient } from "../database/supabaseClient";

const SELECT_COLUMNS =
  "id, nome, status, email, telefone, cpf, equipe_id, criado_em";

export const athleteRepository: AthleteRepository = {
  async create(input: CreateAthleteInput): Promise<Athlete> {
    const supabase = getSupabaseClient();

    const payload: Record<string, unknown> = {
      nome: input.nome,
      cpf: input.cpf,
      email: input.email,
      equipe_id: input.equipe_id,
    };
    if (input.telefone !== undefined) payload.telefone = input.telefone;
    if (input.status !== undefined) payload.status = input.status;

    const { data, error } = await supabase
      .from("corredor")
      .insert(payload)
      .select(SELECT_COLUMNS)
      .single();

    if (error) throw error;

    return data as Athlete;
  },

  async findById(id: number, equipe_id: number): Promise<Athlete | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("corredor")
      .select(SELECT_COLUMNS)
      .eq("id", id)
      .eq("equipe_id", equipe_id)
      .maybeSingle();

    if (error) throw error;

    return data as Athlete | null;
  },

  async findByTeam(equipe_id: number): Promise<Athlete[]> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("corredor")
      .select(SELECT_COLUMNS)
      .eq("equipe_id", equipe_id)
      .order("id", { ascending: true });

    if (error) throw error;

    return (data ?? []) as Athlete[];
  },

  async countByTeam(equipe_id: number): Promise<number> {
    const supabase = getSupabaseClient();

    const { count, error } = await supabase
      .from("corredor")
      .select("id", { count: "exact", head: true })
      .eq("equipe_id", equipe_id);

    if (error) throw error;

    return count ?? 0;
  },

  async findTeamById(equipe_id: number): Promise<{ id: number } | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("equipe")
      .select("id")
      .eq("id", equipe_id)
      .maybeSingle();

    if (error) throw error;

    return data as { id: number } | null;
  },

  async update(
    id: number,
    equipe_id: number,
    input: UpdateAthleteInput
  ): Promise<Athlete | null> {
    const supabase = getSupabaseClient();

    const payload: Record<string, unknown> = {};
    if (input.nome !== undefined) payload.nome = input.nome;
    if (input.email !== undefined) payload.email = input.email;
    if (input.telefone !== undefined) payload.telefone = input.telefone;
    if (input.status !== undefined) payload.status = input.status;

    const { data, error } = await supabase
      .from("corredor")
      .update(payload)
      .eq("id", id)
      .eq("equipe_id", equipe_id)
      .select(SELECT_COLUMNS)
      .maybeSingle();

    if (error) throw error;

    return data as Athlete | null;
  },

  async delete(id: number, equipe_id: number): Promise<boolean> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("corredor")
      .delete()
      .eq("id", id)
      .eq("equipe_id", equipe_id)
      .select("id");

    if (error) throw error;

    return (data ?? []).length > 0;
  },
};
