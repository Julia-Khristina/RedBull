import {
  Competition,
  CompetitionRepository,
  CreateCompetitionInput,
  UpdateCompetitionInput,
} from "../models/competition";
import { getSupabaseClient } from "../database/supabaseClient";

const competitionSelect = "id, nome:name, endereco:address, data, status, criado_em:created_at";

export const competitionRepository: CompetitionRepository = {
  async create(input: CreateCompetitionInput): Promise<Competition> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("competicao")
      .insert({
        nome: input.name,
        data: input.date,
        endereco: input.address,
        status: "não iniciado",
      })
      .select(competitionSelect)
      .single();

    if (error) {
      throw error;
    }

    return data as unknown as Competition;
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

    return (data ?? []) as unknown as Competition[];
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

    return data as unknown as Competition | null;
  },

  async update(
    id: number,
    input: UpdateCompetitionInput
  ): Promise<Competition | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("competicao")
      .update({
        nome: input.name,
        data: input.date,
        endereco: input.address,
      })
      .eq("id", id)
      .select(competitionSelect)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as unknown as Competition | null;
  },

  async delete(id: number): Promise<boolean> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("competicao")
      .delete()
      .eq("id", id)
      .select("id");

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

    return data as unknown as Competition | null;
  },
};
