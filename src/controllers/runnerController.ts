import { Request, Response } from "express";
import { runnerService } from "../services/runnerService";
import { teamService } from "../services/teamService";
import { rankingService } from "../services/rankingService";
import { checkpointService } from "../services/checkpointService";
import { competitionService } from "../services/competitionService";
import { Checkpoint } from "../models/checkpoint";
import { ValidationError } from "../errors/AppError";

// [D2] Converte pace em velocidade km/h. Aceita "MM:SS" e "MM:SS/km" (formato do banco)
function paceStringToSpeedKmh(pace: string | null): number | null {
  if (!pace) return null;
  // Extrai apenas "MM:SS" — remove sufixos como "/km" presentes no seed
  const match = pace.match(/(\d+):(\d+)/);
  if (!match) return null;
  const min = Number(match[1]);
  const sec = Number(match[2]);
  const totalMin = min + sec / 60;
  if (totalMin <= 0) return null;
  return Math.round((60 / totalMin) * 10) / 10;
}

// Formata ISO date string para "dd/mm/aaaa às HH:MM:SS"
function formatDateTimePtBR(dateStr: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, "0");
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${dd}/${mo}/${yyyy} às ${hh}:${mi}:${ss}`;
}

// [D2] Tempo decorrido desde competition.date meia-noite — sem campo start_time no model Competition
function computeElapsedTime(dateStr: string): string {
  const start = new Date(dateStr + "T00:00:00");
  const totalSec = Math.max(0, Math.floor((Date.now() - start.getTime()) / 1000));
  const hh = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const sec = String(totalSec % 60).padStart(2, "0");
  return `${hh}:${mm}:${sec}`;
}

function parseIntegerParam(value: unknown, name: string): number {
  const parsed = typeof value === "string" ? Number(value) : NaN;

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ValidationError(`${name} deve ser um número inteiro positivo`);
  }

  return parsed;
}

export const runnerController = {
  async create(req: Request, res: Response): Promise<void> {
    parseIntegerParam(req.params.id, "id");
    const teamId = parseIntegerParam(req.params.teamId, "teamId");

    const runner = await runnerService.create({
      ...req.body,
      id_team: teamId,
    });

    res.status(201).json(runner);
  },

  async list(req: Request, res: Response): Promise<void> {
    parseIntegerParam(req.params.id, "id");
    const teamId = parseIntegerParam(req.params.teamId, "teamId");

    const runners = await runnerService.findByTeam(teamId);

    res.status(200).json(runners);
  },

  async findById(req: Request, res: Response): Promise<void> {
    parseIntegerParam(req.params.id, "id");
    const teamId = parseIntegerParam(req.params.teamId, "teamId");
    const runnerId = parseIntegerParam(req.params.runnerId, "runnerId");

    const runner = await runnerService.findByTeamAndId(teamId, runnerId);

    res.status(200).json(runner);
  },

  async update(req: Request, res: Response): Promise<void> {
    parseIntegerParam(req.params.id, "id");
    const teamId = parseIntegerParam(req.params.teamId, "teamId");
    const runnerId = parseIntegerParam(req.params.runnerId, "runnerId");

    const runner = await runnerService.updateByTeamAndId(teamId, runnerId, req.body);

    res.status(200).json(runner);
  },

  async delete(req: Request, res: Response): Promise<void> {
    parseIntegerParam(req.params.id, "id");
    const teamId = parseIntegerParam(req.params.teamId, "teamId");
    const runnerId = parseIntegerParam(req.params.runnerId, "runnerId");

    await runnerService.deleteByTeamAndId(teamId, runnerId);

    res.status(204).send();
  },

  // [A1][B1] Painel PÚBLICO da equipe — acesso via link único (UUID), sem login (RN13)
  // Rota: GET /public/team/:uuid
  async renderTeamPanel(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid;

    if (typeof uuid !== "string" || uuid.trim() === "") {
      throw new ValidationError("uuid é obrigatório");
    }

    // [A1][B1] Resolve a equipe pelo UUID — define competitionId e teamId
    const team = await teamService.findByUuid(uuid);
    const competitionId = team.id_competition;
    const teamId = team.id;

    // [A1][B1] Demais dados — padrão SSR do projeto, chamadas diretas a services
    const [competition, runners, teamRanking, runnerRanking, checkpoints] =
      await Promise.all([
        competitionService.findById(competitionId),
        runnerService.findByTeam(teamId),
        rankingService.generateTeamRanking(competitionId),
        rankingService.generateRunnerRanking(competitionId),
        checkpointService.findByCompetition(competitionId),
      ]);

    // Monta mapa runner_id → Checkpoint[]
    const cpByRunner = new Map<number, Checkpoint[]>();
    for (const cp of checkpoints) {
      const list = cpByRunner.get(cp.id_runner);
      if (list) {
        list.push(cp);
      } else {
        cpByRunner.set(cp.id_runner, [cp]);
      }
    }

    // [A1][B1] Ranking filtrado para runners desta equipe
    const teamRunnerRanking = runnerRanking.filter((r) => r.id_team === teamId);

    // Enriquece cada runner com dados de ranking e último checkpoint
    const runnersEnriched = runners.map((runner) => {
      const ranking = teamRunnerRanking.find((r) => r.id_runner === runner.id);
      const cps = cpByRunner.get(runner.id) ?? [];

      const sortedCps = [...cps].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const lastCp = sortedCps[0] ?? null;

      // [D2] Velocidade máx. = velocidade do pace mais rápido registrado nos checkpoints
      let maxSpeedKmh: number | null = null;
      for (const cp of cps) {
        const speed = paceStringToSpeedKmh(cp.pace);
        if (speed !== null && (maxSpeedKmh === null || speed > maxSpeedKmh)) {
          maxSpeedKmh = speed;
        }
      }

      return {
        id: runner.id,
        name: runner.name,
        status: runner.status,
        average_pace: ranking?.average_pace ?? null,
        total_distance_km: ranking?.total_distance_km ?? 0,
        max_speed_kmh: maxSpeedKmh,
        last_checkpoint_at: formatDateTimePtBR(lastCp?.created_at ?? null),
      };
    });

    // Stats da equipe no ranking
    const thisTeamRanking = teamRanking.find((t) => t.id_team === teamId);
    const leaderDistanceKm = teamRanking.length > 0 ? teamRanking[0].total_distance_km : 0;
    const teamDistanceKm = thisTeamRanking?.total_distance_km ?? 0;

    const teamStats = {
      position: thisTeamRanking?.position ?? 0,
      total_distance_km: teamDistanceKm,
      average_pace: thisTeamRanking?.average_pace ?? null,
      distance_to_leader_km: Math.max(0, leaderDistanceKm - teamDistanceKm),
      is_leader: thisTeamRanking?.position === 1,
    };

    // [D2] Calculadora de descanso simplificada — 50 min recomendados (RN08)
    // Fórmula real requer parâmetros do evento não expostos na Seção 7
    const REST_RECOMMENDED_MIN = 50;
    const CIRCLE_CIRCUMFERENCE = 314.16;

    const lastCpOverall = [...checkpoints]
      .filter((cp) => runners.some((r) => r.id === cp.id_runner))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

    let restPct = 100;
    if (lastCpOverall) {
      const elapsedMin =
        (Date.now() - new Date(lastCpOverall.created_at).getTime()) / 60000;
      restPct = Math.min(100, Math.round((elapsedMin / REST_RECOMMENDED_MIN) * 100));
    }
    const restOffset = Math.round(CIRCLE_CIRCUMFERENCE * (1 - restPct / 100) * 10) / 10;

    // [D2] Próximo atleta: primeiro runner sem checkpoint registrado nesta competição
    // Não há endpoint de scheduling na Seção 7 — inferido pela ausência de registros
    const runnersWithCp = new Set(checkpoints.map((cp) => cp.id_runner));
    const nextRunner = runners.find((r) => !runnersWithCp.has(r.id)) ?? null;

    res.render("runner/runner", {
      title: `${team.name} — Red Bull 24h`,
      pageCSS: "/css/runner.css",
      competition,
      team,
      runnersEnriched,
      teamStats,
      competitionTimeFormatted: computeElapsedTime(competition.date),
      restPct,
      restOffset,
      nextRunner,
      currentPage: "teams",
    });
  },
};
