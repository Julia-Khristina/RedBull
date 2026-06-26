import { createCheckpointService } from "../src/services/checkpointService";
import { Checkpoint, CheckpointRepository } from "../src/models/checkpoint";
import { Competition } from "../src/models/competition";
import {
  NotFoundError,
  ValidationError,
  ConflictError,
} from "../src/errors/AppError";

const checkpointFixture: Checkpoint = {
  id: 1,
  identifier: "CP-001",
  distance_km: 5.0,
  pace: "5:00",
  time: "25:00",
  image: null,
  id_runner: 1,
  id_competition: 1,
  id_admin: 1,
  created_at: "2026-05-01T10:00:00.000Z",
};

const activeCompetitionFixture: Competition = {
  id: 1,
  name: "Competição Teste",
  address: "Endereço Teste",
  date: "2026-06-21",
  status: "in_progress",
  created_at: "2026-06-20T10:00:00.000Z",
  started_at: "2026-06-21T08:00:00.000Z",
};

function makeRepositoryMock(
  overrides: Partial<CheckpointRepository> = {}
): CheckpointRepository {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByRunner: jest.fn(),
    findByCompetition: jest.fn(),
    findInconsistenciesByCompetition: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    ...overrides,
  };
}

function makeCompetitionServiceMock(
  overrides: Partial<typeof import("../src/services/competitionService").competitionService> = {}
) {
  return {
    findById: jest.fn().mockResolvedValue(activeCompetitionFixture),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    close: jest.fn(),
    activate: jest.fn(),
    ...overrides,
  } as unknown as typeof import("../src/services/competitionService").competitionService;
}

describe("checkpointService.findAll", () => {
  it("deve retornar lista de checkpoints", async () => {
    const repository = makeRepositoryMock({
      findAll: jest.fn().mockResolvedValue([checkpointFixture]),
    });
    const service = createCheckpointService(repository);

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ identifier: "CP-001" });
    expect(repository.findAll).toHaveBeenCalled();
  });
});

describe("checkpointService.findInconsistenciesByCompetition", () => {
  it("deve retornar inconsistencies por competição", async () => {
    const repository = makeRepositoryMock({
      findInconsistenciesByCompetition: jest
        .fn()
        .mockResolvedValue([checkpointFixture]),
    });
    const service = createCheckpointService(repository);

    const result = await service.findInconsistenciesByCompetition(1);

    expect(result).toEqual([checkpointFixture]);
    expect(repository.findInconsistenciesByCompetition).toHaveBeenCalledWith(1);
  });
});

