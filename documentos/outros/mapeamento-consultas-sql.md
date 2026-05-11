# Mapeamento de Consultas SQL Compostas

Documento preparatório que identifica os endpoints da seção 3.1.4
do WAD (Matriz RF → RN → Endpoint) que dependem de consultas SQL
compostas, justifica cada consulta pelos RFs/RNs que atende e
descreve as entidades e relacionamentos do DER (seções 3.6.2 e
3.6.3) que ela percorre. Serve como base para a redação das
expressões SQL e da lógica proposicional na seção 3.6.4 do WAD.

## 1. Critério de classificação

Uma consulta foi considerada **composta** quando atende a pelo
menos uma das condições abaixo:

- percorre duas ou mais tabelas via `JOIN` ou subconsulta correlacionada;
- agrega registros com `GROUP BY`, funções de janela (`OVER (...)`)
  ou CTEs (`WITH ...`);
- aplica filtros condicionais sobre derivações estatísticas
  (ex.: comparação de um valor com a média histórica do mesmo atleta).

Endpoints simples de escrita (`POST`/`PUT`/`DELETE` em uma única
tabela) e leituras diretas por chave primária foram desconsiderados,
exceto quando o retorno demanda agregação ou junção.

## 2. Endpoints analisados na seção 3.1.4

Foram analisados os 20 endpoints do Quadro 19. Cinco deles
exigem consultas SQL compostas e estão detalhados na seção 3.
Os demais executam operações pontuais (criação, atualização ou
exclusão em uma única tabela, ou autenticação) e não compõem
o escopo deste mapeamento.

## 3. Consultas Compostas Mapeadas

### 3.1. Q01 — Ranking de equipes em tempo quase real

| Campo                  | Conteúdo                                                                 |
|------------------------|--------------------------------------------------------------------------|
| Função de negócio      | Ranking                                                                  |
| Endpoint               | `GET /competitions/:id/ranking`                                          |
| RF atendido            | RF010, RF015                                                             |
| RNs justificadas       | RN09 (atualização a cada checkpoint no painel administrativo), RN11 (recálculo de pace médio e distância total acumulada a cada 5 minutos) |
| Tabelas percorridas    | `competicao` ⨝ `equipe` ⨝ `corredor` ⨝ `checkpoint`                      |
| Relacionamentos do DER | `equipe.competicao_id → competicao.id` (1:N), `corredor.equipe_id → equipe.id` (1:N), `checkpoint.corredor_id → corredor.id` (1:N) |
| Operações compostas    | Agregação por equipe — `SUM(checkpoint.km)`, `AVG(checkpoint.pace)`, `MAX(checkpoint.criado_em)`; ordenação decrescente pela distância acumulada; filtro pela competição da URL |

**Justificativa:** o ranking exige somar a distância de todos os
checkpoints de todos os corredores de cada equipe e ordenar o
resultado. Não há como atender RF010/RF015 sem percorrer os quatro
níveis hierárquicos do DER em uma única consulta agregada.

---

### 3.2. Q02 — Detecção de inconsistências em checkpoints capturados via OCR

| Campo                  | Conteúdo                                                                 |
|------------------------|--------------------------------------------------------------------------|
| Função de negócio      | Inconsistências                                                          |
| Endpoint               | `GET /competitions/:id/checkpoints/inconsistencies`                      |
| RF atendido            | RF009                                                                    |
| RNs justificadas       | RN06 (valores que divergirem da média histórica do atleta ou da meta da prova devem ser destacados) |
| Tabelas percorridas    | `checkpoint` ⨝ `corredor` ⨝ `equipe` ⨝ `competicao`                       |
| Relacionamentos do DER | `checkpoint.corredor_id → corredor.id`, `checkpoint.competicao_id → competicao.id`, `corredor.equipe_id → equipe.id` |
| Operações compostas    | Subconsulta correlacionada ou CTE para calcular `AVG(pace)` e `AVG(km)` históricos por `corredor_id`; comparação do checkpoint atual com o desvio configurado em relação à média; filtro pelos checkpoints da competição da URL |

**Justificativa:** identificar inconsistências exige confrontar
cada checkpoint com a média histórica do mesmo atleta. Isso só
é possível com uma consulta composta que combine a leitura do
checkpoint corrente com uma agregação derivada da própria tabela
`checkpoint`, restrita ao mesmo `corredor_id`.

---

### 3.3. Q03 — Exportação completa da competição em CSV

| Campo                  | Conteúdo                                                                 |
|------------------------|--------------------------------------------------------------------------|
| Função de negócio      | Exportação                                                               |
| Endpoint               | `GET /competitions/:id/exports`                                          |
| RF atendido            | RF013                                                                    |
| RNs justificadas       | RN15 (exportação deve incluir todos os checkpoints com timestamps, referências às fotos vinculadas e logs de validação para auditoria) |
| Tabelas percorridas    | `competicao` ⨝ `equipe` ⨝ `corredor` ⨝ `checkpoint` ⨝ `esteira` ⨝ `administrador` |
| Relacionamentos do DER | Toda a cadeia hierárquica (`competicao` → `equipe` → `corredor` → `checkpoint`) acrescida de `checkpoint.esteira_id → esteira.id` e `administrador.checkpoint_id → checkpoint.id` para o log de auditoria |
| Operações compostas    | `LEFT JOIN` com `administrador` (nem todo checkpoint passa por auditoria); leitura do campo `checkpoint.imagem` (JSON) para extração das referências de foto; ordenação por `checkpoint.criado_em` |

