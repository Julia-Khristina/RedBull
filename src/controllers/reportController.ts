import { Request, Response } from "express";
import { reportService } from "../services/reportService";
import { competitionService } from "../services/competitionService";

export const reportController = {
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
