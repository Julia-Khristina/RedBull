import { teamRepository } from "../src/repositories/teamRepository";
import { competitionRepository } from "../src/repositories/competitionRepository";

describe("teamRepository.create", () => {
  it("deve persistir uma equipe no Supabase com UUID gerado pelo banco", async () => {
    const competition = await competitionRepository.create({
      nome: "Competição Teste teamRepository",
      data: "2026-06-15",
      endereco: "São Paulo - SP",
    });

    const team = await teamRepository.create({
      nome: "Equipe Teste teamRepository",
      competicao_id: competition.id,
    });

    expect(team).toMatchObject({
      nome: "Equipe Teste teamRepository",
      competicao_id: competition.id,
    });
    expect(team.id).toBeDefined();
    expect(team.uuid).toBeDefined();
    expect(team.criado_em).toBeDefined();
  });
});
