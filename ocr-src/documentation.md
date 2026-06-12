# Documentacao do prototipo OCR Tesseract.js

Este arquivo e a referencia principal do funcionamento do sistema. As explicacoes de arquitetura, selecao de areas, variacoes suportadas, pre-processamento e validacao estao centralizadas aqui para evitar divergencia entre documentos.

## Visao geral

Este prototipo le uma imagem de um painel de esteira e extrai tres valores por OCR:

- `distance`: distancia em km.
- `time`: tempo em min:s.
- `speed`: velocidade em km/h.

A aplicacao roda no navegador, sem backend. O sistema atual parte de um pressuposto importante:

```text
O formato geral do painel ja e conhecido, mas a foto pode variar em luz,
contraste, tamanho, localizacao, leve angulacao e nitidez.
```

Por isso, a aplicacao nao usa mais apenas regioes fixas sobre a imagem inteira. O fluxo atual e hibrido:

```text
OpenCV localiza a area util do painel
  -> template proporcional calcula onde ficam os tres valores
  -> OpenCV prepara cada recorte para OCR
  -> Tesseract.js le os numeros
  -> ValidationService normaliza e valida o resultado
```

Se a deteccao automatica do painel falhar, o sistema usa fallback: aplica o mesmo template proporcional sobre a imagem inteira.

## Dependencias externas

As dependencias sao carregadas diretamente em `index.html`:

- OpenCV.js: `https://docs.opencv.org/4.x/opencv.js`
- Tesseract.js v5: `https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js`

O OpenCV.js e usado em duas etapas:

- detectar o retangulo util do painel;
- melhorar cada recorte antes do OCR.

Se o OpenCV.js ainda nao estiver carregado ou estiver indisponivel, a aplicacao continua com o fallback de template sobre a imagem inteira e envia os recortes sem pre-processamento OpenCV.

O Tesseract.js e obrigatorio para executar o OCR. Se ele nao estiver carregado, a leitura nao pode ser feita.

## Estrutura de arquivos

```text
index.html
documentation.md
casos-teste/
docs/
  selecao-de-areas.md
  variacoes-suportadas.md
  assets/selecao-areas/
generated-panel-dataset/
test-artifacts/
Versão antiga/
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

Arquivos de apoio:

- `docs/assets/selecao-areas/`: imagens usadas nesta documentacao para mostrar as fases do processamento.
- `docs/selecao-de-areas.md`: ponteiro para esta documentacao principal.
- `docs/variacoes-suportadas.md`: ponteiro para esta documentacao principal.
- `test-artifacts/current-acceptance-results.json`: evidencia da validacao atual.
- `Versão antiga/`: copia da versao anterior, mantida como referencia historica.

## Como rodar

Como o projeto e estatico, basta servir a pasta do repositorio:

```powershell
python -m http.server 8000
```

Depois abra:

```text
http://localhost:8000/
```

Se o navegador estiver com cache antigo, use uma query string para forcar recarregamento:

```text
http://localhost:8000/?v=2
```

## Fases visuais do funcionamento

As imagens abaixo mostram, visualmente, como a aplicacao transforma uma foto original em regioes prontas para OCR.

### Fase 1: imagem original

Nesta fase, a aplicacao ainda nao sabe onde estao os numeros. Ela apenas recebeu a imagem enviada pelo usuario.

![Imagens originais](docs/assets/selecao-areas/fase-01-imagens-originais.png)

### Fase 2: painel detectado

O OpenCV separa a area util da imagem e gera um retangulo maior ao redor do painel. Esse retangulo e a base para calcular as regioes internas.

![Painel detectado](docs/assets/selecao-areas/fase-02-painel-detectado.png)

### Fase 3: regioes escolhidas para OCR

Depois que o painel e encontrado, o template proporcional cria as tres caixas dos campos `distance`, `time` e `speed`.

![Regioes de OCR](docs/assets/selecao-areas/fase-03-regioes-ocr.png)

### Fase 4: recortes gerados

Cada caixa vira um recorte independente. O OCR nao recebe a imagem inteira; recebe apenas os pequenos trechos onde os numeros devem estar.

![Recortes das regioes](docs/assets/selecao-areas/fase-04-recortes.png)

### Fase 5: pre-processamento antes do OCR

Antes de chamar o Tesseract, cada recorte e convertido, ampliado, filtrado e binarizado para facilitar a leitura dos numeros.

![Pre-processamento dos recortes](docs/assets/selecao-areas/fase-05-pre-processamento.png)

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

A partir daqui, a navegacao de telas e o estado ficam sob responsabilidade do `AppController`.

## Fluxo de dados completo

### 1. Selecao da imagem

Arquivo principal: `src/views/UploadView.js`

A tela inicial mostra um input de arquivo:

```html
<input type="file" accept="image/*" data-role="image-input" />
```

Quando o usuario seleciona uma imagem, a view chama:

```js
handlers.onFile(file);
```

Esse handler aponta para `AppController.handleFile(file)`.

### 2. Leitura do arquivo

Arquivo principal: `src/controllers/UploadController.js`

O `UploadController` usa `FileReader` para ler o arquivo como Data URL. Depois cria um `HTMLImageElement` e resolve a promessa quando a imagem termina de carregar.

Saida dessa etapa:

```text
HTMLImageElement
```

Esse objeto e salvo em:

```js
this.state.image
```

### 3. Deteccao automatica do painel

Arquivos principais:

- `src/services/TemplateRegionService.js`
- `src/utils/constants.js`

Depois que a imagem carrega, o `AppController` chama:

```js
this.state.regions = await this.templateService.createRegionsFromImage(image);
```

O `TemplateRegionService` cria um canvas temporario com a imagem original, espera o OpenCV por ate 3 segundos e tenta detectar o painel com:

```js
detectPanelBounds(canvas)
```

O processo de deteccao e:

```text
canvas original
  -> cv.imread
  -> conversao para escala de cinza
  -> threshold com valor 28
  -> findContours
  -> boundingRect de cada contorno relevante
  -> uniao dos retangulos encontrados
  -> validacao de area e proporcao
  -> padding de 1% ao redor do painel
