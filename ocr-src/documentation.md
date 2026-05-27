# Documentacao do prototipo OCR Tesseract.js

## Visao geral

Este prototipo le uma imagem de um painel de esteira e extrai tres valores por OCR:

- `distance`: distancia em km.
- `time`: tempo em min:s.
- `speed`: velocidade em km/h.

A aplicacao roda no navegador, sem backend. O fluxo principal e linear:

1. O usuario seleciona uma imagem.
2. A imagem e carregada como `Image`.
3. O sistema cria tres regioes iniciais por template proporcional.
4. O usuario ajusta as regioes no canvas, se necessario.
5. Cada regiao e recortada da imagem original.
6. Cada recorte e pre-processado com OpenCV.js quando disponivel.
7. O Tesseract.js roda OCR em cada recorte.
8. Os textos retornados sao normalizados e validados.
9. A tela exibe o resultado, o OCR bruto, a validacao e o recorte processado.

## Dependencias externas

As dependencias sao carregadas diretamente em `index.html`:

- OpenCV.js: `https://docs.opencv.org/4.x/opencv.js`
- Tesseract.js v5: `https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js`

O OpenCV.js e usado para melhorar a imagem antes do OCR. Se ele ainda nao estiver carregado ou indisponivel, o sistema continua funcionando e envia o recorte original para o Tesseract.js.

O Tesseract.js e obrigatorio para o OCR. Se ele nao estiver carregado, a aplicacao exibe erro.

## Estrutura de arquivos

```text
index.html
src/main.js
src/controllers/
  AppController.js
  CropController.js
  OCRController.js
  UploadController.js
src/models/
  RegionModel.js
src/services/
  ImageProcessingService.js
  TemplateRegionService.js
  TesseractService.js
  ValidationService.js
src/utils/
  constants.js
  formatters.js
src/views/
  CropView.js
  ResultView.js
  UploadView.js
src/styles/
  global.css
```

## Entrada da aplicacao

### `index.html`

Define o elemento raiz:

```html
<div id="app"></div>
```

Tambem carrega CSS, OpenCV.js, Tesseract.js e o modulo principal:

```html
<script type="module" src="./src/main.js"></script>
```

### `src/main.js`

Cria o controlador principal:

```js
const app = new AppController(document.querySelector("#app"));
app.init();
```

A partir daqui, toda a navegacao de telas e estado fica sob responsabilidade do `AppController`.

## Fluxo de dados completo

### 1. Selecao da imagem

Arquivo principal: `src/views/UploadView.js`

A tela inicial mostra um input de arquivo:

```html
<input type="file" accept="image/*" data-role="image-input" />
```

Quando o usuario seleciona um arquivo, a view chama:

```js
handlers.onFile(file);
```

Esse handler aponta para `AppController.handleFile(file)`.

### 2. Leitura do arquivo

Arquivo principal: `src/controllers/UploadController.js`

O `UploadController` usa `FileReader` para ler o arquivo como Data URL. Depois cria um objeto `Image` e resolve a promessa quando a imagem termina de carregar:

```js
reader.readAsDataURL(file);
image.src = reader.result;
```

Saida dessa etapa:

```js
HTMLImageElement
```

Esse objeto e salvo em:

```js
this.state.image
```

### 3. Criacao das regioes iniciais

Arquivos principais:

- `src/services/TemplateRegionService.js`
- `src/utils/constants.js`
- `src/models/RegionModel.js`

O prototipo nao detecta automaticamente os campos por palavras-chave. Ele usa um template fixo proporcional ao tamanho da imagem.

O template fica em `constants.js`:

```js
export const PANEL_TEMPLATE = {
  distance: { x: 0.107, y: 0.433, w: 0.137, h: 0.121 },
  time: { x: 0.412, y: 0.413, w: 0.137, h: 0.121 },
  speed: { x: 0.728, y: 0.459, w: 0.125, h: 0.121 }
};
```

Cada valor e proporcional:

