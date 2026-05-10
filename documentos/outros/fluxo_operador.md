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

## 3. Transições entre Telas

Para cada tela do inventário, são definidas entradas, saídas e condições de transição.

| ID | De | Para | Gatilho | Condição | RFs/RNs |
|---|---|---|---|---|---|
| TR01 | T01 | T02 | Clique em “Equipes” | Usuário autenticado | RF003 |
| TR02 | T02 | T03 | Clique em “Cadastrar equipe” | Sempre disponível | RF003, RN01 |
| TR03 | T02 | T04 | Clique em equipe específica | Equipe existente | RF015 |
| TR04 | T02 | T05 | Clique em “Painel operacional” | Competição ativa | RF008, RN04 |
| TR05 | T01 | T06 | Clique em “Ranking” | Sempre disponível | RF010 |
| TR06 | T06 | T07 | Seleção “Ranking da competição” | Competição ativa | RF010, RN09 |
| TR07 | T06 | T08 | Seleção “Ranking global” | Sempre disponível | RF015, RN11 |
| TR08 | T01 | T09 | Clique em “Relatórios” | Sempre disponível | RF014 |
| TR09 | T09 | T10 | Clique em “Exportar dados” | Dados disponíveis | RF013, RN15 |
| TR10 | T09 | T11 | Clique em “Relatório por equipe” | Equipe selecionada | RF014, RN17 |
| TR11 | T09 | T12 | Clique em “Log de auditoria” | Sempre disponível | RN05, RN12 |

### Happy path identificado

```text
Dashboard principal (T01)
        │
        ├──► Gestão de equipes (T02)
        │       ├──► Cadastro de equipe (T03)
        │       ├──► Dados da equipe (T04)
        │       └──► Painel operacional (T05)
        │
        ├──► Ranking (T06)
        │       ├──► Ranking da competição (T07)
        │       └──► Ranking global (T08)
        │
        └──► Relatórios (T09)
                ├──► Exportar dados (T10)
                ├──► Relatório por equipe (T11)
                └──► Log de auditoria (T12)
```
#### Notas sobre as transições
- O Dashboard principal atua como hub central do sistema.
- O fluxo de ranking possui subdivisão entre visão específica da competição e visão global.
- A área de Relatórios concentra funcionalidades administrativas e de auditoria.
- O Painel operacional é acessado a partir da gestão de equipes por representar uma continuidade operacional do evento.

## 4. Diagrama do fluxo de telas
A figura abaixo consolida visualmente o fluxo de navegação do
coordenador operacional no sistema Red Bull 24 Horas, integrando
o inventário de telas com as transições identificadas durante o
mapeamento das jornadas. O diagrama evidencia o dashboard como
ponto central de navegação, permitindo acesso às áreas de gestão
de equipes, rankings e relatórios. Além disso, destaca os fluxos
relacionados ao cadastro de equipes, registro de checkpoints,
visualização de dados operacionais e acesso aos relatórios e logs
de auditoria utilizados no acompanhamento estratégico da competição.

<div align="center">
  <sub>Figura 1 - Diagrama de Fluxo de Telas do Operador da prova</sub><br>
  <img src="../../assets/design/fluxo-operador.svg" width="100%" alt="Diagrama de fluxo das telas do operador da prova, mostrando o caminho a partir da tela dashboard, com opções como equipes, ranking e relatório".><br>
  <sup>Fonte: Material produzido pelos autores (2026).</sup>
</div>






