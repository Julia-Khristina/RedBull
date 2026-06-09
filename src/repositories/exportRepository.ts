import { Runner } from "../models/runner";
import { Checkpoint } from "../models/checkpoint";
import { Competition } from "../models/competition";
import { CompetitionExportData, ExportRepository } from "../models/export";
import { Team } from "../models/team";
import { getSupabaseClient } from "../database/supabaseClient";

const COMPETITION_SELECT = "id, nome:name, endereco:address, data, status, criado_em:created_at";
const TEAM_SELECT = "id, nome:name, uuid, qr_code, competicao_id:id_competition, criado_em:created_at";
const RUNNER_SELECT =
  "id, nome:name, status, email, telefone:phone, cpf, equipe_id:id_team, criado_em:created_at";
const CHECKPOINT_SELECT =
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

export const exportRepository: ExportRepository = {
  async findCompetitionExportData(
    competitionId: number
  ): Promise<CompetitionExportData | null> {
    const supabase = getSupabaseClient();

    const { data: competition, error: competitionError } = await supabase
      .from("competicao")
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
      .from("equipe")
      .select(TEAM_SELECT)
      .eq("competicao_id", competitionId)
      .order("id", { ascending: true });

    if (teamsError) {
      throw teamsError;
    }

    const teamIds = (teams ?? []).map((team: any) => team.id);
    const runners = await findRunnersByTeams(teamIds);

    const { data: checkpoints, error: checkpointsError } = await supabase
      .from("checkpoint")
      .select(CHECKPOINT_SELECT)
      .eq("competicao_id", competitionId)
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
    .from("corredor")
    .select(RUNNER_SELECT)
    .in("equipe_id", teamIds)
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as unknown as Runner[];
}
