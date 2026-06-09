import { Checkpoint } from "../models/checkpoint";
import { RankingRunner, RankingTeam } from "../models/ranking";
import { checkpointService } from "./checkpointService";
import { teamService } from "./teamService";

type CheckpointServiceDependency = Pick<
  typeof checkpointService,
  "findByCompetition"
>;

type TeamServiceDependency = Pick<typeof teamService, "findByCompetition">;

interface RunnerAggregate {
  id_runner: number;
  runner_name: string | null;
  id_team: number | null;
  total_distance_km: number;
  time_seconds: number | null;
  pace_seconds: number | null;
  pace_samples: number;
}

interface TeamAggregate {
  id_team: number;
  team_name: string;
  id_competition: number;
  total_distance_km: number;
  time_seconds: number | null;
  pace_seconds_total: number;
  pace_samples: number;
  runners: Set<number>;
}

function parseTimeToSeconds(value: string | null): number | null {
  if (!value) return null;

  const parts = value.split(":").map((part) => Number(part));

  if (parts.some((part) => !Number.isFinite(part) || part < 0)) {
    return null;
  }

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }

  return null;
}

function formatPace(seconds: number | null): string | null {
  if (seconds === null || !Number.isFinite(seconds)) return null;

  const rounded = Math.round(seconds);
  const minutes = Math.floor(rounded / 60);
  const remainingSeconds = String(rounded % 60).padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

function getCheckpointPaceSeconds(checkpoint: Checkpoint): number | null {
  const timeSeconds = parseTimeToSeconds(checkpoint.time);

  if (timeSeconds !== null && checkpoint.distance_km > 0) {
    return timeSeconds / checkpoint.distance_km;
  }

  return parseTimeToSeconds(checkpoint.pace);
}

function compareRanking(
  a: { total_distance_km: number; average_pace_seconds: number | null },
  b: { total_distance_km: number; average_pace_seconds: number | null }
): number {
  if (b.total_distance_km !== a.total_distance_km) return b.total_distance_km - a.total_distance_km;

  const aPace = a.average_pace_seconds ?? Number.POSITIVE_INFINITY;
  const bPace = b.average_pace_seconds ?? Number.POSITIVE_INFINITY;

  return aPace - bPace;
}

function withPositions<
  T extends {
    position: number;
    total_distance_km: number;
    average_pace_seconds: number | null;
  },
>(
  ranking: Omit<T, "position">[]
): T[] {
  return ranking
    .sort(compareRanking)
    .map((item, index) => ({ ...item, position: index + 1 }) as T);
}

export function createRankingService(
  checkpoints: CheckpointServiceDependency = checkpointService,
  teams: TeamServiceDependency = teamService
) {
  async function generateRunnerRanking(
    competitionId: number
  ): Promise<RankingRunner[]> {
    const competitionCheckpoints =
      await checkpoints.findByCompetition(competitionId);

    const aggregates = new Map<number, RunnerAggregate>();

    for (const checkpoint of competitionCheckpoints) {
      const current = aggregates.get(checkpoint.id_runner);
      const paceSeconds = getCheckpointPaceSeconds(checkpoint);
      const timeSeconds = parseTimeToSeconds(checkpoint.time);

      if (!current || checkpoint.distance_km > current.total_distance_km) {
        aggregates.set(checkpoint.id_runner, {
          id_runner: checkpoint.id_runner,
          runner_name: checkpoint.runner?.name ?? null,
          id_team: checkpoint.runner?.id_team ?? null,
          total_distance_km: checkpoint.distance_km,
          time_seconds: timeSeconds,
          pace_seconds: paceSeconds,
          pace_samples: paceSeconds === null ? 0 : 1,
        });
        continue;
      }

      if (paceSeconds !== null) {
        current.pace_seconds = (current.pace_seconds ?? 0) + paceSeconds;
        current.pace_samples += 1;
      }
    }

    const ranking = Array.from(aggregates.values()).map((runner) => {
      const averagePaceSeconds =
        runner.time_seconds !== null && runner.total_distance_km > 0
          ? runner.time_seconds / runner.total_distance_km
          : runner.pace_samples > 0 && runner.pace_seconds !== null
            ? runner.pace_seconds / runner.pace_samples
            : null;

      return {
        id_runner: runner.id_runner,
        runner_name: runner.runner_name,
        id_team: runner.id_team,
        total_distance_km: runner.total_distance_km,
        average_pace: formatPace(averagePaceSeconds),
        average_pace_seconds: averagePaceSeconds,
      };
    });

    return withPositions<RankingRunner>(ranking);
  }

  return {
    generateRunnerRanking,

    async generateTeamRanking(competitionId: number): Promise<RankingTeam[]> {
      const [teamsData, runnerRanking] = await Promise.all([
        teams.findByCompetition(competitionId),
        generateRunnerRanking(competitionId),
      ]);

      const teamById = new Map(teamsData.map((team) => [team.id, team]));
      const aggregates = new Map<number, TeamAggregate>();

      for (const runner of runnerRanking) {
        if (runner.id_team === null) continue;

        const team = teamById.get(runner.id_team);
        if (!team) continue;

        const current =
          aggregates.get(team.id) ??
          ({
            id_team: team.id,
            team_name: team.name,
            id_competition: team.id_competition,
            total_distance_km: 0,
            time_seconds: null,
            pace_seconds_total: 0,
            pace_samples: 0,
            runners: new Set<number>(),
          } satisfies TeamAggregate);

        current.total_distance_km += runner.total_distance_km;
        current.runners.add(runner.id_runner);

        if (runner.average_pace_seconds !== null) {
          current.pace_seconds_total += runner.average_pace_seconds;
          current.pace_samples += 1;
        }

        aggregates.set(team.id, current);
      }

      const ranking = Array.from(aggregates.values()).map((team) => {
        const averagePaceSeconds =
          team.pace_samples > 0
            ? team.pace_seconds_total / team.pace_samples
            : null;

        return {
          id_team: team.id_team,
          team_name: team.team_name,
          id_competition: team.id_competition,
          total_distance_km: team.total_distance_km,
          average_pace: formatPace(averagePaceSeconds),
          average_pace_seconds: averagePaceSeconds,
          runner_count: team.runners.size,
        };
      });

      return withPositions<RankingTeam>(ranking);
    },

    calculatePositions<
      T extends {
        position: number;
        total_distance_km: number;
        average_pace_seconds: number | null;
      },
    >(
      ranking: Omit<T, "position">[]
    ): T[] {
      return withPositions<T>(ranking);
    },

    calculateAveragePace(time: string | null, km: number): number | null {
      const timeSeconds = parseTimeToSeconds(time);
      return timeSeconds !== null && km > 0 ? timeSeconds / km : null;
    },
  };
}

export const rankingService = createRankingService();
