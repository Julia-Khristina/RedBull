import { Request, Response } from "express";
import { reportService } from "../services/reportService";
import { competitionService } from "../services/competitionService";
import { NotFoundError } from "../errors/AppError";

function parseCompetitionId(value: unknown): number {
  const parsed = typeof value === "string" ? Number(value) : NaN;

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return 0;
  }

  return parsed;
}

async function findCompetitionForView(req: Request) {
  const requestedId = parseCompetitionId(req.params.id ?? req.query.competitionId);
  if (requestedId > 0) {
    return competitionService.findById(requestedId);
  }

  const competitions = await competitionService.findAll();
  return competitions[0] ?? null;
}

export const reportController = {
  async renderActiveReports(req: Request, res: Response): Promise<void> {
    const competition = await findCompetitionForView(req);
    let highlights = null;

    if (!competition) {
      res.render("reports/reports", {
        title: "Relatórios — Red Bull 24h",
        competition: { id: 0, name: "Competição não selecionada", status: "not_started" },
        highlights,
        currentPage: "reports",
        pageCSS: "/css/ranking.css",
      });
      return;
    }

    try {
      highlights = await reportService.generateCompetitionReport(competition.id);
    } catch (error) {
      if (!(error instanceof NotFoundError)) {
        throw error;
      }
    }

    res.render("reports/reports", {
      title: "Relatórios — Red Bull 24h",
      competition,
      highlights,
      currentPage: "reports",
      pageCSS: "/css/ranking.css",
    });
  },

  async renderReports(req: Request, res: Response): Promise<void> {
    const competition = await competitionService.findById(req.params.id);
    let highlights = null;

    try {
      highlights = await reportService.generateCompetitionReport(req.params.id);
    } catch (error) {
      if (!(error instanceof NotFoundError)) {
        throw error;
      }
    }

    res.render("reports/reports", {
      title: "Relatórios — Red Bull 24h",
      competition,
      highlights,
      currentPage: "reports",
      pageCSS: "/css/ranking.css",
    });
  },

  async generateCompetitionReport(
    req: Request,
    res: Response
  ): Promise<void> {
    const report = await reportService.generateCompetitionReport(req.params.id);
    res.status(200).json(report);
  },
};
