import { Request, Response } from "express";
import { teamService } from "../services/teamService";
import { runnerService } from "../services/runnerService";
import { competitionService } from "../services/competitionService";
import { rankingService } from "../services/rankingService";
import { checkpointService } from "../services/checkpointService";
import { ValidationError } from "../errors/AppError";
import { Team } from "../models/team";
import { Runner } from "../models/runner";
import { resolveSelectedCompetitionId } from "../helpers/selectedCompetition";

function parseIntegerParam(value: unknown, name: string): number {
  const parsed =
    typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ValidationError(
      `${name} deve ser um número inteiro positivo`
    );
  }

  return parsed;
}

function resolveCompetitionId(req: Request): number {
  const rawId = resolveSelectedCompetitionId(req);
  return parseIntegerParam(rawId, "competitionId");
}

function resolveCompetitionIdForView(req: Request): number | null {
  try {
    return resolveCompetitionId(req);
  } catch (_error) {
    return null;
  }
}

function renderCompetitionRequired(res: Response): void {
  res.status(400).render("teams/competition-required", {
    title: "Selecione uma competição — Red Bull 24h",
    currentPage: "teams",
    pageCSS: "/css/teams.css",
  });
}

function pickActiveRunner(team: Team, runners: Runner[]): Runner | null {
  if (runners.length === 0) return null;

  if (team.active_runner_id) {
    return runners.find((runner) => runner.id === team.active_runner_id) ?? runners[0];
  }

  return runners.find((runner) => runner.status === "captain") ?? runners[0];
}

export const teamController = {
  // [C2 — Parcial] Render SSR da tela de Equipes (Sprints 4, tasks #327/#328).
  // [A1] A competição deve ser informada por query string (?competitionId=)
  //   ou por parametro de rota nas APIs REST; não há fallback implícito.
  // [A1][B1] Lista vinda de teamService.findByCompetition; falha de busca cai
  //   no empty state para não quebrar a tela.
  async renderTeams(req: Request, res: Response): Promise<void> {
    const competitionId = resolveCompetitionIdForView(req);
    if (!competitionId) {
      renderCompetitionRequired(res);
      return;
    }

    let teamsList: unknown[] = [];

    try {
      const teams = await teamService.findByCompetition(competitionId);
      teamsList = await Promise.all(
        teams.map(async (team) => {
          const runners = await runnerService.findByTeam(team.id);
          return {
            ...team,
            runner_count: runners.length,
          };
        })
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        `[teams] Falha ao buscar equipes da competição ${competitionId}:`,
        error
      );
      // Fallback: lista vazia (empty state).
    }

    try {
      const competition = await competitionService.findById(competitionId);

      res.render("teams/teams", {
        title: "Equipes — Red Bull 24h",
        competition,
        teams: teamsList,
        currentPage: "teams",
      });
    } catch (_error) {
      res.status(500).render("errors/500", { title: "Erro interno" });
    }
  },

  async renderNewTeam(req: Request, res: Response): Promise<void> {
    const competitionId = resolveCompetitionIdForView(req);
    if (!competitionId) {
      renderCompetitionRequired(res);
      return;
    }

    const competition = await competitionService.findById(competitionId);

    res.render("teams/new", {
      title: "Criar equipe — Red Bull 24h",
      competition,
      currentPage: "teams",
      pageCSS: "/css/teams.css",
    });
  },

  async renderEditTeam(req: Request, res: Response): Promise<void> {
    const competitionId = resolveCompetitionIdForView(req);
    if (!competitionId) {
      renderCompetitionRequired(res);
      return;
    }

    const teamId = parseIntegerParam(req.params.teamId, "teamId");
    const [competition, team, runners] = await Promise.all([
      competitionService.findById(competitionId),
      teamService.findByCompetitionAndId(competitionId, teamId),
      runnerService.findByTeam(teamId),
    ]);

    res.render("teams/edit", {
      title: `Editar ${team.name} — Red Bull 24h`,
      competition,
      team,
      runners,
      currentPage: "teams",
      pageCSS: "/css/teams.css",
    });
  },

  async renderTeamDetail(req: Request, res: Response): Promise<void> {
    const competitionId = resolveCompetitionIdForView(req);
    if (!competitionId) {
      renderCompetitionRequired(res);
      return;
    }

    const teamId = parseIntegerParam(req.params.teamId, "teamId");

    const [competition, team, runners, teamRanking, runnerRanking, checkpoints] =
      await Promise.all([
        competitionService.findById(competitionId),
        teamService.findByCompetitionAndId(competitionId, teamId),
        runnerService.findByTeam(teamId),
        rankingService.generateTeamRanking(competitionId),
        rankingService.generateRunnerRanking(competitionId),
        checkpointService.findByCompetition(competitionId),
      ]);

    const activeRunner = pickActiveRunner(team, runners);
    const teamStats = teamRanking.find((item) => item.id_team === teamId) ?? null;
    const runnerStats = activeRunner
      ? runnerRanking.find((item) => item.id_runner === activeRunner.id) ?? null
      : null;
    const teamCheckpoints = checkpoints.filter(
      (checkpoint) => checkpoint.runner?.id_team === teamId
    );
    const activeRunnerCheckpoints = activeRunner
      ? teamCheckpoints.filter((checkpoint) => checkpoint.id_runner === activeRunner.id)
      : [];
    const lastCheckpoint = [...activeRunnerCheckpoints].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0] ?? null;

    res.render("teams/show", {
      title: `${team.name} — Red Bull 24h`,
      competition,
      team,
      runners,
      activeRunner,
      teamStats,
      runnerStats,
      lastCheckpoint,
      checkpointContext: {
        id_competition: competitionId,
        id_runner: activeRunner?.id ?? "",
        id_admin: 1,
      },
      currentPage: "teams",
      pageCSS: "/css/teams.css",
    });
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

  async setActiveRunner(req: Request, res: Response): Promise<void> {
    const competitionId = parseIntegerParam(req.params.id, "id");
    const teamId = parseIntegerParam(req.params.teamId, "teamId");

    const team = await teamService.setActiveRunnerByCompetitionAndId(
      competitionId,
      teamId,
      req.body
    );

    res.status(200).json(team);
  },

  async delete(req: Request, res: Response): Promise<void> {
    const competitionId = parseIntegerParam(req.params.id, "id");
    const teamId = parseIntegerParam(req.params.teamId, "teamId");

    await teamService.deleteByCompetitionAndId(competitionId, teamId);

    res.status(204).send();
  },
};
