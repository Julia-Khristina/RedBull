import request from "supertest";
import app from "../src/app";
import { getAuthToken, bearer } from "./helpers/auth";

const RUN = Date.now().toString().slice(-7);

function email(tag: string): string {
  return `${tag}${RUN}@admin-e2e.com`;
}

describe("Admin CRUD", () => {
  let adminId: number;
  let token: string;

  beforeAll(async () => {
    token = await getAuthToken();
  });

  const adminPayload = {
    name: "Admin E2E",
    email: email("admin"),
    area: "TI",
    password: "temp123",
  };

  describe("POST /admin", () => {
    it("deve criar administrador com payload valido → 201 (password omitido)", async () => {
      const res = await request(app)
        .post("/admin")
        .set(bearer(token))
        .send(adminPayload);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        name: adminPayload.name,
        email: adminPayload.email,
        area: adminPayload.area,
      });
      expect(res.body.id).toBeDefined();
      expect(res.body.password).toBeUndefined();

      adminId = res.body.id;
    });

    it("deve rejeitar payload sem campos obrigatorios → 400", async () => {
      const res = await request(app)
        .post("/admin")
        .set(bearer(token))
        .send({});
      expect(res.status).toBe(400);
    });

    it("deve rejeitar email duplicado → 409", async () => {
      const res = await request(app)
        .post("/admin")
        .set(bearer(token))
        .send(adminPayload);
      expect(res.status).toBe(409);
    });
  });

  describe("GET /admin", () => {
    it("deve listar administradores → 200", async () => {
      const res = await request(app)
        .get("/admin")
        .set(bearer(token));

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      res.body.forEach((a: Record<string, unknown>) => {
        expect(a.password).toBeUndefined();
      });
    });
  });

  describe("GET /admin/:id", () => {
    it("deve retornar administrador por id → 200", async () => {
      const res = await request(app)
        .get(`/admin/${adminId}`)
        .set(bearer(token));

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: adminId,
        name: adminPayload.name,
        email: adminPayload.email,
        area: adminPayload.area,
      });
      expect(res.body.password).toBeUndefined();
    });

    it("deve retornar 404 para administrador inexistente", async () => {
      const res = await request(app)
        .get("/admin/999999")
        .set(bearer(token));
      expect(res.status).toBe(404);
    });
  });

  describe("PUT /admin/:id", () => {
    it("deve atualizar administrador → 200", async () => {
      const res = await request(app)
        .put(`/admin/${adminId}`)
        .set(bearer(token))
        .send({ name: "Admin Atualizado E2E" });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Admin Atualizado E2E");
      expect(res.body.password).toBeUndefined();
    });

    it("deve retornar 404 para administrador inexistente", async () => {
      const res = await request(app)
        .put("/admin/999999")
        .set(bearer(token))
        .send({ name: "X" });
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /admin/:id", () => {
    it("deve deletar administrador → 204; GET posterior → 404", async () => {
      const res = await request(app)
        .delete(`/admin/${adminId}`)
        .set(bearer(token));
      expect(res.status).toBe(204);

      const check = await request(app)
        .get(`/admin/${adminId}`)
        .set(bearer(token));
      expect(check.status).toBe(404);
    });

    it("deve retornar 404 para administrador inexistente", async () => {
      const res = await request(app)
        .delete("/admin/999999")
        .set(bearer(token));
      expect(res.status).toBe(404);
    });
  });
});