describe("checkpointService.findById", () => {
  it("deve retornar checkpoint quando existe", async () => {
    const repository = makeRepositoryMock({
      findById: jest.fn().mockResolvedValue(checkpointFixture),
    });

    const result = await createCheckpointService(repository).findById(1);

    expect(result).toEqual(checkpointFixture);
  });

  it("deve lançar NotFoundError quando não existe", async () => {
    const repository = makeRepositoryMock({
      findById: jest.fn().mockResolvedValue(null),
    });

    await expect(
      createCheckpointService(repository).findById(999)
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("checkpointService.create", () => {
  it("deve criar checkpoint com payload válido", async () => {
    const repository = makeRepositoryMock({
      create: jest.fn().mockResolvedValue(checkpointFixture),
    });
    const competitionSvc = makeCompetitionServiceMock();
    const service = createCheckpointService(repository, competitionSvc);

    const result = await service.create({
      identifier: "CP-001",
      distance_km: 5.0,
      id_runner: 1,
      id_competition: 1,
      id_admin: 1,
    });

    expect(result).toMatchObject({ identifier: "CP-001", distance_km: 5.0 });
    expect(repository.create).toHaveBeenCalled();
  });

  it("deve lançar ValidationError quando identifier está ausente", async () => {
    const repository = makeRepositoryMock();
    const competitionSvc = makeCompetitionServiceMock();
    const service = createCheckpointService(repository, competitionSvc);

    await expect(
      service.create({
        distance_km: 5.0,
        id_runner: 1,
        id_competition: 1,
        id_admin: 1,
      } as never)
    ).rejects.toBeInstanceOf(ValidationError);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("deve lançar ValidationError quando distance_km é negativo", async () => {
    const repository = makeRepositoryMock();
    const competitionSvc = makeCompetitionServiceMock();
    const service = createCheckpointService(repository, competitionSvc);

    await expect(
      service.create({
        identifier: "CP-002",
        distance_km: -1,
        id_runner: 1,
        id_competition: 1,
        id_admin: 1,
      })
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("deve lançar ConflictError em violação de unique constraint", async () => {
    const pgUniqueError = { code: "23505" };
    const repository = makeRepositoryMock({
      create: jest.fn().mockRejectedValue(pgUniqueError),
    });
    const competitionSvc = makeCompetitionServiceMock();

    await expect(
      createCheckpointService(repository, competitionSvc).create({
        identifier: "CP-001",
        distance_km: 5.0,
        id_runner: 1,
        id_competition: 1,
        id_admin: 1,
      })
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("deve lançar NotFoundError em violação de FK constraint", async () => {
    const pgFkError = { code: "23503" };
    const repository = makeRepositoryMock({
      create: jest.fn().mockRejectedValue(pgFkError),
    });
    const competitionSvc = makeCompetitionServiceMock();

    await expect(
      createCheckpointService(repository, competitionSvc).create({
        identifier: "CP-099",
        distance_km: 5.0,
        id_runner: 999,
        id_competition: 999,
        id_admin: 999,
      })
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("deve lançar ValidationError quando competição está fechada", async () => {
    const repository = makeRepositoryMock();
    const competitionSvc = makeCompetitionServiceMock({
      findById: jest.fn().mockResolvedValue({
        ...activeCompetitionFixture,
        status: "closed",
      }),
    });
    const service = createCheckpointService(repository, competitionSvc);

    await expect(
      service.create({
        identifier: "CP-CLOSED",
        distance_km: 5.0,
        id_runner: 1,
        id_competition: 1,
        id_admin: 1,
      })
    ).rejects.toBeInstanceOf(ValidationError);
    expect(repository.create).not.toHaveBeenCalled();
  });
});

describe("checkpointService.update", () => {
  it("deve atualizar checkpoint existente", async () => {
    const updated = { ...checkpointFixture, distance_km: 10.0 };
    const repository = makeRepositoryMock({
      update: jest.fn().mockResolvedValue(updated),
    });

    const result = await createCheckpointService(repository).update(1, {
      distance_km: 10.0,
    });

    expect(result.distance_km).toBe(10.0);
    expect(repository.update).toHaveBeenCalledWith(1, { distance_km: 10.0 });
  });

  it("deve lançar NotFoundError quando não existe", async () => {
    const repository = makeRepositoryMock({
      update: jest.fn().mockResolvedValue(null),
    });

    await expect(
      createCheckpointService(repository).update(999, { distance_km: 5.0 })
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("deve lançar ValidationError quando payload vazio", async () => {
    const repository = makeRepositoryMock();

    await expect(
      createCheckpointService(repository).update(1, {})
    ).rejects.toBeInstanceOf(ValidationError);
    expect(repository.update).not.toHaveBeenCalled();
  });
});

describe("checkpointService.delete", () => {
  it("deve deletar checkpoint existente sem lançar erro", async () => {
    const repository = makeRepositoryMock({
      delete: jest.fn().mockResolvedValue(true),
    });

    await expect(
      createCheckpointService(repository).delete(1)
    ).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it("deve lançar NotFoundError quando não existe", async () => {
    const repository = makeRepositoryMock({
      delete: jest.fn().mockResolvedValue(false),
    });

    await expect(
      createCheckpointService(repository).delete(999)
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
