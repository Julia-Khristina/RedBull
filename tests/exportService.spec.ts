import { createExportService } from "../src/services/exportService";
import { NotFoundError, ValidationError } from "../src/errors/AppError";
import { CompetitionExportData, ExportRepository } from "../src/models/export";

const exportData: CompetitionExportData = {
  competition: {
    id: 1,
    nome: "Red Bull 24h Sao Paulo",
    data: "2026-06-15",
    endereco: "Sao Paulo - SP",
    status: "nao iniciado" as never,
    criado_em: "2026-05-21T00:00:00.000Z",
  },
  teams: [
    {
      id: 10,
      nome: "Equipe Alpha",
      uuid: "11111111-1111-1111-1111-111111111111",
      qr_code: null,
      competicao_id: 1,
      criado_em: "2026-05-21T00:00:00.000Z",
    },
  ],
  athletes: [
    {
      id: 100,
      nome: "Ana Silva",
      status: "corredor",
      email: "ana@example.com",
      telefone: null,
      cpf: "123.456.789-00",
      equipe_id: 10,
      criado_em: "2026-05-21T00:00:00.000Z",
    },
  ],
  checkpoints: [],
};

function createRepositoryMock(
  data: CompetitionExportData | null = exportData
): ExportRepository {
  return {
    findCompetitionExportData: jest.fn().mockResolvedValue(data),
  };
}

function createRankingMock() {
  return {
    gerarRankingEquipes: jest.fn().mockResolvedValue([
      {
        posicao: 1,
        equipe_id: 10,
        equipe_nome: "Equipe Alpha",
        competicao_id: 1,
        km_total: 5,
        pace_medio: "5:00",
        pace_medio_segundos: 300,
        corredores: 1,
      },
    ]),
    gerarRankingCorredores: jest.fn().mockResolvedValue([
      {
        posicao: 1,
        corredor_id: 100,
        corredor_nome: "Ana Silva",
        equipe_id: 10,
        km_total: 5,
        pace_medio: "5:00",
        pace_medio_segundos: 300,
      },
    ]),
  };
}

describe("exportService", () => {
  it("deve exportar dados da competicao com rankings", async () => {
    const repository = createRepositoryMock();
    const rankings = createRankingMock();
    const service = createExportService(repository, rankings);

    const result = await service.exportCompetition("1");

    expect(result).toMatchObject({
      competition: exportData.competition,
      teams: exportData.teams,
      athletes: exportData.athletes,
      checkpoints: [],
      rankings: {
        teams: [
          {
            posicao: 1,
            equipe_id: 10,
            equipe_nome: "Equipe Alpha",
          },
        ],
        athletes: [
          {
            posicao: 1,
            corredor_id: 100,
            corredor_nome: "Ana Silva",
          },
        ],
      },
    });
    expect(result.exportedAt).toBeDefined();
    expect(repository.findCompetitionExportData).toHaveBeenCalledWith(1);
    expect(rankings.gerarRankingEquipes).toHaveBeenCalledWith(1);
    expect(rankings.gerarRankingCorredores).toHaveBeenCalledWith(1);
  });

  it("deve lancar ValidationError quando competicaoId e invalido", async () => {
    const repository = createRepositoryMock();
    const rankings = createRankingMock();
    const service = createExportService(repository, rankings);

    await expect(service.exportCompetition("abc")).rejects.toBeInstanceOf(
      ValidationError
    );
    expect(repository.findCompetitionExportData).not.toHaveBeenCalled();
  });

  it("deve lancar NotFoundError quando competicao nao existe", async () => {
    const repository = createRepositoryMock(null);
    const rankings = createRankingMock();
    const service = createExportService(repository, rankings);

    await expect(service.exportCompetition("999")).rejects.toBeInstanceOf(
      NotFoundError
    );
    expect(rankings.gerarRankingEquipes).not.toHaveBeenCalled();
    expect(rankings.gerarRankingCorredores).not.toHaveBeenCalled();
  });
});
