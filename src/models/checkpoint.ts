export interface Checkpoint {
      id: number;
        identificador: string;
          km: number;
            pace: string | null;
              tempo: string | null;
                imagem: Record<string, unknown> | null;
                  corredor_id: number;
                    competicao_id: number;
                      esteira_id: number;
                        administrador_id: number;
                          criado_em: string;
                          }

                          export interface CreateCheckpointInput {
                            identificador: string;
                              km: number;
                                pace?: string;
                                  tempo?: string;
                                    imagem?: Record<string, unknown>;
                                      corredor_id: number;
                                        competicao_id: number;
                                          esteira_id: number;
                                            administrador_id: number;
                                            }

                                            export interface UpdateCheckpointInput {
                                              km?: number;
                                                pace?: string;
                                                  tempo?: string;
                                                    imagem?: Record<string, unknown>;
                                                    }

                                                    export interface CheckpointRepository {
                                                      create(input: CreateCheckpointInput): Promise<Checkpoint>;
                                                        findAll(): Promise<Checkpoint[]>;
                                                          findById(id: number): Promise<Checkpoint | null>;
                                                            findByCorredor(corredor_id: number): Promise<Checkpoint[]>;
                                                              findByCompeticao(competicao_id: number): Promise<Checkpoint[]>;
                                                                update(id: number, input: UpdateCheckpointInput): Promise<Checkpoint | null>;
                                                                  delete(id: number): Promise<boolean>;
                                                                  }
}