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
    throw new ValidationError(`${field} e obrigatorio`);
  }
  return value.trim();
}

function readRequiredPositiveNumber(
  payload: Record<string, unknown>,
  field: string
): number {
  const value = payload[field];
  if (typeof value !== "number" || isNaN(value) || value < 0) {
    throw new ValidationError(`${field} deve ser um numero nao negativo`);
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
      `${field} deve ser um numero inteiro positivo`
    );
  }
  return value;
}

function readOptionalPace(
  payload: Record<string, unknown>,
  field: string
): string | undefined {
  if (!(field in payload)) return undefined;

  const pace = payload[field];
  if (typeof pace !== "string" || pace.trim().length === 0) {
    throw new ValidationError("pace nao pode ser vazio");
  }

  const normalized = pace.trim();
  if (!/^[0-9]{1,2}:[0-9]{2}\/km$/.test(normalized)) {
    throw new ValidationError("pace deve estar no formato mm:ss/km");
  }

  return normalized;
}

function readOptionalTime(
  payload: Record<string, unknown>,
  field: string
): string | undefined {
  if (!(field in payload)) return undefined;

  const time = payload[field];
  if (typeof time !== "string" || time.trim().length === 0) {
    throw new ValidationError("time nao pode ser vazio");
  }

  const normalized = time.trim();
  if (!/^[0-9]{2}:[0-9]{2}:[0-9]{2}$/.test(normalized)) {
    throw new ValidationError("time deve estar no formato hh:mm:ss");
  }

  return normalized;
}

export function validateCreateCheckpoint(
  payload: unknown
): CreateCheckpointInput {
  if (!isObject(payload)) {
    throw new ValidationError("Payload invalido");
  }

  const identifier = readRequiredText(payload, "identifier");
  const distance_km = readRequiredPositiveNumber(payload, "distance_km");
  const id_runner = readRequiredPositiveInteger(payload, "id_runner");
  const id_competition = readRequiredPositiveInteger(payload, "id_competition");
  const id_admin = readRequiredPositiveInteger(payload, "id_admin");

  const result: CreateCheckpointInput = {
    identifier,
    distance_km,
    id_runner,
    id_competition,
    id_admin,
  };

  const pace = readOptionalPace(payload, "pace");
  if (pace !== undefined) result.pace = pace;

  const time = readOptionalTime(payload, "time");
  if (time !== undefined) result.time = time;

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
    throw new ValidationError("Payload invalido");
  }

  const result: UpdateCheckpointInput = {};

  if ("distance_km" in payload) {
    result.distance_km = readRequiredPositiveNumber(payload, "distance_km");
  }

  const pace = readOptionalPace(payload, "pace");
  if (pace !== undefined) result.pace = pace;

  const time = readOptionalTime(payload, "time");
  if (time !== undefined) result.time = time;

  if ("image" in payload) {
    if (!isObject(payload["image"])) {
      throw new ValidationError("image deve ser um objeto JSON");
    }
    result.image = payload["image"] as Record<string, unknown>;
  }

  if (Object.keys(result).length === 0) {
    throw new ValidationError("Nenhum campo informado para atualizacao");
  }

  return result;
}
