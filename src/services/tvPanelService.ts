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

/* Marco zero = competition.started_at (gravado por competitionRepository
   .activate() — feature #557). Antes essa função usava o primeiro
   checkpoint como proxy do início; agora a contagem regressiva começa
   exatamente quando o admin aperta "ativar competição".

   endedAt continua usando o último checkpoint quando a competição está
   closed — não temos campo competition.closed_at e o último registro é
   o melhor proxy do término real. */
function resolveCompetitionTimeWindow(
  status: CompetitionStatus,
  startedAtIso: string | null,
  checkpoints: Checkpoint[]
): CompetitionTimeWindow {
  if (!startedAtIso) {
    return { startedAt: null, endedAt: null };
  }

  const startedAt = new Date(startedAtIso);

  if (status !== "closed" || checkpoints.length === 0) {
    return { startedAt, endedAt: null };
  }

  const lastCheckpoint = checkpoints.reduce((latest, current) =>
    Date.parse(current.created_at) > Date.parse(latest.created_at)
      ? current
      : latest
  );

  return { startedAt, endedAt: new Date(lastCheckpoint.created_at) };
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
        competition.started_at,
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
