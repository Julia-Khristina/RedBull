import request from "supertest";
import app from "../src/app";
import { competitionRepository } from "../src/repositories/competitionRepository";

const RUN = Date.now().toString().slice(-7);

describe("GET /competitions/:id/reports", () => {
  let competitionId: number;

  beforeAll(async () => {
    const competition = await competitionRepository.create({
      name: `Competicao E2E Report ${RUN}`,
      date: "2026-06-15",
      address: "Sao Paulo - SP",
    });
    competitionId = competition.id;
  });

  it("deve retornar dados do relatorio → 200", async () => {
    const res = await request(app).get(
      `/competitions/${competitionId}/reports`
    );

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id_competition: competitionId,
      summary: expect.any(Object),
      highlights: expect.any(Object),
      generated_at: expect.any(String),
      checkpoints: expect.any(Array),
      teamRanking: expect.any(Array),
      runnerRanking: expect.any(Array),
    });
  });

  it("deve retornar 400 para id nao numerico", async () => {
    const res = await request(app).get("/competitions/abc/reports");
    expect(res.status).toBe(400);
  });
});
