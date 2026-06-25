import { CompetitionStatus } from "./competition";

export interface TvPanelTopTeam {
  position: number;
  id_team: number;
  team_name: string;
  total_distance_km: number;
  average_pace: string | null;
  average_pace_seconds: number | null;
}

export interface TvPanelMetrics {
  average_pace_overall: string | null;
  average_pace_overall_seconds: number | null;
  elapsed_time: string | null;
  elapsed_time_seconds: number | null;
  total_distance_km: number;
  top_teams: TvPanelTopTeam[];
}

export interface TvPanelResponse {
  id_competition: number;
  competition_name: string;
  competition_status: CompetitionStatus;
  metrics: TvPanelMetrics;
  generated_at: string;
}
