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

function readRequiredDistanceKm(
  payload: Record<string, unknown>,
  field: string
): number {
  const value = readRequiredPositiveNumber(payload, field);
  if (value < 1.0 || value > 42.2) {
    throw new ValidationError(
      `${field} deve estar entre 1.0 km e 42.2 km (valor recebido: ${value})`
    );
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

function readOptionalPace(
  payload: Record<string, unknown>,
  field: string
): string | undefined {
  if (!(field in payload)) return undefined;

  const pace = payload[field];
  if (typeof pace !== "string" || pace.trim().length === 0) {
    throw new ValidationError("pace nao pode ser vazio");
  }

  const normalized = normalizePace(pace);
  if (!normalized) {
    throw new ValidationError("pace deve estar no formato mm:ss/km");
  }

  return normalized;
}

function normalizePace(pace: string): string | null {
  const match = pace
    .trim()
    .match(/^([0-9]+)(?:[:'])([0-9]{2})(?:''|")?(?:\s*\/\s*km)?$/i);

  if (!match) return null;

  const minutes = Number(match[1]);
  const seconds = Number(match[2]);
  if (!Number.isInteger(seconds) || seconds > 59) return null;

  const totalSeconds = minutes * 60 + seconds;
  if (totalSeconds < 180 || totalSeconds > 1200) {
    return null;
  }

  return `${match[1].padStart(2, "0")}:${match[2].padStart(2, "0")}/km`;
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
    throw new ValidationError("Payload inválido");
  }

  const identifier = readRequiredText(payload, "identifier");
  const distance_km = readRequiredDistanceKm(payload, "distance_km");
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
    throw new ValidationError("Payload inválido");
  }

  const result: UpdateCheckpointInput = {};

  if ("distance_km" in payload) {
    result.distance_km = readRequiredDistanceKm(payload, "distance_km");
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
    throw new ValidationError("Nenhum campo informado para atualização");
  }

  return result;
}
