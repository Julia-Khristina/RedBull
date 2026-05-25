import { Request, Response } from "express";
import { competitionService } from "../services/competitionService";

export const competitionController = {
  async create(req: Request, res: Response): Promise<void> {
    const competition = await competitionService.create(req.body);
    res.status(201).json(competition);
  },
};
