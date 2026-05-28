import { getSupabaseClient } from "../database/supabaseClient";
import { Administrador, AdministradorInput } from "../models/administrador";

export const administradorRepository = {
  async findAll(): Promise<Administrador[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("administradores").select("*");

    if (error) {
      throw new Error(`Erro ao buscar administradores: ${error.message}`);
    }

    return data || [];
  },

  async findById(id: number): Promise<Administrador | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("administradores")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Erro ao buscar administrador: ${error.message}`);
    }

    return data || null;
  },

  async findByEmail(email: string): Promise<Administrador | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("administradores")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Erro ao buscar administrador por email: ${error.message}`);
    }

    return data || null;
  },

  async create(dados: AdministradorInput): Promise<Administrador> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("administradores")
      .insert([dados])
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar administrador: ${error.message}`);
    }

    return data;
  },

  async update(id: number, dados: Partial<AdministradorInput>): Promise<Administrador | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("administradores")
      .update(dados)
      .eq("id", id)
      .select()
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Erro ao atualizar administrador: ${error.message}`);
    }

    return data || null;
  },

  async delete(id: number): Promise<boolean> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("administradores").delete().eq("id", id);

    if (error) {
      throw new Error(`Erro ao deletar administrador: ${error.message}`);
    }

    return true;
  },
};
