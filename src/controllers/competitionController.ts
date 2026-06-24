import { Request, Response } from "express";
import { competitionService } from "../services/competitionService";
import { saveSelectedCompetitionId } from "../helpers/selectedCompetition";

export const competitionController = {
  async create(req: Request, res: Response): Promise<void> {
    const competition = await competitionService.create(req.body);
    saveSelectedCompetitionId(res, competition.id);
    res.status(201).json(competition);
  },

  async findAll(_req: Request, res: Response): Promise<void> {
    const competitions = await competitionService.findAll();
    res.status(200).json(competitions);
  },

  async findById(req: Request, res: Response): Promise<void> {
    const competition = await competitionService.findById(req.params.id);
    res.status(200).json(competition);
  },

  async update(req: Request, res: Response): Promise<void> {
    const competition = await competitionService.update(req.params.id, req.body);
    res.status(200).json(competition);
  },

  async delete(req: Request, res: Response): Promise<void> {
    await competitionService.delete(req.params.id);
    res.status(204).send();
  },

  async close(req: Request, res: Response): Promise<void> {
    const competition = await competitionService.close(req.params.id);
    res.status(200).json(competition);
  },

  async activate(req: Request, res: Response): Promise<void> {
    const competition = await competitionService.activate(req.params.id);
    res.status(200).json(competition);
  },
};
