import { FIELD_LABELS, FIELD_UNITS } from "../utils/constants.js";

export class CropView {
  render({ regions }) {
    const regionRows = regions
      .map((region) => {
        return `
          <li class="region-row" data-field="${region.field}">
            <strong>${FIELD_LABELS[region.field]}</strong>
            <small>${FIELD_UNITS[region.field]} - ${region.source}</small>
          </li>
        `;
      })
      .join("");

    return `
      <section class="workspace">
        <aside class="sidebar">
          <h2>Regioes</h2>
          <p class="muted">Ajuste manualmente as caixas verdes para selecionar apenas os numeros antes do OCR.</p>
          <ul class="region-list">${regionRows}</ul>
          <button class="secondary" data-action="redetect">Reencontrar regioes</button>
          <button class="primary" data-action="process">Processar OCR</button>
        </aside>
        <main class="canvas-panel">
          <canvas data-role="preview-canvas"></canvas>
        </main>
      </section>
    `;
  }

  bind(container, handlers) {
    container.querySelector("[data-action='redetect']").addEventListener("click", handlers.onRedetect);
    container.querySelector("[data-action='process']").addEventListener("click", handlers.onProcess);
  }
}
