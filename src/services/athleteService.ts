import {
  Athlete,
  AthleteRepository,
  CreateAthleteInput,
  UpdateAthleteInput,
} from "../models/athlete";
import { athleteRepository } from "../repositories/athleteRepository";
import {
  validateCreateAthlete,
  validateUpdateAthlete,
} from "../validators/athleteValidator";
import {
  NotFoundError,
  ConflictError,
  UnprocessableError,
} from "../errors/AppError";

const MAX_ATHLETES_PER_TEAM = 16;

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

export function createAthleteService(
  repository: AthleteRepository = athleteRepository
) {
  return {
    async create(payload: Partial<CreateAthleteInput>): Promise<Athlete> {
      const input = validateCreateAthlete(payload);

      const team = await repository.findTeamById(input.equipe_id);
      if (!team) {
        throw new NotFoundError(`Equipe ${input.equipe_id} não encontrada`);
      }

      const count = await repository.countByTeam(input.equipe_id);
      if (count >= MAX_ATHLETES_PER_TEAM) {
        throw new UnprocessableError(
          `Equipe já possui o número máximo de atletas (${MAX_ATHLETES_PER_TEAM})`
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

    async findByTeam(equipe_id: number): Promise<Athlete[]> {
      const team = await repository.findTeamById(equipe_id);
      if (!team) {
        throw new NotFoundError(`Equipe ${equipe_id} não encontrada`);
      }
      return repository.findByTeam(equipe_id);
    },

    async findById(id: number, equipe_id: number): Promise<Athlete> {
      const athlete = await repository.findById(id, equipe_id);
      if (!athlete) {
        throw new NotFoundError(`Atleta ${id} não encontrado`);
      }
      return athlete;
    },

    async update(
      id: number,
      equipe_id: number,
      payload: Partial<UpdateAthleteInput>
    ): Promise<Athlete> {
      const input = validateUpdateAthlete(payload);

      try {
        const updated = await repository.update(id, equipe_id, input);
        if (!updated) {
          throw new NotFoundError(`Atleta ${id} não encontrado`);
        }
        return updated;
      } catch (error) {
        if (isPgUniqueViolation(error)) {
          throw new ConflictError(uniqueViolationMessage(error));
        }
        throw error;
      }
    },

    async delete(id: number, equipe_id: number): Promise<void> {
      try {
        const deleted = await repository.delete(id, equipe_id);
        if (!deleted) {
          throw new NotFoundError(`Atleta ${id} não encontrado`);
        }
      } catch (error) {
        if (isPgFkViolation(error)) {
          throw new ConflictError(
            "Atleta possui checkpoints registrados e não pode ser removido"
          );
        }
        throw error;
      }
    },
  };
}

export const athleteService = createAthleteService();
