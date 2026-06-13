import request from "supertest";
import app from "../src/app";
import { competitionRepository } from "../src/repositories/competitionRepository";

const RUN = Date.now().toString().slice(-7);

describe("Ranking endpoints", () => {
  let competitionId: number;

  beforeAll(async () => {
    const competition = await competitionRepository.create({
      name: `Competicao E2E Ranking ${RUN}`,
      date: "2026-06-15",
      address: "Sao Paulo - SP",
    });
    competitionId = competition.id;
  });

  describe("GET /competitions/:id/ranking/teams", () => {
    it("deve retornar ranking de equipes → 200", async () => {
      const res = await request(app).get(
        `/competitions/${competitionId}/ranking/teams`
      );

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("deve retornar 400 para id nao numerico", async () => {
      const res = await request(app).get(
        "/competitions/abc/ranking/teams"
      );

      expect(res.status).toBe(400);
    });
  });

  describe("GET /competitions/:id/ranking/runners", () => {
    it("deve retornar ranking de atletas → 200", async () => {
      const res = await request(app).get(
        `/competitions/${competitionId}/ranking/runners`
      );

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("deve retornar 400 para id nao numerico", async () => {
      const res = await request(app).get(
        "/competitions/abc/ranking/runners"
      );

      expect(res.status).toBe(400);
    });
  });
});
