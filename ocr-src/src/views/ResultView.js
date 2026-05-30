import { FIELD_LABELS, FIELD_UNITS } from "../utils/constants.js";
import { escapeHtml } from "../utils/formatters.js";

export class ResultView {
  render({ reading, regions }) {
    const rows = Object.keys(reading.rawOcr)
      .map((field) => {
        const validation = reading.validation[field] || {};
        const invalidClass = validation.valid ? "" : "invalid";
        const region = regions.find((item) => item.field === field);

        return `
          <div class="result-row ${invalidClass}">
            <div>
              <label for="field-${field}">${FIELD_LABELS[field]}</label>
              <small>OCR bruto: ${escapeHtml(reading.rawOcr[field] || "-")}</small>
            </div>
            <output id="field-${field}">${escapeHtml(validation.value || "")}</output>
            <span>${FIELD_UNITS[field]}</span>
            ${region?.processedDataUrl ? `<img src="${region.processedDataUrl}" alt="Recorte ${FIELD_LABELS[field]}" />` : ""}
            ${validation.message ? `<em>${escapeHtml(validation.message)}</em>` : ""}
          </div>
        `;
      })
      .join("");

    return `
      <section class="panel">
        <div class="toolbar">
          <div>
            <h1>Resultado</h1>
            <p>Campos suspeitos ficam destacados.</p>
          </div>
        </div>
        <div class="results">${rows}</div>
      </section>
    `;
  }
}
