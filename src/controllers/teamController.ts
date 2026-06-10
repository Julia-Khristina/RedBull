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
  // [C2 — Parcial] Render SSR da tela de Equipes (Sprint 4, task #327).
  // [A3 ⚠] ID da competição ativa: pendente de definição de fluxo administrativo
  //   (sessionStorage, query string ou middleware ainda não implementado).
  // Por enquanto injeta mock para a estrutura visual; integração real fica para a #328.
  async renderTeams(_req: Request, res: Response): Promise<void> {
    try {
      const mockCompetition = {
        id: 1,
        name: "Red Bull 24h São Paulo 2026",
        status: "em andamento",
      };
      // [C2] Lista vazia por padrão para evidenciar o empty state; a integração
      // real virá em #328 (GET /competitions/:id/teams).
      const mockTeams: unknown[] = [];

      res.render("teams/teams", {
        title: "Equipes — Red Bull 24h",
        competition: mockCompetition,
        teams: mockTeams,
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
