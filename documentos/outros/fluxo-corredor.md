# Fluxo de Telas do Corredor

Documento preparatório que mapeia jornadas, telas e transições da
experiência do corredor no Sistema Red Bull 24 Horas. Serve como
base para a construção dos wireframes da seção 3.3 do WAD.

## 1. Jornadas e Ações do Corredor

A partir das User Stories US12 e US13, foram identificadas duas
jornadas principais do corredor: o **acesso ao painel da equipe**
(US12) e o **acompanhamento estratégico da competição** (US13).
As ações listadas abaixo representam o conjunto de interações que
o corredor precisa executar no app e servirão de base para o
inventário de telas e o mapeamento de transições.

### Jornada 1 — Acessar o painel da equipe (US12)

| ID  | Ação                                                                   | Origem     | RFs/RNs      |
|-----|------------------------------------------------------------------------|------------|--------------|
| A01 | Receber a URL única (UUID) enviada pelo administrador                  | US12       | RN01         |
| A02 | Acessar a URL pública sem necessidade de login                         | US12 / CR1 | RN01, RN02   |
| A03 | Visualizar mensagem de erro caso o UUID seja inválido                  | US12 / CR1 | RN02         |
| A04 | Carregar o painel exclusivamente da equipe vinculada ao UUID           | US12 / CR2 | RF015, RN09  |

### Jornada 2 — Acompanhar a competição em tempo real (US13)

| ID  | Ação                                                                                              | Origem      | RFs/RNs       |
|-----|---------------------------------------------------------------------------------------------------|-------------|---------------|
| A05 | Visualizar a posição atual da equipe no ranking global                                            | US13 / CR1  | RF010, RN09   |
| A06 | Visualizar a distância para o líder e a diferença para a equipe na posição anterior               | US13 / CR1  | RF010, RN09   |
| A07 | Consultar o status individual de cada atleta (pace médio, velocidade máxima, distância acumulada, último checkpoint, tempo parado, status atual) | US13 / CR2 | RF015, RN09 |
| A08 | Acompanhar a calculadora de descanso com indicador visual (verde / amarelo / vermelho)            | US13 / CR3  | RF011, RN08   |
| A09 | Visualizar tempo recomendado de descanso e contagem regressiva                                    | US13 / CR3  | RF011, RN08   |
| A10 | Compartilhar o ranking via link simplificado sem dados sensíveis dos atletas                      | US13 / CR4  | RF010, RN13   |

## 2. Inventário de Telas

A partir das ações A01–A10 mapeadas na seção anterior, foram
identificadas as telas necessárias para que o corredor cumpra
sua jornada no app. As ações A01 (receber URL) e A02 (acessar
URL) não geram tela própria — A01 é externa ao sistema e A02 é
o gatilho que carrega T01 ou T02 conforme a validade do UUID.

| ID  | Nome da tela                  | Propósito                                                                                         | Ações atendidas         |
|-----|-------------------------------|---------------------------------------------------------------------------------------------------|-------------------------|
| T01 | Erro — UUID inválido          | Exibe mensagem de erro quando o UUID acessado é inexistente ou expirou ao término do evento       | A03                     |
| T02 | Painel da equipe              | Tela principal do corredor: exibe ranking global, status individual dos atletas e calculadora de descanso | A04, A05, A06, A07, A08, A09 |
| T03 | Modal de compartilhamento     | Exibe link simplificado do leaderboard para envio via WhatsApp e redes sociais, sem dados sensíveis dos atletas | A10         |

### Notas sobre o inventário

- **T02 concentra a maior parte das ações** porque o painel da
  equipe é uma tela única com seções distintas (ranking, status
  por atleta, calculadora), conforme descrito na US13.
- **T03 é modal**, não uma tela separada — é acionado por botão
  dentro de T02 sem navegação de rota nova.
- **Sem telas de login** — acesso é público via UUID (US12 / CR1).

## 3. Transições entre Telas

Para cada tela do inventário, são definidas as entradas, saídas
e condições de transição. O happy path completo é:
acesso via UUID válido → T02 → ações no painel → T03 (opcional).

| ID   | De          | Para        | Gatilho                              | Condição                              | RFs/RNs     |
|------|-------------|-------------|--------------------------------------|---------------------------------------|-------------|
| TR01 | (externo)   | T01         | Usuário acessa URL com UUID inválido | UUID não existe ou evento encerrado   | RN02        |
| TR02 | (externo)   | T02         | Usuário acessa URL com UUID válido   | UUID existe e evento está ativo       | RN01, RN02  |
| TR03 | T02         | T02         | Atualização automática do ranking    | A cada 1 hora sem ação do usuário     | RF010, RN09 |
| TR04 | T02         | T03         | Clique em "Compartilhar ranking"     | Sempre disponível em T02              | RF010, RN13 |
| TR05 | T03         | T02         | Fechar modal de compartilhamento     | Usuário fecha ou clica fora do modal  | —           |
| TR06 | T01         | —           | —                                    | Tela final, sem saída para o sistema  | RN02        |

### Happy path identificado

```
URL recebida (A01)
      │
      ▼
UUID válido? ──NÃO──► T01 (erro) — fim
      │
     SIM
      │
      ▼
     T02 (painel da equipe)
      │
      ├── atualização automática a cada 1h (TR03, loop)
      │
      └── clique em "Compartilhar" ──► T03 (modal)
                                            │
                                            └── fechar ──► T02
```

### Notas sobre as transições

- **TR03 é um loop interno** em T02 — não há navegação de rota,
  apenas atualização dos dados de ranking em background (RN09).
- **T01 não tem saída** para o sistema — o corredor só consegue
  acessar o painel se receber um UUID válido do administrador.
- **T03 é transição dentro de T02** (modal sobreposto), não uma
  rota nova. Fechar o modal retorna ao estado anterior de T02.

  ## 4. Diagrama de Fluxo de Telas

A figura abaixo consolida visualmente o fluxo de navegação do
corredor, integrando o inventário de telas (seção 2) com as
transições mapeadas (seção 3). O diagrama destaca o caminho de
entrada via UUID, o tratamento de erro para UUID inválido, o
painel principal (T02) com atualização automática do ranking
e o modal de compartilhamento opcional (T03).

<div align="center">
  <sub>Figura 1 - Diagrama de Fluxo de Telas do Corredor</sub><br>
  <img src="../assets/design/fluxo_corredor.png" width="100%" alt="Diagrama de fluxo das telas do corredor mostrando o acesso via UUID, tela de erro, painel da equipe com atualização automática e modal de compartilhamento"><br>
  <sup>Fonte: Material produzido pelos autores (2026).</sup>
</div>