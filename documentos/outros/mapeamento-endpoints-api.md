# Mapeamento de Endpoints Reais da API — Sprint 04

Artefato de trabalho da issue **#317** — insumo direto para a task **#318 (refino da seção 3.7 do WAD)**.

Levantamento dos endpoints reais implementados no backend (`src/routes` + `src/controllers` + `src/app.ts`) ao final da Sprint 03 e comparação com a documentação da seção 3.7, que está organizada em duas partes:

1. **WAD `documentos/wad.md` (seção 3.7)** — texto introdutório + link para a página HTML detalhada.
2. **`documentos/outros/api-documentation.html`** — tabela completa de endpoints com método, path, status (`Implemented` ou `Planned`), descrição, RF/RN, body, response e códigos de status esperados.

## 1. Estado atual da seção 3.7 (WAD + HTML)

A seção 3.7 **não está vazia**. Ela é curta no WAD por design — delega o detalhamento para a página HTML versionada:

```markdown
## 3.7. WebAPI e endpoints (sprints 3 e 4)

A documentação completa da WebAPI foi organizada em uma página HTML específica,
reunindo os endpoints por domínio funcional, seus métodos HTTP, exemplos de
payload, formatos de resposta, códigos de status esperados e indicação de
quais recursos já estão implementados ou planejados. (...)

A versão versionada no repositório pode ser consultada em
[documentos/outros/api-documentation.html](outros/api-documentation.html).
Para facilitar a leitura externa (...) a mesma documentação também foi publicada
em ambiente web no link: https://web-api-deploy-d81981.pages.git.inteli.edu.br/
```

A página HTML organiza os endpoints em **10 seções funcionais** (3.6.1 Competitions, 3.6.2 Teams, 3.6.3 Athletes, 3.6.4 Administrators, 3.6.5 Checkpoints, 3.6.6 Ranking, 3.6.7 Export, 3.6.8 Authentication, 3.6.9 OCR, 3.6.10 Reports) e fecha com uma seção "Resumo de Implementação" consolidada.

## 2. Endpoints reais implementados (31 endpoints em 7 arquivos de rota)

Em `src/app.ts` os routers são montados nesta ordem: `competitionRoutes`, `teamRoutes`, `athleteRoutes`, `administradorRoutes` (com prefixo `/administradores`), `checkpointRoutes`, `rankingRoutes`, `exportRoutes`.

**Status codes emitidos pelos controllers (auditoria de `src/controllers/*.ts`):**

- **Caminhos de sucesso:**
  - `201 Created` — `res.status(201).json(...)` em todos os métodos `create` (admin, competition, team, athlete/runner, checkpoint).
  - `204 No Content` — `res.status(204).send()` em todos os métodos `delete` (admin, competition, team, athlete/runner, checkpoint) e em `auth.logout`.
  - `200 OK` — `res.status(200).json(...)` (ou `res.json(...)` que tem `200` como default) em todos os demais GETs, PUTs e PATCHs.

- **Caminhos de erro** (mapeados via `errors/AppError.ts` + middleware `errorHandler`):
  - `400` — `ValidationError`
  - `404` — `NotFoundError`
  - `409` — `ConflictError`
  - `422` — `UnprocessableError`
  - `500` — *fallback* do `errorHandler` para exceções não tratadas.

- **Planejados para a Sprint 5:** `401 Unauthorized` (autenticação) e `403 Forbidden` (autorização por perfil).

### 2.1. Competições — `competitionRoutes.ts` (6)

| # | Método | Path | Controller |
|---|---|---|---|
| 1 | POST | `/competitions` | `competitionController.create` |
| 2 | GET | `/competitions` | `competitionController.findAll` |
| 3 | GET | `/competitions/:id` | `competitionController.findById` |
| 4 | PUT | `/competitions/:id` | `competitionController.update` |
| 5 | PATCH | `/competitions/:id` | `competitionController.close` |
| 6 | DELETE | `/competitions/:id` | `competitionController.delete` |

### 2.2. Equipes — `teamRoutes.ts` (5)

