import { Request, Response } from "express";
import { athleteService } from "../services/athleteService";
import { ValidationError } from "../errors/AppError";

function parseIntegerParam(value: unknown, name: string): number {
  const parsed = typeof value === "string" ? Number(value) : NaN;

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ValidationError(`${name} deve ser um número inteiro positivo`);
  }

  return parsed;
}

export const athleteController = {
  async create(req: Request, res: Response): Promise<void> {
    const teamId = parseIntegerParam(req.params.teamId, "teamId");

    const athlete = await athleteService.create({
      ...req.body,
      equipe_id: teamId,
    });

    res.status(201).json(athlete);
  },

  async list(req: Request, res: Response): Promise<void> {
    const teamId = parseIntegerParam(req.params.teamId, "teamId");

    const athletes = await athleteService.findByTeam(teamId);

    res.status(200).json(athletes);
  },

  async findById(req: Request, res: Response): Promise<void> {
    const teamId = parseIntegerParam(req.params.teamId, "teamId");
    const athleteId = parseIntegerParam(req.params.athleteId, "athleteId");

    const athlete = await athleteService.findById(athleteId, teamId);

    res.status(200).json(athlete);
  },

  async update(req: Request, res: Response): Promise<void> {
    const teamId = parseIntegerParam(req.params.teamId, "teamId");
    const athleteId = parseIntegerParam(req.params.athleteId, "athleteId");

    const athlete = await athleteService.update(athleteId, teamId, req.body);

    res.status(200).json(athlete);
  },

  async delete(req: Request, res: Response): Promise<void> {
    const teamId = parseIntegerParam(req.params.teamId, "teamId");
    const athleteId = parseIntegerParam(req.params.athleteId, "athleteId");

    await athleteService.delete(athleteId, teamId);

    res.status(204).send();
  },
};
