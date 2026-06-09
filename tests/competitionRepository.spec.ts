import { competitionRepository } from "../src/repositories/competitionRepository";

describe("competitionRepository", () => {
  it("deve persistir uma competição no Supabase", async () => {
    const competition = await competitionRepository.create({
      name: "Red Bull 24h São Paulo",
      date: "2026-06-15",
      address: "São Paulo - SP",
    });

    expect(competition).toMatchObject({
      name: "Red Bull 24h São Paulo",
      date: "2026-06-15",
      address: "São Paulo - SP",
      status: "not_started",
    });
    expect(competition.id).toBeDefined();
    expect(competition.created_at).toBeDefined();

    await competitionRepository.delete(competition.id);
  });

  it("deve buscar, atualizar, encerrar e deletar uma competição", async () => {
    const competition = await competitionRepository.create({
      name: "Competição repository",
      date: "2026-06-15",
      address: "São Paulo - SP",
    });

    const found = await competitionRepository.findById(competition.id);
    expect(found).toMatchObject({
      id: competition.id,
      name: "Competição repository",
    });

    const updated = await competitionRepository.update(competition.id, {
      name: "Competição repository atualizada",
      date: "2026-07-20",
      address: "Rio de Janeiro - RJ",
    });
    expect(updated).toMatchObject({
      id: competition.id,
      name: "Competição repository atualizada",
    });

    const closed = await competitionRepository.close(competition.id);
    expect(closed).toMatchObject({
      id: competition.id,
      status: "closed",
    });

    const deleted = await competitionRepository.delete(competition.id);
    expect(deleted).toBe(true);

    const missing = await competitionRepository.findById(competition.id);
    expect(missing).toBeNull();
  });
});
