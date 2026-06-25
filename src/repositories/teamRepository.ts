import {
  Team,
  TeamRepository,
  CreateTeamInput,
  UpdateTeamInput,
} from "../models/team";
import { getSupabaseClient } from "../database/supabaseClient";

const SELECT_COLUMNS = "id, name, uuid, qr_code, id_competition, created_at";
const activeRunnerByTeamId = new Map<number, number>();

function withActiveRunner(team: Team | null): Team | null {
  if (!team) return null;

  return {
    ...team,
    active_runner_id: activeRunnerByTeamId.get(team.id) ?? null,
  };
}

function withActiveRunners(teams: Team[]): Team[] {
  return teams.map((team) => withActiveRunner(team) as Team);
}

export const teamRepository: TeamRepository = {
  async create(input: CreateTeamInput & { runners?: any[] }): Promise<Team> {
    const supabase = getSupabaseClient();

    const { data: teamData, error: teamError } = await supabase
      .from("team")
      .insert({
        name: input.name,
        id_competition: input.id_competition,
      })
      .select(SELECT_COLUMNS)
      .single();

    if (teamError) {
      throw teamError;
    }

    if (input.runners && input.runners.length > 0) {
      const runnersToInsert = input.runners.map(runner => ({
        ...runner,
        id_team: teamData.id
      }));

      const { error: runnersError } = await supabase
        .from("runner")
        .insert(runnersToInsert);

      if (runnersError) {
        // Opcional: deletar a equipe se os atletas falharem para manter atomicidade
        await supabase.from("team").delete().eq("id", teamData.id);
        throw runnersError;
      }
    }

    return withActiveRunner(teamData as unknown as Team) as Team;
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

    return withActiveRunners((data ?? []) as unknown as Team[]);
  },

  async findByUuid(uuid: string): Promise<Team | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("team")
      .select(SELECT_COLUMNS)
      .eq("uuid", uuid)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return withActiveRunner(data as unknown as Team | null);
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

    return withActiveRunner(data as unknown as Team | null);
  },

  async findRunnerByTeamAndId(
    teamId: number,
    runnerId: number
  ): Promise<{ id: number } | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("runner")
      .select("id")
      .eq("id", runnerId)
      .eq("id_team", teamId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as { id: number } | null;
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

    return withActiveRunner(data as unknown as Team | null);
  },

  async setActiveRunnerByCompetitionAndId(
    competitionId: number,
    id: number,
    runnerId: number
  ): Promise<Team | null> {
    const team = await teamRepository.findByCompetitionAndId(competitionId, id);

    if (!team) {
      return null;
    }

    activeRunnerByTeamId.set(id, runnerId);

    return withActiveRunner(team);
  },

  async deleteByCompetitionAndId(competitionId: number, id: number): Promise<boolean> {
    const supabase = getSupabaseClient();

    const { error: runnersError } = await supabase
      .from("runner")
      .delete()
      .eq("id_team", id);

    if (runnersError) {
      throw runnersError;
    }

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
