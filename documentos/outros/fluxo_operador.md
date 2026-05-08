# Fluxo de Telas do Coordenador Operacional

Esse documento é preparatório e mapeia jornadas, telas e transições da experiência do coordenador operacional no Sistema Red Bull 24 Horas. Serve como base para a construção dos wireframes da seção 3.3 do WAD.

## 1. Jornadas e Ações do Coordenador Operacional

A partir dos requisitos funcionais e regras de negócio do projeto, foram identificadas três jornadas principais do coordenador operacional: gestão de equipes, acompanhamento da competição e acesso aos relatórios e auditoria. As ações listadas abaixo representam as interações necessárias para operação do evento.

### Jornada 1 — Gerenciar equipes e competição

| ID  | Ação | Origem | RFs/RNs |
|---|---|---|---|
| A01 | Acessar o dashboard principal da competição | RF001 | RF001, RN03 |
| A02 | Navegar até a área de equipes | RF003 | RF003 |
| A03 | Criar uma nova equipe | RF003 | RF003, RN01 |
| A04 | Editar informações de uma equipe existente | RF003 | RF003 |
| A05 | Visualizar os dados gerais da equipe | RF015 | RF015, RN11 |
| A06 | Acessar o painel operacional de checkpoints | RF008 | RF008, RN04 |


### Jornada 2 — Acompanhar ranking e desempenho
| ID  | Ação | Origem | RFs/RNs |
|---|---|---|---|
| A07 | Acessar o módulo de ranking | RF010 | RF010 |
| A08 | Visualizar ranking da competição | RF010 | RF010, RN09 |
| A09 | Visualizar ranking global consolidado | RF015 | RF015, RN11 |

### Jornada 3 — Consultar relatórios e auditoria

| ID  | Ação | Origem | RFs/RNs |
|---|---|---|---|
| A10 | Acessar a área de relatórios | RF014 | RF014 |
| A11 | Exportar dados da competição | RF013 | RF013, RN15 |
| A12 | Visualizar relatório por equipe | RF014 | RF014, RN17 |
| A13 | Consultar log de auditoria das alterações | RF013 | RN05, RN12 |

## 2. Inventário de Telas

A partir das ações A01–A13 mapeadas anteriormente, foram identificadas as telas necessárias para que o coordenador operacional execute o gerenciamento do evento.

| ID  | Nome da tela | Propósito | Ações atendidas |
|---|---|---|---|
| T01 | Dashboard principal | Centralizar o acesso às principais áreas do sistema | A01 |
| T02 | Gestão de equipes | Gerenciar cadastro, edição e visualização das equipes | A02, A03, A04 |
| T03 | Cadastro de equipe | Permitir criação e edição de equipes participantes | A03, A04 |
| T04 | Dados da equipe | Exibir informações detalhadas da equipe e atletas | A05 |
| T05 | Painel operacional / checkpoints | Registrar checkpoints e acompanhar operação em tempo real | A06 |
| T06 | Ranking | Exibir acesso às classificações da competição | A07 |
| T07 | Ranking da competição | Exibir posição das equipes na competição atual | A08 |
| T08 | Ranking global | Exibir visão consolidada geral da competição | A09 |
| T09 | Relatórios | Centralizar acesso às funcionalidades analíticas | A10 |
| T10 | Exportação de dados | Permitir exportação de dados da competição | A11 |
| T11 | Relatório por equipe | Exibir métricas detalhadas por equipe | A12 |
| T12 | Log de auditoria | Exibir histórico de alterações e validações | A13 |

#### Notas sobre o inventário

- O **Dashboard principal (T01)** funciona como ponto central de navegação do sistema.
- O módulo de **Gestão de equipes (T02)** conecta funcionalidades operacionais e administrativas relacionadas às equipes da competição.
- O **Painel operacional (T05)** cuida do fluxo crítico da competição, relacionado aos checkpoints realizados a cada 5 minutos.
- O módulo de **Relatórios (T09)** agrupa exportações, relatórios analíticos e auditoria.



