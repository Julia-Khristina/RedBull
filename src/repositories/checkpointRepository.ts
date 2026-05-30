import {
      Checkpoint,
        CheckpointRepository,
          CreateCheckpointInput,
            UpdateCheckpointInput,
            } from "../models/checkpoint";
            import { getSupabaseClient } from "../database/supabaseClient";

const SELECT_COLUMNS =
              "id, identificador, km, pace, tempo, imagem, corredor_id, competicao_id, esteira_id, administrador_id, criado_em, corredor:corredor_id(id, nome, equipe_id)";

type SupabaseCheckpoint = Omit<Checkpoint, "corredor"> & {
  corredor?: Checkpoint["corredor"] | Checkpoint["corredor"][];
};

function normalizeCheckpoint(data: SupabaseCheckpoint): Checkpoint {
  const corredor = Array.isArray(data.corredor)
    ? data.corredor[0] ?? null
    : data.corredor ?? null;

  return { ...data, corredor };
}

function normalizeCheckpoints(data: SupabaseCheckpoint[] | null): Checkpoint[] {
  return (data ?? []).map(normalizeCheckpoint);
}

              export const checkpointRepository: CheckpointRepository = {
                async create(input: CreateCheckpointInput): Promise<Checkpoint> {
                    const supabase = getSupabaseClient();

                        const payload: Record<string, unknown> = {
                              identificador: input.identificador,
                                    km: input.km,
                                          corredor_id: input.corredor_id,
                                                competicao_id: input.competicao_id,
                                                      esteira_id: input.esteira_id,
                                                            administrador_id: input.administrador_id,
                                                                };
                                                                    if (input.pace !== undefined) payload.pace = input.pace;
                                                                        if (input.tempo !== undefined) payload.tempo = input.tempo;
                                                                            if (input.imagem !== undefined) payload.imagem = input.imagem;

                                                                                const { data, error } = await supabase
                                                                                      .from("checkpoint")
                                                                                            .insert(payload)
                                                                                                  .select(SELECT_COLUMNS)
                                                                                                        .single();

                                                                                                            if (error) throw error;

                                                                                                                return normalizeCheckpoint(data as unknown as SupabaseCheckpoint);
                                                                                                                  },

                                                                                                                    async findAll(): Promise<Checkpoint[]> {
                                                                                                                        const supabase = getSupabaseClient();

                                                                                                                            const { data, error } = await supabase
                                                                                                                                  .from("checkpoint")
                                                                                                                                        .select(SELECT_COLUMNS)
                                                                                                                                              .order("id", { ascending: true });

                                                                                                                                                  if (error) throw error;

                                                                                                                                                      return normalizeCheckpoints(data as unknown as SupabaseCheckpoint[]);
                                                                                                                                                        },

                                                                                                                                                          async findById(id: number): Promise<Checkpoint | null> {
                                                                                                                                                              const supabase = getSupabaseClient();

                                                                                                                                                                  const { data, error } = await supabase
                                                                                                                                                                        .from("checkpoint")
                                                                                                                                                                              .select(SELECT_COLUMNS)
                                                                                                                                                                                    .eq("id", id)
                                                                                                                                                                                          .maybeSingle();

                                                                                                                                                                                              if (error) throw error;

                                                                                                                                                                                                  return data ? normalizeCheckpoint(data as unknown as SupabaseCheckpoint) : null;
                                                                                                                                                                                                    },

                                                                                                                                                                                                      async findByCorredor(corredor_id: number): Promise<Checkpoint[]> {
                                                                                                                                                                                                          const supabase = getSupabaseClient();

                                                                                                                                                                                                              const { data, error } = await supabase
                                                                                                                                                                                                                    .from("checkpoint")
                                                                                                                                                                                                                          .select(SELECT_COLUMNS)
                                                                                                                                                                                                                                .eq("corredor_id", corredor_id)
                                                                                                                                                                                                                                      .order("id", { ascending: true });

                                                                                                                                                                                                                                          if (error) throw error;

                                                                                                                                                                                                                                              return normalizeCheckpoints(data as unknown as SupabaseCheckpoint[]);
                                                                                                                                                                                                                                                },

                                                                                                                                                                                                                                                  async findByCompeticao(competicao_id: number): Promise<Checkpoint[]> {
                                                                                                                                                                                                                                                      const supabase = getSupabaseClient();

                                                                                                                                                                                                                                                          const { data, error } = await supabase
                                                                                                                                                                                                                                                                .from("checkpoint")
                                                                                                                                                                                                                                                                      .select(SELECT_COLUMNS)
                                                                                                                                                                                                                                                                            .eq("competicao_id", competicao_id)
                                                                                                                                                                                                                                                                                  .order("id", { ascending: true });

                                                                                                                                                                                                                                                                                      if (error) throw error;

                                                                                                                                                                                                                                                                                          return normalizeCheckpoints(data as unknown as SupabaseCheckpoint[]);
                                                                                                                                                                                                                                                                                            },

                                                                                                                                                                                                                                                                                              async update(
                                                                                                                                                                                                                                                                                                  id: number,
                                                                                                                                                                                                                                                                                                      input: UpdateCheckpointInput
                                                                                                                                                                                                                                                                                                        ): Promise<Checkpoint | null> {
                                                                                                                                                                                                                                                                                                            const supabase = getSupabaseClient();

                                                                                                                                                                                                                                                                                                                const payload: Record<string, unknown> = {};
                                                                                                                                                                                                                                                                                                                    if (input.km !== undefined) payload.km = input.km;
                                                                                                                                                                                                                                                                                                                        if (input.pace !== undefined) payload.pace = input.pace;
                                                                                                                                                                                                                                                                                                                            if (input.tempo !== undefined) payload.tempo = input.tempo;
                                                                                                                                                                                                                                                                                                                                if (input.imagem !== undefined) payload.imagem = input.imagem;

                                                                                                                                                                                                                                                                                                                                    const { data, error } = await supabase
                                                                                                                                                                                                                                                                                                                                          .from("checkpoint")
                                                                                                                                                                                                                                                                                                                                                .update(payload)
                                                                                                                                                                                                                                                                                                                                                      .eq("id", id)
                                                                                                                                                                                                                                                                                                                                                            .select(SELECT_COLUMNS)
                                                                                                                                                                                                                                                                                                                                                                  .maybeSingle();

                                                                                                                                                                                                                                                                                                                                                                      if (error) throw error;

                                                                                                                                                                                                                                                                                                                                                                          return data ? normalizeCheckpoint(data as unknown as SupabaseCheckpoint) : null;
                                                                                                                                                                                                                                                                                                                                                                            },

                                                                                                                                                                                                                                                                                                                                                                              async delete(id: number): Promise<boolean> {
                                                                                                                                                                                                                                                                                                                                                                                  const supabase = getSupabaseClient();

                                                                                                                                                                                                                                                                                                                                                                                      const { data, error } = await supabase
                                                                                                                                                                                                                                                                                                                                                                                            .from("checkpoint")
                                                                                                                                                                                                                                                                                                                                                                                                  .delete()
                                                                                                                                                                                                                                                                                                                                                                                                        .eq("id", id)
                                                                                                                                                                                                                                                                                                                                                                                                              .select("id");

                                                                                                                                                                                                                                                                                                                                                                                                                  if (error) throw error;

                                                                                                                                                                                                                                                                                                                                                                                                                      return (data ?? []).length > 0;
                                                                                                                                                                                                                                                                                                                                                                                                                        },
                                                                                                                                                                                                                                                                                                                                                                                                                        };