```

Essa etapa existe porque as primeiras versoes calculavam as regioes diretamente sobre a largura e altura da imagem inteira. Isso funcionava quando o enquadramento era sempre igual, mas falhava quando apareciam bordas, deslocamentos, margens extras ou mudancas de escala. Agora as caixas seguem o painel detectado, nao a imagem inteira.

Contornos muito pequenos sao ignorados:

```js
if (current.width * current.height < 64) continue;
```

O painel detectado so e aceito se:

- ocupar pelo menos `25%` da area total da imagem;
- tiver proporcao entre `1.35` e `2.8`.

Esses limites ficam em `PANEL_VARIATION_LIMITS.size`.

Quando a deteccao funciona, o retangulo base recebe:

```js
source: "opencv"
```

Quando falha, o fallback usa a imagem inteira:

```js
{
  x: 0,
  y: 0,
  width: imageWidth,
  height: imageHeight,
  source: "template"
}
```

### 3.1. Exemplo conceitual da deteccao

Imagine que o OpenCV detecte este painel dentro da imagem:

```text
Painel detectado:
  x = 100
  y = 40
  width = 1200
  height = 700
```

O campo `distance` usa este template:

```text
x = 0.107
y = 0.433
w = 0.137
h = 0.121
```

Entao a regiao final fica:

```text
x = 100 + 0.107 * 1200
y = 40 + 0.433 * 700
width = 0.137 * 1200
height = 0.121 * 700
```

O mesmo raciocinio vale para `time` e `speed`.

### 4. Template proporcional das regioes

Depois de existir um retangulo base, seja ele vindo do OpenCV ou do fallback, o sistema aplica o template proporcional.

O template fica em `src/utils/constants.js`:

```js
export const PANEL_TEMPLATE = {
  distance: { x: 0.107, y: 0.433, w: 0.137, h: 0.121 },
  time: { x: 0.412, y: 0.413, w: 0.137, h: 0.121 },
  speed: { x: 0.728, y: 0.459, w: 0.125, h: 0.121 }
};
```

Cada valor e relativo ao retangulo do painel:

- `x`: posicao horizontal inicial dentro do painel.
- `y`: posicao vertical inicial dentro do painel.
- `w`: largura relativa.
- `h`: altura relativa.

A conversao para pixels e feita assim:

```js
x = bounds.x + region.x * bounds.width
y = bounds.y + region.y * bounds.height
width = region.w * bounds.width
height = region.h * bounds.height
```

### 5. Folga nas regioes de OCR

Depois de converter o template para pixels, cada regiao recebe uma folga horizontal. Isso ajuda quando o OCR precisa de um pouco mais de contexto nas laterais dos numeros.

As folgas ficam em `OCR_REGION_PADDING`:

```js
export const OCR_REGION_PADDING = {
  distance: { x: 0.1, y: 0 },
  time: { x: 0.18, y: 0 },
  speed: { x: 0.04, y: 0 }
};
```

Na pratica:

- `distance`: aumenta `10%` da largura para cada lado.
- `time`: aumenta `18%` da largura para cada lado.
- `speed`: aumenta `4%` da largura para cada lado.
- nenhuma regiao recebe padding vertical no estado atual.

Depois disso, `constrainRegion` garante que a caixa continue dentro da imagem.

### 5.1. Restricao aos limites da imagem

Depois de criar, expandir, mover ou redimensionar uma regiao, o sistema chama `constrainRegion`.

Esse metodo garante que:

- a largura minima seja `16`;
- a altura minima seja `16`;
- `x` nao fique fora da imagem;
- `y` nao fique fora da imagem;
- a caixa nao ultrapasse a largura ou altura da imagem.

Isso evita regioes invalidas para recorte e OCR.

### 6. Modelo de regiao

Cada regiao vira uma instancia de `RegionModel`:

```js
{
  field: "distance" | "time" | "speed",
  x: number,
  y: number,
  width: number,
  height: number,
  source: "opencv" | "template" | "manual"
}
```

O campo `source` indica a origem da caixa:

- `opencv`: criada apos detectar o painel com OpenCV;
- `template`: criada pelo fallback sobre a imagem inteira;
- `manual`: alterada pelo usuario no canvas.

## Tela de recorte

Arquivos principais:

- `src/views/CropView.js`
- `src/controllers/CropController.js`

A `CropView` renderiza o canvas e a lista das regioes.

O `CropController`:

1. ajusta o canvas para o tamanho natural da imagem;
2. desenha a imagem original;
3. desenha uma caixa verde para cada regiao;
4. permite mover e redimensionar as caixas.

Cada caixa pode ser editada manualmente:

- arrastar dentro da caixa move a regiao;
- arrastar a alca no canto inferior direito redimensiona a regiao.

Quando isso acontece:

```js
region.source = "manual";
```

O canvas pode aparecer redimensionado na tela, mas internamente usa a resolucao real da imagem. Por isso o `CropController` converte coordenadas do mouse para coordenadas reais:

```js
x = ((event.clientX - rect.left) / rect.width) * canvas.width
y = ((event.clientY - rect.top) / rect.height) * canvas.height
```

## Botao "Reencontrar regioes"

Na tela de recorte existe o botao:

```text
Reencontrar regioes
```

Ele chama:

```js
AppController.redetectRegions()
```

Esse metodo:

1. verifica se existe imagem carregada;
2. mostra a mensagem `Reencontrando regioes...`;
3. chama `createRegionsFromImage(image)` novamente;
4. substitui as regioes atuais;
5. renderiza a tela de recorte de novo.

Esse botao serve para descartar ajustes manuais e recalcular as caixas automaticamente.

## Como a selecao de areas se relaciona com OCR

A selecao das areas e decisiva porque o OCR nao processa a imagem inteira. Depois que as regioes estao definidas, o `ImageProcessingService` recorta cada caixa da imagem original:

```text
sourceCanvas + region
  -> cropRegion
  -> canvas menor apenas com o numero
  -> preprocess
  -> Tesseract
