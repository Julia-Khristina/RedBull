import {
  Team,
  TeamRepository,
  CreateTeamInput,
  UpdateTeamInput,
} from "../models/team";
import { getSupabaseClient } from "../database/supabaseClient";

const SELECT_COLUMNS = "id, nome:name, uuid, qr_code, competicao_id:id_competition, criado_em:created_at";

export const teamRepository: TeamRepository = {
  async create(input: CreateTeamInput): Promise<Team> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("equipe")
      .insert({
        nome: input.name,
        competicao_id: input.id_competition,
      })
      .select(SELECT_COLUMNS)
      .single();

    if (error) {
      throw error;
    }

    return data as unknown as Team;
  },

  async findByCompetition(competitionId: number): Promise<Team[]> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("equipe")
      .select(SELECT_COLUMNS)
      .eq("competicao_id", competitionId);

    if (error) {
      throw error;
    }

    return (data ?? []) as unknown as Team[];
  },

  async findByCompetitionAndId(competitionId: number, id: number): Promise<Team | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("equipe")
      .select(SELECT_COLUMNS)
      .eq("id", id)
      .eq("competicao_id", competitionId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as unknown as Team | null;
  },

  async updateByCompetitionAndId(
    competitionId: number,
    id: number,
    input: UpdateTeamInput
  ): Promise<Team | null> {
    const supabase = getSupabaseClient();

    const payload: Record<string, unknown> = {};
    if (input.name !== undefined) {
      payload.nome = input.name;
    }

    const { data, error } = await supabase
      .from("equipe")
      .update(payload)
      .eq("id", id)
      .eq("competicao_id", competitionId)
      .select(SELECT_COLUMNS)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as unknown as Team | null;
  },

  async deleteByCompetitionAndId(competitionId: number, id: number): Promise<boolean> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("equipe")
      .delete()
      .eq("id", id)
      .eq("competicao_id", competitionId)
      .select("id");

    if (error) {
      throw error;
    }

    return (data ?? []).length > 0;
  },
};
