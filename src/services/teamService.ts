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

    async findById(id: number): Promise<Team> {
      const team = await repository.findById(id);

      if (!team) {
        throw new NotFoundError(`Equipe ${id} não encontrada`);
      }

      return team;
    },

    async findByCompetition(competicaoId: number): Promise<Team[]> {
      return repository.findByCompetition(competicaoId);
    },

    async update(
      id: number,
      payload: Partial<UpdateTeamInput>
    ): Promise<Team> {
      const input = validateUpdateTeam(payload);
      const updated = await repository.update(id, input);

      if (!updated) {
        throw new NotFoundError(`Equipe ${id} não encontrada`);
      }

      return updated;
    },

    async delete(id: number): Promise<void> {
      const deleted = await repository.delete(id);

      if (!deleted) {
        throw new NotFoundError(`Equipe ${id} não encontrada`);
      }
    },
  };
}

export const teamService = createTeamService();