```

Quanto melhor a caixa, menor a chance de o OCR ler labels, unidades, icones ou ruido. Por isso o sistema usa tres camadas de protecao:

1. detecta o painel antes de aplicar o template;
2. adiciona folgas horizontais especificas por campo;
3. permite ajuste manual ou redeteccao automatica.

## Criacao dos recortes

Arquivo principal: `src/services/ImageProcessingService.js`

Quando o usuario clica em `Processar OCR`, o `AppController` cria um canvas temporario com a imagem original:

```js
canvas.width = image.naturalWidth;
canvas.height = image.naturalHeight;
context.drawImage(image, 0, 0);
```

Para cada regiao, `cropRegion(sourceCanvas, region)` cria um canvas menor contendo apenas aquela area.

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

- `imageDataUrl`: recorte original.
- `processedDataUrl`: recorte apos pre-processamento.

## Pre-processamento adaptativo

Arquivo principal: `src/services/ImageProcessingService.js`

O metodo `preprocess(cropCanvas)` prepara cada recorte antes do Tesseract.

Se o OpenCV.js nao estiver disponivel:

```js
return cropCanvas.toDataURL("image/png");
```

Se o OpenCV.js estiver disponivel, a sequencia atual e:

```text
recorte
  -> escala de cinza
  -> medicao de media e desvio padrao
  -> equalizacao se luz/contraste estiver fora da faixa
  -> ampliacao 3x
  -> medianBlur
  -> threshold Otsu
  -> inversao se a imagem binaria ficar majoritariamente escura
