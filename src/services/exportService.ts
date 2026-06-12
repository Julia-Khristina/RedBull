import { NotFoundError, ValidationError } from "../errors/AppError";
import { CompetitionExport, ExportRepository } from "../models/export";
import { exportRepository } from "../repositories/exportRepository";
import { rankingService } from "./rankingService";

type RankingServiceDependency = Pick<
  typeof rankingService,
  "generateTeamRanking" | "generateRunnerRanking"
>;

function parseCompetitionId(value: unknown): number {
  const parsed = typeof value === "string" ? Number(value) : NaN;

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ValidationError("competitionId deve ser um numero inteiro positivo");
  }

  return parsed;
}

export function createExportService(
  repository: ExportRepository = exportRepository,
  rankings: RankingServiceDependency = rankingService
) {
  return {
    async exportCompetition(competitionIdParam: unknown): Promise<CompetitionExport> {
      const competitionId = parseCompetitionId(competitionIdParam);
      const data = await repository.findCompetitionExportData(competitionId);

      if (!data) {
        throw new NotFoundError("Competicao nao encontrada");
      }

      const [rankingTeams, rankingRunners] = await Promise.all([
        rankings.generateTeamRanking(competitionId),
        rankings.generateRunnerRanking(competitionId),
      ]);

      return {
        exported_at: new Date().toISOString(),
        competition: data.competition,
        teams: data.teams,
        runners: data.runners,
        checkpoints: data.checkpoints,
        rankings: {
          teams: rankingTeams.filter((team) => team.total_distance_km > 0),
          runners: rankingRunners,
        },
      };
    },
  };
}

export const exportService = createExportService();
