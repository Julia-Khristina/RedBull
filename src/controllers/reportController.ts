import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { checkpointService } from "../services/checkpointService";
import { competitionService } from "../services/competitionService";
import { reportService } from "../services/reportService";

function emptyReport(competitionId: number) {
  return {
    id_competition: competitionId,
    summary: {},
    highlights: {},
    generated_at: "",
    checkpoints: [],
    teamRanking: [],
    runnerRanking: [],
    persisted: false,
  };
}

export const reportController = {
  async redirectToAvailableReport(_req: Request, res: Response): Promise<void> {
    const competitions = await competitionService.findAll();
    const selectedCompetition =
      competitions.find((competition) => competition.status === "in_progress") ??
      [...competitions].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })[0];

    if (!selectedCompetition) {
      res.status(404).render("reports/reports", {
        title: "Relatórios - Red Bull 24H",
        report: emptyReport(0),
        inconsistencies: [],
        competition: {
          id: 0,
          name: "Competição indisponível",
        },
        currentPage: "reports",
        error: "Cadastre uma competição antes de acessar relatórios.",
      });
      return;
    }

    res.redirect(`/view/competitions/${selectedCompetition.id}/reports`);
  },

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
          report: emptyReport(normalizedCompetitionId),
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
  },

  async generateCompetitionReport(
    req: Request,
    res: Response
  ): Promise<void> {
    const report = await reportService.generateCompetitionReport(req.params.id);
    res.status(200).json(report);
  },
};
