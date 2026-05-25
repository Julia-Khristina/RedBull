import { createCompetitionService } from "../src/services/competitionService";
import { NotFoundError } from "../src/errors/AppError";

function createRepositoryMock() {
  return {
    create: jest.fn().mockResolvedValue({
      id: 1,
      nome: "Red Bull 24h São Paulo",
      data: "2026-06-15",
      endereco: "São Paulo - SP",
      status: "não iniciado",
      criado_em: "2026-05-21T00:00:00.000Z",
    }),
    findAll: jest.fn().mockResolvedValue([]),
    findById: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockResolvedValue(null),
    delete: jest.fn().mockResolvedValue(false),
    close: jest.fn().mockResolvedValue(null),
  };
}

describe("competitionService", () => {
  it("deve criar competição com status inicial não iniciado", async () => {
    const repository = createRepositoryMock();
    const competitionService = createCompetitionService(repository);

    const competition = await competitionService.create({
      nome: "Red Bull 24h São Paulo",
      data: "2026-06-15",
      endereco: "São Paulo - SP",
    });

    expect(competition).toMatchObject({
      nome: "Red Bull 24h São Paulo",
      data: "2026-06-15",
      endereco: "São Paulo - SP",
      status: "não iniciado",
    });
    expect(competition.id).toBeDefined();
    expect(competition.criado_em).toBeDefined();
    expect(repository.create).toHaveBeenCalledWith({
      nome: "Red Bull 24h São Paulo",
      data: "2026-06-15",
      endereco: "São Paulo - SP",
    });
  });

  it("deve listar competições", async () => {
    const repository = createRepositoryMock();
    repository.findAll.mockResolvedValue([
      {
        id: 1,
        nome: "Red Bull 24h São Paulo",
        data: "2026-06-15",
        endereco: "São Paulo - SP",
        status: "não iniciado",
        criado_em: "2026-05-21T00:00:00.000Z",
      },
    ]);
    const competitionService = createCompetitionService(repository);

    const competitions = await competitionService.findAll();

    expect(competitions).toHaveLength(1);
    expect(repository.findAll).toHaveBeenCalled();
  });

  it("deve retornar competição existente por id", async () => {
    const repository = createRepositoryMock();
    repository.findById.mockResolvedValue({
      id: 1,
      nome: "Red Bull 24h São Paulo",
      data: "2026-06-15",
      endereco: "São Paulo - SP",
      status: "não iniciado",
      criado_em: "2026-05-21T00:00:00.000Z",
    });
    const competitionService = createCompetitionService(repository);

    const competition = await competitionService.findById("1");

    expect(competition.id).toBe(1);
    expect(repository.findById).toHaveBeenCalledWith(1);
  });

  it("deve lançar NotFoundError para competição inexistente", async () => {
    const repository = createRepositoryMock();
    const competitionService = createCompetitionService(repository);

    await expect(competitionService.findById("999")).rejects.toBeInstanceOf(
      NotFoundError
    );
  });

  it("deve atualizar competição existente", async () => {
    const repository = createRepositoryMock();
    repository.update.mockResolvedValue({
      id: 1,
      nome: "Competição atualizada",
      data: "2026-07-20",
      endereco: "Rio de Janeiro - RJ",
      status: "não iniciado",
      criado_em: "2026-05-21T00:00:00.000Z",
    });
    const competitionService = createCompetitionService(repository);

    const competition = await competitionService.update("1", {
      nome: "Competição atualizada",
      data: "2026-07-20",
      endereco: "Rio de Janeiro - RJ",
    });

    expect(competition.nome).toBe("Competição atualizada");
    expect(repository.update).toHaveBeenCalledWith(1, {
      nome: "Competição atualizada",
      data: "2026-07-20",
      endereco: "Rio de Janeiro - RJ",
    });
  });

  it("deve deletar competição existente", async () => {
    const repository = createRepositoryMock();
    repository.delete.mockResolvedValue(true);
    const competitionService = createCompetitionService(repository);

    await expect(competitionService.delete("1")).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it("deve encerrar competição existente", async () => {
    const repository = createRepositoryMock();
    repository.close.mockResolvedValue({
      id: 1,
      nome: "Red Bull 24h São Paulo",
      data: "2026-06-15",
      endereco: "São Paulo - SP",
      status: "encerrada",
      criado_em: "2026-05-21T00:00:00.000Z",
    });
    const competitionService = createCompetitionService(repository);

    const competition = await competitionService.close("1");

    expect(competition.status).toBe("encerrada");
    expect(repository.close).toHaveBeenCalledWith(1);
  });
});
