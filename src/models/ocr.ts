export type MetricResult = {
  distanceKm: string;
  time: string;
  speedKmh: string;
};

export type OcrRegion = {
  name: "distance" | "time" | "speed" | "top";
  text: string;
};

export type OcrExtractionResult = {
  file: string;
  metrics: MetricResult;
  tesseract?: OcrRegion[];
  source: "groq" | "groq+tesseract" | "tesseract";
  previewUrl?: string;
  rawgroq?: string;
  rawGroq?: string;
};
