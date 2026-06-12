import { getSupabaseClient } from "../database/supabaseClient";
import { Admin, AdminInput } from "../models/admin";

const SELECT_COLUMNS = "id, name, email, area, password, created_at";

export const adminRepository = {
  async findAll(): Promise<Admin[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("admin").select(SELECT_COLUMNS);

    if (error) {
      throw new Error(`Erro ao buscar administradores: ${error.message}`);
    }

    return (data ?? []) as unknown as Admin[];
  },

  async findById(id: number): Promise<Admin | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("admin")
      .select(SELECT_COLUMNS)
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Erro ao buscar administrador: ${error.message}`);
    }

    return data as unknown as Admin | null;
  },

  async findByEmail(email: string): Promise<Admin | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("admin")
      .select(SELECT_COLUMNS)
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Erro ao buscar administrador por email: ${error.message}`);
    }

    return data as unknown as Admin | null;
  },

  async create(input: AdminInput): Promise<Admin> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("admin")
      .insert([{
        name: input.name,
        email: input.email,
        area: input.area,
        password: input.password,
      }])
      .select(SELECT_COLUMNS)
      .single();

    if (error) {
      throw new Error(`Erro ao criar administrador: ${error.message}`);
    }

    return data as unknown as Admin;
  },

  async update(id: number, input: Partial<AdminInput>): Promise<Admin | null> {
    const supabase = getSupabaseClient();
    const payload: Record<string, unknown> = {};
    if (input.name !== undefined) payload.name = input.name;
    if (input.email !== undefined) payload.email = input.email;
    if (input.area !== undefined) payload.area = input.area;
    if (input.password !== undefined) payload.password = input.password;

    const { data, error } = await supabase
      .from("admin")
      .update(payload)
      .eq("id", id)
      .select(SELECT_COLUMNS)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Erro ao atualizar administrador: ${error.message}`);
    }

    return data as unknown as Admin | null;
  },

  async delete(id: number): Promise<boolean> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("admin").delete().eq("id", id);

    if (error) {
      throw new Error(`Erro ao deletar administrador: ${error.message}`);
    }

    return true;
  },
};
