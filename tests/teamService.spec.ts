import { createTeamService } from "../src/services/teamService";
import { Team, TeamRepository } from "../src/models/team";
import { NotFoundError, ValidationError } from "../src/errors/AppError";

const teamFixture: Team = {
  id: 1,
  name: "Equipe Alpha",
  uuid: "d106eb1a-93d2-4f13-becd-b6a28bbe7bdb",
  qr_code: null,
  id_competition: 40,
  created_at: "2026-05-25T12:51:10.675699",
};

function makeRepositoryMock(
  overrides: Partial<TeamRepository> = {}
): TeamRepository {
  return {
    create: jest.fn(),
    findByCompetition: jest.fn(),
    findByUuid: jest.fn(),
    findByCompetitionAndId: jest.fn(),
    findRunnerByTeamAndId: jest.fn(),
    updateByCompetitionAndId: jest.fn(),
    setActiveRunnerByCompetitionAndId: jest.fn(),
    deleteByCompetitionAndId: jest.fn(),
    ...overrides,
  };
}

describe("teamService.create", () => {
  it("deve criar equipe com name e id_competition validados", async () => {
    const repository = makeRepositoryMock({
      create: jest.fn().mockResolvedValue(teamFixture),
    });
    const teamService = createTeamService(repository);

    const team = await teamService.create({
      name: "Equipe Alpha",
      id_competition: 40,
    });

    expect(team).toMatchObject({
      name: "Equipe Alpha",
      id_competition: 40,
    });
    expect(team.uuid).toBeDefined();
    expect(repository.create).toHaveBeenCalledWith({
      name: "Equipe Alpha",
      id_competition: 40,
    });
  });

  it("deve lançar ValidationError quando name está ausente", async () => {
    const repository = makeRepositoryMock();
    const teamService = createTeamService(repository);

    await expect(
      teamService.create({ id_competition: 40 } as never)
    ).rejects.toBeInstanceOf(ValidationError);
    expect(repository.create).not.toHaveBeenCalled();
  });
});

describe("teamService.findByCompetitionAndId", () => {
  it("deve retornar equipe quando existe", async () => {
    const repository = makeRepositoryMock({
      findByCompetitionAndId: jest.fn().mockResolvedValue(teamFixture),
    });
    const teamService = createTeamService(repository);

    const team = await teamService.findByCompetitionAndId(40, 1);

    expect(team).toEqual(teamFixture);
  });

  it("deve lançar NotFoundError quando equipe não existe", async () => {
    const repository = makeRepositoryMock({
      findByCompetitionAndId: jest.fn().mockResolvedValue(null),
    });
    const teamService = createTeamService(repository);

    await expect(teamService.findByCompetitionAndId(40, 999)).rejects.toBeInstanceOf(
      NotFoundError
    );
  });
});

describe("teamService.updateByCompetitionAndId", () => {
  it("deve atualizar equipe existente", async () => {
    const updated = { ...teamFixture, name: "Renomeada" };
    const repository = makeRepositoryMock({
      updateByCompetitionAndId: jest.fn().mockResolvedValue(updated),
    });
    const teamService = createTeamService(repository);

    const team = await teamService.updateByCompetitionAndId(40, 1, { name: "Renomeada" });

    expect(team.name).toBe("Renomeada");
    expect(repository.updateByCompetitionAndId).toHaveBeenCalledWith(40, 1, { name: "Renomeada" });
  });

  it("deve lançar NotFoundError quando equipe não existe", async () => {
    const repository = makeRepositoryMock({
      updateByCompetitionAndId: jest.fn().mockResolvedValue(null),
    });
    const teamService = createTeamService(repository);

    await expect(
      teamService.updateByCompetitionAndId(40, 999, { name: "Qualquer" })
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("teamService.deleteByCompetitionAndId", () => {
  it("deve deletar equipe existente", async () => {
    const repository = makeRepositoryMock({
      deleteByCompetitionAndId: jest.fn().mockResolvedValue(true),
    });
    const teamService = createTeamService(repository);

    await expect(teamService.deleteByCompetitionAndId(40, 1)).resolves.toBeUndefined();
    expect(repository.deleteByCompetitionAndId).toHaveBeenCalledWith(40, 1);
  });

  it("deve lançar NotFoundError quando equipe não existe", async () => {
    const repository = makeRepositoryMock({
      deleteByCompetitionAndId: jest.fn().mockResolvedValue(false),
    });
    const teamService = createTeamService(repository);

    await expect(teamService.deleteByCompetitionAndId(40, 999)).rejects.toBeInstanceOf(
      NotFoundError
    );
  });
});
