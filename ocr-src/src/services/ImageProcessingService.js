import { PANEL_VARIATION_LIMITS } from "../utils/constants.js";

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
    const enhanced = new cv.Mat();
    const resized = new cv.Mat();
    const blurred = new cv.Mat();
    const binary = new cv.Mat();
    const inverted = new cv.Mat();
    const mean = new cv.Mat();
    const stdDev = new cv.Mat();

    try {
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
      const source = this.enhanceForVariation(gray, enhanced, mean, stdDev);
      cv.resize(
        source,
        resized,
        new cv.Size(0, 0),
        PANEL_VARIATION_LIMITS.sharpness.resizeFactor,
        PANEL_VARIATION_LIMITS.sharpness.resizeFactor,
        cv.INTER_CUBIC
      );
      cv.medianBlur(resized, blurred, 3);
      cv.threshold(blurred, binary, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);

      const binaryMean = cv.mean(binary)[0];
      const output = binaryMean < 127 ? inverted : binary;
      if (binaryMean < 127) {
        cv.bitwise_not(binary, inverted);
      }

      const outputCanvas = document.createElement("canvas");
      cv.imshow(outputCanvas, output);
      return outputCanvas.toDataURL("image/png");
    } finally {
      src.delete();
      gray.delete();
      enhanced.delete();
      resized.delete();
      blurred.delete();
      binary.delete();
      inverted.delete();
      mean.delete();
      stdDev.delete();
    }
  }

  createRotatedCanvas(sourceCanvas, degrees) {
    const angle = (degrees * Math.PI) / 180;
    const sin = Math.abs(Math.sin(angle));
    const cos = Math.abs(Math.cos(angle));
    const width = Math.ceil(sourceCanvas.width * cos + sourceCanvas.height * sin);
    const height = Math.ceil(sourceCanvas.width * sin + sourceCanvas.height * cos);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.translate(width / 2, height / 2);
    context.rotate(angle);
    context.drawImage(sourceCanvas, -sourceCanvas.width / 2, -sourceCanvas.height / 2);
    return canvas;
  }

  createFocusedCanvas(sourceCanvas, field) {
    const focusMap = {
      distance: { x: 0.2, y: 0.12, w: 0.78, h: 0.72 },
      time: { x: 0.25, y: 0.08, w: 0.72, h: 0.7 },
      speed: { x: 0.22, y: 0, w: 0.72, h: 0.68 }
    };
    const focus = focusMap[field] || { x: 0.18, y: 0.08, w: 0.78, h: 0.74 };
    const sx = Math.round(sourceCanvas.width * focus.x);
    const sy = Math.round(sourceCanvas.height * focus.y);
    const sw = Math.max(1, Math.round(sourceCanvas.width * focus.w));
    const sh = Math.max(1, Math.round(sourceCanvas.height * focus.h));
    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;
    canvas
      .getContext("2d", { willReadFrequently: true })
      .drawImage(sourceCanvas, sx, sy, sw, sh, 0, 0, sw, sh);
    return canvas;
  }

  createOcrVariants(cropCanvas, field) {
    const rotationDegrees = [-10, -6, 6, 10];
    const focusedCanvas = this.createFocusedCanvas(cropCanvas, field);
    const focusedRotations = [-6, 6];

    const variants = [
      {
        variant: "focused-processed",
        imageDataUrl: this.preprocess(focusedCanvas),
        pageSegModes: ["7", "8", "13"]
      },
      {
        variant: "focused-original",
        imageDataUrl: focusedCanvas.toDataURL("image/png"),
        pageSegModes: ["7", "8", "13"]
      }
    ];

    focusedRotations.forEach((degrees) => {
      const rotatedCanvas = this.createRotatedCanvas(focusedCanvas, degrees);
      variants.push({
        variant: `focused-rotated-${degrees}`,
        imageDataUrl: this.preprocess(rotatedCanvas),
        pageSegModes: ["7", "8"]
      });
    });

    rotationDegrees.forEach((degrees) => {
      const rotatedCanvas = this.createRotatedCanvas(cropCanvas, degrees);
      variants.push({
        variant: `rotated-${degrees}`,
        imageDataUrl: this.preprocess(rotatedCanvas)
      });
    });

    return variants;
  }

  enhanceForVariation(gray, enhanced, mean, stdDev) {
    cv.meanStdDev(gray, mean, stdDev);
    const meanRatio = mean.data64F[0] / 255;
    const stdDevRatio = stdDev.data64F[0] / 255;
    const outsideLightingRange =
      meanRatio < PANEL_VARIATION_LIMITS.lighting.minMeanRatio ||
      meanRatio > PANEL_VARIATION_LIMITS.lighting.maxMeanRatio;
    const lowContrast = stdDevRatio < PANEL_VARIATION_LIMITS.contrast.minStdDevRatio;

    if (outsideLightingRange || lowContrast) {
      cv.equalizeHist(gray, enhanced);
      return enhanced;
    }

    return gray;
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
          processedDataUrl,
          alternateDataUrls: this.createOcrVariants(cropCanvas, region.field)
        };
      });
  }
}