```

A etapa de equalizacao usa:

```js
cv.meanStdDev(gray, mean, stdDev);
```

Se a media estiver abaixo de `8%`, acima de `92%`, ou se o contraste ficar abaixo de `6%`, o sistema aplica:

```js
cv.equalizeHist(gray, enhanced);
```

Depois o recorte e ampliado pelo fator definido em `PANEL_VARIATION_LIMITS.sharpness.resizeFactor`, atualmente `3`.

A binarizacao usa Otsu:

```js
cv.threshold(blurred, binary, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);
```

Ou seja, o threshold nao e mais um valor fixo. Ele e calculado automaticamente para cada recorte.

## OCR

Arquivos principais:

- `src/controllers/OCRController.js`
- `src/services/TesseractService.js`

O `OCRController.process(sourceCanvas, regions)` executa:

1. `ImageProcessingService.processRegions`
2. `TesseractService.recognizeRegions`
3. `ValidationService.validateAll`

O `TesseractService` cria um worker e reaproveita nas leituras seguintes.

Parametros principais:

```js
{
  tessedit_char_whitelist: "0123456789:.,",
  tessedit_pageseg_mode: "7"
}
```

Significado:

- `tessedit_char_whitelist`: limita o OCR a numeros, dois-pontos, ponto e virgula.
- `tessedit_pageseg_mode: "7"`: trata o recorte como uma unica linha de texto.

Para cada campo, o OCR tenta primeiro o recorte pre-processado. Se nao encontrar nenhum digito util, tenta novamente o recorte original.

## Normalizacao e validacao

Arquivo principal: `src/services/ValidationService.js`

O OCR pode confundir letras com numeros. A normalizacao corrige alguns casos comuns:

```text
O/o -> 0
S/s -> 5
I/l/| -> 1
```

Tambem remove espacos.

### Distancia e velocidade

Para `distance` e `speed`:

1. troca virgula por ponto;
2. remove tudo que nao for numero ou ponto;
3. recupera alguns decimais perdidos pelo OCR;
4. converte para numero na validacao.

Regras de recuperacao:

```text
05   -> 0.5
006  -> 0.06
520  -> 5.20   para distance
100  -> 10.0   para speed
```

Regras de validade:

- valor deve ser numerico;
- valor deve ser maior que `0`;
- `distance` deve ser menor que `100`;
- `speed` deve ser menor que `30`.

### Tempo

Para `time`, a normalizacao remove tudo que nao for numero ou `:`.

Padroes aceitos:

```text
mm:ss
h:mm:ss
```

Na pratica, os regex aceitos sao:

```js
/^(\d{1,3}:)?\d{1,2}:\d{2}$/
/^\d{1,3}:\d{2}$/
```

## Variacoes suportadas

As faixas atuais ficam em `PANEL_VARIATION_LIMITS`, dentro de `src/utils/constants.js`.

| Variacao | Limite atual | Como o sistema lida |
|---|---:|---|
| Luz | media entre `8%` e `92%` | Fora dessa faixa, o recorte passa por equalizacao. |
| Contraste | desvio minimo de `6%` | Baixo contraste tambem aciona equalizacao. |
| Tamanho/local | painel com pelo menos `25%` da imagem | Margens e deslocamentos sao aceitos se o painel continuar sendo a area principal. |
| Proporcao | aspecto entre `1.35` e `2.8` | Evita aceitar ruido ou cortes muito diferentes como painel. |
| Angulacao | ate cerca de `6 graus` | Nao ha deskew completo; a tolerancia vem do retangulo detectado, folgas e OCR. |
| Nitidez | ampliacao `3x` | O recorte e ampliado antes do OCR para compensar baixa resolucao ou leve desfoque. |

Essas faixas nao significam que o sistema reconhece qualquer imagem. Elas definem a variacao permitida para o mesmo layout de painel. Se o painel mudar radicalmente de estrutura, o `PANEL_TEMPLATE` precisa ser recalibrado.

## Como o sistema se adapta a cada variacao

### Luz

O sistema mede a media dos pixels em escala de cinza. Se o recorte estiver muito escuro ou muito claro, aplica `equalizeHist` antes da binarizacao.

Limite atual:

```text
media minima: 8%
media maxima: 92%
```

### Contraste

O sistema mede o desvio padrao do recorte. Se o contraste estiver baixo, tambem aplica `equalizeHist`.

Limite atual:

```text
desvio padrao minimo: 6%
```

### Tamanho e localizacao

O painel pode estar deslocado ou com margens, desde que continue sendo a area principal da imagem.

Limite atual:

```text
area minima do painel: 25% da imagem
```

### Proporcao

O retangulo detectado precisa ter proporcao parecida com a do painel esperado.

Limite atual:

```text
aspect ratio minimo: 1.35
aspect ratio maximo: 2.8
```

### Angulacao

A tolerancia de angulo e leve. O sistema nao faz correcao completa de perspectiva, mas pequenas rotacoes ainda podem funcionar por causa do retangulo detectado, das folgas laterais e do OCR.

Limite de referencia:

```text
ate cerca de 6 graus
```

### Nitidez

Todo recorte e ampliado antes do OCR.

Limite atual:

```text
resizeFactor: 3
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

