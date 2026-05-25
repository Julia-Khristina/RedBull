import {
  Team,
  TeamRepository,
  CreateTeamInput,
  UpdateTeamInput,
} from "../models/team";
import { getSupabaseClient } from "../database/supabaseClient";

const SELECT_COLUMNS = "id, nome, uuid, qr_code, competicao_id, criado_em";

export const teamRepository: TeamRepository = {
  async create(input: CreateTeamInput): Promise<Team> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("equipe")
      .insert({
        nome: input.nome,
        competicao_id: input.competicao_id,
      })
      .select(SELECT_COLUMNS)
      .single();

    if (error) {
      throw error;
    }

    return data as Team;
  },

  async findById(id: number): Promise<Team | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("equipe")
      .select(SELECT_COLUMNS)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as Team | null;
  },

  async findByCompetition(competicaoId: number): Promise<Team[]> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("equipe")
      .select(SELECT_COLUMNS)
      .eq("competicao_id", competicaoId);

    if (error) {
      throw error;
    }

    return (data ?? []) as Team[];
  },

  async update(id: number, input: UpdateTeamInput): Promise<Team | null> {
    const supabase = getSupabaseClient();

    const payload: Record<string, unknown> = {};
    if (input.nome !== undefined) {
      payload.nome = input.nome;
    }

    const { data, error } = await supabase
      .from("equipe")
      .update(payload)
      .eq("id", id)
      .select(SELECT_COLUMNS)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as Team | null;
  },

  async delete(id: number): Promise<boolean> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("equipe")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) {
      throw error;
    }

    return (data ?? []).length > 0;
  },
};
