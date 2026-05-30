import request from "supertest";
import app from "../src/app";
import { competitionRepository } from "../src/repositories/competitionRepository";

describe("Endpoints REST de equipes", () => {
  let competicaoId: number;

  beforeAll(async () => {
    const competition = await competitionRepository.create({
      nome: "Competição Teste E2E Equipes",
      data: "2026-06-15",
      endereco: "São Paulo - SP",
    });
    competicaoId = competition.id;
  });

  async function getMissingTeamId(): Promise<number> {
    const created = await request(app)
      .post(`/competitions/${competicaoId}/teams`)
      .send({ nome: "Equipe Zumbi" });
    await request(app).delete(
      `/competitions/${competicaoId}/teams/${created.body.id}`
    );
    return created.body.id;
  }

  describe("POST /competitions/:competicaoId/teams", () => {
    it("deve criar uma equipe com payload válido", async () => {
      const res = await request(app)
        .post(`/competitions/${competicaoId}/teams`)
        .send({ nome: "Equipe Alpha E2E" });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        nome: "Equipe Alpha E2E",
        competicao_id: competicaoId,
      });
      expect(res.body.id).toBeDefined();
      expect(res.body.uuid).toBeDefined();
      expect(res.body.criado_em).toBeDefined();
    });

    it.each([
      ["sem nome", {}],
      ["nome vazio", { nome: "" }],
      ["nome apenas espaços", { nome: "   " }],
    ])("deve rejeitar payload inválido: %s", async (_caso, payload) => {
      const res = await request(app)
        .post(`/competitions/${competicaoId}/teams`)
        .send(payload);

      expect(res.status).toBe(400);
    });

    it("deve rejeitar competicaoId não numérico", async () => {
      const res = await request(app)
        .post(`/competitions/abc/teams`)
        .send({ nome: "X" });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /competitions/:competicaoId/teams", () => {
    it("deve retornar array com as equipes da competição", async () => {
      await request(app)
        .post(`/competitions/${competicaoId}/teams`)
        .send({ nome: "Equipe Listagem" });

      const res = await request(app).get(
        `/competitions/${competicaoId}/teams`
      );

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /competitions/:competicaoId/teams/:teamId", () => {
    it("deve retornar a equipe quando existe", async () => {
      const created = await request(app)
        .post(`/competitions/${competicaoId}/teams`)
        .send({ nome: "Equipe FindById" });

      const res = await request(app).get(
        `/competitions/${competicaoId}/teams/${created.body.id}`
      );

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(created.body.id);
    });

    it("deve retornar 404 quando equipe não existe", async () => {
      const missingId = await getMissingTeamId();
      const res = await request(app).get(
        `/competitions/${competicaoId}/teams/${missingId}`
      );

      expect(res.status).toBe(404);
    });
  });

  describe("PUT /competitions/:competicaoId/teams/:teamId", () => {
    it("deve atualizar o nome da equipe", async () => {
      const created = await request(app)
        .post(`/competitions/${competicaoId}/teams`)
        .send({ nome: "Equipe Antes" });

      const res = await request(app)
        .put(`/competitions/${competicaoId}/teams/${created.body.id}`)
        .send({ nome: "Equipe Depois" });

      expect(res.status).toBe(200);
      expect(res.body.nome).toBe("Equipe Depois");
      expect(res.body.uuid).toBe(created.body.uuid);
    });

    it("deve retornar 404 ao tentar atualizar equipe inexistente", async () => {
      const missingId = await getMissingTeamId();
      const res = await request(app)
        .put(`/competitions/${competicaoId}/teams/${missingId}`)
        .send({ nome: "Qualquer" });

      expect(res.status).toBe(404);
    });

    it("deve retornar 400 quando payload é inválido", async () => {
      const created = await request(app)
        .post(`/competitions/${competicaoId}/teams`)
        .send({ nome: "Equipe PutInvalido" });

      const res = await request(app)
        .put(`/competitions/${competicaoId}/teams/${created.body.id}`)
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /competitions/:competicaoId/teams/:teamId", () => {
    it("deve deletar a equipe e retornar 204", async () => {
      const created = await request(app)
        .post(`/competitions/${competicaoId}/teams`)
        .send({ nome: "Equipe Deletar" });

      const res = await request(app).delete(
        `/competitions/${competicaoId}/teams/${created.body.id}`
      );

      expect(res.status).toBe(204);

      const check = await request(app).get(
        `/competitions/${competicaoId}/teams/${created.body.id}`
      );
      expect(check.status).toBe(404);
    });

    it("deve retornar 404 ao tentar deletar equipe inexistente", async () => {
      const missingId = await getMissingTeamId();
      const res = await request(app).delete(
        `/competitions/${competicaoId}/teams/${missingId}`
      );

      expect(res.status).toBe(404);
    });
  });
});
