import { Checkpoint } from "./checkpoint";
import { Competition } from "./competition";
import { RankingRunner, RankingTeam } from "./ranking";

export interface CompetitionReport {
  id_competition: number;
  summary: Record<string, unknown>;
  highlights: Record<string, unknown>;
  generated_at: string;
}

export interface CompetitionReportView extends CompetitionReport {
  competition: Competition;
  checkpoints: Checkpoint[];
  teamRanking: RankingTeam[];
  runnerRanking: RankingRunner[];
  persisted: boolean;
}

export interface ReportRepository {
  generateCompetitionReport(
    competitionId: number
  ): Promise<CompetitionReport | null>;
}
