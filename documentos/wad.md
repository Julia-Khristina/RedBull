<img src="../assets/logointeli.png">


# WAD - Web Application Document - Módulo 2 - Inteli

**_Os trechos em itálico servem apenas como guia para o preenchimento da seção. Por esse motivo, não devem fazer parte da documentação final_**

## Nome do Grupo

#### Nomes dos integrantes do grupo



## Sumário

[1. Introdução](#c1)

[2. Visão Geral da Aplicação Web](#c2)

[3. Projeto Técnico da Aplicação Web](#c3)

[4. Desenvolvimento da Aplicação Web](#c4)

[5. Testes da Aplicação Web](#c5)

[6. Estudo de Mercado e Plano de Marketing](#c6)

[7. Conclusões e trabalhos futuros](#c7)

[8. Referências](c#8)

[Anexos](#c9)

<br>


# <a name="c1"></a>1. Introdução (sprints 1 a 5)

A Red Bull, marca global atuante em eventos esportivos e experiências de marca, é o parceiro deste projeto por meio de seu time de Field Marketing, responsável pela operação do Red Bull 24 Horas, competição anual em que duas equipes de dezesseis corredores se revezam ininterruptamente em esteiras durante vinte e quatro horas, buscando acumular a maior quilometragem total. Atualmente, o registro dos quilômetros percorridos é realizado de forma manual por operadores, que anotam em pranchetas os momentos de início e término de cada turno, além de checkpoints periódicos. Esse processo é suscetível a erros de anotação, distrações humanas e inconsistências, o que compromete a confiabilidade e a rastreabilidade dos resultados finais. Como as esteiras utilizadas no evento não permitem integração direta com dispositivos externos e alternativas como dispositivos vestíveis sincronizados se mostraram inviáveis diante da dinâmica de trocas rápidas entre corredores, a apuração depende exclusivamente de registros humanos, sem mecanismos estruturados de auditabilidade dos dados.

Diante desse cenário, o projeto propõe o desenvolvimento de uma plataforma web de gestão de performance em tempo quase real, projetada para uso em iPads posicionados ao lado das esteiras pelos operadores do evento. A solução substitui o registro manual por uma abordagem de automação assistida, na qual o operador captura imagens do visor da esteira por meio de fotografia, e o sistema realiza a extração automática dos dados por meio de reconhecimento óptico de caracteres (OCR). Esses dados são submetidos à validação humana, com emissão de alertas em caso de inconsistências, garantindo maior confiabilidade e controle sobre o processo de apuração.

A plataforma é dividida em duas interfaces principais: uma área pública, responsável pela exibição do ranking das equipes atualizado em tempo quase real durante a competição, e uma área privada de operação, acessada exclusivamente por meio de autenticação baseada em UUID. Nesta área restrita, os operadores registram os checkpoints, corrigem dados extraídos via OCR, acompanham informações detalhadas de cada equipe e gerenciam a dinâmica da competição.

A criação de valor do sistema se concentra em quatro eixos principais: redução de erros no processo de apuração, aumento da confiabilidade e auditabilidade dos dados, ganho de eficiência operacional para a equipe organizadora da Red Bull e disponibilização de informações atualizadas em tempo quase real para acompanhamento público da competição.

# <a name="c2"></a>2. Visão Geral da Aplicação Web (sprint 1)

## 2.1. Escopo do Projeto (sprints 1 e 4)

### 2.1.1. Modelo de 5 Forças de Porter (sprint 1)

*Preencha com até 400 palavras*

*Posicione aqui o modelo de 5 Forças de Porter para sustentar o contexto da indústria.*

### 2.1.2. Análise SWOT da Instituição Parceira (sprint 1)

*Preencha com até 100 palavras – sem necessidade de fonte*

*Apresente uma visão geral da situação do parceiro com base na matriz SWOT (forças, fraquezas, oportunidades e ameaças). Foque na relação com os concorrentes e o posicionamento da instituição.*

### 2.1.3. Solução (sprints 1 a 5)

*Explique detalhadamente os seguintes aspectos (até 60 palavras por item):*
1. Problema a ser resolvido
2. Dados disponíveis (mencionar fonte e conteúdo; se não houver, indicar “não se aplica”)
3. Solução proposta
4. Forma de utilização da solução
5. Benefícios esperados
6. Critério de sucesso e como será avaliado

### 2.1.4. Value Proposition Canvas (sprint 1): 

O Canvas da Proposta de Valor permite analisar o alinhamento entre as necessidades do cliente e a solução proposta (Osterwalder; Pigneur, 2011). No contexto deste projeto, evidencia-se o encaixe entre as dificuldades enfrentadas por avaliadores e organizadores no processo de coleta, registro e apuração de dados em competições e a solução proposta, baseada na automatização por meio de reconhecimento óptico de caracteres (OCR) e disponibilização de informações em tempo real. Essa abordagem está alinhada ao uso de tecnologias digitais para aumento de eficiência operacional e redução de erros em processos manuais, amplamente discutido na literatura de transformação digital (Vial, 2019).

<div align="center">
  <sub>Imagem 3 - Value Proposition Canvas da Solução </sub><br>
  <img src="../assets/negocios/canvas.png" width="100%" alt="Representação da proposta de valor, com foco na automação do registro de dados e melhoria da eficiência operacional"><br>
  <sup>Fonte: Elaborado pelo próprio grupo (2026).</sup>
</div>

#### A. Perfil do Cliente

#### B. Mapa de Valor

Os elementos do mapa de valor foram estruturados para responder diretamente às dores identificadas e potencializar os ganhos esperados pelos usuários.

**Produtos e Serviços**

A solução proposta oferece os seguintes elementos:

* Plataforma digital de gestão de performance em tempo real
* Sistema de captura automática via OCR
* Dashboard para visualização de métricas por equipe
* Sistema de validação híbrida (automática e manual) dos dados

**Aliviadores de Dores**

A solução atua diretamente na redução das dificuldades enfrentadas pelos usuários:

* Eliminação do registro manual em papel e da digitação em planilhas
* Redução de erros humanos na coleta e digitação de dados
* Simplificação do processo de revisão e validação dos dados
* Centralização das informações em uma única plataforma
* Aumento da confiabilidade dos dados por meio de validação híbrida

**Criadores de Ganho**

Além de resolver problemas, a solução potencializa ganhos relevantes:

* Geração de informações em tempo real para acompanhamento da competição
* Disponibilização de uma visão consolidada e organizada dos dados
* Aumento da produtividade da equipe organizadora
* Apoio à tomada de decisão baseada em dados
* Melhoria da experiência dos avaliadores durante o evento 

A partir da análise do Value Proposition Canvas, observa-se que a solução proposta está diretamente alinhada às necessidades dos avaliadores e organizadores, ao automatizar o processo de coleta e registro de dados por meio de OCR, reduzindo erros humanos e esforço operacional. Além disso, a centralização e disponibilização das informações em tempo real caracterizam uma automação do fluxo de dados, proporcionando maior confiabilidade, eficiência e suporte à tomada de decisão, garantindo uma gestão mais precisa e organizada da competição.

### 2.1.5. Matriz de Riscos do Projeto (sprint 1)

## Matriz de Risco

A Matriz de Riscos é uma ferramenta que identifica e analisa os riscos que podem afetar a implementação e a eficácia de um projeto, considerando a probabilidade, impacto, classificação do risco e o plano de resposta. O objetivo é criar estratégias preventivas que garantam a qualidade da experiência do usuário, além da viabilidade técnica.

**Probabilidade de Ocorrência do Risco**

| Porcentagem   | Probabilidade | Descrição                              |
|--------------|--------------|----------------------------------------|
| 100% - 80%   | Muito Alto   | Provavelmente vai aconteçer          |
| 79% - 60%    | Alto         | Muita chance de aconteçer                |
| 59% - 40%    | Médio        | Pode ser que aconteça                    |
| 39% - 20%    | Baixo        | Pouca chance de aconteçer                |
| 19% - 0%     | Muito Baixo  | Não é provável que aconteça            |

**Impacto do Risco no Projeto**

| Impacto     | Descrição                                           |
|-------------|-----------------------------------------------------|
| Muito Alto  | Consequências altamente impactantes/irreversíveis   |
| Alto        | Consequências impactantes e pouco reversíveis       |
| Médio       | Consequências podem ser impactantes                 |
| Baixo       | Consequências reversíveis e pouco impactantes       |
| Muito Baixo | Consequências não impactantes                       |


**Matriz de Risco** 

| Risco                              | Descrição                                                                 | Probabilidade       | Impacto     | Classificação | Plano de Resposta                                                                 |
|-----------------------------------|---------------------------------------------------------------------------|--------------------|-------------|--------------|-----------------------------------------------------------------------------------|
| Falha no Reconhecimento de Imagem  | O sistema não consegue ler/identificar corretamente os dados da esteira. | 70% (Alto)         | Alto        | Crítico      | Treinar o modelo com imagens reais e implementar validação manual.               |
| Baixa Qualidade das Imagens       | Problemas de luz, movimento e velocidade afetam a captura dos dados.     | 80% (Muito Alto)   | Alto        | Crítico      | Padronizar pontos de captura e usar posição fixa ou aumentar frequência.         |
| Falha de Conexão com a Internet   | Wi-Fi lento dificulta a coleta de dados.                                  | 60% (Média)        | Alto        | Crítico      | Utilizar Wi-Fi privado e incluir testes prévios.                                 |
| Sobrecarga do Sistema             | Alto volume de dados pode causar falhas no processamento.                | 50% (Média)        | Alto        | Alto         | Realizar testes de carga com alta demanda antes do evento.                        |
| Erro Humano                       | Operadores podem errar devido ao costume com o sistema antigo.           | 40% (Média)        | Médio-Alto  | Alto         | Criar interface intuitiva e oferecer treinamento prévio.                          |
| Falta de Padronização             | Diferenças na coleta geram inconsistências no banco de dados.            | 30% (Baixa)        | Médio       | Médio        | Implementar validação automática e treinar o time antes do evento.               |
| Bugs                              | Falhas menores afetam a experiência, mas não impedem o uso.              | 20% (Baixa)        | Baixo       | Baixo        | Monitoramento em tempo real e testes com diferentes cenários.                    |



*Registre na matriz os riscos identificados no projeto.*

## 2.2. Personas (sprint 1)

*Posicione aqui suas Personas em forma de texto markdown com imagens, ou como imagem de template preenchido. Atualize esta seção ao longo do módulo se necessário.*

## 2.3. User Stories (sprints 1 a 5)



<div style="text-align: center;">
  <h4>Quadro 1 - US01</h4>
</div>

| Identificação        | US01 — Acessar Painel do Admin                                                                                                                                                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Persona              | Administrador                                                                                                                                                                                                                                                              |
| User Story           | Como administrador, posso acessar o painel do admin, para gerenciar a competição e acessar todas as funcionalidades do sistema de forma centralizada.                                                                                                                      |
| Critério de aceite 1 | CR1: O sistema deve permitir o acesso ao painel do admin em ambiente controlado.                                                                                                                                                                                           |
| Teste de aceitação 1                  |  Dado que o administrador acessa o sistema, quando entra na plataforma, então deve ser direcionado ao painel do admin.                                                                                                                                                 |
| Critério de aceite 2 | CR2: O painel deve exibir as principais seções do sistema.                                                                                                                                                                                                                 |
| Teste de aceitação 2                  |  Dado que o admin acessa o painel, quando a página carrega, então deve visualizar opções como “criar competição”, “equipes”, “ranking” e “relatórios”.                                                                                                                 |
| Critério de aceite 3 | CR3: O painel deve exibir o estado atual do sistema (com ou sem competição).                                                                                                                                                                                               |
| Teste de aceitação 3                  |  Dado que não há competição cadastrada, quando o painel é exibido, então deve mostrar a opção “Criar competição”.                                                                                                                                                      |
| Teste de aceitação 4                  | Dado que existe uma competição cadastrada, quando o painel é exibido, então deve mostrar status, tempo e equipes.                                                                                                                                                     |
| Critérios INVEST     | Independente: Não depende de sistema de login definido <br> Negociável: Forma de acesso pode ser definida depois <br> Valorosa: Centraliza o controle do sistema <br> Estimável: Escopo claro <br> Pequena: Uma tela principal <br> Testável: Comportamentos bem definidos |

---

<div style="text-align: center;">
  <h4>Quadro 2 - US02</h4>
</div>

| Identificação        | US02 — Cadastrar Evento                                                                                                                                              |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Persona              | Administrador                                                                                                                                                        |
| User Story           | Como administrador, posso cadastrar uma nova competição com data e localização, para estruturar e iniciar um evento de corrida.                                      |
| Critério de aceite 1 | CR1: O sistema deve permitir o preenchimento dos dados do evento.                                                                                                    |
| Teste de aceitação 1                  |  Dado que o admin acessa o formulário, quando preenche nome, data e local, então os campos devem aceitar os valores corretamente.                                |
| Critério de aceite 2 | CR2: O sistema deve validar campos obrigatórios.                                                                                                                     |
| Teste de aceitação 2                  |  Dado que há campos vazios, quando o admin tenta criar o evento, então o sistema deve impedir a criação e exibir erro.                                           |
| Critério de aceite 3 | CR3: O sistema deve criar o evento com status inicial.                                                                                                               |
| Teste de aceitação 3                  |  Dado que os dados são válidos, quando o admin confirma, então o evento deve ser criado com status “não iniciado”.                                               |
| Critérios INVEST     | Independente: Sim <br> Negociável: Campos podem mudar <br> Valorosa: Base do sistema <br> Estimável: Simples <br> Pequena: Formulário <br> Testável: Validação clara |

---

<div style="text-align: center;">
  <h4>Quadro 3 - US03</h4>
</div>

| Identificação        | US03 — Cadastrar Equipes                                                                                                                                                            |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Persona              | Administrador                                                                                                                                                                       |
| User Story           | Como administrador, posso cadastrar e editar equipes com seus atletas, para garantir que todos os participantes estejam registrados corretamente.                                   |
| Critério de aceite 1 | CR1: O sistema deve permitir criar uma equipe.                                                                                                                                      |
| Teste de aceitação 1                  |  Dado que o admin insere nome e líder, quando salva, então a equipe deve aparecer na lista.                                                                                     |
| Critério de aceite 2 | CR2: O sistema deve permitir adicionar atletas.                                                                                                                                     |
| Teste de aceitação 2                  |  Dado que o admin adiciona atletas, quando salva, então os atletas devem estar vinculados à equipe.                                                                             |
| Critério de aceite 3 | CR3: O sistema deve permitir edição e remoção de atletas.                                                                                                                           |
| Teste de aceitação 3                  |  Dado que o admin altera dados, quando salva, então as mudanças devem ser refletidas corretamente.                                                                              |
| Critérios INVEST     | Independente: Sim <br> Negociável: Estrutura pode mudar <br> Valorosa: Essencial <br> Estimável: CRUD simples <br> Pequena: Escopo controlado <br> Testável: Operações verificáveis |

---

<div style="text-align: center;">
  <h4>Quadro 4 - US04</h4>
</div>

| Identificação        | US04 — Monitoramento em Tempo Real (OCR)                                                                                                                                                                                     |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Persona              | Administrador / Juiz                                                                                                                                                                                                         |
| User Story           | Como administrador, posso registrar dados da corrida via OCR a partir de fotos da esteira, para atualizar automaticamente o desempenho das equipes com precisão.                                                             |
| Critério de aceite 1 | CR1: O sistema deve capturar imagem da esteira.                                                                                                                                                                              |
| Teste de aceitação 1                  |  Dado que o admin tira uma foto, quando a captura é feita, então a imagem deve ser exibida para preview.                                                                                                                 |
| Critério de aceite 2 | CR2: O sistema deve extrair dados via OCR.                                                                                                                                                                                   |
| Teste de aceitação 2                  | Dado que a imagem é processada, quando o OCR é executado, então deve retornar km, pace e tempo.                                                                                                                         |
| Critério de aceite 3 | CR3: O sistema deve permitir validação manual.                                                                                                                                                                               |
| Teste de aceitação 3                  |  Dado que o OCR retorna dados, quando o admin revisa, então deve poder confirmar ou corrigir.                                                                                                                            |
| Critério de aceite 4 | CR4: O sistema deve atualizar o ranking após validação.                                                                                                                                                                      |
| Teste de aceitação 4                  |  Dado que os dados são confirmados, quando salvos, então o ranking deve ser atualizado em tempo real.                                                                                                                    |
| Critérios INVEST     | Independente: Modular <br> Negociável: OCR pode evoluir <br> Valorosa: Funcionalidade central do sistema <br> Estimável: Complexidade média <br> Pequena: Divisível em partes <br> Testável: Entradas e saídas bem definidas |

---

<div style="text-align: center;">
  <h4>Quadro 5 - US05</h4>
</div>

| Identificação        | US05 — Acessar Relatórios                                                                                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Persona              | Administrador                                                                                                                                                                             |
| User Story           | Como administrador, posso acessar relatórios detalhados da competição, para analisar desempenho e inconsistências.                                                                        |
| Critério de aceite 1 | CR1: O sistema deve exibir relatórios da competição.                                                                                                                                      |
| Teste de aceitação 1                  |  Dado que o admin acessa relatórios, quando seleciona um tipo (visão geral da competição, relatórios por equipe e relatório de inconsistências), então os dados devem ser exibidos corretamente.                                                                        |
| Critério de aceite 2 | CR2: O sistema deve identificar inconsistências.                                                                                                                                          |
| Teste de aceitação 2                  |  Dado divergências entre OCR e manual, quando o relatório é gerado, então deve listar inconsistências.                                                                                |
| Critério de aceite 3 | CR3: O sistema deve permitir exportação de dados.                                                                                                                                         |
|Teste de aceitação 3                  |  Dado que o admin solicita exportação, quando executa a ação, então deve gerar um arquivo CSV.                                                                                        |
| Critérios INVEST     | Independente: Sim <br> Negociável: Pode evoluir <br> Valorosa: Gera insights estratégicos <br> Estimável: Complexidade média <br> Pequena: Modular <br> Testável: Resultados verificáveis |


# <a name="c3"></a>3. Projeto da Aplicação Web (sprints 1 a 5)

## 3.1. Requisitos do Sistema (sprints 1 a 5)

Esta seção apresenta os requisitos funcionais, regras de negócio e requisitos não funcionais do sistema. Eles definem o comportamento esperado da aplicação, suas restrições e critérios de qualidade, servindo como base para implementação e validação ao longo das sprints.

### 3.1.1. Requisitos Funcionais (sprint 1, refinar até sprint 5)

| ID    | Descrição                                                                                                                                                             | Prioridade | Status    |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------- |
| RF001 | O sistema deve permitir a criação de salas de competição protegidas por senha definida pelo usuário                                                                   | Alta       | Planejado |
| RF002 | O sistema deve permitir o registro de uma competição contendo nome, data e local                                                                                      | Alta       | Planejado |
| RF003 | O sistema deve permitir o cadastro, edição e exclusão de equipes, com suporte para até 16 atletas por equipe                                                          | Alta       | Planejado |
| RF004 | O sistema deve permitir autenticação de operadores via UUID para acesso à área administrativa                                    | Alta       | Planejado |
| RF005 | O sistema deve capturar automaticamente dados do painel da esteira a partir de imagens fotografadas utilizando OCR. | Alta       | Planejado |
| RF006 | O sistema deve disponibilizar os dados capturados via API para validação antes de serem persistidos.                                | Alta       | Planejado |
| RF007 | O sistema deve permitir a edição manual dos dados capturados via OCR antes da confirmação do checkpoint                                                               | Alta       | Planejado |
| RF008 | O sistema deve registrar checkpoints contendo distância, pace, velocidade e tempo total somente após validação do usuário                                             | Alta       | Planejado |
| RF009 | O sistema deve identificar inconsistências nos dados capturados via OCR e sinalizar ao usuário antes da validação                                                     | Média      | Planejado |
| RF010 | O sistema deve atualizar automaticamente o ranking das equipes em tempo quase real a cada checkpoint validado                                                         | Média      | Planejado |
| RF011 | O sistema deve exibir o atleta em execução e o próximo atleta escalado por equipe no painel administrativo                                                            | Baixa      | Planejado |
| RF012 | O sistema deve permitir o encerramento da competição pelo usuário, bloqueando novos registros de checkpoints                                                          | Alta       | Planejado |
| RF013 | O sistema deve exportar os dados da competição em formato CSV, incluindo checkpoints, timestamps e logs de validação                                                  | Alta       | Planejado |
| RF014 | O sistema deve gerar automaticamente ao final da competição relatórios e highlights de desempenho por atleta, equipe e geral                                          | Baixa      | Planejado |
| RF015 | O sistema deve manter consistência entre os dados registrados e os exibidos no painel em tempo quase real                                                             | Média      | Planejado |

### 3.1.2. Regras de Negócio (sprint 1, refinar até sprint 5)

*Numere e redija as RN de forma implementável e testável. Toda RN deve ter pelo menos um teste automatizado associado a partir da sprint 3.*

| ID   | Descrição | RF associado |
|------|-----------|--------------|
| RN01 | ...       | RF001        |
| RN02 | ...       | RF001        |

### 3.1.3. Requisitos Não Funcionais — 8 Eixos ISO/IEC 25010 (sprints 1 a 5)

| Eixo                        | Requisito                                                                                                | Métrica / Critério                                   | Como atendido                                      |
| --------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------- |
| USAB — Usabilidade          | O sistema deve permitir execução das funções principais sem treinamento extensivo                        | ≥ 80% dos usuários concluem tarefas em até 5 minutos | Testes de usabilidade com usuários representativos |
| CONF — Confiabilidade       | O sistema deve manter consistência entre captura OCR, validação do usuário e persistência de checkpoints | Taxa de falha < 1% no processamento de checkpoints   | Logs e testes automatizados                        |
| DES — Desempenho            | O sistema deve atualizar ranking em tempo quase real após validação                                      | ≤ 500 ms (p95)                                       | Testes de performance no fluxo completo            |
| SUP — Suportabilidade       | O sistema deve permitir manutenção sem interromper competições                                           | Arquitetura modular (OCR, validação, ranking)        | Estrutura em camadas e versionamento               |
| SEG — Segurança             | O sistema deve garantir autenticação segura de usuário único com controle de sessão                      | Sessão autenticada válida durante uso do sistema     | Login por senha e gerenciamento de sessão          |
| CAP — Capacidade            | O sistema deve suportar múltiplos usuários simultâneos durante a competição                              | ≥ 100 usuários simultâneos estáveis                  | Testes de carga                                    |
| REST — Restrições de Design | O sistema deve operar com captura via OCR, validação humana e processamento via API centralizada         | Fluxo obrigatório OCR → validação → API → backend    | Arquitetura centralizada                           |
| ORG — Organizacionais       | O desenvolvimento deve seguir metodologia ágil com entregas por sprint                                   | Versionamento e rastreabilidade por sprint           | Uso de Git e organização de branches               |

### 3.1.4. Matriz RF → RN → Endpoint (sprints 3 a 5)

*Matriz de cobertura mostrando quais RN e endpoints implementam cada RF.*

| RF    | RN associadas | Endpoint    | Método |
|-------|---------------|-------------|--------|
| RF001 | RN01, RN02    | `/usuarios` | POST   |

## 3.2. Arquitetura (sprints 1 a 5)

### 3.2.1. Diagrama de Arquitetura (sprints 3 e 4)

*Posicione aqui o diagrama de arquitetura da solução, indicando as camadas principais (Controller, Service, Repository, Model) e suas responsabilidades. Atualize sempre que necessário.*

### 3.2.2. Diagrama de Casos de Uso (sprint 1)

*Apresente o diagrama de casos de uso com atores (boneco), casos (elipse) e as relações `<<include>>` / `<<extend>>` com semântica correta. Consulte a notação de referência em `in02/suporte/use-case_3.0_v1.0.pdf`.*

### 3.2.3. Diagrama de Classes do Domínio (sprint 2)

*Diagrama UML de classes com entidades, atributos, relacionamentos e responsabilidades. Diferencie **associação**, **agregação** (losango vazio), **composição** (losango cheio) e **herança** (triângulo vazio). Multiplicidade explícita em toda associação.*

### 3.2.4. Diagrama de Sequência UML (sprint 3)

*Ao menos um fluxo prioritário, mostrando a interação entre as camadas Controller → Service → Repository → Banco. Linhas de vida verticais, ativação correta, mensagens síncronas e assíncronas diferenciadas, retornos tracejados.*

### 3.2.5. Diagrama de Atividades ou Estados (sprint 3)

*Ao menos um fluxo relevante em UML ou BPMN. Use a notação da ferramenta escolhida de forma consistente (sem misturar convenções).*

### 3.2.6. Diagrama de Implantação (sprints 4 e 5)

*Diagrama UML de deployment mostrando nós físicos, artefatos e canais de comunicação. Representa a visão Engineering + Technology do RM-ODP.*

### 3.2.7. Padrões de Projeto Aplicados (sprints 3 a 5)

*Documente os design patterns utilizados (Repository, Strategy, Factory, DTO etc.) e quais princípios SOLID se aplicam. Justifique a adoção de cada padrão com base em uma necessidade real do projeto.*

## 3.3. Wireframes (sprint 2)

*Posicione aqui as imagens do wireframe construído para sua solução e, opcionalmente, o link para acesso (mantenha o link sempre público para visualização)*

## 3.4. Guia de estilos (sprint 3)

*Descreva aqui orientações gerais para o leitor sobre como utilizar os componentes do guia de estilos de sua solução*

### 3.4.1 Cores

*Apresente aqui a paleta de cores, com seus códigos de aplicação e suas respectivas funções*

### 3.4.2 Tipografia

*Apresente aqui a tipografia da solução, com famílias de fontes e suas respectivas funções*

### 3.4.3 Iconografia e imagens 

*(esta subseção é opcional, caso não existam ícones e imagens, apague esta subseção)*

*posicione aqui imagens e textos contendo exemplos padronizados de ícones e imagens, com seus respectivos atributos de aplicação, utilizadas na solução*

## 3.5 Protótipo de alta fidelidade (sprint 3)

*posicione aqui algumas imagens demonstrativas de seu protótipo de alta fidelidade e o link para acesso ao protótipo completo (mantenha o link sempre público para visualização)*

## 3.6. Modelagem do banco de dados (sprints 2 e 4)

### 3.6.1. Modelo Entidade-Relacionamento (ER) (sprint 2)

*Apresente o modelo ER conceitual com entidades, atributos e relacionamentos. Use notação consistente (Chen ou Crow's Foot — não misture).*

### 3.6.2. Diagrama Entidade-Relacionamento (DER) (sprint 2)

*Posicione aqui o DER com cardinalidades explícitas em ambos os lados de cada relação e identificação de PK/FK. O DER deve ser coerente com o diagrama de classes (3.2.3).*

### 3.6.3. Modelo Relacional e Modelo Físico (sprints 2 e 4)

*Posicione aqui os diagramas de modelos relacionais do banco de dados, apresentando todos os esquemas de tabelas e suas relações. Inclua as migrations DDL numeradas e reproduzíveis (`CREATE TABLE`, `CREATE INDEX`, constraints `NOT NULL`, `UNIQUE`, `FOREIGN KEY`, `CHECK`). Utilize texto para complementar suas explicações quando necessário.*

### 3.6.4. Consultas SQL e lógica proposicional (sprint 2)

*posicione aqui uma lista de consultas SQL compostas, realizadas pelo back-end da aplicação web, com sua respectiva lógica proposicional, descrita conforme template abaixo. Lembre-se que para usar LaTeX em markdown, basta você colocar as expressões entre $ ou $$*

*Template de SQL + lógica proposicional*
#1 | ---
--- | ---
**Expressão SQL** | SELECT * FROM suppliers WHERE (state = 'California' AND supplier_id <> 900) OR (supplier_id = 100); 
**Proposições lógicas** | $A$: O estado é 'California' (state = 'California') <br> $B$: O ID do fornecedor não é 900 (supplier_id ≠ 900) <br> $C$: O ID do fornecedor é 100 (supplier_id = 100)
**Expressão lógica proposicional** | $(A \land B) \lor C$
**Tabela Verdade** | <table> <thead> <tr> <th>$A$</th> <th>$B$</th> <th>$C$</th> <th>$(A \land B)$</th> <th>$(A \land B) \lor C$</th> </tr> </thead> <tbody> <tr> <td>F</td> <td>F</td> <td>F</td> <td>F</td> <td>F</td> </tr> <tr> <td>F</td> <td>F</td> <td>V</td> <td>F</td> <td>V</td> </tr> <tr> <td>F</td> <td>V</td> <td>F</td> <td>F</td> <td>F</td> </tr> <tr> <td>F</td> <td>V</td> <td>V</td> <td>F</td> <td>V</td> </tr> <tr> <td>V</td> <td>F</td> <td>F</td> <td>F</td> <td>F</td> </tr> <tr> <td>V</td> <td>F</td> <td>V</td> <td>F</td> <td>V</td> </tr> <tr> <td>V</td> <td>V</td> <td>F</td> <td>V</td> <td>V</td> </tr> <tr> <td>V</td> <td>V</td> <td>V</td> <td>V</td> <td>V</td> </tr> </tbody> </table>

*Dica: edite a tabela verdade fora do markdown, para ter melhor controle*

## 3.7. WebAPI e endpoints (sprints 3 e 4)

*Utilize um link para outra página de documentação contendo a descrição completa de cada endpoint. Ou descreva aqui cada endpoint criado para seu sistema.* 

*Cada endpoint deve conter endereço, método (GET, POST, PUT, PATCH, DELETE), header, body, formatos de response e os status codes possíveis (200, 201, 204, 400, 401, 403, 404, 409, 422, 500).*

## 3.8. Autenticação, Autorização e Resiliência (sprint 5)

### 3.8.1. Autenticação

*Descreva o fluxo de autenticação implementado: persistência de senha com hash bcrypt/argon2 (parâmetros de custo explícitos e justificados), validação de credenciais e criação de sessão. Senhas em texto plano no banco não são aceitas.*

### 3.8.2. Controle de sessão

*Descreva o controle de sessão baseado em `session id` persistido em tabela própria, com expiração. Se optar por JWT, justifique a escolha explicando os trade-offs (stateless, não revogável, payload exposto).*

### 3.8.3. Autorização

*Descreva as regras de autorização por rota e por operação, baseadas no perfil do usuário autenticado. A verificação deve ocorrer no backend — o frontend nunca é fonte de verdade para autorização.*

### 3.8.4. Estratégias de Resiliência

*Descreva as estratégias aplicadas no tratamento de falhas de rede: timeout, retry com backoff exponencial, circuit breaker e idempotência em operações críticas (`PUT`, `DELETE`, operações de pagamento etc.).*

## 3.9. Matriz de Rastreabilidade (RTM) (sprints 3 a 5)

*A RTM consolida a rastreabilidade completa do sistema. Um elo quebrado invalida toda a cadeia — mantenha-a atualizada a cada sprint. A partir da sprint 3 não deve haver lacunas nos fluxos centrais.*

| Persona | RF    | RN   | Endpoint    | Tela     | Teste | Evidência        |
|---------|-------|------|-------------|----------|-------|------------------|
| ...     | RF001 | RN01 | `/usuarios` | Cadastro | CT02  | print, log, relatório de cobertura |

# <a name="c4"></a>4. Desenvolvimento da Aplicação Web

## 4.1. Primeira versão da aplicação web (sprint 3)

*Descreva e ilustre aqui o desenvolvimento da primeira versão do sistema web. Utilize prints de tela para ilustrar. Indique obrigatoriamente: (a) o que foi implementado, (b) o que não foi concluído, (c) dificuldades técnicas enfrentadas e próximos passos.*

## 4.2. Segunda versão da aplicação web (sprint 4)

*Descreva e ilustre aqui o desenvolvimento da segunda versão do sistema web, com foco no que foi consolidado entre a primeira versão funcional e o sistema operacional integrado. Utilize prints de tela para ilustrar. Indique obrigatoriamente: (a) o que foi implementado, (b) o que não foi concluído, (c) dificuldades técnicas enfrentadas e próximos passos.*

## 4.3. Versão final da aplicação web (sprint 5)

*Descreva e ilustre aqui o desenvolvimento da versão final do sistema web, com foco em refatorações, correções finais e na camada de autenticação/autorização entregue. Utilize prints de tela para ilustrar. Indique obrigatoriamente: (a) o que foi refinado ou adicionado desde a sprint 4, (b) pendências remanescentes, (c) dificuldades técnicas enfrentadas.*

# <a name="c5"></a>5. Testes

## 5.1. Relatório de testes de integração de endpoints automatizados (sprint 4)

*Liste e descreva os testes automatizados dos endpoints criados e planejados para sua solução, implementados com **Jest**. Cubra as duas abordagens:*

- ***White-box*** *— testes unitários de Service que exercitam ramos internos, exceções e regras de negócio (conhecimento da implementação).*
- ***Black-box*** *— testes de integração dos endpoints via Jest + Supertest, verificando apenas o contrato HTTP (status, body, efeito observável), sem depender da implementação interna.*

*Posicione aqui também o relatório de cobertura de testes Jest se houver (através de link ou transcrito para estrutura markdown).*

## 5.2. Testes de usabilidade (sprint 5)

### 5.2.1. Relatório de testes de guerrilha

*Posicione aqui as tabelas com enunciados de tarefas, etapas e resultados de testes de usabilidade. Ou utilize um link para seu relatório de testes (mantenha o link sempre público para visualização).*

### 5.2.2. Relatório de testes SUS (System Usability Scale)

*Posicione aqui o relatório dos testes SUS realizados.*

# <a name="c6"></a>6. Estudo de Mercado e Plano de Marketing (sprint 4)

## 6.1 Resumo Executivo

*Preencher com até 300 palavras, sem necessidade de fonte*

*Apresente de forma clara e objetiva os principais destaques do projeto: oportunidades de mercado, diferenciais competitivos da aplicação web e os objetivos estratégicos pretendidos.*

## 6.2 Análise de Mercado

*a) Visão Geral do Setor (até 250 palavras)*
*Contextualize o setor no qual a aplicação está inserida, considerando aspectos econômicos, tecnológicos e regulatórios. Utilize fontes confiáveis.*

*b) Tamanho e Crescimento do Mercado (até 250 palavras)*
*Apresente dados quantitativos sobre o tamanho atual e projeções de crescimento do mercado. Utilize fontes confiáveis.*

*c) Tendências de Mercado (até 300 palavras)*
*Identifique e analise tendências relevantes (tecnológicas, comportamentais e mercadológicas) que influenciam o setor. Utilize fontes confiáveis.*

## 6.3 Análise da Concorrência

*a) Principais Concorrentes (até 250 palavras)*
*Liste os concorrentes diretos e indiretos, destacando suas principais características e posicionamento no mercado.*

*b) Vantagens Competitivas da Aplicação Web (até 250 palavras)*
*Descreva os diferenciais da sua aplicação em relação aos concorrentes, sem necessidade de citação de fontes.*


## 6.4 Público-Alvo

*a) Segmentação de Mercado (até 250 palavras)*
Descreva os principais segmentos de mercado a serem atendidos pela aplicação. Utilize bases de dados e fontes confiáveis.*

*b) Perfil do Público-Alvo (até 250 palavras)*
*Caracterize o público-alvo com dados demográficos, psicográficos e comportamentais, incluindo necessidades específicas. Utilize fontes obrigatórias.*


## 6.5 Posicionamento

*a) Proposta de Valor Única (até 250 palavras)*
*Defina de maneira clara o que torna a sua aplicação única e valiosa para o mercado.*

*b) Estratégia de Diferenciação (até 250 palavras)*
*Explique como sua aplicação se destacará da concorrência, evidenciando a lógica por trás do posicionamento.*

## 6.6 Estratégia de Marketing 

*a) Produto/Serviço (até 200 palavras)*
*Descreva as funcionalidades, benefícios e diferenciais da aplicação*

