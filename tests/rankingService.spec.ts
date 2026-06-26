import { createRankingService } from "../src/services/rankingService";
import { Checkpoint } from "../src/models/checkpoint";
import { Team } from "../src/models/team";

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
  created_at: "2026-05-01T10:00:00.000Z",
};

const teams: Team[] = [
  {
    id: 10,
    name: "Equipe Alpha",
    uuid: "11111111-1111-1111-1111-111111111111",
    qr_code: null,
    id_competition: 1,
    created_at: "2026-05-01T10:00:00.000Z",
  },
  {
    id: 20,
    name: "Equipe Beta",
    uuid: "22222222-2222-2222-2222-222222222222",
    qr_code: null,
    id_competition: 1,
    created_at: "2026-05-01T10:00:00.000Z",
  },
];

function makeCheckpoint(
  overrides: Partial<Checkpoint>
): Checkpoint {
  return { ...baseCheckpoint, ...overrides };
}

describe("rankingService.generateRunnerRanking", () => {
  it("deve ordenar corredores por maior km e menor pace medio", async () => {
    const service = createRankingService(
      {
        findByCompetition: jest.fn().mockResolvedValue([
          makeCheckpoint({
            id: 1,
            id_runner: 1,
            distance_km: 5,
            time: "25:00",
            runner: { id: 1, name: "Ana", id_team: 10 },
          }),
          makeCheckpoint({
            id: 2,
            id_runner: 2,
            distance_km: 5,
            time: "24:00",
            runner: { id: 2, name: "Bia", id_team: 20 },
          }),
          makeCheckpoint({
            id: 3,
            id_runner: 3,
            distance_km: 4,
            time: "18:00",
            runner: { id: 3, name: "Caio", id_team: 10 },
          }),
        ]),
      },
      { findByCompetition: jest.fn().mockResolvedValue(teams) }
    );

    const ranking = await service.generateRunnerRanking(1);

    expect(ranking).toMatchObject([
      {
        position: 1,
        id_runner: 2,
        runner_name: "Bia",
        total_distance_km: 5,
        average_pace: "04:48",
      },
      {
        position: 2,
        id_runner: 1,
        runner_name: "Ana",
        total_distance_km: 5,
        average_pace: "05:00",
      },
      {
        position: 3,
        id_runner: 3,
        runner_name: "Caio",
        total_distance_km: 4,
        average_pace: "04:30",
      },
    ]);
  });

  it("deve preencher o nome da equipe do corredor no ranking", async () => {
    const service = createRankingService(
      {
        findByCompetition: jest.fn().mockResolvedValue([
          makeCheckpoint({
            id: 1,
            id_runner: 1,
            distance_km: 5,
            time: "25:00",
            runner: { id: 1, name: "Ana", id_team: 10 },
          }),
        ]),
      },
      { findByCompetition: jest.fn().mockResolvedValue(teams) }
    );

    const ranking = await service.generateRunnerRanking(1);

    expect(ranking[0]).toMatchObject({
      id_runner: 1,
      runner_name: "Ana",
      team_name: "Equipe Alpha",
    });
  });
});

describe("rankingService.generateRunnerRanking edge cases", () => {
  it("deve usar pace quando tempo total nao foi informado", async () => {
    const service = createRankingService(
      {
        findByCompetition: jest.fn().mockResolvedValue([
          makeCheckpoint({
            id: 1,
            id_runner: 1,
            distance_km: 5,
            time: null,
            pace: "04:30",
            runner: { id: 1, name: "Ana", id_team: 10 },
          }),
        ]),
      },
      { findByCompetition: jest.fn().mockResolvedValue(teams) }
    );

    const ranking = await service.generateRunnerRanking(1);

    expect(ranking[0]).toMatchObject({
      id_runner: 1,
      average_pace: "04:30",
      average_pace_seconds: 270,
    });
  });

  it("deve retornar pace nulo quando tempo e pace sao invalidos", async () => {
    const service = createRankingService(
      {
        findByCompetition: jest.fn().mockResolvedValue([
          makeCheckpoint({
            id: 1,
            id_runner: 1,
            distance_km: 5,
            time: "tempo-invalido",
            pace: "pace-invalido",
            runner: { id: 1, name: "Ana", id_team: 10 },
          }),
        ]),
      },
      { findByCompetition: jest.fn().mockResolvedValue(teams) }
    );

    const ranking = await service.generateRunnerRanking(1);

    expect(ranking[0]).toMatchObject({
      average_pace: null,
      average_pace_seconds: null,
    });
  });

  it("deve manter o ultimo checkpoint pelo created_at mais recente", async () => {
    const service = createRankingService(
      {
        findByCompetition: jest.fn().mockResolvedValue([
          makeCheckpoint({
            id: 1,
            identifier: "CP-ANTIGO",
            id_runner: 1,
            distance_km: 4,
            time: "20:00",
            created_at: "2026-05-01T10:00:00.000Z",
            runner: { id: 1, name: "Ana", id_team: 10 },
          }),
          makeCheckpoint({
            id: 2,
            identifier: "CP-NOVO",
            id_runner: 1,
            distance_km: 5,
            pace: "04:45",
            time: null,
            created_at: "2026-05-01T11:00:00.000Z",
            runner: { id: 1, name: "Ana", id_team: 10 },
          }),
        ]),
      },
      { findByCompetition: jest.fn().mockResolvedValue(teams) }
    );

    const ranking = await service.generateRunnerRanking(1);

    expect(ranking[0]).toMatchObject({
      last_checkpoint: "CP-NOVO",
      treadmill_time: "04:45",
      total_distance_km: 5,
    });
  });
});

