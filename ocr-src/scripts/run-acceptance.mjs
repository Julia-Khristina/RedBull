import { createServer } from "node:http";
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const artifactsDir = path.join(rootDir, "test-artifacts");
const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
].filter(Boolean);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png"
};

const chromePath = chromeCandidates.find((candidate) => existsSync(candidate));
if (!chromePath) {
  throw new Error("Chrome ou Edge nao encontrado nos caminhos padrao.");
}

await mkdir(artifactsDir, { recursive: true });

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url || "/", "http://127.0.0.1");
    const relativePath = decodeURIComponent(requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname);
    const filePath = path.resolve(rootDir, `.${relativePath}`);

    if (!filePath.startsWith(rootDir)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    const body = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream"
    });
    response.end(body);
  } catch (error) {
    response.writeHead(404);
    response.end(error.message || "Not found");
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();

let browser;
try {
  browser = await chromium.launch({
    headless: true,
    executablePath: chromePath
  });
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}/acceptance.html?autorun=1`, {
    waitUntil: "domcontentloaded"
  });
  await page.waitForFunction(
    () => document.body.dataset.acceptanceState === "done" || document.body.dataset.acceptanceState === "error",
    null,
    { timeout: 300000 }
  );

  const pageState = await page.evaluate(() => ({
    state: document.body.dataset.acceptanceState,
    passed: document.body.dataset.acceptancePassed,
    results: window.acceptanceResults || null,
    output: document.querySelector("[data-role='json-output']")?.textContent || ""
  }));

  await page.screenshot({
    path: path.join(artifactsDir, "current-acceptance-page.png"),
    fullPage: true
  });

  if (pageState.state !== "done" || !pageState.results) {
    throw new Error(pageState.output || "Runner de aceitacao terminou sem resultados.");
  }

  await writeFile(
    path.join(artifactsDir, "current-acceptance-results.json"),
    `${JSON.stringify(pageState.results, null, 2)}\n`,
    "utf8"
  );
  await writeFile(
    path.join(rootDir, "wad-ocr-update.md"),
    buildWadMarkdown(pageState.results),
    "utf8"
  );

  console.log(JSON.stringify(pageState.results.summary, null, 2));
} finally {
  if (browser) await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

function buildWadMarkdown(results) {
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
