import { Request, Response } from "express";
import { exportService } from "../services/exportService";

export const exportController = {
  async exportCompetition(req: Request, res: Response): Promise<void> {
    const data = await exportService.exportCompetition(req.params.id);
    res.status(200).json(data);
  },
};
