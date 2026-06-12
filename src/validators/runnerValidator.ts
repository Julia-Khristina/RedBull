import { CreateRunnerInput, UpdateRunnerInput } from "../models/runner";
import { ValidationError } from "../errors/AppError";

const CPF_REGEX = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;
const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const VALID_STATUSES = ["runner", "captain"];

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

function normalizeCpf(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 11) {
    throw new ValidationError("cpf inválido");
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(
    6,
    9
  )}-${digits.slice(9)}`;
}

export function validateCreateRunner(payload: unknown): CreateRunnerInput {
  if (!isObject(payload)) {
    throw new ValidationError("Payload inválido");
  }

  const name = readRequiredText(payload, "name");

  const cpfRaw = readRequiredText(payload, "cpf");
  if (!CPF_REGEX.test(cpfRaw)) {
    throw new ValidationError("cpf inválido");
  }
  const cpf = normalizeCpf(cpfRaw);

  const email = readRequiredText(payload, "email");
  if (!EMAIL_REGEX.test(email)) {
    throw new ValidationError("email inválido");
  }

  const id_team =
    typeof payload.id_team === "number" &&
    Number.isInteger(payload.id_team) &&
    payload.id_team > 0
      ? payload.id_team
      : 0;

  const result: CreateRunnerInput = {
    name,
    cpf,
    email,
    id_team,
  };

  if ("phone" in payload) {
    result.phone = readOptionalText(payload, "phone");
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

export function validateUpdateRunner(payload: unknown): UpdateRunnerInput {
  if (!isObject(payload)) {
    throw new ValidationError("Payload inválido");
  }

  if ("cpf" in payload) {
    throw new ValidationError("CPF não pode ser alterado");
  }

  const result: UpdateRunnerInput = {};

  if ("name" in payload) {
    result.name = readOptionalText(payload, "name");
  }

  if ("email" in payload) {
    const email = readOptionalText(payload, "email");
    if (!EMAIL_REGEX.test(email)) {
      throw new ValidationError("email inválido");
    }
    result.email = email;
  }

  if ("phone" in payload) {
    result.phone = readOptionalText(payload, "phone");
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
