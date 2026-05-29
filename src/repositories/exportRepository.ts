import { Athlete } from "../models/athlete";
import { Checkpoint } from "../models/checkpoint";
import { Competition } from "../models/competition";
import { CompetitionExportData, ExportRepository } from "../models/export";
import { Team } from "../models/team";
import { getSupabaseClient } from "../database/supabaseClient";

const COMPETITION_SELECT = "id, nome, endereco, data, status, criado_em";
const TEAM_SELECT = "id, nome, uuid, qr_code, competicao_id, criado_em";
const ATHLETE_SELECT =
  "id, nome, status, email, telefone, cpf, equipe_id, criado_em";
const CHECKPOINT_SELECT =
  "id, identificador, km, pace, tempo, imagem, corredor_id, competicao_id, esteira_id, administrador_id, criado_em, corredor:corredor_id(id, nome, equipe_id)";

type SupabaseCheckpoint = Omit<Checkpoint, "corredor"> & {
  corredor?: Checkpoint["corredor"] | Checkpoint["corredor"][];
};

function normalizeCheckpoint(data: SupabaseCheckpoint): Checkpoint {
  const corredor = Array.isArray(data.corredor)
    ? data.corredor[0] ?? null
    : data.corredor ?? null;

  return { ...data, corredor };
}

function normalizeCheckpoints(data: SupabaseCheckpoint[] | null): Checkpoint[] {
  return (data ?? []).map(normalizeCheckpoint);
}

export const exportRepository: ExportRepository = {
  async findCompetitionExportData(
    competicaoId: number
  ): Promise<CompetitionExportData | null> {
    const supabase = getSupabaseClient();

    const { data: competition, error: competitionError } = await supabase
      .from("competicao")
      .select(COMPETITION_SELECT)
      .eq("id", competicaoId)
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
      .eq("competicao_id", competicaoId)
      .order("id", { ascending: true });

    if (teamsError) {
      throw teamsError;
    }

    const teamIds = (teams ?? []).map((team) => team.id);
    const athletes = await findAthletesByTeams(teamIds);

    const { data: checkpoints, error: checkpointsError } = await supabase
      .from("checkpoint")
      .select(CHECKPOINT_SELECT)
      .eq("competicao_id", competicaoId)
      .order("id", { ascending: true });

    if (checkpointsError) {
      throw checkpointsError;
    }

    return {
      competition: competition as Competition,
      teams: (teams ?? []) as Team[],
      athletes,
      checkpoints: normalizeCheckpoints(
        checkpoints as unknown as SupabaseCheckpoint[] | null
      ),
    };
  },
};

async function findAthletesByTeams(teamIds: number[]): Promise<Athlete[]> {
  if (teamIds.length === 0) {
    return [];
  }

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("corredor")
    .select(ATHLETE_SELECT)
    .in("equipe_id", teamIds)
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Athlete[];
}
