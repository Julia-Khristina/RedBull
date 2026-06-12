import { Runner } from "./runner";
import { Checkpoint } from "./checkpoint";
import { Competition } from "./competition";
import { RankingRunner, RankingTeam } from "./ranking";
import { Team } from "./team";

export interface CompetitionExportData {
  competition: Competition;
  teams: Team[];
  runners: Runner[];
  checkpoints: Checkpoint[];
}

export interface CompetitionExport {
  exported_at: string;
  competition: Competition;
  teams: Team[];
  runners: Runner[];
  checkpoints: Checkpoint[];
  rankings: {
    teams: RankingTeam[];
    runners: RankingRunner[];
  };
}

export interface ExportRepository {
  findCompetitionExportData(
    competitionId: number
  ): Promise<CompetitionExportData | null>;
}
