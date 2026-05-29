import { createAthleteService } from "../src/services/athleteService";
import { Athlete, AthleteRepository } from "../src/models/athlete";
import {
  NotFoundError,
  ValidationError,
  UnprocessableError,
} from "../src/errors/AppError";

const athleteFixture: Athlete = {
  id: 1,
  nome: "João Silva",
  status: "corredor",
  email: "joao@test.com",
  telefone: null,
  cpf: "111.222.333-44",
  equipe_id: 10,
  criado_em: "2026-06-01T00:00:00.000Z",
};

function makeRepositoryMock(
  overrides: Partial<AthleteRepository> = {}
): AthleteRepository {
  return {
    create: jest.fn(),
    findById: jest.fn(),
    findByTeam: jest.fn(),
    countByTeam: jest.fn(),
    findTeamById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    ...overrides,
  };
}

// ─── create ──────────────────────────────────────────────────────────────────

describe("athleteService.create", () => {
  it("deve criar atleta com payload válido", async () => {
    // Arrange
    const repository = makeRepositoryMock({
      findTeamById: jest.fn().mockResolvedValue({ id: 10 }),
      countByTeam: jest.fn().mockResolvedValue(0),
      create: jest.fn().mockResolvedValue(athleteFixture),
    });
    const service = createAthleteService(repository);

    // Act
    const result = await service.create({
      nome: "João Silva",
      cpf: "111.222.333-44",
      email: "joao@test.com",
      equipe_id: 10,
    });

    // Assert
    expect(result).toMatchObject({ nome: "João Silva", equipe_id: 10 });
    expect(repository.create).toHaveBeenCalled();
  });

  it("deve lançar NotFoundError quando equipe não existe", async () => {
    // Arrange
    const repository = makeRepositoryMock({
      findTeamById: jest.fn().mockResolvedValue(null),
    });
    const service = createAthleteService(repository);

    // Act & Assert
    await expect(
      service.create({
        nome: "X",
        cpf: "000.000.000-00",
        email: "x@test.com",
        equipe_id: 99,
      })
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("deve lançar UnprocessableError quando equipe já tem 16 atletas", async () => {
    // Arrange
    const repository = makeRepositoryMock({
      findTeamById: jest.fn().mockResolvedValue({ id: 10 }),
      countByTeam: jest.fn().mockResolvedValue(16),
    });
    const service = createAthleteService(repository);

    // Act & Assert
    await expect(
      service.create({
        nome: "X",
        cpf: "000.000.000-00",
        email: "x@test.com",
        equipe_id: 10,
      })
    ).rejects.toBeInstanceOf(UnprocessableError);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("deve lançar ValidationError quando nome está ausente", async () => {
    // Arrange
    const repository = makeRepositoryMock({
      findTeamById: jest.fn().mockResolvedValue({ id: 10 }),
      countByTeam: jest.fn().mockResolvedValue(0),
    });
    const service = createAthleteService(repository);

    // Act & Assert
    await expect(
      service.create({
        cpf: "000.000.000-00",
        email: "x@test.com",
        equipe_id: 10,
      } as never)
    ).rejects.toBeInstanceOf(ValidationError);
  });
});

// ─── findById ────────────────────────────────────────────────────────────────

describe("athleteService.findById", () => {
  it("deve retornar atleta quando existe", async () => {
    // Arrange
    const repository = makeRepositoryMock({
      findById: jest.fn().mockResolvedValue(athleteFixture),
    });

    // Act
    const result = await createAthleteService(repository).findById(1, 10);

    // Assert
    expect(result).toEqual(athleteFixture);
  });

  it("deve lançar NotFoundError quando não existe", async () => {
    // Arrange
    const repository = makeRepositoryMock({
      findById: jest.fn().mockResolvedValue(null),
    });

    // Act & Assert
    await expect(
      createAthleteService(repository).findById(999, 10)
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});

// ─── update ──────────────────────────────────────────────────────────────────

describe("athleteService.update", () => {
  it("deve atualizar atleta existente", async () => {
    // Arrange
    const updated = { ...athleteFixture, nome: "Atualizado" };
    const repository = makeRepositoryMock({
      update: jest.fn().mockResolvedValue(updated),
    });

    // Act
    const result = await createAthleteService(repository).update(1, 10, {
      nome: "Atualizado",
    });

    // Assert
    expect(result.nome).toBe("Atualizado");
    expect(repository.update).toHaveBeenCalledWith(1, 10, { nome: "Atualizado" });
  });

  it("deve lançar NotFoundError quando não existe", async () => {
    // Arrange
    const repository = makeRepositoryMock({
      update: jest.fn().mockResolvedValue(null),
    });

    // Act & Assert
    await expect(
      createAthleteService(repository).update(999, 10, { nome: "X" })
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});

// ─── delete ──────────────────────────────────────────────────────────────────

describe("athleteService.delete", () => {
  it("deve deletar atleta existente sem lançar erro", async () => {
    // Arrange
    const repository = makeRepositoryMock({
      delete: jest.fn().mockResolvedValue(true),
    });

    // Act & Assert
    await expect(
      createAthleteService(repository).delete(1, 10)
    ).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith(1, 10);
  });

  it("deve lançar NotFoundError quando não existe", async () => {
    // Arrange
    const repository = makeRepositoryMock({
      delete: jest.fn().mockResolvedValue(false),
    });

    // Act & Assert
    await expect(
      createAthleteService(repository).delete(999, 10)
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
