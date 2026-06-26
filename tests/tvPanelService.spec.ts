import { createTvPanelService } from "../src/services/tvPanelService";
import { Checkpoint } from "../src/models/checkpoint";
import { Competition } from "../src/models/competition";

const NOW = new Date("2026-06-15T12:00:00.000Z");

const competitionInProgress: Competition = {
  id: 1,
  name: "Red Bull 24h SP",
  address: "São Paulo - SP",
  date: "2026-06-15",
  status: "in_progress",
  created_at: "2026-06-15T08:00:00.000Z",
  /* Marco zero do countdown — gravado por activate() (feature #557).
     2h antes de NOW pra que elapsed_time = 02:00:00 nas asserções. */
  started_at: "2026-06-15T10:00:00.000Z",
};

const competitionClosed: Competition = {
  ...competitionInProgress,
  status: "closed",
};

const competitionNotStarted: Competition = {
  ...competitionInProgress,
  status: "not_started",
  started_at: null,
};

const baseCheckpoint: Checkpoint = {
  id: 1,
  identifier: "CP-001",
  distance_km: 0,
  pace: null,
  time: null,
  image: null,
  id_runner: 1,
  id_competition: 1,
  id_admin: 1,
  created_at: "2026-06-15T10:00:00.000Z",
};

function makeCheckpoint(overrides: Partial<Checkpoint>): Checkpoint {
  return { ...baseCheckpoint, ...overrides };
}

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(NOW);
});

afterAll(() => {
  jest.useRealTimers();
});

