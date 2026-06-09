import {
  Runner,
  RunnerRepository,
  CreateRunnerInput,
  UpdateRunnerInput,
} from "../models/runner";
import { runnerRepository } from "../repositories/runnerRepository";
import {
  validateCreateRunner,
  validateUpdateRunner,
} from "../validators/runnerValidator";
import {
  NotFoundError,
  ConflictError,
  UnprocessableError,
} from "../errors/AppError";

const MAX_RUNNERS_PER_TEAM = 16;

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

function uniqueViolationMessage(error: unknown): string {
  const detail =
    typeof error === "object" &&
    error !== null &&
    "details" in error &&
    typeof (error as Record<string, unknown>).details === "string"
      ? ((error as Record<string, unknown>).details as string)
      : "";

  if (detail.includes("cpf")) return "CPF já cadastrado";
  if (detail.includes("email")) return "E-mail já cadastrado";
  return "Dado duplicado";
}

export function createRunnerService(
  repository: RunnerRepository = runnerRepository
) {
  return {
    async create(payload: Partial<CreateRunnerInput>): Promise<Runner> {
      const input = validateCreateRunner(payload);

      const team = await repository.findTeamById(input.id_team);
      if (!team) {
        throw new NotFoundError(`Team ${input.id_team} não encontrada`);
      }

      const count = await repository.countByTeam(input.id_team);
      if (count >= MAX_RUNNERS_PER_TEAM) {
        throw new UnprocessableError(
          `Team already has the maximum number of runners (${MAX_RUNNERS_PER_TEAM})`
        );
      }

      try {
        return await repository.create(input);
      } catch (error) {
        if (isPgUniqueViolation(error)) {
          throw new ConflictError(uniqueViolationMessage(error));
        }
        throw error;
      }
    },

    async findByTeam(teamId: number): Promise<Runner[]> {
      const team = await repository.findTeamById(teamId);
      if (!team) {
        throw new NotFoundError(`Team ${teamId} não encontrada`);
      }
      return repository.findByTeam(teamId);
    },

    async findByTeamAndId(teamId: number, id: number): Promise<Runner> {
      const runner = await repository.findByTeamAndId(teamId, id);
      if (!runner) {
        throw new NotFoundError(`Runner ${id} não encontrado`);
      }
      return runner;
    },

    async updateByTeamAndId(
      teamId: number,
      id: number,
      payload: Partial<UpdateRunnerInput>
    ): Promise<Runner> {
      const input = validateUpdateRunner(payload);

      try {
        const updated = await repository.updateByTeamAndId(teamId, id, input);
        if (!updated) {
          throw new NotFoundError(`Runner ${id} não encontrado`);
        }
        return updated;
      } catch (error) {
        if (isPgUniqueViolation(error)) {
          throw new ConflictError(uniqueViolationMessage(error));
        }
        throw error;
      }
    },

    async deleteByTeamAndId(teamId: number, id: number): Promise<void> {
      try {
        const deleted = await repository.deleteByTeamAndId(teamId, id);
        if (!deleted) {
          throw new NotFoundError(`Runner ${id} não encontrado`);
        }
      } catch (error) {
        if (isPgFkViolation(error)) {
          throw new ConflictError(
            "Runner possui checkpoints registrados e não pode ser removido"
          );
        }
        throw error;
      }
    },
  };
}

export const runnerService = createRunnerService();
