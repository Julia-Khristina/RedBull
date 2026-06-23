import crypto from "crypto";
import fsSync from "fs";
import fs from "fs/promises";
import path from "path";
import { OcrExtractionResult } from "../models/ocr";
import { UnprocessableError } from "../errors/AppError";
import {
  createTesseractWorker,
  parseTesseractFallback,
  runTesseract,
} from "./ocrTesseractService";
import { extractWithGroq } from "./ocrGroqService";

const rootDir = path.resolve(__dirname, "..", "..");
const cacheDir = path.join(rootDir, ".ocr-cache");
const uploadDir = path.join(cacheDir, "uploads");
const supportedExtensions = new Set([".png", ".jpg", ".jpeg", ".webp"]);

let groqUnavailableMessage: string | undefined;

function shouldDisableGroq(message: string): boolean {
  return /incorrect api key|unauthorized|forbidden|invalid api key|401|403/i.test(message);
}

function assertSupportedExtension(originalName: string): string {
  const extension = path.extname(originalName).toLowerCase() || ".png";
  if (!supportedExtensions.has(extension)) {
    throw new Error("Formato de imagem nao suportado.");
  }
  return extension;
}

export function getOcrUploadDir(): string {
  fsSync.mkdirSync(uploadDir, { recursive: true });
  return uploadDir;
}

export async function ensureOcrUploadDir(): Promise<void> {
  await fs.mkdir(uploadDir, { recursive: true });
}

export async function persistUploadedImage(file: Express.Multer.File): Promise<{
  imagePath: string;
  previewUrl: string;
}> {
  await ensureOcrUploadDir();
  const extension = assertSupportedExtension(file.originalname);
  const filename = `${crypto.randomUUID()}${extension}`;
  const imagePath = path.join(uploadDir, filename);
  await fs.rename(file.path, imagePath);
  return {
    imagePath,
    previewUrl: `/ocr/uploads/${encodeURIComponent(filename)}`,
  };
}

export async function extractMetricsFromImage(
  imagePath: string,
  previewUrl?: string,
  originalName?: string
): Promise<OcrExtractionResult> {
  const worker = await createTesseractWorker();
  try {
    const regions = await runTesseract(worker, imagePath);
    const fallback = parseTesseractFallback(regions);

    if (fallback) {
      return {
        file: originalName ?? path.basename(imagePath),
        metrics: fallback,
        tesseract: regions,
        source: "tesseract",
        previewUrl,
      };
    }

    if (process.env.GROQ_API_KEY && !groqUnavailableMessage) {
      try {
        const groq = await extractWithGroq(imagePath, regions);
        return {
          file: originalName ?? path.basename(imagePath),
          metrics: groq.metrics,
          tesseract: regions,
          source: "groq+tesseract",
          rawgroq: groq.raw,
          rawGroq: groq.raw,
          previewUrl,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (shouldDisableGroq(message)) groqUnavailableMessage = message;
        // eslint-disable-next-line no-console
        console.warn(`Groq falhou para ${path.basename(imagePath)}: ${message}`);
      }
    } else if (groqUnavailableMessage) {
      // eslint-disable-next-line no-console
      console.warn(`Groq ignorado para ${path.basename(imagePath)}: ${groqUnavailableMessage}`);
    }

    throw new UnprocessableError(
      "Nao foi possivel extrair todos os dados da foto. Tente tirar uma nova foto mais centralizada no painel da esteira."
    );
  } finally {
    await worker.terminate();
  }
}
