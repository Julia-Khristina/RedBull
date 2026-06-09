export interface CompetitionReport {
  id_competition: number;
  summary: Record<string, unknown>;
  highlights: Record<string, unknown>;
  generated_at: string;
}

export interface ReportRepository {
  generateCompetitionReport(
    competitionId: number
  ): Promise<CompetitionReport | null>;
}
