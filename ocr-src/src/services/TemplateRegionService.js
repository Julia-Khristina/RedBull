import { OCR_REGION_PADDING, PANEL_TEMPLATE, PANEL_VARIATION_LIMITS } from "../utils/constants.js";
import { clamp } from "../utils/formatters.js";
import { RegionModel } from "../models/RegionModel.js";

export class TemplateRegionService {
  constructor(template = PANEL_TEMPLATE) {
    this.template = template;
  }

  createRegions(imageWidth, imageHeight) {
    return this.createRegionsFromBounds(imageWidth, imageHeight, {
      x: 0,
      y: 0,
      width: imageWidth,
      height: imageHeight,
      source: "template"
    });
  }

  async createRegionsFromImage(image) {
    const { regions } = await this.createRegionsWithDiagnostics(image);
    return regions;
  }

  async createRegionsWithDiagnostics(image) {
    const imageWidth = image.naturalWidth;
    const imageHeight = image.naturalHeight;
    const canvas = document.createElement("canvas");
    canvas.width = imageWidth;
    canvas.height = imageHeight;
    canvas.getContext("2d").drawImage(image, 0, 0);

    const opencvAvailable = await this.waitForOpenCv();
    const detectedBounds = this.detectPanelBounds(canvas);

    const bounds = detectedBounds || {
      x: 0,
      y: 0,
      width: imageWidth,
      height: imageHeight,
      source: "template"
    };

    return {
      regions: this.createRegionsFromBounds(imageWidth, imageHeight, bounds),
      diagnostics: {
        image: {
          width: imageWidth,
          height: imageHeight
        },
        opencvAvailable,
        detected: Boolean(detectedBounds),
        bounds
      }
    };
  }

  createRegionsFromBounds(imageWidth, imageHeight, bounds) {
    return Object.entries(this.template).map(([field, region]) => {
      const model = new RegionModel({
        field,
        x: Math.round(bounds.x + region.x * bounds.width),
        y: Math.round(bounds.y + region.y * bounds.height),
        width: Math.round(region.w * bounds.width),
        height: Math.round(region.h * bounds.height),
        source: bounds.source
      });
      this.expandRegionForOcr(model);
      return this.constrainRegion(model, imageWidth, imageHeight);
    });
  }

  expandRegionForOcr(region) {
    const padding = OCR_REGION_PADDING[region.field] || { x: 0.1, y: 0 };
    const leftPadding = Math.round(region.width * (padding.left ?? padding.x ?? 0));
    const rightPadding = Math.round(region.width * (padding.right ?? padding.x ?? 0));
    const topPadding = Math.round(region.height * (padding.top ?? padding.y ?? 0));
    const bottomPadding = Math.round(region.height * (padding.bottom ?? padding.y ?? 0));

    region.x -= leftPadding;
    region.y -= topPadding;
    region.width += leftPadding + rightPadding;
    region.height += topPadding + bottomPadding;
    return region;
  }

  async waitForOpenCv(timeoutMs = 3000) {
    if (window.cv?.Mat) return true;

    const started = Date.now();
    await new Promise((resolve) => {
      const tick = () => {
        if (window.cv?.Mat || Date.now() - started >= timeoutMs) {
          resolve();
          return;
        }

        setTimeout(tick, 50);
      };

      tick();
    });

    return Boolean(window.cv?.Mat);
  }

  detectPanelBounds(canvas) {
    if (!window.cv?.Mat) return null;

    const src = cv.imread(canvas);
    const gray = new cv.Mat();

    try {
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

      const thresholds = [
        { value: 96, paddingRatio: 0.05 },
        { value: 64, paddingRatio: 0.04 },
        { value: 28, paddingRatio: 0.01 }
      ];

      for (const threshold of thresholds) {
        const bounds = this.detectPanelBoundsAtThreshold(canvas, gray, threshold);
        if (bounds) return bounds;
      }

      return null;
    } finally {
      src.delete();
      gray.delete();
    }
  }

  detectPanelBoundsAtThreshold(canvas, gray, threshold) {
    const mask = new cv.Mat();
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();

    try {
      cv.threshold(gray, mask, threshold.value, 255, cv.THRESH_BINARY);
      cv.findContours(mask, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

      if (!contours.size()) return null;

      let rect = null;
      const imageArea = canvas.width * canvas.height;
      for (let index = 0; index < contours.size(); index += 1) {
        const contour = contours.get(index);
        const current = cv.boundingRect(contour);
        contour.delete();

        const currentArea = current.width * current.height;
        if (currentArea < 64 || currentArea > imageArea * 0.9) continue;

        if (!rect) {
          rect = current;
          continue;
        }

        const x1 = Math.min(rect.x, current.x);
        const y1 = Math.min(rect.y, current.y);
        const x2 = Math.max(rect.x + rect.width, current.x + current.width);
        const y2 = Math.max(rect.y + rect.height, current.y + current.height);
        rect = {
          x: x1,
          y: y1,
          width: x2 - x1,
          height: y2 - y1
        };
      }

      if (!rect) return null;
      const minArea = canvas.width * canvas.height * PANEL_VARIATION_LIMITS.size.minPanelAreaRatio;
      const area = rect.width * rect.height;
      if (area < minArea) return null;

      const aspectRatio = rect.width / Math.max(rect.height, 1);
      if (
        aspectRatio < PANEL_VARIATION_LIMITS.size.minAspectRatio ||
        aspectRatio > PANEL_VARIATION_LIMITS.size.maxAspectRatio
      ) {
        return null;
      }

      const padding = Math.round(Math.min(canvas.width, canvas.height) * threshold.paddingRatio);
      const bounds = {
        x: clamp(rect.x - padding, 0, canvas.width - 1),
        y: clamp(rect.y - padding, 0, canvas.height - 1),
        width: clamp(rect.width + padding * 2, 1, canvas.width),
        height: clamp(rect.height + padding * 2, 1, canvas.height),
        source: "opencv"
      };

      bounds.width = Math.min(bounds.width, canvas.width - bounds.x);
      bounds.height = Math.min(bounds.height, canvas.height - bounds.y);
      return bounds;
    } finally {
      mask.delete();
      contours.delete();
      hierarchy.delete();
    }
  }

  constrainRegion(region, imageWidth, imageHeight) {
    const minSize = 16;
    region.width = clamp(region.width, minSize, imageWidth);
    region.height = clamp(region.height, minSize, imageHeight);
    region.x = clamp(region.x, 0, imageWidth - region.width);
    region.y = clamp(region.y, 0, imageHeight - region.height);
    return region;
  }
}
