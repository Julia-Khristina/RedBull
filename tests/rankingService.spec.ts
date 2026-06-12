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
  id_treadmill: 1,
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
        average_pace: "4:48",
      },
      {
        position: 2,
        id_runner: 1,
        runner_name: "Ana",
        total_distance_km: 5,
        average_pace: "5:00",
      },
      {
        position: 3,
        id_runner: 3,
        runner_name: "Caio",
        total_distance_km: 4,
        average_pace: "4:30",
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
