import request from "supertest";
import app from "../src/app";
import { athleteRepository } from "../src/repositories/athleteRepository";
import { competitionRepository } from "../src/repositories/competitionRepository";
import { teamRepository } from "../src/repositories/teamRepository";

const RUN = Date.now().toString().slice(-7);

describe("GET /competitions/:competicaoId/export", () => {
  let competicaoId: number;
  let teamId: number;
  let athleteId: number;

  beforeAll(async () => {
    const competition = await competitionRepository.create({
      nome: `Competicao Export E2E ${RUN}`,
      data: "2026-06-15",
      endereco: "Sao Paulo - SP",
    });
    competicaoId = competition.id;

    const team = await teamRepository.create({
      nome: `Equipe Export E2E ${RUN}`,
      competicao_id: competicaoId,
    });
    teamId = team.id;

    const athlete = await athleteRepository.create({
      nome: "Atleta Export E2E",
      cpf: `${RUN.slice(0, 3)}.${RUN.slice(3, 6)}.200-01`,
      email: `export-e2e-${RUN}@test.com`,
      equipe_id: teamId,
    });
    athleteId = athlete.id;
  });

  it("deve retornar dados exportaveis da competicao", async () => {
    const res = await request(app).get(`/competitions/${competicaoId}/export`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      competition: {
        id: competicaoId,
        nome: `Competicao Export E2E ${RUN}`,
      },
      rankings: {
        teams: [],
        athletes: [],
      },
    });
    expect(res.body.exportedAt).toBeDefined();
    expect(res.body.teams).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: teamId,
          nome: `Equipe Export E2E ${RUN}`,
          competicao_id: competicaoId,
        }),
      ])
    );
    expect(res.body.athletes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: athleteId,
          nome: "Atleta Export E2E",
          equipe_id: teamId,
        }),
      ])
    );
    expect(Array.isArray(res.body.checkpoints)).toBe(true);
  });

  it("deve retornar 400 quando competicaoId nao e numerico", async () => {
    const res = await request(app).get("/competitions/abc/export");

    expect(res.status).toBe(400);
  });

  it("deve retornar 404 quando competicao nao existe", async () => {
    const res = await request(app).get("/competitions/32767/export");

    expect(res.status).toBe(404);
  });

  it("deve retornar 404 para rota de export invalida", async () => {
    const res = await request(app).get(`/exports/${competicaoId}`);

    expect(res.status).toBe(404);
  });
});
