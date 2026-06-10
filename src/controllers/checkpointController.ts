import { Request, Response } from "express";
import { checkpointService } from "../services/checkpointService";
import { treadmillService } from "../services/treadmillService";
import { ValidationError } from "../errors/AppError";

function parseIntegerParam(value: unknown, name: string): number {
  const parsed = typeof value === "string" ? Number(value) : NaN;

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ValidationError(`${name} deve ser um número inteiro positivo`);
  }

  return parsed;
}

function readQueryString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export const checkpointController = {
  async renderOperationalPanel(req: Request, res: Response): Promise<void> {
    const defaultTreadmill = await treadmillService.getOrCreateDefault();
    const selectedRunner = {
      id: readQueryString(req.query.id_runner),
      name: readQueryString(req.query.runner_name),
    };

    const checkpointContext = {
      identifier: readQueryString(req.query.identifier),
      id_runner: readQueryString(req.query.id_runner),
      id_competition: readQueryString(req.query.id_competition),
      id_treadmill:
        readQueryString(req.query.id_treadmill) || String(defaultTreadmill.id),
      id_admin: readQueryString(req.query.id_admin),
    };

    res.render("operational-panel/operationalPanel", {
      title: "Painel operacional",
      currentPage: "operational-panel",
      selectedRunner,
      checkpointContext,
      manualCheckpoint: {
        checkpointClock: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      },
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