| # | Método | Path | Controller |
|---|---|---|---|
| 7 | POST | `/competitions/:competicaoId/teams` | `teamController.create` |
| 8 | GET | `/competitions/:competicaoId/teams` | `teamController.list` |
| 9 | GET | `/competitions/:competicaoId/teams/:teamId` | `teamController.findById` |
| 10 | PUT | `/competitions/:competicaoId/teams/:teamId` | `teamController.update` |
| 11 | DELETE | `/competitions/:competicaoId/teams/:teamId` | `teamController.delete` |

### 2.3. Atletas — `athleteRoutes.ts` (5)

| # | Método | Path | Controller |
|---|---|---|---|
| 12 | POST | `/competitions/:competicaoId/teams/:teamId/athletes` | `athleteController.create` |
| 13 | GET | `/competitions/:competicaoId/teams/:teamId/athletes` | `athleteController.list` |
| 14 | GET | `/competitions/:competicaoId/teams/:teamId/athletes/:athleteId` | `athleteController.findById` |
| 15 | PUT | `/competitions/:competicaoId/teams/:teamId/athletes/:athleteId` | `athleteController.update` |
| 16 | DELETE | `/competitions/:competicaoId/teams/:teamId/athletes/:athleteId` | `athleteController.delete` |

### 2.4. Administradores — `administradorRoutes.ts` (5)

Montado em `app.use("/administradores", administradorRoutes)`, então os paths internos `/` e `/:id` resolvem para `/administradores` e `/administradores/:id`.

| # | Método | Path | Controller |
|---|---|---|---|
| 17 | GET | `/administradores` | `administradorController.listar` |
| 18 | GET | `/administradores/:id` | `administradorController.buscarPorId` |
| 19 | POST | `/administradores` | `administradorController.criar` |
| 20 | PUT | `/administradores/:id` | `administradorController.atualizar` |
| 21 | DELETE | `/administradores/:id` | `administradorController.excluir` |

### 2.5. Checkpoints — `checkpointRoutes.ts` (7)

| # | Método | Path | Controller |
|---|---|---|---|
| 22 | POST | `/checkpoints` | `checkpointController.create` |
| 23 | GET | `/checkpoints` | `checkpointController.list` |
| 24 | GET | `/checkpoints/:id` | `checkpointController.findById` |
| 25 | PUT | `/checkpoints/:id` | `checkpointController.update` |
| 26 | DELETE | `/checkpoints/:id` | `checkpointController.remove` |
| 27 | GET | `/corredores/:corredorId/checkpoints` | `checkpointController.findByCorredor` |
| 28 | GET | `/competitions/:competicaoId/checkpoints` | `checkpointController.findByCompeticao` |

### 2.6. Ranking — `rankingRoutes.ts` (2)

| # | Método | Path | Controller |
|---|---|---|---|
| 29 | GET | `/competitions/:competicaoId/ranking/teams` | `rankingController.rankingEquipes` |
| 30 | GET | `/competitions/:competicaoId/ranking/athletes` | `rankingController.rankingCorredores` |

### 2.7. Export — `exportRoutes.ts` (1)

| # | Método | Path | Controller |
|---|---|---|---|
| 31 | GET | `/competitions/:competicaoId/export` | `exportController.exportCompetition` |

### 2.8. Não implementado

- **`userRoutes.ts`** existe mas está **vazio** (1 linha), e **não é importado em `app.ts`**.

## 3. Endpoints "Planned" na documentação HTML (5)

Documentados como planejados, sem rota correspondente no código (esperado — entregáveis das Sprints 4–5):

| Método | Path | Documentado em | RF/RN |
|---|---|---|---|
| GET | `/competitions/:competicaoId/checkpoints/inconsistencies` | 3.6.5 Checkpoints | RF009 |
| POST | `/auth/sessions` | 3.6.8 Authentication | RF004, RN02, RN03 |
| POST | `/ocr/extractions` | 3.6.9 OCR Routes | RF005, RF006, RN04, RN05, RN06 |
| PATCH | `/ocr/extractions/:extractionId` | 3.6.9 OCR Routes | RF007, RN06, RN12 |
| GET | `/competitions/:id/reports` | 3.6.10 Report Routes | RF014, RN16, RN17 |

