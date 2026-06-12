export interface RankingRunner {
  position: number;
  id_runner: number;
  runner_name: string | null;
  id_team: number | null;
  team_name?: string | null;
  last_checkpoint?: string | null;
  treadmill_time?: string | null;
  total_distance_km: number;
  average_pace: string | null;
  average_pace_seconds: number | null;
}

export interface RankingTeam {
  position: number;
  id_team: number;
  team_name: string;
  id_competition: number;
  total_distance_km: number;
  average_pace: string | null;
  average_pace_seconds: number | null;
  runner_count: number;
}
