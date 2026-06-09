import { teamRepository } from "../src/repositories/teamRepository";
import { competitionRepository } from "../src/repositories/competitionRepository";

describe("teamRepository.create", () => {
  it("deve persistir uma equipe no Supabase com UUID gerado pelo banco", async () => {
    const competition = await competitionRepository.create({
      name: "Competição Teste teamRepository",
      date: "2026-06-15",
      address: "São Paulo - SP",
    });

    const team = await teamRepository.create({
      name: "Equipe Teste teamRepository",
      id_competition: competition.id,
    });

    expect(team).toMatchObject({
      name: "Equipe Teste teamRepository",
      id_competition: competition.id,
    });
    expect(team.id).toBeDefined();
    expect(team.uuid).toBeDefined();
    expect(team.created_at).toBeDefined();
  });
});