- `x`: posicao horizontal inicial relativa a largura da imagem.
- `y`: posicao vertical inicial relativa a altura da imagem.
- `w`: largura relativa.
- `h`: altura relativa.

O `TemplateRegionService.createRegions(imageWidth, imageHeight)` converte essas proporcoes em pixels:

```js
x = Math.round(region.x * imageWidth)
y = Math.round(region.y * imageHeight)
width = Math.round(region.w * imageWidth)
height = Math.round(region.h * imageHeight)
```

Cada regiao vira uma instancia de `RegionModel`:

```js
{
  field: "distance" | "time" | "speed",
  x: number,
  y: number,
  width: number,
  height: number,
  source: "template"
}
```

### 4. Ajuste manual no canvas

Arquivos principais:

- `src/views/CropView.js`
- `src/controllers/CropController.js`

A `CropView` renderiza a tela de recorte, a lista das regioes e o canvas:

```html
<canvas data-role="preview-canvas"></canvas>
```

O `CropController` recebe:

```js
{
  image,
  regions,
  templateService
}
```

Ao montar, ele:

1. Ajusta o canvas para o tamanho natural da imagem.
2. Desenha a imagem no canvas.
3. Desenha as caixas verdes das regioes.

Cada regiao pode ser movida ou redimensionada:

- Clique e arraste dentro da caixa: move a regiao.
- Clique e arraste no canto inferior direito: redimensiona a regiao.

O controller converte coordenadas da tela para coordenadas reais do canvas:

```js
x = ((event.clientX - rect.left) / rect.width) * canvas.width
y = ((event.clientY - rect.top) / rect.height) * canvas.height
```

Isso garante que o ajuste funcione mesmo quando o canvas e exibido redimensionado no layout.

Ao mover ou redimensionar, a regiao recebe:

```js
region.source = "manual";
```

Depois, `TemplateRegionService.constrainRegion` limita a regiao aos limites da imagem:

- largura minima: `16`
- altura minima: `16`
- `x` e `y` nao podem sair da imagem
- `width` e `height` nao podem ultrapassar o tamanho da imagem

### 5. Criacao do canvas fonte

Arquivo principal: `src/controllers/AppController.js`

Quando o usuario clica em `Processar OCR`, o `AppController` cria um canvas temporario com a imagem original:

```js
canvas.width = image.naturalWidth;
canvas.height = image.naturalHeight;
context.drawImage(image, 0, 0);
```

Esse canvas e a fonte para todos os recortes.

### 6. Recorte das regioes

Arquivo principal: `src/services/ImageProcessingService.js`

Para cada regiao, o metodo `cropRegion(sourceCanvas, region)` cria um novo canvas:

```js
cropCanvas.width = Math.max(1, Math.round(region.width));
cropCanvas.height = Math.max(1, Math.round(region.height));
```

Depois copia apenas a area da regiao:

```js
context.drawImage(
  sourceCanvas,
  region.x,
  region.y,
  region.width,
  region.height,
  0,
  0,
  cropCanvas.width,
  cropCanvas.height
);
```

Saida de cada recorte:

```js
{
  field,
  x,
  y,
  width,
  height,
  source,
  imageDataUrl,
  processedDataUrl
}
```

Onde:

- `imageDataUrl`: imagem original recortada.
- `processedDataUrl`: imagem recortada apos pre-processamento.

### 7. Pre-processamento da imagem

Arquivo principal: `src/services/ImageProcessingService.js`

O metodo `preprocess(cropCanvas)` melhora cada recorte antes de enviar ao OCR.

Se OpenCV.js nao estiver disponivel:

```js
return cropCanvas.toDataURL("image/png");
```

Se OpenCV.js estiver disponivel, a sequencia e:

1. Ler o canvas como matriz OpenCV:

```js
const src = cv.imread(cropCanvas);
```

2. Converter para escala de cinza:

```js
cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
```

3. Aumentar a imagem em 3x:

```js
cv.resize(gray, resized, new cv.Size(0, 0), 3, 3, cv.INTER_CUBIC);
```

