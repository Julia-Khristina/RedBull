import { Request, Response } from "express";
import { checkpointService } from "../services/checkpointService";
import { ValidationError } from "../errors/AppError";

function parseIntegerParam(value: unknown, name: string): number {
  const parsed = typeof value === "string" ? Number(value) : NaN;

    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new ValidationError(`${name} deve ser um número inteiro positivo`);
          }

            return parsed;
            }

            export const checkpointController = {
              async list(_req: Request, res: Response): Promise<void> {
                  const checkpoints = await checkpointService.findAll();
                      res.status(200).json(checkpoints);
                        },

                          async findById(req: Request, res: Response): Promise<void> {
                              const id = parseIntegerParam(req.params.id, "id");
                                  const checkpoint = await checkpointService.findById(id);
                                      res.status(200).json(checkpoint);
                                        },

                                          async findByCorredor(req: Request, res: Response): Promise<void> {
                                              const corredorId = parseIntegerParam(req.params.corredorId, "corredorId");
                                                  const checkpoints = await checkpointService.findByCorredor(corredorId);
                                                      res.status(200).json(checkpoints);
                                                        },

                                                          async findByCompeticao(req: Request, res: Response): Promise<void> {
                                                              const competitionId = parseIntegerParam(
                                                                    req.params.competitionId,
                                                                          "competitionId"
                                                                              );
                                                                                  const checkpoints = await checkpointService.findByCompeticao(competitionId);
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