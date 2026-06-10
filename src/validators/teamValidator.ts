import { CreateTeamInput, UpdateTeamInput } from "../models/team";
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

function readPositiveInteger(
  payload: Record<string, unknown>,
  field: string
): number {
  const value = payload[field];

  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    throw new ValidationError(`${field} deve ser um número inteiro positivo`);
  }

  return value;
}

export function validateCreateTeam(payload: unknown): CreateTeamInput {
  if (!isObject(payload)) {
    throw new ValidationError("Payload inválido");
  }

  const name = readRequiredText(payload, "name");
  const id_competition = readPositiveInteger(payload, "id_competition");

  return {
    name,
    id_competition,
  };
}

export function validateUpdateTeam(payload: unknown): UpdateTeamInput {
  if (!isObject(payload)) {
    throw new ValidationError("Payload inválido");
  }

  const result: UpdateTeamInput = {};

  if ("name" in payload) {
    result.name = readRequiredText(payload, "name");
  }

  if (Object.keys(result).length === 0) {
    throw new ValidationError("Nenhum campo informado para atualização");
  }

  return result;
}
