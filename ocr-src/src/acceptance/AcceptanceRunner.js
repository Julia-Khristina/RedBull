import { ImageProcessingService } from "../services/ImageProcessingService.js";
import { TemplateRegionService } from "../services/TemplateRegionService.js";
import { TesseractService } from "../services/TesseractService.js";
import { ValidationService } from "../services/ValidationService.js";

const ACCEPTANCE_DATE = "2026-06-11";

export class AcceptanceRunner {
  constructor({ onProgress = () => {} } = {}) {
    this.onProgress = onProgress;
    this.templateService = new TemplateRegionService();
    this.imageProcessingService = new ImageProcessingService();
    this.validationService = new ValidationService();
    this.tesseractService = new TesseractService((field, progress) => {
      this.onProgress({
        type: "ocr-progress",
        field,
        progress
      });
    });
  }

  async run(manifestUrl = "./acceptance-cases.json") {
    const manifest = await this.loadManifest(manifestUrl);
    const cases = [];

    for (const testCase of manifest.cases) {
      this.onProgress({
        type: "case-start",
        case: testCase.file
      });
      const result = await this.runCase(testCase, manifest);
      cases.push(result);
      this.onProgress({
        type: "case-complete",
        case: testCase.file,
        pass: result.pass
      });
    }

    const passed = cases.filter((item) => item.pass).length;
    const failed = cases.length - passed;
    return {
      summary: {
        generatedAt: ACCEPTANCE_DATE,
        total: cases.length,
        passed,
        failed,
        passRate: cases.length ? passed / cases.length : 0,
        numericTolerance: manifest.numericTolerance
      },
      cases
    };
  }

  async loadManifest(manifestUrl) {
    const response = await fetch(manifestUrl);
    if (!response.ok) {
      throw new Error(`Nao foi possivel carregar ${manifestUrl}.`);
    }

    return response.json();
  }

  async runCase(testCase, manifest) {
    const image = await this.loadImage(this.caseImageUrl(testCase.file));
    const sourceCanvas = this.createSourceCanvas(image);
    const regionResult = await this.templateService.createRegionsWithDiagnostics(image);
    const processedRegions = await this.imageProcessingService.processRegions(
      sourceCanvas,
      regionResult.regions
    );
    const ocrResult = await this.tesseractService.recognizeRegionsWithAttempts(processedRegions);
    const validation = this.validationService.validateAll(ocrResult.rawOcr);
    const normalized = Object.fromEntries(
      Object.entries(validation).map(([field, result]) => [field, result.value])
    );
    const valid = Object.fromEntries(
      Object.entries(validation).map(([field, result]) => [field, result.valid])
    );
    const fieldResults = this.compareFields({
      expected: testCase.expected,
      validation,
      numericTolerance: manifest.numericTolerance
    });
    const pass = fieldResults.every((result) => result.pass);

    return {
      case: testCase.file,
      expected: testCase.expected,
      rawOcr: ocrResult.rawOcr,
      normalized,
      valid,
      pass,
      regions: processedRegions.map((region) => this.serializeRegion(region)),
      diagnostics: {
        ...regionResult.diagnostics,
        attempts: ocrResult.attempts,
        fieldResults,
        cause: this.inferCause({
          pass,
          fieldResults,
          validation,
          rawOcr: ocrResult.rawOcr,
          diagnostics: regionResult.diagnostics
        })
      },
      evidence: pass ? [] : processedRegions.map((region) => this.serializeEvidence(region))
    };
  }

  caseImageUrl(fileName) {
    return `./casos-testes/${fileName.split("/").map(encodeURIComponent).join("/")}`;
  }

  loadImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Nao foi possivel carregar a imagem ${url}.`));
      image.src = url;
    });
  }

  createSourceCanvas(image) {
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    canvas.getContext("2d").drawImage(image, 0, 0);
    return canvas;
  }

  serializeRegion(region) {
    return {
      field: region.field,
      x: Math.round(region.x),
      y: Math.round(region.y),
      width: Math.round(region.width),
      height: Math.round(region.height),
      source: region.source
    };
  }

  serializeEvidence(region) {
    return {
      field: region.field,
      original: region.imageDataUrl,
      processed: region.processedDataUrl
    };
  }

  compareFields({ expected, validation, numericTolerance }) {
    return Object.entries(expected).map(([field, expectedValue]) => {
      const actualValue = validation[field]?.value || "";
      const pass = field === "time"
        ? this.compareTime(actualValue, expectedValue)
        : this.compareNumber(actualValue, expectedValue, numericTolerance);

      return {
        field,
        expected: expectedValue,
        actual: actualValue,
        valid: Boolean(validation[field]?.valid),
        pass
      };
    });
  }

  compareNumber(actual, expected, tolerance) {
    const actualNumber = Number(String(actual).replace(",", "."));
    const expectedNumber = Number(String(expected).replace(",", "."));

    if (!Number.isFinite(actualNumber) || !Number.isFinite(expectedNumber)) {
      return false;
    }

    return Math.abs(actualNumber - expectedNumber) <= tolerance;
  }

  compareTime(actual, expected) {
    const actualSeconds = this.timeToSeconds(actual);
    const expectedSeconds = this.timeToSeconds(expected);
    return actualSeconds !== null && actualSeconds === expectedSeconds;
  }

  timeToSeconds(value) {
    const parts = String(value || "")
      .split(":")
      .map((part) => Number(part));

    if (parts.length === 2 && parts.every(Number.isFinite)) {
      return parts[0] * 60 + parts[1];
    }

    if (parts.length === 3 && parts.every(Number.isFinite)) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }

    return null;
  }

  inferCause({ pass, fieldResults, validation, rawOcr, diagnostics }) {
    if (pass) return "passou";
    if (!diagnostics.opencvAvailable) return "OpenCV indisponivel; fallback de template usado";
    if (!diagnostics.detected) return "painel nao detectado; revisar threshold/limites de painel";

    const emptyFields = fieldResults.filter((result) => !rawOcr[result.field]);
    if (emptyFields.length) return "OCR sem texto util; revisar regiao ou pre-processamento";

    const invalidFields = fieldResults.filter((result) => !validation[result.field]?.valid);
    if (invalidFields.length) return "OCR retornou formato invalido; revisar pre-processamento ou normalizacao";

    return "OCR retornou valor valido mas divergente; revisar template, padding ou escolha de tentativa";
  }
}
