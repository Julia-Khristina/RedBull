import { runnerRepository } from "../src/repositories/runnerRepository";
import { competitionRepository } from "../src/repositories/competitionRepository";
import { teamRepository } from "../src/repositories/teamRepository";

describe("runnerRepository.create", () => {
  it("deve persistir atleta no Supabase com id e created_at gerados pelo banco", async () => {
    const competition = await competitionRepository.create({
      name: "Competição Repo Atleta",
      date: "2026-06-15",
      address: "São Paulo - SP",
    });
    const team = await teamRepository.create({
      name: "Equipe Repo Atleta",
      id_competition: competition.id,
    });

    const s = Date.now().toString().slice(-9).padStart(9, "0");
    const cpf = `${s.slice(0, 3)}.${s.slice(3, 6)}.${s.slice(6, 9)}-01`;
    const email = `repo${s}@runnertest.com`;

    const runner = await runnerRepository.create({
      name: "Atleta Repo",
      cpf,
      email,
      id_team: team.id,
    });

    expect(runner.id).toBeDefined();
    expect(runner.created_at).toBeDefined();
    expect(runner.id_team).toBe(team.id);
    expect(runner.status).toBe("runner");
    expect(runner.cpf).toBe(cpf);
  });
});
