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
<<<<<<< HEAD
  async rankingEquipes(req: Request, res: Response): Promise<void> {
    const competitionId = parseIntegerParam(
      req.params.competitionId,
      "competitionId"
    );

    const ranking = await rankingService.gerarRankingEquipes(competitionId);
=======
  async teamRanking(req: Request, res: Response): Promise<void> {
    const competitionId = parseIntegerParam(
      req.params.id,
      "id"
    );

    const ranking = await rankingService.generateTeamRanking(competitionId);
>>>>>>> origin/dev

    res.status(200).json(ranking);
  },

<<<<<<< HEAD
  async rankingCorredores(req: Request, res: Response): Promise<void> {
    const competitionId = parseIntegerParam(
      req.params.competitionId,
      "competitionId"
    );

    const ranking = await rankingService.gerarRankingCorredores(competitionId);
=======
  async runnerRanking(req: Request, res: Response): Promise<void> {
    const competitionId = parseIntegerParam(
      req.params.id,
      "id"
    );

    const ranking = await rankingService.generateRunnerRanking(competitionId);
>>>>>>> origin/dev

    res.status(200).json(ranking);
  },
};
