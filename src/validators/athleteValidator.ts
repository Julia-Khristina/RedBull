import { CreateAthleteInput, UpdateAthleteInput } from "../models/athlete";
import { ValidationError } from "../errors/AppError";

const CPF_REGEX = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;
const VALID_STATUSES = ["corredor", "capitao"];

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

function readOptionalText(
  payload: Record<string, unknown>,
  field: string
): string {
  const value = payload[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ValidationError(`${field} não pode ser vazio`);
  }
  return value.trim();
}

export function validateCreateAthlete(payload: unknown): CreateAthleteInput {
  if (!isObject(payload)) {
    throw new ValidationError("Payload inválido");
  }

  const nome = readRequiredText(payload, "nome");

  const cpfRaw = readRequiredText(payload, "cpf");
  if (!CPF_REGEX.test(cpfRaw)) {
    throw new ValidationError("cpf inválido");
  }

  const email = readRequiredText(payload, "email");
  if (!email.includes("@")) {
    throw new ValidationError("email inválido");
  }

  const equipe_id =
    typeof payload.equipe_id === "number" &&
    Number.isInteger(payload.equipe_id) &&
    payload.equipe_id > 0
      ? payload.equipe_id
      : 0;

  const result: CreateAthleteInput = {
    nome,
    cpf: cpfRaw,
    email,
    equipe_id,
  };

  if ("telefone" in payload) {
    result.telefone = readOptionalText(payload, "telefone");
  }

  if ("status" in payload) {
    const status = readOptionalText(payload, "status");
    if (!VALID_STATUSES.includes(status)) {
      throw new ValidationError(
        `status deve ser '${VALID_STATUSES.join("' ou '")}'`
      );
    }
    result.status = status;
  }

  return result;
}

export function validateUpdateAthlete(payload: unknown): UpdateAthleteInput {
  if (!isObject(payload)) {
    throw new ValidationError("Payload inválido");
  }

  if ("cpf" in payload) {
    throw new ValidationError("CPF não pode ser alterado");
  }

  const result: UpdateAthleteInput = {};

  if ("nome" in payload) {
    result.nome = readOptionalText(payload, "nome");
  }

  if ("email" in payload) {
    const email = readOptionalText(payload, "email");
    if (!email.includes("@")) {
      throw new ValidationError("email inválido");
    }
    result.email = email;
  }

  if ("telefone" in payload) {
    result.telefone = readOptionalText(payload, "telefone");
  }

  if ("status" in payload) {
    const status = readOptionalText(payload, "status");
    if (!VALID_STATUSES.includes(status)) {
      throw new ValidationError(
        `status deve ser '${VALID_STATUSES.join("' ou '")}'`
      );
    }
    result.status = status;
  }

  if (Object.keys(result).length === 0) {
    throw new ValidationError("Nenhum campo informado para atualização");
  }

  return result;
}
