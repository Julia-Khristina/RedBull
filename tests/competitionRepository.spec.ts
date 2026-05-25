import { competitionRepository } from "../src/repositories/competitionRepository";

describe("competitionRepository.create", () => {
  it("deve persistir uma competição no Supabase", async () => {
    const competition = await competitionRepository.create({
      nome: "Red Bull 24h São Paulo",
      data: "2026-06-15",
      endereco: "São Paulo - SP",
    });

    expect(competition).toMatchObject({
      nome: "Red Bull 24h São Paulo",
      data: "2026-06-15",
      endereco: "São Paulo - SP",
      status: "não iniciado",
    });
    expect(competition.id).toBeDefined();
    expect(competition.criado_em).toBeDefined();
  });
});
