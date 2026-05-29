export interface RankingRunner {
  posicao: number;
  corredor_id: number;
  corredor_nome: string | null;
  equipe_id: number | null;
  km_total: number;
  pace_medio: string | null;
  pace_medio_segundos: number | null;
}

export interface RankingTeam {
  posicao: number;
  equipe_id: number;
  equipe_nome: string;
  competicao_id: number;
  km_total: number;
  pace_medio: string | null;
  pace_medio_segundos: number | null;
  corredores: number;
}
