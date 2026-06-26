import { Request, Response } from "express";
import { runnerService } from "../services/runnerService";
import { teamService } from "../services/teamService";
import { rankingService } from "../services/rankingService";
import { checkpointService } from "../services/checkpointService";
import { competitionService } from "../services/competitionService";
import { Checkpoint } from "../models/checkpoint";
import { CompetitionStatus } from "../models/competition";
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

// Tempo decorrido desde competition.started_at (marco zero real da competição).
// Se não foi ativada (started_at null) ou já foi encerrada (closed), exibe "00:00:00".
function computeElapsedTime(
  startedAtIso: string | null,
  status: CompetitionStatus,
  checkpoints: Checkpoint[]
): string {
  if (!startedAtIso || status === "closed") return "00:00:00";

  const startedAt = new Date(startedAtIso);
  const endAt = new Date();

  const totalSec = Math.max(0, Math.floor((endAt.getTime() - startedAt.getTime()) / 1000));
  const hh = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const sec = String(totalSec % 60).padStart(2, "0");
  return `${hh}:${mm}:${sec}`;
}

function calculateRestProgress(
  checkpointCreatedAt: string | null,
  recommendedMinutes: number,
  circleCircumference: number
): { restPct: number; restOffset: number } {
  if (!checkpointCreatedAt) {
    return { restPct: 100, restOffset: 0 };
  }

  const elapsedMin =
    (Date.now() - new Date(checkpointCreatedAt).getTime()) / 60000;
  const restPct = Math.max(
    0,
    Math.min(100, Math.round((elapsedMin / recommendedMinutes) * 100))
  );
  const restOffset =
    Math.round(circleCircumference * (1 - restPct / 100) * 10) / 10;

  return { restPct, restOffset };
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

    const REST_RECOMMENDED_MIN = 120;
    const CIRCLE_CIRCUMFERENCE = 314.16;

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
        last_checkpoint_raw: lastCp?.created_at ?? null,
        last_checkpoint_at: formatDateTimePtBR(lastCp?.created_at ?? null),
      };
    });

    // Stats da equipe no ranking
    const thisTeamRanking = teamRanking.find((t) => t.id_team === teamId);
    const leaderDistanceKm = teamRanking.length > 0 ? teamRanking[0].total_distance_km : 0;
    const teamDistanceKm = thisTeamRanking?.total_distance_km ?? 0;

    const isLeader = thisTeamRanking?.position === 1;
    const distanceToNextKm = isLeader && teamRanking.length > 1
      ? Math.max(0, teamRanking[0].total_distance_km - teamRanking[1].total_distance_km)
      : 0;

    const teamStats = {
      position: thisTeamRanking?.position ?? 0,
      total_distance_km: teamDistanceKm,
      average_pace: thisTeamRanking?.average_pace ?? null,
      distance_to_leader_km: Math.max(0, leaderDistanceKm - teamDistanceKm),
      distance_to_next_km: distanceToNextKm,
      is_leader: isLeader,
    };

    // [D2] Calculadora de descanso simplificada — 120 min recomendados (RN08)
    // Fórmula real requer parâmetros do evento não expostos na Seção 7
    const runnerRestOptions = runnersEnriched.map((runner) => {
      const rest = calculateRestProgress(
        runner.last_checkpoint_raw,
        REST_RECOMMENDED_MIN,
        CIRCLE_CIRCUMFERENCE
      );
      const hasCheckpoint = runner.last_checkpoint_raw !== null;

      return {
        id: runner.id,
        name: runner.name,
        hasCheckpoint,
        lastCheckpointAt: runner.last_checkpoint_at,
        restPct: rest.restPct,
        restOffset: rest.restOffset,
        statusLabel: !hasCheckpoint
          ? "Atleta sem checkpoint registrado"
          : rest.restPct >= 100
            ? "Pronto para Voltar!"
            : "Em descanso",
        description: !hasCheckpoint
          ? "Atleta ainda sem checkpoint registrado."
          : rest.restPct >= 100
            ? "Tempo de descanso atingido..."
            : "Aguardando tempo de descanso...",
      };
    });
    const latestRunnerRest =
      [...runnerRestOptions].sort((a, b) => {
        const runnerA = runnersEnriched.find((runner) => runner.id === a.id);
        const runnerB = runnersEnriched.find((runner) => runner.id === b.id);
        const timeA = runnerA?.last_checkpoint_raw
          ? new Date(runnerA.last_checkpoint_raw).getTime()
          : 0;
        const timeB = runnerB?.last_checkpoint_raw
          ? new Date(runnerB.last_checkpoint_raw).getTime()
          : 0;
        return timeB - timeA;
      })[0] ?? null;
    const selectedRunnerRest = latestRunnerRest ?? runnerRestOptions[0] ?? null;
    const restPct = selectedRunnerRest?.restPct ?? 100;
    const restOffset = selectedRunnerRest?.restOffset ?? 0;

    // [D2] Próximo atleta: primeiro runner sem checkpoint registrado nesta competição
    // Não há endpoint de scheduling na Seção 7 — inferido pela ausência de registros
    const runnersWithCp = new Set(checkpoints.map((cp) => cp.id_runner));
    const nextRunner = runners.find((r) => !runnersWithCp.has(r.id)) ?? null;

    // [A1] Calcula o delay até o próximo minuto :00 (hora cheia)
    // para refresh automático da página sincronizado com o relógio
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1, 0, 0, 0);
    const refreshDelayMs = nextHour.getTime() - now.getTime();

    res.render("runner/runner", {
      title: `${team.name} — Red Bull 24h`,
      pageCSS: "/css/runner.css",
      hideMenuNav: true,
      competition,
      team,
      runnersEnriched,
      teamStats,
      competitionTimeFormatted: computeElapsedTime(competition.started_at, competition.status, checkpoints),
      runnerRestOptions,
      selectedRunnerRest,
      restPct,
      restOffset,
      nextRunner,
      currentPage: "teams",
      refreshDelayMs,
    });
  },
};
