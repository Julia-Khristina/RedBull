import { Request, Response } from "express";
import { runnerService } from "../services/runnerService";
import { ValidationError } from "../errors/AppError";

function parseIntegerParam(value: unknown, name: string): number {
  const parsed = typeof value === "string" ? Number(value) : NaN;

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ValidationError(`${name} deve ser um número inteiro positivo`);
  }

  return parsed;
}

export const runnerController = {
  async create(req: Request, res: Response): Promise<void> {
    const teamId = parseIntegerParam(req.params.teamId, "teamId");

    const runner = await runnerService.create({
      ...req.body,
      id_team: teamId,
    });

    res.status(201).json(runner);
  },

  async list(req: Request, res: Response): Promise<void> {
    const teamId = parseIntegerParam(req.params.teamId, "teamId");

    const runners = await runnerService.findByTeam(teamId);

    res.status(200).json(runners);
  },

  async findById(req: Request, res: Response): Promise<void> {
    const teamId = parseIntegerParam(req.params.teamId, "teamId");
    const runnerId = parseIntegerParam(req.params.runnerId, "runnerId");

    const runner = await runnerService.findByTeamAndId(teamId, runnerId);

    res.status(200).json(runner);
  },

  async update(req: Request, res: Response): Promise<void> {
    const teamId = parseIntegerParam(req.params.teamId, "teamId");
    const runnerId = parseIntegerParam(req.params.runnerId, "runnerId");

    const runner = await runnerService.updateByTeamAndId(teamId, runnerId, req.body);

    res.status(200).json(runner);
  },

  async delete(req: Request, res: Response): Promise<void> {
    const teamId = parseIntegerParam(req.params.teamId, "teamId");
    const runnerId = parseIntegerParam(req.params.runnerId, "runnerId");

    await runnerService.deleteByTeamAndId(teamId, runnerId);

    res.status(204).send();
  },
};
