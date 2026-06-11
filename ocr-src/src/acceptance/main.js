import { AcceptanceRunner } from "./AcceptanceRunner.js";

const app = document.querySelector("#acceptance-app");
let currentResults = null;

renderShell();

if (new URLSearchParams(window.location.search).get("autorun") === "1") {
  runAcceptance();
}

function renderShell() {
  app.innerHTML = `
    <section class="shell">
      <div class="toolbar">
        <div>
          <h1>Aceitacao OCR</h1>
          <p>Executa as 7 imagens de casos-testes contra o pipeline real do app.</p>
        </div>
        <div class="actions">
          <button data-action="run">Rodar aceitacao</button>
          <button class="secondary" data-action="download-json" disabled>Baixar JSON</button>
          <button class="secondary" data-action="download-wad" disabled>Baixar texto WAD</button>
        </div>
      </div>
      <div class="summary" data-role="summary">
        <div class="metric"><strong>-</strong><small>Total</small></div>
        <div class="metric"><strong>-</strong><small>Passaram</small></div>
        <div class="metric"><strong>-</strong><small>Falharam</small></div>
        <div class="metric"><strong>Aguardando</strong><small>Status</small></div>
      </div>
      <div class="case-list" data-role="case-list"></div>
      <div class="json-panel">
        <pre data-role="json-output">Clique em "Rodar aceitacao" para iniciar.</pre>
      </div>
    </section>
  `;

  app.querySelector("[data-action='run']").addEventListener("click", runAcceptance);
  app.querySelector("[data-action='download-json']").addEventListener("click", () => {
    downloadText("current-acceptance-results.json", JSON.stringify(currentResults, null, 2));
  });
  app.querySelector("[data-action='download-wad']").addEventListener("click", () => {
    downloadText("wad-ocr-update.md", buildWadMarkdown(currentResults));
  });
}

async function runAcceptance() {
  const runButton = app.querySelector("[data-action='run']");
  runButton.disabled = true;
  setStatus("Rodando");
  app.querySelector("[data-role='case-list']").innerHTML = "";
  app.querySelector("[data-role='json-output']").textContent = "Preparando dependencias...";

  try {
    const runner = new AcceptanceRunner({
      onProgress: (event) => {
        if (event.type === "case-start") {
          setStatus(`Lendo ${event.case}`);
        }
        if (event.type === "ocr-progress") {
          setStatus(`OCR ${event.field}: ${Math.round(event.progress * 100)}%`);
        }
      }
    });
    currentResults = await runner.run();
    window.acceptanceResults = currentResults;
    document.body.dataset.acceptanceState = "done";
    document.body.dataset.acceptancePassed = String(currentResults.summary.failed === 0);
    renderResults(currentResults);
  } catch (error) {
    document.body.dataset.acceptanceState = "error";
    app.querySelector("[data-role='json-output']").textContent = error.stack || error.message;
    setStatus("Erro");
  } finally {
    runButton.disabled = false;
  }
}

function renderResults(results) {
  const { summary } = results;
  app.querySelector("[data-role='summary']").innerHTML = `
    <div class="metric"><strong>${summary.total}</strong><small>Total</small></div>
    <div class="metric"><strong class="pass">${summary.passed}</strong><small>Passaram</small></div>
    <div class="metric"><strong class="${summary.failed ? "fail" : "pass"}">${summary.failed}</strong><small>Falharam</small></div>
    <div class="metric"><strong>${summary.failed ? "Falha" : "Aprovado"}</strong><small>Status</small></div>
  `;

  app.querySelector("[data-role='case-list']").innerHTML = results.cases
    .map(renderCase)
    .join("");
  app.querySelector("[data-role='json-output']").textContent = JSON.stringify(results, null, 2);
  app.querySelector("[data-action='download-json']").disabled = false;
  app.querySelector("[data-action='download-wad']").disabled = false;
}

function renderCase(result) {
  const rows = result.diagnostics.fieldResults
    .map((field) => `
      <div class="field-row">
        <span>${field.field}</span>
        <span>${field.expected}</span>
        <span>${field.actual || "-"}</span>
        <span>${field.valid ? "valido" : "invalido"}</span>
        <strong class="${field.pass ? "pass" : "fail"}">${field.pass ? "OK" : "Falha"}</strong>
      </div>
    `)
    .join("");
  const evidence = result.evidence.length
    ? `<div class="evidence">${result.evidence.map(renderEvidence).join("")}</div>`
    : "";

  return `
    <article class="case-card">
      <div class="case-header">
        <span>${result.case}</span>
        <span>Esperado</span>
        <span>Obtido</span>
        <span>Validacao</span>
        <strong class="${result.pass ? "pass" : "fail"}">${result.pass ? "OK" : "Falha"}</strong>
      </div>
      ${rows}
      <div class="field-row">
        <small>Diagnostico</small>
        <small>${result.diagnostics.cause}</small>
      </div>
      ${evidence}
    </article>
  `;
}

function renderEvidence(item) {
  return `
    <figure>
      <figcaption>${item.field}</figcaption>
      <img src="${item.processed}" alt="Recorte processado ${item.field}" />
    </figure>
  `;
}

function setStatus(status) {
  const summary = app.querySelector("[data-role='summary']");
  if (!summary) return;
  const metrics = summary.querySelectorAll(".metric strong");
  const statusMetric = metrics[3];
  if (statusMetric) {
    statusMetric.textContent = status;
  }
}

function downloadText(fileName, content) {
  const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function buildWadMarkdown(results) {
  if (!results) return "";

  const rows = results.cases
    .map((item) => {
      const status = item.pass ? "Aprovado" : "Reprovado";
      return `| ${item.case} | ${item.expected.distance} | ${item.expected.time} | ${item.expected.speed} | ${status} |`;
    })
    .join("\n");

  return `## Evidencias de validacao do OCR

Em 11/06/2026, o prototipo OCR foi validado com as sete imagens em \`ocr-src/casos-testes\`, usando o pipeline real da aplicacao: deteccao do painel por OpenCV, template proporcional de regioes, pre-processamento dos recortes, Tesseract.js e normalizacao pelo ValidationService.

Resultado consolidado: **${results.summary.passed}/${results.summary.total} imagens aprovadas**.

| Caso | Distancia esperada | Tempo esperado | Velocidade esperada | Status |
|---|---:|---:|---:|---|
${rows}

Os artefatos detalhados ficam em \`ocr-src/test-artifacts/current-acceptance-results.json\`, com OCR bruto, valores normalizados, regioes usadas e diagnosticos por campo.
`;
}