describe("rankingService.generateTeamRanking edge cases", () => {
  it("deve ignorar corredores sem equipe ou com equipe inexistente no ranking de equipes", async () => {
    const service = createRankingService(
      {
        findByCompetition: jest.fn().mockResolvedValue([
          makeCheckpoint({
            id: 1,
            id_runner: 1,
            distance_km: 5,
            time: "25:00",
            runner: { id: 1, name: "Ana", id_team: null as never },
          }),
          makeCheckpoint({
            id: 2,
            id_runner: 2,
            distance_km: 7,
            time: "35:00",
            runner: { id: 2, name: "Bia", id_team: 999 },
          }),
          makeCheckpoint({
            id: 3,
            id_runner: 3,
            distance_km: 3,
            time: "15:00",
            runner: { id: 3, name: "Caio", id_team: 10 },
          }),
        ]),
      },
      { findByCompetition: jest.fn().mockResolvedValue(teams) }
    );

    const ranking = await service.generateTeamRanking(1);

    expect(ranking).toMatchObject([
      {
        id_team: 10,
        total_distance_km: 3,
        runner_count: 1,
      },
      {
        id_team: 20,
        total_distance_km: 0,
        runner_count: 0,
      },
    ]);
  });
});

describe("rankingService helpers", () => {
  it("deve calcular posicoes usando maior distancia e menor pace", () => {
    const service = createRankingService();

    const ranking = service.calculatePositions<{
      position: number;
      id_runner: number;
      total_distance_km: number;
      average_pace_seconds: number | null;
    }>([
      {
        id_runner: 1,
        total_distance_km: 10,
        average_pace_seconds: null,
      },
      {
        id_runner: 2,
        total_distance_km: 10,
        average_pace_seconds: 280,
      },
      {
        id_runner: 3,
        total_distance_km: 8,
        average_pace_seconds: 240,
      },
    ]);

    expect(ranking.map((item) => item.id_runner)).toEqual([2, 1, 3]);
    expect(ranking.map((item) => item.position)).toEqual([1, 2, 3]);
  });

  it("deve calcular pace medio para tempos validos", () => {
    const service = createRankingService();

    expect(service.calculateAveragePace("25:00", 5)).toBe(300);
    expect(service.calculateAveragePace("01:00:00", 12)).toBe(300);
  });

  it("deve retornar null para tempo invalido ou distancia zerada", () => {
    const service = createRankingService();

    expect(service.calculateAveragePace("tempo-invalido", 5)).toBeNull();
    expect(service.calculateAveragePace("25:00", 0)).toBeNull();
    expect(service.calculateAveragePace(null, 5)).toBeNull();
  });
});

describe("rankingService.generateTeamRanking", () => {
  it("deve somar a distancia dos corredores da equipe", async () => {
    const service = createRankingService(
      {
        findByCompetition: jest.fn().mockResolvedValue([
          makeCheckpoint({
            id: 1,
            id_runner: 1,
            distance_km: 5,
            time: "25:00",
            runner: { id: 1, name: "Ana", id_team: 10 },
          }),
          makeCheckpoint({
            id: 2,
            id_runner: 2,
            distance_km: 5,
            time: "24:00",
            runner: { id: 2, name: "Bia", id_team: 20 },
          }),
          makeCheckpoint({
            id: 3,
            id_runner: 3,
            distance_km: 4,
            time: "18:00",
            runner: { id: 3, name: "Caio", id_team: 10 },
          }),
        ]),
      },
      { findByCompetition: jest.fn().mockResolvedValue(teams) }
    );

    const ranking = await service.generateTeamRanking(1);

    expect(ranking).toMatchObject([
      {
        position: 1,
        id_team: 10,
        team_name: "Equipe Alpha",
        total_distance_km: 9,
        runner_count: 2,
      },
      {
        position: 2,
        id_team: 20,
        team_name: "Equipe Beta",
        total_distance_km: 5,
        runner_count: 1,
      },
    ]);
  });

  it("deve incluir as duas equipes mesmo quando apenas uma tiver checkpoints", async () => {
    const service = createRankingService(
      {
        findByCompetition: jest.fn().mockResolvedValue([
          makeCheckpoint({
            id: 1,
            id_runner: 1,
            distance_km: 5,
            time: "25:00",
            runner: { id: 1, name: "Ana", id_team: 10 },
          }),
        ]),
      },
      { findByCompetition: jest.fn().mockResolvedValue(teams) }
    );

    const ranking = await service.generateTeamRanking(1);

    expect(ranking).toMatchObject([
      {
        position: 1,
        id_team: 10,
        team_name: "Equipe Alpha",
        total_distance_km: 5,
        runner_count: 1,
      },
      {
        position: 2,
        id_team: 20,
        team_name: "Equipe Beta",
        total_distance_km: 0,
        runner_count: 0,
      },
    ]);
  });
});
