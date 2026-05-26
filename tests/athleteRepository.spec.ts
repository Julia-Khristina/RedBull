import { athleteRepository } from "../src/repositories/athleteRepository";
import { competitionRepository } from "../src/repositories/competitionRepository";
import { teamRepository } from "../src/repositories/teamRepository";

describe("athleteRepository.create", () => {
  it("deve persistir atleta no Supabase com id e criado_em gerados pelo banco", async () => {
    const competition = await competitionRepository.create({
      nome: "Competição Repo Atleta",
      data: "2026-06-15",
      endereco: "São Paulo - SP",
    });
    const team = await teamRepository.create({
      nome: "Equipe Repo Atleta",
      competicao_id: competition.id,
    });

    const s = Date.now().toString().slice(-9).padStart(9, "0");
    const cpf = `${s.slice(0, 3)}.${s.slice(3, 6)}.${s.slice(6, 9)}-01`;
    const email = `repo${s}@athletetest.com`;

    const athlete = await athleteRepository.create({
      nome: "Atleta Repo",
      cpf,
      email,
      equipe_id: team.id,
    });

    expect(athlete.id).toBeDefined();
    expect(athlete.criado_em).toBeDefined();
    expect(athlete.equipe_id).toBe(team.id);
    expect(athlete.status).toBe("corredor");
    expect(athlete.cpf).toBe(cpf);
  });
});
