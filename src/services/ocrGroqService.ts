import fs from "fs/promises";
import path from "path";
import OpenAI from "openai";
import { OcrRegion, MetricResult } from "../models/ocr";
import { extractJsonObject, normalizeMetricResult } from "./ocrNormalize";

const systemPrompt = [
  "Voce extrai metricas de paineis de esteira em portugues.",
  "Use a imagem como fonte principal e o texto OCR do Tesseract como apoio.",
  "Extraia somente DISTANCIA em km e TEMPO em min:s.",
  "IMPORTANTE: O tempo deve ser retornado estritamente no formato mm:ss (ex: 05:30, 120:15).",
  "Ignore velocidade, ritmo min/km, pace, frequencia cardiaca, calorias e controles inferiores.",
  "ATENCAO: nos numeros da imagem a virgula (,) e separador decimal.",
  "Exemplo: '15,25' na imagem significa 15.25 (quinze virgula vinte e cinco).",
  "Ao escrever o JSON, converta a virgula para ponto (.) como separador decimal.",
  "Nao confunda com separador de milhar.",
  "Para valores menores que 1, ex: '0,08' vira 0.08 no JSON.",
  "Retorne o JSON com as chaves distanceKm (numero) e time (string no formato mm:ss).",
].join(" ");

function client(): OpenAI {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Defina GROQ_API_KEY no ambiente antes de usar o Groq.");
  }

  return new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });
}

export async function extractWithGroq(
  imagePath: string,
  tesseract?: OcrRegion[]
): Promise<{ metrics: MetricResult; raw: string }> {
  const image = await fs.readFile(imagePath);
  const ext = path.extname(imagePath).toLowerCase();
  const mimeType = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";
  const dataUrl = `data:${mimeType};base64,${image.toString("base64")}`;
  const ocrText = tesseract
    ? tesseract.map((region) => `[${region.name}]\n${region.text || "(vazio)"}`).join("\n\n")
    : null;

  const userText = ocrText
    ? `Texto OCR bruto do Tesseract:\n${ocrText}\n\nRetorne somente o JSON com as chaves: distanceKm, time.`
    : "Retorne somente o JSON com as chaves: distanceKm (número em km) e time (string no formato mm:ss).";

  const completion = await client().chat.completions.create({
    model: process.env.GROQ_MODEL ?? "llama-3.2-11b-vision-preview",
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          { type: "text", text: userText },
          { type: "image_url", image_url: { url: dataUrl } },
        ],
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "";
  return { metrics: normalizeMetricResult(extractJsonObject(raw)), raw };
}
