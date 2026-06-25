import {
  Checkpoint,
  CheckpointRepository,
  CreateCheckpointInput,
  UpdateCheckpointInput,
} from "../models/checkpoint";
import { checkpointRepository } from "../repositories/checkpointRepository";
import {
  validateCreateCheckpoint,
  validateUpdateCheckpoint,
} from "../validators/checkpointValidator";
import { NotFoundError, ConflictError } from "../errors/AppError";

function isPgUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as Record<string, unknown>).code === "23505"
  );
}

function isPgFkViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as Record<string, unknown>).code === "23503"
  );
}

export function createCheckpointService(
  repository: CheckpointRepository = checkpointRepository
) {
  return {
    async findAll(): Promise<Checkpoint[]> {
      return repository.findAll();
    },

    async findById(id: number): Promise<Checkpoint> {
      const checkpoint = await repository.findById(id);
      if (!checkpoint) {
        throw new NotFoundError(`Checkpoint ${id} não encontrado`);
      }
      return checkpoint;
    },

    async findByRunner(runnerId: number): Promise<Checkpoint[]> {
      return repository.findByRunner(runnerId);
    },

    async findByCompetition(competitionId: number): Promise<Checkpoint[]> {
      return repository.findByCompetition(competitionId);
    },

    async findInconsistenciesByCompetition(
      competitionId: number
    ): Promise<Checkpoint[]> {
      return repository.findInconsistenciesByCompetition(competitionId);
    },

    async create(payload: Partial<CreateCheckpointInput>): Promise<Checkpoint> {
      const input = validateCreateCheckpoint(payload);

      try {
        return await repository.create(input);
      } catch (error) {
        if (isPgUniqueViolation(error)) {
          throw new ConflictError(
            `Já existe um checkpoint com o identificador '${input.identifier}'`
          );
        }
        if (isPgFkViolation(error)) {
          const errMsg = (error as any).message || "";
          if (errMsg.includes("id_admin")) throw new NotFoundError("Administrador não encontrado");
          if (errMsg.includes("id_competition")) throw new NotFoundError("Competição não encontrada");
          if (errMsg.includes("id_runner")) throw new NotFoundError("Atleta não encontrado");
          throw new NotFoundError("Referência de Runner, competition ou admin não encontrada");
        }
        throw error;
      }
    },

    async update(
      id: number,
      payload: Partial<UpdateCheckpointInput>
    ): Promise<Checkpoint> {
      const input = validateUpdateCheckpoint(payload);

      const updated = await repository.update(id, input);
      if (!updated) {
        throw new NotFoundError(`Checkpoint ${id} não encontrado`);
      }
      return updated;
    },

    async delete(id: number): Promise<void> {
      const deleted = await repository.delete(id);
      if (!deleted) {
        throw new NotFoundError(`Checkpoint ${id} não encontrado`);
      }
    },
  };
}

export const checkpointService = createCheckpointService();
