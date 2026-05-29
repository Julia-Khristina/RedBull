import {
  Competition,
  CompetitionRepository,
  CreateCompetitionInput,
  UpdateCompetitionInput,
} from "../models/competition";
import { getSupabaseClient } from "../database/supabaseClient";

const competitionSelect = "id, nome, endereco, data, status, criado_em";

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
      .select(competitionSelect)
      .single();

    if (error) {
      throw error;
    }

    return data as Competition;
  },

  async findAll(): Promise<Competition[]> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("competicao")
      .select(competitionSelect)
      .order("data", { ascending: true })
      .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    return data as Competition[];
  },

  async findById(id: number): Promise<Competition | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("competicao")
      .select(competitionSelect)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as Competition | null;
  },

  async update(
    id: number,
    input: UpdateCompetitionInput
  ): Promise<Competition | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("competicao")
      .update({
        nome: input.nome,
        data: input.data,
        endereco: input.endereco,
      })
      .eq("id", id)
      .select(competitionSelect)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as Competition | null;
  },

  async delete(id: number): Promise<boolean> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("competicao")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data !== null;
  },

  async close(id: number): Promise<Competition | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("competicao")
      .update({ status: "encerrada" })
      .eq("id", id)
      .select(competitionSelect)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as Competition | null;
  },
};
