import { getSupabaseClient } from "../database/supabaseClient";
import { Admin, AdminInput } from "../models/admin";

const SELECT_COLUMNS = "id, nome:name, email, area, senha:password, criado_em:created_at";

export const adminRepository = {
  async findAll(): Promise<Admin[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("administradores").select(SELECT_COLUMNS);

    if (error) {
      throw new Error(`Erro ao buscar administradores: ${error.message}`);
    }

    return (data ?? []) as unknown as Admin[];
  },

  async findById(id: number): Promise<Admin | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("administradores")
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
      .from("administradores")
      .select(SELECT_COLUMNS)
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Erro ao buscar administrador por email: ${error.message}`);
    }

    return data as unknown as Admin | null;
  },

  async create(dados: AdminInput): Promise<Admin> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("administradores")
      .insert([{
        nome: dados.name,
        email: dados.email,
        area: dados.area,
        senha: dados.password,
      }])
      .select(SELECT_COLUMNS)
      .single();

    if (error) {
      throw new Error(`Erro ao criar administrador: ${error.message}`);
    }

    return data as unknown as Admin;
  },

  async update(id: number, dados: Partial<AdminInput>): Promise<Admin | null> {
    const supabase = getSupabaseClient();
    const payload: Record<string, unknown> = {};
    if (dados.name !== undefined) payload.nome = dados.name;
    if (dados.email !== undefined) payload.email = dados.email;
    if (dados.area !== undefined) payload.area = dados.area;
    if (dados.password !== undefined) payload.senha = dados.password;

    const { data, error } = await supabase
      .from("administradores")
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
    const { error } = await supabase.from("administradores").delete().eq("id", id);

    if (error) {
      throw new Error(`Erro ao deletar administrador: ${error.message}`);
    }

    return true;
  },
};
