import request from "supertest";
import app from "../src/app";
import { adminRepository } from "../src/repositories/adminRepository";
import bcrypt from "bcryptjs";

const RUN = Date.now().toString().slice(-7);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "senha-comum-mvp";
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync(ADMIN_PASSWORD, 10);

describe("Auth Login", () => {
  let adminEmail: string;

  beforeAll(async () => {
    const admin = await adminRepository.create({
      name: `Auth Test ${RUN}`,
      email: `auth-${RUN}@e2e.com`,
      area: "TI",
      password: ADMIN_PASSWORD,
    });
    adminEmail = admin.email;
  });

  describe("POST /auth/sessions", () => {
    it("deve autenticar com credenciais validas → 200", async () => {
      const res = await request(app)
        .post("/auth/sessions")
        .send({ email: adminEmail, password: ADMIN_PASSWORD });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        access_token: expect.any(String),
        refresh_token: expect.any(String),
        admin: {
          id: expect.any(Number),
          email: adminEmail,
          name: expect.any(String),
          role: "admin",
        },
      });
    });

    it("deve retornar 401 para senha invalida", async () => {
      const res = await request(app)
        .post("/auth/sessions")
        .send({ email: adminEmail, password: "senha-errada" });

      expect(res.status).toBe(401);
    });

    it("deve retornar 401 para email inexistente", async () => {
      const res = await request(app)
        .post("/auth/sessions")
        .send({ email: `nao-existe-${RUN}@e2e.com`, password: ADMIN_PASSWORD });

      expect(res.status).toBe(401);
    });
  });
});
