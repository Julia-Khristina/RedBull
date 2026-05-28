import {
      CreateCheckpointInput,
        UpdateCheckpointInput,
        } from "../models/checkpoint";
        import { ValidationError } from "../errors/AppError";

        function isObject(value: unknown): value is Record<string, unknown> {
          return typeof value === "object" && value !== null && !Array.isArray(value);
          }

          function readRequiredText(
            payload: Record<string, unknown>,
              field: string
              ): string {
                const value = payload[field];
                  if (typeof value !== "string" || value.trim().length === 0) {
                      throw new ValidationError(`${field} é obrigatório`);
                        }
                          return value.trim();
                          }

                          function readRequiredPositiveNumber(
                            payload: Record<string, unknown>,
                              field: string
                              ): number {
                                const value = payload[field];
                                  if (typeof value !== "number" || isNaN(value) || value < 0) {
                                      throw new ValidationError(`${field} deve ser um número não negativo`);
                                        }
                                          return value;
                                          }

                                          function readRequiredPositiveInteger(
                                            payload: Record<string, unknown>,
                                              field: string
                                              ): number {
                                                const value = payload[field];
                                                  if (
                                                      typeof value !== "number" ||
                                                          !Number.isInteger(value) ||
                                                              value <= 0
                                                                ) {
                                                                    throw new ValidationError(
                                                                          `${field} deve ser um número inteiro positivo`
                                                                              );
                                                                                }
                                                                                  return value;
                                                                                  }

                                                                                  export function validateCreateCheckpoint(
                                                                                    payload: unknown
                                                                                    ): CreateCheckpointInput {
                                                                                      if (!isObject(payload)) {
                                                                                          throw new ValidationError("Payload inválido");
                                                                                            }

                                                                                              const identificador = readRequiredText(payload, "identificador");
                                                                                                const km = readRequiredPositiveNumber(payload, "km");
                                                                                                  const corredor_id = readRequiredPositiveInteger(payload, "corredor_id");
                                                                                                    const competicao_id = readRequiredPositiveInteger(payload, "competicao_id");
                                                                                                      const esteira_id = readRequiredPositiveInteger(payload, "esteira_id");
                                                                                                        const administrador_id = readRequiredPositiveInteger(
                                                                                                            payload,
                                                                                                                "administrador_id"
                                                                                                                  );

                                                                                                                    const result: CreateCheckpointInput = {
                                                                                                                        identificador,
                                                                                                                            km,
                                                                                                                                corredor_id,
                                                                                                                                    competicao_id,
                                                                                                                                        esteira_id,
                                                                                                                                            administrador_id,
                                                                                                                                              };

                                                                                                                                                if ("pace" in payload) {
                                                                                                                                                    const pace = payload["pace"];
                                                                                                                                                        if (typeof pace !== "string" || pace.trim().length === 0) {
                                                                                                                                                              throw new ValidationError("pace não pode ser vazio");
                                                                                                                                                                  }
                                                                                                                                                                      result.pace = pace.trim();
                                                                                                                                                                        }

                                                                                                                                                                          if ("tempo" in payload) {
                                                                                                                                                                              const tempo = payload["tempo"];
                                                                                                                                                                                  if (typeof tempo !== "string" || tempo.trim().length === 0) {
                                                                                                                                                                                        throw new ValidationError("tempo não pode ser vazio");
                                                                                                                                                                                            }
                                                                                                                                                                                                result.tempo = tempo.trim();
                                                                                                                                                                                                  }

                                                                                                                                                                                                    if ("imagem" in payload) {
                                                                                                                                                                                                        if (!isObject(payload["imagem"])) {
                                                                                                                                                                                                              throw new ValidationError("imagem deve ser um objeto JSON");
                                                                                                                                                                                                                  }
                                                                                                                                                                                                                      result.imagem = payload["imagem"] as Record<string, unknown>;
                                                                                                                                                                                                                        }

                                                                                                                                                                                                                          return result;
                                                                                                                                                                                                                          }

                                                                                                                                                                                                                          export function validateUpdateCheckpoint(
                                                                                                                                                                                                                            payload: unknown
                                                                                                                                                                                                                            ): UpdateCheckpointInput {
                                                                                                                                                                                                                              if (!isObject(payload)) {
                                                                                                                                                                                                                                  throw new ValidationError("Payload inválido");
                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                      const result: UpdateCheckpointInput = {};

                                                                                                                                                                                                                                        if ("km" in payload) {
                                                                                                                                                                                                                                            result.km = readRequiredPositiveNumber(payload, "km");
                                                                                                                                                                                                                                              }

                                                                                                                                                                                                                                                if ("pace" in payload) {
                                                                                                                                                                                                                                                    const pace = payload["pace"];
                                                                                                                                                                                                                                                        if (typeof pace !== "string" || pace.trim().length === 0) {
                                                                                                                                                                                                                                                              throw new ValidationError("pace não pode ser vazio");
                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                      result.pace = pace.trim();
                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                          if ("tempo" in payload) {
                                                                                                                                                                                                                                                                              const tempo = payload["tempo"];
                                                                                                                                                                                                                                                                                  if (typeof tempo !== "string" || tempo.trim().length === 0) {
                                                                                                                                                                                                                                                                                        throw new ValidationError("tempo não pode ser vazio");
                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                result.tempo = tempo.trim();
                                                                                                                                                                                                                                                                                                  }

                                                                                                                                                                                                                                                                                                    if ("imagem" in payload) {
                                                                                                                                                                                                                                                                                                        if (!isObject(payload["imagem"])) {
                                                                                                                                                                                                                                                                                                              throw new ValidationError("imagem deve ser um objeto JSON");
                                                                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                                                                      result.imagem = payload["imagem"] as Record<string, unknown>;
                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                          if (Object.keys(result).length === 0) {
                                                                                                                                                                                                                                                                                                                              throw new ValidationError("Nenhum campo informado para atualização");
                                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                                  return result;
                                                                                                                                                                                                                                                                                                                                  }
