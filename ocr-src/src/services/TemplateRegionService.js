import { PANEL_TEMPLATE } from "../utils/constants.js";
import { clamp } from "../utils/formatters.js";
import { RegionModel } from "../models/RegionModel.js";

export class TemplateRegionService {
  constructor(template = PANEL_TEMPLATE) {
    this.template = template;
  }

  createRegions(imageWidth, imageHeight) {
    return Object.entries(this.template).map(([field, region]) => {
      return new RegionModel({
        field,
        x: Math.round(region.x * imageWidth),
        y: Math.round(region.y * imageHeight),
        width: Math.round(region.w * imageWidth),
        height: Math.round(region.h * imageHeight),
        source: "template"
      });
    });
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
