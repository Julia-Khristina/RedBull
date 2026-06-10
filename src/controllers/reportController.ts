import { Request, Response } from "express";
import { reportService } from "../services/reportService";

export const reportController = {
  async generateCompetitionReport(
    req: Request,
    res: Response
  ): Promise<void> {
    const report = await reportService.generateCompetitionReport(req.params.id);
    res.status(200).json(report);
  },
};
