import request from "supertest";
import app from "../src/app";

describe("POST /competitions", () => {
  const payloadValido = {
    nome: "Red Bull 24h São Paulo",
    data: "2026-06-15",
    endereco: "São Paulo - SP",
  };

  it("deve criar uma competição com payload válido", async () => {
    const res = await request(app).post("/competitions").send(payloadValido);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      nome: payloadValido.nome,
      data: payloadValido.data,
      endereco: payloadValido.endereco,
      status: "não iniciado",
    });

    expect(res.body.id).toBeDefined();
    expect(res.body.criado_em).toBeDefined();
  });

  it.each([
    ["nome", { data: payloadValido.data, endereco: payloadValido.endereco }],
    ["data", { nome: payloadValido.nome, endereco: payloadValido.endereco }],
    ["endereco", { nome: payloadValido.nome, data: payloadValido.data }],
    ["nome vazio", { ...payloadValido, nome: "" }],
    ["data vazia", { ...payloadValido, data: "" }],
    ["endereco vazio", { ...payloadValido, endereco: "" }],
  ])("deve rejeitar payload inválido: %s", async (_caso, payload) => {
    const res = await request(app).post("/competitions").send(payload);

    expect(res.status).toBe(400);
  });
});