4. Aplicar filtro mediano para reduzir ruido:

```js
cv.medianBlur(resized, blurred, 3);
```

5. Binarizar com threshold fixo `135`:

```js
cv.threshold(blurred, binary, 135, 255, cv.THRESH_BINARY);
```

6. Calcular a media da imagem binaria:

```js
const mean = cv.mean(binary)[0];
```

7. Se a media for menor que `127`, inverter as cores:

```js
cv.bitwise_not(binary, inverted);
```

Essa inversao tenta entregar ao OCR uma imagem com contraste mais favoravel, evitando casos em que o texto fica claro demais ou escuro demais em relacao ao fundo.

8. Converter a matriz final de volta para canvas e Data URL:

```js
cv.imshow(outputCanvas, output);
return outputCanvas.toDataURL("image/png");
```

Todas as matrizes OpenCV sao deletadas no `finally` para liberar memoria:

```js
src.delete();
gray.delete();
resized.delete();
blurred.delete();
binary.delete();
inverted.delete();
```

## OCR

Arquivos principais:

- `src/controllers/OCRController.js`
- `src/services/TesseractService.js`

### Coordenacao

O `OCRController.process(sourceCanvas, regions)` executa:

1. `ImageProcessingService.processRegions`
2. `TesseractService.recognizeRegions`
3. `ValidationService.validateAll`

Retorno:

```js
{
  reading: {
    rawOcr: {
      distance: string,
      time: string,
      speed: string
    },
    validation: {
      distance: ValidationResult,
      time: ValidationResult,
      speed: ValidationResult
    }
  },
  processedRegions: RegionWithImages[]
}
```

### Worker do Tesseract

O `TesseractService` cria um worker uma unica vez e reaproveita nas leituras seguintes:

```js
this.worker = await window.Tesseract.createWorker("eng", 1, { logger });
```

Parametros configurados:

```js
{
  tessedit_char_whitelist: "0123456789:.,",
  tessedit_pageseg_mode: "7"
}
```

Significado:

- `tessedit_char_whitelist`: limita o OCR a numeros, dois-pontos, ponto e virgula.
- `tessedit_pageseg_mode: "7"`: trata o recorte como uma unica linha de texto.

### Ordem de leitura

Para cada regiao, o OCR tenta primeiro a imagem pre-processada:

```js
const processedText = await recognizeImage(region.processedDataUrl, region.field);
```

Se o texto tiver pelo menos um digito, ele e aceito:

```js
hasUsefulText(text) {
  return /[0-9]/.test(text || "");
}
```

Se nao houver digitos, o sistema tenta novamente com o recorte original:

```js
return recognizeImage(region.imageDataUrl, region.field);
```

Isso cria um fallback simples: se o pre-processamento piorar a leitura, a imagem original ainda pode recuperar o valor.

### Tratamento de falhas por campo

Cada campo e lido dentro de `try/catch`. Se um campo falhar, ele recebe string vazia:

```js
entries.push([region.field, ""]);
```

Assim, uma falha em uma regiao nao derruba todo o processamento.

## Normalizacao e validacao

Arquivo principal: `src/services/ValidationService.js`

O OCR pode confundir letras com numeros. A normalizacao corrige alguns casos comuns:

```js
O/o -> 0
S/s -> 5
I/l/| -> 1
```

Tambem remove espacos.

### Distancia e velocidade

Para `distance` e `speed`:

1. Troca virgula por ponto.
2. Remove tudo que nao for numero ou ponto.
3. Converte para `Number`.

Regras:

- valor deve ser numerico;
- valor deve ser maior que `0`;
- `distance` deve ser menor que `100`;
- `speed` deve ser menor que `30`.

Mensagem de erro:

```text
Numero fora do intervalo esperado
```

### Tempo

Para `time`:

1. Remove tudo que nao for numero ou `:`.
2. Valida formato de tempo.

Padroes aceitos:

```text
mm:ss
h:mm:ss
```

Na pratica, o regex aceita:

