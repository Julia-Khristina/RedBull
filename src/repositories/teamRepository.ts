import {
  Team,
  TeamRepository,
  CreateTeamInput,
  UpdateTeamInput,
} from "../models/team";
import { getSupabaseClient } from "../database/supabaseClient";

const SELECT_COLUMNS = "id, name, uuid, qr_code, id_competition, created_at";

export const teamRepository: TeamRepository = {
  async create(input: CreateTeamInput): Promise<Team> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("team")
      .insert({
        name: input.name,
        id_competition: input.id_competition,
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
      .from("team")
      .select(SELECT_COLUMNS)
      .eq("id_competition", competitionId);

    if (error) {
      throw error;
    }

    return (data ?? []) as unknown as Team[];
  },

  async findByCompetitionAndId(competitionId: number, id: number): Promise<Team | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("team")
      .select(SELECT_COLUMNS)
      .eq("id", id)
      .eq("id_competition", competitionId)
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
      payload.name = input.name;
    }

    const { data, error } = await supabase
      .from("team")
      .update(payload)
      .eq("id", id)
      .eq("id_competition", competitionId)
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
      .from("team")
      .delete()
      .eq("id", id)
      .eq("id_competition", competitionId)
      .select("id");

    if (error) {
      throw error;
    }

    return (data ?? []).length > 0;
  },
};
