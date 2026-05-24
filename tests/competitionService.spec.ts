import { createCompetitionService } from "../src/services/competitionService";

describe("competitionService.create", () => {
  it("deve criar competição com status inicial não iniciado", async () => {
    const repository = {
      create: jest.fn().mockResolvedValue({
        id: 1,
        nome: "Red Bull 24h São Paulo",
        data: "2026-06-15",
        endereco: "São Paulo - SP",
        status: "não iniciado",
        criado_em: "2026-05-21T00:00:00.000Z",
      }),
    };
    const competitionService = createCompetitionService(repository);

    const competition = await competitionService.create({
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
    expect(repository.create).toHaveBeenCalledWith({
      nome: "Red Bull 24h São Paulo",
      data: "2026-06-15",
      endereco: "São Paulo - SP",
    });
  });
});
