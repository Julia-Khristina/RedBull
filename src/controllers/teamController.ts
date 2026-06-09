import { Request, Response } from "express";
import { teamService } from "../services/teamService";
import { ValidationError } from "../errors/AppError";

function parseIntegerParam(value: unknown, name: string): number {
  const parsed = typeof value === "string" ? Number(value) : NaN;

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ValidationError(
      `${name} deve ser um número inteiro positivo`
    );
  }

  return parsed;
}

export const teamController = {
  async create(req: Request, res: Response): Promise<void> {
    const competitionId = parseIntegerParam(
      req.params.competitionId,
      "competitionId"
    );

    const team = await teamService.create({
      ...req.body,
      id_competition: competitionId,
    });

    res.status(201).json(team);
  },

  async list(req: Request, res: Response): Promise<void> {
    const competitionId = parseIntegerParam(
      req.params.competitionId,
      "competitionId"
    );

    const teams = await teamService.findByCompetition(competitionId);

    res.status(200).json(teams);
  },

  async findById(req: Request, res: Response): Promise<void> {
    const competitionId = parseIntegerParam(req.params.competitionId, "competitionId");
    const teamId = parseIntegerParam(req.params.teamId, "teamId");

    const team = await teamService.findByCompetitionAndId(competitionId, teamId);

    res.status(200).json(team);
  },

  async update(req: Request, res: Response): Promise<void> {
    const competitionId = parseIntegerParam(req.params.competitionId, "competitionId");
    const teamId = parseIntegerParam(req.params.teamId, "teamId");

    const team = await teamService.updateByCompetitionAndId(competitionId, teamId, req.body);

    res.status(200).json(team);
  },

  async delete(req: Request, res: Response): Promise<void> {
    const competitionId = parseIntegerParam(req.params.competitionId, "competitionId");
    const teamId = parseIntegerParam(req.params.teamId, "teamId");

    await teamService.deleteByCompetitionAndId(competitionId, teamId);

    res.status(204).send();
  },
};
