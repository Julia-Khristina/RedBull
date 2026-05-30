import { FIELD_LABELS } from "../utils/constants.js";

export class CropController {
  constructor(canvas, state, onChange) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.state = state;
    this.onChange = onChange;
    this.dragState = null;
    this.resizeSize = 18;
  }

  mount() {
    this.draw();
    this.canvas.addEventListener("pointerdown", this.onPointerDown);
    this.canvas.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
  }

  destroy() {
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    this.canvas.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
  }

  draw() {
    const { image, regions } = this.state;
    this.canvas.width = image.naturalWidth;
    this.canvas.height = image.naturalHeight;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(image, 0, 0);

    regions.forEach((region) => this.drawRegion(region));
  }

  drawRegion(region) {
    const color = "#26d07c";
    this.context.save();
    this.context.lineWidth = 4;
    this.context.strokeStyle = color;
    this.context.fillStyle = "rgba(38, 208, 124, 0.14)";
    this.context.fillRect(region.x, region.y, region.width, region.height);
    this.context.strokeRect(region.x, region.y, region.width, region.height);

    this.context.fillStyle = color;
    this.context.fillRect(region.x, Math.max(region.y - 34, 0), Math.max(130, region.width), 34);
    this.context.fillStyle = "#07130d";
    this.context.font = "bold 22px Arial";
    this.context.fillText(FIELD_LABELS[region.field], region.x + 8, Math.max(region.y - 10, 24));

    this.context.fillStyle = color;
    this.context.fillRect(
      region.x + region.width - this.resizeSize,
      region.y + region.height - this.resizeSize,
      this.resizeSize,
      this.resizeSize
    );
    this.context.restore();
  }

  onPointerDown = (event) => {
    const point = this.getCanvasPoint(event);
    const region = this.findRegion(point);
    if (!region) return;

    const mode = this.isResizeHandle(point, region) ? "resize" : "move";
    this.dragState = {
      mode,
      field: region.field,
      startX: point.x,
      startY: point.y,
      original: { ...region }
    };
    this.canvas.setPointerCapture(event.pointerId);
  };

  onPointerMove = (event) => {
    const point = this.getCanvasPoint(event);
    const hoverRegion = this.findRegion(point);
    this.canvas.style.cursor = hoverRegion ? (this.isResizeHandle(point, hoverRegion) ? "nwse-resize" : "move") : "crosshair";

    if (!this.dragState) return;

    const region = this.state.regions.find((item) => item.field === this.dragState.field);
    if (!region) return;

    const dx = point.x - this.dragState.startX;
    const dy = point.y - this.dragState.startY;

    if (this.dragState.mode === "move") {
      region.x = this.dragState.original.x + dx;
      region.y = this.dragState.original.y + dy;
    } else {
      region.width = this.dragState.original.width + dx;
      region.height = this.dragState.original.height + dy;
    }

    region.source = "manual";
    this.state.templateService.constrainRegion(region, this.canvas.width, this.canvas.height);
    this.draw();
  };

  onPointerUp = () => {
    if (!this.dragState) return;
    this.dragState = null;
    this.onChange(this.state.regions);
  };

  getCanvasPoint(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: Math.round(((event.clientX - rect.left) / rect.width) * this.canvas.width),
      y: Math.round(((event.clientY - rect.top) / rect.height) * this.canvas.height)
    };
  }

  findRegion(point) {
    return [...this.state.regions].reverse().find((region) => {
      return (
        point.x >= region.x &&
        point.x <= region.x + region.width &&
        point.y >= region.y &&
        point.y <= region.y + region.height
      );
    });
  }

  isResizeHandle(point, region) {
    return (
      point.x >= region.x + region.width - this.resizeSize &&
      point.y >= region.y + region.height - this.resizeSize
    );
  }
}
