import { z } from "zod";
import { MetricResult } from "../models/ocr";

const metricSchema = z.object({
  distanceKm: z.union([z.string(), z.number()]),
  time: z.string(),
  speedKmh: z.union([z.string(), z.number()]).optional(),
});

export function normalizeDecimal(value: string | number): string {
  const raw = String(value)
    .trim()
    .replace(/\s+/g, "")
    .replace(/[Oo]/g, "0")
    .replace(/[Il|]/g, "1")
    .replace(/[，.]/g, ",");

  const match = raw.match(/\d+(?:,\d+)?/);
  if (!match) throw new Error(`Decimal invalido: ${value}`);

  const [whole, fraction = ""] = match[0].split(",");
  const decimals = fraction.padEnd(2, "0").slice(0, 2);
  return `${Number(whole)},${decimals}`;
}

export function normalizeTime(value: string): string {
  const raw = String(value)
    .trim()
    .replace(/\s+/g, "")
    .replace(/[Oo]/g, "0")
    .replace(/[Il|]/g, "1")
    .replace(/[;·]/g, ":");

  const match = raw.match(/(\d{1,3})[:.](\d{1,2})/);
  if (!match) throw new Error(`Tempo invalido: ${value}`);

  const minutes = String(Number(match[1]));
  const secondsRaw = match[2].padStart(2, "0");
  const seconds = secondsRaw.length > 2 ? secondsRaw.slice(0, 2) : secondsRaw;
  return `${minutes}:${seconds}`;
}

function parseDistanceKm(value: string): number {
  return Number(value.replace(",", "."));
}

function parseMetricTimeToSeconds(value: string): number {
  const parts = value.split(":").map(Number);
  if (parts.length !== 2 || parts.some((part) => !Number.isFinite(part))) {
    throw new Error(`Tempo invalido: ${value}`);
  }
  return parts[0] * 60 + parts[1];
}

export function calculateSpeedKmh(distanceKm: string, time: string): string {
  const distance = parseDistanceKm(distanceKm);
  const seconds = parseMetricTimeToSeconds(time);
  if (!Number.isFinite(distance) || distance <= 0 || seconds <= 0) {
    throw new Error("Nao foi possivel calcular velocidade media.");
  }

  const speed = distance / (seconds / 3600);
  return speed.toFixed(1).replace(".", ",");
}

export function normalizeMetricResult(input: unknown): MetricResult {
  const parsed = metricSchema.parse(input);
  const distanceKm = normalizeDecimal(parsed.distanceKm);
  const time = normalizeTime(parsed.time);
  return {
    distanceKm,
    time,
    speedKmh: calculateSpeedKmh(distanceKm, time),
  };
}

export function extractJsonObject(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1] ?? text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Resposta sem JSON: ${text}`);
  }
  return JSON.parse(candidate.slice(start, end + 1));
}
