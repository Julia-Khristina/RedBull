import { Checkpoint } from "../models/checkpoint";
import { RankingRunner, RankingTeam, OperatorRanking } from "../models/ranking";
import { checkpointService } from "./checkpointService";
import { teamService } from "./teamService";
import { inferInputMethod } from "../helpers/inferInputMethod";

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
  total_checkpoints: number;
}

interface TeamAggregate {
  id_team: number;
  team_name: string;
  id_competition: number;
  total_distance_km: number;
  time_seconds_total: number;
  time_samples: number;
  pace_seconds_total: number;
  pace_samples: number;
  runners: Set<number>;
  total_turns: number;
}

function parseTimeToSeconds(value: string | null): number | null {
  if (!value) return null;

  const normalized = value.trim().replace(/\s*\/\s*km$/i, "");
  const parts = normalized.split(":").map((part) => Number(part));

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

  return `${String(minutes).padStart(2, "0")}:${remainingSeconds}`;
}

function formatTime(seconds: number | null): string | null {
  if (seconds === null || !Number.isFinite(seconds)) return null;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
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
    const [competitionCheckpoints, teamsData] = await Promise.all([
      checkpoints.findByCompetition(competitionId),
      teams.findByCompetition(competitionId),
    ]);

    const teamNameById = new Map<number, string>(
      teamsData.map((team) => [team.id, team.name])
    );

    const aggregates = new Map<number, RunnerAggregate>();
    const latestCheckpointByRunner = new Map<number, Checkpoint>();
    const checkpointCountByRunner = new Map<number, number>();

    for (const checkpoint of competitionCheckpoints) {
      const runnerId = checkpoint.id_runner;

      checkpointCountByRunner.set(runnerId, (checkpointCountByRunner.get(runnerId) ?? 0) + 1);

      const current = aggregates.get(runnerId);
      const paceSeconds = getCheckpointPaceSeconds(checkpoint);
      const timeSeconds = parseTimeToSeconds(checkpoint.time);
      const previousLatest = latestCheckpointByRunner.get(runnerId);
      const checkpointTime = Date.parse(checkpoint.created_at) || 0;
      const previousTime = previousLatest ? Date.parse(previousLatest.created_at) || 0 : 0;

      if (!previousLatest || checkpointTime > previousTime) {
        latestCheckpointByRunner.set(runnerId, checkpoint);
      }

      if (!current || checkpoint.distance_km > current.total_distance_km) {
        aggregates.set(runnerId, {
          id_runner: runnerId,
          runner_name: checkpoint.runner?.name ?? null,
          id_team: checkpoint.runner?.id_team ?? null,
          total_distance_km: checkpoint.distance_km,
          time_seconds: timeSeconds,
          pace_seconds: paceSeconds,
          pace_samples: paceSeconds === null ? 0 : 1,
          total_checkpoints: 1,
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

      const latestCheckpoint = latestCheckpointByRunner.get(runner.id_runner);
      const totalCheckpoints = checkpointCountByRunner.get(runner.id_runner) ?? 0;

      return {
        id_runner: runner.id_runner,
        runner_name: runner.runner_name,
        id_team: runner.id_team,
        team_name: runner.id_team ? teamNameById.get(runner.id_team) ?? null : null,
        last_checkpoint: latestCheckpoint?.identifier ?? null,
        treadmill_time: latestCheckpoint?.time ?? latestCheckpoint?.pace ?? null,
        total_distance_km: runner.total_distance_km,
        average_pace: formatPace(averagePaceSeconds),
        average_pace_seconds: averagePaceSeconds,
        total_turns: totalCheckpoints,
        total_checkpoints: totalCheckpoints,
      };
    });

    return withPositions<RankingRunner>(ranking);
  }

  return {
    generateRunnerRanking,

    async generateTeamRanking(competitionId: number): Promise<RankingTeam[]> {
      const [teamsData, runnerRanking, competitionCheckpoints] = await Promise.all([
        teams.findByCompetition(competitionId),
        generateRunnerRanking(competitionId),
        checkpoints.findByCompetition(competitionId),
      ]);

      const teamById = new Map(teamsData.map((team) => [team.id, team]));
      const aggregates = new Map<number, TeamAggregate>();

      for (const team of teamsData) {
        aggregates.set(team.id, {
          id_team: team.id,
          team_name: team.name,
          id_competition: team.id_competition,
          total_distance_km: 0,
          time_seconds_total: 0,
          time_samples: 0,
          pace_seconds_total: 0,
          pace_samples: 0,
          runners: new Set<number>(),
          total_turns: 0,
        });
      }

      for (const checkpoint of competitionCheckpoints) {
        const teamId = checkpoint.runner?.id_team;
        if (!teamId) continue;

        const current = aggregates.get(teamId);
        if (!current) continue;

        current.total_turns += 1;

        const timeSeconds = parseTimeToSeconds(checkpoint.time);
        if (timeSeconds !== null) {
          current.time_seconds_total += timeSeconds;
          current.time_samples += 1;
        }
      }

      for (const runner of runnerRanking) {
        if (runner.id_team === null) continue;

        const team = teamById.get(runner.id_team);
        if (!team) continue;

        const current = aggregates.get(team.id);
        if (!current) continue;

        current.total_distance_km += runner.total_distance_km;
        current.runners.add(runner.id_runner);

        if (runner.average_pace_seconds !== null) {
          current.pace_seconds_total += runner.average_pace_seconds;
          current.pace_samples += 1;
        }
      }

      const ranking = Array.from(aggregates.values()).map((team) => {
        const averagePaceSeconds =
          team.pace_samples > 0
            ? team.pace_seconds_total / team.pace_samples
            : null;

        const averageTimePerTurnSeconds =
          team.time_samples > 0
            ? team.time_seconds_total / team.time_samples
            : null;

        return {
          id_team: team.id_team,
          team_name: team.team_name,
          id_competition: team.id_competition,
          total_distance_km: team.total_distance_km,
          average_pace: formatPace(averagePaceSeconds),
          average_pace_seconds: averagePaceSeconds,
          runner_count: team.runners.size,
          average_time_per_turn: formatTime(averageTimePerTurnSeconds),
          average_time_per_turn_seconds: averageTimePerTurnSeconds,
          total_turns: team.total_turns,
        };
      });

      return withPositions<RankingTeam>(ranking);
    },

    async generateOperatorRanking(competitionId: number): Promise<OperatorRanking[]> {
      const competitionCheckpoints = await checkpoints.findByCompetition(competitionId);
      const operatorMap = new Map<number, { manual: number; ocr: number; name: string | null }>();

      for (const checkpoint of competitionCheckpoints) {
        const adminId = checkpoint.id_admin;
        if (!operatorMap.has(adminId)) {
          operatorMap.set(adminId, { manual: 0, ocr: 0, name: checkpoint.admin?.name ?? null });
        }

        const entry = operatorMap.get(adminId)!;
        const inputMethod = inferInputMethod(
          checkpoint.identifier,
          checkpoint.image as Record<string, unknown> | null
        );
        if (inputMethod === "manual" || inputMethod === "corrigido") {
          entry.manual += 1;
        } else if (inputMethod === "ocr") {
          entry.ocr += 1;
        }
      }

      return Array.from(operatorMap.entries())
        .map(([id_admin, data]) => ({
          id_admin,
          admin_name: data.name,
          manual_checkpoints: data.manual,
          ocr_checkpoints: data.ocr,
          total_checkpoints: data.manual + data.ocr,
        }))
        .sort((a, b) => b.total_checkpoints - a.total_checkpoints);
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