import request from "supertest";
import app from "../src/app";

const payloadValido = {
  nome: "Red Bull 24h São Paulo",
  data: "2026-06-15",
  endereco: "São Paulo - SP",
};

async function createCompetition(payload = payloadValido) {
  const res = await request(app).post("/competitions").send(payload);
  expect(res.status).toBe(201);
  return res.body;
}

describe("POST /competitions", () => {
  it("deve criar uma competição com payload válido", async () => {
    const competition = await createCompetition();

    expect(competition).toMatchObject({
      nome: payloadValido.nome,
      data: payloadValido.data,
      endereco: payloadValido.endereco,
      status: "não iniciado",
    });

    expect(competition.id).toBeDefined();
    expect(competition.criado_em).toBeDefined();

    await request(app).delete(`/competitions/${competition.id}`);
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

describe("CRUD /competitions", () => {
  it("deve listar competições", async () => {
    const competition = await createCompetition({
      ...payloadValido,
      nome: "Competição para listagem",
    });

    const res = await request(app).get("/competitions");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: competition.id,
          nome: "Competição para listagem",
        }),
      ])
    );

    await request(app).delete(`/competitions/${competition.id}`);
  });

  it("deve buscar competição por id", async () => {
    const competition = await createCompetition({
      ...payloadValido,
      nome: "Competição para busca",
    });

    const res = await request(app).get(`/competitions/${competition.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: competition.id,
      nome: "Competição para busca",
      status: "não iniciado",
    });

    await request(app).delete(`/competitions/${competition.id}`);
  });

  it("deve retornar 404 ao buscar competição inexistente", async () => {
    const res = await request(app).get("/competitions/32767");

    expect(res.status).toBe(404);
  });

  it("deve atualizar uma competição", async () => {
    const competition = await createCompetition({
      ...payloadValido,
      nome: "Competição antes do update",
    });

    const updatePayload = {
      nome: "Competição atualizada",
      data: "2026-07-20",
      endereco: "Rio de Janeiro - RJ",
    };

    const res = await request(app)
      .put(`/competitions/${competition.id}`)
      .send(updatePayload);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: competition.id,
      ...updatePayload,
      status: "não iniciado",
    });

    await request(app).delete(`/competitions/${competition.id}`);
  });

  it("deve encerrar uma competição", async () => {
    const competition = await createCompetition({
      ...payloadValido,
      nome: "Competição para encerramento",
    });

    const res = await request(app).patch(`/competitions/${competition.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: competition.id,
      status: "encerrada",
    });

    await request(app).delete(`/competitions/${competition.id}`);
  });

  it("deve deletar uma competição", async () => {
    const competition = await createCompetition({
      ...payloadValido,
      nome: "Competição para deleção",
    });

    const deleteRes = await request(app).delete(`/competitions/${competition.id}`);
    expect(deleteRes.status).toBe(204);

    const getRes = await request(app).get(`/competitions/${competition.id}`);
    expect(getRes.status).toBe(404);
  });
});