## 4. Divergências entre código e documentação (checklist para #318)

A documentação HTML está **fortemente alinhada** ao código. Não há endpoints "fantasmas" (no código mas não no HTML) nem o inverso (no HTML como "Implemented" mas ausentes do código). As divergências encontradas são de **naming/consistência** e **detalhes editoriais**:

### 4.1. Inconsistência de naming de parâmetros (CRÍTICO — pode confundir consumidores da API)

- [ ] **Resumo de Implementação no HTML usa `:id`** onde a documentação detalhada e o código usam `:competicaoId`. Linhas afetadas no HTML:
  - Linha 1298: `GET /competitions/:id/ranking/teams` e `/athletes` ← deveria ser `:competicaoId` (alinhar com seções 3.6.6 e código)
  - Linha 1303: `GET /competitions/:id/export` ← deveria ser `:competicaoId` (alinhar com seção 3.6.7 e código)
  - Linha 1318: `GET /competitions/:id/reports` ← este é "Planned", manter `:id` ou já padronizar para `:competicaoId` antes de implementar? **Decisão a tomar na #318.**
- [ ] **Rotulagem "Athletes/Runners"** (linha 1281) usa duas palavras pra mesmo conceito. O código usa "athletes" consistentemente. Decidir padrão único (recomendo "Athletes") e ajustar.

### 4.2. Endpoints documentados não cobertos pela RTM (3.9 / 3.1.4)

- [ ] A 3.1.4 (Matriz RF→Endpoint) precisa receber os endpoints adicionados na Sprint 03 que ainda não estão lá. Verificar com Eduardo (responsável pela 3.1.4) e Mari (responsável pela 3.9). Em particular:
  - GET `/administradores` e variações (gestão de admins)
  - GET `/checkpoints/:id`, PUT `/checkpoints/:id`, DELETE `/checkpoints/:id`
  - GET `/corredores/:corredorId/checkpoints`
  - GET `/competitions/:competicaoId/ranking/teams` e `/athletes`
  - GET `/competitions/:competicaoId/export`

### 4.3. Limpeza editorial sugerida

- [ ] `userRoutes.ts` existe mas está vazio. Decidir entre: (a) remover o arquivo, (b) deixar como placeholder explícito para Sprint 5 (auth de usuários) com comentário no topo. Recomendação: **(b)**, pra evitar reintrodução acidental por outra pessoa.
- [ ] `checkpointRoutes.ts` tem indentação irregular (linhas 23–32). Não afeta funcionamento mas confunde leitura. Ajuste cosmético — fora do escopo da #318 porém vale registrar pra um próximo MR.

### 4.4. Notas de qualidade do material atual

A documentação HTML é **completa e bem estruturada**: por endpoint inclui método, path, status (badge `Implemented`/`Planned`), descrição, RF/RN, body planejado/real, response esperado, códigos de status e observações. **A task #318 não precisa reescrever nada** — basta:

1. Aplicar os ajustes de naming/consistência da seção 4.1 acima.
2. (Opcional) Adicionar parágrafo introdutório na seção 3.7 do WAD explicando a convenção dual `:id` (path direto) vs `:competicaoId` (recurso aninhado) — se a decisão for manter os dois.
3. Confirmar com a equipe de doc que o link público (`https://web-api-deploy-d81981.pages.git.inteli.edu.br/`) está vivo e atualizado a cada merge.

## 5. Notificações pendentes

- [ ] Avisar **Mari** (#3.9 RTM): a tabela 3.7 está completa via HTML. Os 31 endpoints implementados são os listados na seção 2 deste arquivo; os 5 planejados estão na seção 3. Pode usar essa lista como fonte canônica.
- [ ] Avisar **Julia** (#5.1.3 testes de integração): mesma observação. Os 31 endpoints da seção 2 são o conjunto-alvo para os testes black-box da Sprint 04.
- [ ] Avisar **Eduardo** (#3.1.4 Matriz RF→Endpoint): conferir se todos os endpoints "Implemented" do HTML estão listados na matriz.
