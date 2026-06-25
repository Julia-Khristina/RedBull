import request from "supertest";
import app from "../src/app";
import { competitionRepository } from "../src/repositories/competitionRepository";

const RUN = Date.now().toString().slice(-7);

describe("TV Panel endpoints", () => {
  let competitionId: number;

  beforeAll(async () => {
    const competition = await competitionRepository.create({
      name: `Competicao E2E TV Panel ${RUN}`,
      date: "2026-06-15",
      address: "Sao Paulo - SP",
    });
    competitionId = competition.id;
  });

  describe("GET /public/competitions/:id/tv-panel/metrics", () => {
    it("deve retornar metricas agregadas da competicao -> 200", async () => {
      const res = await request(app).get(
        `/public/competitions/${competitionId}/tv-panel/metrics`
      );

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id_competition: competitionId,
        competition_name: expect.any(String),
        competition_status: expect.any(String),
        metrics: expect.objectContaining({
          total_distance_km: expect.any(Number),
          top_teams: expect.any(Array),
        }),
        generated_at: expect.any(String),
      });
    });

    it("deve funcionar sem cabecalho de autenticacao -> 200", async () => {
      const res = await request(app)
        .get(`/public/competitions/${competitionId}/tv-panel/metrics`)
        .unset("Authorization");

      expect(res.status).toBe(200);
    });

    it("deve retornar 400 para id nao numerico", async () => {
      const res = await request(app).get(
        "/public/competitions/abc/tv-panel/metrics"
      );

      expect(res.status).toBe(400);
    });

    it("deve retornar 404 para competicao inexistente", async () => {
      // Id dentro do limite aceito por validateCompetitionId (<= 32767)
      // e suficientemente alto pra nao existir em ambiente de teste.
      const res = await request(app).get(
        "/public/competitions/32000/tv-panel/metrics"
      );

      expect(res.status).toBe(404);
    });

    it("deve retornar 400 para topN fora do intervalo permitido", async () => {
      const res = await request(app).get(
        `/public/competitions/${competitionId}/tv-panel/metrics?topN=99`
      );

      expect(res.status).toBe(400);
    });

    it("deve aceitar topN dentro do intervalo permitido -> 200", async () => {
      const res = await request(app).get(
        `/public/competitions/${competitionId}/tv-panel/metrics?topN=5`
      );

      expect(res.status).toBe(200);
      expect(res.body.metrics.top_teams.length).toBeLessThanOrEqual(5);
    });
  });
});
