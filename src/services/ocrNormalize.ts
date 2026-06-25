import { z } from "zod";
import { MetricResult } from "../models/ocr";

const metricSchema = z.object({
  distanceKm: z.union([z.string(), z.number()]).optional(),
  time: z.string().optional(),
  speedKmh: z.union([z.string(), z.number()]).optional(),
});

export function normalizeDecimal(value: string | number | undefined): string {
  if (value === undefined) return "0,00";
  const raw = String(value)
    .trim()
    .replace(/\s+/g, "")
    .replace(/[Oo]/g, "0")
    .replace(/[Il|]/g, "1")
    .replace(/[，.]/g, ",");

  const match = raw.match(/\d+(?:,\d+)?/);
  if (!match) return "0,00";

  const [whole, fraction = ""] = match[0].split(",");
  const decimals = fraction.padEnd(2, "0").slice(0, 2);
  return `${Number(whole)},${decimals}`;
}

export function normalizeTime(value: string | undefined): string {
  if (!value) return "00:00";
  const raw = String(value)
    .trim()
    .replace(/\s+/g, "")
    .replace(/[Oo]/g, "0")
    .replace(/[Il|]/g, "1")
    .replace(/[;·]/g, ":");

  // Suporta hh:mm:ss, mm:ss ou m.ss
  const match = raw.match(/^(?:(\d+):)?(\d{1,3})[:.](\d{1,2})$/);
  if (!match) {
    console.error(`[NormalizeError] Formato de tempo não reconhecido: ${value}`);
    return "00:00";
  }

  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const minutes = parseInt(match[2], 10);
  const secondsRaw = match[3].padStart(2, "0");
  const seconds = secondsRaw.length > 2 ? secondsRaw.slice(0, 2) : secondsRaw;

  const totalMinutes = (hours * 60) + minutes;
  return `${totalMinutes}:${seconds}`;
}

function parseDistanceKm(value: string): number {
  return Number(value.replace(",", "."));
}

function parseMetricTimeToSeconds(value: string): number {
  const parts = value.split(":").map(Number);
  if (parts.length !== 2 || parts.some((part) => !Number.isFinite(part))) {
    return 0;
  }
  return parts[0] * 60 + parts[1];
}

export function calculateSpeedKmh(distanceKm: string, time: string): string {
  const distance = parseDistanceKm(distanceKm);
  const seconds = parseMetricTimeToSeconds(time);
  if (!Number.isFinite(distance) || distance <= 0 || seconds <= 0) {
    return "0,0";
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
