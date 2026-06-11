import { exportRepository } from "../src/repositories/exportRepository";
import { runnerRepository } from "../src/repositories/runnerRepository";
import { competitionRepository } from "../src/repositories/competitionRepository";
import { teamRepository } from "../src/repositories/teamRepository";

const RUN = Date.now().toString().slice(-7);

describe("exportRepository", () => {
  it("deve buscar dados exportaveis de uma competicao no Supabase", async () => {
    const competition = await competitionRepository.create({
      name: `Competicao Export Repository ${RUN}`,
      date: "2026-06-15",
      address: "Sao Paulo - SP",
    });

    const team = await teamRepository.create({
      name: `Equipe Export Repository ${RUN}`,
      id_competition: competition.id,
    });

    const runner = await runnerRepository.create({
      name: "Atleta Export Repository",
      cpf: `${RUN.slice(0, 3)}.${RUN.slice(3, 6)}.100-01`,
      email: `export-repository-${RUN}@test.com`,
      id_team: team.id,
    });

    const data = await exportRepository.findCompetitionExportData(
      competition.id
    );

    expect(data).toBeDefined();
    expect(data?.competition).toMatchObject({
      id: competition.id,
      name: competition.name,
    });
    expect(data?.teams).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: team.id,
          name: team.name,
          id_competition: competition.id,
        }),
      ])
    );
    expect(data?.runners).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: runner.id,
          name: runner.name,
          id_team: team.id,
        }),
      ])
    );
    expect(Array.isArray(data?.checkpoints)).toBe(true);
  });

  it("deve retornar null quando competicao nao existe", async () => {
    const data = await exportRepository.findCompetitionExportData(32767);

    expect(data).toBeNull();
  });
});
