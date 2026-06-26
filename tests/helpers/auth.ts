import request from "supertest";
import app from "../../src/app";
import { adminRepository } from "../../src/repositories/adminRepository";
import bcrypt from "bcryptjs";

let cachedToken: string | null = null;
let cachedAdminId: number | null = null;

export async function getAuthToken(): Promise<string> {
  if (cachedToken) return cachedToken;

  const RUN = Date.now().toString().slice(-7);
  const adminPassword = process.env.ADMIN_PASSWORD || "senha-comum-mvp";
  process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync(adminPassword, 10);

  const admin = await adminRepository.create({
    name: `Auth Helper ${RUN}`,
    email: `auth-helper-${RUN}@e2e.com`,
    area: "TI",
    password: adminPassword,
  });
  cachedAdminId = admin.id;

  const res = await request(app)
    .post("/auth/sessions")
    .send({ email: admin.email, password: adminPassword });

  cachedToken = res.body.access_token;
  return cachedToken!;
}

export function bearer(token: string) {
  return { Authorization: `Bearer ${token}` };
}
