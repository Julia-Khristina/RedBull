export class TesseractService {
  constructor(onProgress = () => {}) {
    this.onProgress = onProgress;
    this.worker = null;
    this.currentField = null;
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
    const worker = await this.getWorker();
    this.currentField = field;
    const result = await worker.recognize(imageDataUrl);
    return result.data.text.trim();
  }

  async recognizeRegion(region) {
    const processedText = await this.recognizeImage(region.processedDataUrl, region.field);

    if (this.hasUsefulText(processedText)) {
      return processedText;
    }

    return this.recognizeImage(region.imageDataUrl, region.field);
  }

  hasUsefulText(text) {
    return /[0-9]/.test(text || "");
  }

  async recognizeRegions(regions) {
    const entries = [];

    for (const region of regions) {
      try {
        const text = await this.recognizeRegion(region);
        entries.push([region.field, text]);
      } catch (error) {
        entries.push([region.field, ""]);
      }
    }

    return Object.fromEntries(entries);
  }
}