**Justificativa:** o CSV de auditoria precisa de uma linha por
checkpoint contendo dados de seis entidades distintas. É a
consulta de maior amplitude do sistema e a única que percorre o
DER inteiro em uma única leitura.

---

### 3.4. Q04 — Relatórios de highlights pós-evento

| Campo                  | Conteúdo                                                                 |
|------------------------|--------------------------------------------------------------------------|
| Função de negócio      | Relatórios                                                               |
| Endpoint               | `GET /competitions/:id/reports`                                          |
| RF atendido            | RF014                                                                    |
| RNs justificadas       | RN16 (geração automática ao encerrar a competição), RN17 (recordes nas categorias individual, por equipe e geral da edição) |
| Tabelas percorridas    | `competicao` ⨝ `equipe` ⨝ `corredor` ⨝ `checkpoint`                       |
| Relacionamentos do DER | `equipe.competicao_id → competicao.id`, `corredor.equipe_id → equipe.id`, `checkpoint.corredor_id → corredor.id` |
| Operações compostas    | Múltiplas agregações em uma mesma consulta — recordes individuais (`MIN(pace)`, `MAX(km)`, `MIN(tempo)` por `corredor_id`), por equipe (`SUM(km)`, `STDDEV(pace)` como métrica de consistência), geral (recordes absolutos da competição); funções de janela (`ROW_NUMBER() OVER (PARTITION BY equipe.id ORDER BY ...)`) para isolar o melhor desempenho por categoria |

**Justificativa:** RN17 obriga a apuração simultânea de recordes
em três níveis (individual, equipe, geral). Atender isso em uma
única consulta exige agrupamentos múltiplos e funções de janela,
caracterizando a consulta como composta.

---

### 3.5. Q05 — Painel administrativo: atleta em corrida e próximo

| Campo                  | Conteúdo                                                                 |
|------------------------|--------------------------------------------------------------------------|
| Função de negócio      | Painel administrativo (ranking interno da equipe)                        |
| Endpoint               | `GET /competitions/:id/teams/:teamId/runners`                            |
| RF atendido            | RF011                                                                    |
| RNs justificadas       | RN07 (apenas um atleta por equipe com status "Em corrida"), RN08 (calculadora de descanso baseada em pace e turno), RN10 (exibição automática do atleta em corrida e do próximo previsto) |
| Tabelas percorridas    | `equipe` ⨝ `corredor` ⨝ `checkpoint`                                      |
| Relacionamentos do DER | `corredor.equipe_id → equipe.id`, `checkpoint.corredor_id → corredor.id` |
| Operações compostas    | Filtro `corredor.status = 'Em corrida'`; `LATERAL JOIN` (ou subconsulta) com `checkpoint` para recuperar o último checkpoint de cada corredor da equipe via `ORDER BY criado_em DESC LIMIT 1`; cálculo de tempo desde o último checkpoint para alimentar a calculadora de descanso |

**Justificativa:** atender RN07 + RN10 exige identificar, na
mesma consulta, o corredor com status "Em corrida" e o próximo
da escala, junto do último checkpoint de cada um (para a
calculadora de descanso da RN08). Sem `JOIN` lateral entre
`corredor` e `checkpoint` não é possível devolver todos esses
campos em uma única resposta.

## 4. Endpoints descartados (consultas simples)

Para rastreabilidade do critério de classificação, os endpoints
listados abaixo foram analisados e descartados deste mapeamento:

| Endpoint                                                  | Motivo                                                                       |
|-----------------------------------------------------------|------------------------------------------------------------------------------|
| `POST /competitions` (RF001, RF002)                       | Inserção em uma única tabela (`competicao`)                                  |
| `POST /competitions/:id/teams` (RF003)                    | Inserção em `equipe` com geração de UUID; sem agregação                      |
| `PUT`/`DELETE` em `equipe` e `corredor` (RF003)           | Operações de escrita pontuais em uma tabela                                  |
| `POST /auth/sessions` (RF004)                             | Autenticação por leitura direta de `administrador`                           |
| `POST /ocr/extractions` (RF005, RF006)                    | Persistência do resultado do OCR antes da validação; sem leitura cruzada     |
| `PATCH /ocr/extractions/:extractionId` (RF007)            | Atualização pontual do registro extraído                                     |
| `POST /competitions/:id/checkpoints` (RF008)              | Inserção em `checkpoint` após validação; sem leitura agregada                |
| `PATCH /competitions/:id` (RF012)                         | Atualização de status da competição                                          |

## 5. Resumo

| Q   | Endpoint                                                  | Função          | RF        | Tabelas envolvidas                                          |
|-----|-----------------------------------------------------------|-----------------|-----------|-------------------------------------------------------------|
| Q01 | `GET /competitions/:id/ranking`                           | Ranking         | RF010, RF015 | competicao, equipe, corredor, checkpoint                  |
| Q02 | `GET /competitions/:id/checkpoints/inconsistencies`       | Inconsistências | RF009     | checkpoint, corredor, equipe, competicao                    |
| Q03 | `GET /competitions/:id/exports`                           | Exportação      | RF013     | competicao, equipe, corredor, checkpoint, esteira, administrador |
| Q04 | `GET /competitions/:id/reports`                           | Relatórios      | RF014     | competicao, equipe, corredor, checkpoint                    |
| Q05 | `GET /competitions/:id/teams/:teamId/runners`             | Painel administrativo | RF011 | equipe, corredor, checkpoint                              |

As cinco consultas mapeadas cobrem as quatro funções de negócio
indicadas na descrição da issue (ranking, relatórios,
inconsistências, exportação) e superam o mínimo de três
consultas exigido pelos critérios de aceite.
