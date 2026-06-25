import {
  Competition,
  CompetitionRepository,
  CreateCompetitionInput,
  UpdateCompetitionInput,
} from "../models/competition";
import { NotFoundError } from "../errors/AppError";
import { competitionRepository } from "../repositories/competitionRepository";
import {
  validateCompetitionId,
  validateCreateCompetition,
  validateUpdateCompetition,
} from "../validators/competitionValidator";

export function createCompetitionService(
  repository: CompetitionRepository = competitionRepository
) {
  return {
    async create(payload: Partial<CreateCompetitionInput>): Promise<Competition> {
      const input = validateCreateCompetition(payload);
      return repository.create(input);
    },

    async findAll(): Promise<Competition[]> {
      return repository.findAll();
    },

    async findById(idParam: unknown): Promise<Competition> {
      const id = validateCompetitionId(idParam);
      const competition = await repository.findById(id);

      if (!competition) {
        throw new NotFoundError("Competição não encontrada");
      }

      return competition;
    },

    async update(
      idParam: unknown,
      payload: Partial<UpdateCompetitionInput>
    ): Promise<Competition> {
      const id = validateCompetitionId(idParam);
      const input = validateUpdateCompetition(payload);
      const competition = await repository.update(id, input);

      if (!competition) {
        throw new NotFoundError("Competição não encontrada");
      }

      return competition;
    },

    async delete(idParam: unknown): Promise<void> {
      const id = validateCompetitionId(idParam);
      const deleted = await repository.delete(id);

      if (!deleted) {
        throw new NotFoundError("Competição não encontrada");
      }
    },

    async close(idParam: unknown): Promise<Competition> {
      const id = validateCompetitionId(idParam);
      const competition = await repository.close(id);

      if (!competition) {
        throw new NotFoundError("Competição não encontrada");
      }

      return competition;
    },

    async activate(idParam: unknown): Promise<Competition> {
      const id = validateCompetitionId(idParam);
      const competition = await repository.activate(id);

      if (!competition) {
        throw new NotFoundError("Competição não encontrada");
      }

      return competition;
    },
  };
}

export const competitionService = createCompetitionService();
