import { NotFoundError, ValidationError } from "../errors/AppError";
import { CompetitionExport, ExportRepository } from "../models/export";
import { exportRepository } from "../repositories/exportRepository";
import { rankingService } from "./rankingService";

type RankingServiceDependency = Pick<
  typeof rankingService,
  "gerarRankingEquipes" | "gerarRankingCorredores"
>;

function parseCompetitionId(value: unknown): number {
  const parsed = typeof value === "string" ? Number(value) : NaN;

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ValidationError("competicaoId deve ser um numero inteiro positivo");
  }

  return parsed;
}

export function createExportService(
  repository: ExportRepository = exportRepository,
  rankings: RankingServiceDependency = rankingService
) {
  return {
    async exportCompetition(competicaoIdParam: unknown): Promise<CompetitionExport> {
      const competicaoId = parseCompetitionId(competicaoIdParam);
      const data = await repository.findCompetitionExportData(competicaoId);

      if (!data) {
        throw new NotFoundError("Competicao nao encontrada");
      }

      const [rankingTeams, rankingAthletes] = await Promise.all([
        rankings.gerarRankingEquipes(competicaoId),
        rankings.gerarRankingCorredores(competicaoId),
      ]);

      return {
        exportedAt: new Date().toISOString(),
        competition: data.competition,
        teams: data.teams,
        athletes: data.athletes,
        checkpoints: data.checkpoints,
        rankings: {
          teams: rankingTeams,
          athletes: rankingAthletes,
        },
      };
    },
  };
}

export const exportService = createExportService();
