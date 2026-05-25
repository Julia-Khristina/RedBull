import {
  Competition,
  CompetitionRepository,
  CreateCompetitionInput,
} from "../models/competition";
import { competitionRepository } from "../repositories/competitionRepository";
import { validateCreateCompetition } from "../validators/competitionValidator";

export function createCompetitionService(
  repository: CompetitionRepository = competitionRepository
) {
  return {
    async create(payload: Partial<CreateCompetitionInput>): Promise<Competition> {
      const input = validateCreateCompetition(payload);
      return repository.create(input);
    },
  };
}

export const competitionService = createCompetitionService();
