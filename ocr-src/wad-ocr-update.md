## Evidencias de validacao do OCR

Em 11/06/2026, o prototipo OCR foi validado com as sete imagens em `ocr-src/casos-testes`, usando o pipeline real da aplicacao: deteccao do painel por OpenCV, template proporcional de regioes, pre-processamento dos recortes, Tesseract.js e normalizacao pelo ValidationService.

Resultado consolidado: **4/7 imagens aprovadas**.

| Caso | Distancia esperada | Tempo esperado | Velocidade esperada | Status |
|---|---:|---:|---:|---|
| imagem-ocr-alterada.png | 15.25 | 62:08 | 10.5 | Reprovado |
| imagem-ocr-angulada.png | 10.00 | 45:12 | 12.0 | Reprovado |
| Screenshot From 2026-05-24 11-51-15.png | 0.08 | 9:07 | 0.5 | Aprovado |
| Screenshot From 2026-05-24 14-07-17.png | 0.04 | 5:06 | 0.5 | Reprovado |
| Screenshot From 2026-05-24 14-30-21.png | 0.08 | 9:07 | 0.5 | Aprovado |
| Screenshot From 2026-05-24.png | 5.20 | 35:45 | 10.0 | Aprovado |
| Screenshot From 2026-05-25 00-22-50.png | 0.08 | 9:07 | 0.5 | Aprovado |

Os artefatos detalhados ficam em `ocr-src/test-artifacts/current-acceptance-results.json`, com OCR bruto, valores normalizados, regioes usadas e diagnosticos por campo.