```js
/^(\d{1,3}:)?\d{1,2}:\d{2}$/
/^\d{1,3}:\d{2}$/
```

Mensagem de erro:

```text
Formato esperado: mm:ss
```

### Resultado de validacao

Cada campo retorna:

```js
{
  value: string,
  valid: boolean,
  message: string
}
```

Se o valor estiver vazio:

```js
{
  value: "",
  valid: false,
  message: "Valor vazio"
}
```

## Renderizacao do resultado

Arquivo principal: `src/views/ResultView.js`

A tela final mostra uma linha por campo:

- nome do campo;
- OCR bruto;
- valor normalizado;
- unidade;
- imagem processada do recorte;
- mensagem de erro, se houver.

Campos invalidos recebem a classe:

```css
result-row invalid
```

Essa classe destaca visualmente a linha.

## Estado da aplicacao

Arquivo principal: `src/controllers/AppController.js`

O estado persistente durante o fluxo e minimo:

```js
this.state = {
  image: null,
  regions: []
};
```

`image` guarda a imagem carregada.

`regions` guarda as caixas atuais, incluindo ajustes manuais feitos pelo usuario.

O resultado do OCR nao fica persistido no estado, porque a aplicacao segue um caminho linear e apenas renderiza a tela final.

## Modelo de regiao

Arquivo principal: `src/models/RegionModel.js`

Formato:

```js
{
  field: string,
  x: number,
  y: number,
  width: number,
  height: number,
  source: string
}
```

Campos:

- `field`: identifica qual valor aquela regiao representa.
- `x`: coordenada horizontal em pixels.
- `y`: coordenada vertical em pixels.
- `width`: largura em pixels.
- `height`: altura em pixels.
- `source`: origem da regiao, como `template` ou `manual`.

## Como a deteccao funciona

No estado atual, "deteccao" significa selecao de regioes por template proporcional mais ajuste manual.

Nao ha deteccao automatica por visao computacional, palavras-chave ou classificacao de candidatos.

O processo e:

1. O template define onde cada campo costuma estar na imagem.
2. As proporcoes sao convertidas para pixels usando o tamanho real da imagem carregada.
3. O usuario pode corrigir as caixas manualmente no canvas.
4. O OCR e executado somente dentro dessas caixas.

Essa abordagem reduz a area analisada pelo OCR e melhora a chance de leitura correta, desde que a imagem tenha layout parecido com o template definido em `PANEL_TEMPLATE`.

## Limitacoes atuais

- O layout esperado do painel precisa ser parecido com o template.
- Nao ha busca automatica de numeros fora das regioes.
- Nao ha persistencia local dos resultados.
- Nao ha botao de voltar, trocar imagem ou refazer apos a tela final.
- O OCR depende do Tesseract.js carregado pela CDN.
- O pre-processamento depende do OpenCV.js; sem ele, o sistema usa o recorte original.

## Como alterar o template

Para ajustar as regioes iniciais, edite `PANEL_TEMPLATE` em `src/utils/constants.js`.

Exemplo:

```js
distance: { x: 0.107, y: 0.433, w: 0.137, h: 0.121 }
```

Se a caixa estiver muito para a esquerda, aumente `x`.

Se estiver muito para cima, aumente `y`.

Se estiver estreita, aumente `w`.

Se estiver baixa, aumente `h`.

Todos os valores sao relativos, indo de `0` a `1`, e sao multiplicados pelo tamanho real da imagem.

## Resumo do pipeline

```text
Arquivo selecionado
  -> FileReader
  -> HTMLImageElement
  -> TemplateRegionService cria regioes em pixels
  -> CropController permite ajuste manual no canvas
  -> AppController cria sourceCanvas com a imagem original
  -> ImageProcessingService recorta cada regiao
  -> ImageProcessingService pre-processa cada recorte com OpenCV.js
  -> TesseractService executa OCR em cada recorte
  -> ValidationService normaliza e valida os textos
  -> ResultView renderiza valores, OCR bruto, validacao e recortes
```
