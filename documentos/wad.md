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

A análise SWOT (ou FOFA) é uma ferramenta de planejamento estratégico que possui quatro elementos: forças (pontos internos positivos), fraquezas (pontos internos negativos), ameaças (pontos externos negativos) e oportunidades (pontos externos positivos) (Casarotto, 2019). A partir disso, realizou-se a análise SWOT do RedBull 24 horas, conforme a figura 2.

<p align = "center"> Figura 2 - Análise SWOT</p>

<div align = "center">
  <img src="../assets/negocios/analiseSWOT.png"> 
</div>
<p align = "center"> Fonte: material produzido pelos autores (2025).</p>

#### Forças
<ul>
  No contexto do evento Red Bull 24 Horas, destacam-se como forças o investimento contínuo em inovação e ativações de marketing, aliado a uma marca já consolidada no cenário esportivo. Além disso, o evento conta com uma estrutura operacional bem definida, o que facilita a implementação de soluções digitais como diferencial competitivo.

</ul>

#### Fraquezas
<ul>
   Entre as fraquezas revelam-se que a ausência de integração com as esteiras limita a automação da coleta de dados, tornando o processo dependente de registros manuais. Além disso, a baixa consolidação em tempo real dificulta a visualização geral da competição, impactando a confiabilidade das informações durante a operação.
   </ul>

#### Oportunidades
<ul>
   Pensando nas oportunidades, o valor que cerca o marketing, mídia e engajamento do público em redes sociais alinha-se com a digitalização no evento Red Bull 24 Horas que abre espaço para o uso estratégico de dados como big numbers e dashboards. Ademais, a solução também pode ser escalada para outros eventos da Red Bull, acompanhando a tendência de experiências esportivas mais orientadas a dados. Por fim, o crescimento das running crews no Brasil, que são justamente os atletas escolhidos para competir.
</ul>

#### Ameaças
<ul>
  Entre as ameaças evidenciadas durante o Red Bull 24 Horas, falhas operacionais ao longo das 24 horas podem comprometer os registros da competição. Instabilidades técnicas ou de conexão também representam riscos relevantes. Além disso, a existência de processos alternativos internos pode reduzir a adoção da nova solução proposta.

</ul>


### 2.1.3. Solução (sprints 1 a 5)

1. Problema a ser resolvido

A ausência de automatização no registro de dados dos corredores sobrecarrega os operadores, que precisam preencher manualmente informações a cada cinco minutos ao longo de 24 horas. Esse processo está sujeito a erros de caligrafia e falhas por cansaço, resultando em informações incorretas que comprometem a apuração e as decisões da organização do evento. 

2. Dados disponíveis (mencionar fonte e conteúdo; se não houver, indicar “não se aplica”)

