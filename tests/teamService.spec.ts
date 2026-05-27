import { createTeamService } from "../src/services/teamService";
import { Team, TeamRepository } from "../src/models/team";
import { NotFoundError, ValidationError } from "../src/errors/AppError";

const teamFixture: Team = {
  id: 1,
  nome: "Equipe Alpha",
  uuid: "d106eb1a-93d2-4f13-becd-b6a28bbe7bdb",
  qr_code: null,
  competicao_id: 40,
  criado_em: "2026-05-25T12:51:10.675699",
};

function makeRepositoryMock(
  overrides: Partial<TeamRepository> = {}
): TeamRepository {
  return {
    create: jest.fn(),
    findById: jest.fn(),
    findByCompetition: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    ...overrides,
  };
}

describe("teamService.create", () => {
  it("deve criar equipe com nome e competicao_id validados", async () => {
    const repository = makeRepositoryMock({
      create: jest.fn().mockResolvedValue(teamFixture),
    });
    const teamService = createTeamService(repository);

    const team = await teamService.create({
      nome: "Equipe Alpha",
      competicao_id: 40,
    });

    expect(team).toMatchObject({
      nome: "Equipe Alpha",
      competicao_id: 40,
    });
    expect(team.uuid).toBeDefined();
    expect(repository.create).toHaveBeenCalledWith({
      nome: "Equipe Alpha",
      competicao_id: 40,
    });
  });

  it("deve lançar ValidationError quando nome está ausente", async () => {
    const repository = makeRepositoryMock();
    const teamService = createTeamService(repository);

    await expect(
      teamService.create({ competicao_id: 40 } as never)
    ).rejects.toBeInstanceOf(ValidationError);
    expect(repository.create).not.toHaveBeenCalled();
  });
});

describe("teamService.findById", () => {
  it("deve retornar equipe quando existe", async () => {
    const repository = makeRepositoryMock({
      findById: jest.fn().mockResolvedValue(teamFixture),
    });
    const teamService = createTeamService(repository);

    const team = await teamService.findById(1);

    expect(team).toEqual(teamFixture);
  });

  it("deve lançar NotFoundError quando equipe não existe", async () => {
    const repository = makeRepositoryMock({
      findById: jest.fn().mockResolvedValue(null),
    });
    const teamService = createTeamService(repository);

    await expect(teamService.findById(999)).rejects.toBeInstanceOf(
      NotFoundError
    );
  });
});

describe("teamService.update", () => {
  it("deve atualizar equipe existente", async () => {
    const updated = { ...teamFixture, nome: "Renomeada" };
    const repository = makeRepositoryMock({
      update: jest.fn().mockResolvedValue(updated),
    });
    const teamService = createTeamService(repository);

    const team = await teamService.update(1, { nome: "Renomeada" });

    expect(team.nome).toBe("Renomeada");
    expect(repository.update).toHaveBeenCalledWith(1, { nome: "Renomeada" });
  });

  it("deve lançar NotFoundError quando equipe não existe", async () => {
    const repository = makeRepositoryMock({
      update: jest.fn().mockResolvedValue(null),
    });
    const teamService = createTeamService(repository);

    await expect(
      teamService.update(999, { nome: "Qualquer" })
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("teamService.delete", () => {
  it("deve deletar equipe existente", async () => {
    const repository = makeRepositoryMock({
      delete: jest.fn().mockResolvedValue(true),
    });
    const teamService = createTeamService(repository);

    await expect(teamService.delete(1)).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it("deve lançar NotFoundError quando equipe não existe", async () => {
    const repository = makeRepositoryMock({
      delete: jest.fn().mockResolvedValue(false),
    });
    const teamService = createTeamService(repository);

    await expect(teamService.delete(999)).rejects.toBeInstanceOf(
      NotFoundError
    );
  });
});
