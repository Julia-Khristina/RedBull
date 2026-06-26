import { createTeamService } from "../src/services/teamService";
import { Team, TeamRepository } from "../src/models/team";
import { ConflictError, NotFoundError, ValidationError } from "../src/errors/AppError";

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
  const competitionServiceMock = {
    findById: jest.fn().mockResolvedValue({ id: 40 }),
  };

  beforeEach(() => {
    competitionServiceMock.findById.mockClear();
  });

  it("deve criar equipe com name e id_competition validados", async () => {
    const repository = makeRepositoryMock({
      findByCompetition: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue(teamFixture),
    });
    const teamService = createTeamService(repository, competitionServiceMock);

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
    expect(competitionServiceMock.findById).toHaveBeenCalledWith(40);
    expect(repository.findByCompetition).toHaveBeenCalledWith(40);
  });

  it("deve lançar ValidationError quando name está ausente", async () => {
    const repository = makeRepositoryMock();
    const teamService = createTeamService(repository, competitionServiceMock);

    await expect(
      teamService.create({ id_competition: 40 } as never)
    ).rejects.toBeInstanceOf(ValidationError);
    expect(competitionServiceMock.findById).not.toHaveBeenCalled();
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("deve lançar ConflictError quando já existe equipe com o mesmo nome", async () => {
    const repository = makeRepositoryMock({
      findByCompetition: jest.fn().mockResolvedValue([teamFixture]),
    });
    const teamService = createTeamService(repository, competitionServiceMock);

    await expect(
      teamService.create({ name: " equipe alpha ", id_competition: 40 })
    ).rejects.toBeInstanceOf(ConflictError);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("deve propagar NotFoundError quando competição não existe", async () => {
    const repository = makeRepositoryMock();
    const missingCompetitionService = {
      findById: jest.fn().mockRejectedValue(new NotFoundError("Competição não encontrada")),
    };
    const teamService = createTeamService(repository, missingCompetitionService);

    await expect(
      teamService.create({ name: "Equipe Alpha", id_competition: 404 })
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(repository.findByCompetition).not.toHaveBeenCalled();
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

describe("teamService.findByCompetition", () => {
  it("deve listar equipes da competicao", async () => {
    const repository = makeRepositoryMock({
      findByCompetition: jest.fn().mockResolvedValue([teamFixture]),
    });
    const teamService = createTeamService(repository);

    await expect(teamService.findByCompetition(40)).resolves.toEqual([
      teamFixture,
    ]);
    expect(repository.findByCompetition).toHaveBeenCalledWith(40);
  });
});

describe("teamService.findByUuid", () => {
  it("deve retornar equipe quando uuid existe", async () => {
    const repository = makeRepositoryMock({
      findByUuid: jest.fn().mockResolvedValue(teamFixture),
    });
    const teamService = createTeamService(repository);

    await expect(teamService.findByUuid(teamFixture.uuid)).resolves.toEqual(
      teamFixture
    );
    expect(repository.findByUuid).toHaveBeenCalledWith(teamFixture.uuid);
  });

  it("deve lancar NotFoundError quando uuid nao existe", async () => {
    const repository = makeRepositoryMock({
      findByUuid: jest.fn().mockResolvedValue(null),
    });
    const teamService = createTeamService(repository);

    await expect(teamService.findByUuid("uuid-inexistente")).rejects.toBeInstanceOf(
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

describe("teamService.setActiveRunnerByCompetitionAndId", () => {
  it("deve definir corredor ativo quando equipe e corredor existem", async () => {
    const updated = { ...teamFixture, active_runner_id: 7 };
    const repository = makeRepositoryMock({
      findByCompetitionAndId: jest.fn().mockResolvedValue(teamFixture),
      findRunnerByTeamAndId: jest.fn().mockResolvedValue({ id: 7 }),
      setActiveRunnerByCompetitionAndId: jest.fn().mockResolvedValue(updated),
    });
    const teamService = createTeamService(repository);

    const team = await teamService.setActiveRunnerByCompetitionAndId(40, 1, {
      runnerId: 7,
    });

    expect(team.active_runner_id).toBe(7);
    expect(repository.findRunnerByTeamAndId).toHaveBeenCalledWith(1, 7);
    expect(repository.setActiveRunnerByCompetitionAndId).toHaveBeenCalledWith(
      40,
      1,
      7
    );
  });

  it("deve aceitar athleteId como alias de runnerId", async () => {
    const updated = { ...teamFixture, active_runner_id: 8 };
    const repository = makeRepositoryMock({
      findByCompetitionAndId: jest.fn().mockResolvedValue(teamFixture),
      findRunnerByTeamAndId: jest.fn().mockResolvedValue({ id: 8 }),
      setActiveRunnerByCompetitionAndId: jest.fn().mockResolvedValue(updated),
    });
    const teamService = createTeamService(repository);

    await teamService.setActiveRunnerByCompetitionAndId(40, 1, {
      athleteId: 8,
    });

    expect(repository.findRunnerByTeamAndId).toHaveBeenCalledWith(1, 8);
  });

  it("deve lancar NotFoundError quando equipe nao existe", async () => {
    const repository = makeRepositoryMock({
      findByCompetitionAndId: jest.fn().mockResolvedValue(null),
    });
    const teamService = createTeamService(repository);

    await expect(
      teamService.setActiveRunnerByCompetitionAndId(40, 999, { runnerId: 7 })
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(repository.findRunnerByTeamAndId).not.toHaveBeenCalled();
  });

  it("deve lancar NotFoundError quando corredor nao pertence a equipe", async () => {
    const repository = makeRepositoryMock({
      findByCompetitionAndId: jest.fn().mockResolvedValue(teamFixture),
      findRunnerByTeamAndId: jest.fn().mockResolvedValue(null),
    });
    const teamService = createTeamService(repository);

    await expect(
      teamService.setActiveRunnerByCompetitionAndId(40, 1, { runnerId: 999 })
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(repository.setActiveRunnerByCompetitionAndId).not.toHaveBeenCalled();
  });

  it("deve lancar NotFoundError quando atualizacao nao retorna equipe", async () => {
    const repository = makeRepositoryMock({
      findByCompetitionAndId: jest.fn().mockResolvedValue(teamFixture),
      findRunnerByTeamAndId: jest.fn().mockResolvedValue({ id: 7 }),
      setActiveRunnerByCompetitionAndId: jest.fn().mockResolvedValue(null),
    });
    const teamService = createTeamService(repository);

    await expect(
      teamService.setActiveRunnerByCompetitionAndId(40, 1, { runnerId: 7 })
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
