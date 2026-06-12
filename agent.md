# agent.md — Guia Completo para Agentes de IA · Projeto Red Bull 24 Horas

> **Leia este arquivo integralmente antes de escrever qualquer linha de código, criar qualquer view ou conectar qualquer endpoint.**
> Este documento é a fonte de verdade para todos os agentes que atuam no projeto. Qualquer decisão não coberta aqui deve ser registrada como assunção antes de ser implementada.

---

## Sumário

1. [Contexto do Projeto](#1-contexto-do-projeto)
2. [Stack Técnica e Arquitetura](#2-stack-técnica-e-arquitetura)
3. [Estrutura de Pastas](#3-estrutura-de-pastas)
4. [Sistema de Views — EJS](#4-sistema-de-views--ejs)
5. [Partials e Layout](#5-partials-e-layout)
6. [Estilo e Variáveis CSS](#6-estilo-e-variáveis-css)
7. [Endpoints Disponíveis](#7-endpoints-disponíveis)
8. [Integração Frontend ↔ Backend — Guia Completo](#8-integração-frontend--backend--guia-completo)
9. [Sistema de Escalas de Classificação](#9-sistema-de-escalas-de-classificação)
10. [Mapeamento Views × Endpoints](#10-mapeamento-views--endpoints)
11. [Padrões de Implementação por Tela](#11-padrões-de-implementação-por-tela)
12. [Tratamento de Erros no Frontend](#12-tratamento-de-erros-no-frontend)
13. [Checklist de Entrega de uma Nova View](#13-checklist-de-entrega-de-uma-nova-view)
14. [Regras de Negócio que Impactam o Frontend](#14-regras-de-negócio-que-impactam-o-frontend)
15. [O que Nunca Fazer](#15-o-que-nunca-fazer)
16. [Entidades e Atributos](#a-entidades-e-atributos)
17. [Chaves](#b-chaves)
18. [Métodos](#c-métodos)

---

## 1. Contexto do Projeto

**Parceiro:** Red Bull — time de Field Marketing
**Evento:** Red Bull 24 Horas — duas equipes de 16 corredores se revezam em esteiras durante 24 horas ininterruptas, competindo pela maior quilometragem total.
**Problema original:** registro manual em pranchetas, sujeito a erros humanos, sem auditabilidade.
**Solução desenvolvida:** plataforma web com OCR para extração automática de dados das esteiras, validação humana e painel de controle operacional.

### Dois ambientes da aplicação

| Ambiente | Acesso | Objetivo |
|---|---|---|
| **Administrativo** | Login com credenciais de administrador | Gerenciar competições, equipes, corredores, checkpoints, ranking, exportação |
| **Público por equipe** | URL com UUID único (sem login) | Exibir ranking simplificado, status dos corredores, calculadora de descanso |

### Personas principais

- **Mariana** — Coordenadora Operacional: usa o painel administrativo no iPad ao lado das esteiras.
- **Bruno** — Gerente de Field Marketing: acompanha o dashboard geral da competição.
- **Corredor/Capitão** — acessa o painel público via URL recebida antes do evento.

---

## 2. Stack Técnica e Arquitetura

### Backend

| Tecnologia | Papel |
|---|---|
| Node.js + TypeScript | Servidor principal |
| Express.js | Framework HTTP e roteamento |
| EJS | Template engine — SSR puro |
| Supabase (PostgreSQL) | Banco de dados relacional |
| Jest + Supertest | Testes unitários e E2E |

### Arquitetura em Camadas (obrigatória)

```
Requisição HTTP
  → Routes         (src/routes/)         — define método + path + chama controller
  → Controller     (src/controllers/)    — extrai params, chama service, responde HTTP
  → Validator      (src/validators/)     — valida formato e obrigatoriedade
  → Service        (src/services/)       — aplica regras de negócio
  → Repository     (src/repositories/)  — acessa Supabase/PostgreSQL
  → Model/Types    (src/models/)         — tipagens e DTOs
  → Supabase
```

**Regra absoluta:** nenhuma camada deve pular outra. O Controller nunca acessa o Repository diretamente. O Service nunca conhece `req`/`res`. O Repository nunca contém regras de negócio.

### SSR com EJS — por que não CSR

O projeto usa **Server-Side Rendering (SSR) puro** com EJS. O servidor monta o HTML completo com os dados já preenchidos antes de entregar ao navegador. Isso significa:

- O Controller busca os dados via Service → Repository → Supabase.
- Passa os dados para `res.render('nome-da-view', { dados })`.
- O EJS gera o HTML final.
- O navegador exibe imediatamente — sem esperar JavaScript.

Não existe React, Vue ou Angular neste projeto. Toda interface é EJS.

---

## 3. Estrutura de Pastas

```
g01/
├── public/                         ← arquivos estáticos servidos pelo Express
│   ├── css/
│   │   ├── variables.css           ← tokens de design (cores, fontes, espaçamentos)
│   │   └── menu.css                ← estilos do menu lateral
│   ├── img/
│   │   ├── fundo_menu.jpg
│   │   └── logo_red-bull.png
│   └── js/
│       └── app.js                  ← JS de cliente (DOM, eventos, fetch opcional)
│
├── src/
│   ├── app.ts                      ← configuração do Express (view engine, middlewares, rotas)
│   ├── server.ts                   ← entrada do servidor (listen)
│   ├── controllers/                ← recebem req/res, chamam services, chamam res.render
│   ├── services/                   ← regras de negócio
│   ├── repositories/               ← acesso ao Supabase
│   ├── models/                     ← tipos TypeScript e DTOs
│   ├── routes/                     ← registro de rotas no Express
│   ├── validators/                 ← validação de entrada
│   ├── middlewares/
│   │   └── errorHandler.ts
│   ├── errors/
│   │   └── AppError.ts
│   ├── helpers/
│   │   └── asyncHandler.ts
│   ├── database/
│   │   └── supabaseClient.ts
│   │
│   └── views/                      ← TODOS os templates EJS ficam aqui
│       ├── layouts/
│       │   └── main.ejs            ← shell HTML principal (html, head, body)
│       ├── partials/
│       │   └── menu.ejs            ← menu lateral reutilizável
│       ├── home.ejs
│       ├── auth/
│       │   └── login.ejs
│       ├── dashboard/
│       │   └── dashboard.ejs
│       ├── athlete/
│       │   └── athlete.ejs
│       ├── teams/
│       │   └── teams.ejs
│       ├── operational-panel/
│       │   └── operationalPanel.ejs
│       ├── ranking/
│       │   └── ranking.ejs
│       ├── reports/
│       │   └── reports.ejs
│       ├── audit/
│       │   └── auditLog.ejs
│       └── errors/
│           ├── 404.ejs
│           └── 500.ejs
```

> **Regra de localização:** toda nova view deve ser criada dentro de `src/views/` em uma subpasta que corresponda ao recurso (ex.: `src/views/competitions/index.ejs`). Nunca criar views fora de `src/views/`.

---

## 4. Sistema de Views — EJS

### Configuração no app.ts

O `app.ts` já deve conter (ou confirmar que contém) a configuração abaixo antes de qualquer trabalho nas views:

```typescript
import express from 'express';
import path from 'path';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); // para forms tradicionais
app.use(express.json());                          // para fetch/AJAX
app.use(express.static('public'));               // serve public/css, public/js, public/img
```

### Sintaxe EJS — as 4 tags (obrigatório conhecer)

| Tag | Imprime? | Escapa HTML? | Quando usar |
|---|---|---|---|
| `<%= variavel %>` | Sim | **Sim** | Qualquer dado vindo do banco ou do usuário |
| `<%- variavel %>` | Sim | Não | Includes de partials, HTML confiável pré-processado |
| `<% código %>` | Não | — | `if`, `forEach`, declarações de variáveis |
| `<%- include('caminho') %>` | Sim | Não | Composição com partials |

> **Segurança:** sempre use `<%= %>` para dados do usuário. Nunca use `<%-` para renderizar input externo — isso é porta de XSS.

### Como criar uma nova view

1. Crie o arquivo `.ejs` dentro da subpasta correta em `src/views/`.
2. Inicie sempre incluindo o layout ou os partials necessários.
3. Use o partial `menu.ejs` em todas as views administrativas.
4. Feche sempre com o rodapé/fechamento do layout.

```ejs
<%- include('../layouts/main', { title: 'Título da Página' }) %>

<main class="content">
  <h1>Título</h1>
  <!-- conteúdo da página -->
</main>
```

---

## 5. Partials e Layout

### main.ejs (layouts/main.ejs)

É o shell HTML completo: contém `<html>`, `<head>` com os links para CSS, `<body>` e o fechamento. Toda view que representa uma página inteira deve usar este layout. Ele recebe ao menos a variável `title`.

```ejs
<!-- Dentro de main.ejs -->
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title><%= title %></title>
  <link rel="stylesheet" href="/css/variables.css">
  <link rel="stylesheet" href="/css/menu.css">
</head>
<body>
  <%- include('../partials/menu') %>
  <%- body %>
</body>
</html>
```

### menu.ejs (partials/menu.ejs)

Menu lateral presente em todas as views administrativas. Já estilizado com `menu.css`. Use `<%- include('../partials/menu') %>` no início do `<body>` de cada view administrativa.

O partial `menu.ejs` pode receber variáveis de contexto como `currentPage` para marcar o item ativo:

```ejs
<%- include('../partials/menu', { currentPage: 'dashboard' }) %>
```

### Regra de caminho nos includes

O caminho no `include` é **relativo ao arquivo que está fazendo o include**, não à raiz de `views/`.

```ejs
<!-- em src/views/dashboard/dashboard.ejs -->
<%- include('../partials/menu') %>        ✅ correto
<%- include('partials/menu') %>           ❌ errado — busca relativo à view, não ao diretório views/
```

---

## 6. Estilo e Variáveis CSS

### variables.css (public/css/variables.css)

Este arquivo define todos os tokens de design do projeto. **Nunca hardcode cores, fontes ou espaçamentos** diretamente nas views ou em CSS de componente. Sempre referencie as variáveis CSS.

Estrutura esperada de variáveis (referencie sempre pelo nome da variável):

```css
:root {
  /* Cores principais — Red Bull */
  --color-primary: /* vermelho Red Bull */;
  --color-primary-dark: /* vermelho escuro */;
  --color-secondary: /* amarelo/dourado */;
  --color-bg: /* fundo escuro */;
  --color-surface: /* superfície de cards */;
  --color-text: /* texto principal */;
  --color-text-muted: /* texto secundário */;
  --color-border: /* bordas */;
  --color-success: /* verde — estado ok */;
  --color-warning: /* amarelo — alerta */;
  --color-error: /* vermelho — erro */;

  /* Tipografia */
  --font-family: /* fonte principal */;
  --font-size-base: /* tamanho base */;
  --font-size-sm: /* pequeno */;
  --font-size-lg: /* grande */;
  --font-size-xl: /* extra grande */;

  /* Espaçamentos */
  --spacing-xs: /* 4px */;
  --spacing-sm: /* 8px */;
  --spacing-md: /* 16px */;
  --spacing-lg: /* 24px */;
  --spacing-xl: /* 32px */;

  /* Bordas */
  --border-radius: /* arredondamento padrão */;
  --border-radius-lg: /* arredondamento maior */;
}
```

> **Regra obrigatória:** antes de escrever qualquer CSS inline ou criar um novo arquivo de estilo, verifique `public/css/variables.css` e use as variáveis existentes. Se a variável que você precisa não existir, adicione-a ao arquivo `variables.css` antes de usá-la.

### Como referenciar os arquivos estáticos nas views

```ejs
<!-- No <head> — sempre paths absolutos começando com / -->
<link rel="stylesheet" href="/css/variables.css">
<link rel="stylesheet" href="/css/menu.css">

<!-- No <body> antes de </body> -->
<script src="/js/app.js"></script>
```

O diretório `public/` não aparece na URL. `public/css/variables.css` é servido em `/css/variables.css`.

---

## 7. Endpoints Disponíveis

> Estes são os endpoints implementados no backend. O frontend deve consumir **exatamente** estas rotas. Não invente URLs.
>
> **Uso com a Escala B:** o fato de um endpoint estar listado aqui garante apenas **A1** (origem confirmada). O contrato da response — campos, tipos, estrutura do JSON — precisa ser verificado no controller correspondente em `src/controllers/` para atingir **B1**. Enquanto não verificado, tratar como **B2** (inferido) ou **B3** (desconhecido) conforme o grau de certeza.

| Grupo | Endpoints | Classificacao |
|---|---:|---:|
| Competitions | `POST /competitions`; `GET /competitions`; `GET /competitions/:id`; `PUT /competitions/:id`; `PATCH /competitions/:id`; `DELETE /competitions/:id` | 1 |
| Teams | `POST /competitions/:id/teams`; `GET /competitions/:id/teams`; `GET /competitions/:id/teams/:teamId`; `PUT /competitions/:id/teams/:teamId`; `DELETE /competitions/:id/teams/:teamId` | 1 |
| Runners | `POST /competitions/:id/teams/:teamId/runners`; `GET /competitions/:id/teams/:teamId/runners`; `GET /competitions/:id/teams/:teamId/runners/:runnerId`; `PUT /competitions/:id/teams/:teamId/runners/:runnerId`; `DELETE /competitions/:id/teams/:teamId/runners/:runnerId` | 1 |
| Checkpoints | `POST /checkpoints`; `GET /checkpoints`; `GET /checkpoints/:id`; `PUT /checkpoints/:id`; `DELETE /checkpoints/:id`; `GET /runners/:runnerId/checkpoints`; `GET /competitions/:id/checkpoints`; `GET /competitions/:id/checkpoints/inconsistencies` | 1 |
| Ranking | `GET /competitions/:id/ranking/teams`; `GET /competitions/:id/ranking/runners` | 1 |
| Export | `GET /competitions/:id/export` | 1 |
| Reports | `GET /competitions/:id/reports` | 1 |
| Auth | `POST /auth/sessions` | 1 |
| OCR | `POST /ocr/extractions`; `PATCH /ocr/extractions/:extractionId` | 1 |
| Admin | `GET /admin`; `GET /admin/:id`; `POST /admin`; `PUT /admin/:id`; `DELETE /admin/:id` | 1 |

> **Rotas de View (SSR):** além dos endpoints de API acima, cada tela administrativa listada na Seção 10 possui uma rota de renderização SSR no formato `GET /view/[recurso]/:id?` que retorna HTML completo via `res.render`. Essas rotas são registradas em `src/routes/` separadamente das rotas de API e estão documentadas no padrão de cada view na Seção 11. Sem a rota SSR registrada e montada em `app.ts`, o navegador retorna 404 ao acessar o path da view.

---

## 8. Integração Frontend ↔ Backend — Guia Completo

Esta seção descreve os **dois modos de integração** disponíveis no projeto e quando usar cada um.

### Modo 1 — SSR (Server-Side Rendering) via res.render

**Quando usar:** páginas completas que precisam de SEO, primeiro carregamento, formulários simples.

O Controller busca os dados, passa para o template EJS via `res.render`. O EJS gera o HTML com os dados já embutidos.

#### Exemplo completo — Tela de listagem de equipes

**1. Route (`src/routes/teamRoutes.ts`)**

```typescript
import { Router } from 'express';
import { TeamController } from '../controllers/teamController';

const router = Router();
const controller = new TeamController();

// Rota de VIEW — renderiza a página HTML
router.get('/view/competitions/:id/teams', (req, res) =>
  controller.renderTeamsList(req, res)
);

export default router;
```

**2. Controller (`src/controllers/teamController.ts`)**

```typescript
import { Request, Response } from 'express';
import { TeamService } from '../services/teamService';

export class TeamController {
  constructor(private readonly service = new TeamService()) {}

  // Renderiza a view HTML com a lista de equipes
  async renderTeamsList(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const teams = await this.service.getTeamsByCompetition(id);
      const competition = await this.service.getCompetition(id);

      res.render('teams/teams', {
        title: 'Equipes — Red Bull 24h',
        teams,
        competition,
        currentPage: 'teams'   // para o menu.ejs marcar o item ativo
      });
    } catch (error) {
      res.status(500).render('errors/500', { title: 'Erro interno' });
    }
  }
}
```

**3. View (`src/views/teams/teams.ejs`)**

```ejs
<%- include('../layouts/main', { title: title }) %>

<%- include('../partials/menu', { currentPage: currentPage }) %>

<main class="content">
  <section class="page-header">
    <h1>Equipes — <%= competition.name %></h1>
    <a href="/view/competitions/<%= competition.id %>/teams/new" class="btn btn-primary">
      + Nova Equipe
    </a>
  </section>

  <% if (teams.length === 0) { %>
    <div class="empty-state">
      <p>Nenhuma equipe cadastrada ainda.</p>
    </div>
  <% } else { %>
    <ul class="team-list">
      <% teams.forEach(team => { %>
        <li class="team-card">
          <span class="team-name"><%= team.name %></span>
          <span class="team-runners"><%= team.runners?.length ?? 0 %> corredores</span>
          <a href="/view/competitions/<%= competition.id %>/teams/<%= team.id %>">
            Ver detalhes
          </a>
        </li>
      <% }) %>
    </ul>
  <% } %>
</main>
```

#### Regras do Modo SSR

- Use `res.render('pasta/arquivo', { variaveis })` — sem extensão `.ejs`.
- Passe sempre `title` e `currentPage` para o layout e o menu.
- Para formulários, use `<form method="POST" action="/rota">` e responda com `res.redirect()` após o POST (padrão Post-Redirect-Get).
- Em caso de erro, chame `res.status(404).render('errors/404')` ou `res.status(500).render('errors/500')`.

---

### Modo 2 — Fetch/AJAX (Client-Side com JSON)

**Quando usar:** atualizações parciais de página (ranking em tempo real), ações sem reload (deletar um item da lista), modais de confirmação.

O JS de cliente (`public/js/app.js`) faz `fetch` para a API JSON do backend. O backend responde com JSON. O JS atualiza o DOM.

#### Exemplo completo — Atualizar ranking sem recarregar a página

**No Controller (já existe como endpoint JSON)**

```typescript
// GET /competitions/:id/ranking/teams → retorna JSON
async getRankingTeams(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const ranking = await this.service.getTeamsRanking(id);
  res.json(ranking);    // responde JSON, não res.render
}
```

**Na view EJS — injetar dados iniciais e o ID da competição**

```ejs
<section id="ranking-section">
  <h2>Ranking de Equipes</h2>
  <table id="ranking-table">
    <thead>
      <tr><th>Pos.</th><th>Equipe</th><th>Distância (km)</th></tr>
    </thead>
    <tbody id="ranking-body">
      <% ranking.forEach((team, index) => { %>
        <tr>
          <td><%= index + 1 %></td>
          <td><%= team.name %></td>
          <td><%= team.total_distance_km %></td>
        </tr>
      <% }) %>
    </tbody>
  </table>
</section>

<script>
  // Injeção de dados do servidor para o JS de cliente
  // Use <%- (raw) para não escapar o JSON — NUNCA para dados do usuário
  window.COMPETITION_ID = '<%- id %>';
  window.INITIAL_RANKING = <%- JSON.stringify(ranking) %>;
</script>
<script src="/js/app.js"></script>
```

**No public/js/app.js — polling para atualizar o ranking**

```javascript
// Atualiza o ranking a cada 5 minutos (RN11: painel adm a cada 5min)
const POLL_INTERVAL_MS = 5 * 60 * 1000;

async function fetchRanking() {
  try {
    const res = await fetch(`/competitions/${window.COMPETITION_ID}/ranking/teams`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderRanking(data);
  } catch (err) {
    console.error('Erro ao atualizar ranking:', err);
  }
}

function renderRanking(teams) {
  const tbody = document.querySelector('#ranking-body');
  if (!tbody) return;

  tbody.innerHTML = teams
    .map((team, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(team.name)}</td>
        <td>${team.total_distance_km}</td>
      </tr>
    `)
    .join('');
}

// Escape manual no JS de cliente — proteção contra XSS
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Iniciar polling somente se o elemento existir na página
if (document.querySelector('#ranking-body') && window.COMPETITION_ID) {
  fetchRanking();
  setInterval(fetchRanking, POLL_INTERVAL_MS);
}
```

#### Regras do Modo Fetch

- O endpoint de API responde sempre `res.json(dados)` — nunca `res.render`.
- Use `window.COMPETITION_ID = '<%- id %>';` para passar IDs do servidor ao JS. Use `<%-` (raw) e não `<%=` para o JSON.stringify.
- Sempre escape HTML manualmente no JS de cliente antes de inserir no DOM (`innerHTML`).
- Prefira `textContent` quando não houver HTML a renderizar — é automaticamente seguro.
- Trate erros de rede — o evento pode durar 24h e conexões podem cair.

---

### Modo 3 — Forms tradicionais com POST

**Quando usar:** cadastro e edição de entidades (competições, equipes, corredores), qualquer operação de escrita simples.

```ejs
<!-- src/views/competitions/new.ejs -->
<%- include('../layouts/main', { title: 'Nova Competição' }) %>
<%- include('../partials/menu', { currentPage: 'competitions' }) %>

<main class="content">
  <h1>Nova Competição</h1>

  <form action="/competitions" method="POST" id="competition-form">
    <div class="form-group">
      <label for="name">Nome da Competição</label>
      <input id="name" name="name" type="text" required maxlength="200"
             value="<%= locals.name ?? '' %>">
    </div>

    <div class="form-group">
      <label for="date">Data</label>
      <input id="date" name="date" type="date" required
             value="<%= locals.date ?? '' %>">
    </div>

    <div class="form-group">
      <label for="address">Endereço</label>
      <input id="address" name="address" type="text" required maxlength="200"
             value="<%= locals.address ?? '' %>">
    </div>

    <% if (locals.error) { %>
      <div class="alert alert-error"><%= error %></div>
    <% } %>

    <button type="submit" class="btn btn-primary">Criar Competição</button>
  </form>
</main>
```

**Controller que processa o POST:**

```typescript
// POST /competitions
async create(req: Request, res: Response): Promise<void> {
  try {
    const { name, date, address } = req.body;
    await this.service.create({ name, date, address });
    res.redirect('/view/competitions');   // Post-Redirect-Get
  } catch (error) {
    // Re-renderiza o form com os dados preenchidos e a mensagem de erro
    res.status(400).render('competitions/new', {
      title: 'Nova Competição',
      error: 'Dados inválidos. Verifique os campos.',
      name: req.body.name,
      date: req.body.date,
      address: req.body.address
    });
  }
}
```

---

## 9. Sistema de Escalas de Classificação

> **Por que este sistema existe:** toda vez que uma IA escreve código ou decide algo sem certeza absoluta, ela produz uma **assunção silenciosa** — o pior tipo de bug, porque não aparece em runtime, aparece quando o projeto já está avançado. Este sistema de escalas torna essas assunções **visíveis e rastreáveis**, permitindo que qualquer humano ou agente subsequente identifique imediatamente o que precisa de verificação.
>
> **Regra de uso:** toda decisão de implementação que não seja 100% confirmada por código já existente em `src/` deve receber uma marcação de escala. Marcações ausentes onde deveriam existir são, elas próprias, um sinal de alerta 🔴.

---

### Escala A — Origem da Informação

Responde à pergunta: **"de onde vem esta decisão?"**

Use sempre que a IA definir: qual endpoint consumir, qual campo passar para o template, qual rota montar, qual variável CSS usar, qual partial incluir.

| Símbolo | Nível | Definição | Exemplos de uso |
|---|---|---|---|
| 🟢 **A1 — Verificado** | Confirmado em fonte primária | A informação foi lida diretamente em `src/`, `public/` ou neste `agent.md`. | Endpoint listado na Seção 7; variável CSS encontrada em `variables.css`; partial `menu.ejs` confirmado em `src/views/partials/` |
| 🟡 **A2 — Inferido** | Deduzido logicamente das fontes | A informação não está explícita, mas é a conclusão direta de ler o código existente. | Nome do campo inferido pelo nome da coluna no migration; contrato JSON deduzido pelo nome do service method |
| 🔴 **A3 — Assumido** | Sem confirmação nas fontes disponíveis | A IA está preenchendo uma lacuna de informação por conta própria. **Requer validação humana antes de avançar.** | Campo `status` assumido como string; URL assumida sem verificar o router; nome da variável CSS inventado |

**Como registrar no código:**

```ejs
<%
  // [A1] Endpoint confirmado na Seção 7 do agent.md
  // Consome: GET /competitions/:id/ranking/teams
  // Retorna: [{ id, name, total_distance_km, position }]
%>
```

```typescript
// [A2] Campo `uuid` inferido de RN01 — "backend gera UUID automaticamente ao salvar equipe"
// Não confirmado diretamente no modelo Team — verificar src/models/team.ts
const publicLink = `/public/team/${team.uuid}`;
```

```javascript
// [A3 ⚠ ASSUMIDO] Estrutura do objeto runner inferida — não verificada em src/models/runner.ts
// Validar: runner.name ? runner.role ?
const name = runner.name;
```

---

### Escala B — Confiança no Contrato do Endpoint

Responde à pergunta: **"tenho certeza de que este endpoint retorna exatamente isto?"**

Use sempre que a IA escrever código que depende de um campo específico da resposta de um endpoint — seja em EJS (`<%= dado.campo %>`), seja em JS de cliente (`data.campo`).

| Símbolo | Nível | Definição | Ação requerida |
|---|---|---|---|
| 🟢 **B1 — Contrato verificado** | Response lida no código do controller/service | O campo existe e foi confirmado em `src/controllers/` ou `src/services/`. | Nenhuma — pode implementar. |
| 🟡 **B2 — Contrato inferido** | Campos deduzidos pelo nome do arquivo ou migration | O endpoint existe e os campos fazem sentido pelo contexto, mas não foram lidos no código. | Marcar no comentário; validar antes do PR. |
| 🔴 **B3 — Contrato desconhecido** | Endpoint existe mas response nunca foi verificada | A IA está assumindo o shape da resposta sem base. Alto risco de `undefined` em produção. | **Parar.** Ler o controller antes de continuar. |

**Como registrar no código:**

```ejs
<%
  // [B1] Contrato verificado em rankingController.ts
  // Response: { id, name, total_distance_km, position, average_pace }
%>
<td><%= team.total_distance_km %></td>
```

```ejs
<%
  // [B2] Contrato inferido — campo `name` deduzido do migration (tabela equipes, coluna nome)
  // Verificar se o service serializa como `name`
%>
<td><%= team.name %></td>
```

```javascript
// [B3 ⚠ CONTRATO DESCONHECIDO] Shape do objeto checkpoint nunca verificado
// Assumindo: { id, distance_km, metodo_entrada, timestamp }
// OBRIGATÓRIO verificar checkpointController.ts antes de usar em produção
const km = checkpoint.distance_km;
```

---

### Escala C — Grau de Implementação da View

Responde à pergunta: **"qual é o estado real desta view agora?"**

Use no cabeçalho de cada arquivo `.ejs` criado ou modificado pela IA. Permite que qualquer agente subsequente saiba imediatamente o que está pronto, o que é rascunho e o que ainda não foi conectado ao backend.

| Símbolo | Nível | Definição | O que falta |
|---|---|---|---|
| 🟢 **C1 — Completo** | View funcional, conectada e validada | Layout, partials, dados reais do backend, tratamento de erro, variáveis CSS. Passou pelo checklist da Seção 13. | Nada — pronta para uso. |
| 🟡 **C2 — Parcial** | View renderiza mas com lacunas conhecidas | Estrutura HTML pronta, dados podem ser mock ou incompletos, algum endpoint ainda não conectado. | Identificar e listar as lacunas no cabeçalho. |
| 🔴 **C3 — Rascunho** | Estrutura criada mas sem dados reais | HTML básico presente, sem conexão com endpoint, pode usar dados hardcoded. | Conectar ao backend, aplicar variáveis CSS, incluir partials, tratar erros. |

**Como registrar no cabeçalho de cada view:**

```ejs
<%#
  VIEW: dashboard/dashboard.ejs
  ESTADO: [C2 — Parcial]
  LACUNAS:
    - Polling do ranking ainda não implementado (falta JS em app.js)
    - Botão "Encerrar Competição" sem confirmação modal (RN14)
  ENDPOINTS CONSUMIDOS:
    - GET /competitions          [B1 — contrato verificado]
    - GET /competitions/:id/ranking/teams  [B2 — contrato inferido]
  ÚLTIMA ATUALIZAÇÃO: <data ou sprint>
%>
```

```ejs
<%#
  VIEW: teams/teams.ejs
  ESTADO: [C1 — Completo]
  ENDPOINTS CONSUMIDOS:
    - GET /competitions/:id/teams                   [B1]
    - POST /competitions/:id/teams                  [B1]
    - DELETE /competitions/:id/teams/:teamId         [B2]
  ÚLTIMA ATUALIZAÇÃO: <data ou sprint>
%>
```

---

### Escala D — Risco de Alucinação

Responde à pergunta: **"o que a IA inventou que pode não existir?"**

Esta escala é aplicada especificamente para sinalizar decisões onde **há risco concreto de a IA ter gerado algo falso** — um campo que não existe, uma rota inventada, um comportamento assumido. Deve aparecer em comentários de código e no cabeçalho de views sempre que a IA operar sem fonte verificável.

| Símbolo | Nível | Definição | Protocolo obrigatório |
|---|---|---|---|
| 🔵 **D1 — Baixo risco** | Decisão padrão do framework ou do projeto | Ex.: usar `res.redirect()` após POST, incluir `menu.ejs`, passar `title` para o layout. | Nenhum protocolo extra. |
| 🟠 **D2 — Risco médio** | Decisão sem fonte direta mas razoável pelo contexto | Ex.: nome de variável CSS assumido pela paleta de cores visível no design; campo de form deduzido pelo nome da tabela. | Comentar com `// [D2] inferido de <fonte>` e listar no cabeçalho da view. |
| 🔴 **D3 — Alto risco / Parar** | Decisão sem nenhuma base verificável | Ex.: inventar um endpoint que não está na Seção 7; assumir que um campo existe sem ler o model; usar uma classe CSS sem verificar `variables.css`. | **Não implementar.** Registrar a dúvida como `// [D3 ⚠ NÃO IMPLEMENTADO — aguardando confirmação]` e parar. |

**Exemplo de uso em comentário:**

```typescript
// [D2 🟠] Campo `status` assumido como 'ativa' | 'encerrada' — inferido de RF012 e RN14
// Fonte: WAD Seção 3.1.2, RN14 — não confirmado no model Competition
// Verificar: src/models/competition.ts
if (competition.status === 'encerrada') { ... }
```

```javascript
// [D3 🔴 ⚠ NÃO IMPLEMENTADO — aguardando confirmação]
// Endpoint /competitions/:id/inconsistencies NÃO consta na Seção 7 do agent.md
// Não consumir até confirmar existência com o time backend
```

---

### Combinando as escalas — uso prático

As quatro escalas são **complementares**, não alternativas. Um mesmo bloco de código pode receber marcações de duas ou três escalas ao mesmo tempo:

```ejs
<%#
  VIEW: operational-panel/operationalPanel.ejs
  ESTADO: [C2 — Parcial]
  LACUNAS:
    - Fluxo OCR ainda não conectado (ocr-src/ separado) [A3]
    - Campo `proximo_corredor` assumido na response — não verificado [B3 ⚠]
  ENDPOINTS CONSUMIDOS:
    - POST /checkpoints                              [A1][B2]
    - GET /runners/:runnerId/checkpoints             [A1][B3 ⚠]
%>

<main class="content">
  <%
    // [A1][B2] GET /competitions/:id/ranking/teams — endpoint confirmado (A1),
    // campo average_pace inferido do WAD RN11, não lido no controller (B2)
  %>
  <p>Pace médio: <%= ranking.average_pace %> min/km</p>

  <%
    // [D2 🟠] Assumindo que `runner_atual` é o nome do campo na response
    // Inferido de RF011 ("exibir corredor em execução") — não lido no service
  %>
  <p>Em execução: <%= dados.runner_atual?.name %></p>
</main>
```

---

### Tabela de referência rápida

| Escala | Pergunta que responde | Onde usar | Quando acionar alerta máximo |
|---|---|---|---|
| **A — Origem** | "De onde vem esta decisão?" | Qualquer decisão de rota, campo, arquivo, variável CSS | A3 🔴 = parar e buscar a fonte |
| **B — Contrato** | "Esta response tem este campo?" | Toda vez que acessar `dado.campo` em EJS ou JS | B3 🔴 = ler o controller antes de continuar |
| **C — Estado** | "Qual o grau de completude desta view?" | Cabeçalho de todo arquivo `.ejs` | C3 🔴 = não entregar sem completar |
| **D — Alucinação** | "A IA inventou algo aqui?" | Qualquer decisão sem fonte verificável | D3 🔴 = não implementar, registrar dúvida |

---

## 10. Mapeamento Views × Endpoints

> As colunas **Origem (A)** e **Contrato (B)** usam as escalas da Seção 9. O **Estado (C)** indica o grau de completude atual da view. Atualize esta tabela sempre que modificar uma view ou confirmar um contrato.

| View | Caminho EJS / Rota SSR | Endpoints consumidos | Modo | Origem (A) | Contrato (B) | Estado (C) |
|---|---|---|---|---|---|---|---|---|---|
| Home | `views/home.ejs`<br>`GET /` | Nenhum (estática ou redirect) | SSR | 🟢 A1 | — | 🔴 C3 |
| Login | `views/auth/login.ejs`<br>`GET /view/login` | `POST /auth/sessions` | Form POST | 🟢 A1 | 🟡 B2 | 🔴 C3 |
| Dashboard | `views/dashboard/dashboard.ejs`<br>`GET /view/dashboard` | `GET /competitions` · `GET /competitions/:id/ranking/teams` | SSR + Fetch | 🟢 A1 | 🟡 B2 | 🔴 C3 |
| Corredores | `views/athlete/athlete.ejs`<br>`GET /view/competitions/:id/teams/:teamId/runners` | `GET /competitions/:id/teams/:teamId/runners` · `POST` · `PUT` · `DELETE` idem | SSR + Form | 🟢 A1 | 🟡 B2 | 🔴 C3 |
| Equipes | `views/teams/teams.ejs`<br>`GET /view/competitions/:id/teams` | `GET /competitions/:id/teams` · `POST` · `PUT` · `DELETE` idem | SSR + Form | 🟢 A1 | 🟡 B2 | 🔴 C3 |
| Painel Operacional | `views/operational-panel/operationalPanel.ejs`<br>`GET /view/competitions/:id/operational-panel` | `POST /checkpoints` · `GET /runners/:runnerId/checkpoints` · `GET /competitions/:id/ranking/teams` | SSR + Fetch | 🟢 A1 | 🟡 B2 | 🔴 C3 |
| Ranking (adm) | `views/ranking/ranking.ejs`<br>`GET /view/competitions/:id/ranking` | `GET /competitions/:id/ranking/teams` · `GET /competitions/:id/ranking/runners` | SSR + Fetch (polling) | 🟢 A1 | 🟡 B2 | 🔴 C3 |
| Ranking (público) | `views/ranking/ranking.ejs`<br>`GET /public/team/:uuid/ranking` | `GET /competitions/:id/ranking/teams` | SSR + Fetch (polling) | 🟢 A1 | 🟡 B2 | 🔴 C3 |
| Relatórios | `views/reports/reports.ejs`<br>`GET /view/competitions/:id/reports` | `GET /competitions/:id/export` · `GET /competitions/:id/reports` | SSR + link download | 🟢 A1 | 🟡 B2 | 🔴 C3 |
| Log de Auditoria | `views/audit/auditLog.ejs`<br>`GET /view/competitions/:id/audit` | `GET /checkpoints/:id` (histórico) | SSR | 🟢 A1 | 🟡 B2 | 🔴 C3 |
| Erro 404 | `views/errors/404.ejs` | — | SSR | 🟢 A1 | — | 🟡 C2 |
| Erro 500 | `views/errors/500.ejs` | — | SSR | 🟢 A1 | — | 🟡 C2 |

> **Como ler:** as escalas **A** (Origem), **B** (Contrato), **C** (Estado) seguem a classificacao da Secao 9. Uma linha com `C3` significa que a view existe no repositorio mas ainda nao foi implementada - nao entregar sem completar. O contrato **B** foi atualizado para `B2` (documentado no `agent.md`) para todas as views cujo shape minimo e mapeamento de campos estao definidos na Secao 11.

---

## 11. Padrões de Implementação por Tela

### Dashboard (dashboard.ejs)

- Exibe lista de competições ativas.
- Mostra ranking resumido da competição em andamento (atualização a cada 5 min — RN11).
- Botão "Nova Competição" → formulário de criação.
- Botão "Encerrar Competição" → PATCH `/competitions/:id` com `{ status: 'encerrada' }` (RF012/RN14).
- O encerramento bloqueia novos checkpoints — sinalize visualmente na UI.

**Rota SSR:**
```
GET /view/dashboard
```

**Controller (`src/controllers/dashboardController.ts`):**
```typescript
async renderDashboard(req: Request, res: Response): Promise<void> {
  try {
    const competitions = await this.service.getActiveCompetitions();
    const activeCompetition = competitions.find(c => c.status === 'ativa');
    let ranking = null;
    if (activeCompetition) {
      ranking = await this.service.getTeamsRanking(activeCompetition.id);
    }
    res.render('dashboard/dashboard', {
      title: 'Dashboard — Red Bull 24h',
      competitions,
      activeCompetition,
      ranking,
      currentPage: 'dashboard'
    });
  } catch (error) {
    res.status(500).render('errors/500', { title: 'Erro interno' });
  }
}
```

**Shape mínimo:**
```
{
  competitions:      [{ id, name, date, address, status, created_at }],
  activeCompetition: { id, name, status } | null,
  ranking:           [{ position, id_team, team_name, total_distance_km, average_pace }] | null,
  currentPage:       'dashboard'
}
```

**Ações sem formulário:**
| Ação | Chamada | Como é feita |
|---|---|---|
| Nova Competição | Link para `GET /view/competitions/new` | Navegação SSR |
| Encerrar Competição | `PATCH /competitions/:id` com `{ status: 'encerrada' }` | Fetch JS em `app.js` com confirmação modal (RN14) |

### Painel Operacional (operationalPanel.ejs)

- Tela principal usada por Mariana no iPad durante o evento.
- Exibe corredor em execução e próximo corredor (RF011/RN10).
- Permite registro de checkpoint via OCR (fluxo externo — `ocr-src/`) ou manual.
- Campo obrigatório: distância (km). Pace e tempo são opcionais (RN04).
- Todo checkpoint registrado deve identificar o método de entrada (OCR ou manual — RN05).
- Após registrar, atualizar ranking (fetch para `/competitions/:id/ranking/teams`).
- Sinalizar inconsistências OCR antes de salvar (RN06).

**Rota SSR de renderização (obrigatória — sem ela o navegador retorna 404):**

```
GET /view/competitions/:id/operational-panel
```

Registrar em `src/routes/operationalPanelRoutes.ts` e montar no `app.ts`. O parâmetro `:id` é o ID da competição ativa.

**Controller (`src/controllers/operationalPanelController.ts`):**

O método `renderOperationalPanel` busca o contexto inicial e passa à view:

```typescript
async renderOperationalPanel(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const adminId = req.session?.adminId ?? '';   // da sessão autenticada

    const competition       = await this.service.getCompetition(id);
    const currentRunner     = await this.service.getCurrentRunner(id);
    const nextRunner        = await this.service.getNextRunner(id);
    const treadmills        = await this.service.getTreadmills();
    const recentCheckpoints = await this.service.getRecentCheckpoints(id);

    res.render('operational-panel/operationalPanel', {
      title: 'Painel Operacional — Red Bull 24h',
      competition,
      currentRunner,
      nextRunner,
      treadmills,
      recentCheckpoints,
      adminId,
      currentPage: 'operational-panel'
    });
  } catch (error) {
    res.status(500).render('errors/500', { title: 'Erro interno' });
  }
}
```

**Shape mínimo dos dados passados à view:**

```
{
  competition:       { id, name, status },
  currentRunner:     { id, name, team_name } | null,
  nextRunner:        { id, name, team_name } | null,
  treadmills:        [{ id, name, specification }],
  recentCheckpoints: [{ id, distance_km, pace, time, runner_name, created_at }],
  adminId:           string,
  currentPage:       'operational-panel'
}
```

**Mapeamento dos campos do formulário manual → POST /checkpoints:**

O form de registro manual envia todos os campos que o endpoint `POST /checkpoints` exige. Os campos que não são digitados pelo usuário vêm do contexto injetado pelo controller:

| Campo no POST | Origem na view | Preenchido por |
|---|---|---|
| `distance_km` | `<input>` visível | Usuário (obrigatório — RN04) |
| `pace` | `<input>` visível | Usuário (opcional — RN04) |
| `time` | `<input>` visível | Usuário (opcional — RN04) |
| `identifier` | `<input type="hidden">` | View — gera `"manual-<timestamp>"` único |
| `id_runner` | `<input type="hidden">` | Controller — `currentRunner.id` |
| `id_competition` | `<input type="hidden">` | Controller — `competition.id` |
| `id_treadmill` | `<select>` ou `<input type="hidden">` | Controller — lista de `treadmills` para o usuário escolher |
| `id_admin` | `<input type="hidden">` | Controller — `adminId` da sessão |

A view deve incluir estes hidden fields no form:

```html
<form action="/checkpoints" method="POST">
  <input type="hidden" name="identifier" value="manual-<%= Date.now() %>">
  <input type="hidden" name="id_competition" value="<%= competition.id %>">
  <input type="hidden" name="id_runner" value="<%= currentRunner?.id %>">
  <input type="hidden" name="id_admin" value="<%= adminId %>">
  <!-- id_treadmill: select populado com treadmills, ou hidden se houver apenas uma esteira -->
</form>
```

> **Identifier para registros manuais:** usar o padrão `"manual-<timestamp>"` para garantir unicidade. Para registros OCR, o `identifier` vem da extração da imagem e não deve ser gerado pela view.

### Equipes (teams.ejs)

- Lista equipes de uma competição específica.
- Ao criar uma equipe, o backend gera UUID automaticamente (RN01).
- Exibir link público gerado pelo UUID para o capitão.
- Limite: até 16 corredores por equipe (RF003).
- Roles disponíveis: "corredor" e "capitão" (RN07).

**Rota SSR:**
```
GET /view/competitions/:id/teams
```

**Controller (`src/controllers/teamController.ts`):**
```typescript
async renderTeamsList(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const teams = await this.service.getTeamsByCompetition(id);
    const competition = await this.service.getCompetition(id);
    res.render('teams/teams', {
      title: 'Equipes — Red Bull 24h',
      teams,
      competition,
      currentPage: 'teams'
    });
  } catch (error) {
    res.status(500).render('errors/500', { title: 'Erro interno' });
  }
}
```

**Shape mínimo:**
```
{
  competition: { id, name, status },
  teams:       [{ id, name, uuid, qr_code, runner_count }],
  currentPage: 'teams'
}
```

**Mapeamento dos campos do formulário → POST /competitions/:id/teams:**

O `id_competition` vem do parâmetro `:id` na URL, não de um campo do formulário.

| Campo no POST | Origem na view | Preenchido por |
|---|---|---|
| `name` | `<input>` visível | Usuário |
| `id_competition` | `req.params.id` (rota) | Controller — extraído da URL |

> O UUID é gerado automaticamente pelo backend (RN01). Após criar a equipe, exibir o link público `http://<host>/public/team/<uuid>` para o capitão.

### Ranking (ranking.ejs)

- Versão pública (acesso via UUID sem login) e versão administrativa.
- Versão pública: mostrar apenas leaderboard simplificado (RN13 — sem dados individuais que deem vantagem).
- Versão administrativa: ranking completo com pace médio e distância.
- Polling: painel adm atualiza a cada 5 min (RN11), painel público a cada 1h (RN09/RF015).

**Rotas SSR:**

| Versão | Rota | Autenticação |
|---|---|---|
| Administrativa | `GET /view/competitions/:id/ranking` | Requer login |
| Pública | `GET /public/team/:uuid/ranking` | Acesso via UUID sem login |

**Controller administrativo (`src/controllers/rankingController.ts`):**
```typescript
async renderRanking(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const teamRanking   = await this.service.getTeamRanking(id);
    const runnerRanking = await this.service.getRunnerRanking(id);
    const competition   = await this.service.getCompetition(id);
    res.render('ranking/ranking', {
      title: 'Ranking — Red Bull 24h',
      competition,
      teamRanking,
      runnerRanking,
      isAdmin: true,
      currentPage: 'ranking'
    });
  } catch (error) {
    res.status(500).render('errors/500', { title: 'Erro interno' });
  }
}
```

**Controller público (`src/controllers/publicController.ts`):**
```typescript
async renderPublicRanking(req: Request, res: Response): Promise<void> {
  try {
    const { uuid } = req.params;
    const team     = await this.service.getTeamByUuid(uuid);
    const ranking  = await this.service.getSimplifiedRanking(team.id_competition);
    res.render('ranking/ranking', {
      title: 'Ranking — Red Bull 24h',
      competition: { name: ranking.competition_name },
      teamRanking: ranking.teams,
      runnerRanking: null,
      isAdmin: false,
      currentPage: null
    });
  } catch (error) {
    res.status(404).render('errors/404', { title: 'Link inválido' });
  }
}
```

**Shape mínimo (admin):**
```
{
  competition:   { id, name, status },
  teamRanking:   [{ position, id_team, team_name, total_distance_km, average_pace }],
  runnerRanking: [{ position, id_runner, runner_name, team_name, total_distance_km, average_pace }] | null,
  isAdmin:       true,
  currentPage:   'ranking'
}
```

**Shape mínimo (público — RN13):**
```
{
  competition:   { name },
  teamRanking:   [{ position, team_name, total_distance_km }],
  runnerRanking: null,
  isAdmin:       false,
  currentPage:   null
}
```

**Polling via fetch:**
- Admin: `GET /competitions/:id/ranking/teams` a cada 5 min com `window.COMPETITION_ID` injetado pelo SSR
- Público: mesmo endpoint a cada 1h
- Respeitar RN09/RF015 nos intervalos de atualização

### Relatórios (reports.ejs)

- Exibe link para download do CSV da competição.
- O CSV deve conter checkpoints, timestamps e logs de validação (RN15).
- Link: `GET /competitions/:id/export`.
- Highlights pós-evento gerados automaticamente ao encerrar (RN16/RN17) — exibir quando disponíveis.

**Rota SSR:**
```
GET /view/competitions/:id/reports
```

**Controller (`src/controllers/reportController.ts`):**
```typescript
async renderReports(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const competition = await this.service.getCompetition(id);
    const highlights  = await this.service.getHighlights(id);
    res.render('reports/reports', {
      title: 'Relatórios — Red Bull 24h',
      competition,
      highlights,
      currentPage: 'reports'
    });
  } catch (error) {
    res.status(500).render('errors/500', { title: 'Erro interno' });
  }
}
```

**Shape mínimo:**
```
{
  competition: { id, name, status },
  highlights:  { summary, generated_at } | null,
  currentPage: 'reports'
}
```

**Links de download:**
| Recurso | Endpoint | Comportamento |
|---|---|---|
| CSV da competição | `GET /competitions/:id/export` | Download direto (Content-Disposition: attachment) |
| Relatório detalhado | `GET /competitions/:id/reports` | JSON com summary + highlights (RN16/RN17) |

### Login (auth/login.ejs)

- Tela de autenticação de administradores (acesso à área administrativa).

**Rota SSR:**
```
GET /view/login
```

**Controller (`src/controllers/authController.ts`):**
```typescript
// GET — renderiza o formulário de login
async renderLogin(req: Request, res: Response): Promise<void> {
  res.render('auth/login', {
    title: 'Login — Red Bull 24h',
    error: null
  });
}

// POST — processa a autenticação
async login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const session = await this.service.createSession(email, password);
    req.session = { adminId: session.admin.id, token: session.access_token };
    res.redirect('/view/dashboard');
  } catch (error) {
    res.status(401).render('auth/login', {
      title: 'Login — Red Bull 24h',
      error: 'Email ou senha inválidos.'
    });
  }
}
```

**Shape mínimo:**
```
{
  title: 'Login — Red Bull 24h',
  error: string | null
}
```

**Mapeamento do formulário → POST /auth/sessions:**

| Campo no POST | Origem na view | Preenchido por |
|---|---|---|
| `email` | `<input type="email">` visível | Usuário |
| `password` | `<input type="password">` visível | Usuário |

> Regra RN03: toda área administrativa exige autenticação. Se o acesso a qualquer rota `/view/*` for feito sem sessão válida, redirecionar para `/view/login`.

### Corredores (athlete.ejs)

- Lista corredores de uma equipe específica dentro de uma competição.
- Permite cadastrar, editar e excluir corredores.
- Roles disponíveis: "corredor" e "capitão" (RN07).
- Limite: até 16 corredores por equipe (RF003).

**Rota SSR:**
```
GET /view/competitions/:id/teams/:teamId/runners
```

**Controller (`src/controllers/runnerController.ts`):**
```typescript
async renderRunnersList(req: Request, res: Response): Promise<void> {
  try {
    const { id, teamId } = req.params;
    const runners     = await this.service.getRunnersByTeam(id, teamId);
    const competition = await this.service.getCompetition(id);
    const team        = await this.service.getTeamByCompetition(id, teamId);
    res.render('athlete/athlete', {
      title: 'Corredores — Red Bull 24h',
      competition,
      team,
      runners,
      currentPage: 'teams'
    });
  } catch (error) {
    res.status(500).render('errors/500', { title: 'Erro interno' });
  }
}
```

**Shape mínimo:**
```
{
  competition: { id, name },
  team:        { id, name, uuid },
  runners:     [{ id, name, status, email, phone, cpf, role }],
  currentPage: 'teams'
}
```

**Mapeamento dos campos do formulário → POST /competitions/:id/teams/:teamId/runners:**

`id_team` vem do parâmetro `:teamId` na URL, não de um campo do formulário.

| Campo no POST | Origem na view | Preenchido por |
|---|---|---|
| `name` | `<input>` visível | Usuário |
| `email` | `<input type="email">` visível | Usuário |
| `phone` | `<input>` visível | Usuário |
| `cpf` | `<input>` visível | Usuário |
| `role` | `<select>` visível | Usuário — opções: "corredor", "capitão" (RN07) |

### Log de Auditoria (auditLog.ejs)

- Exibe o histórico de checkpoints registrados em uma competição.
- Visualização somente leitura — sem formulários de escrita.
- Útil para auditar registros manuais e OCR.

**Rota SSR:**
```
GET /view/competitions/:id/audit
```

**Controller (`src/controllers/auditController.ts`):**
```typescript
async renderAuditLog(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const checkpoints = await this.service.getCheckpointsByCompetition(id);
    const competition = await this.service.getCompetition(id);
    res.render('audit/auditLog', {
      title: 'Log de Auditoria — Red Bull 24h',
      competition,
      checkpoints,
      currentPage: 'audit'
    });
  } catch (error) {
    res.status(500).render('errors/500', { title: 'Erro interno' });
  }
}
```

**Shape mínimo:**
```
{
  competition: { id, name },
  checkpoints: [{
    id, identifier, distance_km, pace, time,
    runner_name, team_name, treadmill_name, admin_name,
    metodo_entrada, created_at
  }],
  currentPage: 'audit'
}
```

> Log de Auditoria não possui formulários de escrita — apenas consulta.

---

## 12. Tratamento de Erros no Frontend

### Erros de servidor → views de erro

```typescript
// No middleware de erro global (src/middlewares/errorHandler.ts)
// 404
res.status(404).render('errors/404', { title: 'Página não encontrada' });

// 500
res.status(500).render('errors/500', { title: 'Erro interno' });
```

### Erros em forms → re-render com mensagem

```typescript
res.status(400).render('competitions/new', {
  title: 'Nova Competição',
  error: 'Nome, data e endereço são obrigatórios (RN18).',
  ...req.body  // preservar os dados digitados
});
```

```ejs
<!-- Na view, exibir erro se existir -->
<% if (locals.error) { %>
  <div class="alert alert-error" role="alert">
    <%= error %>
  </div>
<% } %>
```

### Erros em fetch → feedback no DOM

```javascript
try {
  const res = await fetch('/competitions/123/ranking/teams');
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  const data = await res.json();
  renderRanking(data);
} catch (err) {
  document.querySelector('#ranking-error').textContent =
    'Não foi possível atualizar o ranking. Tentando novamente em 5 min.';
}
```

### Status HTTP esperados do backend

| Situação | Status | O que fazer na view |
|---|---|---|
| Sucesso (leitura) | 200 | Renderizar os dados |
| Criado com sucesso | 201 | Redirecionar com mensagem de sucesso |
| Sem conteúdo | 204 | Remover item do DOM (delete) |
| Validação falhou | 400 / 422 | Re-renderizar form com mensagem de erro |
| Não autorizado | 401 | Redirecionar para login |
| Não encontrado | 404 | Renderizar errors/404.ejs |
| Erro interno | 500 | Renderizar errors/500.ejs |

---

## 13. Checklist de Entrega de uma Nova View

Antes de marcar qualquer view como concluída, percorra este checklist. Os itens marcados com uma escala indicam onde verificar a classificação correspondente (Seção 9).

**Estrutura e localização**
- [ ] O arquivo `.ejs` está em `src/views/[recurso]/[nome].ejs`.
- [ ] O cabeçalho da view contém bloco `<%# VIEW / ESTADO / LACUNAS / ENDPOINTS %>` com escalas C e B preenchidas.
- [ ] O estado **C** no cabeçalho reflete a realidade atual — não marcar C1 sem ter passado por todos os itens abaixo.

**Layout e partials**
- [ ] O layout `main.ejs` está sendo incluído corretamente.
- [ ] O partial `menu.ejs` está presente em todas as views administrativas.
- [ ] A variável `title` está sendo passada pelo controller.
- [ ] A variável `currentPage` está sendo passada para o menu.
- [ ] Todos os caminhos de `include` são relativos ao arquivo atual, não à raiz de `views/`.

**Dados e segurança EJS**
- [ ] Todos os dados exibidos usam `<%= %>` (escapado) — nunca `<%-` para input externo. **[D1]**
- [ ] Dados injetados no JS de cliente usam `<%- JSON.stringify(dados) %>` (raw) — não `<%= %>`. **[D1]**
- [ ] Toda string renderizada via `innerHTML` no JS de cliente passa por `escapeHtml()`. **[D1]**
- [ ] Nenhuma credencial, token ou dado sensível é passado ao template.

**Escalas A e B — origem e contratos**
- [ ] Cada endpoint consumido pela view tem marcação **A** nos comentários (A1/A2/A3). **[Escala A]**
- [ ] Cada campo acessado na response tem marcação **B** nos comentários (B1/B2/B3). **[Escala B]**
- [ ] Não há nenhum campo marcado **B3** sem que o controller tenha sido lido antes de implementar.
- [ ] Não há nenhuma decisão marcada **A3** sem comentário explícito de que é uma assunção.
- [ ] Não há nenhum **D3** implementado — se existe um D3, a linha está comentada e não executada.

**CSS e estilo**
- [ ] Os paths para CSS/JS usam `/css/...` e `/js/...` (absolutos, sem `public/`).
- [ ] As variáveis CSS de `variables.css` estão sendo usadas — sem cores hardcoded. **[D1]**
- [ ] Nenhuma variável CSS foi inventada — todas verificadas em `public/css/variables.css`. **[A1 obrigatório para CSS]**

**Controller e rota**
- [ ] O controller que renderiza a view busca dados via service — nunca diretamente do repositório. **[A1]**
- [ ] A rota de view está registrada em `src/routes/` e montada no `app.ts`.
- [ ] Forms usam `method="POST"` e o controller responde com `res.redirect()` após sucesso.
- [ ] Mensagens de erro são exibidas na view quando `locals.error` existir.
- [ ] Em caso de 404 ou 500, a view de erro correspondente é renderizada com o status correto.

**Comportamento dinâmico**
- [ ] Se houver polling via fetch, o intervalo respeita RN09/RN11 (5 min adm, 1h público). **[A1]**
- [ ] Erros de rede no fetch são tratados com mensagem de fallback visível ao usuário.

**Estado final**
- [ ] O cabeçalho da view foi atualizado para **C1** somente após todos os itens acima estarem marcados.
- [ ] A linha correspondente na tabela da Seção 10 foi atualizada com o novo estado C e os níveis B confirmados.

---

## 14. Regras de Negócio que Impactam o Frontend

Estas regras vêm do WAD oficial e devem ser respeitadas na camada visual. A coluna **Origem (A)** usa a Escala A da Seção 9 — indica o grau de certeza sobre como cada RN se traduz em elemento de UI.

| RN | Impacto na View | Origem (A) |
|---|---|---|
| RN01 | Ao criar equipe, exibir o UUID/link público gerado automaticamente | 🟢 A1 |
| RN02 | O link de UUID só é válido enquanto o evento está ativo — exibir aviso se expirado | 🟡 A2 |
| RN03 | Toda área administrativa exige autenticação — redirecionar para login se não autenticado | 🟢 A1 |
| RN04 | No form de checkpoint, apenas distância (km) é obrigatória — pace e tempo são opcionais | 🟢 A1 |
| RN05 | Exibir qual método foi usado (OCR ou manual) em cada checkpoint registrado | 🟢 A1 |
| RN06 | Se OCR identificar inconsistência, exibir alerta visual antes de permitir salvar | 🟡 A2 |
| RN07 | No cadastro de corredor, exibir campo de role (corredor / capitão) | 🟢 A1 |
| RN08 | Calculadora de descanso: usar pace da última corrida + parâmetros do evento | 🟡 A2 |
| RN09 | Painel público: atualização de ranking a cada 1h; painel adm: a cada 5 min | 🟢 A1 |
| RN12 | Edição retroativa de checkpoint: exigir campo "motivo" no form | 🟢 A1 |
| RN13 | Painel público: exibir apenas leaderboard simplificado — sem dados individuais sigilosos | 🟢 A1 |
| RN14 | Botão "Encerrar Competição" só para administrador — confirmar antes de executar | 🟢 A1 |
| RN15 | Botão de exportação CSV — garantir que o link aponta para `GET /competitions/:id/export` | 🟢 A1 |
| RN18 | Form de competição: nome, data e endereço são obrigatórios e devem ter validação no cliente | 🟢 A1 |

---

## 15. O que Nunca Fazer

Esta seção lista os erros mais comuns que quebram o projeto ou violam os contratos estabelecidos.

### Estrutura de arquivos

- ❌ Criar views fora de `src/views/`.
- ❌ Criar arquivos CSS fora de `public/css/`.
- ❌ Criar arquivos JS de cliente fora de `public/js/`.
- ❌ Colocar lógica de negócio dentro do template EJS — isso é responsabilidade do Service.
- ❌ Fazer queries SQL ou chamadas Supabase dentro do Controller — isso é responsabilidade do Repository.

### EJS e segurança

- ❌ Usar `<%- variavel %>` para qualquer dado vindo do usuário, do banco ou de input externo — risco de XSS.
- ❌ Usar `<%= JSON.stringify(dados) %>` (escapado) para injetar JSON no JS — vai quebrar o JavaScript. Use `<%-`.
- ❌ Colocar credenciais, tokens ou dados sensíveis em variáveis passadas ao template — ficam visíveis no HTML.

### Endpoints e contratos

- ❌ Inventar URLs de endpoint que não estão listadas na Seção 7.
- ❌ Fazer chamadas `fetch` para rotas sem tratar erros de rede.
- ❌ Esperar que `res.render` e `res.json` estejam na mesma rota — separar rotas de view (HTML) de rotas de API (JSON).

### CSS e estilo

- ❌ Hardcodar cores (`#E8001E`, `red`, `#000`) diretamente no HTML ou CSS — sempre usar variáveis de `variables.css`.
- ❌ Criar um segundo arquivo de variáveis CSS — consolidar tudo em `variables.css`.

### Rotas e navegação

- ❌ Registrar uma rota no arquivo de routes sem montá-la no `app.ts`.
- ❌ Responder com `res.render` após um POST bem-sucedido — usar `res.redirect()` (padrão Post-Redirect-Get) para evitar reenvio ao recarregar.

---

## A. Entidades e Atributos

| Entidade | Atributos | Classificacao |
|---|---:|---:|
| `competition` | `id`, `name`, `address`, `date`, `status`, `created_at` | 2 |
| `team` | `id`, `name`, `uuid`, `qr_code`, `id_competition`, `created_at` | 2 |
| `runner` | `id`, `name`, `status`, `email`, `phone`, `cpf`, `id_team`, `created_at` | 2 |
| `admin` | `id`, `name`, `email`, `area`, `password`, `created_at` | 2 |
| `treadmill` | `id`, `name`, `specification`, `created_at` | 2 |
| `checkpoint` | `id`, `identifier`, `distance_km`, `pace`, `time`, `image`, `id_runner`, `id_competition`, `id_treadmill`, `id_admin`, `created_at` | 2 |
| `team_ranking` | `position`, `id_team`, `team_name`, `id_competition`, `total_distance_km`, `average_pace`, `average_pace_seconds`, `runner_count` | 2 |
| `runner_ranking` | `position`, `id_runner`, `runner_name`, `id_team`, `total_distance_km`, `average_pace`, `average_pace_seconds` | 2 |
| `competition_export` | `exported_at`, `competition`, `teams`, `runners`, `checkpoints`, `rankings` | 2 |
| `auth_session` | `access_token`, `refresh_token`, `admin` | 2 |
| `ocr_extraction` | `id`, `image`, `extracted_data`, `validation`, `status`, `created_at`, `updated_at` | 3 |
| `competition_report` | `id_competition`, `summary`, `highlights`, `generated_at` | 3 |

## B. Chaves

| Tipo | Nome ideal | Classificacao |
|---|---:|---:|
| PK | `id`: chave primaria de `competition` | 1 |
| PK | `id`: chave primaria de `team` | 1 |
| PK | `id`: chave primaria de `runner` | 1 |
| PK | `id`: chave primaria de `admin` | 1 |
| PK | `id`: chave primaria de `treadmill` | 1 |
| PK | `id`: chave primaria de `checkpoint` | 1 |
| FK | `id_competition`: `team.id_competition -> competition.id` | 1 |
| FK | `id_team`: `runner.id_team -> team.id` | 1 |
| FK | `id_runner`: `checkpoint.id_runner -> runner.id` | 1 |
| FK | `id_competition`: `checkpoint.id_competition -> competition.id` | 1 |
| FK | `id_treadmill`: `checkpoint.id_treadmill -> treadmill.id` | 1 |
| FK | `id_admin`: `checkpoint.id_admin -> admin.id` | 1 |
| FK | `id_checkpoint`: `ocr_extraction.id_checkpoint -> checkpoint.id` | 2 |

## C. Métodos

| Recurso | Metodos | Classificacao |
|---|---:|---:|
| `competition` | `create`, `findAll`, `findById`, `update`, `close`, `delete` | 1 |
| `team` | `create`, `findByCompetition`, `findByCompetitionAndId`, `updateByCompetitionAndId`, `deleteByCompetitionAndId` | 2 |
| `runner` | `create`, `findByTeam`, `findByTeamAndId`, `updateByTeamAndId`, `deleteByTeamAndId`, `countByTeam` | 2 |
| `checkpoint` | `create`, `findAll`, `findById`, `update`, `delete`, `findByRunner`, `findByCompetition`, `findInconsistenciesByCompetition` | 2 |
| `ranking` | `generateTeamRanking`, `generateRunnerRanking`, `calculatePositions`, `calculateAveragePace` | 2 |
| `export` | `exportCompetition` | 1 |
| `report` | `generateCompetitionReport` | 3 |
| `auth` | `createSession`, `generateToken`, `validateToken` | 2 |
| `ocr` | `createExtraction`, `updateExtraction` | 3 |
| `admin` | `findAll`, `findById`, `findByEmail`, `create`, `update`, `delete` | 2 |

---

*Documento mantido pelo time de desenvolvimento — atualizar sempre que um novo endpoint ou view for adicionado ao projeto.*
