import { Checkpoint } from "../models/checkpoint";
import { RankingRunner, RankingTeam } from "../models/ranking";
import { ShareHighlight, ShareAthlete } from "../models/share";
import { checkpointService } from "./checkpointService";
import { rankingService } from "./rankingService";
import { competitionService } from "./competitionService";
import { teamService } from "./teamService";
import { runnerService } from "./runnerService";

function formatPace(seconds: number | null): string | null {
  if (seconds === null || !Number.isFinite(seconds)) return null;
  const rounded = Math.round(seconds);
  const minutes = Math.floor(rounded / 60);
  const remaining = String(rounded % 60).padStart(2, "0");
  return `${String(minutes).padStart(2, "0")}:${remaining}`;
}

function formatTime(seconds: number | null): string | null {
  if (seconds === null || !Number.isFinite(seconds)) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function getPeriodLabel(date: Date): "manha" | "tarde" | "madrugada" {
  const h = date.getHours();
  if (h >= 6 && h < 12) return "manha";
  if (h >= 12 && h < 18) return "tarde";
  return "madrugada";
}

export function createShareService() {
  async function getAthletes(teamId: number): Promise<ShareAthlete[]> {
    const runners = await runnerService.findByTeam(teamId);
    const athletes: ShareAthlete[] = runners.map((runner) => ({
      id: runner.id,
      name: runner.name,
      team_name: null,
    }));
    return athletes.sort((a, b) => a.name.localeCompare(b.name));
  }

  async function getAthleteHighlight(
    competitionId: number,
    runnerId: number
  ): Promise<ShareHighlight> {
    const runners = await rankingService.generateRunnerRanking(competitionId);
    const runner = runners.find((r) => r.id_runner === runnerId);
    const name = runner?.runner_name ?? "Atleta";
    const teamName = runner?.team_name ?? null;

    return {
      type: "athlete",
      title: "DESTAQUE DO ATLETA",
      subtitle: "RED BULL 24 HORAS",
      runnerName: name,
      teamName: teamName ?? undefined,
      distanceKm: runner?.total_distance_km ?? 0,
      pace: runner?.average_pace ?? null,
      time: null,
      background: "fundo-1",
    };
  }

  async function getMaiorKm(competitionId: number): Promise<ShareHighlight> {
    const runners = await rankingService.generateRunnerRanking(competitionId);
    const top = runners[0];
    return {
      type: "maior-km",
      title: "MAIOR QUILOMETRAGEM",
      subtitle: "RED BULL 24 HORAS",
      runnerName: top?.runner_name ?? "—",
      teamName: top?.team_name ?? undefined,
      distanceKm: top?.total_distance_km ?? 0,
      pace: top?.average_pace ?? null,
      time: null,
      background: "fundo-1",
    };
  }

  async function getMenorPace(competitionId: number): Promise<ShareHighlight> {
    const runners = await rankingService.generateRunnerRanking(competitionId);
    const sorted = [...runners].sort(
      (a, b) => (a.average_pace_seconds ?? Infinity) - (b.average_pace_seconds ?? Infinity)
    );
    const top = sorted[0];
    return {
      type: "menor-pace",
      title: "MENOR PACE MÉDIO",
      subtitle: "RED BULL 24 HORAS",
      runnerName: top?.runner_name ?? "—",
      teamName: top?.team_name ?? undefined,
      distanceKm: top?.total_distance_km ?? 0,
      pace: top?.average_pace ?? null,
      time: null,
      background: "fundo-1",
    };
  }

  async function getPeriodHighlight(
    competitionId: number,
    period: "manha" | "tarde" | "madrugada"
  ): Promise<ShareHighlight> {
    const checkpoints = await checkpointService.findByCompetition(competitionId);
    const periodCheckpoints = checkpoints.filter((cp) => {
      if (!cp.created_at) return false;
      const d = new Date(cp.created_at);
      return getPeriodLabel(d) === period;
    });

    const runnerKm = new Map<number, { name: string | null; team: string | null; km: number }>();
    for (const cp of periodCheckpoints) {
      const id = cp.id_runner;
      const existing = runnerKm.get(id) ?? {
        name: cp.runner?.name ?? null,
        team: cp.runner?.id_team != null ? null : null,
        km: 0,
      };
      existing.km += cp.distance_km;
      if (cp.runner?.name) existing.name = cp.runner.name;
      if (cp.runner?.id_team != null && !existing.team) {
        const teams = await teamService.findByCompetition(competitionId);
        const t = teams.find((t) => t.id === cp.runner!.id_team);
        existing.team = t?.name ?? null;
      }
      runnerKm.set(id, existing);
    }

    let topRunner: { name: string | null; team: string | null; km: number } | null = null;
    for (const entry of runnerKm.values()) {
      if (!topRunner || entry.km > topRunner.km) {
        topRunner = entry;
      }
    }

    const periodLabels: Record<string, string> = {
      manha: "PERÍODO DA MANHÃ",
      tarde: "PERÍODO DA TARDE",
      madrugada: "PERÍODO DA MADRUGADA",
    };

    return {
      type: period,
      title: `${periodLabels[period]} - ATLETA DESTAQUE`,
      subtitle: "RED BULL 24 HORAS",
      runnerName: topRunner?.name ?? "—",
      teamName: topRunner?.team ?? undefined,
      distanceKm: topRunner?.km ?? 0,
      pace: null,
      time: null,
      background: period === "manha" || period === "tarde" ? "fundo-2" : "fundo-3",
    };
  }

  return {
    async getHighlights(competitionId: number): Promise<ShareHighlight[]> {
      const [maiorKm, menorPace, manha, tarde, madrugada] = await Promise.all([
        getMaiorKm(competitionId),
        getMenorPace(competitionId),
        getPeriodHighlight(competitionId, "manha"),
        getPeriodHighlight(competitionId, "tarde"),
        getPeriodHighlight(competitionId, "madrugada"),
      ]);
      return [maiorKm, menorPace, manha, tarde, madrugada];
    },

    async getAthleteHighlight(competitionId: number, runnerId: number): Promise<ShareHighlight> {
      return getAthleteHighlight(competitionId, runnerId);
    },

      async getAthletes(teamId: number): Promise<ShareAthlete[]> {
        return getAthletes(teamId);
      },

    async getCompetitionName(competitionId: number): Promise<string> {
      const comp = await competitionService.findById(competitionId);
      return comp?.name ?? "Red Bull 24 Horas";
    },
  };
}

export const shareService = createShareService();
