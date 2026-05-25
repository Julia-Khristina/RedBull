import { competitionRepository } from "../src/repositories/competitionRepository";

describe("competitionRepository", () => {
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

    await competitionRepository.delete(competition.id);
  });

  it("deve buscar, atualizar, encerrar e deletar uma competição", async () => {
    const competition = await competitionRepository.create({
      nome: "Competição repository",
      data: "2026-06-15",
      endereco: "São Paulo - SP",
    });

    const found = await competitionRepository.findById(competition.id);
    expect(found).toMatchObject({
      id: competition.id,
      nome: "Competição repository",
    });

    const updated = await competitionRepository.update(competition.id, {
      nome: "Competição repository atualizada",
      data: "2026-07-20",
      endereco: "Rio de Janeiro - RJ",
    });
    expect(updated).toMatchObject({
      id: competition.id,
      nome: "Competição repository atualizada",
    });

    const closed = await competitionRepository.close(competition.id);
    expect(closed).toMatchObject({
      id: competition.id,
      status: "encerrada",
    });

    const deleted = await competitionRepository.delete(competition.id);
    expect(deleted).toBe(true);

    const missing = await competitionRepository.findById(competition.id);
    expect(missing).toBeNull();
  });
});
