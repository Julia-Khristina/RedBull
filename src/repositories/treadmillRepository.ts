import {
  CreateTreadmillInput,
  Treadmill,
  TreadmillRepository,
} from "../models/treadmill";
import { getSupabaseClient } from "../database/supabaseClient";

const SELECT_COLUMNS = "id, name, specification, created_at";

export const treadmillRepository: TreadmillRepository = {
  async create(input: CreateTreadmillInput): Promise<Treadmill> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("treadmill")
      .insert({
        name: input.name,
        specification: input.specification ?? null,
      })
      .select(SELECT_COLUMNS)
      .single();

    if (error) throw error;

    return data as unknown as Treadmill;
  },

  async findFirst(): Promise<Treadmill | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("treadmill")
      .select(SELECT_COLUMNS)
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    return data as unknown as Treadmill | null;
  },
};
