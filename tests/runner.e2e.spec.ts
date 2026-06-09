import request from "supertest";
import app from "../src/app";
import { competitionRepository } from "../src/repositories/competitionRepository";
import { teamRepository } from "../src/repositories/teamRepository";

const RUN = Date.now().toString().slice(-7);

function cpf(n: number): string {
  const tag = String(n).padStart(2, "0");
  return `${RUN.slice(0, 3)}.${RUN.slice(3, 6)}.000-${tag}`;
}

function email(tag: string): string {
  return `${tag}${RUN}@e2e.com`;
}

describe("Endpoints REST de atletas", () => {
  let competitionId: number;
  let teamId: number;

  beforeAll(async () => {
    const competition = await competitionRepository.create({
      name: `Competição E2E Atletas ${RUN}`,
      date: "2026-06-15",
      address: "São Paulo - SP",
    });
    competitionId = competition.id;

    const team = await teamRepository.create({
      name: `Equipe E2E Atletas ${RUN}`,
      id_competition: competitionId,
    });
    teamId = team.id;
  });

  const baseUrl = () =>
    `/competitions/${competitionId}/teams/${teamId}/runners`;

  async function getMissingRunnerId(): Promise<number> {
    const res = await request(app)
      .post(baseUrl())
      .send({ name: "Zumbi", cpf: cpf(99), email: email("zumbi") });
    await request(app).delete(`${baseUrl()}/${res.body.id}`);
    return res.body.id;
  }

  describe("POST /competitions/:competitionId/teams/:teamId/runners", () => {
    it("deve criar atleta com payload válido e retornar 201", async () => {
      const res = await request(app)
        .post(baseUrl())
        .send({ name: "João Silva", cpf: cpf(1), email: email("joao") });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ name: "João Silva", id_team: teamId });
      expect(res.body.id).toBeDefined();
      expect(res.body.created_at).toBeDefined();
      expect(res.body.status).toBe("corredor");
    });

    it.each([
      ["sem name", { cpf: cpf(10), email: email("p10") }],
      ["sem cpf", { name: "X", email: email("p11") }],
      ["sem email", { name: "X", cpf: cpf(12) }],
      ["cpf formato inválido", { name: "X", cpf: "abc", email: email("p13") }],
      ["email sem @", { name: "X", cpf: cpf(14), email: "invalido" }],
      [
        "status fora do enum",
        { name: "X", cpf: cpf(15), email: email("p15"), status: "correndo" },
      ],
    ])("deve rejeitar payload inválido: %s → 400", async (_caso, payload) => {
      const res = await request(app).post(baseUrl()).send(payload);
      expect(res.status).toBe(400);
    });

    it("deve rejeitar CPF duplicado → 409", async () => {
      await request(app)
        .post(baseUrl())
        .send({ name: "A", cpf: cpf(20), email: email("a20") });

      const res = await request(app)
        .post(baseUrl())
        .send({ name: "B", cpf: cpf(20), email: email("b20") });

      expect(res.status).toBe(409);
    });

    it("deve rejeitar email duplicado → 409", async () => {
      await request(app)
        .post(baseUrl())
        .send({ name: "C", cpf: cpf(21), email: email("shared") });

      const res = await request(app)
        .post(baseUrl())
        .send({ name: "D", cpf: cpf(22), email: email("shared") });

      expect(res.status).toBe(409);
    });

    it("deve rejeitar teamId não numérico → 400", async () => {
      const res = await request(app)
        .post(`/competitions/${competitionId}/teams/abc/runners`)
        .send({ name: "X", cpf: cpf(30), email: email("p30") });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /competitions/:competitionId/teams/:teamId/runners", () => {
    it("deve retornar array com os atletas da equipe → 200", async () => {
      const res = await request(app).get(baseUrl());
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("deve retornar array vazio quando equipe não tem atletas → 200", async () => {
      const team2 = await teamRepository.create({
        name: `Equipe Sem Atletas ${RUN}`,
        id_competition: competitionId,
      });
      const res = await request(app).get(
        `/competitions/${competitionId}/teams/${team2.id}/runners`
      );
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe("GET /competitions/:competitionId/teams/:teamId/runners/:runnerId", () => {
    it("deve retornar o atleta quando existe → 200", async () => {
      const created = await request(app)
        .post(baseUrl())
        .send({ name: "FindById", cpf: cpf(40), email: email("findbyid") });

      const res = await request(app).get(`${baseUrl()}/${created.body.id}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(created.body.id);
    });

    it("deve retornar 404 quando atleta não existe", async () => {
      const missingId = await getMissingRunnerId();
      const res = await request(app).get(`${baseUrl()}/${missingId}`);
      expect(res.status).toBe(404);
    });
  });

  describe("PUT /competitions/:competitionId/teams/:teamId/runners/:runnerId", () => {
    it("deve atualizar name e retornar 200", async () => {
      const created = await request(app)
        .post(baseUrl())
        .send({ name: "Antes", cpf: cpf(50), email: email("antes") });

      const res = await request(app)
        .put(`${baseUrl()}/${created.body.id}`)
        .send({ name: "Depois" });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Depois");
      expect(res.body.cpf).toBe(created.body.cpf);
    });

    it("deve rejeitar payload vazio → 400", async () => {
      const created = await request(app)
        .post(baseUrl())
        .send({ name: "PutVazio", cpf: cpf(51), email: email("putvazio") });

      const res = await request(app)
        .put(`${baseUrl()}/${created.body.id}`)
        .send({});
      expect(res.status).toBe(400);
    });

    it("deve rejeitar cpf no body → 400", async () => {
      const created = await request(app)
        .post(baseUrl())
        .send({ name: "PutCpf", cpf: cpf(52), email: email("putcpf") });

      const res = await request(app)
        .put(`${baseUrl()}/${created.body.id}`)
        .send({ cpf: "999.000.000-00" });
      expect(res.status).toBe(400);
    });

    it("deve retornar 404 ao atualizar atleta inexistente", async () => {
      const missingId = await getMissingRunnerId();
      const res = await request(app)
        .put(`${baseUrl()}/${missingId}`)
        .send({ name: "X" });
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /competitions/:competitionId/teams/:teamId/runners/:runnerId", () => {
    it("deve deletar e retornar 204; GET posterior retorna 404", async () => {
      const created = await request(app)
        .post(baseUrl())
        .send({ name: "Deletar", cpf: cpf(60), email: email("deletar") });

      const res = await request(app).delete(
        `${baseUrl()}/${created.body.id}`
      );
      expect(res.status).toBe(204);

      const check = await request(app).get(`${baseUrl()}/${created.body.id}`);
      expect(check.status).toBe(404);
    });

    it("deve retornar 404 ao deletar atleta inexistente", async () => {
      const missingId = await getMissingRunnerId();
      const res = await request(app).delete(`${baseUrl()}/${missingId}`);
      expect(res.status).toBe(404);
    });
  });
});
