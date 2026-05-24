import { CreateCompetitionInput } from "../models/competition";
import { ValidationError } from "../errors/AppError";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readRequiredText(
  payload: Record<string, unknown>,
  field: keyof CreateCompetitionInput
): string {
  const value = payload[field];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ValidationError(`${field} é obrigatório`);
  }

  return value.trim();
}

function isValidDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime());
}

export function validateCreateCompetition(
  payload: unknown
): CreateCompetitionInput {
  if (!isObject(payload)) {
    throw new ValidationError("Payload inválido");
  }

  const nome = readRequiredText(payload, "nome");
  const data = readRequiredText(payload, "data");
  const endereco = readRequiredText(payload, "endereco");

  if (!isValidDate(data)) {
    throw new ValidationError("data deve ser uma data válida");
  }

  return {
    nome,
    data,
    endereco,
  };
}
