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