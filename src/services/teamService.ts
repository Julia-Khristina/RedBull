import {
  Team,
  TeamRepository,
  CreateTeamInput,
  UpdateTeamInput,
} from "../models/team";
import { teamRepository } from "../repositories/teamRepository";
import {
  validateCreateTeam,
  validateUpdateTeam,
} from "../validators/teamValidator";
import { NotFoundError } from "../errors/AppError";

export function createTeamService(
  repository: TeamRepository = teamRepository
) {
  return {
    async create(payload: Partial<CreateTeamInput>): Promise<Team> {
      const input = validateCreateTeam(payload);
      return repository.create(input);
    },

    async findByCompetition(competitionId: number): Promise<Team[]> {
      return repository.findByCompetition(competitionId);
    },

    async findByUuid(uuid: string): Promise<Team> {
      const team = await repository.findByUuid(uuid);

      if (!team) {
        throw new NotFoundError("Equipe não encontrada");
      }

      return team;
    },

    async findByCompetitionAndId(competitionId: number, id: number): Promise<Team> {
      const team = await repository.findByCompetitionAndId(competitionId, id);

      if (!team) {
        throw new NotFoundError(`Equipe ${id} não encontrada`);
      }

      return team;
    },

    async updateByCompetitionAndId(
      competitionId: number,
      id: number,
      payload: Partial<UpdateTeamInput>
    ): Promise<Team> {
      const input = validateUpdateTeam(payload);
      const updated = await repository.updateByCompetitionAndId(competitionId, id, input);

      if (!updated) {
        throw new NotFoundError(`Equipe ${id} não encontrada`);
      }

      return updated;
    },

    async deleteByCompetitionAndId(competitionId: number, id: number): Promise<void> {
      const deleted = await repository.deleteByCompetitionAndId(competitionId, id);

      if (!deleted) {
        throw new NotFoundError(`Equipe ${id} não encontrada`);
      }
    },
  };
}

export const teamService = createTeamService();