describe("tvPanelService.generateMetrics", () => {
  it("retorna metricas agregadas para competicao em andamento", async () => {
    const service = createTvPanelService(
      { findById: jest.fn().mockResolvedValue(competitionInProgress) },
      {
        findByCompetition: jest.fn().mockResolvedValue([
          makeCheckpoint({ id: 1, created_at: "2026-06-15T10:00:00.000Z" }),
          makeCheckpoint({ id: 2, created_at: "2026-06-15T11:30:00.000Z" }),
        ]),
      },
      {
        generateRunnerRanking: jest.fn().mockResolvedValue([
          {
            position: 1,
            id_runner: 1,
            runner_name: "Ana",
            id_team: 10,
            team_name: "Equipe Alpha",
            total_distance_km: 10,
            average_pace: "5:00",
            average_pace_seconds: 300,
          },
          {
            position: 2,
            id_runner: 2,
            runner_name: "Bia",
            id_team: 20,
            team_name: "Equipe Beta",
            total_distance_km: 5,
            average_pace: "6:00",
            average_pace_seconds: 360,
          },
        ]),
        generateTeamRanking: jest.fn().mockResolvedValue([
          {
            position: 1,
            id_team: 10,
            team_name: "Equipe Alpha",
            id_competition: 1,
            total_distance_km: 10,
            average_pace: "5:00",
            average_pace_seconds: 300,
            runner_count: 1,
          },
          {
            position: 2,
            id_team: 20,
            team_name: "Equipe Beta",
            id_competition: 1,
            total_distance_km: 5,
            average_pace: "6:00",
            average_pace_seconds: 360,
            runner_count: 1,
          },
        ]),
      }
    );

    const payload = await service.generateMetrics(1);

    // Pace ponderado por km: (300*10 + 360*5) / 15 = 4800/15 = 320s = 5:20
    expect(payload).toMatchObject({
      id_competition: 1,
      competition_name: "Red Bull 24h SP",
      competition_status: "in_progress",
      metrics: {
        average_pace_overall: "5:20",
        average_pace_overall_seconds: 320,
        elapsed_time: "02:00:00",
        elapsed_time_seconds: 7200,
        total_distance_km: 15,
        top_teams: [
          {
            position: 1,
            id_team: 10,
            team_name: "Equipe Alpha",
            total_distance_km: 10,
          },
          {
            position: 2,
            id_team: 20,
            team_name: "Equipe Beta",
            total_distance_km: 5,
          },
        ],
      },
    });
    expect(payload.generated_at).toBe(NOW.toISOString());
  });

  it("retorna metricas zeradas e elapsed null quando competicao nao iniciou", async () => {
    const service = createTvPanelService(
      { findById: jest.fn().mockResolvedValue(competitionNotStarted) },
      { findByCompetition: jest.fn().mockResolvedValue([]) },
      {
        generateRunnerRanking: jest.fn().mockResolvedValue([]),
        generateTeamRanking: jest.fn().mockResolvedValue([]),
      }
    );

    const payload = await service.generateMetrics(1);

    expect(payload.metrics).toMatchObject({
      average_pace_overall: null,
      average_pace_overall_seconds: null,
      elapsed_time: null,
      elapsed_time_seconds: null,
      total_distance_km: 0,
      top_teams: [],
    });
  });

  it("retorna elapsed mesmo sem checkpoints quando started_at esta gravado", async () => {
    const service = createTvPanelService(
      { findById: jest.fn().mockResolvedValue(competitionInProgress) },
      { findByCompetition: jest.fn().mockResolvedValue([]) },
      {
        generateRunnerRanking: jest.fn().mockResolvedValue([]),
        generateTeamRanking: jest.fn().mockResolvedValue([]),
      }
    );

    const payload = await service.generateMetrics(1);

    // started_at = 10:00, NOW = 12:00 → elapsed = 02:00:00 mesmo sem checkpoint.
    expect(payload.metrics.elapsed_time_seconds).toBe(7200);
    expect(payload.metrics.elapsed_time).toBe("02:00:00");
  });

  it("limita elapsed pelo ultimo checkpoint quando competicao esta closed", async () => {
    const service = createTvPanelService(
      { findById: jest.fn().mockResolvedValue(competitionClosed) },
      {
        findByCompetition: jest.fn().mockResolvedValue([
          makeCheckpoint({ id: 1, created_at: "2026-06-15T10:00:00.000Z" }),
          makeCheckpoint({ id: 2, created_at: "2026-06-15T11:00:00.000Z" }),
        ]),
      },
      {
        generateRunnerRanking: jest.fn().mockResolvedValue([]),
        generateTeamRanking: jest.fn().mockResolvedValue([]),
      }
    );

    const payload = await service.generateMetrics(1);

    expect(payload.metrics).toMatchObject({
      elapsed_time: "01:00:00",
      elapsed_time_seconds: 3600,
    });
  });

  it("aplica topN limitando a quantidade de equipes retornadas", async () => {
    const service = createTvPanelService(
      { findById: jest.fn().mockResolvedValue(competitionInProgress) },
      { findByCompetition: jest.fn().mockResolvedValue([]) },
      {
        generateRunnerRanking: jest.fn().mockResolvedValue([]),
        generateTeamRanking: jest.fn().mockResolvedValue([
          {
            position: 1,
            id_team: 10,
            team_name: "A",
            id_competition: 1,
            total_distance_km: 10,
            average_pace: null,
            average_pace_seconds: null,
            runner_count: 1,
          },
          {
            position: 2,
            id_team: 20,
            team_name: "B",
            id_competition: 1,
            total_distance_km: 8,
            average_pace: null,
            average_pace_seconds: null,
            runner_count: 1,
          },
          {
            position: 3,
            id_team: 30,
            team_name: "C",
            id_competition: 1,
            total_distance_km: 6,
            average_pace: null,
            average_pace_seconds: null,
            runner_count: 1,
          },
          {
            position: 4,
            id_team: 40,
            team_name: "D",
            id_competition: 1,
            total_distance_km: 4,
            average_pace: null,
            average_pace_seconds: null,
            runner_count: 1,
          },
        ]),
      }
    );

    const payload = await service.generateMetrics(1, 2);

    expect(payload.metrics.top_teams).toHaveLength(2);
    expect(payload.metrics.top_teams.map((team) => team.id_team)).toEqual([10, 20]);
  });

  it("retorna pace overall null quando nenhum corredor tem pace valido", async () => {
    const service = createTvPanelService(
      { findById: jest.fn().mockResolvedValue(competitionInProgress) },
      { findByCompetition: jest.fn().mockResolvedValue([]) },
      {
        generateRunnerRanking: jest.fn().mockResolvedValue([
          {
            position: 1,
            id_runner: 1,
            runner_name: "Ana",
            id_team: 10,
            team_name: "Equipe Alpha",
            total_distance_km: 10,
            average_pace: null,
            average_pace_seconds: null,
          },
        ]),
        generateTeamRanking: jest.fn().mockResolvedValue([]),
      }
    );

    const payload = await service.generateMetrics(1);

    expect(payload.metrics.average_pace_overall).toBeNull();
    expect(payload.metrics.average_pace_overall_seconds).toBeNull();
    expect(payload.metrics.total_distance_km).toBe(10);
  });

  it("pondera pace pela quilometragem de cada corredor", async () => {
    const service = createTvPanelService(
      { findById: jest.fn().mockResolvedValue(competitionInProgress) },
      { findByCompetition: jest.fn().mockResolvedValue([]) },
      {
        generateRunnerRanking: jest.fn().mockResolvedValue([
          {
            position: 1,
            id_runner: 1,
            runner_name: "Ana",
            id_team: 10,
            team_name: "A",
            total_distance_km: 20,
            average_pace: "4:00",
            average_pace_seconds: 240,
          },
          {
            position: 2,
            id_runner: 2,
            runner_name: "Bia",
            id_team: 20,
            team_name: "B",
            total_distance_km: 5,
            average_pace: "8:00",
            average_pace_seconds: 480,
          },
        ]),
        generateTeamRanking: jest.fn().mockResolvedValue([]),
      }
    );

    const payload = await service.generateMetrics(1);

    // (240*20 + 480*5) / 25 = (4800 + 2400) / 25 = 7200 / 25 = 288s = 4:48
    expect(payload.metrics.average_pace_overall_seconds).toBe(288);
    expect(payload.metrics.average_pace_overall).toBe("4:48");
  });
});
