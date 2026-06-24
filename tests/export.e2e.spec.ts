import request from "supertest";
import app from "../src/app";
import { runnerRepository } from "../src/repositories/runnerRepository";
import { competitionRepository } from "../src/repositories/competitionRepository";
import { teamRepository } from "../src/repositories/teamRepository";
import { getAuthToken, bearer } from "./helpers/auth";

const RUN = Date.now().toString().slice(-7);

describe("GET /competitions/:id/export", () => {
  let competitionId: number;
  let teamId: number;
  let runnerId: number;
  let token: string;

  beforeAll(async () => {
    token = await getAuthToken();

    const competition = await competitionRepository.create({
      name: `Competicao Export E2E ${RUN}`,
      date: "2026-06-15",
      address: "Sao Paulo - SP",
    });
    competitionId = competition.id;

    const team = await teamRepository.create({
      name: `Equipe Export E2E ${RUN}`,
      id_competition: competitionId,
    });
    teamId = team.id;

    const runner = await runnerRepository.create({
      name: "Atleta Export E2E",
      cpf: `${RUN.slice(0, 3)}.${RUN.slice(3, 6)}.200-01`,
      email: `export-e2e-${RUN}@test.com`,
      id_team: teamId,
    });
    runnerId = runner.id;
  });

  it("deve retornar dados exportaveis da competicao", async () => {
    const res = await request(app)
      .get(`/competitions/${competitionId}/export`)
      .set(bearer(token));

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      competition: {
        id: competitionId,
        name: `Competicao Export E2E ${RUN}`,
      },
      rankings: {
        teams: [],
        runners: [],
      },
    });
    expect(res.body.exported_at).toBeDefined();
    expect(res.body.teams).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: teamId,
          name: `Equipe Export E2E ${RUN}`,
          id_competition: competitionId,
        }),
      ])
    );
    expect(res.body.runners).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: runnerId,
          name: "Atleta Export E2E",
          id_team: teamId,
        }),
      ])
    );
    expect(Array.isArray(res.body.checkpoints)).toBe(true);
  });

  it("deve retornar 400 quando competitionId nao e numerico", async () => {
    const res = await request(app)
      .get("/competitions/abc/export")
      .set(bearer(token));

    expect(res.status).toBe(400);
  });

  it("deve retornar 404 quando competicao nao existe", async () => {
    const res = await request(app)
      .get("/competitions/32767/export")
      .set(bearer(token));

    expect(res.status).toBe(404);
  });

  it("deve retornar 404 para rota de export invalida", async () => {
    const res = await request(app)
      .get(`/exports/${competitionId}`)
      .set(bearer(token));

    expect(res.status).toBe(404);
  });
});
