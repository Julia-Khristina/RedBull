import { Checkpoint } from "../models/checkpoint";
import { RankingRunner, RankingTeam } from "../models/ranking";
import { checkpointService } from "./checkpointService";
import { teamService } from "./teamService";

type CheckpointServiceDependency = Pick<
  typeof checkpointService,
  "findByCompeticao"
>;

type TeamServiceDependency = Pick<typeof teamService, "findByCompetition">;

interface RunnerAggregate {
  corredor_id: number;
  corredor_nome: string | null;
  equipe_id: number | null;
  km_total: number;
  tempo_segundos: number | null;
  pace_segundos: number | null;
  pace_amostras: number;
}

interface TeamAggregate {
  equipe_id: number;
  equipe_nome: string;
  competicao_id: number;
  km_total: number;
  tempo_segundos: number | null;
  pace_segundos_total: number;
  pace_amostras: number;
  corredores: Set<number>;
}

function parseTimeToSeconds(value: string | null): number | null {
  if (!value) return null;

  const parts = value.split(":").map((part) => Number(part));

  if (parts.some((part) => !Number.isFinite(part) || part < 0)) {
    return null;
  }

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }

  return null;
}

function formatPace(seconds: number | null): string | null {
  if (seconds === null || !Number.isFinite(seconds)) return null;

  const rounded = Math.round(seconds);
  const minutes = Math.floor(rounded / 60);
  const remainingSeconds = String(rounded % 60).padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

function getCheckpointPaceSeconds(checkpoint: Checkpoint): number | null {
  const tempoSeconds = parseTimeToSeconds(checkpoint.tempo);

  if (tempoSeconds !== null && checkpoint.km > 0) {
    return tempoSeconds / checkpoint.km;
  }

  return parseTimeToSeconds(checkpoint.pace);
}

function compareRanking(
  a: { km_total: number; pace_medio_segundos: number | null },
  b: { km_total: number; pace_medio_segundos: number | null }
): number {
  if (b.km_total !== a.km_total) return b.km_total - a.km_total;

  const aPace = a.pace_medio_segundos ?? Number.POSITIVE_INFINITY;
  const bPace = b.pace_medio_segundos ?? Number.POSITIVE_INFINITY;

  return aPace - bPace;
}

function withPositions<
  T extends {
    posicao: number;
    km_total: number;
    pace_medio_segundos: number | null;
  },
>(
  ranking: Omit<T, "posicao">[]
): T[] {
  return ranking
    .sort(compareRanking)
    .map((item, index) => ({ ...item, posicao: index + 1 }) as T);
}

export function createRankingService(
  checkpoints: CheckpointServiceDependency = checkpointService,
  teams: TeamServiceDependency = teamService
) {
  async function gerarRankingCorredores(
    competicaoId: number
  ): Promise<RankingRunner[]> {
    const checkpointsDaCompeticao =
      await checkpoints.findByCompeticao(competicaoId);

    const aggregates = new Map<number, RunnerAggregate>();

    for (const checkpoint of checkpointsDaCompeticao) {
      const current = aggregates.get(checkpoint.corredor_id);
      const paceSeconds = getCheckpointPaceSeconds(checkpoint);
      const tempoSeconds = parseTimeToSeconds(checkpoint.tempo);

      if (!current || checkpoint.km > current.km_total) {
        aggregates.set(checkpoint.corredor_id, {
          corredor_id: checkpoint.corredor_id,
          corredor_nome: checkpoint.corredor?.nome ?? null,
          equipe_id: checkpoint.corredor?.equipe_id ?? null,
          km_total: checkpoint.km,
          tempo_segundos: tempoSeconds,
          pace_segundos: paceSeconds,
          pace_amostras: paceSeconds === null ? 0 : 1,
        });
        continue;
      }

      if (paceSeconds !== null) {
        current.pace_segundos = (current.pace_segundos ?? 0) + paceSeconds;
        current.pace_amostras += 1;
      }
    }

    const ranking = Array.from(aggregates.values()).map((runner) => {
      const paceMedioSegundos =
        runner.tempo_segundos !== null && runner.km_total > 0
          ? runner.tempo_segundos / runner.km_total
          : runner.pace_amostras > 0 && runner.pace_segundos !== null
            ? runner.pace_segundos / runner.pace_amostras
            : null;

      return {
        corredor_id: runner.corredor_id,
        corredor_nome: runner.corredor_nome,
        equipe_id: runner.equipe_id,
        km_total: runner.km_total,
        pace_medio: formatPace(paceMedioSegundos),
        pace_medio_segundos: paceMedioSegundos,
      };
    });

    return withPositions<RankingRunner>(ranking);
  }

  return {
    gerarRankingCorredores,

    async gerarRankingEquipes(competicaoId: number): Promise<RankingTeam[]> {
      const [equipes, rankingCorredores] = await Promise.all([
        teams.findByCompetition(competicaoId),
        gerarRankingCorredores(competicaoId),
      ]);

      const equipePorId = new Map(equipes.map((equipe) => [equipe.id, equipe]));
      const aggregates = new Map<number, TeamAggregate>();

      for (const runner of rankingCorredores) {
        if (runner.equipe_id === null) continue;

        const equipe = equipePorId.get(runner.equipe_id);
        if (!equipe) continue;

        const current =
          aggregates.get(equipe.id) ??
          ({
            equipe_id: equipe.id,
            equipe_nome: equipe.nome,
            competicao_id: equipe.competicao_id,
            km_total: 0,
            tempo_segundos: null,
            pace_segundos_total: 0,
            pace_amostras: 0,
            corredores: new Set<number>(),
          } satisfies TeamAggregate);

        current.km_total += runner.km_total;
        current.corredores.add(runner.corredor_id);

        if (runner.pace_medio_segundos !== null) {
          current.pace_segundos_total += runner.pace_medio_segundos;
          current.pace_amostras += 1;
        }

        aggregates.set(equipe.id, current);
      }

      const ranking = Array.from(aggregates.values()).map((team) => {
        const paceMedioSegundos =
          team.pace_amostras > 0
            ? team.pace_segundos_total / team.pace_amostras
            : null;

        return {
          equipe_id: team.equipe_id,
          equipe_nome: team.equipe_nome,
          competicao_id: team.competicao_id,
          km_total: team.km_total,
          pace_medio: formatPace(paceMedioSegundos),
          pace_medio_segundos: paceMedioSegundos,
          corredores: team.corredores.size,
        };
      });

      return withPositions<RankingTeam>(ranking);
    },

    calcularPosicoes<
      T extends {
        posicao: number;
        km_total: number;
        pace_medio_segundos: number | null;
      },
    >(
      ranking: Omit<T, "posicao">[]
    ): T[] {
      return withPositions<T>(ranking);
    },

    calcularPaceMedio(tempo: string | null, km: number): number | null {
      const tempoSeconds = parseTimeToSeconds(tempo);
      return tempoSeconds !== null && km > 0 ? tempoSeconds / km : null;
    },
  };
}

export const rankingService = createRankingService();
