export interface ShareAthlete {
  id: number;
  name: string;
  team_name: string | null;
}

export interface ShareHighlight {
  type: "athlete" | "maior-km" | "menor-pace" | "manha" | "tarde" | "madrugada";
  title: string;
  subtitle: string;
  runnerName?: string;
  teamName?: string;
  distanceKm: number;
  pace: string | null;
  time: string | null;
  background: "fundo-1" | "fundo-2" | "fundo-3";
}

export interface SharePageData {
  competitionId: number;
  competitionName: string;
  athletes: ShareAthlete[];
  highlights: ShareHighlight[];
}
