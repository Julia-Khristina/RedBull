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

  const identifier = readRequiredText(payload, "identifier");
  const distance_km = readRequiredPositiveNumber(payload, "distance_km");
  const id_runner = readRequiredPositiveInteger(payload, "id_runner");
  const id_competition = readRequiredPositiveInteger(payload, "id_competition");
  const id_treadmill = readRequiredPositiveInteger(payload, "id_treadmill");
  const id_admin = readRequiredPositiveInteger(payload, "id_admin");

  const result: CreateCheckpointInput = {
    identifier,
    distance_km,
    id_runner,
    id_competition,
    id_treadmill,
    id_admin,
  };

  if ("pace" in payload) {
    const pace = payload["pace"];
    if (typeof pace !== "string" || pace.trim().length === 0) {
      throw new ValidationError("pace não pode ser vazio");
    }
    result.pace = pace.trim();
  }

  if ("time" in payload) {
    const time = payload["time"];
    if (typeof time !== "string" || time.trim().length === 0) {
      throw new ValidationError("time não pode ser vazio");
    }
    result.time = time.trim();
  }

  if ("image" in payload) {
    if (!isObject(payload["image"])) {
      throw new ValidationError("image deve ser um objeto JSON");
    }
    result.image = payload["image"] as Record<string, unknown>;
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

  if ("distance_km" in payload) {
    result.distance_km = readRequiredPositiveNumber(payload, "distance_km");
  }

  if ("pace" in payload) {
    const pace = payload["pace"];
    if (typeof pace !== "string" || pace.trim().length === 0) {
      throw new ValidationError("pace não pode ser vazio");
    }
    result.pace = pace.trim();
  }

  if ("time" in payload) {
    const time = payload["time"];
    if (typeof time !== "string" || time.trim().length === 0) {
      throw new ValidationError("time não pode ser vazio");
    }
    result.time = time.trim();
  }

  if ("image" in payload) {
    if (!isObject(payload["image"])) {
      throw new ValidationError("image deve ser um objeto JSON");
    }
    result.image = payload["image"] as Record<string, unknown>;
  }

  if (Object.keys(result).length === 0) {
    throw new ValidationError("Nenhum campo informado para atualização");
  }

  return result;
}
