import request from "supertest";
import app from "../src/app";
import { competitionRepository } from "../src/repositories/competitionRepository";
import { teamRepository } from "../src/repositories/teamRepository";

// Sufixo único por run para evitar colisão de UNIQUE (cpf, email) no banco real
const RUN = Date.now().toString().slice(-7);

function cpf(n: number): string {
  const tag = String(n).padStart(2, "0");
  return `${RUN.slice(0, 3)}.${RUN.slice(3, 6)}.000-${tag}`;
}

function email(tag: string): string {
  return `${tag}${RUN}@e2e.com`;
}

describe("Endpoints REST de atletas", () => {
  let competicaoId: number;
  let teamId: number;

  beforeAll(async () => {
    const competition = await competitionRepository.create({
      nome: `Competição E2E Atletas ${RUN}`,
      data: "2026-06-15",
      endereco: "São Paulo - SP",
    });
    competicaoId = competition.id;

    const team = await teamRepository.create({
      nome: `Equipe E2E Atletas ${RUN}`,
      competicao_id: competicaoId,
    });
    teamId = team.id;
  });

  const baseUrl = () =>
    `/competitions/${competicaoId}/teams/${teamId}/athletes`;

  async function getMissingAthleteId(): Promise<number> {
    const res = await request(app)
      .post(baseUrl())
      .send({ nome: "Zumbi", cpf: cpf(99), email: email("zumbi") });
    await request(app).delete(`${baseUrl()}/${res.body.id}`);
    return res.body.id;
  }

  // ─── POST ────────────────────────────────────────────────────────────────────

  describe("POST /competitions/:competicaoId/teams/:teamId/athletes", () => {
    it("deve criar atleta com payload válido e retornar 201", async () => {
      const res = await request(app)
        .post(baseUrl())
        .send({ nome: "João Silva", cpf: cpf(1), email: email("joao") });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ nome: "João Silva", equipe_id: teamId });
      expect(res.body.id).toBeDefined();
      expect(res.body.criado_em).toBeDefined();
      expect(res.body.status).toBe("corredor");
    });

    it.each([
      ["sem nome", { cpf: cpf(10), email: email("p10") }],
      ["sem cpf", { nome: "X", email: email("p11") }],
      ["sem email", { nome: "X", cpf: cpf(12) }],
      ["cpf formato inválido", { nome: "X", cpf: "abc", email: email("p13") }],
      ["email sem @", { nome: "X", cpf: cpf(14), email: "invalido" }],
      [
        "status fora do enum",
        { nome: "X", cpf: cpf(15), email: email("p15"), status: "correndo" },
      ],
    ])("deve rejeitar payload inválido: %s → 400", async (_caso, payload) => {
      const res = await request(app).post(baseUrl()).send(payload);
      expect(res.status).toBe(400);
    });

    it("deve rejeitar CPF duplicado → 409", async () => {
      await request(app)
        .post(baseUrl())
        .send({ nome: "A", cpf: cpf(20), email: email("a20") });

      const res = await request(app)
        .post(baseUrl())
        .send({ nome: "B", cpf: cpf(20), email: email("b20") });

      expect(res.status).toBe(409);
    });

    it("deve rejeitar email duplicado → 409", async () => {
      await request(app)
        .post(baseUrl())
        .send({ nome: "C", cpf: cpf(21), email: email("shared") });

      const res = await request(app)
        .post(baseUrl())
        .send({ nome: "D", cpf: cpf(22), email: email("shared") });

      expect(res.status).toBe(409);
    });

    it("deve rejeitar teamId não numérico → 400", async () => {
      const res = await request(app)
        .post(`/competitions/${competicaoId}/teams/abc/athletes`)
        .send({ nome: "X", cpf: cpf(30), email: email("p30") });
      expect(res.status).toBe(400);
    });
  });

  // ─── GET list ────────────────────────────────────────────────────────────────

  describe("GET /competitions/:competicaoId/teams/:teamId/athletes", () => {
    it("deve retornar array com os atletas da equipe → 200", async () => {
      const res = await request(app).get(baseUrl());
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("deve retornar array vazio quando equipe não tem atletas → 200", async () => {
      const team2 = await teamRepository.create({
        nome: `Equipe Sem Atletas ${RUN}`,
        competicao_id: competicaoId,
      });
      const res = await request(app).get(
        `/competitions/${competicaoId}/teams/${team2.id}/athletes`
      );
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  // ─── GET by id ───────────────────────────────────────────────────────────────

  describe("GET /competitions/:competicaoId/teams/:teamId/athletes/:athleteId", () => {
    it("deve retornar o atleta quando existe → 200", async () => {
      const created = await request(app)
        .post(baseUrl())
        .send({ nome: "FindById", cpf: cpf(40), email: email("findbyid") });

      const res = await request(app).get(`${baseUrl()}/${created.body.id}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(created.body.id);
    });

    it("deve retornar 404 quando atleta não existe", async () => {
      const missingId = await getMissingAthleteId();
      const res = await request(app).get(`${baseUrl()}/${missingId}`);
      expect(res.status).toBe(404);
    });
  });

  // ─── PUT ─────────────────────────────────────────────────────────────────────

  describe("PUT /competitions/:competicaoId/teams/:teamId/athletes/:athleteId", () => {
    it("deve atualizar nome e retornar 200", async () => {
      const created = await request(app)
        .post(baseUrl())
        .send({ nome: "Antes", cpf: cpf(50), email: email("antes") });

      const res = await request(app)
        .put(`${baseUrl()}/${created.body.id}`)
        .send({ nome: "Depois" });

      expect(res.status).toBe(200);
      expect(res.body.nome).toBe("Depois");
      expect(res.body.cpf).toBe(created.body.cpf);
    });

    it("deve rejeitar payload vazio → 400", async () => {
      const created = await request(app)
        .post(baseUrl())
        .send({ nome: "PutVazio", cpf: cpf(51), email: email("putvazio") });

      const res = await request(app)
        .put(`${baseUrl()}/${created.body.id}`)
        .send({});
      expect(res.status).toBe(400);
    });

    it("deve rejeitar cpf no body → 400", async () => {
      const created = await request(app)
        .post(baseUrl())
        .send({ nome: "PutCpf", cpf: cpf(52), email: email("putcpf") });

      const res = await request(app)
        .put(`${baseUrl()}/${created.body.id}`)
        .send({ cpf: "999.000.000-00" });
      expect(res.status).toBe(400);
    });

    it("deve retornar 404 ao atualizar atleta inexistente", async () => {
      const missingId = await getMissingAthleteId();
      const res = await request(app)
        .put(`${baseUrl()}/${missingId}`)
        .send({ nome: "X" });
      expect(res.status).toBe(404);
    });
  });

  // ─── DELETE ──────────────────────────────────────────────────────────────────

  describe("DELETE /competitions/:competicaoId/teams/:teamId/athletes/:athleteId", () => {
    it("deve deletar e retornar 204; GET posterior retorna 404", async () => {
      const created = await request(app)
        .post(baseUrl())
        .send({ nome: "Deletar", cpf: cpf(60), email: email("deletar") });

      const res = await request(app).delete(
        `${baseUrl()}/${created.body.id}`
      );
      expect(res.status).toBe(204);

      const check = await request(app).get(`${baseUrl()}/${created.body.id}`);
      expect(check.status).toBe(404);
    });

    it("deve retornar 404 ao deletar atleta inexistente", async () => {
      const missingId = await getMissingAthleteId();
      const res = await request(app).delete(`${baseUrl()}/${missingId}`);
      expect(res.status).toBe(404);
    });
  });
});
