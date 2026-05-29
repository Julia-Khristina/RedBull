import { createRankingService } from "../src/services/rankingService";
import { Checkpoint } from "../src/models/checkpoint";
import { Team } from "../src/models/team";

const baseCheckpoint: Checkpoint = {
  id: 1,
  identificador: "CP-001",
  km: 0,
  pace: null,
  tempo: null,
  imagem: null,
  corredor_id: 1,
  competicao_id: 1,
  esteira_id: 1,
  administrador_id: 1,
  criado_em: "2026-05-01T10:00:00.000Z",
};

const teams: Team[] = [
  {
    id: 10,
    nome: "Equipe Alpha",
    uuid: "11111111-1111-1111-1111-111111111111",
    qr_code: null,
    competicao_id: 1,
    criado_em: "2026-05-01T10:00:00.000Z",
  },
  {
    id: 20,
    nome: "Equipe Beta",
    uuid: "22222222-2222-2222-2222-222222222222",
    qr_code: null,
    competicao_id: 1,
    criado_em: "2026-05-01T10:00:00.000Z",
  },
];

function makeCheckpoint(
  overrides: Partial<Checkpoint>
): Checkpoint {
  return { ...baseCheckpoint, ...overrides };
}

describe("rankingService.gerarRankingCorredores", () => {
  it("deve ordenar corredores por maior km e menor pace medio", async () => {
    const service = createRankingService(
      {
        findByCompeticao: jest.fn().mockResolvedValue([
          makeCheckpoint({
            id: 1,
            corredor_id: 1,
            km: 5,
            tempo: "25:00",
            corredor: { id: 1, nome: "Ana", equipe_id: 10 },
          }),
          makeCheckpoint({
            id: 2,
            corredor_id: 2,
            km: 5,
            tempo: "24:00",
            corredor: { id: 2, nome: "Bia", equipe_id: 20 },
          }),
          makeCheckpoint({
            id: 3,
            corredor_id: 3,
            km: 4,
            tempo: "18:00",
            corredor: { id: 3, nome: "Caio", equipe_id: 10 },
          }),
        ]),
      },
      { findByCompetition: jest.fn().mockResolvedValue(teams) }
    );

    const ranking = await service.gerarRankingCorredores(1);

    expect(ranking).toMatchObject([
      {
        posicao: 1,
        corredor_id: 2,
        corredor_nome: "Bia",
        km_total: 5,
        pace_medio: "4:48",
      },
      {
        posicao: 2,
        corredor_id: 1,
        corredor_nome: "Ana",
        km_total: 5,
        pace_medio: "5:00",
      },
      {
        posicao: 3,
        corredor_id: 3,
        corredor_nome: "Caio",
        km_total: 4,
        pace_medio: "4:30",
      },
    ]);
  });
});

describe("rankingService.gerarRankingEquipes", () => {
  it("deve somar a distancia dos corredores da equipe", async () => {
    const service = createRankingService(
      {
        findByCompeticao: jest.fn().mockResolvedValue([
          makeCheckpoint({
            id: 1,
            corredor_id: 1,
            km: 5,
            tempo: "25:00",
            corredor: { id: 1, nome: "Ana", equipe_id: 10 },
          }),
          makeCheckpoint({
            id: 2,
            corredor_id: 2,
            km: 5,
            tempo: "24:00",
            corredor: { id: 2, nome: "Bia", equipe_id: 20 },
          }),
          makeCheckpoint({
            id: 3,
            corredor_id: 3,
            km: 4,
            tempo: "18:00",
            corredor: { id: 3, nome: "Caio", equipe_id: 10 },
          }),
        ]),
      },
      { findByCompetition: jest.fn().mockResolvedValue(teams) }
    );

    const ranking = await service.gerarRankingEquipes(1);

    expect(ranking).toMatchObject([
      {
        posicao: 1,
        equipe_id: 10,
        equipe_nome: "Equipe Alpha",
        km_total: 9,
        corredores: 2,
      },
      {
        posicao: 2,
        equipe_id: 20,
        equipe_nome: "Equipe Beta",
        km_total: 5,
        corredores: 1,
      },
    ]);
  });
});
