import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { checkpointService } from "../services/checkpointService";
import { reportService } from "../services/reportService";
import { competitionService } from "../services/competitionService";

export const reportController = {
  async renderReports(req: Request, res: Response): Promise<void> {
    try {
      const report = await reportService.generateCompetitionReport(req.params.id);
      const inconsistencies =
        await checkpointService.findInconsistenciesByCompetition(
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
        const competitionId = Number(req.params.id);
        const normalizedCompetitionId = Number.isInteger(competitionId)
          ? competitionId
          : 0;

        res.status(error.statusCode).render("reports/reports", {
          title: "Relatórios - Red Bull 24H",
          report: {
            id_competition: normalizedCompetitionId,
            summary: {},
            highlights: {},
            generated_at: "",
            checkpoints: [],
            teamRanking: [],
            runnerRanking: [],
            persisted: false,
          },
          inconsistencies: [],
          competition: {
            id: normalizedCompetitionId,
            name: normalizedCompetitionId
              ? `Competição #${normalizedCompetitionId}`
              : "Competição inválida",
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
        report: {
          id_competition: 0,
          summary: {},
          highlights: {},
          generated_at: "",
          checkpoints: [],
          teamRanking: [],
          runnerRanking: [],
          persisted: false,
        },
        inconsistencies: [],
        competition: {
          id: 0,
          name: "Competição indisponível",
        },
        currentPage: "reports",
        error: "Não foi possível carregar os dados do relatório.",
      });
    }
  },

  async generateCompetitionReport(
    req: Request,
    res: Response
  ): Promise<void> {
    const report = await reportService.generateCompetitionReport(req.params.id);
    res.status(200).json(report);
  },

  async renderReports(req: Request, res: Response): Promise<void> {
    const competition = await competitionService.findById(req.params.id);
    const highlights = await reportService.generateCompetitionReport(req.params.id);
    res.render("reports/reports", {
      title: `Relatorio — ${competition.name}`,
      competition,
      highlights,
      currentPage: "reports",
    });
  },
};
