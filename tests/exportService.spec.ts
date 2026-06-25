import { createExportService } from "../src/services/exportService";
import { NotFoundError, ValidationError } from "../src/errors/AppError";
import { CompetitionExportData, ExportRepository } from "../src/models/export";

const exportData: CompetitionExportData = {
  competition: {
    id: 1,
    name: "Red Bull 24h Sao Paulo",
    date: "2026-06-15",
    address: "Sao Paulo - SP",
    status: "not_started",
    created_at: "2026-05-21T00:00:00.000Z",
    started_at: null,
  },
  teams: [
    {
      id: 10,
      name: "Equipe Alpha",
      uuid: "11111111-1111-1111-1111-111111111111",
      qr_code: null,
      id_competition: 1,
      created_at: "2026-05-21T00:00:00.000Z",
    },
  ],
  runners: [
    {
      id: 100,
      name: "Ana Silva",
      status: "runner",
      email: "ana@example.com",
      phone: null,
      cpf: "123.456.789-00",
      id_team: 10,
      created_at: "2026-05-21T00:00:00.000Z",
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
    generateTeamRanking: jest.fn().mockResolvedValue([
      {
        position: 1,
        id_team: 10,
        team_name: "Equipe Alpha",
        id_competition: 1,
        total_distance_km: 5,
        average_pace: "05:00",
        average_pace_seconds: 300,
        runner_count: 1,
      },
    ]),
    generateRunnerRanking: jest.fn().mockResolvedValue([
      {
        position: 1,
        id_runner: 100,
        runner_name: "Ana Silva",
        id_team: 10,
        total_distance_km: 5,
        average_pace: "05:00",
        average_pace_seconds: 300,
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
      runners: exportData.runners,
      checkpoints: [],
      rankings: {
        teams: [
          {
            position: 1,
            id_team: 10,
            team_name: "Equipe Alpha",
          },
        ],
        runners: [
          {
            position: 1,
            id_runner: 100,
            runner_name: "Ana Silva",
          },
        ],
      },
    });
    expect(result.exported_at).toBeDefined();
    expect(repository.findCompetitionExportData).toHaveBeenCalledWith(1);
    expect(rankings.generateTeamRanking).toHaveBeenCalledWith(1);
    expect(rankings.generateRunnerRanking).toHaveBeenCalledWith(1);
  });

  it("deve lancar ValidationError quando competitionId e invalido", async () => {
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
    expect(rankings.generateTeamRanking).not.toHaveBeenCalled();
    expect(rankings.generateRunnerRanking).not.toHaveBeenCalled();
  });
});