*b) Preço (até 200 palavras)*
*Explique o modelo de precificação adotado e justifique com base nas análises anteriores.*

*c) Praça (Distribuição) (até 200 palavras)*
*Apresente os canais digitais utilizados para distribuir e entregar a aplicação ao público.*

*d) Promoção (até 200 palavras)*
*Descreva as estratégias digitais planejadas, como SEO, redes sociais, marketing de conteúdo e campanhas pagas.*

# <a name="c7"></a>7. Conclusões e trabalhos futuros (sprint 5)

*Escreva de que formas a solução da aplicação web atingiu os objetivos descritos na seção 2 deste documento. Indique pontos fortes e pontos a melhorar de maneira geral.*

*Relacione os pontos de melhorias evidenciados nos testes com planos de ações para serem implementadas. O grupo não precisa implementá-las, pode deixar registrado aqui o plano para ações futuras*

*Relacione também quaisquer outras ideias que o grupo tenha para melhorias futuras*

# <a name="c8"></a>8. Referências (sprints 1 a 5)

OSTERWALDER, Alexander; PIGNEUR, Yves. Business Model Generation: a handbook for visionaries, game changers, and challengers. Hoboken: John Wiley & Sons, 2010.

VIAL, Gregory. Understanding digital transformation: a review and a research agenda. The Journal of Strategic Information Systems, v. 28, n. 2, p. 118–144, 2019.

# <a name="c9"></a>Anexos

*Inclua aqui quaisquer complementos para seu projeto, como diagramas, imagens, tabelas etc. Organize em sub-tópicos utilizando headings menores (use ## ou ### para isso)*
