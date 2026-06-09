import { Request, Response } from "express";
import { rankingService } from "../services/rankingService";
import { ValidationError } from "../errors/AppError";

function parseIntegerParam(value: unknown, name: string): number {
  const parsed = typeof value === "string" ? Number(value) : NaN;

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ValidationError(`${name} deve ser um numero inteiro positivo`);
  }

  return parsed;
}

export const rankingController = {
  async teamRanking(req: Request, res: Response): Promise<void> {
    const competitionId = parseIntegerParam(
      req.params.id,
      "id"
    );

    const ranking = await rankingService.generateTeamRanking(competitionId);

    res.status(200).json(ranking);
  },

  async runnerRanking(req: Request, res: Response): Promise<void> {
    const competitionId = parseIntegerParam(
      req.params.id,
      "id"
    );

    const ranking = await rankingService.generateRunnerRanking(competitionId);

    res.status(200).json(ranking);
  },
};
