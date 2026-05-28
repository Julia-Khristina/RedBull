import {
      Checkpoint,
        CheckpointRepository,
          CreateCheckpointInput,
            UpdateCheckpointInput,
            } from "../models/checkpoint";
            import { checkpointRepository } from "../repositories/checkpointRepository";
            import {
              validateCreateCheckpoint,
                validateUpdateCheckpoint,
                } from "../validators/checkpointValidator";
                import { NotFoundError, ConflictError } from "../errors/AppError";

                function isPgUniqueViolation(error: unknown): boolean {
                  return (
                      typeof error === "object" &&
                          error !== null &&
                              "code" in error &&
                                  (error as Record<string, unknown>).code === "23505"
                                    );
                                    }

                                    function isPgFkViolation(error: unknown): boolean {
                                      return (
                                          typeof error === "object" &&
                                              error !== null &&
                                                  "code" in error &&
                                                      (error as Record<string, unknown>).code === "23503"
                                                        );
                                                        }

                                                        export function createCheckpointService(
                                                          repository: CheckpointRepository = checkpointRepository
                                                          ) {
                                                            return {
                                                                async findAll(): Promise<Checkpoint[]> {
                                                                      return repository.findAll();
                                                                          },

                                                                              async findById(id: number): Promise<Checkpoint> {
                                                                                    const checkpoint = await repository.findById(id);
                                                                                          if (!checkpoint) {
                                                                                                  throw new NotFoundError(`Checkpoint ${id} não encontrado`);
                                                                                                        }
                                                                                                              return checkpoint;
                                                                                                                  },

                                                                                                                      async findByCorredor(corredor_id: number): Promise<Checkpoint[]> {
                                                                                                                            return repository.findByCorredor(corredor_id);
                                                                                                                                },

                                                                                                                                    async findByCompeticao(competicao_id: number): Promise<Checkpoint[]> {
                                                                                                                                          return repository.findByCompeticao(competicao_id);
                                                                                                                                              },

                                                                                                                                                  async create(payload: Partial<CreateCheckpointInput>): Promise<Checkpoint> {
                                                                                                                                                        const input = validateCreateCheckpoint(payload);

                                                                                                                                                              try {
                                                                                                                                                                      return await repository.create(input);
                                                                                                                                                                            } catch (error) {
                                                                                                                                                                                    if (isPgUniqueViolation(error)) {
                                                                                                                                                                                              throw new ConflictError(
                                                                                                                                                                                                          `Já existe um checkpoint com o identificador '${input.identificador}'`
                                                                                                                                                                                                                    );
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                    if (isPgFkViolation(error)) {
                                                                                                                                                                                                                                              throw new NotFoundError(
                                                                                                                                                                                                                                                          "Corredor, competição, esteira ou administrador não encontrado"
                                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                    throw error;
                                                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                                                              },

                                                                                                                                                                                                                                                                                                  async update(
                                                                                                                                                                                                                                                                                                        id: number,
                                                                                                                                                                                                                                                                                                              payload: Partial<UpdateCheckpointInput>
                                                                                                                                                                                                                                                                                                                  ): Promise<Checkpoint> {
                                                                                                                                                                                                                                                                                                                        const input = validateUpdateCheckpoint(payload);

                                                                                                                                                                                                                                                                                                                              const updated = await repository.update(id, input);
                                                                                                                                                                                                                                                                                                                                    if (!updated) {
                                                                                                                                                                                                                                                                                                                                            throw new NotFoundError(`Checkpoint ${id} não encontrado`);
                                                                                                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                                                                                                        return updated;
                                                                                                                                                                                                                                                                                                                                                            },

                                                                                                                                                                                                                                                                                                                                                                async delete(id: number): Promise<void> {
                                                                                                                                                                                                                                                                                                                                                                      const deleted = await repository.delete(id);
                                                                                                                                                                                                                                                                                                                                                                            if (!deleted) {
                                                                                                                                                                                                                                                                                                                                                                                    throw new NotFoundError(`Checkpoint ${id} não encontrado`);
                                                                                                                                                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                                                                                                                                                              },
                                                                                                                                                                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                                                                                                export const checkpointService = createCheckpointService();
}