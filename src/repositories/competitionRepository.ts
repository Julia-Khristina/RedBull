import {
  Competition,
  CompetitionRepository,
  CreateCompetitionInput,
  UpdateCompetitionInput,
} from "../models/competition";
import { getSupabaseClient } from "../database/supabaseClient";

const competitionSelect =
  "id, name, address, date, status, created_at, started_at";

export const competitionRepository: CompetitionRepository = {
  async create(input: CreateCompetitionInput): Promise<Competition> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("competition")
      .insert({
        name: input.name,
        date: input.date,
        address: input.address,
        status: "not_started",
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
      .from("competition")
      .select(competitionSelect)
      .order("date", { ascending: true })
      .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []) as unknown as Competition[];
  },

  async findById(id: number): Promise<Competition | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("competition")
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
      .from("competition")
      .update({
        name: input.name,
        date: input.date,
        address: input.address,
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
      .from("competition")
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
      .from("competition")
      .update({ status: "closed" })
      .eq("id", id)
      .select(competitionSelect)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as unknown as Competition | null;
  },

  async activate(id: number): Promise<Competition | null> {
    const supabase = getSupabaseClient();

    /* started_at = NOW() é o marco zero do countdown de 24h do Painel TV
       (US19 #519). Sem ele, a contagem regressiva exibida na TV não tem
       referência. Setado apenas aqui — close() preserva o valor. */
    const { data, error } = await supabase
      .from("competition")
      .update({
        status: "in_progress",
        started_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(competitionSelect)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as unknown as Competition | null;
  },
};
