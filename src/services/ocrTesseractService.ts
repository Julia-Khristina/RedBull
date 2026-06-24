import sharp from "sharp";
import { createWorker, Worker } from "tesseract.js";
import { MetricResult, OcrRegion } from "../models/ocr";
import {
  calculateSpeedKmh,
  normalizeDecimal,
  normalizeTime,
} from "./ocrNormalize";

type RegionBox = {
  name: OcrRegion["name"];
  label?: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

const regions: RegionBox[] = [
  { name: "top", left: 0.02, top: 0.04, width: 0.96, height: 0.18 },
  { name: "distance", label: "display", left: 0.16, top: 0.14, width: 0.22, height: 0.18 },
  { name: "distance", label: "circle", left: 0.06, top: 0.2, width: 0.32, height: 0.55 },
  { name: "time", left: 0.34, top: 0.18, width: 0.32, height: 0.56 },
  { name: "speed", label: "circle", left: 0.63, top: 0.2, width: 0.31, height: 0.55 },
  { name: "speed", label: "number", left: 0.62, top: 0.38, width: 0.25, height: 0.25 },
  { name: "speed", label: "number-right", left: 0.78, top: 0.38, width: 0.18, height: 0.25 },
];

export async function createTesseractWorker(): Promise<Worker> {
  const worker = await createWorker("eng");
  await worker.setParameters({
    tessedit_char_whitelist:
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÁÀÂÃÉÊÍÓÔÕÚÇáàâãéêíóôõúç,.:/'\" kmhKMHdistanciaDISTANCIAtempoTEMPOvelocidadeVELOCIDADEmins",
  });
  return worker;
}

type Variant = "gray" | "threshold" | "linear";

async function preprocessRegion(
  imagePath: string,
  box: RegionBox,
  variant: Variant
): Promise<Buffer> {
  const metadata = await sharp(imagePath).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`Nao foi possivel ler dimensoes de ${imagePath}`);
  }

  const crop = {
    left: Math.max(0, Math.round(metadata.width * box.left)),
    top: Math.max(0, Math.round(metadata.height * box.top)),
    width: Math.min(metadata.width, Math.round(metadata.width * box.width)),
    height: Math.min(metadata.height, Math.round(metadata.height * box.height)),
  };

  const base = sharp(imagePath)
    .extract(crop)
    .resize({ width: Math.max(900, crop.width * 2), withoutEnlargement: false })
    .grayscale();

  if (variant === "linear") {
    return base.linear(1.8, -80).sharpen().png().toBuffer();
  }

  const pipeline = base.normalize().sharpen();
  if (variant === "threshold") pipeline.threshold(135);
  return pipeline.png().toBuffer();
}

export async function runTesseract(
  worker: Worker,
  imagePath: string
): Promise<OcrRegion[]> {
  const output = new Map<OcrRegion["name"], string[]>();
  for (const region of regions) {
    const texts: string[] = [];
    const variants: Variant[] =
      region.name === "top" || region.name === "time"
        ? ["gray", "threshold", "linear"]
        : ["gray", "threshold", "linear"];

    for (const variant of variants) {
      const buffer = await preprocessRegion(imagePath, region, variant);
      const result = await worker.recognize(buffer);
      const text = result.data.text.replace(/[ \t]+/g, " ").trim();
      if (text) texts.push(`${variant}: ${text}`);
    }

    if (!output.has(region.name)) output.set(region.name, []);
    const regionText = texts.join("\n");
    if (regionText) {
      output.get(region.name)?.push(
        region.label ? `${region.label}:\n${regionText}` : regionText
      );
    }
  }
  return [...output.entries()].map(([name, texts]) => ({
    name,
    text: texts.join("\n\n"),
  }));
}

function pickValue<T>(values: T[], pick: "first" | "last"): T | undefined {
  return pick === "first" ? values[0] : values[values.length - 1];
}

function labelScopes(text: string, label: string): string[] {
  const normalized = text.toUpperCase();
  const scopes: string[] = [];
  let index = normalized.indexOf(label);
  while (index !== -1) {
    scopes.push(text.slice(index + label.length, index + label.length + 140));
    index = normalized.indexOf(label, index + label.length);
  }
  return scopes;
}

function afterLabel(text: string, label: string): string | undefined {
  return labelScopes(text, label)[0];
}

