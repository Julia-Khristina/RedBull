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
  // [C2 — Parcial] Render SSR da tela de Equipes (Sprints 4, tasks #327/#328).
  // [A3 ⚠] ID da competição ativa: continua como mock (id=1) até que o fluxo
  //   administrativo defina a origem real (sessionStorage, query ou middleware).
  // [A1][B1] Lista vinda de teamService.findByCompetition; falha de busca cai
  //   no empty state para não quebrar a tela.
  async renderTeams(_req: Request, res: Response): Promise<void> {
    const competitionId = 1;
    let teamsList: unknown[] = [];

    try {
      teamsList = await teamService.findByCompetition(competitionId);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        `[teams] Falha ao buscar equipes da competição ${competitionId}:`,
        error
      );
      // Fallback: lista vazia (empty state).
    }

    try {
      const mockCompetition = {
        id: competitionId,
        name: "Red Bull 24h São Paulo 2026",
        status: "em andamento",
      };

      res.render("teams/teams", {
        title: "Equipes — Red Bull 24h",
        competition: mockCompetition,
        teams: teamsList,
        currentPage: "teams",
      });
    } catch (_error) {
      res.status(500).render("errors/500", { title: "Erro interno" });
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    const competitionId = parseIntegerParam(
      req.params.id,
      "id"
    );

    const team = await teamService.create({
      ...req.body,
      id_competition: competitionId,
    });

    res.status(201).json(team);
  },

  async list(req: Request, res: Response): Promise<void> {
    const competitionId = parseIntegerParam(
      req.params.id,
      "id"
    );

    const teams = await teamService.findByCompetition(competitionId);

    res.status(200).json(teams);
  },

  async findById(req: Request, res: Response): Promise<void> {
    const competitionId = parseIntegerParam(req.params.id, "id");
    const teamId = parseIntegerParam(req.params.teamId, "teamId");

    const team = await teamService.findByCompetitionAndId(competitionId, teamId);

    res.status(200).json(team);
  },

  async update(req: Request, res: Response): Promise<void> {
    const competitionId = parseIntegerParam(req.params.id, "id");
    const teamId = parseIntegerParam(req.params.teamId, "teamId");

    const team = await teamService.updateByCompetitionAndId(competitionId, teamId, req.body);

    res.status(200).json(team);
  },

  async delete(req: Request, res: Response): Promise<void> {
    const competitionId = parseIntegerParam(req.params.id, "id");
    const teamId = parseIntegerParam(req.params.teamId, "teamId");

    await teamService.deleteByCompetitionAndId(competitionId, teamId);

    res.status(204).send();
  },
};
