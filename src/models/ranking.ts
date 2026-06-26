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
  total_turns: number;
  total_checkpoints: number;
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
  average_time_per_turn: string | null;
  average_time_per_turn_seconds: number | null;
  total_turns: number;
}

export interface OperatorRanking {
  id_admin: number;
  admin_name: string | null;
  manual_checkpoints: number;
  ocr_checkpoints: number;
  total_checkpoints: number;
}
