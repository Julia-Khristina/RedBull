import request from "supertest";
import app from "../src/app";
import { competitionRepository } from "../src/repositories/competitionRepository";
import { getAuthToken, bearer } from "./helpers/auth";

describe("Endpoints REST de equipes", () => {
  let competitionId: number;
  let token: string;

  beforeAll(async () => {
    token = await getAuthToken();

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
      .set(bearer(token))
      .send({ name: "Equipe Zumbi" });
    await request(app)
      .delete(`/competitions/${competitionId}/teams/${created.body.id}`)
      .set(bearer(token));
    return created.body.id;
  }

  describe("POST /competitions/:id/teams", () => {
    it("deve criar uma equipe com payload válido", async () => {
      const res = await request(app)
        .post(`/competitions/${competitionId}/teams`)
        .set(bearer(token))
        .send({ name: "Equipe Alpha E2E" });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        name: "Equipe Alpha E2E",
        id_competition: competitionId,
      });
      expect(res.body.id).toBeDefined();
      expect(res.body.uuid).toBeDefined();

      await request(app)
        .delete(`/competitions/${competitionId}/teams/${res.body.id}`)
        .set(bearer(token));
    });

    it.each([
      ["sem name", { name: "" }],
      ["name vazio", { name: "" }],
      ["name apenas espaços", { name: "   " }],
    ])("deve rejeitar payload inválido: %s", async (_caso, payload) => {
      const res = await request(app)
        .post(`/competitions/${competitionId}/teams`)
        .set(bearer(token))
        .send(payload);

      expect(res.status).toBe(400);
    });

    it("deve rejeitar competitionId não numérico", async () => {
      const res = await request(app)
        .post("/competitions/abc/teams")
        .set(bearer(token))
        .send({ name: "X" });
      expect(res.status).toBe(400);
    });

    it("deve rejeitar nome duplicado na mesma competição", async () => {
      const name = `Equipe Duplicada ${Date.now()}`;
      const created = await request(app)
        .post(`/competitions/${competitionId}/teams`)
        .set(bearer(token))
        .send({ name });

      const res = await request(app)
        .post(`/competitions/${competitionId}/teams`)
        .set(bearer(token))
        .send({ name });

      expect(res.status).toBe(409);

      await request(app)
        .delete(`/competitions/${competitionId}/teams/${created.body.id}`)
        .set(bearer(token));
    });

    it("deve retornar 404 quando a competição não existe", async () => {
      const missingCompetition = await competitionRepository.create({
        name: `Competição removida ${Date.now()}`,
        date: "2026-06-15",
        address: "São Paulo - SP",
      });
      await competitionRepository.delete(missingCompetition.id);

      const res = await request(app)
        .post(`/competitions/${missingCompetition.id}/teams`)
        .set(bearer(token))
        .send({ name: `Equipe sem competição ${Date.now()}` });

      expect(res.status).toBe(404);
    });
  });

  describe("GET /competitions/:id/teams", () => {
    it("deve retornar array com as equipes da competição", async () => {
      const created = await request(app)
        .post(`/competitions/${competitionId}/teams`)
        .set(bearer(token))
        .send({ name: "Equipe GET E2E" });

      const res = await request(app)
        .get(`/competitions/${competitionId}/teams`)
        .set(bearer(token));

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);

      await request(app)
        .delete(`/competitions/${competitionId}/teams/${created.body.id}`)
        .set(bearer(token));
    });
  });

  describe("GET /competitions/:id/teams/:teamId", () => {
    it("deve retornar a equipe quando existe", async () => {
      const created = await request(app)
        .post(`/competitions/${competitionId}/teams`)
        .set(bearer(token))
        .send({ name: "Equipe GET by ID E2E" });

      const res = await request(app)
        .get(`/competitions/${competitionId}/teams/${created.body.id}`)
        .set(bearer(token));

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(created.body.id);

      await request(app)
        .delete(`/competitions/${competitionId}/teams/${created.body.id}`)
        .set(bearer(token));
    });

    it("deve retornar 404 quando equipe não existe", async () => {
      const teamId = await getMissingTeamId();
      const res = await request(app)
        .get(`/competitions/${competitionId}/teams/${teamId}`)
        .set(bearer(token));

      expect(res.status).toBe(404);
    });
  });

  describe("PUT /competitions/:id/teams/:teamId", () => {
    it("deve atualizar o nome da equipe", async () => {
      const created = await request(app)
        .post(`/competitions/${competitionId}/teams`)
        .set(bearer(token))
        .send({ name: "Equipe Antes" });

      const res = await request(app)
        .put(`/competitions/${competitionId}/teams/${created.body.id}`)
        .set(bearer(token))
        .send({ name: "Equipe Depois" });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Equipe Depois");
      expect(res.body.uuid).toBe(created.body.uuid);

      await request(app)
        .delete(`/competitions/${competitionId}/teams/${created.body.id}`)
        .set(bearer(token));
    });

    it("deve retornar 404 ao tentar atualizar equipe inexistente", async () => {
      const teamId = await getMissingTeamId();
      const res = await request(app)
        .put(`/competitions/${competitionId}/teams/${teamId}`)
        .set(bearer(token))
        .send({ name: "Qualquer" });

      expect(res.status).toBe(404);
    });

    it("deve retornar 400 quando payload é inválido", async () => {
      const created = await request(app)
        .post(`/competitions/${competitionId}/teams`)
        .set(bearer(token))
        .send({ name: "Payload Inválido" });

      const res = await request(app)
        .put(`/competitions/${competitionId}/teams/${created.body.id}`)
        .set(bearer(token))
        .send({});

      expect(res.status).toBe(400);

      await request(app)
        .delete(`/competitions/${competitionId}/teams/${created.body.id}`)
        .set(bearer(token));
    });
  });

  describe("DELETE /competitions/:id/teams/:teamId", () => {
    it("deve deletar a equipe e retornar 204", async () => {
      const created = await request(app)
        .post(`/competitions/${competitionId}/teams`)
        .set(bearer(token))
        .send({ name: "Equipe Delete E2E" });

      const res = await request(app)
        .delete(`/competitions/${competitionId}/teams/${created.body.id}`)
        .set(bearer(token));

      expect(res.status).toBe(204);

      const check = await request(app)
        .get(`/competitions/${competitionId}/teams/${created.body.id}`)
        .set(bearer(token));
      expect(check.status).toBe(404);
    });

    it("deve deletar equipe com atletas cadastrados", async () => {
      const created = await request(app)
        .post(`/competitions/${competitionId}/teams`)
        .set(bearer(token))
        .send({ name: "Equipe com Runners" });

      await request(app)
        .post(`/competitions/${competitionId}/teams/${created.body.id}/runners`)
        .set(bearer(token))
        .send({
          name: "Runner para deletar",
          cpf: "111.222.333-44",
          email: `delete-team-${Date.now()}@test.com`,
        })
        .expect(201);

      const res = await request(app)
        .delete(`/competitions/${competitionId}/teams/${created.body.id}`)
        .set(bearer(token));

      expect(res.status).toBe(204);
    });

    it("deve retornar 404 ao tentar deletar equipe inexistente", async () => {
      const teamId = await getMissingTeamId();
      const res = await request(app)
        .delete(`/competitions/${competitionId}/teams/${teamId}`)
        .set(bearer(token));

      expect(res.status).toBe(404);
    });
  });
});
