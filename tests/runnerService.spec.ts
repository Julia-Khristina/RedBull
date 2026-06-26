import { createRunnerService } from "../src/services/runnerService";
import { Runner, RunnerRepository } from "../src/models/runner";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
  UnprocessableError,
} from "../src/errors/AppError";

const runnerFixture: Runner = {
  id: 1,
  name: "Joao Silva",
  status: "runner",
  email: "joao@test.com",
  phone: null,
  cpf: "111.222.333-44",
  id_team: 10,
  created_at: "2026-06-01T00:00:00.000Z",
};

function makeRepositoryMock(
  overrides: Partial<RunnerRepository> = {}
): RunnerRepository {
  return {
    create: jest.fn(),
    findByTeamAndId: jest.fn(),
    findByTeam: jest.fn(),
    countByTeam: jest.fn(),
    findTeamById: jest.fn(),
    updateByTeamAndId: jest.fn(),
    deleteByTeamAndId: jest.fn(),
    ...overrides,
  };
}

describe("runnerService.create", () => {
  it("deve criar atleta com payload valido", async () => {
    const repository = makeRepositoryMock({
      findTeamById: jest.fn().mockResolvedValue({ id: 10 }),
      countByTeam: jest.fn().mockResolvedValue(0),
      create: jest.fn().mockResolvedValue(runnerFixture),
    });
    const service = createRunnerService(repository);

    const result = await service.create({
      name: "Joao Silva",
      cpf: "111.222.333-44",
      email: "joao@test.com",
      id_team: 10,
    });

    expect(result).toMatchObject({ name: "Joao Silva", id_team: 10 });
    expect(repository.create).toHaveBeenCalled();
  });

  it("deve normalizar CPF sem mascara antes de persistir", async () => {
    const repository = makeRepositoryMock({
      findTeamById: jest.fn().mockResolvedValue({ id: 10 }),
      countByTeam: jest.fn().mockResolvedValue(0),
      create: jest.fn().mockResolvedValue(runnerFixture),
    });
    const service = createRunnerService(repository);

    await service.create({
      name: "Joao Silva",
      cpf: "11122233344",
      email: "joao@test.com",
      id_team: 10,
    });

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ cpf: "111.222.333-44" })
    );
  });

  it("deve lancar NotFoundError quando equipe nao existe", async () => {
    const repository = makeRepositoryMock({
      findTeamById: jest.fn().mockResolvedValue(null),
    });
    const service = createRunnerService(repository);

    await expect(
      service.create({
        name: "X",
        cpf: "000.000.000-00",
        email: "x@test.com",
        id_team: 99,
      })
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("deve lancar UnprocessableError quando equipe ja tem 16 atletas", async () => {
    const repository = makeRepositoryMock({
      findTeamById: jest.fn().mockResolvedValue({ id: 10 }),
      countByTeam: jest.fn().mockResolvedValue(16),
    });
    const service = createRunnerService(repository);

    await expect(
      service.create({
        name: "X",
        cpf: "000.000.000-00",
        email: "x@test.com",
        id_team: 10,
      })
    ).rejects.toBeInstanceOf(UnprocessableError);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("deve lancar ValidationError quando name esta ausente", async () => {
    const repository = makeRepositoryMock({
      findTeamById: jest.fn().mockResolvedValue({ id: 10 }),
      countByTeam: jest.fn().mockResolvedValue(0),
    });
    const service = createRunnerService(repository);

    await expect(
      service.create({
        cpf: "000.000.000-00",
        email: "x@test.com",
        id_team: 10,
      } as never)
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("deve lancar ConflictError quando CPF ja existe", async () => {
    const repository = makeRepositoryMock({
      findTeamById: jest.fn().mockResolvedValue({ id: 10 }),
      countByTeam: jest.fn().mockResolvedValue(0),
      create: jest.fn().mockRejectedValue({
        code: "23505",
        details: "Key (cpf)=(111.222.333-44) already exists.",
      }),
    });
    const service = createRunnerService(repository);

    await expect(
      service.create({
        name: "Joao Silva",
        cpf: "111.222.333-44",
        email: "joao@test.com",
        id_team: 10,
      })
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("deve relancar erro inesperado ao criar atleta", async () => {
    const repository = makeRepositoryMock({
      findTeamById: jest.fn().mockResolvedValue({ id: 10 }),
      countByTeam: jest.fn().mockResolvedValue(0),
      create: jest.fn().mockRejectedValue(new Error("database unavailable")),
    });
    const service = createRunnerService(repository);

    await expect(
      service.create({
        name: "Joao Silva",
        cpf: "111.222.333-44",
        email: "joao@test.com",
        id_team: 10,
      })
    ).rejects.toThrow("database unavailable");
  });
});

describe("runnerService.findByTeam", () => {
  it("deve listar atletas quando equipe existe", async () => {
    const repository = makeRepositoryMock({
      findTeamById: jest.fn().mockResolvedValue({ id: 10 }),
      findByTeam: jest.fn().mockResolvedValue([runnerFixture]),
    });
    const service = createRunnerService(repository);

    await expect(service.findByTeam(10)).resolves.toEqual([runnerFixture]);
    expect(repository.findTeamById).toHaveBeenCalledWith(10);
    expect(repository.findByTeam).toHaveBeenCalledWith(10);
  });

  it("deve lancar NotFoundError quando equipe nao existe", async () => {
    const repository = makeRepositoryMock({
      findTeamById: jest.fn().mockResolvedValue(null),
    });
    const service = createRunnerService(repository);

    await expect(service.findByTeam(999)).rejects.toBeInstanceOf(NotFoundError);
    expect(repository.findByTeam).not.toHaveBeenCalled();
  });
});

describe("runnerService.findByTeamAndId", () => {
  it("deve retornar atleta quando existe", async () => {
    const repository = makeRepositoryMock({
      findByTeamAndId: jest.fn().mockResolvedValue(runnerFixture),
    });

    const result = await createRunnerService(repository).findByTeamAndId(10, 1);

    expect(result).toEqual(runnerFixture);
  });

  it("deve lancar NotFoundError quando nao existe", async () => {
    const repository = makeRepositoryMock({
      findByTeamAndId: jest.fn().mockResolvedValue(null),
    });

    await expect(
      createRunnerService(repository).findByTeamAndId(10, 999)
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("runnerService.updateByTeamAndId", () => {
  it("deve atualizar atleta existente", async () => {
    const updated = { ...runnerFixture, name: "Atualizado" };
    const repository = makeRepositoryMock({
      updateByTeamAndId: jest.fn().mockResolvedValue(updated),
    });

    const result = await createRunnerService(repository).updateByTeamAndId(
      10,
      1,
      { name: "Atualizado" }
    );

    expect(result.name).toBe("Atualizado");
    expect(repository.updateByTeamAndId).toHaveBeenCalledWith(10, 1, {
      name: "Atualizado",
    });
  });

  it("deve lancar NotFoundError quando nao existe", async () => {
    const repository = makeRepositoryMock({
      updateByTeamAndId: jest.fn().mockResolvedValue(null),
    });

    await expect(
      createRunnerService(repository).updateByTeamAndId(10, 999, { name: "X" })
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("deve lancar ConflictError quando email ja existe", async () => {
    const repository = makeRepositoryMock({
      updateByTeamAndId: jest.fn().mockRejectedValue({
        code: "23505",
        details: "Key (email)=(joao@test.com) already exists.",
      }),
    });

    await expect(
      createRunnerService(repository).updateByTeamAndId(10, 1, {
        email: "joao@test.com",
      })
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("deve relancar erro inesperado ao atualizar atleta", async () => {
    const repository = makeRepositoryMock({
      updateByTeamAndId: jest.fn().mockRejectedValue(new Error("timeout")),
    });

    await expect(
      createRunnerService(repository).updateByTeamAndId(10, 1, {
        name: "Atualizado",
      })
    ).rejects.toThrow("timeout");
  });
});

describe("runnerService.deleteByTeamAndId", () => {
  it("deve deletar atleta existente sem lancar erro", async () => {
    const repository = makeRepositoryMock({
      deleteByTeamAndId: jest.fn().mockResolvedValue(true),
    });

    await expect(
      createRunnerService(repository).deleteByTeamAndId(10, 1)
    ).resolves.toBeUndefined();
    expect(repository.deleteByTeamAndId).toHaveBeenCalledWith(10, 1);
  });

  it("deve lancar NotFoundError quando nao existe", async () => {
    const repository = makeRepositoryMock({
      deleteByTeamAndId: jest.fn().mockResolvedValue(false),
    });

    await expect(
      createRunnerService(repository).deleteByTeamAndId(10, 999)
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("deve lancar ConflictError quando atleta possui checkpoints", async () => {
    const repository = makeRepositoryMock({
      deleteByTeamAndId: jest.fn().mockRejectedValue({ code: "23503" }),
    });

    await expect(
      createRunnerService(repository).deleteByTeamAndId(10, 1)
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("deve relancar erro inesperado ao deletar atleta", async () => {
    const repository = makeRepositoryMock({
      deleteByTeamAndId: jest.fn().mockRejectedValue(new Error("delete failed")),
    });

    await expect(
      createRunnerService(repository).deleteByTeamAndId(10, 1)
    ).rejects.toThrow("delete failed");
  });
});
