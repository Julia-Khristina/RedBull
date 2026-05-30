import { CropController } from "./CropController.js";
import { OCRController } from "./OCRController.js";
import { UploadController } from "./UploadController.js";
import { ImageProcessingService } from "../services/ImageProcessingService.js";
import { TemplateRegionService } from "../services/TemplateRegionService.js";
import { TesseractService } from "../services/TesseractService.js";
import { ValidationService } from "../services/ValidationService.js";
import { CropView } from "../views/CropView.js";
import { ResultView } from "../views/ResultView.js";
import { UploadView } from "../views/UploadView.js";

export class AppController {
  constructor(root) {
    this.root = root;
    this.uploadView = new UploadView();
    this.cropView = new CropView();
    this.resultView = new ResultView();
    this.uploadController = new UploadController();
    this.templateService = new TemplateRegionService();
    this.imageProcessingService = new ImageProcessingService();
    this.validationService = new ValidationService();
    this.tesseractService = new TesseractService((field, progress) => {
      this.setStatus(`Lendo ${field}: ${Math.round(progress * 100)}%`);
    });
    this.ocrController = new OCRController({
      imageProcessingService: this.imageProcessingService,
      tesseractService: this.tesseractService,
      validationService: this.validationService
    });
    this.state = {
      image: null,
      regions: []
    };

    this.cropController = null;
  }

  init() {
    this.renderUpload();
  }

  renderUpload() {
    this.destroyCropController();
    this.root.innerHTML = this.uploadView.render();
    this.uploadView.bind(this.root, {
      onFile: (file) => this.handleFile(file)
    });
  }

  async handleFile(file) {
    this.renderLoading("Carregando imagem...");
    const image = await this.uploadController.readImageFile(file);
    this.state.image = image;
    this.state.regions = this.templateService.createRegions(image.naturalWidth, image.naturalHeight);
    this.renderCrop();
  }

  renderCrop() {
    this.destroyCropController();
    this.root.innerHTML = this.cropView.render({
      regions: this.state.regions
    });

    this.cropView.bind(this.root, {
      onProcess: () => this.processOcr()
    });

    const canvas = this.root.querySelector("[data-role='preview-canvas']");
    this.cropController = new CropController(
      canvas,
      {
        image: this.state.image,
        regions: this.state.regions,
        templateService: this.templateService
      },
      (regions) => {
        this.state.regions = regions;
      }
    );
    this.cropController.mount();
  }

  async processOcr() {
    const canvas = this.createSourceCanvas();
    this.renderProcessing();

    try {
      const { reading, processedRegions } = await this.ocrController.process(canvas, this.state.regions);
      this.renderResult(reading, processedRegions);
    } catch (error) {
      this.renderCrop();
      this.setStatus(error.message || "Falha ao processar OCR.");
    }
  }

  renderResult(reading, processedRegions) {
    this.destroyCropController();
    this.root.innerHTML = this.resultView.render({
      reading,
      regions: processedRegions
    });
  }

  createSourceCanvas() {
    if (!this.state.image) return null;

    const canvas = document.createElement("canvas");
    canvas.width = this.state.image.naturalWidth;
    canvas.height = this.state.image.naturalHeight;
    const context = canvas.getContext("2d");
    context.drawImage(this.state.image, 0, 0);
    return canvas;
  }

  renderLoading(message) {
    this.destroyCropController();
    this.root.innerHTML = `<section class="panel"><div class="loader"></div><p>${message}</p></section>`;
  }

  renderProcessing() {
    this.destroyCropController();
    this.root.innerHTML = `
      <section class="panel">
        <div class="loader"></div>
        <h1>Processando OCR</h1>
        <p data-role="status">Preparando recortes...</p>
      </section>
    `;
  }

  setStatus(message) {
    const status = this.root.querySelector("[data-role='status']");
    if (status) {
      status.textContent = message;
      return;
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2600);
  }

  destroyCropController() {
    if (this.cropController) {
      this.cropController.destroy();
      this.cropController = null;
    }
  }
}
