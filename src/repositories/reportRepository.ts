import { CompetitionReport, ReportRepository } from "../models/report";
import { getSupabaseClient } from "../database/supabaseClient";

const SELECT_COLUMNS = "id_competition, summary, highlights, generated_at";

export const reportRepository: ReportRepository = {
  async generateCompetitionReport(
    competitionId: number
  ): Promise<CompetitionReport | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("competition_report")
      .select(SELECT_COLUMNS)
      .eq("id_competition", competitionId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as unknown as CompetitionReport | null;
  },
};
