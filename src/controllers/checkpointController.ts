import { Request, Response } from "express";
import { Checkpoint } from "../models/checkpoint";
import { checkpointService } from "../services/checkpointService";
import { treadmillService } from "../services/treadmillService";
import { runnerService } from "../services/runnerService";
import { teamService } from "../services/teamService";
import { ValidationError } from "../errors/AppError";

function parseIntegerParam(value: unknown, name: string): number {
  const parsed = typeof value === "string" ? Number(value) : NaN;

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ValidationError(`${name} deve ser um número inteiro positivo`);
  }

  return parsed;
}

function parseOptionalIntegerParam(value: unknown): number | null {
  if (typeof value !== "string" || value.trim() === "") return null;

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parsePaceToSeconds(pace: string | null): number | null {
  if (!pace) return null;

  const parts = pace.replace("/km", "").trim().split(":").map(Number);
  if (parts.length !== 2 || parts.some((part) => Number.isNaN(part))) {
    return null;
  }

  return parts[0] * 60 + parts[1];
}

function formatSecondsAsPace(totalSeconds: number): string {
  const rounded = Math.round(totalSeconds);
  const minutes = Math.floor(rounded / 60);
  const seconds = rounded % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function parseDurationToSeconds(time: string | null): number | null {
  if (!time) return null;

  const parts = time.trim().split(":").map(Number);
  if (
    parts.length < 2 ||
    parts.length > 3 ||
    parts.some((part) => Number.isNaN(part))
  ) {
    return null;
  }

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

function formatSecondsAsHoursMinutes(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.round((totalSeconds % 3600) / 60);
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

function calculateAveragePaceSeconds(checkpoints: Checkpoint[]): number | null {
  const paces = checkpoints
    .map((checkpoint) => {
      const timeSeconds = parseDurationToSeconds(checkpoint.time);
      if (timeSeconds !== null && Number(checkpoint.distance_km) > 0) {
        return timeSeconds / Number(checkpoint.distance_km);
      }
      return parsePaceToSeconds(checkpoint.pace);
    })
    .filter((pace): pace is number => pace !== null);

  if (paces.length === 0) return null;
  return paces.reduce((sum, pace) => sum + pace, 0) / paces.length;
}

function buildSavedDataSummary(checkpoints: Checkpoint[]) {
  const totalDistanceKm = checkpoints.reduce(
    (sum, checkpoint) => sum + Number(checkpoint.distance_km || 0),
    0
  );

  const paces = checkpoints
    .map((checkpoint) => parsePaceToSeconds(checkpoint.pace))
    .filter((pace): pace is number => pace !== null);

  const durations = checkpoints
    .map((checkpoint) => parseDurationToSeconds(checkpoint.time))
    .filter((duration): duration is number => duration !== null);

  return {
    totalDistanceKm,
    averagePace:
      paces.length > 0
        ? formatSecondsAsPace(
            paces.reduce((sum, pace) => sum + pace, 0) / paces.length
          )
        : "0:00",
    averageTime:
      durations.length > 0
        ? formatSecondsAsHoursMinutes(
            durations.reduce((sum, duration) => sum + duration, 0) /
              durations.length
          )
        : "0h 00m",
  };
}

export const checkpointController = {
  async renderOperationalPanel(req: Request, res: Response): Promise<void> {
    const runnerId =
      parseOptionalIntegerParam(req.params.runnerId) ??
      parseOptionalIntegerParam(req.query.runnerId);
    const teamId = parseOptionalIntegerParam(req.query.teamId);
    const competitionId = parseOptionalIntegerParam(req.query.competitionId) ?? 1;
    const adminId = parseOptionalIntegerParam(req.query.adminId) ?? 1;
    const treadmill = await treadmillService.getOrCreateDefault();
    const selectedRunner =
      runnerId && teamId
        ? await runnerService.findByTeamAndId(teamId, runnerId)
        : null;
    const [selectedTeam, runnerCheckpoints] = await Promise.all([
      teamId
        ? teamService
            .findByCompetitionAndId(competitionId, teamId)
            .catch(() => null)
        : null,
      runnerId ? checkpointService.findByRunner(runnerId).catch(() => []) : [],
    ]);
    const averagePaceSeconds = calculateAveragePaceSeconds(runnerCheckpoints);

    res.render("operational-panel/operationalPanel", {
      title: "Painel OCR — Red Bull 24h",
      pageCSS: "/css/operational-panel.css",
      selectedRunner,
      selectedTeam,
      checkpointContext: {
        identifier: `MANUAL-${new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15)}-${runnerId ?? "runner"}`,
        id_runner: runnerId ?? "",
        id_competition: competitionId,
        id_treadmill: treadmill.id,
        id_admin: adminId,
        team_id: teamId ?? "",
        average_pace_seconds: averagePaceSeconds,
        average_pace_label:
          averagePaceSeconds !== null
            ? formatSecondsAsPace(averagePaceSeconds)
            : "",
        checkpoint_number: runnerCheckpoints.length + 1,
      },
      manualCheckpoint: {
        checkpointClock: new Date().toLocaleTimeString("pt-BR"),
      },
      currentPage: "teams",
    });
  },

  async renderSavedByTeam(req: Request, res: Response): Promise<void> {
    const competitionId = parseIntegerParam(req.params.id, "id");
    const teamId = parseIntegerParam(req.params.teamId, "teamId");
    const checkpoints = await checkpointService.findByCompetition(competitionId);
    const teamCheckpoints = checkpoints.filter(
      (checkpoint) => checkpoint.runner?.id_team === teamId
    );

    res.render("dadosSalvos/dadosSalvos", {
      title: "Dados Salvos",
      checkpoints: teamCheckpoints,
      summary: buildSavedDataSummary(teamCheckpoints),
      currentPage: "teams",
    });
  },

  async list(_req: Request, res: Response): Promise<void> {
    const checkpoints = await checkpointService.findAll();
    res.status(200).json(checkpoints);
  },

  async findById(req: Request, res: Response): Promise<void> {
    const id = parseIntegerParam(req.params.id, "id");
    const checkpoint = await checkpointService.findById(id);
    res.status(200).json(checkpoint);
  },

  async findByRunner(req: Request, res: Response): Promise<void> {
    const runnerId = parseIntegerParam(req.params.runnerId, "runnerId");
    const checkpoints = await checkpointService.findByRunner(runnerId);
    res.status(200).json(checkpoints);
  },

  async findByCompetition(req: Request, res: Response): Promise<void> {
    const competitionId = parseIntegerParam(
      req.params.id,
      "id"
    );
    const checkpoints = await checkpointService.findByCompetition(competitionId);
    res.status(200).json(checkpoints);
  },

  async findInconsistenciesByCompetition(
    req: Request,
    res: Response
  ): Promise<void> {
    const competitionId = parseIntegerParam(req.params.id, "id");
    const checkpoints =
      await checkpointService.findInconsistenciesByCompetition(competitionId);
    res.status(200).json(checkpoints);
  },

  async create(req: Request, res: Response): Promise<void> {
    const checkpoint = await checkpointService.create(req.body);
    res.status(201).json(checkpoint);
  },

  async createForRunner(req: Request, res: Response): Promise<void> {
    const runnerId = parseIntegerParam(req.params.runnerId, "runnerId");
    const checkpoint = await checkpointService.create({
      ...req.body,
      id_runner: runnerId,
    });
    res.status(201).json(checkpoint);
  },

  async update(req: Request, res: Response): Promise<void> {
    const id = parseIntegerParam(req.params.id, "id");
    const checkpoint = await checkpointService.update(id, req.body);
    res.status(200).json(checkpoint);
  },

  async remove(req: Request, res: Response): Promise<void> {
    const id = parseIntegerParam(req.params.id, "id");
    await checkpointService.delete(id);
    res.status(204).send();
  },
};
