import { Runner } from "../models/runner";
import { Checkpoint } from "../models/checkpoint";
import { Competition } from "../models/competition";
import { CompetitionExportData, ExportRepository } from "../models/export";
import { Team } from "../models/team";
import { getSupabaseClient } from "../database/supabaseClient";

const COMPETITION_SELECT = "id, name, address, date, status, created_at";
const TEAM_SELECT = "id, name, uuid, qr_code, id_competition, created_at";
const RUNNER_SELECT =
  "id, name, status, email, phone, cpf, id_team, created_at";
const CHECKPOINT_SELECT =
  "id, identifier, distance_km, pace, time, image, id_runner, id_competition, id_admin, created_at, runner:id_runner(id, name, id_team, team:id_team(id, name))";

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

export const exportRepository: ExportRepository = {
  async findCompetitionExportData(
    competitionId: number
  ): Promise<CompetitionExportData | null> {
    const supabase = getSupabaseClient();

    const { data: competition, error: competitionError } = await supabase
      .from("competition")
      .select(COMPETITION_SELECT)
      .eq("id", competitionId)
      .maybeSingle();

    if (competitionError) {
      throw competitionError;
    }

    if (!competition) {
      return null;
    }

    const { data: teams, error: teamsError } = await supabase
      .from("team")
      .select(TEAM_SELECT)
      .eq("id_competition", competitionId)
      .order("id", { ascending: true });

    if (teamsError) {
      throw teamsError;
    }

    const teamIds = (teams ?? []).map((team: any) => team.id);
    const runners = await findRunnersByTeams(teamIds);

    const { data: checkpoints, error: checkpointsError } = await supabase
      .from("checkpoint")
      .select(CHECKPOINT_SELECT)
      .eq("id_competition", competitionId)
      .order("id", { ascending: true });

    if (checkpointsError) {
      throw checkpointsError;
    }

    return {
      competition: competition as unknown as Competition,
      teams: (teams ?? []) as unknown as Team[],
      runners,
      checkpoints: normalizeCheckpoints(
        checkpoints as unknown as SupabaseCheckpoint[] | null
      ),
    };
  },
};

async function findRunnersByTeams(teamIds: number[]): Promise<Runner[]> {
  if (teamIds.length === 0) {
    return [];
  }

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("runner")
    .select(RUNNER_SELECT)
    .in("id_team", teamIds)
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as unknown as Runner[];
}
