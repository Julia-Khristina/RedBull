import { Athlete } from "./athlete";
import { Checkpoint } from "./checkpoint";
import { Competition } from "./competition";
import { RankingRunner, RankingTeam } from "./ranking";
import { Team } from "./team";

export interface CompetitionExportData {
  competition: Competition;
  teams: Team[];
  athletes: Athlete[];
  checkpoints: Checkpoint[];
}

export interface CompetitionExport {
  exportedAt: string;
  competition: Competition;
  teams: Team[];
  athletes: Athlete[];
  checkpoints: Checkpoint[];
  rankings: {
    teams: RankingTeam[];
    athletes: RankingRunner[];
  };
}

export interface ExportRepository {
  findCompetitionExportData(
    competicaoId: number
  ): Promise<CompetitionExportData | null>;
}
