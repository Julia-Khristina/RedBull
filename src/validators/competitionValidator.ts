import { CreateCompetitionInput, UpdateCompetitionInput } from "../models/competition";
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

  const name = readRequiredText(payload, "name");
  const date = readRequiredText(payload, "date");
  const address = readRequiredText(payload, "address");

  if (name.length > 100) {
    throw new ValidationError("name deve ter no máximo 100 caracteres");
  }

  if (address.length > 255) {
    throw new ValidationError("address deve ter no máximo 255 caracteres");
  }

  if (!isValidDate(date)) {
    throw new ValidationError("date deve ser uma data válida");
  }

  return {
    name,
    date,
    address,
  };
}

export function validateUpdateCompetition(
  payload: unknown
): UpdateCompetitionInput {
  return validateCreateCompetition(payload);
}

export function validateCompetitionId(id: unknown): number {
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0 || numericId > 32767) {
    throw new ValidationError("id da competição inválido");
  }

  return numericId;
}
