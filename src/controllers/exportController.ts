import { Request, Response } from "express";
import { exportService } from "../services/exportService";

export const exportController = {
  async exportCompetition(req: Request, res: Response): Promise<void> {
<<<<<<< HEAD
    const data = await exportService.exportCompetition(req.params.competitionId);
=======
    const data = await exportService.exportCompetition(req.params.id);
>>>>>>> origin/dev
    res.status(200).json(data);
  },
};
