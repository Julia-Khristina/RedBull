import request from "supertest";
import app from "../src/app";
import { competitionRepository } from "../src/repositories/competitionRepository";
import { teamRepository } from "../src/repositories/teamRepository";
import { adminRepository } from "../src/repositories/adminRepository";
import { runnerRepository } from "../src/repositories/runnerRepository";
import { getAuthToken, bearer } from "./helpers/auth";

const RUN = Date.now().toString().slice(-7);

function cpf(n: number): string {
  const tag = String(n).padStart(2, "0");
  return `${RUN.slice(0, 3)}.${RUN.slice(3, 6)}.000-${tag}`;
}

function email(tag: string): string {
  return `${tag}${RUN}@checkpoint-e2e.com`;
}

describe("Endpoints REST de checkpoints", () => {
  let competitionId: number;
  let teamId: number;
  let runnerId: number;
  let adminId: number;
  let checkpointId: number;
  let token: string;

  beforeAll(async () => {
    token = await getAuthToken();

    const competition = await competitionRepository.create({
      name: `Competicao E2E Checkpoint ${RUN}`,
      date: "2026-06-15",
      address: "Sao Paulo - SP",
    });
    competitionId = competition.id;

    const team = await teamRepository.create({
      name: `Equipe E2E Checkpoint ${RUN}`,
      id_competition: competitionId,
    });
    teamId = team.id;

    const runner = await runnerRepository.create({
      name: "Atleta E2E Checkpoint",
      cpf: cpf(1),
      email: email("runner"),
      id_team: teamId,
    });
    runnerId = runner.id;

    const admin = await adminRepository.create({
      name: `Admin E2E Checkpoint ${RUN}`,
      email: email("admin"),
      area: "TI",
      password: "temp123",
    });
    adminId = admin.id;
  });

  const checkpointPayload = () => ({
    identifier: `CP-${RUN}`,
    distance_km: 5,
    id_runner: runnerId,
    id_competition: competitionId,
    id_admin: adminId,
  });

  describe("POST /checkpoints", () => {
    it("deve criar checkpoint com payload valido → 201", async () => {
      const res = await request(app)
        .post("/checkpoints")
        .set(bearer(token))
        .send(checkpointPayload());

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        identifier: `CP-${RUN}`,
        distance_km: 5,
        id_runner: runnerId,
        id_competition: competitionId,
        id_admin: adminId,
      });
      expect(res.body.id).toBeDefined();

      checkpointId = res.body.id;
    });

    it("deve rejeitar identifier duplicado → 409", async () => {
      const res = await request(app)
        .post("/checkpoints")
        .set(bearer(token))
        .send(checkpointPayload());

      expect(res.status).toBe(409);
    });

    it.each([
      ["payload vazio", {}],
      [
        "sem identifier",
        {
          distance_km: 5,
          id_runner: runnerId,
          id_competition: competitionId,
          id_admin: adminId,
        },
      ],
      [
        "distance_km negativo",
        {
          identifier: "CP-INV",
          distance_km: -1,
          id_runner: runnerId,
          id_competition: competitionId,
          id_admin: adminId,
        },
      ],
    ])("deve rejeitar payload invalido: %s → 400", async (_caso, payload) => {
      const res = await request(app)
        .post("/checkpoints")
        .set(bearer(token))
        .send(payload);
      expect(res.status).toBe(400);
    });
  });

  describe("GET /checkpoints", () => {
    it("deve retornar array de checkpoints → 200", async () => {
      const res = await request(app)
        .get("/checkpoints")
        .set(bearer(token));

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /checkpoints/:id", () => {
    it("deve retornar checkpoint por id → 200", async () => {
      const res = await request(app)
        .get(`/checkpoints/${checkpointId}`)
        .set(bearer(token));

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(checkpointId);
    });

    it("deve retornar 404 para checkpoint inexistente", async () => {
      const res = await request(app)
        .get("/checkpoints/999999")
        .set(bearer(token));
      expect(res.status).toBe(404);
    });

    it("deve retornar 400 para id nao numerico", async () => {
      const res = await request(app)
        .get("/checkpoints/abc")
        .set(bearer(token));
      expect(res.status).toBe(400);
    });
  });

  describe("PUT /checkpoints/:id", () => {
    it("deve atualizar checkpoint → 200", async () => {
      const res = await request(app)
        .put(`/checkpoints/${checkpointId}`)
        .set(bearer(token))
        .send({ distance_km: 10 });

      expect(res.status).toBe(200);
      expect(res.body.distance_km).toBe(10);
    });

    it("deve retornar 404 para checkpoint inexistente", async () => {
      const res = await request(app)
        .put("/checkpoints/999999")
        .set(bearer(token))
        .send({ distance_km: 5 });
      expect(res.status).toBe(404);
    });

    it("deve retornar 400 para id nao numerico", async () => {
      const res = await request(app)
        .put("/checkpoints/abc")
        .set(bearer(token))
        .send({ distance_km: 5 });
      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /checkpoints/:id", () => {
    it("deve deletar checkpoint → 204; GET posterior → 404", async () => {
      const res = await request(app)
        .delete(`/checkpoints/${checkpointId}`)
        .set(bearer(token));
      expect(res.status).toBe(204);

      const check = await request(app)
        .get(`/checkpoints/${checkpointId}`)
        .set(bearer(token));
      expect(check.status).toBe(404);
    });

    it("deve retornar 404 para checkpoint inexistente", async () => {
      const res = await request(app)
        .delete("/checkpoints/999999")
        .set(bearer(token));
      expect(res.status).toBe(404);
    });
  });

  describe("POST /runners/:runnerId/checkpoints", () => {
    it("deve criar checkpoint para o atleta → 201", async () => {
      const res = await request(app)
        .post(`/runners/${runnerId}/checkpoints`)
        .set(bearer(token))
        .send({
          identifier: `CP-RUNNER-${RUN}`,
          distance_km: 3,
          id_competition: competitionId,
          id_admin: adminId,
        });

      expect(res.status).toBe(201);
      expect(res.body.id_runner).toBe(runnerId);
    });

    it("deve retornar 400 para runnerId nao numerico", async () => {
      const res = await request(app)
        .post("/runners/abc/checkpoints")
        .set(bearer(token))
        .send({
          identifier: "CP-INV-RUNNER",
          distance_km: 3,
          id_competition: competitionId,
          id_admin: adminId,
        });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /runners/:runnerId/checkpoints", () => {
    it("deve listar checkpoints do atleta → 200", async () => {
      const res = await request(app)
        .get(`/runners/${runnerId}/checkpoints`)
        .set(bearer(token));

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("deve retornar 400 para runnerId nao numerico", async () => {
      const res = await request(app)
        .get("/runners/abc/checkpoints")
        .set(bearer(token));
      expect(res.status).toBe(400);
    });
  });

  describe("GET /competitions/:id/checkpoints", () => {
    it("deve listar checkpoints da competicao → 200", async () => {
      const res = await request(app)
        .get(`/competitions/${competitionId}/checkpoints`)
        .set(bearer(token));

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("deve retornar 400 para id nao numerico", async () => {
      const res = await request(app)
        .get("/competitions/abc/checkpoints")
        .set(bearer(token));
      expect(res.status).toBe(400);
    });
  });

  describe("GET /competitions/:id/checkpoints/inconsistencies", () => {
    it("deve listar inconsistencias da competicao → 200", async () => {
      const res = await request(app)
        .get(`/competitions/${competitionId}/checkpoints/inconsistencies`)
        .set(bearer(token));

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("deve retornar 400 para id nao numerico", async () => {
      const res = await request(app)
        .get("/competitions/abc/checkpoints/inconsistencies")
        .set(bearer(token));
      expect(res.status).toBe(400);
    });
  });
});
