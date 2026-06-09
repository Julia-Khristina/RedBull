import request from "supertest";
import app from "../src/app";
import { competitionRepository } from "../src/repositories/competitionRepository";

describe("Endpoints REST de equipes", () => {
  let competitionId: number;

  beforeAll(async () => {
    const competition = await competitionRepository.create({
      name: "Competição Teste E2E Equipes",
      date: "2026-06-15",
      address: "São Paulo - SP",
    });
    competitionId = competition.id;
  });

  async function getMissingTeamId(): Promise<number> {
    const created = await request(app)
      .post(`/competitions/${competitionId}/teams`)
      .send({ name: "Equipe Zumbi" });
    await request(app).delete(
      `/competitions/${competitionId}/teams/${created.body.id}`
    );
    return created.body.id;
  }

  describe("POST /competitions/:id/teams", () => {
    it("deve criar uma equipe com payload válido", async () => {
      const res = await request(app)
        .post(`/competitions/${competitionId}/teams`)
        .send({ name: "Equipe Alpha E2E" });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        name: "Equipe Alpha E2E",
        id_competition: competitionId,
      });
      expect(res.body.id).toBeDefined();
      expect(res.body.uuid).toBeDefined();
      expect(res.body.created_at).toBeDefined();
    });

    it.each([
      ["sem name", {}],
      ["name vazio", { name: "" }],
      ["name apenas espaços", { name: "   " }],
    ])("deve rejeitar payload inválido: %s", async (_caso, payload) => {
      const res = await request(app)
        .post(`/competitions/${competitionId}/teams`)
        .send(payload);

      expect(res.status).toBe(400);
    });

    it("deve rejeitar competitionId não numérico", async () => {
      const res = await request(app)
        .post(`/competitions/abc/teams`)
        .send({ name: "X" });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /competitions/:id/teams", () => {
    it("deve retornar array com as equipes da competição", async () => {
      await request(app)
        .post(`/competitions/${competitionId}/teams`)
        .send({ name: "Equipe Listagem" });

      const res = await request(app).get(
        `/competitions/${competitionId}/teams`
      );

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /competitions/:id/teams/:teamId", () => {
    it("deve retornar a equipe quando existe", async () => {
      const created = await request(app)
        .post(`/competitions/${competitionId}/teams`)
        .send({ name: "Equipe FindById" });

      const res = await request(app).get(
        `/competitions/${competitionId}/teams/${created.body.id}`
      );

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(created.body.id);
    });

    it("deve retornar 404 quando equipe não existe", async () => {
      const missingId = await getMissingTeamId();
      const res = await request(app).get(
        `/competitions/${competitionId}/teams/${missingId}`
      );

      expect(res.status).toBe(404);
    });
  });

  describe("PUT /competitions/:id/teams/:teamId", () => {
    it("deve atualizar o nome da equipe", async () => {
      const created = await request(app)
        .post(`/competitions/${competitionId}/teams`)
        .send({ name: "Equipe Antes" });

      const res = await request(app)
        .put(`/competitions/${competitionId}/teams/${created.body.id}`)
        .send({ name: "Equipe Depois" });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Equipe Depois");
      expect(res.body.uuid).toBe(created.body.uuid);
    });

    it("deve retornar 404 ao tentar atualizar equipe inexistente", async () => {
      const missingId = await getMissingTeamId();
      const res = await request(app)
        .put(`/competitions/${competitionId}/teams/${missingId}`)
        .send({ name: "Qualquer" });

      expect(res.status).toBe(404);
    });

    it("deve retornar 400 quando payload é inválido", async () => {
      const created = await request(app)
        .post(`/competitions/${competitionId}/teams`)
        .send({ name: "Equipe PutInvalido" });

      const res = await request(app)
        .put(`/competitions/${competitionId}/teams/${created.body.id}`)
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /competitions/:id/teams/:teamId", () => {
    it("deve deletar a equipe e retornar 204", async () => {
      const created = await request(app)
        .post(`/competitions/${competitionId}/teams`)
        .send({ name: "Equipe Deletar" });

      const res = await request(app).delete(
        `/competitions/${competitionId}/teams/${created.body.id}`
      );

      expect(res.status).toBe(204);

      const check = await request(app).get(
        `/competitions/${competitionId}/teams/${created.body.id}`
      );
      expect(check.status).toBe(404);
    });

    it("deve retornar 404 ao tentar deletar equipe inexistente", async () => {
      const missingId = await getMissingTeamId();
      const res = await request(app).delete(
        `/competitions/${competitionId}/teams/${missingId}`
      );

      expect(res.status).toBe(404);
    });
  });
});
