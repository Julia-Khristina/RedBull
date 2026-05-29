export class OCRController {
  constructor({ imageProcessingService, tesseractService, validationService }) {
    this.imageProcessingService = imageProcessingService;
    this.tesseractService = tesseractService;
    this.validationService = validationService;
  }

  async process(sourceCanvas, regions) {
    const processedRegions = await this.imageProcessingService.processRegions(sourceCanvas, regions);
    const rawOcr = await this.tesseractService.recognizeRegions(processedRegions);
    const validation = this.validationService.validateAll(rawOcr);

    return {
      reading: { rawOcr, validation },
      processedRegions
    };
  }
}
