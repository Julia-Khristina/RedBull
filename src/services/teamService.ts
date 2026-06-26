import {
  Team,
  TeamRepository,
  CreateTeamInput,
  UpdateTeamInput,
} from "../models/team";
import { teamRepository } from "../repositories/teamRepository";
import {
  validateCreateTeam,
  validateSetActiveRunner,
  validateUpdateTeam,
} from "../validators/teamValidator";
import { ConflictError, NotFoundError } from "../errors/AppError";
import { competitionService } from "./competitionService";

export function createTeamService(
  repository: TeamRepository = teamRepository,
  competitionSvc: Pick<typeof competitionService, "findById"> = competitionService
) {
  return {
    async create(payload: Partial<CreateTeamInput>): Promise<Team> {
      const input = validateCreateTeam(payload);
      await competitionSvc.findById(input.id_competition);

      const teams = await repository.findByCompetition(input.id_competition);
      const duplicatedName = teams.some(
        (team) => team.name.trim().toLowerCase() === input.name.toLowerCase()
      );
      if (duplicatedName) {
        throw new ConflictError("Equipe já cadastrada nesta competição");
      }

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

    async setActiveRunnerByCompetitionAndId(
      competitionId: number,
      id: number,
      payload: unknown
    ): Promise<Team> {
      const input = validateSetActiveRunner(payload);
      const team = await repository.findByCompetitionAndId(competitionId, id);

      if (!team) {
        throw new NotFoundError(`Equipe ${id} não encontrada`);
      }

      const runner = await repository.findRunnerByTeamAndId(id, input.runnerId);
      if (!runner) {
        throw new NotFoundError(
          `Runner ${input.runnerId} não encontrado nesta equipe`
        );
      }

      const updated = await repository.setActiveRunnerByCompetitionAndId(
        competitionId,
        id,
        input.runnerId
      );

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
