import { Request, Response } from "express";
import { rankingService } from "../services/rankingService";
import { competitionService } from "../services/competitionService";
import { ValidationError } from "../errors/AppError";
import { resolveSelectedCompetitionId } from "../helpers/selectedCompetition";

function parseIntegerParam(value: unknown, name: string): number {
  const parsed =
    typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ValidationError(`${name} deve ser um numero inteiro positivo`);
  }

  return parsed;
}

function resolveCompetitionId(req: Request): number {
  const rawId = resolveSelectedCompetitionId(req);
  return rawId === null ? 0 : parseIntegerParam(rawId, "competitionId");
}

async function findCompetitionForView(req: Request) {
  const requestedId = resolveCompetitionId(req);
  if (requestedId > 0) {
    return competitionService.findById(requestedId);
  }

  return null;
}

function renderCompetitionRequired(res: Response): void {
  res.status(400).render("ranking/competition-required", {
    title: "Selecione uma competição — Red Bull 24h",
    currentPage: "ranking",
    pageCSS: "/css/ranking.css",
  });
}

export const rankingController = {
  async renderActiveRanking(req: Request, res: Response): Promise<void> {
    const competition = await findCompetitionForView(req);

    if (!competition) {
      renderCompetitionRequired(res);
      return;
    }

    const teamRanking = await rankingService.generateTeamRanking(competition.id);
    const runnerRanking = await rankingService.generateRunnerRanking(competition.id);

    res.render("ranking/ranking", {
      title: "Ranking — Red Bull 24h",
      competition,
      teamRanking,
      runnerRanking,
      isAdmin: true,
      currentPage: "ranking",
      pageCSS: "/css/ranking.css",
    });
  },

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

  // [A1] Rota SSR documentada na Seção 11 do agent.md
  // Consome: rankingService.generateTeamRanking, rankingService.generateRunnerRanking, competitionService.findById
  async renderRanking(req: Request, res: Response): Promise<void> {
    try {
      const idParam = req.params.id;
      const competitionId = parseIntegerParam(idParam, "id");

      const competition = await competitionService.findById(competitionId);
      const teamRanking = await rankingService.generateTeamRanking(competitionId);
      const runnerRanking = await rankingService.generateRunnerRanking(competitionId);

      // [B1] RankingTeam: { position, id_team, team_name, id_competition, total_distance_km, average_pace, average_pace_seconds, runner_count }
      // [B1] RankingRunner: { position, id_runner, runner_name, id_team, total_distance_km, average_pace, average_pace_seconds }
      res.render("ranking/ranking", {
        title: "Ranking — Red Bull 24h",
        competition,
        teamRanking,
        runnerRanking,
        isAdmin: true,
        currentPage: "ranking",
        pageCSS: "/css/ranking.css",
      });
    } catch (error) {
      res.status(500).render("errors/500", { title: "Erro interno" });
    }
  },
};
