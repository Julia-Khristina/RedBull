import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { checkpointService } from "../services/checkpointService";
import { competitionService } from "../services/competitionService";
import { reportService } from "../services/reportService";
import { resolveSelectedCompetitionId } from "../helpers/selectedCompetition";

function parseCompetitionId(value: unknown): number {
  const parsed =
    typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return 0;
  }

  return parsed;
}

async function findCompetitionForView(req: Request) {
  const requestedId = parseCompetitionId(resolveSelectedCompetitionId(req));
  if (requestedId > 0) {
    return competitionService.findById(requestedId);
  }

  return null;
}

function emptyReport(competitionId: number) {
  return {
    id_competition: competitionId,
    summary: {},
    highlights: {},
    generated_at: "",
    checkpoints: [],
    teamRanking: [],
    runnerRanking: [],
    operatorRanking: [],
    persisted: false,
  };
}

function renderCompetitionRequired(res: Response): void {
  res.status(400).render("reports/competition-required", {
    title: "Selecione uma competição — Red Bull 24h",
    currentPage: "reports",
    pageCSS: "/css/ranking.css",
  });
}

async function renderReportByCompetitionId(
  res: Response,
  competitionId: number,
  fallbackCompetition?: { id: number; name: string; date?: string }
): Promise<void> {
  try {
    const report = await reportService.generateCompetitionReport(competitionId);
    const inconsistencies = await checkpointService.findInconsistenciesByCompetition(
      report.id_competition
    );

    res.render("reports/reports", {
      title: "Relatórios - Red Bull 24H",
      report,
      inconsistencies,
      competition: report.competition,
      currentPage: "reports",
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).render("reports/reports", {
        title: "Relatórios - Red Bull 24H",
        report: emptyReport(competitionId),
        inconsistencies: [],
        competition: fallbackCompetition ?? {
          id: competitionId,
          name: competitionId ? `Competição #${competitionId}` : "Competição inválida",
        },
        currentPage: "reports",
        error:
          error.statusCode === 404
            ? "Competição não encontrada para este relatório."
            : "Não foi possível carregar os dados do relatório.",
      });
      return;
    }

    res.status(500).render("reports/reports", {
      title: "Relatórios - Red Bull 24H",
      report: emptyReport(0),
      inconsistencies: [],
      competition: {
        id: 0,
        name: "Competição indisponível",
      },
      currentPage: "reports",
      error: "Não foi possível carregar os dados do relatório.",
    });
  }
}

export const reportController = {
  async renderActiveReports(req: Request, res: Response): Promise<void> {
    const competition = await findCompetitionForView(req);

    if (!competition) {
      renderCompetitionRequired(res);
      return;
    }

    await renderReportByCompetitionId(res, competition.id, competition);
  },

  async redirectToAvailableReport(req: Request, res: Response): Promise<void> {
    await this.renderActiveReports(req, res);
  },

  async renderReports(req: Request, res: Response): Promise<void> {
    const competitionId = parseCompetitionId(req.params.id);
    await renderReportByCompetitionId(res, competitionId);
  },

  async generateCompetitionReport(
    req: Request,
    res: Response
  ): Promise<void> {
    const report = await reportService.generateCompetitionReport(req.params.id);
    res.status(200).json(report);
  },
};
