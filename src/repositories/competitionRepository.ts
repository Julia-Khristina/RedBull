import {
  Competition,
  CompetitionRepository,
  CreateCompetitionInput,
} from "../models/competition";
import { getSupabaseClient } from "../database/supabaseClient";

export const competitionRepository: CompetitionRepository = {
  async create(input: CreateCompetitionInput): Promise<Competition> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("competicao")
      .insert({
        nome: input.nome,
        data: input.data,
        endereco: input.endereco,
        status: "não iniciado",
      })
      .select("id, nome, endereco, data, status, criado_em")
      .single();

    if (error) {
      throw error;
    }

    return data as Competition;
  },
};
