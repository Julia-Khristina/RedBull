export class ImageProcessingService {
  cropRegion(sourceCanvas, region) {
    const cropCanvas = document.createElement("canvas");
    cropCanvas.width = Math.max(1, Math.round(region.width));
    cropCanvas.height = Math.max(1, Math.round(region.height));

    const context = cropCanvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(
      sourceCanvas,
      Math.round(region.x),
      Math.round(region.y),
      Math.round(region.width),
      Math.round(region.height),
      0,
      0,
      cropCanvas.width,
      cropCanvas.height
    );

    return cropCanvas;
  }

  preprocess(cropCanvas) {
    if (!window.cv || !window.cv.Mat) {
      return cropCanvas.toDataURL("image/png");
    }

    const src = cv.imread(cropCanvas);
    const gray = new cv.Mat();
    const resized = new cv.Mat();
    const blurred = new cv.Mat();
    const binary = new cv.Mat();
    const inverted = new cv.Mat();

    try {
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
      cv.resize(gray, resized, new cv.Size(0, 0), 3, 3, cv.INTER_CUBIC);
      cv.medianBlur(resized, blurred, 3);
      cv.threshold(blurred, binary, 135, 255, cv.THRESH_BINARY);

      const mean = cv.mean(binary)[0];
      const output = mean < 127 ? inverted : binary;
      if (mean < 127) {
        cv.bitwise_not(binary, inverted);
      }

      const outputCanvas = document.createElement("canvas");
      cv.imshow(outputCanvas, output);
      return outputCanvas.toDataURL("image/png");
    } finally {
      src.delete();
      gray.delete();
      resized.delete();
      blurred.delete();
      binary.delete();
      inverted.delete();
    }
  }

  async processRegions(sourceCanvas, regions) {
    return regions
      .map((region) => {
        const cropCanvas = this.cropRegion(sourceCanvas, region);
        const imageDataUrl = cropCanvas.toDataURL("image/png");
        const processedDataUrl = this.preprocess(cropCanvas);

        return {
          ...region,
          imageDataUrl,
          processedDataUrl
        };
      });
  }
}
