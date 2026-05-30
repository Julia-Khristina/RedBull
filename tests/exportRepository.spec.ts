import { exportRepository } from "../src/repositories/exportRepository";
import { athleteRepository } from "../src/repositories/athleteRepository";
import { competitionRepository } from "../src/repositories/competitionRepository";
import { teamRepository } from "../src/repositories/teamRepository";

const RUN = Date.now().toString().slice(-7);

describe("exportRepository", () => {
  it("deve buscar dados exportaveis de uma competicao no Supabase", async () => {
    const competition = await competitionRepository.create({
      nome: `Competicao Export Repository ${RUN}`,
      data: "2026-06-15",
      endereco: "Sao Paulo - SP",
    });

    const team = await teamRepository.create({
      nome: `Equipe Export Repository ${RUN}`,
      competicao_id: competition.id,
    });

    const athlete = await athleteRepository.create({
      nome: "Atleta Export Repository",
      cpf: `${RUN.slice(0, 3)}.${RUN.slice(3, 6)}.100-01`,
      email: `export-repository-${RUN}@test.com`,
      equipe_id: team.id,
    });

    const data = await exportRepository.findCompetitionExportData(
      competition.id
    );

    expect(data).toBeDefined();
    expect(data?.competition).toMatchObject({
      id: competition.id,
      nome: competition.nome,
    });
    expect(data?.teams).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: team.id,
          nome: team.nome,
          competicao_id: competition.id,
        }),
      ])
    );
    expect(data?.athletes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: athlete.id,
          nome: athlete.nome,
          equipe_id: team.id,
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