O site oficial do evento ([https://www.redbull.com/se-en/events/24-hours](https://www.redbull.com/se-en/events/24-hours)), compartilhado pela Red Bull no onboarding, serviu como referência de contexto. Nas conversas com o parceiro, ficou evidente a necessidade de automatizar o registro dos checkpoints para reduzir a inserção de dados errôneos ao longo da competição.

3. Solução proposta

A solução é uma aplicação web que automatiza o registro de dados via OCR, visto que, o operador fotografa o display da esteira e o sistema extrai as informações automaticamente. A plataforma também contempla cadastro de equipes e atletas, acompanhamento em tempo real e geração de relatórios com métricas para análise ao final de cada edição.

4. Forma de utilização da solução

O administrador cadastra a competição e equipes, e registra checkpoints durante o evento via OCR ou entrada manual. Corredores e capitães acessam, por link exclusivo, um painel com ranking das equipes da edição ao redor do mundo, desempenho individual e calculadora de descanso. Ao fim da prova, o administrador consulta relatório completo com dados exportáveis para análise estratégica futura.

5. Benefícios esperados

A automatização via OCR elimina a principal dor operacional da Red Bull, o registro manual sujeito a erros. Além disso, a plataforma oferece métricas em tempo real para administradores e atletas, como pace, evolução por hora e consistência de desempenho, gerando elementos estratégicos para validar a edição e orientar decisões para os próximos eventos.

6. Critério de sucesso e como será avaliado

O sucesso será avaliado pela redução de erros nos registros em relação ao método atual e pela consistência dos dados gerados. A proposta é gerar taxa de falha menor que 1% no processamento de checkpoints. A validação ocorre com a Red Bull após aplicação prática, verificando o impacto operacional da solução e qualidade das análises produzidas ao longo e após o evento.

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

<div align="center">
  <sub>Imagem 6 - Persona 2 — Bruno Monteiro, Gerente de Field Marketing</sub><br>
  <img src="../assets/personas/persona2.png" width="100%" alt="Persona representando o gerente de Field Marketing responsável pela supervisão da coleta de dados e análise de desempenho na competição"><br>
  <sup>Fonte: Elaborado pelo próprio grupo (2026).</sup>
</div>


## 2.3. User Stories (sprints 1 a 5)

User stories são descrições curtas e objetivas de funcionalidades escritas sob a perspectiva do usuário final. Elas seguem geralmente o formato: “Como (papel/perfil), posso (ação/meta), para (benefício/razão)”, com foco no valor entregue e não em detalhes técnicos (INTERACTION DESIGN FOUNDATION, 2024). Esse modelo é amplamente utilizado em metodologias ágeis como o Scrum, pois facilita a comunicação entre equipe de desenvolvimento e stakeholders, além de permitir a divisão dos requisitos em partes menores e testáveis. 

A partir das user stories, torna-se necessário compreender quem são os usuários que estão sendo representados. Nesse contexto, entram as personas, que são representações fictícias baseadas em dados reais de usuários. Elas descrevem características como necessidades, objetivos, comportamentos e desafios, permitindo que a equipe tenha uma visão mais concreta do público-alvo (NIELSEN NORMAN GROUP, 2024). Dessa forma, as decisões de design e desenvolvimento passam a ser guiadas por perfis realistas, garantindo maior alinhamento com as expectativas dos usuários e contribuindo para soluções mais eficazes e centradas na experiência.

Com as user stories definidas e as personas estabelecidas, é necessário garantir que as funcionalidades descritas estejam claras e possam ser validadas. Para isso, utilizam-se os critérios de aceitação, que são condições específicas, mensuráveis e verificáveis que determinam quando uma user story pode ser considerada concluída (TYMOSHCHENKO, 2023). Esses critérios reduzem ambiguidades, facilitam testes e garantem que o sistema desenvolvido atenda às expectativas do usuário. Por exemplo, um critério de aceitação pode ser: “Dado que o usuário adiciona um produto ao carrinho de compras (ambiente digital), quando ele acessa o carrinho, então o item deve ser exibido com o nome, quantidade e preço corretos”.


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

<p align = "center"> Fonte: Material produzido pelos autores (2026).</p>
<br> <br>

<p align = "center"> Quadro 6 - User Story 6</p>

| Identificação        | US06                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Persona**          | Administrador                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **User Story**       | Como Administrador, posso gerar uma URL única (UUID) automaticamente ao cadastrar uma equipe, para que o link possa ser distribuído ao capitão da equipe sem necessidade de login.                                                                                                                                                                                                                                                                                             |
| **CR1**              | **Geração automática do UUID:** Ao clicar em "Salvar equipe" no modal de criação, o sistema gera um UUID único e o exibe na tela com um botão "Copiar link". **Testes:** Salvar uma equipe e verificar que o UUID aparece imediatamente; Confirmar que dois cadastros distintos geram UUIDs diferentes; Verificar que o link é acessível publicamente sem autenticação.                                                                                                        |
| **CR2**              | **Exibição no card da equipe:** O UUID e o botão "Copiar link" ficam visíveis no card da equipe na listagem. **Testes:** Navegar para a tela de Equipes e confirmar que cada card exibe seu UUID; Clicar em "Copiar link" e verificar que o link é copiado corretamente para a área de transferência.                                                                                                                                                                          |
| **CR3**              | **Persistência durante o evento:** O UUID não expira enquanto o evento estiver ativo. **Testes:** Acessar o link durante o período de evento;                                                                                                                                                                                                                                                                                                                                  |
| **Critérios INVEST** | **Independente:** não depende de outras US para geração do UUID. **Negociável:** pode ser simplificada e discutida com o parceiro e todos os envolvidos no projeto para refinamento.  **Valiosa:** elimina necessidade de login para a equipe. **Estimável:** fluxo claro de geração de UUID no momento do cadastro. **Pequena:** escopo limitado à geração, exibição e cópia do link. **Testável:** comportamento verificável via criação de equipes e acesso ao link gerado. |
|                      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

<p align = "center"> Fonte: Material produzido pelos autores (2026).</p>
<br> <br>

<p align = "center"> Quadro 7 - User Story 7</p>

| Identificação        | US07                                                                                                                                                                                                                                                                                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Persona**          | Administrador                                                                                                                                                                                                                                                                                                                                            |
| **User Story**       | Como Administrador, posso acessar a aba de Equipes pelo menu de navegação ou pelo card de atalho na Home, para gerenciar o cadastro de equipes e atletas da competição.                                                                                                                                                                                  |
| **CR1**              | **Navegação pelo menu fixo:** O menu fixo exibe o item "Equipes" em todas as telas admin. Ao clicar, o sistema navega para /admin/equipes. **Testes:** Estar em qualquer tela admin e clicar em "Equipes"; Confirmar redirecionamento para /admin/equipes; Verificar que o item fica destacado como ativo no menu.                                       |
| **CR2**              | **Acesso pelo card da Home:** O card "Gerenciar equipes" na Home navega para a tela de Gestão de Equipes ao ser clicado. **Testes:** Clicar no card "Gerenciar equipes" na Home; Confirmar navegação para /admin/equipes;                                                                                                                                |
| **CR3**              | **Estado sem equipes:** Quando não há equipes cadastradas, a tela exibe um botão "＋ Adicionar equipe" com instrução visual. **Testes:** Acessar /admin/equipes com zero equipes cadastradas; Confirmar exibição do botão e instrução visual; Confirmar ausência de lista vazia.                                                                          |
| **Critérios INVEST** | **Independente:** navegação não depende de outros fluxos. **Negociável:** atalhos e ícones do menu podem ser ajustados. **Valiosa:** centraliza o gerenciamento de equipes com acesso rápido. **Estimável:** padrão de navegação bem definido. **Pequena:** limitada à navegação e exibição da tela. **Testável:** rotas e estados de tela verificáveis. |

<p align = "center"> Fonte: Material produzido pelos autores (2026).</p>
<br> <br>

<p align = "center"> Quadro 8 - User Story 8</p>

| Identificação        | US08                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Persona**          | Administrador                                                                                                                                                                                                                                                                                                                                                                     |
| **User Story**       | Como Administrador, posso clicar no botão "Acessar competição" no card de uma equipe, para abrir o painel operacional completo da equipe (Tela de Checkpoint) e gerenciar os registros em tempo real.                                                                                                                                                                             |
| **CR1**              | **Abertura do painel operacional:** Ao clicar em "Acessar competição" no card da equipe, o sistema navega para /admin/equipes/operacional com o painel completo da equipe selecionada. **Testes:** Clicar em "Acessar competição" nos dois cards e confirmar que o painel exibe os dados da equipe correta.                                                                       |
| **CR2**              | **Conteúdo do painel:** O painel exibe a área de controle do juiz (seleção de atleta e status), o fluxo de registro de checkpoint (OCR e manual) e a tabela de dados da equipe. **Testes:** Abrir o painel e confirmar presença dos três blocos; Verificar que o dropdown de atletas lista todos os membros da equipe selecionada.                                                |
| **Critérios INVEST** | **Independente:** depende apenas do cadastro prévio da equipe. **Negociável:** layout do painel pode ser reorganizado. **Valiosa:** é a tela operacional principal da competição. **Estimável:** tela com escopo bem delimitado pela especificação. **Pequena:** US limitada ao acesso e carregamento do painel. **Testável:** navegação e presença dos componentes verificáveis. |

<p align = "center"> Fonte: Material produzido pelos autores (2026).</p>
<br> <br>

<p align = "center"> Quadro 9 - User Story 9</p>

| Identificação        | US09                                                                                                                                                                                                                                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Persona**          | Administrador                                                                                                                                                                                                                                                                                                                                                |
| **User Story**       | Como Administrador/Juiz, posso selecionar o atleta ativo na tela de Checkpoint, para controlar com precisão quem está em corrida.                                                                                                                                                                                                                            |
| **CR1**              | **Seleção de atleta via dropdown:** O dropdown exibe todos os atletas da equipe com seu status atual ao lado do nome. **Testes:** Abrir o dropdown e confirmar listagem de todos os atletas; Verificar que o status (Em corrida / Em descanso / Pronto para entrar) aparece ao lado de cada nome.                                                            |
| **CR2**              | **Atualização de status:** Os botões de status são atualizados automaticamente após a seleção do juiz. O botão "Trocar atleta" abre o fluxo de troca: seleciona o próximo atleta, confirma entrada nos sistema automaticamente. **Testes:** Confirmar que o atleta anterior tem status alterado para "Em descanso" e o atual para "Em corrida".              |
| **Critérios INVEST** | **Independente:** funciona independente do fluxo OCR. **Negociável:** número de status possíveis pode ser expandido. **Valiosa:** garante controle preciso da operação durante a prova. **Estimável:** fluxo de seleção e troca bem definido. **Pequena:** limitada ao controle de atleta, sem registro de performance. **Testável:** estados  verificáveis. |

<p align = "center"> Fonte: Material produzido pelos autores (2026).</p>
<br> <br>

<p align = "center"> Quadro 10 - User Story 10</p>

| Identificação        | US10                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Persona**          | Administrador                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **User Story**       | Como Administrador, posso fotografar a tela da esteira durante a corrida, para que o sistema extraia automaticamente os dados de performance via OCR e os registre no checkpoint do atleta.                                                                                                                                                                                                                                                  |
| **CR1**              | **Captura e extração OCR:** O botão "Tirar foto da esteira" abre a câmera integrada do dispositivo. Após captura, o sistema extrai distância (km), pace (min/km) e tempo total. A imagem capturada é exibida em preview ao lado dos dados extraídos. **Testes:** Capturar foto de esteira com dados legíveis e confirmar extração correta dos três campos; Verificar exibição do preview da imagem ao lado dos dados.                        |
| **CR2**              | **Alerta de discrepância:** Se o valor extraído divergir da média histórica do atleta ou da meta da prova, o campo é marcado em vermelho com mensagem de alerta. **Testes:** Simular leitura com valor discrepante e confirmar marcação em vermelho;  Simular valor dentro do esperado e confirmar ausência de alerta.                                                                                                                       |
| **CR3**              | **Validação e confirmação:** O juiz confirma ou corrige manualmente após revisar a foto. O sistema registra se o dado foi "confirmado via OCR" ou "corrigido manualmente" (log de auditoria). **Testes:** Confirmar dado OCR e verificar log com método "OCR";  Corrigir dado e verificar log com método "manual".                                                                                                                           |
| **Critérios INVEST** | **Independente:** fluxo OCR é autossuficiente; o modo manual é US separada. **Negociável:** engine de OCR (Google Vision, AWS Textract) e limiar de discrepância são ajustáveis. **Valiosa:** elimina erros de digitação e agiliza o registro. **Estimável:** fluxo de 5 etapas bem especificado. **Pequena:** limitada à captura, extração e confirmação de um checkpoint. **Testável:** dados extraídos e logs verificáveis objetivamente. |

<p align = "center"> Fonte: Material produzido pelos autores (2026).</p>
<br> <br>

<p align = "center"> Quadro 11 - User Story 11</p>

| Identificação        | US11                                                                                                                                                                                                                                                                                                                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Persona**          | Administrador                                                                                                                                                                                                                                                                                                                                                                                                      |
| **User Story**       | Como Administrador, posso registrar um checkpoint manualmente digitando os dados quando a câmera falhar ou a foto estiver ilegível, para que nenhum registro seja perdido por falha técnica.                                                                                                                                                                                                                       |
| **CR1**              | **Formulário de entrada manual:** O modo manual disponibiliza campos de distância (km), pace (min/km) e tempo total, com botão "Salvar registro manual". **Testes:** Preencher todos os campos e salvar; Confirmar que os dados são salvos corretamente no checkpoint da equipe/atleta.                                                                                                                            |
| **CR2**              | **Identificação do método:** O sistema registra automaticamente que o checkpoint foi inserido em modo manual, distinguindo-o dos registros OCR no log de auditoria. **Testes:**  Salvar registro manual e verificar flag "manual" no log.                                                                                                                                                                          |
| **Critérios INVEST** | **Independente:** é o caminho de contingência, independente do fluxo OCR. **Negociável:** campos disponíveis no modo manual podem ser expandidos. **Valiosa:** garante continuidade operacional em falhas técnicas. **Estimável:** formulário simples com campos definidos. **Pequena:** escopo limitado à entrada e salvamento manual de um checkpoint. **Testável:** dados salvos e flag de método verificáveis. |

<p align = "center"> Fonte: Material produzido pelos autores (2026).</p>
<br> <br>

<p align = "center"> Quadro 12 - User Story 12</p>

| Identificação        | US12                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Persona**          | Administrador                                                                                                                                                                                                                                                                                                                                                                                              |
| **User Story**       | Como Administrador, posso visualizar uma tabela com os dados consolidados da equipe que se atualiza automaticamente a cada 5 minutos, para acompanhar a evolução da performance sem precisar recarregar a página.                                                                                                                                                                                          |
| **CR1**              | **Dados exibidos:** A tabela apresenta: últimos checkpoints registrados (com timestamp e atleta), pace médio atualizado, distância total acumulada da equipe e tempo total ativo. **Testes:** Registrar um checkpoint e confirmar que aparece na tabela; Verificar que todos os quatro campos estão presentes e com valores coerentes.                                                                     |
| **CR2**              | **Auto-refresh a cada 5 minutos:** A tabela é atualizada automaticamente sem ação do usuário, refletindo novos registros. **Testes:** Registrar um checkpoint e aguardar até 5 minutos; Confirmar que o novo registro aparece sem recarregar a página; Verificar indicador visual ou timestamp da última atualização.                                                                                      |
| **CR3**              | **Consistência dos dados:** Os valores de pace médio e distância total são recalculados a cada atualização com base em todos os checkpoints da sessão. **Testes:** Registrar múltiplos checkpoints e verificar que o pace médio é a média ponderada correta; Confirmar que a distância total é a soma dos checkpoints registrados.                                                                         |
| **Critérios INVEST** | **Independente:** depende apenas dos checkpoints já registrados. **Negociável:** intervalo de atualização pode ser configurável. **Valiosa:** oferece visão consolidada em tempo real para o juiz. **Estimável:** lógica de auto-refresh e cálculo de métricas bem definida. **Pequena:** limitada à exibição e atualização da tabela. **Testável:** dados e timing de refresh verificáveis objetivamente. |

<p align = "center"> Fonte: Material produzido pelos autores (2026).</p>
<br> <br>

<p align = "center"> Quadro 13 - User Story 13</p>

| Identificação        | US13                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Persona**          | Corredor                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **User Story**       | Como Corredor, posso acessar a URL única da minha equipe (UUID) sem necessidade de login, para visualizar as informações da equipe em tempo real diretamente pelo link recebido do administrador.                                                                                                                                                                                                                             |
| **CR1**              | **Acesso público sem autenticação:** O painel é acessível a qualquer pessoa com o link, sem exigir cadastro ou login. **Testes:** Acessar o link em modo anônimo/aba privada e confirmar que a tela carrega; Tentar acessar um UUID inválido e confirmar mensagem de erro; Confirmar que não há campos de login ou solicitação de senha.                                                                                      |
| **CR2**              | **Carregamento dos dados da equipe:** A tela exibe os dados correspondentes à equipe vinculada ao UUID acessado. **Testes:**  Acessar links de duas equipes diferentes e confirmar que cada um exibe dados da equipe correta; Confirmar que dados de outras equipes não são expostos.                                                                                                                                         |
| **Critérios INVEST** | **Independente:** depende apenas do UUID gerado pelo admin. **Negociável:** tempo de expiração do link pode ser configurável por versão futura. **Valiosa:** elimina barreiras de acesso para corredores e torcida. **Estimável:** comportamento de rota pública bem definido. **Pequena:** limitada ao acesso e carregamento inicial da tela. **Testável:** acesso sem login e exibição de dados verificáveis objetivamente. |
|                      |                                                                                                                                                                                                                                                                                                                                                                                                                               |
<p align = "center"> Fonte: Material produzido pelos autores (2026).</p>
<br> <br>

<p align = "center"> Quadro 14 - User Story 14</p>

| Identificação        | US14                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Persona**          | Corredor                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **User Story**       | Como Corredor, posso visualizar no painel da equipe o ranking global, o status individual de cada atleta, a calculadora de descanso inteligente e o botão de compartilhamento, para tomar decisões estratégicas durante a competição.                                                                                                                                                                                                                                                                                                                                                                              |
| **CR1**              | **Ranking global:** O painel exibe a posição atual da equipe, a distância para o líder e a diferença para a equipe na posição anterior. O ranking é atualizado a cada 1 hora. **Testes:** Acessar o painel e confirmar exibição dos três campos de posicionamento; Aguardar 1 hora e confirmar atualização automática do ranking; Verificar que o ranking não atualiza antes de 1 hora.                                                                                                                                                                                                                            |
| **CR2**              | **Status por atleta:** O painel exibe para cada atleta: pace médio geral, velocidade máxima, distância acumulada, timestamp do último checkpoint, tempo parado desde o último turno e status atual (Correndo / Descansando / Pronto para entrar). **Testes:** Confirmar que todos os seis campos estão presentes para cada atleta; Registrar um checkpoint via admin e verificar que os dados do atleta atualizam no painel.                                                                                                                                                                                       |
| **CR3**              | **Calculadora de descanso inteligente:** A calculadora exibe o indicador visual (barra verde/amarela/vermelha), o tempo recomendado de descanso em minutos e uma contagem regressiva. O cálculo considera pace da última corrida, duração do último turno e parâmetros do evento. **Testes:** Verificar que o indicador muda de cor conforme o status do atleta; Confirmar exibição do tempo recomendado e da contagem regressiva; Simular atleta com corrida recente e intensa e confirmar barra vermelha com alerta.                                                                                             |
| **CR4**              | **Compartilhamento:** O botão "Compartilhar ranking" gera um link simplificado com apenas o leaderboard (sem dados sensíveis dos atletas), otimizado para WhatsApp e redes sociais, com preview da posição atual. **Testes:**  Clicar em "Compartilhar ranking" e verificar geração do link simplificado; Acessar o link gerado e confirmar ausência de dados sensíveis; Verificar que o preview exibe a posição atual da equipe.                                                                                                                                                                                  |
| **Critérios INVEST** | **Independente:** o painel público é autossuficiente e consome dados gerados pelo fluxo admin. **Negociável:** frequência de atualização do ranking e métricas exibidas por atleta podem evoluir. **Valiosa:** transforma dados brutos em inteligência estratégica para a equipe durante a prova. **Estimável:** quatro blocos de funcionalidade com comportamentos bem definidos. **Pequena:** pode ser decomposta por bloco (ranking, status, calculadora, compartilhamento) se necessário. **Testável:** todos os campos, comportamentos de atualização e lógica da calculadora são verificáveis objetivamente. |

<p align = "center"> Fonte: material produzido pelos autores (2025).</p>
<br> <br>

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

| ID   | Descrição                                                                                                                                                                                                                         | RF associado       |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| RN01 | Ao salvar uma equipe, o sistema deve gerar automaticamente um UUID único e criar um link público acessível sem autenticação.                                                                                                      | RF003, RF001       |
| RN02 | O UUID gerado deve permanecer válido enquanto o evento estiver ativo e expirar automaticamente ao término do evento.                                                                                                              | RF001, RF004       |
| RN03 | O acesso ao painel administrativo deve exigir autenticação via senha definida na criação da sala, válida apenas para aquela sala.                                                                                                 | RF001, RF004       |
| RN04 | O registro de checkpoint deve exigir obrigatoriamente os campos: distância (km), pace (min/km) e tempo total, independentemente do método de entrada.                                                                             | RF008              |
| RN05 | Todo checkpoint registrado deve incluir no log de auditoria o método de entrada utilizado (OCR ou manual).                                                                                                                        | RF005, RF007, RF008|
| RN06 | Valores extraídos via OCR que divergirem da média histórica do atleta ou da meta da prova devem ser destacados e exigir confirmação ou correção manual antes do salvamento.                                                       | RF009, RF007       |
| RN07 | O sistema deve garantir que apenas um atleta por equipe esteja com status "Em corrida" simultaneamente; ao confirmar troca, o atleta anterior deve ser automaticamente definido como "Em descanso".                               | RF003, RF011       |
| RN08 | A calculadora de descanso deve utilizar o pace da última corrida, a duração do último turno e os parâmetros do evento, classificando o resultado em categorias (verde, amarelo ou vermelho).                                      | RF011              |
| RN09 | O ranking exibido no painel da equipe deve ser atualizado a cada 1 hora, enquanto o painel administrativo deve atualizar o leaderboard a cada novo checkpoint registrado.                                                         | RF010, RF015       |
| RN10 | O painel administrativo deve exibir automaticamente o atleta atualmente em corrida e o próximo atleta previsto, sem necessidade de atualização manual.                                                                            | RF011              |
| RN11 | A tabela de dados da equipe no painel administrativo deve ser atualizada automaticamente a cada 5 minutos, recalculando o pace médio e a distância total acumulada.                                                               | RF010, RF015       |
| RN12 | Edições retroativas em checkpoints devem registrar obrigatoriamente no log de auditoria o usuário responsável pela alteração e o motivo informado.                                                                                | RF007, RF008       |
| RN13 | O link de compartilhamento gerado pela equipe deve conter apenas o leaderboard simplificado do geral das equipes. E também mostrando quem são os atletas mas sem expor dados individuais que ofereçam vantagens aos concorrentes. | RF001, RF010       |
| RN14 | O encerramento do evento deve ser permitido apenas ao administrador da sala e deve bloquear novos registros de checkpoint após sua execução.                                                                                      | RF012              |
| RN15 | A exportação em CSV deve incluir todos os checkpoints com timestamps, referências às fotos vinculadas e logs de validação para auditoria.                                                                                         | RF013              |
| RN16 | Os highlights pós-evento devem ser gerados automaticamente ao encerrar a competição, sem necessidade de configuração manual.                                                                                                      | RF012, RF014       |
| RN17 | Os highlights devem incluir recordes nas categorias: individual (pace, velocidade, distância, tempo total), por equipe (consistência, volume, sincronismo de troca) e geral da edição.                                            | RF014              |
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

Os endpoints foram definidos seguindo as boas práticas de design de APIs RESTful descritas pela Microsoft Azure Architecture Center, que recomenda o uso de substantivos no plural para nomear recursos, hierarquia de URIs para expressar relações entre entidades, e verbos HTTP como única forma de expressar a ação sobre o recurso (MICROSOFT, 2023). Dessa forma, cada linha da matriz conecta um requisito funcional às regras de negócio que o governam e ao contrato HTTP que o implementa.

| RF    | RN associadas | Endpoint                                                      | Método |
| ----- | ------------- | ------------------------------------------------------------- | ------ |
| RF001 | RN03          | `/competitions`                                               | POST   |
| RF002 | —             | `/competitions`                                               | POST   |
| RF003 | RN01, RN07    | `/competitions/:id/teams`                                     | POST   |
| RF003 | RN01, RN07    | `/competitions/:id/teams/:teamId`                             | PUT    |
| RF003 | RN01, RN07    | `/competitions/:id/teams/:teamId`                             | DELETE |
| RF003 | RN01          | `/competitions/:id/teams/:teamId/athletes`                    | POST   |
| RF003 | RN01          | `/competitions/:id/teams/:teamId/athletes/:athleteId`         | PUT    |
| RF003 | RN01          | `/competitions/:id/teams/:teamId/athletes/:athleteId`         | DELETE |
| RF004 | RN02, RN03    | `/auth/sessions`                                              | POST   |
| RF005 | RN06          | `/ocr/extractions`                                            | POST   |
| RF006 | RN04, RN05    | `/ocr/extractions`                                            | POST   |
| RF007 | RN06, RN12    | `/ocr/extractions/:extractionId`                              | PATCH  |
| RF008 | RN04, RN05    | `/competitions/:id/checkpoints`                               | POST   |
| RF009 | RN06          | `/competitions/:id/checkpoints/inconsistencies`               | GET    |
| RF010 | RN09, RN11    | `/competitions/:id/ranking`                                   | GET    |
| RF011 | RN07, RN10    | `/competitions/:id/teams/:teamId/runners`                     | GET    |
| RF012 | RN14          | `/competitions/:id`                                           | PATCH  |
| RF013 | RN15          | `/competitions/:id/exports`                                   | GET    |
| RF014 | RN16, RN17    | `/competitions/:id/reports`                                   | GET    |
| RF015 | RN09, RN11    | `/competitions/:id/ranking`                                   | GET    |

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


MICROSOFT. Práticas recomendadas para design de API Web RESTful. In: Azure Architecture Center. [S. l.], 2023. Disponível em: https://learn.microsoft.com/pt-br/azure/architecture/best-practices/api-design. Acesso em: 1 maio 2026.

LUCK, Heloisa. Liderança em gestão escolar. 4. ed. Petrópolis: Vozes, 2010. <br>
SOBRENOME, Nome. Título do livro: subtítulo do livro. Edição. Cidade de publicação: Nome da editora, Ano de publicação. <br>

CASAROTTO, Camila. Como fazer análise SWOT ou FOFA: confira o passo a passo completo com as melhores dicas. [S. l.], 20 dez. 2019. Disponível em: https://rockcontent.com/br/blog/como-fazer-uma-analise-swot/. Acesso em: 23 abr. 2026.

INTERACTION DESIGN FOUNDATION. User Stories: as a UX designer, I want to embrace agile so that I can make my projects user-centered. Disponível em: https://ixdf.org/literature/article/user-stories-as-a-ux-designer-i-want-to-embrace-agile-so-that-i-can-make-my-projects-user-centered. Acesso em: 28 abr. 2026.

NIELSEN NORMAN GROUP. Personas: a study guide. Disponível em: https://www.nngroup.com/articles/persona/. Acesso em: 28 abr. 2026.

OSTERWALDER, Alexander; PIGNEUR, Yves. Business Model Generation: a handbook for visionaries, game changers, and challengers. Hoboken: John Wiley & Sons, 2010.

TYMOSHCHENKO, Karine. User story and acceptance criteria: description and recommendation. Disponível em: https://sdh.global/blog/business/user-story-and-acceptance-criteria-description-and-recommendation/. Acesso em: 28 abr. 2026.

VIAL, Gregory. Understanding digital transformation: a review and a research agenda. The Journal of Strategic Information Systems, v. 28, n. 2, p. 118–144, 2019.

WOLOYEM. User story examples for agile teams: a comprehensive 2026 guide. Disponível em: https://www.woloyem.com/blog/user-story-examples-for-agile-teams. Acesso em: 28 abr. 2026.

# <a name="c9"></a>Anexos

*Inclua aqui quaisquer complementos para seu projeto, como diagramas, imagens, tabelas etc. Organize em sub-tópicos utilizando headings menores (use ## ou ### para isso)*