`regions` guarda as caixas atuais, incluindo caixas detectadas automaticamente e ajustes manuais.

## Validacao atual

O conjunto de aceitacao atual e composto pelas quatro fotos reais do repositorio e pela imagem de teste gerada pelo Gemini:

- `Screenshot From 2026-05-24 11-51-15.png`
- `Screenshot From 2026-05-24 14-07-17.png`
- `Screenshot From 2026-05-24 14-30-21.png`
- `Screenshot From 2026-05-25 00-22-50.png`
- `casos-teste/teste-imagem-gerada-gemini.jpg`

Resultado registrado:

```text
5/5 imagens passaram.
```

Evidencia:

```text
test-artifacts/current-acceptance-results.json
```

## Como alterar o template ou os limites

Para ajustar as regioes iniciais, edite `PANEL_TEMPLATE` em `src/utils/constants.js`.

Exemplo:

```js
distance: { x: 0.107, y: 0.433, w: 0.137, h: 0.121 }
```

Se a caixa estiver muito para a esquerda, aumente `x`.

Se estiver muito para cima, aumente `y`.

Se estiver estreita, aumente `w`.

Se estiver baixa, aumente `h`.

Para ajustar as variacoes permitidas, edite `PANEL_VARIATION_LIMITS`:

```js
export const PANEL_VARIATION_LIMITS = {
  lighting: {
    minMeanRatio: 0.08,
    maxMeanRatio: 0.92
  },
  contrast: {
    minStdDevRatio: 0.06
  },
  size: {
    minPanelAreaRatio: 0.25,
    maxPanelAreaRatio: 1,
    minAspectRatio: 1.35,
    maxAspectRatio: 2.8
  },
  angle: {
    maxAbsDegrees: 6
  },
  sharpness: {
    resizeFactor: 3
  }
};
```

Ao alterar qualquer valor, o ideal e rodar novamente os casos de aceitacao e comparar com `test-artifacts/current-acceptance-results.json`.

## Limitacoes atuais

- O layout geral do painel precisa continuar parecido com `PANEL_TEMPLATE`.
- O sistema nao tenta reconhecer qualquer tela arbitraria.
- A tolerancia de angulacao e leve; nao existe correcao geometrica completa de perspectiva.
- Nao ha persistencia local dos resultados.
- O OCR depende do Tesseract.js carregado pela CDN.
- Sem OpenCV.js, a aplicacao usa fallback de regioes por template e perde a deteccao automatica do painel.

## Resumo do pipeline

```text
Arquivo selecionado
  -> FileReader
  -> HTMLImageElement
  -> TemplateRegionService tenta detectar painel com OpenCV
  -> TemplateRegionService aplica template proporcional no painel detectado
  -> OCR_REGION_PADDING amplia as caixas
  -> CropController permite ajuste manual e redeteccao
  -> AppController cria sourceCanvas com a imagem original
  -> ImageProcessingService recorta cada regiao
  -> ImageProcessingService pre-processa cada recorte com OpenCV.js
  -> TesseractService executa OCR em cada recorte
  -> ValidationService normaliza e valida os textos
  -> ResultView renderiza valores, OCR bruto, validacao e recortes
```