function findDecimal(
  text: string,
  pick: "first" | "last" = "last",
  fallback?: string
): string | undefined {
  const matches = text.match(/\d{1,3}\s*[,\.]\s*\d{1,2}/g) ?? [];
  const chosen = pickValue(matches, pick) ?? fallback;
  return chosen ? normalizeDecimal(chosen) : undefined;
}

function findDecimals(text: string): string[] {
  const matches = text.match(/\d{1,3}\s*[,\.]\s*\d{1,2}/g) ?? [];
  return matches
    .map((value) => {
      try {
        return normalizeDecimal(value);
      } catch {
        return null;
      }
    })
    .filter((value): value is string => value !== null);
}

function pickMostCommonDecimal(groups: Array<string | undefined>): string | undefined {
  const scores = new Map<string, { count: number; firstSeen: number }>();
  let order = 0;

  for (const group of groups) {
    if (!group) continue;
    for (const value of findDecimals(group)) {
      const current = scores.get(value);
      if (current) {
        current.count += 1;
      } else {
        scores.set(value, { count: 1, firstSeen: order });
      }
      order += 1;
    }
  }

  return [...scores.entries()]
    .sort((left, right) => {
      if (right[1].count !== left[1].count) return right[1].count - left[1].count;
      return left[1].firstSeen - right[1].firstSeen;
    })[0]?.[0];
}

function correctFuzzyDigits(text: string): string {
  return text
    .replace(/[Aa]/g, "4")
    .replace(/[Ss]/g, "5")
    .replace(/[Zz]/g, "2")
    .replace(/[Oo]/g, "0")
    .replace(/[Il|]/g, "1");
}

function findTime(text: string, fallback?: string): string | undefined {
  const scopes = labelScopes(text, "TEMPO");
  const searchAreas = scopes.length > 0 ? scopes : [text];
  for (const scoped of searchAreas) {
    const corrected = correctFuzzyDigits(scoped);
    const matches = corrected.match(/\d{1,3}\s*:\s*\d{2,3}/g) ?? [];
    if (matches.length > 0) return normalizeTime(matches[0] ?? fallback ?? "");

    const compact = [...corrected.matchAll(/(?:^|\D)(\d{4})(?:\D|$)/g)].map(
      (match) => `${match[1]?.slice(0, 2)}:${match[1]?.slice(2, 4)}`
    );
    const chosen = compact.find((candidate) => {
      const seconds = Number(candidate.split(":")[1]);
      return Number.isFinite(seconds) && seconds < 60;
    });
    if (chosen) return normalizeTime(chosen);
  }

  return fallback ? normalizeTime(fallback) : undefined;
}

export function parseTesseractFallback(
  regionsText: OcrRegion[]
): MetricResult | undefined {
  const byName = new Map(regionsText.map((region) => [region.name, region.text]));

  try {
    const topRegion = byName.get("top") ?? "";
    const distanceRegion = byName.get("distance") ?? "";
    const timeRegion = byName.get("time") ?? "";
    const topDistanceScope = afterLabel(topRegion, "DISTANCIA");
    const distanceScope = afterLabel(distanceRegion, "DISTANCIA");
    const timeDistanceScope = afterLabel(timeRegion, "DISTANCIA");
    const distance =
      pickMostCommonDecimal([
        topDistanceScope,
        distanceScope,
        timeDistanceScope,
        distanceRegion,
      ]) ??
      findDecimal(topRegion, "first");
    const speedRegion = byName.get("speed") ?? "";
    const time =
      findTime(byName.get("time") ?? "") ??
      findTime(topRegion) ??
      findTime(speedRegion);
    if (distance && time) {
      return { distanceKm: distance, time, speedKmh: calculateSpeedKmh(distance, time) };
    }

    // HEURÍSTICA GLOBAL: Busca padrão (decimal, decimal, tempo)
    const allText = regionsText.map(r => r.text).join(" ");
    const decimals = findDecimals(allText);
    const times = allText.match(/\d{1,3}\s*:\s*\d{2}/g) ?? [];
    
    if (decimals.length >= 2 && times.length >= 1) {
      const dist = decimals[0];
      const t = normalizeTime(times[0]);
      return { 
        distanceKm: dist, 
        time: t, 
        speedKmh: calculateSpeedKmh(dist, t) 
      };
    }
  } catch {
    // Falls through
  }

  return undefined;
}
