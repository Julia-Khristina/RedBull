import {
  CompetitionReport,
  CompetitionReportView,
  ReportRepository,
} from "../models/report";
import { reportRepository } from "../repositories/reportRepository";
import { ValidationError } from "../errors/AppError";
import { checkpointService } from "./checkpointService";
import { competitionService } from "./competitionService";
import { rankingService } from "./rankingService";
import { Checkpoint } from "../models/checkpoint";
import { RankingTeam } from "../models/ranking";

function parseCompetitionId(value: unknown): number {
  const parsed = typeof value === "string" ? Number(value) : value;

  if (!Number.isInteger(parsed) || Number(parsed) <= 0) {
    throw new ValidationError("id deve ser um numero inteiro positivo");
  }

  return Number(parsed);
}

export function createReportService(
  repository: ReportRepository = reportRepository
) {
  function buildPositionHistory(
    checkpoints: Checkpoint[],
    teams: RankingTeam[]
  ): Array<{ label: string; teams: Array<{ team_name: string; position: number }> }> {
    const labels = ["0h", "06h", "12h", "18h", "24h"];

    if (teams.length === 0) {
      return labels.map((label) => ({ label, teams: [] }));
    }

    const sorted = [...checkpoints].sort((a, b) => {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    if (sorted.length === 0) {
      return labels.map((label) => ({
        label,
        teams: teams.map((team) => ({
          team_name: team.team_name,
          position: team.position,
        })),
      }));
    }

    const firstTime = new Date(sorted[0].created_at).getTime();
    const lastTime = new Date(sorted[sorted.length - 1].created_at).getTime();
    const duration = Math.max(lastTime - firstTime, 1);
    const distancesByTeam = new Map<number, number>();

    return labels.map((label, index) => {
      const sampleTime = firstTime + (duration * index) / (labels.length - 1);

      for (const checkpoint of sorted) {
        const checkpointTime = new Date(checkpoint.created_at).getTime();
        if (checkpointTime > sampleTime) break;

        const teamId = checkpoint.runner?.id_team;
        if (!teamId) continue;

        const current = distancesByTeam.get(teamId) ?? 0;
        distancesByTeam.set(teamId, Math.max(current, checkpoint.distance_km));
      }

      const positions = teams
        .map((team) => ({
          id_team: team.id_team,
          team_name: team.team_name,
          distance: distancesByTeam.get(team.id_team) ?? 0,
        }))
        .sort((a, b) => {
          if (b.distance !== a.distance) return b.distance - a.distance;
          return a.team_name.localeCompare(b.team_name);
        })
        .map((team, position) => ({
          team_name: team.team_name,
          position: position + 1,
        }));

      return { label, teams: positions };
    });
  }

function DadosKmPorHora(
    checkpoints: Checkpoint[],
    teams: RankingTeam[]
  ): { labels: string[]; datasets: Array<{ team_name: string; id_team: number; data: (number | null)[] }> } {
    const labels: string[] = [];
    for (let h = 0; h <= 24; h += 2) {
      labels.push(`${h}h`);
    }

    if (teams.length === 0) {
      return { labels, datasets: [] };
    }

    const sorted = [...checkpoints].sort((a, b) => {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    if (sorted.length === 0) {
      return {
        labels,
        datasets: teams.map((team) => ({
          team_name: team.team_name,
          id_team: team.id_team,
          data: labels.map(() => null),
        })),
      };
    }

    const firstTime = new Date(sorted[0].created_at).getTime();
    const lastTime = new Date(sorted[sorted.length - 1].created_at).getTime();

    const datasets = teams.map((team) => {
      const distancesByInterval = labels.map((label, index) => {
        const hours = index * 2;
        const sampleTime = firstTime + hours * 3600000;

        if (sampleTime > lastTime) return null;

        let maxDistance = 0;
        for (const checkpoint of sorted) {
          const checkpointTime = new Date(checkpoint.created_at).getTime();
          if (checkpointTime > sampleTime) break;

          if (checkpoint.runner?.id_team === team.id_team) {
            maxDistance = Math.max(maxDistance, checkpoint.distance_km);
          }
        }

        return Math.round(maxDistance * 100) / 100;
      });

      return {
        team_name: team.team_name,
        id_team: team.id_team,
        data: distancesByInterval,
      };
    });

    return { labels, datasets };
  }

  function mergeReportData(
    savedReport: CompetitionReport | null,
    data: Omit<CompetitionReportView, keyof CompetitionReport | "persisted">
  ): CompetitionReportView {
    const totalDistance = data.teamRanking.reduce(
      (sum, team) => sum + team.total_distance_km,
      0
    );
    const paceSamples = data.runnerRanking
      .map((runner) => runner.average_pace_seconds)
      .filter((pace): pace is number => pace !== null);
    const averagePaceSeconds =
      paceSamples.length > 0
        ? paceSamples.reduce((sum, pace) => sum + pace, 0) / paceSamples.length
        : null;
    const averagePaceRounded =
      averagePaceSeconds === null ? null : Math.round(averagePaceSeconds);
    const averagePace =
      averagePaceRounded === null
        ? null
        : `${String(Math.floor(averagePaceRounded / 60)).padStart(
            2,
            "0"
          )}:${String(averagePaceRounded % 60).padStart(2, "0")}`;

    const generatedSummary = {
      total_km: Number(totalDistance.toFixed(1)),
      average_pace: averagePace,
      total_checkpoints: data.checkpoints.length,
    };
    const generatedHighlights = {
      summary:
        "Veja como as equipes se movimentaram durante a competição ao longo do tempo.",
      teams: data.teamRanking.map((team) => ({
        id_team: team.id_team,
        name: team.team_name,
        position: team.position,
      })),
      position_history: buildPositionHistory(data.checkpoints, data.teamRanking),
      hourly_team_km: DadosKmPorHora(data.checkpoints, data.teamRanking),
    };

    return {
      id_competition: data.competition.id,
      summary: {
        ...generatedSummary,
        ...(savedReport?.summary ?? {}),
      },
      highlights: {
        ...generatedHighlights,
        ...(savedReport?.highlights ?? {}),
      },
      generated_at: savedReport?.generated_at ?? new Date().toISOString(),
      competition: data.competition,
      checkpoints: data.checkpoints,
      teamRanking: data.teamRanking,
      runnerRanking: data.runnerRanking,
      operatorRanking: data.operatorRanking,
      persisted: Boolean(savedReport),
    };
  }

  return {
    async generateCompetitionReport(
      competitionIdParam: unknown
    ): Promise<CompetitionReportView> {
      const competitionId = parseCompetitionId(competitionIdParam);
      const [competition, savedReport, checkpoints, teamRanking, runnerRanking, operatorRanking] =
        await Promise.all([
          competitionService.findById(competitionId),
          repository.generateCompetitionReport(competitionId),
          checkpointService.findByCompetition(competitionId),
          rankingService.generateTeamRanking(competitionId),
          rankingService.generateRunnerRanking(competitionId),
          rankingService.generateOperatorRanking(competitionId),
        ]);

      return mergeReportData(savedReport, {
        competition,
        checkpoints,
        teamRanking,
        runnerRanking,
        operatorRanking,
      });
    },
  };
}

export const reportService = createReportService();
