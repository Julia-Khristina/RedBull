import { ValidationService } from "./ValidationService.js";

export class TesseractService {
  constructor(onProgress = () => {}) {
    this.onProgress = onProgress;
    this.worker = null;
    this.currentField = null;
    this.currentPageSegMode = "7";
    this.validationService = new ValidationService();
  }

  async getWorker() {
    if (!window.Tesseract) {
      throw new Error("Tesseract.js ainda nao foi carregado.");
    }

    if (this.worker) return this.worker;

    this.worker = await window.Tesseract.createWorker("eng", 1, {
      logger: (message) => {
        if (message.status === "recognizing text") {
          this.onProgress(this.currentField, message.progress || 0);
        }
      }
    });

    await this.worker.setParameters({
      tessedit_char_whitelist: "0123456789:.,",
      tessedit_pageseg_mode: "7"
    });

    return this.worker;
  }

  async recognizeImage(imageDataUrl, field) {
    const result = await this.recognizeImageDetailed(imageDataUrl, field);
    return result.text;
  }

  async recognizeImageDetailed(imageDataUrl, field, pageSegMode = "7") {
    const worker = await this.getWorker();
    this.currentField = field;
    await this.setPageSegMode(pageSegMode);
    const result = await worker.recognize(imageDataUrl);
    return {
      text: result.data.text.trim(),
      confidence: Number(result.data.confidence || 0)
    };
  }

  async setPageSegMode(pageSegMode) {
    if (this.currentPageSegMode === pageSegMode) return;

    const worker = await this.getWorker();
    await worker.setParameters({
      tessedit_pageseg_mode: pageSegMode
    });
    this.currentPageSegMode = pageSegMode;
  }

  async recognizeRegion(region) {
    const attempts = await this.recognizeRegionAttempts(region);
    return this.chooseBestAttempt(attempts, region.field).text;
  }

  async recognizeRegionAttempts(region) {
    const sources = [
      ...this.createPageSegModeSources("processed", region.processedDataUrl),
      ...this.createPageSegModeSources("original", region.imageDataUrl),
      ...this.expandAlternateSources(region.alternateDataUrls || [])
    ].filter((source) => source.imageDataUrl);

    const attempts = [];
    for (const source of sources) {
      const result = await this.recognizeImageDetailed(source.imageDataUrl, region.field, source.pageSegMode);
      const validation = this.validationService.validate(region.field, result.text);
      attempts.push({
        variant: source.variant,
        pageSegMode: source.pageSegMode,
        text: result.text,
        confidence: result.confidence,
        normalized: validation.value,
        valid: validation.valid,
        score: this.scoreAttempt(region.field, result.text, result.confidence, validation, source)
      });
    }

    return attempts;
  }

  createPageSegModeSources(variant, imageDataUrl) {
    return ["7", "8", "13"].map((pageSegMode) => ({
      variant: `${variant}-psm${pageSegMode}`,
      imageDataUrl,
      pageSegMode
    }));
  }

  expandAlternateSources(sources) {
    return sources.flatMap((source) => {
      const pageSegModes = source.pageSegModes || ["7"];
      return pageSegModes.map((pageSegMode) => ({
        variant: `${source.variant}-psm${pageSegMode}`,
        imageDataUrl: source.imageDataUrl,
        pageSegMode
      }));
    });
  }

  chooseBestAttempt(attempts) {
    return [...attempts].sort((left, right) => right.score - left.score)[0] || {
      text: "",
      confidence: 0,
      normalized: "",
      valid: false,
      score: 0
    };
  }

  scoreAttempt(field, text, confidence, validation, source = {}) {
    const digitCount = (text.match(/\d/g) || []).length;
    let score = confidence + digitCount * 2;

    if (this.hasUsefulText(text)) score += 10;
    if (validation.valid) score += 25;
    if (validation.valid && source.pageSegMode === "7") score += 4;
    if (source.variant?.startsWith("focused")) score -= 30;

    if (field === "time") {
      score += digitCount * 2;
      if (/:/.test(text)) score += 4;
      if (/^\d{2,3}:\d{2}$/.test(validation.value)) score += 8;
    }

    if (["distance", "speed"].includes(field) && /[.,]/.test(text)) {
      score += 8;
    }

    return score;
  }

  hasUsefulText(text) {
    return /[0-9]/.test(text || "");
  }

  async recognizeRegions(regions) {
    const { rawOcr } = await this.recognizeRegionsWithAttempts(regions);
    return rawOcr;
  }

  async recognizeRegionsWithAttempts(regions) {
    const entries = [];
    const attemptsByField = {};

    for (const region of regions) {
      try {
        const attempts = await this.recognizeRegionAttempts(region);
        const bestAttempt = this.chooseBestAttempt(attempts, region.field);
        entries.push([region.field, bestAttempt.text]);
        attemptsByField[region.field] = attempts;
      } catch (error) {
        entries.push([region.field, ""]);
        attemptsByField[region.field] = [{
          variant: "error",
          text: "",
          confidence: 0,
          normalized: "",
          valid: false,
          score: 0,
          error: error.message || "Falha no OCR"
        }];
      }
    }

    return {
      rawOcr: Object.fromEntries(entries),
      attempts: attemptsByField
    };
  }
}
