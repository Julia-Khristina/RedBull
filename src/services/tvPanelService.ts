import { CompetitionStatus } from "../models/competition";
import { Checkpoint } from "../models/checkpoint";
import {
  TvPanelMetrics,
  TvPanelResponse,
  TvPanelTopTeam,
} from "../models/tvPanel";
import { checkpointRepository } from "../repositories/checkpointRepository";
import { competitionService } from "./competitionService";
import { rankingService } from "./rankingService";

const DEFAULT_TOP_N = 3;

type CompetitionServiceDependency = Pick<typeof competitionService, "findById">;
type CheckpointRepositoryDependency = Pick<
  typeof checkpointRepository,
  "findByCompetition"
>;
type RankingServiceDependency = Pick<
  typeof rankingService,
  "generateRunnerRanking" | "generateTeamRanking"
>;

interface CompetitionTimeWindow {
  startedAt: Date | null;
  endedAt: Date | null;
}

function formatElapsedTime(seconds: number | null): string | null {
  if (seconds === null || !Number.isFinite(seconds) || seconds < 0) return null;

  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remaining = total % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}

function formatPace(seconds: number | null): string | null {
  if (seconds === null || !Number.isFinite(seconds)) return null;

  const rounded = Math.round(seconds);
  const minutes = Math.floor(rounded / 60);
  const remainingSeconds = String(rounded % 60).padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

// TODO(US19 #519): substituir por leitura direta de competition.started_at
// e competition.ended_at quando a feature de iniciar/finalizar competição
// do grupo entrar. Esta é a ÚNICA função do tvPanelService afetada por
// essa mudança; o restante do service permanece intacto.
function resolveCompetitionTimeWindow(
  status: CompetitionStatus,
  checkpoints: Checkpoint[]
): CompetitionTimeWindow {
  if (checkpoints.length === 0) {
    return { startedAt: null, endedAt: null };
  }

  const orderedAsc = [...checkpoints].sort(
    (a, b) => Date.parse(a.created_at) - Date.parse(b.created_at)
  );

  const startedAt = new Date(orderedAsc[0].created_at);
  const endedAt =
    status === "closed"
      ? new Date(orderedAsc[orderedAsc.length - 1].created_at)
      : null;

  return { startedAt, endedAt };
}

function calculateElapsedSeconds(
  window: CompetitionTimeWindow,
  now: Date
): number | null {
  if (!window.startedAt) return null;

  const referenceEnd = window.endedAt ?? now;
  const seconds = Math.floor(
    (referenceEnd.getTime() - window.startedAt.getTime()) / 1000
  );

  return seconds < 0 ? 0 : seconds;
}

export function createTvPanelService(
  competitions: CompetitionServiceDependency = competitionService,
  checkpointsRepo: CheckpointRepositoryDependency = checkpointRepository,
  rankings: RankingServiceDependency = rankingService
) {
  return {
    async generateMetrics(
      competitionId: number,
      topN: number = DEFAULT_TOP_N
    ): Promise<TvPanelResponse> {
      const [competition, competitionCheckpoints, runnerRanking, teamRanking] =
        await Promise.all([
          competitions.findById(competitionId),
          checkpointsRepo.findByCompetition(competitionId),
          rankings.generateRunnerRanking(competitionId),
          rankings.generateTeamRanking(competitionId),
        ]);

      const window = resolveCompetitionTimeWindow(
        competition.status,
        competitionCheckpoints
      );
      const elapsedSeconds = calculateElapsedSeconds(window, new Date());

      const totalDistanceKm = runnerRanking.reduce(
        (sum, runner) => sum + runner.total_distance_km,
        0
      );

      let weightedPaceSum = 0;
      let weightSum = 0;
      for (const runner of runnerRanking) {
        if (
          runner.average_pace_seconds !== null &&
          runner.total_distance_km > 0
        ) {
          weightedPaceSum +=
            runner.average_pace_seconds * runner.total_distance_km;
          weightSum += runner.total_distance_km;
        }
      }
      const averagePaceOverallSeconds =
        weightSum > 0 ? weightedPaceSum / weightSum : null;

      const topTeams: TvPanelTopTeam[] = teamRanking
        .slice(0, topN)
        .map((team) => ({
          position: team.position,
          id_team: team.id_team,
          team_name: team.team_name,
          total_distance_km: team.total_distance_km,
          average_pace: team.average_pace,
          average_pace_seconds: team.average_pace_seconds,
        }));

      const metrics: TvPanelMetrics = {
        average_pace_overall: formatPace(averagePaceOverallSeconds),
        average_pace_overall_seconds: averagePaceOverallSeconds,
        elapsed_time: formatElapsedTime(elapsedSeconds),
        elapsed_time_seconds: elapsedSeconds,
        total_distance_km: totalDistanceKm,
        top_teams: topTeams,
      };

      return {
        id_competition: competition.id,
        competition_name: competition.name,
        competition_status: competition.status,
        metrics,
        generated_at: new Date().toISOString(),
      };
    },
  };
}

export const tvPanelService = createTvPanelService();
