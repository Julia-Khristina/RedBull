export class RegionModel {
  constructor({ field, x, y, width, height, source = "template" }) {
    this.field = field;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.source = source;
  }
}
