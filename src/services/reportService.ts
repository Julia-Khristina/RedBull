import { CompetitionReport, ReportRepository } from "../models/report";
import { reportRepository } from "../repositories/reportRepository";
import { NotFoundError, ValidationError } from "../errors/AppError";

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
  return {
    async generateCompetitionReport(
      competitionIdParam: unknown
    ): Promise<CompetitionReport> {
      const competitionId = parseCompetitionId(competitionIdParam);
      const report = await repository.generateCompetitionReport(competitionId);

      if (!report) {
        throw new NotFoundError("Competition report not found");
      }

      return report;
    },
  };
}

export const reportService = createReportService();
