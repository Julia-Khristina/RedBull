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
  async rankingEquipes(req: Request, res: Response): Promise<void> {
    const competitionId = parseIntegerParam(
      req.params.competitionId,
      "competitionId"
    );

    const ranking = await rankingService.gerarRankingEquipes(competitionId);

    res.status(200).json(ranking);
  },

  async rankingCorredores(req: Request, res: Response): Promise<void> {
    const competitionId = parseIntegerParam(
      req.params.competitionId,
      "competitionId"
    );

    const ranking = await rankingService.gerarRankingCorredores(competitionId);

    res.status(200).json(ranking);
  },
};
