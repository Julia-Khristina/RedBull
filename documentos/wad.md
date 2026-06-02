# WAD - Web Application Document - MÃ³dulo 2 - Inteli

**_Os trechos em itÃ¡lico servem apenas como guia para o preenchimento da seÃ§Ã£o. Por esse motivo, nÃ£o devem fazer parte da documentaÃ§Ã£o final_**

## Nome do Grupo

#### Ana Clara TenÃ³rio Pelegrini
#### Beatriz Okubo Vieira Lima
#### Eduardo Hirohito Izawa Maciel
#### Isabella Sandra Santos
#### Julia Khristina de Oliveira Silva Souza
#### Luiza Nicol Giusti Dias Cardoso
#### Mariana Azevedo Silva
#### VinÃ­cius Tavares Castiglia



## SumÃ¡rio

[1. IntroduÃ§Ã£o](#c1)

[2. VisÃ£o Geral da AplicaÃ§Ã£o Web](#c2)

[3. Projeto TÃ©cnico da AplicaÃ§Ã£o Web](#c3)

[4. Desenvolvimento da AplicaÃ§Ã£o Web](#c4)

[5. Testes da AplicaÃ§Ã£o Web](#c5)

[6. Estudo de Mercado e Plano de Marketing](#c6)

[7. ConclusÃµes e trabalhos futuros](#c7)

[8. ReferÃªncias](c#8)

[Anexos](#c9)

<br>


# <a name="c1"></a>1. IntroduÃ§Ã£o (sprints 1 a 5)

A Red Bull, marca global atuante em eventos esportivos e experiÃªncias de marca, Ã© o parceiro deste projeto por meio de seu time de Field Marketing, responsÃ¡vel pela operaÃ§Ã£o do Red Bull 24 Horas, competiÃ§Ã£o anual em que duas equipes de dezesseis corredores se revezam ininterruptamente em esteiras durante vinte e quatro horas, buscando acumular a maior quilometragem total. Atualmente, o registro dos quilÃ´metros percorridos Ã© realizado de forma manual por operadores, que anotam em pranchetas os momentos de inÃ­cio e tÃ©rmino de cada turno, alÃ©m de checkpoints periÃ³dicos. Esse processo Ã© suscetÃ­vel a erros de anotaÃ§Ã£o, distraÃ§Ãµes humanas e inconsistÃªncias, o que compromete a confiabilidade e a rastreabilidade dos resultados finais. Como as esteiras utilizadas no evento nÃ£o permitem integraÃ§Ã£o direta com dispositivos externos e alternativas como dispositivos vestÃ­veis sincronizados se mostraram inviÃ¡veis diante da dinÃ¢mica de trocas rÃ¡pidas entre corredores, a apuraÃ§Ã£o depende exclusivamente de registros humanos, sem mecanismos estruturados de auditabilidade dos dados.

Diante desse cenÃ¡rio, o projeto propÃµe o desenvolvimento de uma plataforma web de gestÃ£o de performance com atualizaÃ§Ã£o periÃ³dica dos dados ao longo da competiÃ§Ã£o, projetada para uso em iPads posicionados ao lado das esteiras pelos operadores do evento. A soluÃ§Ã£o substitui o registro manual por uma abordagem de automaÃ§Ã£o assistida, na qual o operador captura imagens do visor da esteira por meio de fotografia, e o sistema realiza a extraÃ§Ã£o automÃ¡tica dos dados por meio de reconhecimento Ã³ptico de caracteres (OCR). Considerando as limitaÃ§Ãµes de padronizaÃ§Ã£o visual das esteiras e as variÃ¡veis do ambiente operacional do evento, a viabilidade da soluÃ§Ã£o ainda depende de validaÃ§Ãµes prÃ¡ticas relacionadas Ã  precisÃ£o e consistÃªncia da leitura automatizada. Os dados extraÃ­dos sÃ£o submetidos Ã  validaÃ§Ã£o humana, com emissÃ£o de alertas em caso de inconsistÃªncias, garantindo maior confiabilidade e controle sobre o processo de apuraÃ§Ã£o.

A plataforma Ã© dividida em duas interfaces principais: uma Ã¡rea privada de operaÃ§Ã£o, onde os administradores registram checkpoints, corrigem dados extraÃ­dos via OCR, acompanham informaÃ§Ãµes detalhadas de cada equipe e gerenciam a dinÃ¢mica da competiÃ§Ã£o; e uma Ã¡rea pÃºblica por equipe, acessada sem login por meio de uma URL com UUID Ãºnico entregue ao capitÃ£o de cada equipe, responsÃ¡vel pela exibiÃ§Ã£o do ranking, status individual dos atletas e calculadora de descanso durante a competiÃ§Ã£o.

A criaÃ§Ã£o de valor do sistema se concentra em quatro eixos principais: reduÃ§Ã£o de erros no processo de apuraÃ§Ã£o, aumento da confiabilidade e auditabilidade dos dados, ganho de eficiÃªncia operacional para a equipe organizadora da Red Bull e disponibilizaÃ§Ã£o de informaÃ§Ãµes atualizadas a cada checkpoint operacional da competiÃ§Ã£o.

# <a name="c2"></a>2. VisÃ£o Geral da AplicaÃ§Ã£o Web (sprint 1)

## 2.1. Escopo do Projeto (sprints 1 e 4)

### 2.1.1. Modelo de 5 ForÃ§as de Porter (sprint 1)

O modelo das Cinco ForÃ§as de Porter constitui um framework de anÃ¡lise estratÃ©gica utilizado para avaliar a atratividade e a intensidade competitiva de uma indÃºstria. O posicionamento estratÃ©gico de uma organizaÃ§Ã£o nÃ£o depende exclusivamente da concorrÃªncia direta, mas da interaÃ§Ã£o entre cinco forÃ§as estruturais: a rivalidade entre concorrentes existentes, a ameaÃ§a de novos entrantes, a ameaÃ§a de produtos ou serviÃ§os substitutos, o poder de barganha dos fornecedores e o poder de barganha dos clientes. A aplicaÃ§Ã£o desse modelo permite identificar oportunidades, vulnerabilidades competitivas e fatores crÃ­ticos para a sustentabilidade de uma soluÃ§Ã£o (Porter, 2008).

No contexto deste projeto, a anÃ¡lise foi aplicada Ã  operaÃ§Ã£o do Red Bull 24 Horas, considerando o desenvolvimento de uma aplicaÃ§Ã£o web para digitalizaÃ§Ã£o do processo de registro de quilometragem durante o evento. A soluÃ§Ã£o proposta busca substituir um processo manual suscetÃ­vel a erros, transformando a coleta operacional em um fluxo digital mais confiÃ¡vel, Ã¡gil e escalÃ¡vel.

<div align="center">
  <sub>Figura 1 - AnÃ¡lise das cinco forÃ§as de Porter</sub><br>
  <img src="../assets/negocios/forcaporter.jpg" width="100%" alt="RepresentaÃ§Ã£o da anÃ¡lise das cinco forÃ§as competitivas de Porter aplicada ao contexto operacional do projeto Red Bull 24 Horas"><br>
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

#### 1. Rivalidade entre concorrentes existentes (ALTA)

A rivalidade competitiva neste contexto Ã© considerada alta, pois existem diversas soluÃ§Ãµes que podem atender parcialmente Ã  necessidade de registro operacional do evento, incluindo ferramentas genÃ©ricas de coleta de dados, como Google Forms, Microsoft Excel, aplicativos mÃ³veis de coleta de informaÃ§Ãµes e plataformas genÃ©ricas de gestÃ£o operacional. Embora essas alternativas sejam amplamente acessÃ­veis e de fÃ¡cil implementaÃ§Ã£o, elas nÃ£o foram desenvolvidas para atender Ã s particularidades do Red Bull 24 Horas, como uso contÃ­nuo por 24 horas, trocas frequentes de operadores e necessidade de registro rÃ¡pido sob pressÃ£o operacional.

O diferencial competitivo da soluÃ§Ã£o proposta reside na sua especializaÃ§Ã£o funcional, sendo projetada especificamente para o fluxo real do evento, priorizando velocidade de uso, padronizaÃ§Ã£o dos registros e reduÃ§Ã£o de retrabalho. Para a Red Bull, essa especializaÃ§Ã£o representa um ganho estratÃ©gico ao transformar um processo operacional crÃ­tico em uma atividade mais confiÃ¡vel e eficiente.

#### 2. AmeaÃ§a de novos entrantes (MÃDIA)

A entrada de novos desenvolvedores de soluÃ§Ãµes digitais neste mercado Ã© relativamente acessÃ­vel do ponto de vista tÃ©cnico, uma vez que as ferramentas de desenvolvimento web sÃ£o amplamente disponÃ­veis. No entanto, a principal barreira competitiva nÃ£o estÃ¡ na tecnologia em si, mas na capacidade de adaptaÃ§Ã£o ao contexto operacional especÃ­fico do evento.

O Red Bull 24 Horas apresenta caracterÃ­sticas prÃ³prias, tal qual operaÃ§Ãµes contÃ­nuas por 24 horas, rotatividade de usuÃ¡rios, pressÃ£o por rapidez e necessidade de confiabilidade no registro dos dados, nesse cenÃ¡rio, Ã© possÃ­vel verificar que esses fatores dificultam a criaÃ§Ã£o de soluÃ§Ãµes verdadeiramente aderentes sem conhecimento aprofundado da dinÃ¢mica operacional. Dessa forma, embora novos entrantes possam desenvolver sistemas similares, a replicaÃ§Ã£o de uma soluÃ§Ã£o efetivamente integrada Ã  realidade do evento representa uma barreira prÃ¡tica relevante.

#### 3. AmeaÃ§a de produtos ou serviÃ§os substitutos (MUITO ALTA)

A ameaÃ§a de substitutos Ã© considerada alta, pois o principal substituto da soluÃ§Ã£o proposta Ã© o prÃ³prio mÃ©todo atualmente utilizado pela operaÃ§Ã£o, baseado em registros manuais realizados em pranchetas pelos operadores do evento. Apesar de apresentar limitaÃ§Ãµes relacionadas a erros de preenchimento, retrabalho e ausÃªncia de auditabilidade estruturada, esse processo possui vantagens operacionais relevantes, como baixo custo de implementaÃ§Ã£o, independÃªncia tecnolÃ³gica e elevada familiaridade por parte da equipe responsÃ¡vel pela apuraÃ§Ã£o.

Diferentemente de soluÃ§Ãµes digitais concorrentes, que disputam espaÃ§o tecnolÃ³gico no mercado, o registro manual representa um substituto diretamente integrado Ã  cultura operacional do evento, jÃ¡ consolidado na dinÃ¢mica da competiÃ§Ã£o. Nesse contexto, a principal ameaÃ§a nÃ£o Ã© necessariamente tecnolÃ³gica, mas comportamental, uma vez que a adoÃ§Ã£o da nova soluÃ§Ã£o depende da percepÃ§Ã£o clara de ganhos em rapidez, simplicidade, confiabilidade e reduÃ§Ã£o de esforÃ§o operacional.

#### 4. Poder de barganha dos fornecedores (BAIXO)

O poder de barganha dos fornecedores Ã© considerado baixo, uma vez que os recursos necessÃ¡rios para o desenvolvimento da soluÃ§Ã£o sÃ£o predominantemente tecnolÃ³gicos, incluindo serviÃ§os de hospedagem, infraestrutura web, frameworks de desenvolvimento e bibliotecas de software amplamente disponÃ­veis no mercado.
Esses recursos apresentam alta disponibilidade, baixa diferenciaÃ§Ã£o e facilidade de substituiÃ§Ã£o, reduzindo significativamente a dependÃªncia de fornecedores especÃ­ficos. AlÃ©m disso, a soluÃ§Ã£o nÃ£o depende de integraÃ§Ãµes complexas com hardware proprietÃ¡rio ou tecnologias exclusivas, o que amplia a flexibilidade tÃ©cnica e financeira do projeto.


#### 5. Poder de barganha dos clientes (MUITO ALTO)

A principal Ã¡rea demandante da soluÃ§Ã£o corresponde ao time operacional de Field Marketing da Red Bull, responsÃ¡vel pelo registro dos dados durante o evento. Esse grupo exerce elevado poder de barganha, pois a adoÃ§Ã£o da ferramenta depende diretamente da sua aceitaÃ§Ã£o em um ambiente caracterizado por alta pressÃ£o operacional, rapidez na tomada de decisÃ£o e necessidade de execuÃ§Ã£o contÃ­nua. O custo de substituiÃ§Ã£o Ã© praticamente inexistente, uma vez que o mÃ©todo manual atualmente utilizado pode ser retomado a qualquer momento sem impactos financeiros ou contratuais. AlÃ©m disso, qualquer aumento de complexidade, lentidÃ£o ou dificuldade de uso pode comprometer diretamente a aceitaÃ§Ã£o da soluÃ§Ã£o. Dessa forma, a Ã¡rea demandante exerce nÃ£o apenas poder de escolha, mas tambÃ©m poder de veto, exigindo que a ferramenta seja comprovadamente mais simples, rÃ¡pida e confiÃ¡vel do que o processo atual para garantir sua adoÃ§Ã£o efetiva.

#### ConclusÃ£o da anÃ¡lise

A aplicaÃ§Ã£o do modelo das Cinco ForÃ§as de Porter evidencia que a soluÃ§Ã£o proposta para o Red Bull 24 Horas estÃ¡ inserida em um contexto de elevada pressÃ£o competitiva, especialmente em relaÃ§Ã£o Ã  rivalidade entre soluÃ§Ãµes alternativas, Ã  resistÃªncia comportamental associada aos mÃ©todos jÃ¡ consolidados e ao elevado poder de decisÃ£o da Ã¡rea demandante. Em contrapartida, a baixa dependÃªncia de fornecedores e a especializaÃ§Ã£o operacional da ferramenta criam condiÃ§Ãµes favorÃ¡veis para a construÃ§Ã£o de vantagem competitiva sustentÃ¡vel. Dessa forma, o sucesso da soluÃ§Ã£o nÃ£o depende exclusivamente de sua viabilidade tÃ©cnica, mas principalmente de sua capacidade de entregar ganhos reais de usabilidade, confiabilidade e eficiÃªncia operacional no contexto especÃ­fico da Red Bull.

### 2.1.2. AnÃ¡lise SWOT da InstituiÃ§Ã£o Parceira (sprint 1)

A anÃ¡lise SWOT (ou FOFA) Ã© uma ferramenta de planejamento estratÃ©gico que permite avaliar fatores internos (forÃ§as e fraquezas) e externos (oportunidades e ameaÃ§as) que impactam o desempenho de uma organizaÃ§Ã£o (Casarotto, 2019). Com base nisso, foi realizada a anÃ¡lise do evento Red Bull 24 Horas, conforme apresentado na Figura 2, considerando seu posicionamento no mercado e relaÃ§Ã£o com concorrentes.

<div align="center">
  <sub>Figura 2 - AnÃ¡lise SWOT </sub><br>
  <img src="../assets/negocios/analiseSWOT.png" width="100%" alt="RepresentaÃ§Ã£o da matriz SWOT com forÃ§as, fraquezas, oportunidades e ameaÃ§as identificadas no contexto operacional do projeto Red Bull 24 Horas"><br>
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

#### ForÃ§as

  No contexto do evento Red Bull 24 Horas, destacam-se como principais forÃ§as a existÃªncia de uma dinÃ¢mica operacional jÃ¡ consolidada, com regras bem definidas de revezamento, checkpoints periÃ³dicos e acompanhamento contÃ­nuo das equipes ao longo das 24 horas. AlÃ©m disso, o evento possui alta capacidade de engajamento entre corredores e running crews, favorecendo a participaÃ§Ã£o ativa do pÃºblico e a valorizaÃ§Ã£o de dados de desempenho durante a competiÃ§Ã£o. A estrutura operacional jÃ¡ estabelecida tambÃ©m favorece a implementaÃ§Ã£o de soluÃ§Ãµes digitais voltadas Ã  padronizaÃ§Ã£o e rastreabilidade do processo de apuraÃ§Ã£o.

#### Fraquezas

   Entre as fraquezas, observa-se a ausÃªncia de integraÃ§Ã£o com as esteiras, o que limita a automaÃ§Ã£o da coleta de dados e mantÃ©m a dependÃªncia de processos manuais. Adicionalmente, a baixa consolidaÃ§Ã£o de dados em tempo real compromete a visibilidade geral da competiÃ§Ã£o e pode impactar a confiabilidade das informaÃ§Ãµes durante o evento, reduzindo a qualidade da experiÃªncia em comparaÃ§Ã£o a soluÃ§Ãµes mais automatizadas adotadas por concorrentes.

#### Oportunidades
No ambiente externo, identificam-se oportunidades relacionadas ao uso estratÃ©gico de dados para geraÃ§Ã£o de valor em marketing, mÃ­dia e engajamento do pÃºblico, por meio de dashboards e indicadores relevantes. HÃ¡ potencial de escalabilidade da soluÃ§Ã£o para outros eventos da Red Bull, fortalecendo sua vantagem competitiva. AlÃ©m disso, a crescente tendÃªncia de eventos esportivos orientados a dados e o crescimento das running crews no Brasil ampliam o pÃºblico-alvo e favorecem a adoÃ§Ã£o da soluÃ§Ã£o proposta.

#### AmeaÃ§as

Entre as ameaÃ§as, destacam-se possÃ­veis falhas operacionais ao longo das 24 horas do evento, que podem comprometer o registro correto dos checkpoints e a consolidaÃ§Ã£o da quilometragem total das equipes. Instabilidades tÃ©cnicas, falhas de conexÃ£o ou indisponibilidade momentÃ¢nea do sistema podem gerar atrasos na sincronizaÃ§Ã£o dos dados e impactar diretamente a confiabilidade da apuraÃ§Ã£o durante perÃ­odos crÃ­ticos da competiÃ§Ã£o. AlÃ©m disso, a existÃªncia de processos alternativos jÃ¡ consolidados internamente pode reduzir a adesÃ£o Ã  soluÃ§Ã£o proposta, especialmente caso os operadores nÃ£o percebam ganhos claros de agilidade, simplicidade e confiabilidade em relaÃ§Ã£o ao mÃ©todo atual.

### 2.1.3. SoluÃ§Ã£o (sprints 1 a 5)

#### a) Problema a ser resolvido

Atualmente, o processo de registro de dados dos corredores durante a competiÃ§Ã£o Ã© predominantemente manual, exigindo que operadores realizem anotaÃ§Ãµes periÃ³dicas ao longo de 24 horas ininterruptas. Esse modelo gera sobrecarga operacional significativa, alÃ©m de alta suscetibilidade a erros humanos decorrentes de fadiga, falhas de interpretaÃ§Ã£o e inconsistÃªncias de caligrafia. Como consequÃªncia, a confiabilidade dos dados Ã© comprometida, impactando diretamente a precisÃ£o da apuraÃ§Ã£o, a transparÃªncia do evento e a qualidade das anÃ¡lises estratÃ©gicas realizadas pela organizaÃ§Ã£o.

#### b) Dados disponÃ­veis 

Como base inicial, foi utilizado o site oficial do evento Red Bull 24 Hours, fornecido durante o onboarding, contendo informaÃ§Ãµes institucionais, dinÃ¢mica da competiÃ§Ã£o e contexto geral. Complementarmente, foram realizadas interaÃ§Ãµes com o parceiro, nas quais foram identificados os principais fluxos operacionais, limitaÃ§Ãµes do processo atual e requisitos implÃ­citos, especialmente relacionados Ã  necessidade de automatizaÃ§Ã£o do registro de checkpoints e Ã  melhoria da confiabilidade dos dados coletados (Red Bull, 2025).

#### c) SoluÃ§Ã£o proposta

PropÃµe-se o desenvolvimento de uma aplicaÃ§Ã£o web integrada, com foco na automatizaÃ§Ã£o da coleta e processamento de dados por meio de tecnologia de Reconhecimento Ãptico de Caracteres (OCR). A soluÃ§Ã£o permitirÃ¡ que operadores capturem imagens dos displays das esteiras, realizando a extraÃ§Ã£o automÃ¡tica das informaÃ§Ãµes relevantes. AlÃ©m disso, a plataforma contemplarÃ¡ mÃ³dulos de cadastro de equipes e atletas, atualizaÃ§Ã£o periÃ³dica dos dados, visualizaÃ§Ã£o de rankings globais e geraÃ§Ã£o de relatÃ³rios analÃ­ticos com indicadores de desempenho, garantindo escalabilidade, padronizaÃ§Ã£o e maior robustez no processo.

#### d) Forma de utilizaÃ§Ã£o da soluÃ§Ã£o

A soluÃ§Ã£o serÃ¡ estruturada em dois ambientes principais: um administrativo e outro pÃºblico. No ambiente administrativo, acessado por meio de identificadores UUID Ãºnicos previamente disponibilizados aos operadores, serÃ¡ possÃ­vel cadastrar competiÃ§Ãµes, gerenciar equipes e registrar checkpoints por OCR ou entrada manual. No ambiente pÃºblico, usuÃ¡rios terÃ£o acesso a um painel com ranking atualizado periodicamente, desempenho das equipes e mÃ©tricas relevantes. Ao final da competiÃ§Ã£o, administradores poderÃ£o exportar relatÃ³rios detalhados para anÃ¡lise estratÃ©gica e tomada de decisÃ£o.

#### e) BenefÃ­cios esperados

A implementaÃ§Ã£o da soluÃ§Ã£o proporcionarÃ¡ significativa reduÃ§Ã£o de erros operacionais, aumento da eficiÃªncia no processo de coleta de dados e maior confiabilidade das informaÃ§Ãµes registradas. A disponibilizaÃ§Ã£o de mÃ©tricas periÃ³dicamente permitirÃ¡ melhor acompanhamento do desempenho das equipes durante o evento. AlÃ©m disso, os relatÃ³rios analÃ­ticos contribuirÃ£o para decisÃµes mais assertivas, melhoria contÃ­nua das ediÃ§Ãµes futuras e fortalecimento da experiÃªncia dos participantes e da gestÃ£o do evento.

#### f) CritÃ©rio de sucesso e como serÃ¡ avaliado

O sucesso da soluÃ§Ã£o serÃ¡ mensurado por meio de indicadores objetivos, como a reduÃ§Ã£o da taxa de erro nos registros (meta inferior a 1%), aumento da consistÃªncia e integridade dos dados e diminuiÃ§Ã£o do tempo de processamento das informaÃ§Ãµes. A avaliaÃ§Ã£o serÃ¡ realizada em conjunto com o parceiro, considerando o impacto operacional durante a execuÃ§Ã£o do evento, a aderÃªncia aos requisitos levantados e a qualidade das anÃ¡lises geradas para suporte Ã  tomada de decisÃ£o.

### 2.1.4. Value Proposition Canvas (sprint 1): 

O Canvas da Proposta de Valor permite analisar o alinhamento entre as necessidades do cliente e a soluÃ§Ã£o proposta (Osterwalder; Pigneur, 2011). No contexto deste projeto, evidencia-se o encaixe entre as dificuldades enfrentadas por avaliadores e organizadores no processo de coleta, registro e apuraÃ§Ã£o de dados em competiÃ§Ãµes e a soluÃ§Ã£o proposta, baseada na automatizaÃ§Ã£o por meio de reconhecimento Ã³ptico de caracteres (OCR) e disponibilizaÃ§Ã£o de informaÃ§Ãµes em tempo real. Essa abordagem estÃ¡ alinhada ao uso de tecnologias digitais para aumento de eficiÃªncia operacional e reduÃ§Ã£o de erros em processos manuais, amplamente discutido na literatura de transformaÃ§Ã£o digital (Vial, 2019).

A seguir, a Figura 3 ilustra o Canva de Proposta de Valor desenvolvido para o projeto em anÃ¡lise.

<div align="center">
  <sub>Figura 3 - Value Proposition Canvas da SoluÃ§Ã£o </sub><br>
  <img src="../assets/negocios/canvas.png" width="100%" alt="RepresentaÃ§Ã£o da proposta de valor, com foco na automaÃ§Ã£o do registro de dados e melhoria da eficiÃªncia operacional"><br>
  <sup>Fonte: Elaborado pelo prÃ³prio grupo (2026).</sup>
</div>

#### A. Perfil do Cliente

Na primeira parte do Canvas da Proposta de Valor Ã© analisado o cenÃ¡rio e o perfil em que o cliente jÃ¡ se encontra. Aqui, Ã© possÃ­vel explorar quais sÃ£o as dores do cliente, suas tarefas no contexto atual e o que eles buscam ganhar.

**Tarefas do Cliente**

- Monitorar o desempenho das equipes durante a competiÃ§Ã£o
- Registrar e validar os dados coletados nos checkpoints
- Garantir a consistÃªncia e confiabilidade das informaÃ§Ãµes registradas
- Consolidar os dados operacionais da competiÃ§Ã£o
- Acompanhar o tempo e a quilometragem total de cada equipe
- Realizar a apuraÃ§Ã£o final dos resultados de forma eficiente

**Dores do Cliente**
- Processo repetitivo e cansativo
- Risco de erros humanos durante a coleta e digitaÃ§Ã£o dos dados
- Dificuldade na revisÃ£o, validaÃ§Ã£o e apuraÃ§Ã£o das informaÃ§Ãµes
- Incerteza quanto Ã  precisÃ£o e consistÃªncia dos dados coletados
- Falta de visÃ£o consolidada e organizada do evento

**Ganhos**
- Menos demanda para os avaliadores
- AutomatizaÃ§Ã£o do processo de registro e processamento de dados
- ReduÃ§Ã£o de erros operacionais
- Maior confiablidade e precisÃ£o das informaÃ§Ãµes
- Maior eficiÃªncia operacional durante o evento
- VisÃ£o consolidada e organizada do andamento da competiÃ§Ã£o.

#### B. Mapa de Valor

Os elementos do mapa de valor foram estruturados para responder diretamente Ã s dores identificadas e potencializar os ganhos esperados pelos usuÃ¡rios.

**Produtos e ServiÃ§os**

A soluÃ§Ã£o proposta oferece os seguintes elementos:

* Plataforma digital de gestÃ£o de performance com atualizaÃ§Ã£o periÃ³dica dos dados
* Sistema de captura de imagens e extraÃ§Ã£o automÃ¡tica de dados por OCR
* Dashboard para visualizaÃ§Ã£o de mÃ©tricas e desempenho por equipe
* Sistema de validaÃ§Ã£o hÃ­brida dos dados (automÃ¡tica e manual)

**Aliviadores de Dores**

A soluÃ§Ã£o atua diretamente na reduÃ§Ã£o das dificuldades enfrentadas pelos usuÃ¡rios:

* EliminaÃ§Ã£o do registro manual em papel e da digitaÃ§Ã£o em planilhas
* ReduÃ§Ã£o de erros humanos na coleta, registro e processamento dos dados
* SimplificaÃ§Ã£o do processo de revisÃ£o, validaÃ§Ã£o e apuraÃ§Ã£o das informaÃ§Ãµes
* CentralizaÃ§Ã£o das informaÃ§Ãµes em uma Ãºnica plataforma
* Aumento da confiabilidade dos dados por meio de validaÃ§Ã£o hÃ­brida

**Criadores de Ganho**

AlÃ©m de resolver problemas, a soluÃ§Ã£o potencializa ganhos relevantes:

* GeraÃ§Ã£o de informaÃ§Ãµes atualizadas periodicamente para acompanhamento da competiÃ§Ã£o
* GeraÃ§Ã£o de uma visÃ£o consolidada e organizada dos dados do evento
* Aumento da produtividade da equipe organizadora
* Apoio Ã  gestÃ£o operacional por meio de dados confiÃ¡veis e consolidados
* Melhoria da experiÃªncia operacional dos avaliadores durante o evento

A partir da anÃ¡lise do Value Proposition Canvas, observa-se que a soluÃ§Ã£o proposta estÃ¡ diretamente alinhada Ã s necessidades dos avaliadores e organizadores, ao automatizar o processo de coleta e registro de dados por meio de OCR, reduzindo erros humanos e esforÃ§o operacional. AlÃ©m disso, a centralizaÃ§Ã£o e disponibilizaÃ§Ã£o periÃ³dica das informaÃ§Ãµes caracterizam uma automaÃ§Ã£o do fluxo de dados, proporcionando maior confiabilidade, eficiÃªncia e suporte Ã  tomada de decisÃ£o, garantindo uma gestÃ£o mais precisa e organizada da competiÃ§Ã£o.

### 2.1.5. Matriz de Riscos do Projeto (sprint 1)

A Matriz de Riscos Ã© uma ferramenta de gestÃ£o utilizada para identificar, analisar e priorizar eventos que possam impactar negativamente o desenvolvimento e a execuÃ§Ã£o de um projeto. Por meio da avaliaÃ§Ã£o da probabilidade de ocorrÃªncia e do nÃ­vel de impacto de cada risco, torna-se possÃ­vel classificÃ¡-los conforme sua criticidade e definir estratÃ©gias preventivas, corretivas ou de contingÃªncia, reduzindo incertezas e aumentando as chances de sucesso do projeto (PMI, 2021).

No contexto deste projeto, a Matriz de Riscos Ã© aplicada para antecipar possÃ­veis desafios relacionados Ã  implementaÃ§Ã£o da soluÃ§Ã£o de captura e processamento periÃ³dico de dados durante eventos esportivos da Red Bull GmbH. Considerando fatores tÃ©cnicos, operacionais e humanos, a anÃ¡lise dos riscos permite estabelecer planos de resposta capazes de minimizar falhas na coleta, processamento e disponibilizaÃ§Ã£o das informaÃ§Ãµes, garantindo maior confiabilidade, desempenho e continuidade operacional da soluÃ§Ã£o proposta.

<div align="center">
  <sub>Figura 4 - Matriz de Risco </sub><br>
  <img src="../assets/negocios/matriz de risco.png" width="100%" alt="AnÃ¡lise de negÃ³cios dos riscos por um modelo de Matriz"><br>
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

#### 2.1.5.1 - Matriz de AmeaÃ§as

Para identificar e priorizar os principais riscos do projeto, foi elaborada a matriz de risco apresentada no Quadro 1 a seguir.

<p align = "center"> Quadro 1 - Matriz de Risco </p>

| Risco                              | DescriÃ§Ã£o                                                                 | Probabilidade       | Impacto     | ClassificaÃ§Ã£o | Plano de Resposta                                                                 |
|-----------------------------------|---------------------------------------------------------------------------|--------------------|-------------|--------------|-----------------------------------------------------------------------------------|
| Falha no Reconhecimento de Imagem  | O sistema pode nÃ£o identificar corretamente os dados capturados nas imagens da esteira. | 70% (Alta)         | Muito Alto        | CrÃ­tico      | Treinar o modelo com imagens reais do ambiente de operaÃ§Ã£o, realizar testes iterativos e disponibilizar validaÃ§Ã£o manual para casos de inconsistÃªncia.          |
| Baixa Qualidade das Imagens       | IluminaÃ§Ã£o inadequada, movimento ou posicionamento incorreto podem comprometer a captura dos dados.  | 60% (MÃ©dia)  | Muito Alto        | CrÃ­tico      | Padronizar os pontos de captura, definir posicionamento fixo dos dispositivos e realizar testes em diferentes condiÃ§Ãµes de iluminaÃ§Ã£o.      |
| Falha de ConexÃ£o com a Internet   | Instabilidade de rede pode interromper o envio ou sincronizaÃ§Ã£o dos dados.     | 60% (MÃ©dia)        | Alto        | CrÃ­tico      | Utilizar rede dedicada para operaÃ§Ã£o, implementar armazenamento temporÃ¡rio local e sincronizaÃ§Ã£o automÃ¡tica quando a conexÃ£o for restabelecida.                   |
| Sobrecarga do Sistema             | Alto volume de acessos ou processamento simultÃ¢neo pode reduzir o desempenho da aplicaÃ§Ã£o.  | 50% (MÃ©dia)        | Alto        | Alto         | Realizar testes de carga, otimizar consultas e monitorar mÃ©tricas de desempenho antes e durante o evento.                       |
| Erro Humano                       | Operadores podem registrar dados incorretamente ou utilizar funcionalidades inadequadamente.           | 40% (MÃ©dia)         | MÃ©dio  | Alto         | Desenvolver interface intuitiva, criar instruÃ§Ãµes operacionais e realizar treinamento prÃ©vio da equipe.                       |
| Falta de PadronizaÃ§Ã£o operacional            | DiferenÃ§as nos procedimentos de coleta podem gerar inconsistÃªncias nos dados.   | 30% (Baixa)       | MÃ©dio       | MÃ©dio        | Definir protocolos de operaÃ§Ã£o, validaÃ§Ãµes automÃ¡ticas e checklist de execuÃ§Ã£o.             |
| Bugs ou falhas de software                            | Erros de implementaÃ§Ã£o podem comprometer funcionalidades especÃ­ficas do sistema.        | 20% (Baixa)          | Baixo       | Baixo        | Executar testes funcionais, testes de integraÃ§Ã£o e monitoramento contÃ­nuo com correÃ§Ãµes rÃ¡pidas.                   |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

#### 2.1.5.2 - Matriz de Oportunidades

 De forma complementar, o Quadro 2 a seguir apresenta a matriz de oportunidades identificadas para o projeto.

<div align="center">
  <sub>Quadro 2 - Matriz de oportunidades do projeto</sub>
</div>

| Oportunidade | DescriÃ§Ã£o | Probabilidade | Impacto | ClassificaÃ§Ã£o | Plano de Resposta |
|--------------|----------|--------------|--------|--------------|-------------------|
| Maior precisÃ£o nos dados coletados | A substituiÃ§Ã£o do input manual por OCR reduz erros de digitaÃ§Ã£o identificados no risco de erro humano. | 90% (Alta) | Alto | Alta Prioridade | Garantir uma alternativa de entrada manual com validaÃ§Ã£o para evitar inconsistÃªncias em casos de falhas do OCR. |
| Melhor acompanhamento operacional do evento | Dados atualizados periodicamente permitem maior visibilidade do andamento da competiÃ§Ã£o, facilitando o monitoramento das equipes e a organizaÃ§Ã£o operacional do evento. | 60% (MÃ©dia) | Alto | Alta Prioridade | Desenvolver interfaces claras e dashboards de rÃ¡pida interpretaÃ§Ã£o. |
| Aumento da eficiÃªncia operacional | A automaÃ§Ã£o reduz atividades manuais e retrabalho da equipe operacional durante o evento. | 90% (Alta) | Muito Alto | Alta Prioridade | Automatizar fluxos operacionais e minimizar entradas manuais. |
| PossÃ­vel reutilizaÃ§Ã£o do sistema | Projeto pode ser reutilizado em outros eventos esportivos da Red Bull. | 10% (Baixa) | MÃ©dio | Baixa Prioridade | Estruturar sistema modular e escalÃ¡vel. |
| Menor perda de dados durante o evento | O uso de checkpoints digitais periÃ³dicamente permite maior precisÃ£o histÃ³rica e reduz perdas de dados. | 50% (MÃ©dia) | Alto | Alta Prioridade | Otimizar o processamento das capturas sem comprometer a estabilidade do sistema. |
| GeraÃ§Ã£o de insights de dados | O armazenamento estruturado permite anÃ¡lises de desempenho, ritmo e comportamento para relatÃ³rios pÃ³s-evento. | 70% (Alta) | Muito Alto | MÃ©dia Prioridade | Garantir exportaÃ§Ã£o facilitada de dados (ex: CSV) para auditoria e materiais de marketing. |
<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

## 2.2. Personas (sprint 1)

Personas sÃ£o personagens fictÃ­cios criados com base em dados plausÃ­veis que representam um tipo de usuÃ¡rio compatÃ­vel com o projeto. Elas incluem informaÃ§Ãµes como objetivos, necessidades, frustraÃ§Ãµes e interesses, auxiliando na compreensÃ£o do problema e no desenvolvimento da soluÃ§Ã£o.



<div align="center">
  <sub>Figura 5 - Persona 1: Marina Costa, Coordenadora Operacional</sub><br>
  <img src="../assets/design/persona1.png" width="100%" alt="Persona representando a cordenadora operacional responsÃ¡vel pela apuraÃ§Ã£o de dados da esteira no evento RedBull 24 horas"><br>
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

#### InformaÃ§Ãµes
<ul>
    <li>Idade: 29 anos;</li>
    <li>LocalizaÃ§Ã£o: Rio de Janeiro - RJ</li>
    <li>Cargo: Coordenadora operacional do evento RedBull 24 horas</li>
    <li>GÃªnero: Feminino</li>
</ul>

#### Biografia
Marina Costa tem 29 anos e atua como Coordenadora Operacional em eventos esportivos e ativaÃ§Ãµes de marca, sendo responsÃ¡vel pela organizaÃ§Ã£o e execuÃ§Ã£o de dinÃ¢micas em campo. No contexto do Red Bull 24 Horas, acompanha a operaÃ§Ã£o das equipes, monitorando as esteiras e registrando manualmente informaÃ§Ãµes essenciais como entrada e saÃ­da dos atletas, quilometragem, pace e os checkpoints gerais da prova de 5 em 5 minutos. 

#### Objetivos
<ul>
    <li>Ser reconhecida como uma coordenadora operacional altamente capacitada</li>
    <li>Garantir registros rÃ¡pidos </li>
    <li>Ter visÃ£o consolidada do evento em tempo real</li>
</ul>

#### Necessidades
<ul>
    <li>Uma interface simples e rÃ¡pida para registrar trocas e checkpoints</li>
    <li>VisualizaÃ§Ã£o clara dos dados dos atletas</li>
    <li>Possibilidade de editar registros em caso de inconsistÃªncias</li>
</ul>

#### FrustraÃ§Ãµes
<ul>
    <li>PressÃ£o operacional nas trocas rÃ¡pidas entre atletas </li>
    <li>Dificuldade de consolidar dados em tempo real </li>
    <li>DependÃªncia de processos manuais </li>
    <li>Risco de erros ou perda de registros manuais</li>
</ul>

#### Interesses
<ul>
    <li>Tecnologia aplicada Ã  operaÃ§Ã£o</li>
    <li>Ferramentas prÃ¡ticas e intuitivas para gestÃ£o em campo</li>
    <li>SoluÃ§Ãµes que aumentem eficiÃªncia e confiabilidade</li>
    <li>Dados e mÃ©tricas que apoiem tanto a operaÃ§Ã£o quanto performance do evento</li>
</ul> <br>

<div align="center">
  <sub>Figura 6 - Persona 2: Bruno Monteiro, Gerente de Field Marketing</sub><br>
  <img src="../assets/design/persona2.png" width="100%" alt="Persona representando o gerente de Field Marketing responsÃ¡vel pela supervisÃ£o da coleta de dados e anÃ¡lise de desempenho na competiÃ§Ã£o"><br>
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

#### InformaÃ§Ãµes
<ul>
    <li>Idade: 32 anos;</li>
    <li>LocalizaÃ§Ã£o: SÃ£o Paulo - SP </li>
    <li>Cargo: Gerente de Field Marketing da RedBull</li>
    <li>GÃªnero: Masculino</li>
</ul>

#### Biografia
Bruno Monteiro tem 32 anos e atua como Gerente de Field Marketing, sendo responsÃ¡vel pela supervisÃ£o e validaÃ§Ã£o das operaÃ§Ãµes em eventos esportivos da marca. No contexto do Red Bull 24 Horas, o Bruno lidera com uma visÃ£o geral da prova e acompanha o desempenho das equipes, garantindo que todos os dados coletados, como quilometragem, pace mÃ©dio e entradas dos atletas,  estejam consistentes e confiÃ¡veis para a anÃ¡lise de resultados no fim da prova. 



#### Objetivos
<ul>
    <li>Monitorar a coleta de dados</li>
    <li>Usar dados para melhorar a competiÃ§Ã£o</li>
    <li>Ver mÃ©tricas dos participantes </li>
    <li>Garantir confiabilidade dos resultados</li>
</ul>

#### Necessidades
<ul>
    <li>VisualizaÃ§Ã£o clara de mÃ©tricas</li>
    <li>Alertas para inconsistÃªncias </li>
    <li>AutomatizaÃ§Ã£o da coleta de dados</li>
    <li>RelatÃ³rios exportÃ¡veis para anÃ¡lise pÃ³s-evento</li>
</ul>

#### FrustraÃ§Ãµes
<ul>
    <li>DependÃªncia de registros manuais, sujeitos a erro humano</li>
    <li>Dificuldade em identificar inconsistÃªncias </li>
    <li>Falta de resultados em tempo real</li>
    <li>Alto esforÃ§o operacional para acompanhar mÃºltiplas equipes simultaneamente</li>
</ul>

#### Interesses
<ul>
    <li>EficiÃªncia e reduÃ§Ã£o de erros</li>
    <li>Tecnologias de automaÃ§Ã£o e monitoramento em tempo real</li>
    <li>Melhoria do evento para globalizÃ¡-lo</li>
    <li>ExperiÃªncia fluida para equipe e para os participantes</li>
</ul> <br>

<div align="center">
  <sub>Figura 7 - Persona 3: Amanda Azevedo, Atleta da RedBull 24 horas</sub><br>
  <img src="../assets/design/persona3.png" width="100%" alt="Persona representando uma atleta da competiÃ§Ã£o RedBull 24 horas que tem preocupaÃ§Ãµes relacionadas Ã  apuraÃ§Ã£o adequada das mÃ©tricas da esteira"><br>
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

#### InformaÃ§Ãµes
<ul>
    <li>Idade: 20 anos;</li>
    <li>LocalizaÃ§Ã£o: SÃ£o Paulo - SP</li>
    <li>Cargo: Atleta do RedBull 24 horas</li>
    <li>GÃªnero: Feminino</li>
</ul>

#### Biografia
Amanda Azevedo tem 20 anos e Ã© participante do Red Bull 24 Horas, integrando uma das equipes da competiÃ§Ã£o. Apaixonada por corrida e desafios de resistÃªncia, ela participa do evento buscando performance, superaÃ§Ã£o e espÃ­rito coletivo. Durante a prova, realiza turnos curtos e intensos na esteira, com trocas rÃ¡pidas que exigem foco total na corrida e pouca margem para interrupÃ§Ãµes. 

#### Objetivos
<ul>
    <li>Ganhar o campeonato </li>
    <li>Maximizar sua performance e contribuiÃ§Ã£o para a equipe  </li>
    <li>Garantir que seus quilÃ´metros sejam registrados corretamente</li>
</ul>

#### Necessidades
<ul>
    <li>Confiar no registro manual </li>
    <li>Visualizar mÃ©tricas da prova</li>
    <li>Focar no seu desempenho durante a prova</li>
    <li>Fazer troca Ã¡gil e sem interferÃªncias na corrida</li>
</ul>

#### FrustraÃ§Ãµes
<ul>
    <li>Fadiga fÃ­sica e mental durante a competiÃ§Ã£o</li>
    <li>PossÃ­veis erros manuais que comprometem o resultado  </li>
    <li>Trocas em poucos segundos </li>
    <li>MudanÃ§as frequentes de velocidade dificultam estimativas manuais de desempenho</li>
</ul>

#### Interesses
<ul>
    <li>Que sua quilometragem seja registrada corretamente</li>
    <li>Acompanhar o desempenho da equipe em tempo real </li>
    <li>Ganhar a competiÃ§Ã£o </li>
</ul> <br>

## 2.3. User Stories (sprints 1 a 5)

User stories sÃ£o descriÃ§Ãµes curtas e objetivas de funcionalidades escritas sob a perspectiva do usuÃ¡rio final. Elas seguem geralmente o formato: âComo (papel/perfil), posso (aÃ§Ã£o/meta), para (benefÃ­cio/razÃ£o)â, com foco no valor entregue e nÃ£o em detalhes tÃ©cnicos (Interaction Design Foundation, 2024). Esse modelo Ã© amplamente utilizado em metodologias Ã¡geis, como o Scrum, pois facilita a comunicaÃ§Ã£o entre equipe de desenvolvimento e stakeholders, alÃ©m de permitir a divisÃ£o dos requisitos em partes menores e testÃ¡veis.

A partir das user stories, torna-se necessÃ¡rio compreender quem sÃ£o os usuÃ¡rios que estÃ£o sendo representados. Nesse contexto, entram as personas, que sÃ£o representaÃ§Ãµes fictÃ­cias baseadas em dados reais de usuÃ¡rios. Elas descrevem caracterÃ­sticas como necessidades, objetivos, comportamentos e desafios, permitindo que a equipe tenha uma visÃ£o mais concreta do pÃºblico-alvo (Nielsen Norman Group, 2024). Dessa forma, as decisÃµes de design e desenvolvimento passam a ser guiadas por perfis realistas, garantindo maior alinhamento com as expectativas dos usuÃ¡rios e contribuindo para soluÃ§Ãµes mais eficazes e centradas na experiÃªncia.

Com as user stories definidas e as personas estabelecidas, Ã© necessÃ¡rio garantir que as funcionalidades descritas estejam claras e possam ser validadas. Para isso, utilizam-se os critÃ©rios de aceitaÃ§Ã£o, que sÃ£o condiÃ§Ãµes especÃ­ficas, mensurÃ¡veis e verificÃ¡veis que determinam quando uma user story pode ser considerada concluÃ­da (Tymoshchenko, 2023). Esses critÃ©rios reduzem ambiguidades, facilitam testes e garantem que o sistema desenvolvido atenda Ã s expectativas do usuÃ¡rio. Por exemplo, um critÃ©rio de aceitaÃ§Ã£o pode ser: âDado que o usuÃ¡rio adiciona um produto ao carrinho de compras (ambiente digital), quando ele acessa o carrinho, entÃ£o o item deve ser exibido com o nome, quantidade e preÃ§o corretosâ.

AlÃ©m dos critÃ©rios de aceitaÃ§Ã£o, hÃ¡ mais uma bÃºssola que norteia a equipe no momento de definir as user stories, garantindo qualidade e relevÃ¢ncia ao projeto: os critÃ©rios INVEST (Independent, Negotiable, Valuable, Estimable, Small, Testable) (Ben Salem, 2023). De modo geral, cada US precisa ser independente, ou seja, nÃ£o deve depender de outras para gerar valor; negociÃ¡vel, permitindo ajustes conforme o entendimento do projeto evolui; valiosa, entregando benefÃ­cios claros ao usuÃ¡rio; estimÃ¡vel, possibilitando que o time dimensione o esforÃ§o necessÃ¡rio e gerencie o cronograma de entregas; pequena, de modo que possa ser implementada em uma Ãºnica iteraÃ§Ã£o, facilitando a implementaÃ§Ã£o e o acompanhamento; e testÃ¡vel, garantindo que seja possÃ­vel verificar objetivamente se foi concluÃ­da com sucesso.

Sendo assim, por meio das user stories, mantÃ©m-se o foco no valor gerado ao usuÃ¡rio, alÃ©m de orientar a priorizaÃ§Ã£o das tarefas e facilitar a comunicaÃ§Ã£o entre stakeholders e desenvolvedores. Elas tambÃ©m servem como referÃªncia para a definiÃ§Ã£o e compreensÃ£o dos requisitos funcionais e nÃ£o funcionais do projeto, evidenciando as necessidades do usuÃ¡rio por meio de entregas objetivas. AlÃ©m disso, contribuem para o planejamento iterativo, auxiliam na estimativa de esforÃ§o das atividades e permitem a validaÃ§Ã£o contÃ­nua das funcionalidades por meio de critÃ©rios de aceitaÃ§Ã£o, favorecendo a adaptaÃ§Ã£o do produto conforme o feedback obtido ao longo do desenvolvimento.

A seguir, sÃ£o apresentadas as histÃ³rias de usuÃ¡rio definidas atÃ© o momento para o projeto em anÃ¡lise.

<div align="center">
  <sub>Quadro 3 - User Story 1 </sub>
</div>

| IdentificaÃ§Ã£o | US01 |
---| ---
| **Persona** | Bruno Monteiro (Gerente de Field Marketing) |
| **User Story** | "Como Bruno Monteiro, Gerente de Field Marketing, posso acessar o painel do admin, para gerenciar a competiÃ§Ã£o e acessar todas as funcionalidades do sistema de forma centralizada." |
| **CritÃ©rio de aceite 1** | CR1: O sistema deve permitir o acesso ao painel do admin em ambiente controlado. **Teste**: Dado que o administrador acessa o sistema, quando entra na plataforma, entÃ£o deve ser direcionado ao painel do admin. |
| **CritÃ©rio de aceite 2** | CR2: O painel deve exibir as principais seÃ§Ãµes do sistema. **Teste**: Dado que o admin acessa o painel, quando a pÃ¡gina carrega, entÃ£o deve visualizar opÃ§Ãµes como "criar competiÃ§Ã£o", "equipes", "ranking" e "relatÃ³rios". |
| **CritÃ©rio de aceite 3** | CR3: O painel deve exibir o estado atual do sistema (com ou sem competiÃ§Ã£o). **Teste**: Dado que nÃ£o hÃ¡ competiÃ§Ã£o cadastrada, quando o painel Ã© exibido, entÃ£o deve mostrar a opÃ§Ã£o "Criar competiÃ§Ã£o". AlÃ©m disso, dado que existe uma competiÃ§Ã£o cadastrada, quando o painel Ã© exibido, entÃ£o deve mostrar status, tempo e equipes. |
| CritÃ©rios INVEST | Independente: Esta US nÃ£o depende de outras para ser desenvolvida, pois o painel do admin pode ser construÃ­do sem que o sistema de login ou o ranking estejam finalizados. <br> NegociÃ¡vel: A forma de acesso ao painel e as seÃ§Ãµes exibidas podem ser redefinidas conforme as necessidades identificadas durante o projeto. <br> Valorosa: Centraliza o controle do sistema, oferecendo ao administrador um ponto Ãºnico de acesso a todas as funcionalidades da competiÃ§Ã£o. <br> EstimÃ¡vel: Escopo claro e limitado a uma tela principal com exibiÃ§Ã£o condicional de estado. <br> Pequena: Compreende apenas a tela principal do admin e sua lÃ³gica de exibiÃ§Ã£o de estado. <br> TestÃ¡vel: Os comportamentos de redirecionamento e exibiÃ§Ã£o condicional sÃ£o verificÃ¡veis objetivamente para cada estado do sistema. |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

<div align="center">
  <sub>Quadro 4 - User Story 2 </sub>
</div>

| IdentificaÃ§Ã£o | US02 |
---| ---
| **Persona** | Bruno Monteiro (Gerente de Field Marketing) |
| **User Story** | "Como Bruno Monteiro, Gerente de Field Marketing, posso cadastrar uma nova competiÃ§Ã£o com data e localizaÃ§Ã£o, para estruturar e iniciar um evento de corrida." |
| **CritÃ©rio de aceite 1** | CR1: O sistema deve permitir o preenchimento dos dados do evento. **Teste**: Dado que o admin acessa o formulÃ¡rio, quando preenche nome, data e local, entÃ£o os campos devem aceitar os valores corretamente. |
| **CritÃ©rio de aceite 2** | CR2: O sistema deve validar campos obrigatÃ³rios. **Teste**: Dado que hÃ¡ campos vazios, quando o admin tenta criar o evento, entÃ£o o sistema deve impedir a criaÃ§Ã£o e exibir erro. |
| **CritÃ©rio de aceite 3** | CR3: O sistema deve criar o evento com status inicial. **Teste**: Dado que os dados sÃ£o vÃ¡lidos, quando o admin confirma, entÃ£o o evento deve ser criado com status "nÃ£o iniciado". |
| CritÃ©rios INVEST | Independente: Esta US nÃ£o depende de outras para ser desenvolvida, pois o formulÃ¡rio de cadastro pode ser construÃ­do de forma isolada. <br> NegociÃ¡vel: Os campos do formulÃ¡rio podem ser revisados conforme necessidade do projeto. <br> Valorosa: Ã a base do sistema, pois sem um evento cadastrado nenhuma outra funcionalidade pode ser utilizada. <br> EstimÃ¡vel: Escopo claro e limitado a um formulÃ¡rio com validaÃ§Ãµes simples. <br> Pequena: Compreende apenas um formulÃ¡rio de criaÃ§Ã£o de evento. <br> TestÃ¡vel: ValidaÃ§Ãµes bem definidas permitem testes objetivos de cada critÃ©rio. |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

<div align="center">
  <sub>Quadro 5 - User Story 3 </sub>
</div>

| IdentificaÃ§Ã£o | US03 |
---| ---
| **Persona** | Bruno Monteiro (Gerente de Field Marketing) |
| **User Story** | "Como Bruno Monteiro, Gerente de Field Marketing, posso cadastrar e editar equipes com seus atletas, para garantir que todos os participantes estejam registrados corretamente." |
| **CritÃ©rio de aceite 1** | CR1: O sistema deve permitir criar uma equipe. **Teste**: Dado que o admin insere nome e lÃ­der, quando salva, entÃ£o a equipe deve aparecer na lista. |
| **CritÃ©rio de aceite 2** | CR2: O sistema deve permitir adicionar atletas. **Teste**: Dado que o admin adiciona atletas Ã  equipe, quando salva, entÃ£o os atletas devem estar corretamente vinculados Ã  equipe. |
| **CritÃ©rio de aceite 3** | CR3: O sistema deve permitir ediÃ§Ã£o e remoÃ§Ã£o de atletas. **Teste**: Dado que o admin altera ou remove dados de um atleta, quando salva, entÃ£o as mudanÃ§as devem ser refletidas corretamente na equipe. |
| **CritÃ©rio de aceite 4** | CR4: Quando nÃ£o hÃ¡ equipes cadastradas, a tela deve exibir um botÃ£o de adiÃ§Ã£o com instruÃ§Ã£o visual. **Teste**: Dado que o admin acessa /admin/equipes sem nenhuma equipe cadastrada, quando a pÃ¡gina carrega, entÃ£o deve exibir o botÃ£o "+ Adicionar equipe" acompanhado de instruÃ§Ã£o visual, sem exibir uma lista vazia. |
| CritÃ©rios INVEST | Independente: Esta US pode ser desenvolvida sem depender de outras funcionalidades, pois o cadastro de equipes Ã© uma operaÃ§Ã£o isolada. <br> NegociÃ¡vel: A estrutura dos dados da equipe, como campos obrigatÃ³rios e opcionais, pode ser ajustada conforme as necessidades do projeto. <br> Valorosa: Ã essencial para o funcionamento da competiÃ§Ã£o, pois sem equipes e atletas cadastrados nenhuma corrida pode ser realizada. <br> EstimÃ¡vel: Trata-se de um CRUD simples com escopo bem definido. <br> Pequena: Compreende apenas as operaÃ§Ãµes de criaÃ§Ã£o, ediÃ§Ã£o e remoÃ§Ã£o dentro do cadastro de equipes. <br> TestÃ¡vel: Cada operaÃ§Ã£o de CRUD possui comportamento verificÃ¡vel e resultado esperado claro. |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

<div align="center">
  <sub>Quadro 6 - User Story 4 </sub>
</div>

| IdentificaÃ§Ã£o | US04 |
---| ---
| **Persona** | Bruno Monteiro (Gerente de Field Marketing) |
| **User Story** | "Como Bruno Monteiro, Gerente de Field Marketing, posso acessar relatÃ³rios detalhados da competiÃ§Ã£o, para analisar desempenho e inconsistÃªncias." |
| **CritÃ©rio de aceite 1** | CR1: O sistema deve exibir relatÃ³rios da competiÃ§Ã£o. **Teste**: Dado que o admin acessa a seÃ§Ã£o de relatÃ³rios, quando seleciona um tipo â visÃ£o geral da competiÃ§Ã£o, relatÃ³rio por equipe ou relatÃ³rio de inconsistÃªncias â, entÃ£o os dados correspondentes devem ser exibidos corretamente. |
| **CritÃ©rio de aceite 2** | CR2: O sistema deve identificar e listar inconsistÃªncias. **Teste**: Dado que existem divergÃªncias entre os dados capturados via OCR e os inseridos manualmente, quando o relatÃ³rio de inconsistÃªncias Ã© gerado, entÃ£o o sistema deve listar todas as ocorrÃªncias identificadas. |
| **CritÃ©rio de aceite 3** | CR3: O sistema deve permitir a exportaÃ§Ã£o dos dados. **Teste**: Dado que o admin solicita a exportaÃ§Ã£o de um relatÃ³rio, quando executa a aÃ§Ã£o, entÃ£o o sistema deve gerar e disponibilizar um arquivo CSV com os dados correspondentes. |
| CritÃ©rios INVEST | Independente: Esta US pode ser desenvolvida de forma isolada, pois a geraÃ§Ã£o de relatÃ³rios nÃ£o depende de outras funcionalidades estarem finalizadas. <br> NegociÃ¡vel: Os tipos de relatÃ³rio, filtros disponÃ­veis e formatos de exportaÃ§Ã£o podem evoluir conforme as necessidades identificadas durante o projeto. <br> Valorosa: Gera insights estratÃ©gicos para o administrador, permitindo anÃ¡lise de desempenho e identificaÃ§Ã£o de problemas durante a competiÃ§Ã£o. <br> EstimÃ¡vel: Possui complexidade mÃ©dia, com escopo definido em exibiÃ§Ã£o, identificaÃ§Ã£o de inconsistÃªncias e exportaÃ§Ã£o de dados. <br> Pequena: Ã modular e pode ser dividida em partes â exibiÃ§Ã£o de relatÃ³rios, detecÃ§Ã£o de inconsistÃªncias e funcionalidade de exportaÃ§Ã£o. <br> TestÃ¡vel: Cada critÃ©rio possui resultados verificÃ¡veis e comportamentos esperados claramente definidos. |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

<div align="center">
  <sub>Quadro 7 - User Story 5 </sub>
</div>

| IdentificaÃ§Ã£o | US05 |
---| ---
| **Persona** | Bruno Monteiro (Gerente de Field Marketing) |
| **User Story** | "Como Bruno Monteiro, Gerente de Field Marketing, posso gerar uma URL Ãºnica (UUID) automaticamente ao cadastrar uma equipe, para que o link possa ser distribuÃ­do ao capitÃ£o da equipe sem necessidade de login." |
| **CritÃ©rio de aceite 1** | CR1: O sistema deve gerar automaticamente um UUID ao salvar uma equipe. **Teste**: Dado que o administrador clica em "Salvar equipe" no modal de criaÃ§Ã£o, quando a equipe Ã© salva, entÃ£o o sistema deve gerar um UUID Ãºnico e exibi-lo na tela com um botÃ£o "Copiar link". AlÃ©m disso, dado que dois cadastros distintos sÃ£o realizados, quando comparados, entÃ£o os UUIDs gerados devem ser diferentes. |
| **CritÃ©rio de aceite 2** | CR2: O UUID e o botÃ£o "Copiar link" devem estar visÃ­veis no card da equipe na listagem. **Teste**: Dado que o admin navega para a tela de equipes, quando a pÃ¡gina carrega, entÃ£o cada card deve exibir seu UUID e o botÃ£o "Copiar link". AlÃ©m disso, dado que o admin clica em "Copiar link", quando a aÃ§Ã£o Ã© executada, entÃ£o o link deve ser copiado corretamente para a Ã¡rea de transferÃªncia. |
| **CritÃ©rio de aceite 3** | CR3: O UUID nÃ£o deve expirar enquanto o evento estiver ativo. **Teste**: Dado que o evento estÃ¡ em andamento, quando o link gerado Ã© acessado, entÃ£o a pÃ¡gina deve carregar corretamente. |
| CritÃ©rios INVEST | Independente: Esta US nÃ£o depende de outras para ser desenvolvida, pois a geraÃ§Ã£o do UUID ocorre de forma isolada no momento do cadastro da equipe. <br> NegociÃ¡vel: A implementaÃ§Ã£o pode ser simplificada ou refinada em conjunto com o parceiro e os demais envolvidos no projeto. <br> Valorosa: Elimina a necessidade de login para a equipe, facilitando o acesso ao painel sem barreiras de autenticaÃ§Ã£o. <br> EstimÃ¡vel: O fluxo de geraÃ§Ã£o do UUID no momento do cadastro Ã© claro e bem delimitado. <br> Pequena: Escopo limitado Ã  geraÃ§Ã£o, exibiÃ§Ã£o e cÃ³pia do link. <br> TestÃ¡vel: O comportamento Ã© verificÃ¡vel via criaÃ§Ã£o de equipes e acesso ao link gerado. |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

<div align="center">
  <sub>Quadro 8 - User Story 6 </sub>
</div>

| IdentificaÃ§Ã£o | US06 |
---| ---
| **Persona** | Bruno Monteiro (Gerente de Field Marketing) |
| **User Story** | "Como Bruno Monteiro, Gerente de Field Marketing, posso acessar a aba de equipes pelo menu de navegaÃ§Ã£o ou pelo card de atalho na Home, para gerenciar o cadastro de equipes e atletas da competiÃ§Ã£o." |
| **CritÃ©rio de aceite 1** | CR1: O menu fixo deve exibir o item "Equipes" em todas as telas do admin e redirecionar corretamente. **Teste**: Dado que o admin estÃ¡ em qualquer tela do sistema, quando clica em "Equipes" no menu fixo, entÃ£o deve ser redirecionado para /admin/equipes e o item deve ficar destacado como ativo no menu. |
| **CritÃ©rio de aceite 2** | CR2: O card "Gerenciar equipes" na Home deve redirecionar para a tela de gestÃ£o de equipes. **Teste**: Dado que o admin estÃ¡ na Home, quando clica no card "Gerenciar equipes", entÃ£o deve ser redirecionado para /admin/equipes. |
| CritÃ©rios INVEST | Independente: Esta US nÃ£o depende de outros fluxos, pois a navegaÃ§Ã£o atÃ© a tela de equipes pode ser desenvolvida de forma isolada. <br> NegociÃ¡vel: Os atalhos, Ã­cones e rÃ³tulos do menu podem ser ajustados conforme necessidade do projeto. <br> Valorosa: Centraliza o gerenciamento de equipes e oferece acesso rÃ¡pido por dois pontos de entrada distintos. <br> EstimÃ¡vel: O padrÃ£o de navegaÃ§Ã£o Ã© bem definido e de complexidade baixa. <br> Pequena: Escopo limitado Ã  navegaÃ§Ã£o entre telas por dois pontos de entrada distintos, sem envolver lÃ³gica de exibiÃ§Ã£o de conteÃºdo ou estado da listagem. <br> TestÃ¡vel: As rotas e os estados de tela sÃ£o verificÃ¡veis objetivamente. |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

<div align="center">
  <sub>Quadro 9 - User Story 7 </sub>
</div>

| IdentificaÃ§Ã£o | US07 |
---| ---
| **Persona** | Marina Costa (Coordenadora Operacional) |
| **User Story** | "Como Marina Costa, Coordenadora Operacional, posso clicar no botÃ£o 'Acessar competiÃ§Ã£o' no card de uma equipe, para abrir o painel operacional completo da equipe e gerenciar os registros em tempo real." |
| **CritÃ©rio de aceite 1** | CR1: O sistema deve navegar para o painel operacional da equipe selecionada ao clicar em "Acessar competiÃ§Ã£o". **Teste**: Dado que o admin clica em "Acessar competiÃ§Ã£o" no card de uma equipe, quando a navegaÃ§Ã£o ocorre, entÃ£o o sistema deve exibir o painel em /admin/equipes/operacional com os dados da equipe correta. |
| **CritÃ©rio de aceite 2** | CR2: O painel operacional deve conter os trÃªs blocos definidos na especificaÃ§Ã£o. **Teste**: Dado que o admin abre o painel operacional, quando a pÃ¡gina carrega, entÃ£o devem estar presentes a Ã¡rea de controle do juiz, o fluxo de registro de checkpoint e a tabela de dados da equipe. AlÃ©m disso, o dropdown de atletas deve listar todos os membros da equipe selecionada. |
| CritÃ©rios INVEST | Independente: Esta US depende apenas do cadastro prÃ©vio da equipe, sendo desenvolvÃ­vel de forma isolada apÃ³s essa etapa. <br> NegociÃ¡vel: O layout e a organizaÃ§Ã£o dos blocos do painel podem ser reorganizados conforme feedback do parceiro. <br> Valorosa: Ã a tela operacional principal da competiÃ§Ã£o, centralizando o controle em tempo real. <br> EstimÃ¡vel: Escopo bem delimitado pela especificaÃ§Ã£o, com dois critÃ©rios de aceite claros. <br> Pequena: Limitada ao acesso e ao carregamento correto do painel operacional. <br> TestÃ¡vel: A navegaÃ§Ã£o e a presenÃ§a dos componentes sÃ£o verificÃ¡veis objetivamente. |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

<div align="center">
  <sub>Quadro 10 - User Story 8 </sub>
</div>

| IdentificaÃ§Ã£o | US08 |
---| ---
| **Persona** | Marina Costa (Coordenadora Operacional) |
| **User Story** | "Como Marina Costa, Coordenadora Operacional, posso selecionar o atleta ativo na tela de checkpoint, para controlar com precisÃ£o quem estÃ¡ em corrida." |
| **CritÃ©rio de aceite 1** | CR1: O dropdown deve exibir todos os atletas da equipe com seu status atual. **Teste**: Dado que o juiz abre o dropdown na tela de checkpoint, quando a lista Ã© exibida, entÃ£o todos os atletas da equipe devem aparecer com seu respectivo status â Em corrida, Em descanso ou Pronto para entrar â visÃ­vel ao lado do nome. |
| **CritÃ©rio de aceite 2** | CR2: Os botÃµes de status devem ser atualizados automaticamente apÃ³s a troca de atleta. **Teste**: Dado que o juiz clica em "Trocar atleta" e confirma a entrada do prÃ³ximo atleta, quando a aÃ§Ã£o Ã© concluÃ­da, entÃ£o o atleta anterior deve ter seu status alterado para "Em descanso" e o atleta atual para "Em corrida". |
| CritÃ©rios INVEST | Independente: Esta US funciona de forma independente do fluxo OCR e pode ser desenvolvida separadamente. <br> NegociÃ¡vel: O nÃºmero de status possÃ­veis e o fluxo de troca podem ser expandidos ou ajustados conforme necessidade. <br> Valorosa: Garante controle preciso da operaÃ§Ã£o durante a prova, evitando inconsistÃªncias no registro de atletas. <br> EstimÃ¡vel: O fluxo de seleÃ§Ã£o e troca de atletas Ã© bem definido e de complexidade controlada. <br> Pequena: Limitada ao controle de atleta ativo, sem envolver o registro de performance. <br> TestÃ¡vel: Os estados dos atletas apÃ³s cada aÃ§Ã£o sÃ£o verificÃ¡veis objetivamente. |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

<div align="center">
  <sub>Quadro 11 - User Story 9 </sub>
</div>

| IdentificaÃ§Ã£o | US09 |
---| ---
| **Persona** | Marina Costa (Coordenadora Operacional) |
| **User Story** | "Como Marina Costa, Coordenadora Operacional, posso fotografar a tela da esteira durante a corrida, para que o sistema extraia automaticamente os dados de performance via OCR e os registre no checkpoint do atleta." |
| **CritÃ©rio de aceite 1** | CR1: O sistema deve capturar a imagem e extrair os dados via OCR. **Teste**: Dado que o admin clica em "Tirar foto da esteira", quando a cÃ¢mera integrada Ã© aberta e a foto Ã© capturada, entÃ£o o sistema deve exibir o preview da imagem ao lado dos dados extraÃ­dos â distÃ¢ncia (km), pace (min/km) e tempo total. |
| **CritÃ©rio de aceite 2** | CR2: O sistema deve alertar visualmente quando o valor extraÃ­do apresentar discrepÃ¢ncia. **Teste**: Dado que o OCR extrai um valor que diverge da mÃ©dia histÃ³rica do atleta ou da meta da prova, quando o dado Ã© exibido, entÃ£o o campo deve ser marcado em vermelho com mensagem de alerta. AlÃ©m disso, dado que o valor estÃ¡ dentro do esperado, quando exibido, entÃ£o nenhum alerta deve ser apresentado. |
| **CritÃ©rio de aceite 3** | CR3: O sistema deve registrar se o dado foi confirmado via OCR ou corrigido manualmente. **Teste**: Dado que o juiz confirma o dado extraÃ­do pelo OCR, quando salvo, entÃ£o o log de auditoria deve registrar o mÃ©todo como "OCR". AlÃ©m disso, dado que o juiz corrige o dado manualmente, quando salvo, entÃ£o o log deve registrar o mÃ©todo como "manual". |
| CritÃ©rios INVEST | Independente: O fluxo OCR Ã© autossuficiente; o modo de entrada manual Ã© tratado como US separada. <br> NegociÃ¡vel: A engine de OCR utilizada e o limiar de discrepÃ¢ncia podem ser ajustados conforme os resultados obtidos em testes. <br> Valorosa: Elimina erros de digitaÃ§Ã£o e agiliza o registro de checkpoints durante a competiÃ§Ã£o. <br> EstimÃ¡vel: O fluxo de cinco etapas â captura, extraÃ§Ã£o, alerta, revisÃ£o e confirmaÃ§Ã£o â estÃ¡ bem especificado. <br> Pequena: Limitada Ã  captura, extraÃ§Ã£o e confirmaÃ§Ã£o de um Ãºnico checkpoint. <br> TestÃ¡vel: Os dados extraÃ­dos, os alertas de discrepÃ¢ncia e os logs de auditoria sÃ£o verificÃ¡veis objetivamente. |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

<div align="center">
  <sub>Quadro 12 - User Story 10 </sub>
</div>

| IdentificaÃ§Ã£o | US10 |
---| ---
| **Persona** | Marina Costa (Coordenadora Operacional) |
| **User Story** | "Como Marina Costa, Coordenadora Operacional, posso registrar um checkpoint manualmente digitando os dados quando a cÃ¢mera falhar ou a foto estiver ilegÃ­vel, para que nenhum registro seja perdido por falha tÃ©cnica." |
| **CritÃ©rio de aceite 1** | CR1: O modo manual deve disponibilizar um formulÃ¡rio com os campos de distÃ¢ncia, pace e tempo total. **Teste**: Dado que o admin acessa o modo de entrada manual, quando preenche os campos de distÃ¢ncia (km), pace (min/km) e tempo total e clica em "Salvar registro manual", entÃ£o os dados devem ser salvos corretamente no checkpoint da equipe e do atleta. |
| **CritÃ©rio de aceite 2** | CR2: O sistema deve registrar automaticamente que o checkpoint foi inserido em modo manual. **Teste**: Dado que o admin salva um registro pelo modo manual, quando o dado Ã© persistido, entÃ£o o log de auditoria deve exibir a flag "manual" para distingui-lo dos registros inseridos via OCR. |
| CritÃ©rios INVEST | Independente: Ã o caminho de contingÃªncia do sistema e pode ser desenvolvido de forma independente do fluxo OCR. <br> NegociÃ¡vel: Os campos disponÃ­veis no modo manual podem ser expandidos conforme necessidade identificada durante o projeto. <br> Valorosa: Garante continuidade operacional em situaÃ§Ãµes de falha tÃ©cnica, evitando perda de registros durante a competiÃ§Ã£o. <br> EstimÃ¡vel: Trata-se de um formulÃ¡rio simples com campos bem definidos e comportamento claro. <br> Pequena: Escopo limitado Ã  entrada e ao salvamento manual de um Ãºnico checkpoint. <br> TestÃ¡vel: Os dados salvos e a flag de mÃ©todo no log de auditoria sÃ£o verificÃ¡veis objetivamente. |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

<div align="center">
  <sub>Quadro 13 - User Story 11 </sub>
</div>

| IdentificaÃ§Ã£o | US11 |
---| ---
| **Persona** | Marina Costa (Coordenadora Operacional) |
| **User Story** | "Como Marina Costa, Coordenadora Operacional, posso visualizar uma tabela com os dados consolidados da equipe que se atualiza automaticamente a cada 5 minutos, para acompanhar a evoluÃ§Ã£o da performance sem precisar recarregar a pÃ¡gina." |
| **CritÃ©rio de aceite 1** | CR1: A tabela deve exibir os dados consolidados da equipe com todos os campos definidos. **Teste**: Dado que o admin registra um checkpoint, quando a tabela Ã© exibida, entÃ£o devem estar presentes os Ãºltimos checkpoints registrados com timestamp e atleta, o pace mÃ©dio atualizado, a distÃ¢ncia total acumulada e o tempo total ativo, todos com valores coerentes. |
| **CritÃ©rio de aceite 2** | CR2: A tabela deve ser atualizada automaticamente a cada 5 minutos sem aÃ§Ã£o do usuÃ¡rio. **Teste**: Dado que um novo checkpoint Ã© registrado, quando o intervalo de 5 minutos Ã© atingido, entÃ£o o novo registro deve aparecer na tabela sem que o admin recarregue a pÃ¡gina. AlÃ©m disso, deve ser exibido um indicador visual ou timestamp da Ãºltima atualizaÃ§Ã£o. |
| **CritÃ©rio de aceite 3** | CR3: Os valores de pace mÃ©dio e distÃ¢ncia total devem ser recalculados corretamente a cada atualizaÃ§Ã£o. **Teste**: Dado que mÃºltiplos checkpoints foram registrados, quando a tabela Ã© atualizada, entÃ£o o pace mÃ©dio deve corresponder Ã  mÃ©dia ponderada correta e a distÃ¢ncia total deve ser a soma de todos os checkpoints da sessÃ£o. |
| CritÃ©rios INVEST | Independente: Esta US depende apenas dos checkpoints jÃ¡ registrados, podendo ser desenvolvida de forma isolada. <br> NegociÃ¡vel: O intervalo de atualizaÃ§Ã£o de 5 minutos pode ser tornado configurÃ¡vel em versÃµes futuras. <br> Valorosa: Oferece ao juiz uma visÃ£o consolidada e atualizada da performance da equipe em tempo real. <br> EstimÃ¡vel: A lÃ³gica de auto-refresh e os cÃ¡lculos de mÃ©tricas estÃ£o bem definidos. <br> Pequena: Limitada Ã  exibiÃ§Ã£o e Ã  atualizaÃ§Ã£o automÃ¡tica da tabela de dados. <br> TestÃ¡vel: Os dados exibidos, o timing do refresh e os cÃ¡lculos de mÃ©tricas sÃ£o verificÃ¡veis objetivamente. |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

<div align="center">
  <sub>Quadro 14 - User Story 12 </sub>
</div>

| IdentificaÃ§Ã£o | US12 |
---| ---
| **Persona** | Amanda Azevedo (Atleta) |
| **User Story** | "Como Amanda Azevedo, atleta da competiÃ§Ã£o, posso acessar a URL Ãºnica da minha equipe (UUID) sem necessidade de login, para visualizar as informaÃ§Ãµes da equipe em tempo real diretamente pelo link recebido do administrador." |
| **CritÃ©rio de aceite 1** | CR1: O painel deve ser acessÃ­vel publicamente sem exigir autenticaÃ§Ã£o. **Teste**: Dado que qualquer pessoa acessa o link em modo anÃ´nimo ou aba privada, quando a URL Ã© carregada, entÃ£o a tela deve ser exibida corretamente sem campos de login ou solicitaÃ§Ã£o de senha. AlÃ©m disso, dado que um UUID invÃ¡lido Ã© acessado, quando a requisiÃ§Ã£o Ã© feita, entÃ£o o sistema deve exibir uma mensagem de erro. |
| **CritÃ©rio de aceite 2** | CR2: A tela deve exibir apenas os dados correspondentes Ã  equipe vinculada ao UUID acessado. **Teste**: Dado que dois links de equipes diferentes sÃ£o acessados, quando cada um Ã© carregado, entÃ£o cada painel deve exibir exclusivamente os dados da equipe correta, sem expor informaÃ§Ãµes de outras equipes. |
| CritÃ©rios INVEST | Independente: Esta US depende apenas do UUID gerado pelo administrador, sendo desenvolvÃ­vel de forma isolada. <br> NegociÃ¡vel: O tempo de expiraÃ§Ã£o do link pode ser configurÃ¡vel em versÃµes futuras do sistema. <br> Valorosa: Elimina barreiras de acesso para corredores e torcida, permitindo acompanhamento em tempo real sem cadastro. <br> EstimÃ¡vel: O comportamento de rota pÃºblica estÃ¡ bem definido e Ã© de complexidade baixa. <br> Pequena: Limitada ao acesso e ao carregamento inicial da tela pÃºblica da equipe. <br> TestÃ¡vel: O acesso sem autenticaÃ§Ã£o e a exibiÃ§Ã£o correta dos dados sÃ£o verificÃ¡veis objetivamente. |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

<div align="center">
  <sub>Quadro 15 - User Story 13 </sub>
</div>

| IdentificaÃ§Ã£o            | US13  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Persona**              | Amanda Azevedo (Atleta)   |
| **User Story**           | "Como Amanda Azevedo, atleta da competiÃ§Ã£o, posso visualizar o ranking global da competiÃ§Ã£o no painel da equipe, para acompanhar a posiÃ§Ã£o da minha equipe durante o evento."  |
| **CritÃ©rio de aceite 1** | CR1: O painel deve exibir o ranking global com atualizaÃ§Ã£o automÃ¡tica a cada 1 hora. **Teste**: Dado que a atleta acessa o painel, quando a pÃ¡gina carrega, entÃ£o devem ser exibidos a posiÃ§Ã£o atual da equipe, a distÃ¢ncia para o lÃ­der e a diferenÃ§a para a equipe na posiÃ§Ã£o anterior.  |
| **CritÃ©rio de aceite 2** | CR2: O ranking nÃ£o deve ser atualizado antes do intervalo definido. **Teste**: Dado que menos de 1 hora se passou desde a Ãºltima atualizaÃ§Ã£o, quando o painel Ã© acessado novamente, entÃ£o o ranking exibido deve permanecer inalterado. |
| CritÃ©rios INVEST         | Independente: O ranking pode ser desenvolvido separadamente das demais funcionalidades do painel pÃºblico. <br> NegociÃ¡vel: As mÃ©tricas exibidas no ranking podem ser alteradas conforme feedback dos usuÃ¡rios. <br> Valorosa: Permite que a atleta acompanhe o desempenho geral da equipe durante a competiÃ§Ã£o. <br> EstimÃ¡vel: O comportamento de atualizaÃ§Ã£o e exibiÃ§Ã£o do ranking Ã© claro e bem delimitado. <br> Pequena: Escopo limitado Ã  exibiÃ§Ã£o do ranking global. <br> TestÃ¡vel: Os dados exibidos e o intervalo de atualizaÃ§Ã£o sÃ£o verificÃ¡veis objetivamente. |



<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

<div align="center">
  <sub>Quadro 16 - User Story 14 </sub>
</div>

| IdentificaÃ§Ã£o            | US14 |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Persona**              | Amanda Azevedo (Atleta) |
| **User Story**           | "Como Amanda Azevedo, atleta da competiÃ§Ã£o, posso visualizar o status individual e as mÃ©tricas dos atletas da minha equipe, para acompanhar o desempenho coletivo durante a prova." |
| **CritÃ©rio de aceite 1** | CR1: O painel deve exibir os dados individuais dos atletas da equipe. **Teste**: Dado que a atleta acessa o painel, quando a pÃ¡gina carrega, entÃ£o devem estar presentes pace mÃ©dio geral, velocidade mÃ¡xima, distÃ¢ncia acumulada, timestamp do Ãºltimo checkpoint, tempo parado desde o Ãºltimo turno e status atual de cada atleta. |
| **CritÃ©rio de aceite 2** | CR2: Os dados devem refletir novos checkpoints registrados. **Teste**: Dado que um checkpoint Ã© registrado pelo administrador, quando o painel Ã© atualizado, entÃ£o os dados do atleta correspondente devem refletir as novas informaÃ§Ãµes.|
| CritÃ©rios INVEST         | Independente: A exibiÃ§Ã£o das mÃ©tricas dos atletas pode ser desenvolvida independentemente do ranking e da calculadora de descanso. <br> NegociÃ¡vel: As mÃ©tricas exibidas podem ser ajustadas conforme necessidade do parceiro. <br> Valorosa: Permite acompanhamento detalhado do desempenho da equipe durante a competiÃ§Ã£o. <br> EstimÃ¡vel: Os campos e comportamentos esperados estÃ£o claramente definidos. <br> Pequena: Escopo limitado Ã  visualizaÃ§Ã£o de mÃ©tricas dos atletas. <br> TestÃ¡vel: Todos os campos exibidos podem ser verificados objetivamente. |


<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

<div align="center">
  <sub>Quadro 17 - User Story 15 </sub>
</div>

| IdentificaÃ§Ã£o            | US15|
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Persona**              | Amanda Azevedo (Atleta) |
| **User Story**           | "Como Amanda Azevedo, atleta da competiÃ§Ã£o, posso visualizar uma calculadora de descanso inteligente, para entender meu tempo recomendado de recuperaÃ§Ã£o entre turnos." |
| **CritÃ©rio de aceite 1** | CR1: A calculadora deve exibir indicador visual baseado no estado fÃ­sico do atleta. **Teste**: Dado que o status do atleta varia, quando o indicador Ã© exibido, entÃ£o a barra deve mudar de cor conforme o estado â verde, amarelo ou vermelho. |
| **CritÃ©rio de aceite 2** | CR2: A calculadora deve exibir o tempo recomendado de descanso e a contagem regressiva. **Teste**: Dado que um atleta realizou uma corrida recente e intensa, quando o cÃ¡lculo Ã© executado, entÃ£o o sistema deve exibir o tempo recomendado de descanso acompanhado de contagem regressiva. |
| CritÃ©rios INVEST         | Independente: A calculadora pode ser implementada sem dependÃªncia das demais funcionalidades do painel pÃºblico. <br> NegociÃ¡vel: As regras de cÃ¡lculo e os indicadores podem ser ajustados conforme testes futuros. <br> Valorosa: Auxilia atletas no gerenciamento de descanso durante a competiÃ§Ã£o. <br> EstimÃ¡vel: A lÃ³gica de cÃ¡lculo e exibiÃ§Ã£o possui escopo claro. <br> Pequena: Escopo limitado Ã  recomendaÃ§Ã£o de descanso. <br> TestÃ¡vel: Os indicadores e tempos exibidos podem ser verificados objetivamente. |


<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

<div align="center">
  <sub>Quadro 18 - User Story 16 </sub>
</div>

| IdentificaÃ§Ã£o            | US16 |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Persona**              | Amanda Azevedo (Atleta) |
| **User Story**           | "Como Amanda Azevedo, atleta da competiÃ§Ã£o, posso compartilhar o ranking simplificado da equipe, para divulgar o desempenho da competiÃ§Ã£o sem expor dados sensÃ­veis dos atletas."|
| **CritÃ©rio de aceite 1** | CR1: O sistema deve gerar um link simplificado de compartilhamento. **Teste**: Dado que a atleta clica em "Compartilhar ranking", quando o link Ã© gerado, entÃ£o deve ser criado um link contendo apenas o leaderboard simplificado da competiÃ§Ã£o. |
| **CritÃ©rio de aceite 2** | CR2: O link compartilhado nÃ£o deve expor dados individuais sensÃ­veis. **Teste**: Dado que o link Ã© acessado por terceiros, quando a pÃ¡gina carrega, entÃ£o apenas informaÃ§Ãµes gerais do ranking devem ser exibidas, sem mÃ©tricas individuais dos atletas. |
| CritÃ©rios INVEST         | Independente: O compartilhamento pode ser desenvolvido separadamente das demais funcionalidades do painel pÃºblico. <br> NegociÃ¡vel: Os formatos de compartilhamento podem evoluir conforme necessidade do projeto. <br> Valorosa: Facilita divulgaÃ§Ã£o da competiÃ§Ã£o e engajamento das equipes. <br> EstimÃ¡vel: O comportamento do link e dos dados exibidos Ã© bem definido. <br> Pequena: Escopo limitado Ã  geraÃ§Ã£o e exibiÃ§Ã£o do link compartilhÃ¡vel. <br> TestÃ¡vel: O conteÃºdo exibido no link pode ser validado objetivamente. |


<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

<div align="center">
  <sub>Quadro 19 - User Story 17 </sub>
</div>

| IdentificaÃ§Ã£o            | US17 |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Persona**              | Bruno Monteiro (Gerente de Field Marketing) |
| **User Story**           | "Como Bruno Monteiro, Gerente de Field Marketing, posso acessar a Matriz de Rastreabilidade do sistema, para verificar a cobertura entre requisitos funcionais, regras de negÃ³cio, endpoints e telas implementadas."|
| **CritÃ©rio de aceite 1** | CR1: A RTM deve estar acessÃ­vel e atualizada no documento WAD, cobrindo todos os RFs implementados. **Teste:** Dado que o administrador acessa a seÃ§Ã£o 3.9 do WAD, quando a pÃ¡gina Ã© exibida, entÃ£o a matriz deve conter todas as linhas de rastreabilidade com persona, RF, RN, endpoint, tela, teste e evidÃªncia preenchidos. |
| **CritÃ©rio de aceite 2** | CR2: A RTM deve permitir identificar lacunas de cobertura entre requisitos e implementaÃ§Ã£o. **Teste:** Dado que um RF foi implementado, quando a RTM Ã© consultada, entÃ£o deve existir ao menos uma linha correspondente conectando persona â RF â RN â endpoint â tela â teste â evidÃªncia. |
| **CritÃ©rios INVEST**     | Independente: Esta US pode ser validada de forma isolada, pois depende apenas da documentaÃ§Ã£o existente. <br> NegociÃ¡vel: As colunas da RTM podem ser expandidas conforme necessidades identificadas ao longo das sprints. <br> Valorosa: Garante rastreabilidade completa entre necessidades, implementaÃ§Ã£o e validaÃ§Ã£o, essencial para auditoria e controle de qualidade. <br> EstimÃ¡vel: O escopo Ã© bem definido â preencher e manter a RTM atualizada. <br> Pequena: Limitada Ã  criaÃ§Ã£o e manutenÃ§Ã£o da matriz de rastreabilidade. <br> TestÃ¡vel: A presenÃ§a e completude das linhas da RTM sÃ£o verificÃ¡veis objetivamente. |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

# <a name="c3"></a>3. Projeto da AplicaÃ§Ã£o Web (sprints 1 a 5)

## 3.1. Requisitos do Sistema (sprints 1 a 5)

Esta seÃ§Ã£o apresenta os requisitos funcionais, regras de negÃ³cio e requisitos nÃ£o funcionais do sistema. Eles definem o comportamento esperado da aplicaÃ§Ã£o, suas restriÃ§Ãµes e critÃ©rios de qualidade, servindo como base para implementaÃ§Ã£o e validaÃ§Ã£o ao longo das sprints.

### 3.1.1. Requisitos Funcionais (sprint 1, refinar atÃ© sprint 5)

O Quadro 19 contempla os requisitos funcionais do sistema, evidenciando as aÃ§Ãµes e comportamentos que o sistema deve apresentar para cumprir seus objetivos.

<div align="center">
  <sub>Quadro 19 - Requisitos Funcionais </sub>
</div>

| ID    | DescriÃ§Ã£o                                                                                                                                                             | Prioridade | Status    |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------- |
| RF001 | O sistema deve permitir a criaÃ§Ã£o de uma sala administrativa vinculada a uma competiÃ§Ã£o                                                  | Alta       | ConcluÃ­do |
| RF002 | O sistema deve permitir o cadastro de uma competiÃ§Ã£o contendo nome, data e local                                                                           | Alta       | ConcluÃ­do |
| RF003 | O sistema deve permitir o cadastro, ediÃ§Ã£o e exclusÃ£o de equipes, com suporte para atÃ© 16 atletas por equipe                                                          | Alta       | ConcluÃ­do |
| RF004 | O sistema deve permitir acesso Ã  Ã¡rea administrativa por meio de URLs identificadas por UUID Ãºnico e senha da sala                                | Alta       | Em progresso |
| RF005 | O sistema deve capturar automaticamente dados do painel da esteira a partir de imagens fotografadas utilizando OCR. | Alta       | Em progresso |
| RF006 | O sistema deve disponibilizar os dados capturados via API para validaÃ§Ã£o antes de serem persistidos.                                | Alta       | Em progresso |
| RF007 | O sistema deve permitir a ediÃ§Ã£o manual dos dados capturados via OCR antes da confirmaÃ§Ã£o do checkpoint                                                               | Alta       | Em progresso |
| RF008 | O sistema deve registrar checkpoints contendo distÃ¢ncia, pace, velocidade e tempo total somente apÃ³s validaÃ§Ã£o do usuÃ¡rio                                             | Alta       | ConcluÃ­do |
| RF009 | O sistema deve identificar inconsistÃªncias nos dados capturados via OCR e sinalizar ao usuÃ¡rio antes da validaÃ§Ã£o                                                     | MÃ©dia      | Em progresso |
| RF010 | O sistema deve atualizar automaticamente o ranking das equipes no painel administrativo em intervalos mÃ¡ximos de 5 minutos durante a competiÃ§Ã£o                                                        | MÃ©dia      | ConcluÃ­do |
| RF011 | O sistema deve exibir o atleta em execuÃ§Ã£o e o prÃ³ximo atleta escalado por equipe no painel administrativo                                                            | Baixa      | Em progresso |
| RF012 | O sistema deve permitir o encerramento da competiÃ§Ã£o pelo usuÃ¡rio, bloqueando novos registros de checkpoints                                                          | Alta       | ConcluÃ­do |
| RF013 | O sistema deve exportar os dados da competiÃ§Ã£o em formato CSV, incluindo checkpoints, timestamps e logs de validaÃ§Ã£o                                                  | Alta       | ConcluÃ­do |
| RF014 | O sistema deve gerar automaticamente ao final da competiÃ§Ã£o relatÃ³rios e highlights de desempenho por atleta, equipe e geral                                          | Baixa      | Planejado |
| RF015 | O sistema deve atualizar periodicamente o ranking exibido no painel pÃºblico das equipes em intervalos mÃ¡ximos de 1 hora                                                   | MÃ©dia      | ConcluÃ­do |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

### 3.1.1.1 CritÃ©rios de Aceite dos Requisitos Funcionais

| RF    | CritÃ©rio de Aceite                                                                                                                                                                    |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RF001 | Dado que o usuÃ¡rio informe os dados da competiÃ§Ã£o, quando a operaÃ§Ã£o for confirmada, entÃ£o a competiÃ§Ã£o deve ser criada e persistida no banco de dados.                                |
| RF002 | Dado que o usuÃ¡rio informe nome, data e local vÃ¡lidos, quando a operaÃ§Ã£o for confirmada, entÃ£o a competiÃ§Ã£o deve ser registrada no sistema. |
| RF003 | Dado que o usuÃ¡rio realize o cadastro de uma equipe, quando os dados forem confirmados, entÃ£o o sistema deve permitir registrar atÃ© 16 atletas vinculados Ã  equipe. |
| RF004 | Dado que o operador possua credenciais de administrador vÃ¡lidas, quando acessar a Ã¡rea administrativa, entÃ£o o sistema deve permitir acesso Ã s funcionalidades operacionais. |
| RF005 | Dado que o operador envie uma imagem vÃ¡lida da esteira, quando o OCR for executado, entÃ£o o sistema deve retornar distÃ¢ncia, pace, velocidade e tempo em atÃ© 3 segundos.              |
| RF006 | Dado que os dados sejam extraÃ­dos via OCR, quando o processamento for concluÃ­do, entÃ£o o sistema deve disponibilizar os dados para validaÃ§Ã£o antes da persistÃªncia. |
| RF007 | Dado que os dados extraÃ­dos via OCR sejam exibidos, quando o operador editar os campos e confirmar, entÃ£o o sistema deve registrar os dados corrigidos no checkpoint.                 |
| RF008 | Dado que os dados do checkpoint estejam validados, quando o usuÃ¡rio confirmar o registro, entÃ£o o sistema deve persistir ao menos a distÃ¢ncia (km) no banco de dados. |
| RF009 | Dado que o sistema identifique inconsistÃªncias nos dados extraÃ­dos, quando o OCR finalizar o processamento, entÃ£o o sistema deve sinalizar os campos divergentes ao usuÃ¡rio. |
| RF010 | Dado que existam novos checkpoints validados, quando o intervalo mÃ¡ximo de atualizaÃ§Ã£o do painel administrativo for atingido, entÃ£o o sistema deve atualizar automaticamente o ranking das equipes.                                          |
| RF011 | Dado que exista escalaÃ§Ã£o cadastrada para a equipe, quando o painel administrativo for atualizado, entÃ£o o sistema deve exibir o atleta em corrida e o prÃ³ximo atleta previsto. |
| RF012 | Dado que a competiÃ§Ã£o seja encerrada, quando o usuÃ¡rio confirmar a operaÃ§Ã£o, entÃ£o o sistema deve bloquear novos registros de checkpoints.                                            |
| RF013 | Dado que o usuÃ¡rio solicite exportaÃ§Ã£o, quando a operaÃ§Ã£o for executada, entÃ£o o sistema deve gerar um arquivo CSV contendo checkpoints, timestamps e logs de validaÃ§Ã£o.                 |
| RF014 |	Dado que a competiÃ§Ã£o seja encerrada, quando o processamento final for executado, entÃ£o o sistema deve gerar relatÃ³rios e highlights de desempenho por atleta, equipe e geral.  |
| RF015	| Dado que existam novos checkpoints consolidados, quando o intervalo mÃ¡ximo de atualizaÃ§Ã£o do painel pÃºblico for atingido, entÃ£o o sistema deve atualizar o ranking exibido Ã s equipes.  |


### 3.1.2. Regras de NegÃ³cio (sprint 1, refinar atÃ© sprint 5)

No Quadro 20, sÃ£o apresentadas as regras de negÃ³cio do sistema, as quais definem as  restriÃ§Ãµes e condiÃ§Ãµes que orientam o funcionamento e o comportamento das funcionalidades ao longo do desenvolvimento.

<div align="center">
  <sub>Quadro 20 - Regras de NegÃ³cio </sub>
</div>

| ID   | DescriÃ§Ã£o                                                                                                                                                                                                                         | RF associado       |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| RN01 | Ao salvar uma equipe, o sistema deve gerar automaticamente um UUID Ãºnico e criar um link pÃºblico acessÃ­vel sem autenticaÃ§Ã£o.                                                                                                      | RF003, RF001       |
| RN02 | O UUID gerado deve permanecer vÃ¡lido enquanto o evento estiver ativo e expirar automaticamente ao tÃ©rmino do evento.                                                                                                              | RF001, RF004       |
| RN03 | O acesso ao painel administrativo deve exigir autenticaÃ§Ã£o via senha do administrador.                                                                                                 | RF001, RF004       |
| RN04 | O registro de checkpoint deve exigir obrigatoriamente a distÃ¢ncia (km), enquanto campos como pace e tempo podem ser capturados via OCR ou informados opcionalmente.                                                                             | RF008              |
| RN05 | Todo checkpoint registrado deve incluir no log de auditoria o mÃ©todo de entrada utilizado (OCR ou manual).                                                                                                                        | RF005, RF007, RF008|
| RN06 | Valores extraÃ­dos via OCR que divergirem da mÃ©dia histÃ³rica do atleta ou da meta da prova devem ser destacados e exigir confirmaÃ§Ã£o ou correÃ§Ã£o manual antes do salvamento.                                                       | RF009, RF007       |
| RN07 | O sistema deve suportar os papÃ©is de "corredor" e "capitÃ£o" para os atletas, garantindo que a estrutura da equipe seja respeitada conforme o cadastro.                               | RF003, RF011       |
| RN08 | A calculadora de descanso deve utilizar o pace da Ãºltima corrida, a duraÃ§Ã£o do Ãºltimo turno e os parÃ¢metros do evento, classificando o resultado em categorias (verde, amarelo ou vermelho).                                      | RF011              |
| RN09 | O ranking exibido no painel da equipe deve ser atualizado a cada 1 hora, enquanto o painel administrativo deve atualizar o leaderboard a cada novo checkpoint registrado.                                                         | RF010, RF015       |
| RN10 | O painel administrativo deve exibir automaticamente o atleta atualmente em corrida e o prÃ³ximo atleta previsto, sem necessidade de atualizaÃ§Ã£o manual.                                                                            | RF011              |
| RN11 | O painel administrativo deve recalcular automaticamente mÃ©tricas operacionais, incluindo pace mÃ©dio e distÃ¢ncia acumulada, a cada 5 minutos. | RF010 |
| RN12 | EdiÃ§Ãµes retroativas em checkpoints devem registrar obrigatoriamente no log de auditoria o usuÃ¡rio responsÃ¡vel pela alteraÃ§Ã£o e o motivo informado.                                                                                | RF007, RF008       |
| RN13 | O link de compartilhamento gerado pela equipe deve conter apenas o leaderboard simplificado do geral das equipes, sem expor dados individuais que ofereÃ§am vantagens aos concorrentes. | RF001, RF010       |
| RN14 | O encerramento do evento deve ser permitido apenas a um administrador e deve bloquear novos registros de checkpoint apÃ³s sua execuÃ§Ã£o.                                                                                      | RF012              |
| RN15 | A exportaÃ§Ã£o em CSV deve incluir todos os checkpoints com timestamps e logs de validaÃ§Ã£o para auditoria.                                                                                         | RF013              |
| RN16 | Os highlights pÃ³s-evento devem ser gerados automaticamente ao encerrar a competiÃ§Ã£o, sem necessidade de configuraÃ§Ã£o manual.                                                                                                      | RF012, RF014       |
| RN17 | Os highlights devem incluir recordes nas categorias: individual (pace, velocidade, distÃ¢ncia, tempo total), por equipe (consistÃªncia, volume, sincronismo de troca) e geral da ediÃ§Ã£o.                                            | RF014              |
| RN18 | O cadastro da competiÃ§Ã£o deve exigir obrigatoriamente nome, data e local vÃ¡lidos. | RF002 |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

### 3.1.3. Requisitos NÃ£o Funcionais â 8 Eixos ISO/IEC 25010 (sprints 1 a 5)

Os requisitos nÃ£o funcionais apresentados no Quadro 21 definem os atributos de qualidade, restriÃ§Ãµes e critÃ©rios tÃ©cnicos considerados ao longo do desenvolvimento da soluÃ§Ã£o proposta para o evento Red Bull 24 Horas. Esses requisitos foram derivados tanto das restriÃ§Ãµes operacionais identificadas junto ao parceiro quanto dos requisitos funcionais priorizados pela equipe, sendo estruturados com base nos eixos de qualidade da ISO/IEC 25010. Dessa forma, os RNFs estabelecem critÃ©rios relacionados Ã  usabilidade, confiabilidade, desempenho, seguranÃ§a, capacidade, suportabilidade e organizaÃ§Ã£o do sistema, garantindo alinhamento entre as necessidades operacionais da competiÃ§Ã£o e as decisÃµes tÃ©cnicas adotadas pela equipe.

<div align="center">
  <sub>Quadro 21 - Requisitos NÃ£o Funcionais </sub>
</div>

| Eixo                        | Requisito                                                                                                | MÃ©trica / CritÃ©rio                                   | Como atendido                                      |
| --------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------- |
| USAB â Usabilidade          | O sistema deve permitir execuÃ§Ã£o das funÃ§Ãµes principais sem treinamento extensivo                        | â¥ 80% dos usuÃ¡rios concluem tarefas em atÃ© 5 minutos | Testes de usabilidade com usuÃ¡rios representativos |
| CONF â Confiabilidade       | O sistema deve manter consistÃªncia entre captura OCR, validaÃ§Ã£o humana e persistÃªncia dos checkpoints | Taxa de inconsistÃªncia inferior a 1% entre dados capturados e dados persistidos durante a competiÃ§Ã£o | Logs de validaÃ§Ã£o, testes automatizados e conferÃªncia entre OCR e registro persistido  |
| DES â Desempenho | O sistema deve atualizar o painel administrativo periodicamente durante a competiÃ§Ã£o | AtualizaÃ§Ã£o concluÃ­da em atÃ© 5 minutos apÃ³s novos checkpoints | Testes de performance no fluxo completo |
| SUP â Suportabilidade | O sistema deve permitir manutenÃ§Ã£o sem interromper competiÃ§Ãµes | CorreÃ§Ãµes crÃ­ticas aplicadas em atÃ© 15 minutos sem perda de checkpoints | Estrutura modular e separaÃ§Ã£o em camadas |
| SEG â SeguranÃ§a             | O sistema deve restringir o acesso administrativo por meio de senha de administradores cadastrados  | 100% das tentativas sem credenciais vÃ¡lidas devem ser bloqueadas com resposta HTTP 401 | ValidaÃ§Ã£o de credenciais no backend antes do acesso Ã s rotas administrativas |
| CAP â Capacidade            | O sistema deve suportar mÃºltiplos usuÃ¡rios simultÃ¢neos durante a competiÃ§Ã£o                              | â¥ 100 usuÃ¡rios simultÃ¢neos estÃ¡veis                  | Testes de carga                                    |
| REST â RestriÃ§Ãµes de Design | O sistema deve operar com validaÃ§Ã£o humana e processamento via API centralizada         | 100% dos checkpoints persistidos devem conter vÃ­nculo com corredor, competiÃ§Ã£o, esteira e administrador responsÃ¡vel | Modelagem relacional com campos obrigatÃ³rios, FKs e validaÃ§Ã£o via API |
| ORG â Organizacionais | O desenvolvimento deve seguir metodologia Ã¡gil com rastreabilidade entre tarefas, commits e entregas | 100% das entregas devem possuir registro em commits, branches e tarefas versionadas | 100% das entregas devem possuir registro em commits, branches e tarefas versionadas|

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

**3.1.3.1 DerivaÃ§Ã£o dos RNFs a partir do contexto do parceiro**

O eixo de Usabilidade (USAB) foi definido considerando que os operadores atuam sob alta pressÃ£o operacional durante 24 horas contÃ­nuas, exigindo que as principais funcionalidades do sistema sejam executadas rapidamente e sem necessidade de treinamento extensivo. Esse requisito se relaciona principalmente aos RFs de registro e validaÃ§Ã£o de checkpoints.

O eixo de Confiabilidade (CONF) foi derivado da necessidade de reduzir inconsistÃªncias presentes no processo manual atual. Como a apuraÃ§Ã£o da competiÃ§Ã£o depende diretamente da precisÃ£o dos checkpoints registrados, foi estabelecida uma taxa mÃ¡xima de falha inferior a 1% no processamento dos dados via OCR e validaÃ§Ã£o.

O eixo de Desempenho (DES) estÃ¡ relacionado Ã  necessidade de atualizaÃ§Ã£o frequente dos rankings administrativos durante a competiÃ§Ã£o, permitindo acompanhamento contÃ­nuo da operaÃ§Ã£o sem atrasos perceptÃ­veis aos operadores.

O eixo de Suportabilidade (SUP) foi definido considerando a necessidade de continuidade operacional durante o evento. Como a competiÃ§Ã£o ocorre ininterruptamente por 24 horas, eventuais correÃ§Ãµes crÃ­ticas nÃ£o podem comprometer o registro dos checkpoints jÃ¡ realizados.

O eixo de SeguranÃ§a (SEG) deriva da necessidade de restringir o acesso Ã s Ã¡reas administrativas do sistema apenas aos operadores autorizados pelo evento, protegendo os dados operacionais e evitando alteraÃ§Ãµes indevidas nos registros da competiÃ§Ã£o.

O eixo de Capacidade (CAP) foi estabelecido considerando o acesso simultÃ¢neo de operadores, organizadores e usuÃ¡rios acompanhando os rankings pÃºblicos durante perÃ­odos de pico da competiÃ§Ã£o, exigindo estabilidade da aplicaÃ§Ã£o mesmo sob mÃºltiplas requisiÃ§Ãµes concorrentes.

O eixo de RestriÃ§Ãµes de Design (REST) foi derivado diretamente da arquitetura definida para o projeto, baseada em captura via OCR, validaÃ§Ã£o humana e processamento centralizado via API, garantindo padronizaÃ§Ã£o do fluxo de dados.

Por fim, o eixo Organizacional (ORG) estÃ¡ relacionado ao modelo de desenvolvimento adotado pelo grupo e Ã s exigÃªncias acadÃªmicas do projeto, garantindo rastreabilidade, versionamento e controle das entregas realizadas ao longo das sprints.

### 3.1.4. Matriz RF â RN â Endpoint (sprints 3 a 5)

Os endpoints foram definidos seguindo as boas prÃ¡ticas de design de APIs RESTful descritas pela Microsoft Azure Architecture Center, que recomenda o uso de substantivos no plural para nomear recursos, hierarquia de URIs para expressar relaÃ§Ãµes entre entidades e verbos HTTP como Ãºnica forma de expressar a aÃ§Ã£o sobre o recurso (Microsoft, 2023). Dessa forma, cada linha da matriz conecta um requisito funcional Ã s regras de negÃ³cio que o governam e ao contrato HTTP que o implementa.

<div align="center">

  <sub>Quadro 22 - Matriz RF â RN â Endpoint</sub>

</div>

| RF    | RN associadas       | Endpoint                                                      | MÃ©todo |
| ----- | ------------------- | ------------------------------------------------------------- | ------ |
| RF001 | RN03                | `/competitions`                                               | POST   |
| RF002 | RN18                | `/competitions`                                               | POST   |
| RF002 | RN18                | `/competitions`                                               | GET    |
| RF002 | RN18                | `/competitions/:id`                                           | GET    |
| RF002 | RN18                | `/competitions/:id`                                           | PUT    |
| RF012 | RN14                | `/competitions/:id`                                           | PATCH  |
| RF002 | RN18                | `/competitions/:id`                                           | DELETE |
| RF003 | RN01, RN07          | `/competitions/:id/teams`                                     | POST   |
| RF003 | RN01, RN07          | `/competitions/:id/teams`                                     | GET    |
| RF003 | RN01, RN07          | `/competitions/:id/teams/:teamId`                             | GET    |
| RF003 | RN01, RN07          | `/competitions/:id/teams/:teamId`                             | PUT    |
| RF003 | RN01, RN07          | `/competitions/:id/teams/:teamId`                             | DELETE |
| RF003 | RN01                | `/competitions/:id/teams/:teamId/athletes`                    | POST   |
| RF011 | RN07, RN10          | `/competitions/:id/teams/:teamId/athletes`                    | GET    |
| RF003 | RN01                | `/competitions/:id/teams/:teamId/athletes/:athleteId`         | GET    |
| RF003 | RN01                | `/competitions/:id/teams/:teamId/athletes/:athleteId`         | PUT    |
| RF003 | RN01                | `/competitions/:id/teams/:teamId/athletes/:athleteId`         | DELETE |
| RF004 | RN02, RN03          | `/auth/sessions`                                              | POST   |
| RF005 | RN06                | `/ocr/extractions`                                            | POST   |
| RF006 | RN04, RN05          | `/ocr/extractions`                                            | POST   |
| RF007 | RN06, RN12          | `/ocr/extractions/:extractionId`                              | PATCH  |
| RF008 | RN04, RN05          | `/checkpoints`                                                | POST   |
| RF008 | RN04, RN05          | `/checkpoints`                                                | GET    |
| RF008 | RN04, RN05          | `/checkpoints/:id`                                            | GET    |
| RF007 | RN06, RN12          | `/checkpoints/:id`                                            | PUT    |
| RF008 | RN04, RN05          | `/checkpoints/:id`                                            | DELETE |
| RF008 | RN04, RN05          | `/corredores/:corredorId/checkpoints`                         | GET    |
| RF008 | RN04, RN05          | `/competitions/:id/checkpoints`                               | GET    |
| RF009 | RN06                | `/competitions/:id/checkpoints/inconsistencies`               | GET    |
| RF010 | RN09, RN11          | `/competitions/:id/ranking/teams`                             | GET    |
| RF015 | RN09, RN11          | `/competitions/:id/ranking/athletes`                          | GET    |
| RF013 | RN15                | `/competitions/:id/export`                                    | GET    |
| RF014 | RN16, RN17          | `/competitions/:id/reports`                                   | GET    |
| RF004 | RN02, RN03          | `/administradores`                                            | GET    |
| RF004 | RN02, RN03          | `/administradores/:id`                                        | GET    |
| RF004 | RN02, RN03          | `/administradores`                                            | POST   |
| RF004 | RN02, RN03          | `/administradores/:id`                                        | PUT    |
| RF004 | RN02, RN03          | `/administradores/:id`                                        | DELETE |

<div align="center">

  <sup>Fonte: Elaborado pelos autores (2026).</sup>

</div>

## 3.2. Arquitetura (sprints 1 a 5)

### 3.2.1 Arquitetura em Camadas

#### 3.2.3.1 Diagrama de Classes Arquitetural

O Diagrama de Classes Arquitetural Ã© uma das representaÃ§Ãµes da UML (Unified Modeling Language) que apresenta, em nÃ­vel de projeto, as principais classes do sistema, seus atributos, mÃ©todos e os relacionamentos entre elas. Diferentemente do diagrama de classes de domÃ­nio, voltado Ã  modelagem conceitual do negÃ³cio, o diagrama arquitetural reflete diretamente a estrutura do cÃ³digo-fonte, evidenciando como as responsabilidades sÃ£o distribuÃ­das entre as camadas da aplicaÃ§Ã£o e como os componentes se comunicam entre si.

No projeto em questÃ£o, a arquitetura adotada segue o padrÃ£o em trÃªs camadas: Controller, Service e Repository, amplamente utilizado em aplicaÃ§Ãµes back-end por promover separaÃ§Ã£o de responsabilidades, facilitar a manutenÃ§Ã£o e viabilizar a testabilidade independente de cada camada. A camada Controller Ã© responsÃ¡vel por receber as requisiÃ§Ãµes HTTP e delegar o processamento para a camada de serviÃ§o. JÃ¡ a camada Service concentra as regras de negÃ³cio da aplicaÃ§Ã£o. AlÃ©m disso, a camada Repository abstrai o acesso ao banco de dados, expondo mÃ©todos padronizados de consulta e persistÃªncia.

O diagrama Ã© composto pelos seguintes mÃ³dulos principais: Administrador, AutenticaÃ§Ã£o (Auth), CompetiÃ§Ã£o, Corredor, Checkpoint, Esteira, Equipe, Ranking e OCR. A maior parte desses mÃ³dulos segue a estrutura de trÃªs camadas apresentada anteriormente. Alguns serviÃ§os, no entanto, fogem a essa regra por terem uma funÃ§Ã£o de suporte geral Ã  aplicaÃ§Ã£o, sendo o caso do AuthService, do ValidacaoService e do OCRService, que sÃ£o utilizados por diferentes partes do sistema. AlÃ©m disso, o diagrama tambÃ©m apresenta interfaces de modelo (como CompeticaoModel, EquipeModel, CorredorModel, CheckpointModel e EsteiraModel), cuja funÃ§Ã£o Ã© validar os dados recebidos pela aplicaÃ§Ã£o antes de serem processados, evitando inconsistÃªncias.

As dependÃªncias entre as classes sÃ£o representadas por setas tracejadas, indicando uso ou associaÃ§Ã£o. Destaca-se a dependÃªncia do CheckpointService com os serviÃ§os CorredorService, EsteiraService, ValidacaoService e OCRService, refletindo a centralidade da lÃ³gica de registro de checkpoints no fluxo operacional da competiÃ§Ã£o. O RankingService, por sua vez, depende do CheckpointService e do EquipeService para calcular posiÃ§Ãµes, pace mÃ©dio e gerar o ranking das equipes em tempo real.

<div align="center">
  <sub>Figura 8 - Diagrama de Classes Arquitetural</sub><br>
  <img src="../assets/programacao/Diagrama de Classes Arquitetural.drawio.png" width="100%" alt="Diagrama de Classes Arquitetural do Projeto em AnÃ¡lise"><br>
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>


### 3.2.1. Arquitetura em Camadas

O padrÃ£o de Arquitetura em Camadas organiza um sistema de software em estratos horizontais com responsabilidades exclusivas, nos quais cada camada se comunica apenas com a camada imediatamente adjacente. Bass, Clements e Kazman (2012) descrevem esse padrÃ£o como uma das tÃ¡ticas arquiteturais mais eficazes para controlar o acoplamento entre mÃ³dulos, pois cada estrato expÃµe somente a interface necessÃ¡ria para a camada superior e desconhece completamente a implementaÃ§Ã£o da camada inferior. Fowler (2002) formaliza essa separaÃ§Ã£o no contexto de aplicaÃ§Ãµes empresariais sob o princÃ­pio de *separation of concerns*, que determina que cada unidade de software deve ter uma Ãºnica razÃ£o para mudar.

A nossa equipe optou por essa abordagem no sistema de gerenciamento da competiÃ§Ã£o Red Bull 24 horas em decorrÃªncia de dois requisitos estruturais identificados durante a fase de anÃ¡lise: a necessidade de suportar fluxos de interaÃ§Ã£o radicalmente distintos, um fluxo administrativo operado por juÃ­zes e supervisores via dispositivos iPad e um fluxo pÃºblico acessado por corredores mediante URL personalizada com identificador UUID, e a presenÃ§a de um processo assÃ­ncrono de reconhecimento Ã³ptico de caracteres (OCR) que nÃ£o deveria bloquear o fluxo transacional principal. A Arquitetura em Camadas permitiu isolar esses contextos sem duplicar a lÃ³gica de domÃ­nio e sem criar dependÃªncias cruzadas entre os fluxos.

A arquitetura adotada Ã© composta pelas camadas **Routes**, **Controller**, **Service**, **Repository**, **Model** e **PostgreSQL**. O fluxo de persistÃªncia ocorre por meio da sequÃªncia **Routes â Controller â Service â Repository â PostgreSQL**, enquanto os Models atuam como contratos de dados compartilhados entre as camadas de Service e Repository.

**Fluxo Principal de Dados**

Toda requisiÃ§Ã£o originada no cliente, seja proveniente do painel administrativo no iPad ou do portal pÃºblico acessado pelo corredor via navegador, percorre as seguintes camadas em sequÃªncia:

**Routes** Ã© a camada de entrada do servidor Express. Define os endpoints da API REST, associa verbos HTTP (`GET`, `POST`, `PUT`, `DELETE`) aos controladores correspondentes e executa middlewares de validaÃ§Ã£o de esquema de entrada antes de encaminhar a requisiÃ§Ã£o ao Controller. Nenhuma lÃ³gica de domÃ­nio reside nessa camada.

**Controller** recebe o objeto de requisiÃ§Ã£o (`req`) e resposta (`res`) do framework Express, extrai os parÃ¢metros necessÃ¡rios, corpo da requisiÃ§Ã£o, parÃ¢metros de rota, query strings e cabeÃ§alhos, e delega ao mÃ©todo correspondente na camada de Service, retornando a resposta HTTP ao cliente com o cÃ³digo de status adequado. O Controller nÃ£o toma decisÃµes de negÃ³cio; sua responsabilidade se limita a orquestrar o ciclo de vida da requisiÃ§Ã£o HTTP.

**Service** concentra todas as regras de negÃ³cio da aplicaÃ§Ã£o. Ã nessa camada que sÃ£o realizadas validaÃ§Ãµes de domÃ­nio, composiÃ§Ãµes de dados provenientes de mÃºltiplos repositÃ³rios, cÃ¡lculos de ranking, verificaÃ§Ãµes de regras temporais da competiÃ§Ã£o e geraÃ§Ã£o de registros de auditoria. O Service nÃ£o conhece o protocolo HTTP e nÃ£o executa queries SQL; toda persistÃªncia Ã© delegada Ã  camada de Repository.

**Repository** abstrai o acesso ao banco de dados PostgreSQL por meio de queries SQL parametrizadas. Recebe e retorna instÃ¢ncias de Model, isolando as camadas superiores de quaisquer detalhes de implementaÃ§Ã£o do mecanismo de persistÃªncia. Essa abstraÃ§Ã£o viabiliza a substituiÃ§Ã£o do banco de dados ou a utilizaÃ§Ã£o de dublÃªs de teste (*mocks*) sem alteraÃ§Ã£o nas camadas de Service ou Controller.

**Model** define a estrutura de dados das entidades de domÃ­nio da aplicaÃ§Ã£o: `Competicao`, `Equipe`, `Corredor`, `Checkpoint` e `Administrador`. Os Models nÃ£o contÃªm lÃ³gica de persistÃªncia nem de negÃ³cio; representam o esquema de dados esperado e funcionam como contrato entre as camadas de Repository e Service.

**PostgreSQL** Ã© a camada de persistÃªncia definitiva, acessada pela aplicaÃ§Ã£o via cliente Supabase (`src/database/supabaseClient.ts`). Recebe conexÃµes exclusivamente da camada de Repository, o que garante que nenhuma outra camada detenha acesso direto ao banco de dados. O esquema relacional Ã© gerenciado por arquivos de migraÃ§Ã£o versionados localizados em `documentos/outros/migrations/` (arquivos `0000__extensions.sql` a `0006_create_checkpoint.sql`), assegurando rastreabilidade e reprodutibilidade do ambiente de dados.

**Fluxo OCR AssÃ­ncrono** *(funcionalidade planejada)*

O processamento de imagens capturadas pelos funcionÃ¡rios da Red Bull 24h constitui um fluxo assÃ­ncrono paralelo ao fluxo transacional principal, planejado para implementaÃ§Ã£o futura. Ao receber uma imagem via requisiÃ§Ã£o `POST /ocr/extractions`, o `CheckpointController` delegarÃ¡ imediatamente ao `OCRService` a responsabilidade de enfileirar o processamento, retornando ao cliente uma resposta `202 Accepted` com identificador de rastreamento. O `OCRService` encaminharÃ¡ a imagem ao motor de reconhecimento Ã³ptico de caracteres externo de forma nÃ£o bloqueante. ApÃ³s a extraÃ§Ã£o dos dados, o `OCRService` validarÃ¡ o score de confianÃ§a conforme RN06, extraÃ§Ãµes com score abaixo de 85% serÃ£o rejeitadas, e acionarÃ¡ o `CheckpointService`, que validarÃ¡ os dados extraÃ­dos segundo as demais regras de negÃ³cio vigentes (RN04, RN05, RN12) e persistirÃ¡ o resultado via `CheckpointRepository`. Registros de auditoria serÃ£o gerados pelo `AuditService` ao longo de todo o fluxo, em conformidade com a RN05.

Esse desenho evita que a latÃªncia do motor OCR impacte a resposta percebida pelos operadores no iPad, mantendo a experiÃªncia administrativa fluida durante picos de carga gerados por mÃºltiplos checkpoints simultÃ¢neos.

#### Tabela de Responsabilidades

<div align="center">
  <sub>Quadro 23 - Responsabilidades das Camadas</sub>
</div>

| Camada | Responsabilidade | O que nÃ£o faz | Pasta do projeto |
|---|---|---|---|
| **Routes** | Define endpoints REST, associa verbos HTTP a controllers, executa middlewares de validaÃ§Ã£o de esquema de entrada. | NÃ£o contÃ©m lÃ³gica de negÃ³cio; nÃ£o acessa banco de dados; nÃ£o formata respostas de domÃ­nio. | `src/routes/` |
| **Controller** | Extrai parÃ¢metros de `req` (body, params, query, headers), delega ao Service correspondente e retorna resposta HTTP com status code adequado. | NÃ£o implementa regras de negÃ³cio; nÃ£o acessa banco de dados; nÃ£o executa queries SQL. | `src/controllers/` |
| **Service** | Implementa todas as regras de negÃ³cio do domÃ­nio da competiÃ§Ã£o Red Bull 24h, orquestra chamadas a mÃºltiplos repositÃ³rios, valida integridade de dados e encaminha processamento assÃ­ncrono de OCR. | NÃ£o conhece o protocolo HTTP; nÃ£o executa queries SQL diretamente; nÃ£o manipula `req` ou `res`. | `src/services/` |
| **Repository** | Executa queries SQL parametrizadas contra o PostgreSQL via cliente Supabase, mapeia resultados de banco para instÃ¢ncias de Model e persiste alteraÃ§Ãµes de estado das entidades de domÃ­nio. | NÃ£o implementa regras de negÃ³cio; nÃ£o conhece o protocolo HTTP; nÃ£o Ã© chamado diretamente pelo Controller. | `src/repositories/` |
| **Model** | Define a estrutura de dados das entidades de domÃ­nio (`Competicao`, `Equipe`, `Corredor`, `Checkpoint`, `Administrador`) como contratos de dados entre camadas. | NÃ£o contÃ©m lÃ³gica de persistÃªncia; nÃ£o contÃ©m lÃ³gica de negÃ³cio; nÃ£o realiza validaÃ§Ãµes de entrada. | `src/models/` |
| **PostgreSQL** | Armazena e recupera dados de forma persistente, garante integridade referencial por meio de constraints de chave estrangeira e executa transaÃ§Ãµes ACID. | NÃ£o recebe conexÃµes de nenhuma camada alÃ©m do Repository; nÃ£o aplica regras de negÃ³cio. | `src/database/` Â· `documentos/outros/migrations/` |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

---

#### Tabela de Rastreabilidade

<div align="center">
  <sub>Quadro 24 - Tabela de Rastreabilidade da Arquitetura em Camadas</sub>
</div>

| Camada         | Classe                  | Responsabilidade no projeto                                                                                                                                                                                             | RFs / RNs                    |
| -------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| **Controller** | `CompetitionController` | Recebe `POST /competitions` e delega ao `CompetitionService` para criaÃ§Ã£o de competiÃ§Ã£o; recebe `GET /competitions/:id` e delega ao `CompetitionService` para consulta de estado.                                       | RF02, RF12                   |
| **Controller** | `TeamController`        | Recebe `POST /competitions/:competicaoId/teams` e delega ao `TeamService` para criaÃ§Ã£o de equipe com geraÃ§Ã£o de UUID e QR Code; recebe `GET /competitions/:competicaoId/teams` e delega ao `TeamService` para listagem. | RF03, RF01, RN01             |
| **Controller** | `AthleteController`     | Recebe `POST /athletes` e delega ao `AthleteService` para cadastro de corredor; recebe `GET /athletes/:id` e delega ao `AthleteService` para recuperaÃ§Ã£o de dados individuais.                                          | RF01                         |
| **Controller** | `UserController`        | Recebe `POST /users` e delega ao `UserService` para criaÃ§Ã£o de usuÃ¡rio administrativo; recebe `POST /users/login` e delega ao `UserService` para validaÃ§Ã£o de acesso.                                                   | RF04                         |
| **Controller** | `CheckpointController`  | Recebe `POST /checkpoints` e delega ao `CheckpointService` para registro manual de passagem; recebe `POST /ocr/extractions` e delega ao `OCRService` para processamento assÃ­ncrono de OCR.                              | RF05, RF07, RF08, RF09       |
| **Controller** | `AuthController`        | Recebe `POST /auth/login` e delega ao `AuthService` para validaÃ§Ã£o de credenciais e emissÃ£o de JWT; recebe `POST /auth/logout` e delega ao `AuthService` para encerramento de sessÃ£o.                                   | RF04, RN03                   |
| **Service**    | `CompetitionService`    | Cria competiÃ§Ãµes, valida regras de perÃ­odo e estado da competiÃ§Ã£o e coordena operaÃ§Ãµes por meio do `CompetitionRepository`.                                                                                             | RF02, RF12, RN02             |
| **Service**    | `TeamService`           | Cria equipes, gera UUID e QR Code de identificaÃ§Ã£o e valida unicidade do nome da equipe dentro da competiÃ§Ã£o.                                                                                                           | RF01, RF03, RN01             |
| **Service**    | `AthleteService`        | Cadastra corredores, valida dados obrigatÃ³rios e garante integridade das informaÃ§Ãµes dos participantes.                                                                                                                 | RF01                         |
| **Service**    | `UserService`           | Valida credenciais de acesso administrativo e gerencia criaÃ§Ã£o de usuÃ¡rios autorizados.                                                                                                                                 | RF04                         |
| **Service**    | `OCRService`            | Encaminha imagens para processamento OCR assÃ­ncrono, valida score mÃ­nimo de confianÃ§a e aciona o `CheckpointService` para persistÃªncia dos resultados vÃ¡lidos.                                                          | RF05, RF06, RF09, RN05, RN06 |
| **Service**    | `CheckpointService`     | Valida pertencimento do corredor Ã  equipe, aplica regras temporais da competiÃ§Ã£o, registra checkpoints e aciona mecanismos de auditoria.                                                                                | RF08, RN04, RN05, RN12       |
| **Service**    | `RankingService`        | Calcula ranking em tempo real a partir dos checkpoints registrados, aplicando critÃ©rios de desempate definidos pelas regras de negÃ³cio.                                                                                 | RF10, RF15, RN09, RN11       |
| **Service**    | `AuditService`          | Registra logs imutÃ¡veis das operaÃ§Ãµes crÃ­ticas executadas no sistema para garantir rastreabilidade e conformidade com auditoria.                                                                                        | RN05                         |
| **Repository** | `CompetitionRepository` | Executa operaÃ§Ãµes de persistÃªncia relacionadas Ã s competiÃ§Ãµes, incluindo criaÃ§Ã£o, consulta e atualizaÃ§Ã£o de estado.                                                                                                     | RF02, RF12                   |
| **Repository** | `TeamRepository`        | Executa operaÃ§Ãµes de persistÃªncia das equipes, incluindo armazenamento de UUID e QR Code e consultas por competiÃ§Ã£o.                                                                                                    | RF01, RF03                   |
| **Repository** | `AthleteRepository`     | Executa operaÃ§Ãµes de persistÃªncia dos corredores, incluindo consultas por identificador e nÃºmero de dorsal.                                                                                                             | RF01                         |
| **Repository** | `UserRepository`        | Executa operaÃ§Ãµes de persistÃªncia relacionadas aos usuÃ¡rios administrativos e consultas para autenticaÃ§Ã£o.                                                                                                              | RF04                         |
| **Repository** | `CheckpointRepository`  | Executa persistÃªncia e recuperaÃ§Ã£o de checkpoints e fornece dados agregados para cÃ¡lculo de rankings.                                                                                                                   | RF05, RF08, RF10             |
| **Repository** | `AuditRepository`       | Executa persistÃªncia dos registros de auditoria produzidos pelo `AuditService`.                                                                                                                                         | RN05                         |
| **Model**      | `Competicao`            | Representa a entidade de competiÃ§Ã£o contendo informaÃ§Ãµes de identificaÃ§Ã£o, perÃ­odo de realizaÃ§Ã£o e estado operacional.                                                                                                  | RF02                         |
| **Model**      | `Equipe`                | Representa a entidade de equipe contendo identificadores pÃºblicos, QR Code e vÃ­nculo com a competiÃ§Ã£o.                                                                                                                  | RF01, RF03                   |
| **Model**      | `Corredor`              | Representa os participantes vinculados Ã s equipes da competiÃ§Ã£o.                                                                                                                                                        | RF01                         |
| **Model**      | `Administrador`         | Representa os usuÃ¡rios autorizados a operar o sistema administrativo da competiÃ§Ã£o.                                                                                                                                     | RF04                         |
| **Model**      | `Checkpoint`            | Representa os registros de passagem utilizados para cÃ¡lculo de desempenho e ranking.                                                                                                                                    | RF05, RF08                   |
| **Model**      | `AuditLog`              | Representa os registros persistidos de auditoria contendo informaÃ§Ãµes sobre operaÃ§Ãµes crÃ­ticas executadas no sistema.                                                                                                   | RN05                         |


<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

---

#### Diagrama da Arquitetura em Camadas

<div align="center">
  <sub>Figura 15 - Diagrama de Arquitetura em Camadas</sub><br>
  <img src="../assets/programacao/diagrama-arquitetura-camadas.svg" width="100%" alt="Diagrama Arquitetura em Camadas"><br>
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

---

#### RevisÃ£o Cruzada da AnÃ¡lise de ConsistÃªncia Arquitetural

A presente seÃ§Ã£o analisa a coerÃªncia entre os artefatos da seÃ§Ã£o 3.2.1, os diagramas de sequÃªncia UML (seÃ§Ã£o 3.2.4), o diagrama de entidade-relacionamento (seÃ§Ã£o 3.6.1) e os arquivos de migraÃ§Ã£o localizados em `documentos/outros/migrations/`, identificando pontos de atenÃ§Ã£o e aÃ§Ãµes necessÃ¡rias.

**Nomenclatura de camadas.** Os nomes `Controller`, `Service`, `Repository` e `Model` sÃ£o utilizados de forma uniforme na seÃ§Ã£o 3.2.1 e nos diagramas de sequÃªncia. A inconsistÃªncia de nomenclatura entre entidades em inglÃªs (`CompetitionController`, `TeamController`) e os Models em portuguÃªs (`Competicao`, `Equipe`) foi mantida intencionalmente para preservar compatibilidade com o cÃ³digo existente, e deve ser padronizada para um Ãºnico idioma no prÃ³ximo ciclo de refatoraÃ§Ã£o.

**CoerÃªncia entre Models e tabelas de banco.** Os campos dos Models implementados; `Equipe` (`uuid`, `qr_code`, `competicao_id`, `criado_em`) e `Administrador` (`senha`, `area`); foram alinhados com o schema real das migrations. O Model `Checkpoint`, ainda planejado, utilizarÃ¡ os campos `identificador`, `km`, `pace`, `tempo`, `imagem`, `competicao_id`, `administrador_id` e `criado_em`, conforme definido em `0006_create_checkpoint.sql`.

**Tabela `audit_logs`.** A RN05 exige log imutÃ¡vel de todas as operaÃ§Ãµes crÃ­ticas. O `AuditService` estÃ¡ previsto na arquitetura para atender essa regra de negÃ³cio, porÃ©m a tabela `audit_logs` ainda nÃ£o estÃ¡ presente nas migrations atuais (`0000` a `0006`). Recomenda-se a criaÃ§Ã£o de uma migration `0007_create_audit_logs.sql` contendo as colunas `id`, `tipo_operacao`, `entidade`, `entidade_id`, `operador_id`, `timestamp` e `payload_json`, garantindo suporte completo Ã  rastreabilidade operacional exigida pelo sistema.

**AutenticaÃ§Ã£o JWT.** O middleware de autenticaÃ§Ã£o JWT nÃ£o estÃ¡ implementado; `src/middlewares/` contÃ©m apenas `errorHandler.ts`. A dependÃªncia `jsonwebtoken` nÃ£o consta no `package.json`. A implementaÃ§Ã£o do `AuthController` e do middleware JWT estÃ¡ planejada para sprint futura, conforme indicado na coluna "Status" do Quadro 24.

**Fluxo OCR nos diagramas de sequÃªncia (3.2.4).** O retorno `202 Accepted` pelo `CheckpointController` e o callback assÃ­ncrono do motor externo para o `OCRService` deverÃ£o estar representados nos diagramas de sequÃªncia com marcaÃ§Ã£o explÃ­cita de assincronicidade (fragmento `async` ou notaÃ§Ã£o equivalente em UML 2.x) quando o fluxo for implementado.

**Constraint `UNIQUE` sobre `uuid`.** Para garantir integridade nas consultas do fluxo pÃºblico, a coluna `equipes.uuid` deve possuir constraint `UNIQUE` no schema do banco, verificando sua presenÃ§a em `documentos/outros/migrations/`.


### 3.2.2. Diagrama de Casos de Uso (sprint 1)

O Diagrama de Casos de Uso Ã© uma representaÃ§Ã£o grÃ¡fica da Linguagem de
Modelagem Unificada (UML) que descreve as funcionalidades de um sistema
do ponto de vista de seus usuÃ¡rios, evidenciando as interaÃ§Ãµes entre
atores externos e os casos de uso disponÃ­veis (BOOCH; RUMBAUGH;
JACOBSON, 2006). No contexto deste projeto, o diagrama cumpre trÃªs
funÃ§Ãµes centrais: delimita o escopo do sistema ao explicitar quais
funcionalidades estÃ£o dentro e fora de sua fronteira, comunica de forma
visual as interaÃ§Ãµes entre os atores e o sistema para todos os
envolvidos no projeto, e serve de base para a derivaÃ§Ã£o dos requisitos
funcionais, garantindo rastreabilidade entre o que os usuÃ¡rios precisam
fazer e o que o sistema deve oferecer.

A Figura 8 apresenta o diagrama de casos de uso do Sistema Red Bull 24
Horas, modelando as interaÃ§Ãµes entre os trÃªs atores identificados,
Administrador / Juiz, Corredor e Sistema OCR, e os principais fluxos
do sistema.

Figura 8 - Diagrama de Casos de Uso do Sistema Red Bull 24 Horas

![Diagrama de Casos de Uso](../assets/diagrama_caso_uso.png)

Fonte: Material produzido pelos autores (2026).

O **Administrador / Juiz** unifica as personas Mariana (Coordenadora
Operacional) e Bruno (Gerente de Field Marketing), responsÃ¡veis pela
operaÃ§Ã£o e supervisÃ£o do evento. Ã o ator com maior nÃºmero de casos de
uso, atuando desde a criaÃ§Ã£o da competiÃ§Ã£o e cadastro de equipes atÃ© o
registro de checkpoints, acompanhamento do ranking, acesso ao relatÃ³rio
e encerramento da competiÃ§Ã£o. O **Corredor** representa atletas e
capitÃ£es das equipes, acessando o sistema via URL Ãºnica sem autenticaÃ§Ã£o
para acompanhar o ranking, o status dos atletas e a calculadora de
descanso. O **Sistema OCR**, marcado com o estereÃ³tipo Â«systemÂ», Ã© um
serviÃ§o externo consumido via API que extrai dados das fotos do visor
da esteira e alerta inconsistÃªncias.

O diagrama emprega relaÃ§Ãµes Â«includeÂ» e Â«extendÂ» para representar
dependÃªncias entre casos de uso. A geraÃ§Ã£o do UUID Ã© Â«includeÂ» de
"Cadastrar equipes/atletas", refletindo que o identificador Ãºnico Ã©
gerado automaticamente ao salvar uma equipe. A seleÃ§Ã£o do atleta ativo
Ã© Â«includeÂ» dos dois fluxos de registro de checkpoint, sendo etapa
obrigatÃ³ria antes do registro. O fluxo manual de registro estende o
fluxo via OCR como caminho alternativo em caso de falha tÃ©cnica, e
ambos incluem a confirmaÃ§Ã£o humana dos dados antes do salvamento. O
alerta de inconsistÃªncia estende a confirmaÃ§Ã£o de dados quando hÃ¡
divergÃªncia relevante. A exportaÃ§Ã£o em CSV Ã© Â«includeÂ» de "Acessar
relatÃ³rio", visto que a exportaÃ§Ã£o Ã© parte integrante da tela de
relatÃ³rio.

### 3.2.3. Diagrama de Classes do DomÃ­nio (sprint 2)

O diagrama de classes de domÃ­nio Ã© uma representaÃ§Ã£o visual que modela todos os elementos principais e os relacionamentos de um sistema. O objetivo do diagrama Ã© descrever as entidades presentes no domÃ­nio do problema proposto de forma conceitual, descrever seus atributos e descrever como as entidades se conectam. Ele auxilia na compreensÃ£o da estrutura do sistema antes de ser implementado, facilitando a comunicaÃ§Ã£o e entendimento de todos os membros da equipe e servindo como base para o desenvolvimento. 

<div align="center">
  <sub>Figura 15 - Diagrama de Classes de DomÃ­nio </sub><br>
  <img src="../assets/diagrama_classedominios.png" width="100%" alt="AnÃ¡lise de negÃ³cios dos riscos por um modelo de Matriz"><br>
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>


### 3.2.4. Diagrama de SequÃªncia UML (sprint 3)

Os diagramas de sequÃªncia UML apresentados modelam a comunicaÃ§Ã£o entre as camadas da arquitetura da aplicaÃ§Ã£o seguindo o fluxo Controller â Service â Repository â Banco de Dados, evidenciando a separaÃ§Ã£o de responsabilidades no backend. As mensagens sÃ­ncronas representam operaÃ§Ãµes que aguardam resposta imediata para continuidade do fluxo, enquanto mensagens assÃ­ncronas foram utilizadas em processos de maior latÃªncia, como o processamento OCR e atualizaÃ§Ã£o de dados em tempo quase real. Os retornos tracejados representam as respostas das operaÃ§Ãµes executadas entre os componentes da aplicaÃ§Ã£o e a persistÃªncia no banco de dados.

O PlantUML Ã© uma ferramenta de cÃ³digo aberto que permite a criaÃ§Ã£o de diagramas UML a partir de descriÃ§Ãµes textuais simples, eliminando a necessidade de ferramentas grÃ¡ficas manuais. Por meio de uma sintaxe prÃ³pria e intuitiva, o texto Ã© interpretado e convertido automaticamente em imagens, o que favorece a legibilidade, o versionamento e a manutenÃ§Ã£o dos diagramas ao longo do ciclo de desenvolvimento do projeto. Os diagramas de sequÃªncia apresentados nesta seÃ§Ã£o foram elaborados utilizando essa abordagem, com o cÃ³digo-fonte escrito em formato .puml e a geraÃ§Ã£o das imagens realizada pela plataforma disponÃ­vel em plantuml.com (PLANTUML, 2025).

O cÃ³digo-fonte dos diagramas em PlantUML pode ser consultado no documento [diagramas-sequencia-puml.md](./outros/diagramas-sequencia-puml.md), localizado na pasta `documentos/outros`. Esse arquivo reÃºne os blocos textuais utilizados para gerar as imagens apresentadas a seguir, permitindo que os diagramas sejam versionados, revisados e atualizados com maior facilidade.

O primeiro diagrama representa o fluxo de registro de checkpoint via OCR. Nele, o operador envia a imagem para o Controller, que encaminha a solicitaÃ§Ã£o ao Service; o Service registra a extraÃ§Ã£o por meio do Repository, persiste os dados iniciais no Banco de Dados, executa o processamento OCR de forma assÃ­ncrona e, apÃ³s a validaÃ§Ã£o humana, salva o checkpoint com retorno tracejado entre as camadas.

<div align="center">
  <sub>Figura 9 - Diagrama de sequÃªncia do registro de checkpoint via OCR</sub><br>
  <img src="../assets/programacao/diagrama-sequencia-uml-1.svg" width="100%" alt="Diagrama de sequÃªncia UML do fluxo de registro de checkpoint via OCR, incluindo captura da imagem, validaÃ§Ã£o humana e salvamento no banco de dados"><br>
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

O segundo diagrama descreve o fluxo de cadastro de equipe e geraÃ§Ã£o de UUID. O administrador cadastra a equipe em uma competiÃ§Ã£o, o Controller aciona o Service, o Service utiliza o Repository para persistir equipes e atletas no Banco de Dados, e a aplicaÃ§Ã£o retorna o link pÃºblico apÃ³s registrar os dados. O fluxo tambÃ©m evidencia a atualizaÃ§Ã£o assÃ­ncrona de ranking em segundo plano e a consulta posterior da equipe por meio da mesma arquitetura em camadas.

<div align="center">
  <sub>Figura 10 - Diagrama de sequÃªncia do cadastro de equipe e geraÃ§Ã£o de UUID</sub><br>
  <img src="../assets/programacao/diagrama-sequencia-uml-2.svg" width="100%" alt="Diagrama de sequÃªncia UML do fluxo de cadastro de equipe, cadastro de atletas e geraÃ§Ã£o de link pÃºblico com UUID"><br>
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

### 3.2.5. Diagrama de Atividades ou Estados (sprint 3)

O diagrama de atividades a seguir representa o fluxo de registro de checkpoint por meio do mÃ³dulo de OCR da soluÃ§Ã£o. O processo inicia com a captura da imagem do visor da esteira pelo fiscal, seguida pelo envio da imagem para processamento. ApÃ³s a extraÃ§Ã£o dos dados, o sistema realiza validaÃ§Ãµes relacionadas ao atleta, Ã  equipe e Ã  competiÃ§Ã£o antes de registrar o checkpoint e atualizar as informaÃ§Ãµes exibidas aos usuÃ¡rios.

<div align="center">
  <sub>Figura 26 - Diagrama de atividades do registro de checkpoint via OCR</sub><br>
  <img src="../assets/programacao/diagrama-de-atividades.png" width="100%" alt="Diagrama de atividades do fluxo de registro de checkpoint via OCR, com validaÃ§Ã£o, correÃ§Ã£o manual, persistÃªncia e atualizaÃ§Ã£o de ranking"><br>
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

O fluxo contempla tanto o cenÃ¡rio de sucesso quanto os casos em que os dados extraÃ­dos pelo OCR apresentam inconsistÃªncias. Nessas situaÃ§Ãµes, o sistema solicita correÃ§Ã£o manual e realiza uma nova validaÃ§Ã£o antes de permitir o registro do checkpoint. Dessa forma, o processo contribui para a confiabilidade das informaÃ§Ãµes utilizadas na atualizaÃ§Ã£o do ranking administrativo e do painel das equipes.

### 3.2.6. Diagrama de ImplantaÃ§Ã£o (sprints 4 e 5)

*Diagrama UML de deployment mostrando nÃ³s fÃ­sicos, artefatos e canais de comunicaÃ§Ã£o. Representa a visÃ£o Engineering + Technology do RM-ODP.*

### 3.2.7. PadrÃµes de Projeto Aplicados (sprints 3 a 5)

Os padrÃµes de projeto foram adotados no backend com o objetivo de promover uma arquitetura mais organizada, modular e de fÃ¡cil manutenÃ§Ã£o ao longo do desenvolvimento do sistema. A utilizaÃ§Ã£o desses padrÃµes contribui para a separaÃ§Ã£o de responsabilidades entre as camadas da aplicaÃ§Ã£o, reduzindo o acoplamento entre componentes e facilitando a reutilizaÃ§Ã£o de cÃ³digo, a escalabilidade e a testabilidade das funcionalidades implementadas.

AlÃ©m disso, a definiÃ§Ã£o de estruturas padronizadas para acesso a dados, validaÃ§Ãµes, regras de negÃ³cio e tratamento de requisiÃ§Ãµes permite maior consistÃªncia no desenvolvimento do backend, tornando o cÃ³digo mais legÃ­vel e simplificando futuras manutenÃ§Ãµes e evoluÃ§Ãµes da aplicaÃ§Ã£o.

A seguir, sÃ£o apresentados os principais padrÃµes identificados no sistema, bem como suas categorias, definiÃ§Ãµes, os problemas que resolvem, justificativas de adoÃ§Ã£o e exemplos de aplicaÃ§Ã£o no backend.

---

### Repository Pattern

#### Categoria
Estrutural / Arquitetural

#### DefiniÃ§Ã£o
O Repository Pattern Ã© um padrÃ£o responsÃ¡vel por centralizar e abstrair o acesso aos dados da aplicaÃ§Ã£o em uma camada especÃ­fica de repositÃ³rio. Esse padrÃ£o atua como intermediÃ¡rio entre a aplicaÃ§Ã£o e o banco de dados, encapsulando operaÃ§Ãµes de persistÃªncia, como consultas, inserÃ§Ãµes, atualizaÃ§Ãµes e remoÃ§Ãµes de registros.

Com a utilizaÃ§Ã£o desse padrÃ£o, as demais camadas da aplicaÃ§Ã£o nÃ£o precisam conhecer detalhes especÃ­ficos relacionados Ã  comunicaÃ§Ã£o com o banco de dados, Ã s consultas utilizadas ou Ã  estrutura de persistÃªncia dos dados.

#### Problema resolvido
Sem a utilizaÃ§Ã£o desse padrÃ£o, operaÃ§Ãµes relacionadas ao banco de dados ficariam distribuÃ­das entre Controllers e Services, fazendo com que mÃºltiplas camadas da aplicaÃ§Ã£o fossem responsÃ¡veis tanto pela lÃ³gica de negÃ³cio quanto pelo acesso aos dados.

Esse cenÃ¡rio aumentaria significativamente o acoplamento entre os componentes do sistema e dificultaria manutenÃ§Ã£o, reutilizaÃ§Ã£o de cÃ³digo e organizaÃ§Ã£o da arquitetura. AlÃ©m disso, qualquer alteraÃ§Ã£o relacionada Ã s operaÃ§Ãµes de persistÃªncia precisaria ser realizada em diferentes pontos da aplicaÃ§Ã£o.

#### Justificativa da adoÃ§Ã£o
Esse padrÃ£o foi adotado porque o backend possui diferentes operaÃ§Ãµes de CRUD relacionadas Ã s entidades de competiÃ§Ã£o, equipes e atletas. Durante o desenvolvimento, tornou-se necessÃ¡rio separar a lÃ³gica responsÃ¡vel pelo acesso ao banco de dados das regras de negÃ³cio da aplicaÃ§Ã£o, permitindo que cada camada possuÃ­sse uma responsabilidade especÃ­fica dentro da arquitetura do sistema.

A centralizaÃ§Ã£o das operaÃ§Ãµes de persistÃªncia em arquivos de repositÃ³rio tambÃ©m contribui para:
<ul>
    <li>melhorar organizaÃ§Ã£o do backend;</li>
    <li>reduzir repetiÃ§Ã£o de consultas;</li>
    <li>facilitar manutenÃ§Ã£o das operaÃ§Ãµes de banco;</li>
    <li>reutilizar mÃ©todos de acesso aos dados;</li>
    <li>reduzir acoplamento entre as camadas da aplicaÃ§Ã£o.
</ul>

#### AplicaÃ§Ã£o no projeto
O padrÃ£o foi aplicado nos seguintes arquivos:
-  `competitionRepository.ts`
-  `teamRepository.ts`
-  `athleteRepository.ts`

Esses arquivos concentram as operaÃ§Ãµes responsÃ¡veis pela comunicaÃ§Ã£o com o Supabase, incluindo consultas, criaÃ§Ã£o de registros, atualizaÃ§Ãµes e remoÃ§Ãµes de dados. Dessa forma, os Services nÃ£o executam diretamente operaÃ§Ãµes de banco de dados, utilizando os repositÃ³rios como intermediÃ¡rios para acesso Ã s informaÃ§Ãµes persistidas.

#### Exemplo de cÃ³digo
```typescript
async findById(id: number): Promise<Competition | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("competicao")
    .select(competitionSelect)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as Competition | null;
}
```
No exemplo apresentado, o mÃ©todo findById encapsula toda a lÃ³gica de consulta ao banco de dados dentro do repositÃ³rio. Assim, outras camadas da aplicaÃ§Ã£o nÃ£o precisam conhecer detalhes relacionados ao Supabase ou Ã  construÃ§Ã£o da consulta utilizada para buscar uma competiÃ§Ã£o pelo identificador.

---

### Service Layer Pattern

#### Categoria
Arquitetural

#### DefiniÃ§Ã£o
O Service Layer Ã© um padrÃ£o utilizado para centralizar regras de negÃ³cio em uma camada intermediÃ¡ria entre os Controllers e os Repositories. Essa camada Ã© responsÃ¡vel por coordenar operaÃ§Ãµes da aplicaÃ§Ã£o, validar fluxos de execuÃ§Ã£o e controlar comportamentos relacionados Ã s funcionalidades do sistema antes da comunicaÃ§Ã£o com a camada de persistÃªncia. A utilizaÃ§Ã£o desse padrÃ£o permite separar responsabilidades entre as diferentes partes do backend, evitando que Controllers assumam funÃ§Ãµes alÃ©m do gerenciamento das requisiÃ§Ãµes HTTP.

#### Problema resolvido
Sem esse padrÃ£o, os Controllers seriam responsÃ¡veis simultaneamente pelo recebimento das requisiÃ§Ãµes HTTP, execuÃ§Ã£o das regras de negÃ³cio e manipulaÃ§Ã£o de dados persistidos. Esse cenÃ¡rio geraria Controllers excessivamente grandes e acoplados, dificultando organizaÃ§Ã£o do cÃ³digo, reutilizaÃ§Ã£o de lÃ³gica e implementaÃ§Ã£o de testes unitÃ¡rios. AlÃ©m disso, diferentes regras de negÃ³cio poderiam acabar repetidas em mÃºltiplos endpoints da aplicaÃ§Ã£o.

#### Justificativa da adoÃ§Ã£o
Esse padrÃ£o foi adotado para garantir separaÃ§Ã£o clara entre responsabilidades dentro do backend.

No projeto, a camada de Service concentra regras relacionadas Ã s entidades do sistema, incluindo:
<ul>
    <li>validaÃ§Ã£o de parÃ¢metros;</li>
    <li>verificaÃ§Ã£o de existÃªncia de registros;</li>
    <li>coordenaÃ§Ã£o de operaÃ§Ãµes;</li>
    <li>lanÃ§amento de exceÃ§Ãµes;</li>
    <li>controle de fluxos de execuÃ§Ã£o.
</ul>

Dessa forma, os Controllers permanecem responsÃ¡veis apenas pelo recebimento das requisiÃ§Ãµes e envio das respostas HTTP, enquanto os repositÃ³rios permanecem responsÃ¡veis exclusivamente pela persistÃªncia dos dados. A utilizaÃ§Ã£o da camada de Service tambÃ©m contribui para maior organizaÃ§Ã£o do backend e reutilizaÃ§Ã£o das regras de negÃ³cio entre diferentes partes da aplicaÃ§Ã£o.

#### AplicaÃ§Ã£o no projeto
O padrÃ£o foi aplicado nos seguintes arquivos:
- `competitionService.ts`
-  `teamService.ts`
-  `athleteService.ts`

Esses arquivos centralizam as regras de negÃ³cio relacionadas Ã s entidades da aplicaÃ§Ã£o antes da comunicaÃ§Ã£o com os repositÃ³rios.

#### Exemplo de cÃ³digo
```typescript
async findById(idParam: unknown): Promise<Competition> {
  const id = validateCompetitionId(idParam);

  const competition = await repository.findById(id);

  if (!competition) {
    throw new NotFoundError("CompetiÃ§Ã£o nÃ£o encontrada");
  }

  return competition;
}
````
Nesse exemplo, o Service realiza validaÃ§Ã£o do identificador recebido, consulta o repositÃ³rio e verifica se o registro existe antes de retornar a informaÃ§Ã£o. Dessa forma, a lÃ³gica de negÃ³cio permanece isolada da camada responsÃ¡vel pelas requisiÃ§Ãµes HTTP.

---

### Dependency Injection Pattern

#### Categoria
Criacional / Arquitetural

#### DefiniÃ§Ã£o
A Dependency Injection Ã© um padrÃ£o utilizado para fornecer dependÃªncias externas para uma funÃ§Ã£o, classe ou mÃ³dulo, em vez de instanciÃ¡-las diretamente dentro da prÃ³pria implementaÃ§Ã£o. Esse padrÃ£o reduz o acoplamento entre os componentes do sistema e permite maior flexibilidade na utilizaÃ§Ã£o de diferentes implementaÃ§Ãµes, tanto durante a execuÃ§Ã£o da aplicaÃ§Ã£o quanto na realizaÃ§Ã£o de testes automatizados.

#### Problema resolvido
Sem a utilizaÃ§Ã£o desse padrÃ£o, os Services dependeriam diretamente das implementaÃ§Ãµes concretas dos repositÃ³rios, fazendo com que a camada de negÃ³cio estivesse fortemente acoplada Ã  camada de persistÃªncia. AlÃ©m disso, esse cenÃ¡rio dificultaria a criaÃ§Ã£o de testes automatizados, pois os testes dependeriam diretamente do banco de dados e das implementaÃ§Ãµes reais da aplicaÃ§Ã£o.

#### Justificativa da adoÃ§Ã£o
Esse padrÃ£o foi adotado devido Ã  necessidade de testar regras de negÃ³cio de forma isolada, sem depender diretamente do banco de dados utilizado pelo sistema. A utilizaÃ§Ã£o da InjeÃ§Ã£o de DependÃªncia permite substituir os repositÃ³rios reais por objetos simulados (mocks) durante os testes, possibilitando validar apenas o comportamento das regras de negÃ³cio implementadas nos Services.

AlÃ©m disso, esse padrÃ£o contribui para:
<ul>
    <li>reduzir acoplamento entre camadas;</li>
    <li>facilitar manutenÃ§Ã£o;</li>
    <li>melhorar testabilidade;</li>
    <li>permitir maior flexibilidade na criaÃ§Ã£o dos Services.
</ul>

#### AplicaÃ§Ã£o no projeto
O padrÃ£o foi aplicado na criaÃ§Ã£o dos Services, permitindo que os repositÃ³rios sejam recebidos como parÃ¢metro durante sua inicializaÃ§Ã£o. Dessa forma, durante a execuÃ§Ã£o normal da aplicaÃ§Ã£o utiliza-se o repositÃ³rio real, enquanto nos testes podem ser utilizados mocks responsÃ¡veis por simular o comportamento esperado da camada de persistÃªncia.

#### Exemplo de cÃ³digo
```typescript
export function createCompetitionService(
  repository: CompetitionRepository = competitionRepository
) {
  return {
    async create(payload: Partial<CreateCompetitionInput>) {
      const input = validateCreateCompetition(payload);

      return repository.create(input);
    }
  };
}
```

```
#### Exemplo de aplicaÃ§Ã£o nos testes
```typescript
const repository = createRepositoryMock();

const competitionService = createCompetitionService(repository);
```
No exemplo apresentado, o Service recebe o repositÃ³rio como dependÃªncia externa. Isso permite substituir facilmente a implementaÃ§Ã£o real por um mock durante os testes automatizados.

---

### Middleware Pattern

#### Categoria
Comportamental / Arquitetural

#### DefiniÃ§Ã£o
O Middleware Pattern consiste na utilizaÃ§Ã£o de funÃ§Ãµes intermediÃ¡rias executadas durante o fluxo de processamento das requisiÃ§Ãµes HTTP.

Essas funÃ§Ãµes atuam entre o recebimento da requisiÃ§Ã£o e a execuÃ§Ã£o final do Controller, permitindo centralizar comportamentos compartilhados relacionados ao fluxo da aplicaÃ§Ã£o, como tratamento de erros, autenticaÃ§Ã£o e manipulaÃ§Ã£o de requisiÃ§Ãµes.

#### Problema resolvido
Sem esse padrÃ£o, funcionalidades relacionadas ao tratamento de erros e controle de fluxo precisariam ser repetidas manualmente em diferentes Controllers e rotas do sistema. Isso aumentaria duplicidade de cÃ³digo e dificultaria manutenÃ§Ã£o da aplicaÃ§Ã£o, especialmente no tratamento de exceÃ§Ãµes assÃ­ncronas.

#### Justificativa da adoÃ§Ã£o
Esse padrÃ£o foi adotado para centralizar o tratamento de erros assÃ­ncronos no backend e evitar repetiÃ§Ã£o de blocos try/catch nos Controllers. A utilizaÃ§Ã£o de middlewares permite organizar melhor o fluxo das requisiÃ§Ãµes HTTP e concentrar comportamentos compartilhados em funÃ§Ãµes reutilizÃ¡veis.

AlÃ©m disso, o padrÃ£o contribui para:
<ul>
    <li>reduzir repetiÃ§Ã£o de cÃ³digo;</li>
    <li>melhorar organizaÃ§Ã£o estrutural;</li>
    <li>centralizar tratamento de exceÃ§Ãµes;</li>
    <li>simplificar implementaÃ§Ã£o das rotas.
</ul>

#### AplicaÃ§Ã£o no projeto
O padrÃ£o foi aplicado nos seguintes arquivos:
-  `asyncHandler.ts`
-  `errorHandler.ts`

Esses arquivos sÃ£o responsÃ¡veis por encapsular erros assÃ­ncronos e encaminhar exceÃ§Ãµes para o tratamento centralizado da aplicaÃ§Ã£o.

#### Exemplo de cÃ³digo
```typescript
export function asyncHandler(
  handler: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    Promise.resolve(handler(req, res, next))
      .catch(next);
  };
}
```

#### Exemplo de uso
```typescript
router.post(
  "/competitions",
  asyncHandler(competitionController.create)
);
```
Nesse exemplo, o middleware asyncHandler encapsula o Controller responsÃ¡vel pela rota, garantindo que erros assÃ­ncronos sejam encaminhados corretamente para o middleware de tratamento de exceÃ§Ãµes.

---

### Validation Layer Pattern

#### Categoria
Estrutural / Arquitetural

#### DefiniÃ§Ã£o
O Validation Layer Pattern consiste na criaÃ§Ã£o de uma camada responsÃ¡vel pela validaÃ§Ã£o dos dados recebidos pela aplicaÃ§Ã£o antes de sua utilizaÃ§Ã£o nas regras de negÃ³cio.

Essa camada garante que os dados recebidos pelos endpoints estejam estruturados corretamente antes de serem processados pelas regras de negÃ³cio e pela camada de persistÃªncia da aplicaÃ§Ã£o, reduzindo inconsistÃªncias e aumentando a confiabilidade do sistema.

#### Problema resolvido
Sem a utilizaÃ§Ã£o desse padrÃ£o, validaÃ§Ãµes poderiam ficar espalhadas entre Controllers e Services, aumentando duplicidade de cÃ³digo e dificultando manutenÃ§Ã£o das verificaÃ§Ãµes realizadas pela aplicaÃ§Ã£o. AlÃ©m disso, dados invÃ¡lidos poderiam avanÃ§ar para outras camadas do sistema, aumentando risco de falhas durante a execuÃ§Ã£o das operaÃ§Ãµes.

#### Justificativa da adoÃ§Ã£o
Esse padrÃ£o foi adotado devido Ã  necessidade de validar os dados recebidos pelos endpoints antes de sua utilizaÃ§Ã£o na lÃ³gica da aplicaÃ§Ã£o.


A centralizaÃ§Ã£o das validaÃ§Ãµes em arquivos especÃ­ficos permite:
<ul>
    <li>reduzir repetiÃ§Ã£o de cÃ³digo;</li>
    <li>organizar validaÃ§Ãµes da aplicaÃ§Ã£o;</li>
    <li>padronizar verificaÃ§Ãµes realizadas;</li>
    <li>impedir envio de dados invÃ¡lidos para os Services.
</ul>

AlÃ©m disso, esse padrÃ£o contribui para manter os Services mais focados nas regras de negÃ³cio da aplicaÃ§Ã£o.

#### AplicaÃ§Ã£o no projeto
O padrÃ£o foi aplicado nos arquivos responsÃ¡veis pela validaÃ§Ã£o dos payloads utilizados nas operaÃ§Ãµes de criaÃ§Ã£o e atualizaÃ§Ã£o das entidades do sistema. Esses arquivos verificam obrigatoriedade de campos, tipos de dados e formatos esperados antes da continuidade do fluxo da aplicaÃ§Ã£o.

#### Exemplo de cÃ³digo
```typescript
export function validateCreateCompetition(
  payload: unknown
): CreateCompetitionInput {

  if (!isObject(payload)) {
    throw new ValidationError("Payload invÃ¡lido");
  }

  const nome = readRequiredText(payload, "nome");
  const data = readRequiredText(payload, "data");
  const endereco = readRequiredText(payload, "endereco");

  if (!isValidDate(data)) {
    throw new ValidationError(
      "data deve ser uma data vÃ¡lida"
    );
  }

  return {
    nome,
    data,
    endereco,
  };
}
```
Nesse exemplo, a funÃ§Ã£o realiza validaÃ§Ãµes relacionadas Ã  estrutura e aos formatos esperados do payload antes que os dados sejam enviados para as regras de negÃ³cio da aplicaÃ§Ã£o.

## 3.3. Wireframes (sprint 2)

Os wireframes apresentados nesta seÃ§Ã£o tÃªm como objetivo representar visualmente os principais fluxos de navegaÃ§Ã£o da soluÃ§Ã£o proposta para o evento Red Bull 24 Horas, evidenciando a organizaÃ§Ã£o das funcionalidades priorizadas. Os artefatos foram desenvolvidos com foco na compreensÃ£o da experiÃªncia do usuÃ¡rio, permitindo validar rapidamente a estrutura da aplicaÃ§Ã£o, os componentes principais das telas e a sequÃªncia de interaÃ§Ã£o entre os mÃ³dulos do sistema.

A organizaÃ§Ã£o desta seÃ§Ã£o foi estruturada por persona, separando os fluxos administrativos e operacionais do fluxo pÃºblico da equipe. Essa divisÃ£o facilita a compreensÃ£o da navegaÃ§Ã£o do sistema e evidencia como cada perfil interage com a plataforma ao longo da competiÃ§Ã£o.

Os wireframes de baixa fidelidade foram utilizados para validar arquitetura da informaÃ§Ã£o, hierarquia visual e fluxo de navegaÃ§Ã£o inicial da aplicaÃ§Ã£o, enquanto os wireframes de alta fidelidade representam uma visÃ£o mais prÃ³xima da interface final, incluindo layout, organizaÃ§Ã£o visual e distribuiÃ§Ã£o dos componentes.

### 3.3.1 Personas Administrativas â Marina Costa e Bruno Monteiro

As personas Marina Costa e Bruno Monteiro compartilham o mesmo fluxo principal de navegaÃ§Ã£o dentro da plataforma administrativa da soluÃ§Ã£o. Enquanto Marina atua diretamente na preparaÃ§Ã£o operacional da competiÃ§Ã£o, realizando cadastro de equipes, organizaÃ§Ã£o dos atletas e acompanhamento dos checkpoints, Bruno Ã© responsÃ¡vel pela supervisÃ£o geral do evento, monitoramento da prova e anÃ¡lise estratÃ©gica das informaÃ§Ãµes geradas pelo sistema.

Por utilizarem o mesmo ambiente administrativo e acessarem funcionalidades complementares dentro da mesma arquitetura operacional, os wireframes apresentados nesta subseÃ§Ã£o foram organizados de forma conjunta. O fluxo contempla desde o acesso inicial ao painel administrativo atÃ© o gerenciamento operacional da competiÃ§Ã£o, incluindo cadastro de equipes, geraÃ§Ã£o de UUIDs, captura OCR, validaÃ§Ã£o de checkpoints, visualizaÃ§Ã£o consolidada dos dados e geraÃ§Ã£o de relatÃ³rios operacionais.

#### Fluxo de Cenas â Operadores

O fluxo abaixo representa a navegaÃ§Ã£o realizada pelas personas administrativas durante a preparaÃ§Ã£o e operaÃ§Ã£o da competiÃ§Ã£o, evidenciando o caminho percorrido desde o acesso inicial ao painel atÃ© a configuraÃ§Ã£o das equipes participantes.

<div align="center">
  <sub>Figura 11 - Fluxo de NavegaÃ§Ã£o das Personas Administrativas</sub><br>
  <img src="../assets/design/fluxo-operador.svg" width="100%" alt="Fluxo de navegaÃ§Ã£o do painel administrativo da competiÃ§Ã£o Red Bull 24 Horas, incluindo dashboard, equipes, checkpoints, ranking e relatÃ³rios operacionais."><br>
  <sup>Fonte: Material produzido pelos autores (2026).</sup>
</div>

- O fluxo completo de navegaÃ§Ã£o das personas administrativas pode ser consultado em: [Fluxo do Operador](outros/fluxo_operador.md).

O fluxo apresentado evidencia a sequÃªncia de navegaÃ§Ã£o utilizada pelos administradores durante a competiÃ§Ã£o. A partir do dashboard principal, os operadores conseguem acessar rapidamente mÃ³dulos de equipes, checkpoints, ranking e relatÃ³rios operacionais, reduzindo a quantidade de interaÃ§Ãµes necessÃ¡rias durante a execuÃ§Ã£o operacional da prova e centralizando todas as funcionalidades crÃ­ticas em um Ãºnico ambiente.

#### Wireframe de Baixa Fidelidade â Operadores

Os wireframes de baixa fidelidade das personas administrativas foram desenvolvidos para validar rapidamente a arquitetura da informaÃ§Ã£o, a organizaÃ§Ã£o estrutural das telas e os principais fluxos de navegaÃ§Ã£o da soluÃ§Ã£o antes da definiÃ§Ã£o visual definitiva da interface.

A utilizaÃ§Ã£o desse tipo de prototipaÃ§Ã£o permitiu testar hierarquia visual, distribuiÃ§Ã£o dos componentes e sequÃªncia de interaÃ§Ã£o entre os mÃ³dulos administrativos da plataforma, reduzindo retrabalho durante as etapas posteriores de desenvolvimento e refinamento visual.


O principal objetivo deste wireframe Ã© 
representar de forma rÃ¡pida e simplificada o fluxo de navegaÃ§Ã£o da persona 1 (Marina) ao preparar uma nova ediÃ§Ã£o do Red Bull 24h antes da prova comeÃ§ar, explorando desde o primeiro acesso ao painel atÃ© as equipes cadastradas e prontas para receber o link pÃºblico (UUID).

 Persona 1: Marina Costa, 29, Coordenadora Operacional (Administradora)

 <div align="center">
  <sub>Quadro 23 - User Stories cobertas: </sub>
</div>




| ID   | User Story | DescriÃ§Ã£o |
|------|-------------|------------|
| US01 | Acessar painel admin | Estados sem e com competiÃ§Ã£o |
| US02 | Cadastrar nova competiÃ§Ã£o | Cadastro com data e localizaÃ§Ã£o |
| US03 | Cadastrar e editar equipes | Gerenciamento de equipes e atletas |
| US05 | Gerar URL UUID automaticamente | GeraÃ§Ã£o automÃ¡tica ao cadastrar equipe |
| US06 | Acessar aba de equipes | NavegaÃ§Ã£o pelo menu ou atalho |
| US07 | Acessar painel operacional completo da equipe | VisualizaÃ§Ã£o de informaÃ§Ãµes da equipe, atletas e checkpoints em tempo real |
| US08 | Selecionar o atleta ativo | Controle realizado pelo juiz para definir o atleta atualmente monitorado |
| US09 | Fotografar a esteira para extraÃ§Ã£o via OCR | Captura da imagem da esteira para leitura automÃ¡tica de dados utilizando OCR |
| US10 | Registrar checkpoint manualmente | InserÃ§Ã£o manual de checkpoint como alternativa em caso de falha do OCR |
| US11 | Visualizar tabela com auto-refresh a cada 5 min | AtualizaÃ§Ã£o automÃ¡tica periÃ³dica das informaÃ§Ãµes operacionais da competiÃ§Ã£o |
<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 


<div align="center"> 
  <sub>Quadro 24 - CritÃ©rios de baixa fidelidade adotados</sub> 
</div>

| CritÃ©rio | DescriÃ§Ã£o |
|-----------|------------|
| Paleta em P&B | Uso apenas de preto e branco |
| Placeholders de imagem | Representados com X cortado |
| Blocos de texto | Indicados com linhas zigzag |
| Elementos visuais | AusÃªncia de elementos decorativos |
| Foco estrutural | Ãnfase em hierarquia, navegaÃ§Ã£o e organizaÃ§Ã£o espacial |

<div align="center"> 
  <sup>Fonte: Elaborado pelos autores (2026).</sup> 
</div>

---

**ConfiguraÃ§Ã£o inicial da competiÃ§Ã£o**

O primeiro conjunto de telas representa o fluxo inicial de configuraÃ§Ã£o da competiÃ§Ã£o, incluindo criaÃ§Ã£o da sala administrativa e definiÃ§Ã£o das informaÃ§Ãµes bÃ¡sicas do evento.

<div align="center">
  <sub>Figura 12 - Wireframe de baixa fidelidade do fluxo inicial de configuraÃ§Ã£o da competiÃ§Ã£o</sub><br>
  <img src="../assets/design/wireframe-persona1-1.png" width="100%" alt="Wireframe de baixa fidelidade representando o fluxo inicial de configuraÃ§Ã£o da competiÃ§Ã£o e criaÃ§Ã£o da sala administrativa."><br>
  <sup>Fonte: Material produzido pelos autores (2026).</sup>
</div>

---

**Cadastro e gerenciamento das equipes**

O segundo conjunto de telas representa o processo de cadastro, ediÃ§Ã£o e gerenciamento das equipes e atletas participantes da competiÃ§Ã£o.

<div align="center">
  <sub>Figura 13 - Wireframe de baixa fidelidade do gerenciamento das equipes</sub><br>
  <img src="../assets/design/wireframe-persona1-2.png" width="100%" alt="Wireframe de baixa fidelidade do fluxo de cadastro e gerenciamento das equipes e atletas da competiÃ§Ã£o."><br>
  <sup>Fonte: Material produzido pelos autores (2026).</sup>
</div>

---

**Gerenciamento operacional da competiÃ§Ã£o**

O terceiro fluxo demonstra as telas relacionadas ao gerenciamento operacional da prova, incluindo registro de checkpoints e acompanhamento das informaÃ§Ãµes da competiÃ§Ã£o.

<div align="center">
  <sub>Figura 14 - Wireframe de baixa fidelidade do gerenciamento operacional da competiÃ§Ã£o</sub><br>
  <img src="../assets/design/wireframe-persona1-3.png" width="100%" alt="Wireframe de baixa fidelidade das funcionalidades operacionais utilizadas durante a competiÃ§Ã£o."><br>
  <sup>Fonte: Material produzido pelos autores (2026).</sup>
</div>

---

**RevisÃ£o e anÃ¡lise da competiÃ§Ã£o**

O Ãºltimo conjunto de telas representa as funcionalidades de revisÃ£o, validaÃ§Ã£o e anÃ¡lise consolidada dos dados registrados durante a competiÃ§Ã£o.

<div align="center">
  <sub>Figura 15 - Wireframe de baixa fidelidade da revisÃ£o operacional da competiÃ§Ã£o</sub><br>
  <img src="../assets/design/wireframe-persona1-4.png" width="100%" alt="Wireframe de baixa fidelidade das telas de revisÃ£o e anÃ¡lise dos dados da competiÃ§Ã£o."><br>
  <sup>Fonte: Material produzido pelos autores (2026).</sup>
</div>

#### Wireframe de Alta Fidelidade â Operadores

Os wireframes de alta fidelidade representam uma versÃ£o visual mais prÃ³xima da interface final da soluÃ§Ã£o, incluindo organizaÃ§Ã£o espacial dos componentes, tipografia, hierarquia visual e estrutura de navegaÃ§Ã£o da plataforma. O nÃ­vel de fidelidade de um protÃ³tipo estÃ¡ diretamente relacionado Ã  sua proximidade com a experiÃªncia real do usuÃ¡rio, tornando esse tipo de artefato fundamental para validaÃ§Ã£o visual e operacional antes da implementaÃ§Ã£o definitiva do sistema (Garrett, 2011).

As interfaces apresentadas a seguir representam o painel operacional administrativo da competiÃ§Ã£o Red Bull 24 Horas, desenvolvido para centralizar o monitoramento dos atletas, o controle dos checkpoints e o gerenciamento operacional das equipes participantes durante a execuÃ§Ã£o da prova.

A construÃ§Ã£o das telas priorizou rÃ¡pida interpretaÃ§Ã£o das informaÃ§Ãµes, organizaÃ§Ã£o visual dos dados e reduÃ§Ã£o da sobrecarga operacional dos administradores durante a competiÃ§Ã£o.

---

As Figuras 16 e 17 apresentam o inÃ­cio do fluxo administrativo, desde a tela principal do painel atÃ© o formulÃ¡rio de criaÃ§Ã£o de uma nova competiÃ§Ã£o.

<div align="center" style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap;">

  <div>
    <sub>Figura 16 - Dashboard principal do painel administrativo</sub><br>
    <img src="../assets/design/Alta fidelidade Persona 1 - Wireframe 1-6/Dashboard Principal.png" width="400px" alt="Dashboard principal do painel administrativo Red Bull 24 Horas."><br>
    <sup>Fonte: Elaborado pelos autores (2026).</sup>
  </div>

  <div>
    <sub>Figura 17 - CriaÃ§Ã£o de nova competiÃ§Ã£o</sub><br>
    <img src="../assets/design/Alta fidelidade Persona 1 - Wireframe 1-6/Dashboard - Nova competiÃ§Ã£o.png" width="400px" alt="FormulÃ¡rio de criaÃ§Ã£o de uma nova competiÃ§Ã£o Red Bull 24 Horas."><br>
    <sup>Fonte: Elaborado pelos autores (2026).</sup>
  </div>

</div>

---

As Figuras 18 e 19 mostram a etapa de preparaÃ§Ã£o das equipes, contemplando o estado inicial sem equipes cadastradas e o formulÃ¡rio de cadastro com capitÃ£o e atletas.

<div align="center" style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap;">

  <div>
    <sub>Figura 18 - Estado inicial da tela de equipes</sub><br>
    <img src="../assets/design/Alta fidelidade Persona 1 - Wireframe 1-6/Painel Admin Nenhuma Equipe Cadastrada.png" width="400px" alt="Tela de equipes sem equipes cadastradas no painel administrativo."><br>
    <sup>Fonte: Elaborado pelos autores (2026).</sup>
  </div>

  <div>
    <sub>Figura 19 - Cadastro de equipe e atletas</sub><br>
    <img src="../assets/design/Alta fidelidade Persona 1 - Wireframe 1-6/Cadastrar Equipe.png" width="400px" alt="FormulÃ¡rio de cadastro de equipe com capitÃ£o e atletas."><br>
    <sup>Fonte: Elaborado pelos autores (2026).</sup>
  </div>

</div>

---

As Figuras 20 e 21 apresentam a continuidade do gerenciamento das equipes, incluindo o retorno ao estado de cadastro e a visualizaÃ§Ã£o das equipes com URLs pÃºblicas geradas por UUID.

<div align="center" style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap;">

  <div>
    <sub>Figura 20 - CompetiÃ§Ã£o cadastrada sem equipes</sub><br>
    <img src="../assets/design/Alta fidelidade Persona 1 - Wireframe 1-6/CompetiÃ§Ã£o Cadastrada Sucesso.png" width="400px" alt="Tela de equipes apÃ³s o cadastro da competiÃ§Ã£o, ainda sem equipes cadastradas."><br>
    <sup>Fonte: Elaborado pelos autores (2026).</sup>
  </div>

  <div>
    <sub>Figura 21 - Equipes cadastradas com URLs pÃºblicas</sub><br>
    <img src="../assets/design/Alta fidelidade Persona 1 - Wireframe 1-6/Painel Admin Equipes.png" width="400px" alt="Painel administrativo com equipes cadastradas e URLs pÃºblicas por UUID."><br>
    <sup>Fonte: Elaborado pelos autores (2026).</sup>
  </div>

</div>

---

As Figuras 22 e 23 apresentam a visÃ£o geral do painel operacional administrativo e a interface de seleÃ§Ã£o do atleta ativo, utilizadas para acompanhamento da competiÃ§Ã£o e gerenciamento dos corredores em tempo real.

<div align="center" style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap;">

  <div>
    <sub>Figura 22 - Painel operacional administrativo da competiÃ§Ã£o</sub><br>
    <img src="../assets/design/Equipes - Painel operacional-1.png" width="400px" alt="Painel operacional administrativo da competiÃ§Ã£o Red Bull 24 Horas."><br>
    <sup>Fonte: Elaborado pelos autores (2026).</sup>
  </div>

  <div>
    <sub>Figura 23 - SeleÃ§Ã£o do atleta ativo</sub><br>
    <img src="../assets/design/Equipes - Painel operacional.png" width="400px" alt="Interface de seleÃ§Ã£o do atleta ativo durante a competiÃ§Ã£o."><br>
    <sup>Fonte: Elaborado pelos autores (2026).</sup>
  </div>

</div>

---

As Figuras 24 e 25 demonstram o processo de captura da imagem da esteira e a validaÃ§Ã£o dos dados extraÃ­dos via OCR, funcionalidade central da proposta de automaÃ§Ã£o da soluÃ§Ã£o.

<div align="center" style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap;">

  <div>
    <sub>Figura 24 - Captura da imagem da esteira</sub><br>
    <img src="../assets/design/Equipes - Painel operacional-2.png" width="400px" alt="Captura da imagem da esteira para processamento OCR."><br>
    <sup>Fonte: Elaborado pelos autores (2026).</sup>
  </div>

  <div>
    <sub>Figura 25 - ValidaÃ§Ã£o dos dados extraÃ­dos via OCR</sub><br>
    <img src="../assets/design/Equipes - Painel operacional-3.png" width="400px" alt="Tela de validaÃ§Ã£o dos dados extraÃ­dos automaticamente via OCR."><br>
    <sup>Fonte: Elaborado pelos autores (2026).</sup>
  </div>

</div>

---

As Figuras 26, 27 e 28 apresentam funcionalidades complementares da plataforma, incluindo o registro manual de checkpoints, a visualizaÃ§Ã£o consolidada das informaÃ§Ãµes da competiÃ§Ã£o e a geraÃ§Ã£o de relatÃ³rios operacionais.

<div align="center" 
     style="display: flex; justify-content: center; align-items: flex-start; gap: 20px; flex-wrap: nowrap;">

  <div>
    <sub>Figura 26 - Registro manual de checkpoint</sub><br>
    <img src="../assets/design/Equipes - Painel operacional-4.png" width="400px" alt="Tela de registro manual de checkpoints da competiÃ§Ã£o."><br>
    <sup>Fonte: Elaborado pelos autores (2026).</sup>
  </div>

  <div>
    <sub>Figura 27 - VisualizaÃ§Ã£o consolidada dos dados da competiÃ§Ã£o</sub><br>
    <img src="../assets/design/Equipes - Painel operacional-5.png" width="400px" alt="Tabela consolidada com os dados operacionais da competiÃ§Ã£o."><br>
    <sup>Fonte: Elaborado pelos autores (2026).</sup>
  </div>

  <div>
    <sub>Figura 28 - RelatÃ³rio operacional da competiÃ§Ã£o</sub><br>
    <img src="../assets/design/Equipes - Painel operacional-6.png" width="400px" alt="Tela de relatÃ³rio operacional da competiÃ§Ã£o Red Bull 24 Horas."><br>
    <sup>Fonte: Elaborado pelos autores (2026).</sup>
  </div>

</div>

Os wireframes apresentados permitiram validar visualmente os principais fluxos administrativos da soluÃ§Ã£o, evidenciando como as funcionalidades operacionais se integram dentro da plataforma e como os administradores interagem com o sistema durante a execuÃ§Ã£o da competiÃ§Ã£o.

### 3.3.2 Persona Corredor â Amanda Azevedo

Amanda Azevedo representa os atletas participantes da competiÃ§Ã£o, utilizando o painel pÃºblico da equipe para acompanhar mÃ©tricas da prova, ranking geral, desempenho dos corredores e informaÃ§Ãµes estratÃ©gicas relacionadas ao descanso e posicionamento da equipe durante o evento.

Diferentemente das personas administrativas, Amanda interage exclusivamente com a Ã¡rea pÃºblica da plataforma, acessada por meio do link gerado automaticamente pelo sistema. Seu fluxo prioriza rapidez na visualizaÃ§Ã£o das informaÃ§Ãµes, simplicidade de navegaÃ§Ã£o e acompanhamento contÃ­nuo da competiÃ§Ã£o em tempo real.

<div align="center"> 
  <sub>Quadro 25 - User Stories cobertas pela Persona Corredor</sub> 
</div>

| ID | User Story | DescriÃ§Ã£o |
|----|-------------|------------|
| US13 | Visualizar ranking global | Acompanhamento da posiÃ§Ã£o da equipe |
| US14 | Visualizar mÃ©tricas dos atletas | Desempenho individual e coletivo |
| US15 | Utilizar calculadora de descanso | Apoio operacional ao atleta |
| US16 | Compartilhar ranking | Compartilhamento simplificado da equipe |

<div align="center"> 
  <sup>Fonte: Elaborado pelos autores (2026).</sup> 
</div>

---

#### Fluxo de Cenas â Corredores

O fluxo abaixo representa a navegaÃ§Ã£o realizada pelos corredores ao acessarem o painel pÃºblico da equipe por meio do link compartilhado da competiÃ§Ã£o. O fluxo contempla o acesso via UUID, validaÃ§Ã£o do link, visualizaÃ§Ã£o das mÃ©tricas da equipe e compartilhamento simplificado do ranking.

<div align="center">
  <sub>Figura 23 - Fluxo de navegaÃ§Ã£o da Persona Corredor</sub><br>
  <img src="../assets/design/fluxo_corredor.png" width="100%" alt="Fluxo de navegaÃ§Ã£o do painel pÃºblico da equipe, incluindo acesso via UUID, tela de erro, painel da equipe e compartilhamento do ranking."><br>
  <sup>Fonte: Material produzido pelos autores (2026).</sup>
</div>

O fluxo completo de navegaÃ§Ã£o da persona corredor pode ser consultado em:

- [Fluxo do Corredor](outros/fluxo-corredor.md).

O fluxo apresentado demonstra a navegaÃ§Ã£o simplificada utilizada pelos corredores ao acessarem o painel pÃºblico da equipe por meio do link gerado automaticamente pelo sistema. A estrutura prioriza acesso rÃ¡pido Ã s informaÃ§Ãµes estratÃ©gicas da competiÃ§Ã£o, permitindo acompanhamento contÃ­nuo do desempenho da equipe durante a prova e reduzindo a quantidade de interaÃ§Ãµes necessÃ¡rias para visualizaÃ§Ã£o dos dados mais relevantes da competiÃ§Ã£o.

#### Wireframe de Baixa Fidelidade â Corredores

O wireframe de baixa fidelidade da persona corredor foi desenvolvido para validar rapidamente a organizaÃ§Ã£o estrutural do painel pÃºblico da equipe, priorizando hierarquia visual, distribuiÃ§Ã£o das informaÃ§Ãµes e fluxo simplificado de navegaÃ§Ã£o.

A prototipaÃ§Ã£o buscou representar os principais elementos utilizados pelos atletas durante a competiÃ§Ã£o, incluindo ranking geral, mÃ©tricas da equipe, informaÃ§Ãµes dos corredores e funcionalidades estratÃ©gicas relacionadas ao acompanhamento da prova.

<div align="center">
  <sub>Figura 24 - Wireframe de baixa fidelidade do painel pÃºblico da equipe</sub><br>
  <img src="../assets/design/WF-persona2.png" width="100%" alt="Wireframe de baixa fidelidade do painel pÃºblico da equipe, incluindo ranking, mÃ©tricas dos atletas e acompanhamento da competiÃ§Ã£o."><br>
  <sup>Fonte: Material produzido pelos autores (2026).</sup>
</div>

O wireframe apresentado permitiu validar rapidamente a disposiÃ§Ã£o das informaÃ§Ãµes estratÃ©gicas da competiÃ§Ã£o, garantindo uma navegaÃ§Ã£o simplificada e rÃ¡pida interpretaÃ§Ã£o dos dados pelos corredores durante o evento.

#### Wireframe de Alta Fidelidade â Corredores

Os wireframes de alta fidelidade da persona corredor representam uma versÃ£o visual mais prÃ³xima da interface final da soluÃ§Ã£o, incluindo organizaÃ§Ã£o espacial dos componentes, hierarquia visual, tipografia e estrutura de navegaÃ§Ã£o do painel pÃºblico da equipe. Conforme Garrett (2011), o nÃ­vel de fidelidade de um protÃ³tipo estÃ¡ diretamente relacionado Ã  sua proximidade com a experiÃªncia real do usuÃ¡rio, tornando esse tipo de artefato essencial para validaÃ§Ãµes visuais e operacionais antes da implementaÃ§Ã£o definitiva da interface.

As telas abaixo representam o painel pÃºblico da equipe, desenvolvido para acompanhamento da competiÃ§Ã£o pelos atletas participantes durante a prova. A interface foi projetada para apresentar de forma clara e organizada as principais informaÃ§Ãµes estratÃ©gicas da competiÃ§Ã£o, permitindo rÃ¡pida interpretaÃ§Ã£o dos dados durante o evento.

O layout utiliza cartÃµes informativos, tabelas e indicadores visuais para facilitar a leitura de mÃ©tricas como ranking, pace, velocidade, distÃ¢ncia percorrida e descanso dos atletas. AlÃ©m disso, a interface contempla funcionalidades estratÃ©gicas, como a Calculadora de Descanso e o compartilhamento simplificado do ranking da equipe, priorizando legibilidade, organizaÃ§Ã£o visual e rÃ¡pida navegaÃ§Ã£o durante a competiÃ§Ã£o.

<div align="center">
  <sub>Figura 25 - Painel pÃºblico da equipe</sub><br>
  <img src="../assets/design/wireframe de alta-fi.png" width="100%" alt="Painel pÃºblico da equipe com ranking geral, mÃ©tricas dos atletas, calculadora de descanso e compartilhamento do ranking."><br>
  <sup>Fonte: Material produzido pelos autores (2026).</sup>
</div>

## 3.4. Guia de estilos (sprint 3)

O Guia de Estilos Ã© um documento que define as diretrizes visuais e os padrÃµes utilizados no desenvolvimento de um produto digital, incluindo elementos como cores, tipografia, iconografia, espaÃ§amentos e componentes de interface. Seu objetivo Ã© garantir consistÃªncia visual ao longo de todo o produto, orientando as equipes durante o processo de desenvolvimento e assegurando uma experiÃªncia coesa e de qualidade para o usuÃ¡rio. Ao sistematizar decisÃµes de design, o guia tambÃ©m facilita a aplicaÃ§Ã£o de princÃ­pios de UI e UX de forma integrada e contÃ­nua (PM3, s.d.).

Para garantir essa padronizaÃ§Ã£o, o guia de estilos desenvolvido pelo grupo foi baseado no Logo Package oficial da Red Bull (julho de 2025), documento que estabelece as diretrizes globais de identidade visual da marca. Dessa forma, serÃ¡ facilitada a integraÃ§Ã£o entre a aplicaÃ§Ã£o desenvolvida e os padrÃµes jÃ¡ consolidados pela Red Bull, proporcionando ao usuÃ¡rio uma experiÃªncia visual alinhada Ã  identidade da marca e coerente com suas plataformas existentes.


### 3.4.1 Cores

A paleta de cores da soluÃ§Ã£o foi definida com base na identidade visual da Red Bull, sendo composta por trÃªs cores primÃ¡rias e cinco cores secundÃ¡rias. As cores primÃ¡rias sÃ£o utilizadas nos principais elementos da interface e na comunicaÃ§Ã£o visual do sistema, enquanto as cores secundÃ¡rias auxiliam na composiÃ§Ã£o de fundos, textos, componentes de apoio e detalhes visuais, contribuindo para a padronizaÃ§Ã£o e harmonia da interface.

<div align="center">
  <sub>Figura 7 - Paleta de cores</sub><br>
    <img src="../assets/design/paleta-de-cores.png" width="100%" alt="Paleta de cores do guia de estilos"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

### 3.4.2 Tipografia

<div align="center">
  <sub>Figura 7 - Tipografia</sub><br>
    <img src="../assets/design/tipografia.png" width="100%" alt="Tipografia do guia de estilos"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

### 3.4.3 Iconografia e imagens 

<div align="center">
  <sub>Figura 7 - Ãcones e imagens</sub><br>
    <img src="../assets/design/icones-e-imagens.png" width="100%" alt="Ãcones e imagens do guia de estilos"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>


## 3.5. <a name="prototipo-alta-fidelidade"></a>ProtÃ³tipo de alta fidelidade (sprint 3)

**🔗 Link do protótipo de alta fidelidade (Sprint 3 — Semana 1 + Semana 2):** [Acessar protótipo no Figma](https://www.figma.com/design/EwmFk3rjbrv3SqLx8YGMqD/Prot%C3%B3tipo-AF-Red-Bull-24h?node-id=0-1&t=wad-link)


Esta seÃ§Ã£o apresenta a documentaÃ§Ã£o do protÃ³tipo de alta fidelidade desenvolvido para a aplicaÃ§Ã£o web. O objetivo do protÃ³tipo Ã© representar, de forma visual e funcional, a experiÃªncia que o usuÃ¡rio final terÃ¡ ao interagir com a plataforma. A interface foi projetada com foco em usabilidade, clareza das informaÃ§Ãµes e alinhamento com os fluxos definidos nas User Stories.

AtravÃ©s das telas prototipadas, Ã© possÃ­vel validar a arquitetura de navegaÃ§Ã£o, os componentes-chave da interface e os elementos visuais que compÃµem o sistema. Cada tela foi construÃ­da com base nos requisitos levantados, considerando as funcionalidades essenciais da plataforma, como o painel de administrador e do atleta.

O protÃ³tipo tambÃ©m estÃ¡ servindo como referÃªncia para o desenvolvimento front-end e serÃ¡ utilizado durante as etapas de implementaÃ§Ã£o, testes de usabilidade e iteraÃ§Ã£o do produto.

### Persona 1 - Marina Costa
#### Dashboard Principal
&nbsp; &nbsp; &nbsp; &nbsp;Na figura abaixo encontra-se o Dashboard Principal do sistema WEB, exibindo uma mensagem de boas-vindas ao administrador e um tutorial com o passo a passo para configurar a competiÃ§Ã£o (inserir dados da equipe, gerar UUID, criar equipes e iniciar a competiÃ§Ã£o). Conta com dois atalhos de aÃ§Ã£o rÃ¡pida: "Nova CompetiÃ§Ã£o" e "Ver Ranking", facilitando o acesso Ã s funcionalidades centrais da plataforma.


<div align="center">
  <sub>Figura 1 - Dashboard Principal</sub><br>
    <img src="../assets/design/protÃ³tipo/(1).Dashboard-principal.png"  width="100%" alt="RepresentaÃ§Ã£o da primeira tela do Sistema WEB - O dashboard principal"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

#### Cadastro de nova competiÃ§Ã£o.
&nbsp; &nbsp; &nbsp; &nbsp;Encontra-se abaixo um formulÃ¡rio de cadastro de competiÃ§Ã£o, permitindo ao administrador inserir nome do evento, data, localizaÃ§Ã£o e uma descriÃ§Ã£o opcional. Ao finalizar o preenchimento, o administrador pode confirmar a criaÃ§Ã£o por meio do botÃ£o "Criar nova CompetiÃ§Ã£o" ou cancelar a aÃ§Ã£o e retornar ao Dashboard.


<div align="center">
  <sub>Figura 2 - Cadastro de competiÃ§Ã£o </sub><br>
    <img src="../assets/design/protÃ³tipo/(2).Dashboard-nova-competiÃ§Ã£o.png"  width="100%" alt="RepresentaÃ§Ã£o da tela de cadastro de equipe"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

#### Dashboard pÃ³s-cadastro de CompetiÃ§Ã£o.
&nbsp; &nbsp; &nbsp; &nbsp;Estado do Dashboard apÃ³s o cadastro bem-sucedido de uma competiÃ§Ã£o, exibindo uma mensagem de confirmaÃ§Ã£o "CompetiÃ§Ã£o cadastrada com sucesso!". O tutorial de cadastro de equipes e atletas permanece visÃ­vel, orientando o prÃ³ximo passo do fluxo operacional, e os atalhos de aÃ§Ã£o rÃ¡pida continuam acessÃ­veis.


<div align="center">
  <sub>Figura 3 - CompetiÃ§Ã£o Cadastrada </sub><br>
    <img src="../assets/design/protÃ³tipo/(3).Dashboard-competiÃ§Ã£o-cadastrada.png"  width="100%" alt="RepresentaÃ§Ã£o do dashboard pÃ³s cadastro de equipe"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

#### Painel de equipes (sem equipes cadastradas).
&nbsp; &nbsp; &nbsp; &nbsp;Tela de gerenciamento de equipes no estado inicial, quando nenhuma equipe foi cadastrada ainda. Exibe uma mensagem orientativa indicando que as duas equipes da competiÃ§Ã£o devem ser adicionadas, juntamente com o botÃ£o "+ Adicionar Equipe" para iniciar o cadastro.


<div align="center">
  <sub>Figura 4 - Painel Equipes vazio</sub><br>
    <img src="../assets/design/protÃ³tipo/(4).Paineladmin-sem-equipe-cadastrada.png"  width="100%" alt="RepresentaÃ§Ã£o da tela de cadastro de equipe antes de qualquer cadastro"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

#### Cadastro de equipes.
&nbsp; &nbsp; &nbsp; &nbsp;Encontra-se abaixo a tela de cadastro de equipes, que permite ao administrador inserir o nome da equipe, definir o capitÃ£o e registrar os atletas participantes. O sistema tambÃ©m oferece a opÃ§Ã£o de adicionar novos atletas dinamicamente. Ao finalizar o preenchimento, o administrador pode confirmar a criaÃ§Ã£o da equipe por meio do botÃ£o âCriar Equipeâ ou cancelar a aÃ§Ã£o e retornar Ã  tela anterior.


<div align="center">
  <sub>Figura 5 - Tela de Cadastro das equipes</sub><br>
    <img src="../assets/design/protÃ³tipo/cadastrar-equipes.png"  width="100%" alt="RepresentaÃ§Ã£o da tela de cadastro das equipes"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>


#### Painel de administraÃ§Ã£o das equipes.
&nbsp; &nbsp; &nbsp; &nbsp; Apresenta-se o painel de administraÃ§Ã£o das equipes, que permite ao administrador visualizar todas as equipes cadastradas na competiÃ§Ã£o, acessar links pÃºblicos individuais, editar informaÃ§Ãµes, remover equipes e acessar diretamente o painel operacional de cada grupo. A tela tambÃ©m exibe o status geral da competiÃ§Ã£o em tempo real.


<div align="center">
  <sub>Figura 6 - Painel de admin das equipes</sub><br>
    <img src="../assets/design/protÃ³tipo/painel-admin-equipes.png"  width="100%" alt="RepresentaÃ§Ã£o da tela de admin das equipes"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>


#### Painel operacional das equipes.
&nbsp; &nbsp; &nbsp; &nbsp; Em seguida, apresenta-se o painel operacional da equipe, utilizado pelo juiz para acompanhar o atleta em tempo real durante a corrida, controlar o tempo do turno e registrar checkpoints da competiÃ§Ã£o. A interface tambÃ©m exibe mÃ©tricas da equipe, como distÃ¢ncia percorrida, pace mÃ©dio, tempo ativo e o histÃ³rico dos Ãºltimos checkpoints registrados.


<div align="center">
  <sub>Figura 7 - Painel de operacional das equipes</sub><br>
    <img src="../assets/design/protÃ³tipo/painel-operacional-equipes.png"  width="100%" alt="RepresentaÃ§Ã£o da tela de admin das equipes"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>


#### Painel operacional das equipes com dropdown.
&nbsp; &nbsp; &nbsp; &nbsp;    Abaixo estÃ¡ a funcionalidade de troca de atleta ativo, que permite ao juiz selecionar o prÃ³ximo participante da equipe durante a competiÃ§Ã£o. A tela apresenta o status atual de cada atleta, indicando quais estÃ£o em corrida, em descanso ou prontos para entrar. O processo Ã© realizado por meio de um menu dropdown, proporcionando maior controle operacional e organizaÃ§Ã£o durante os revezamentos.


<div align="center">
  <sub>Figura 8 - Painel de operacional das equipes com dropdown</sub><br>
    <img src="../assets/design/protÃ³tipo/painel-operacional-com-dropdown.png"  width="100%" alt="RepresentaÃ§Ã£o da tela de admin das equipes"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

#### Captura da foto da esteira.
&nbsp; &nbsp; &nbsp; &nbsp;A figura abaixo representa a tela de captura da foto da esteira, utilizada para registrar os dados do participante durante a competiÃ§Ã£o. Nela, o operador pode visualizar a imagem capturada do painel da esteira referente ao checkpoint atual, alÃ©m de optar entre realizar um registro manual ou prosseguir com a captura automÃ¡tica para extraÃ§Ã£o dos dados via OCR, garantindo maior agilidade e precisÃ£o no processo de validaÃ§Ã£o dos checkpoints.



<div align="center">
  <sub>Figura 9 - Captura da foto da esteira </sub><br>
    <img src="../assets/design/protÃ³tipo/(9).Captura-da-foto-da-esteira.png"  width="100%" alt="RepresentaÃ§Ã£o da tela de cadastro de equipe"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

#### Dados extraÃ­dos via OCR.
&nbsp; &nbsp; &nbsp; &nbsp; A figura abaixo apresenta a tela de validaÃ§Ã£o dos dados extraÃ­dos automaticamente via OCR a partir da foto capturada da esteira. Nela, o operador pode visualizar a imagem utilizada no processamento, conferir as informaÃ§Ãµes identificadas pelo sistema, como distÃ¢ncia, pace e tempo, alÃ©m de receber alertas em casos de discrepÃ¢ncias nos dados. A interface tambÃ©m permite corrigir manualmente as informaÃ§Ãµes antes da confirmaÃ§Ã£o e salvamento do checkpoint.


<div align="center">
  <sub>Figura 10 - Dados extraÃ­dos via OCR </sub><br>
    <img src="../assets/design/protÃ³tipo/(10).Dados-extraÃ­dos-via-OCR.png"  width="100%" alt="RepresentaÃ§Ã£o da tela de cadastro de equipe"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

#### Registro Manual.
&nbsp; &nbsp; &nbsp; &nbsp;A figura abaixo representa a tela de registro manual de checkpoints, utilizada em situaÃ§Ãµes nas quais a captura automÃ¡tica ou a leitura via OCR nÃ£o funcionem corretamente. Nela, o operador pode inserir manualmente os dados do atleta, como distÃ¢ncia percorrida, pace e tempo total, garantindo a continuidade do registro da competiÃ§Ã£o. A interface tambÃ©m exibe um alerta indicando que a aÃ§Ã£o serÃ¡ registrada no log de auditoria do sistema para fins de rastreabilidade e validaÃ§Ã£o posterior.


<div align="center">
  <sub>Figura 11 -  Registro Manual </sub><br>
    <img src="../assets/design/protÃ³tipo/(11).Registro-manual.png"  width="100%" alt="RepresentaÃ§Ã£o da tela de cadastro de equipe"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

#### Checkpoints salvos.
&nbsp; &nbsp; &nbsp; &nbsp;A figura abaixo apresenta a tela de visualizaÃ§Ã£o dos checkpoints salvos da equipe durante a competiÃ§Ã£o. Nela, o operador pode acompanhar mÃ©tricas gerais da equipe, como distÃ¢ncia acumulada, pace mÃ©dio e tempo total registrado, alÃ©m de visualizar o histÃ³rico completo dos checkpoints realizados por cada atleta. A interface tambÃ©m informa o mÃ©todo utilizado em cada registro, permitindo identificar se os dados foram capturados automaticamente ou inseridos manualmente, garantindo maior controle e rastreabilidade das informaÃ§Ãµes registradas no sistema.


<div align="center">
  <sub>Figura 12 -  Checkpoints salvos </sub><br>
    <img src="../assets/design/protÃ³tipo/(12).Checkpoints-Salvos.png"  width="100%" alt="RepresentaÃ§Ã£o da tela de cadastro de equipe"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>


### Ranking em tempo real

Tela de ranking em tempo real da competiÃ§Ã£o, exibindo mÃ©tricas globais como total de quilÃ´metros percorridos, pace mÃ©dio global e nÃºmero de checkpoints. Na seÃ§Ã£o "Disputa ao vivo", sÃ£o apresentadas as duas equipes em competiÃ§Ã£o, com a diferenÃ§a de quilÃ´metros entre elas. Ao final, exibe os atletas atualmente em corrida, com informaÃ§Ãµes individuais de distÃ¢ncia, pace atual e Ãºltimo checkpoint registrado. Um botÃ£o "Congelar ranking" estÃ¡ disponÃ­vel no canto superior direito para pausar a atualizaÃ§Ã£o em tempo real.

<div align="center">
  <sub>Figura 5 - Ranking em tempo real</sub><br>
    <img src="../assets/design/protÃ³tipo/Ranking.png"  width="100%" alt="RepresentaÃ§Ã£o da tela de ranking em tempo real da competiÃ§Ã£o"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

#### RelatÃ³rio da competiÃ§Ã£o

Tela de relatÃ³rio final da competiÃ§Ã£o, apresentando um resumo geral com total de quilÃ´metros percorridos, mÃ©dia geral de pace e nÃºmero de checkpoints. Exibe um grÃ¡fico de linha com a evoluÃ§Ã£o das posiÃ§Ãµes das equipes ao longo do tempo (de 0h a 24h), permitindo visualizar as variaÃ§Ãµes de lideranÃ§a durante a prova. Abaixo, hÃ¡ uma seÃ§Ã£o de "RelatÃ³rio de inconsistÃªncias" com uma tabela de registros corrigidos manualmente, contendo informaÃ§Ãµes de data, atleta, equipe, checkpoint, valor OCR original, valor corrigido, diferenÃ§a e usuÃ¡rio responsÃ¡vel pela correÃ§Ã£o. Um botÃ£o "Log de Auditoria" e outro de "Exportar dados" estÃ£o disponÃ­veis para rastreabilidade e extraÃ§Ã£o das informaÃ§Ãµes.

<div align="center">
  <sub>Figura 6 - RelatÃ³rio da competiÃ§Ã£o</sub><br>
    <img src="../assets/design/protÃ³tipo/RelatÃ³rios.png"  width="100%" alt="RepresentaÃ§Ã£o da tela de relatÃ³rio da competiÃ§Ã£o com grÃ¡fico e tabela de inconsistÃªncias"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

### Persona 3 - Amanda Azevedo

#### Painel operacional da equipe.
Painel operacional da Equipe, acessado apenas pelos integrantes da mesma, exibindo mÃ©tricas em tempo real como tempo de competiÃ§Ã£o, distÃ¢ncia para o lÃ­der e pace mÃ©dio da equipe. A seÃ§Ã£o "Status por atleta da equipe" apresenta uma tabela com dados individuais de cada atleta, incluindo pace mÃ©dio geral, velocidade mÃ¡xima, distÃ¢ncia percorrida e Ãºltimo checkpoint registrado. Na parte inferior, a "Calculadora de descanso" indica que o atleta atual atingiu 100% do tempo de descanso recomendado (50 min) e estÃ¡ pronto para voltar, apontando o prÃ³ximo atleta como Rafael Lima. Um grÃ¡fico de posiÃ§Ã£o ao longo do tempo complementa o painel, permitindo ao capitÃ£o acompanhar a evoluÃ§Ã£o da equipe na disputa.

Durante o processo de validaÃ§Ã£o com o parceiro de projeto, foi identificado que as competiÃ§Ãµes Red Bull 24h nÃ£o ocorrem simultaneamente em diferentes localidades do Brasil, o que inviabilizou a existÃªncia de um ranking global entre eventos distintos. Essa informaÃ§Ã£o levou Ã  reestruturaÃ§Ã£o da tela de equipe, com a remoÃ§Ã£o do componente de "Ranking global" e a adiÃ§Ã£o de modais quantitativos exibindo o tempo total de competiÃ§Ã£o e o pace mÃ©dio da equipe, alÃ©m de um grÃ¡fico de evoluÃ§Ã£o da posiÃ§Ã£o da equipe ao longo do evento em funÃ§Ã£o do tempo, tornando o painel mais aderente Ã  realidade operacional da competiÃ§Ã£o.

<div align="center">
  <sub>Figura 7 - Painel operacional da equipe</sub><br>
    <img src="../assets/design/protÃ³tipo/Equipes.png"  width="100%" alt="RepresentaÃ§Ã£o do painel da equipe acessada vis UUID"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>


## 3.6. Modelagem do banco de dados (sprints 2 e 4)

### 3.6.1. Modelo Entidade-Relacionamento (ER) (sprint 2)

O Modelo Entidade-Relacionamento (MER), tambÃ©m conhecido como modelo ER, Ã© uma modelagem conceitual utilizada para representar os objetos envolvidos em um domÃ­nio de negÃ³cio, suas caracterÃ­sticas e os relacionamentos existentes entre eles (DEVMEDIA, 2014). Essa modelagem Ã© composta por entidades, atributos e relacionamentos, permitindo transformar informaÃ§Ãµes em uma representaÃ§Ã£o visual, o que facilita a compreensÃ£o e a validaÃ§Ã£o da estrutura do sistema por diferentes integrantes da equipe, como desenvolvedores, Scrum Master, Product Owner e Stakeholders.

De forma mais detalhada, as entidades, representadas por retÃ¢ngulos, correspondem aos elementos relevantes do domÃ­nio do sistema, como pessoas, objetos, locais, eventos ou conceitos. As entidades possuem atributos, representados por elipses, responsÃ¡veis por descrever suas caracterÃ­sticas, como nome, endereÃ§o e CPF na entidade Aluno. Esses atributos sÃ£o essenciais para o armazenamento de informaÃ§Ãµes relevantes dentro do contexto do banco de dados. AlÃ©m disso, existem os relacionamentos, representados por losangos contendo o verbo que descreve a interaÃ§Ã£o entre as entidades, responsÃ¡veis por demonstrar as associaÃ§Ãµes existentes entre elas.

AlÃ©m disso, o relacionamento entre entidades Ã© feito atravÃ©s de uma linha, que contÃ©m as cardinalidades, representaÃ§Ã£o numÃ©rica que identifica quantas instÃ¢ncias de uma entidade podem se relacionar com instÃ¢ncias de outra. A seguir, o Quadro 25 apresenta as principais cardinalidades e a sua utilizaÃ§Ã£o.

<div align="center">
  <sub>Quadro 25 - Cardinalidades </sub>
</div>

| Cardinalidade |  Leitura | Exemplo de AplicaÃ§Ã£o |
| -------- | --------- | --------- |  
| 1:1Â | Um para Um | Cada pessoa tem exatamente um CPF |
| 1:NÂ | Um para Muitos | Um cliente pode ter vÃ¡rios pedidos, mas cada pedido pertence a um Ãºnico cliente |
| N:MÂ | Muitos para Muitos | Um pedido pode conter vÃ¡rios produtos, e um produto pode aparecer em vÃ¡rios pedidos. |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

A seguir, a Figura 26 ilustra o Modelo Entidade Relacionamento desenvolvido para o projeto.

<div align="center">
  <sub>Figura 26 - Modelo Entidade Relacionamento</sub><br>
    <img src="../assets/modelo-er.png" width="100%" alt="RepresentaÃ§Ã£o do Modelo Entidade Relacionamento"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

#### DescriÃ§Ã£o das entidades e relacionamentos

A seguir, o Quadro 26 apresenta cada entidade, seu papel e os relacionamentos que desempenha no sistema.

<div align="center">
  <sub>Quadro 26 - DescriÃ§Ã£o das entidades e relacionamentos</sub>
</div>

| Entidade | Papel no sistema | Relacionamentos |
| --------- | ---------------- | --------------- |
| CompetiÃ§Ã£o | Representa o evento Red Bull 24h | Possui N Equipes, Possui N Esteiras |
| Equipe | Agrupa corredores sob um identificador Ãºnico | Pertence a 1 CompetiÃ§Ã£o, Possui N Corredores |
| Corredor | Atleta participante vinculado a uma equipe | Pertence a 1 Equipe, Possui N Checkpoints |
| Checkpoint | Registro de performance do corredor na esteira | Pertence a 1 Corredor, Pertence a 1 Esteira, Possui N:1 Administrador | 
| Administrador | Operador responsÃ¡vel por registrar checkpoints | Possui N Checkpoints |
| Esteira | Equipamento onde a corrida Ã© realizada | Pertence a N CompetiÃ§Ãµes, possui N Checkpoints |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

Em relaÃ§Ã£o Ã  diferenÃ§a entre o modelo conceitual (MER) e o modelo fÃ­sico (SQL), o MER representa de forma abstrata a estrutura que o banco de dados deverÃ¡ possuir, focando apenas na organizaÃ§Ã£o das informaÃ§Ãµes e em seus relacionamentos. JÃ¡ o modelo fÃ­sico apresenta a implementaÃ§Ã£o prÃ¡tica no banco de dados, contendo elementos adicionais, como chaves estrangeiras, tabelas associativas e definiÃ§Ãµes especÃ­ficas da linguagem SQL, necessÃ¡rios para o funcionamento do sistema em um contexto relacional.

A seguir, o Quadro 27 exemplifica os elementos da notaÃ§Ã£o de Chen utilizados no MER.

<div align="center">
  <sub>Quadro 27 - ExemplificaÃ§Ã£o dos elementos da notaÃ§Ã£o de Chen </sub>
</div>

| Elemento |  SÃ­mbolo  | AplicaÃ§Ã£o ao MER |
| -------- | --------- | ---------------- |
| Entidade | RetÃ¢ngulo | CompetiÃ§Ã£o, Equipe, Corredor, Checkpoint, Administrador e Esteira |
| Atributo | Elipse    | endereÃ§o em "CompetiÃ§Ã£o", nome em "Corredor" |
| Relacionamento | Losango | Equipe possui Corredor |
| Cardinalidade | 1, N nas arestas | Um corredor possui N checkpoints |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

#### DicionÃ¡rio de dados

Por meio de quadros, serÃ¡ detalhado cada entidade, listando seus atributos baseados no tipo semÃ¢ntico e descriÃ§Ã£o afim de contextualizar a implementaÃ§Ã£o ao sistema.

O Quadro 28 apresenta a entidade e os atributos de "CompetiÃ§Ã£o".

<div align="center">
  <sub>Quadro 28 - DicionÃ¡rio de Dados da Entidade CompetiÃ§Ã£o</sub>
</div>

| Entidade | Atributo | Tipo semÃ¢ntico | DescriÃ§Ã£o |
| -------- | --------- | -------------- | --------- | 
| CompetiÃ§Ã£o | CÃ³digo | Identificador | Identifica unicamente cada competiÃ§Ã£o | 
| CompetiÃ§Ã£o | EndereÃ§o | Texto | Local onde a competiÃ§Ã£o ocorre | 
| CompetiÃ§Ã£o | Data | Data | Data de realizaÃ§Ã£o da competiÃ§Ã£o |
| CompetiÃ§Ã£o | Criado_em | Data/Hora | Armazena a data e o horÃ¡rio em que o registro foi inserido no sistema |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

A seguir, o Quadro 29 ilustra a entidade Equipe e os seus atributos.

<div align="center">
  <sub>Quadro 29 - DicionÃ¡rio de Dados da Entidade Equipe</sub>
</div>

| Entidade | Atributo | Tipo semÃ¢ntico | DescriÃ§Ã£o |
| -------- | --------- | -------------- | --------- | 
| Equipe | CÃ³digo | Identificador | Identifica unicamente cada equipe |
| Equipe | Nome | Texto | Nome da equipe |
| Equipe | UUID | Identificador Ãºnico pÃºblico | CÃ³digo distribuÃ­do ao capitÃ£o para acesso sem login |
| Equipe | Qr_Code | Imagem | RepresentaÃ§Ã£o visual gerada a partir do UUID |
| Equipe | Criado_em | Data/Hora | Armazena a data e o horÃ¡rio em que o registro foi inserido no sistema |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

O Quadro 30 representa o dicionÃ¡rio de dados da entidade Corredor.

<div align="center">
  <sub>Quadro 30 - DicionÃ¡rio de Dados da Entidade Corredor</sub>
</div>

| Entidade | Atributo | Tipo semÃ¢ntico | DescriÃ§Ã£o |
| -------- | --------- | -------------- | --------- | 
| Corredor | CÃ³digo | Identificador | Identifica unicamente cada corredor | 
| Corredor | Nome | Texto | Nome completo do corredor |
| Corredor | CPF | Texto | Documento de identificaÃ§Ã£o civil Ãºnico |
| Corredor | Email | Texto | EndereÃ§o de e-mail do corredor | 
| Corredor | Telefone | Texto | Contato telefÃ´nico do corredor | 
| Corredor | Status | CategÃ³rico | Papel do corredor na equipe: corredor ou capitÃ£o |
| Corredor | Criado_em | Data/Hora | Armazena a data e o horÃ¡rio em que o registro foi inserido no sistema |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

O Quadro 31 apresenta a entidade e os atributos de "Checkpoint".

<div align="center">
  <sub>Quadro 31 - DicionÃ¡rio de Dados da Entidade Checkpoint</sub>
</div>

| Entidade | Atributo | Tipo semÃ¢ntico | DescriÃ§Ã£o |
| -------- | --------- | -------------- | --------- | 
| Checkpoint | CÃ³digo | Identificador | Identifica unicamente cada checkpoint |
| Checkpoint | Identificador | NÃºmero | Identifica cada checkpoint e possibilita rastreabilidade e auditoria dos registros |
| Checkpoint | Km | NumÃ©rico decimal | DistÃ¢ncia percorrida registrada |
| Checkpoint | Pace | NumÃ©rico decimal | Ritmo mÃ©dio em minutos por km |
| Checkpoint | Tempo | DuraÃ§Ã£o | Tempo total na esteira |
| Checkpoint | Imagem | Arquivo | Foto do painel da esteira capturada via OCR |
| Checkpoint | Criado_em | Data/Hora | Armazena a data e o horÃ¡rio em que o registro foi inserido no sistema |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

A seguir, o Quadro 32 ilustra a entidade Administrador e os seus atributos.

<div align="center">
  <sub>Quadro 32 - DicionÃ¡rio de Dados da Entidade Administrador</sub>
</div>

| Entidade | Atributo | Tipo semÃ¢ntico | DescriÃ§Ã£o |
| -------- | --------- | -------------- | --------- | 
| Administrador | CÃ³digo | Identificador | Identifica unicamente cada administrador |
| Administrador | Nome | Texto | Nome do administrador |
| Administrador | Ãrea | Texto | Ãrea de atuaÃ§Ã£o do administrador | 
| Administrador | Senha | Texto protegido | Credencial de acesso ao painel administrativo |
| Administrador | Criado_em | Data/Hora | Armazena a data e o horÃ¡rio em que o registro foi inserido no sistema |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

O Quadro 33 representa o dicionÃ¡rio de dados da entidade Esteira.

<div align="center">
  <sub>Quadro 33 - DicionÃ¡rio de Dados da Entidade Esteira </sub>
</div>

| Entidade | Atributo | Tipo semÃ¢ntico | DescriÃ§Ã£o |
| -------- | --------- | -------------- | --------- | 
| Esteira | CÃ³digo | Identificador | Identifica unicamente cada esteira |
| Esteira | Nome | Texto | Nome ou apelido da esteira |
| Esteira | EspecificaÃ§Ã£o | Texto | DescriÃ§Ã£o tÃ©cnica do equipamento |
| Esteira | Criado_em | Data/Hora | Armazena a data e o horÃ¡rio em que o registro foi inserido no sistema |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

#### Rastreabilidade entidade â RF â RN

A seguir, o Quadro 34 apresenta a rastreabilidade entre as entidades criadas com os Requisitos Funcionais e NÃ£o Funcionais, para assim, ser possÃ­vel o entendimento e compreensÃ£o integral do sistema:

<div align="center">
  <sub>Quadro 34 - Rastreabilidade entidade â RF â RN </sub>
</div>

| Entidade | RF que origina | RN que governa |
| --------- | -------------- | -------------|
| CompetiÃ§Ã£o | RF001, RF002 | RN14 |
| Equipe | RF003 | RN01, RN02, RN07 | 
| Corredor | RF003 | RN07 | 
| Checkpoint | RF005, RF008 | RN04, RN05, RN12 |
| Administrador | RF004 | RN03 |
| Esteira | RF005 | â |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div> 

### 3.6.2. Diagrama Entidade-Relacionamento (DER) (sprint 2)

O Diagrama Entidade-Relacionamento (DER) Ã© uma ferramenta utilizada na modelagem de bancos de dados para representar, de forma visual, as entidades de um sistema, seus atributos e os relacionamentos existentes entre elas. Esse diagrama auxilia na organizaÃ§Ã£o e estruturaÃ§Ã£o das informaÃ§Ãµes que serÃ£o armazenadas no banco de dados, permitindo uma melhor compreensÃ£o da lÃ³gica do sistema antes de seu desenvolvimento (LUCID SOFTWARE INC., s.d.).

A principal finalidade do DER Ã© facilitar o planejamento do banco de dados, reduzindo erros de estrutura e garantindo que os dados sejam armazenados de maneira organizada e eficiente. AlÃ©m disso, o diagrama contribui para a comunicaÃ§Ã£o entre os membros da equipe, pois apresenta, de forma clara, como as informaÃ§Ãµes se conectam dentro do sistema (DEVMEDIA, 2014).

No contexto do projeto, o DER Ã© importante para representar os elementos fundamentais da plataforma, como competiÃ§Ãµes, equipes, corredores e registros de desempenho. A partir dele, Ã© possÃ­vel visualizar como essas entidades se relacionam, garantindo que o banco de dados suporte corretamente as funcionalidades do sistema, como cadastro de atletas, monitoramento em tempo real e atualizaÃ§Ã£o de rankings. Dessa forma, o DER contribui diretamente para a organizaÃ§Ã£o, integridade e funcionamento adequado do banco de dados do projeto.

### NotaÃ§Ã£o Crow's Foot

Para a construÃ§Ã£o do Diagrama Entidade-Relacionamento (ER) deste projeto, foi utilizada a notaÃ§Ã£o Crowâs Foot. O nome Crowâs Foot (âpÃ© de corvoâ) vem do sÃ­mbolo utilizado para representar relaÃ§Ãµes do tipo âmuitosâ, que possui um formato semelhante Ã s patas de um corvo. 

Por meio dessa representaÃ§Ã£o, Ã© possÃ­vel identificar de forma clara relaÃ§Ãµes como um-para-um (1:1), um-para-muitos (1:N) e muitos-para-muitos (N:N). AlÃ©m das cardinalidades, a notaÃ§Ã£o tambÃ©m permite representar a opcionalidade e a obrigatoriedade dos relacionamentos por meio de sÃ­mbolos especÃ­ficos, como cÃ­rculos e barras, indicando se a participaÃ§Ã£o de uma entidade em um relacionamento Ã© opcional ou obrigatÃ³ria. Dessa forma, a modelagem do banco de dados se torna mais organizada e compreensÃ­vel. (PERERA, 2026)


### GlossÃ¡rio de cardinalidades  

| SÃ­mbolo | Nome | Significado |
|---|---|---|
| `\|` | Um obrigatÃ³rio | Representa exatamente 1 ocorrÃªncia obrigatÃ³ria |
| `<` | Muitos | Representa vÃ¡rias ocorrÃªncias relacionadas |
| `\|âââ\|` | 1:1 (Um para Um) | Uma entidade se relaciona obrigatoriamente com exatamente uma ocorrÃªncia da outra |
| `\|âââ\|<` | 1:N obrigatÃ³rio | Uma entidade se relaciona com uma ou mais ocorrÃªncias obrigatÃ³rias da outra entidade |
| `>\|âââ\|` | N:1 obrigatÃ³rio | VÃ¡rias entidades se relacionam obrigatoriamente com uma Ãºnica ocorrÃªncia da outra entidade |

> A mesma linha carrega as duas direÃ§Ãµes. NÃ£o Ã© preciso desenhar duas setas,


<div align="center">
  <sub>Figura 27 - Diagrama Entidade Relacionamento</sub><br>
    <img src="../assets/Diagrama entidade-relacionamento.png" width="100%" alt="RepresentaÃ§Ã£o do Modelo Entidade Relacionamento"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>


### Relacionamentos do DER

| # | Entidade A | Entidade B | A â B | B â A |
|---|---|---|---|---|
| 1 | COMPETICAO | EQUIPE | 1 competiÃ§Ã£o tem muitas equipes (1:N) | Muitas equipes pertencem a 1 Ãºnica competiÃ§Ã£o (N:1) |
| 2 | EQUIPE | CORREDOR | 1 equipe tem muitos corredores (1:N) | Muitos corredores pertencem a 1 Ãºnica equipe (N:1) |
| 3 | CORREDOR | CHECKPOINT | 1 corredor possui muitos checkpoints (1:N) | Muitos checkpoints pertencem a 1 Ãºnico corredor (N:1) |
| 4 | ADMINISTRADOR | CHECKPOINT | 1 administrador supervisiona muitos checkpoints (1:N) | Muitos checkpoints sÃ£o supervisionados por 1 Ãºnico administrador (N:1) |
| 5 | ESTEIRA | CHECKPOINT | 1 esteira Ã© usada em muitos checkpoints (1:N) | Muitos checkpoints usam 1 Ãºnica esteira (N:1) |
| 6 | COMPETICAO | CHECKPOINT | 1 competiÃ§Ã£o possui muitos checkpoints (1:N) | Muitos checkpoints pertencem a 1 Ãºnica competiÃ§Ã£o (N:1) |

### CoerÃªncia com o Diagrama de Classes

| Diagrama de Classes                                         | DER                                   |
| ----------------------------------------------------------- | ------------------------------------- |
| Classe `CompetiÃ§Ã£o`                                         | Tabela `COMPETICAO`                   |
| Classe `Equipe`                                             | Tabela `EQUIPE`                       |
| Classe `Corredor / Atleta`                                  | Tabela `CORREDOR`                     |
| Classe `Administrador / Juiz`                               | Tabela `ADMINISTRADOR`                |
| Classe `Checkpoint`                                         | Tabela `CHECKPOINT`                   |
| Classe `Esteira`                                            | Tabela `ESTEIRA`                      |
| AssociaÃ§Ã£o `CompetiÃ§Ã£o` possui `Equipe`                     | FK `competicao_id` em `EQUIPE`        |
| AssociaÃ§Ã£o `Equipe` possui `Corredor`                       | FK `equipe_id` em `CORREDOR`          |
| AssociaÃ§Ã£o `Corredor` registra `Checkpoint`                 | FK `corredor_id` em `CHECKPOINT`      |
| AssociaÃ§Ã£o `CompetiÃ§Ã£o` possui `Checkpoint`                 | FK `competicao_id` em `CHECKPOINT`    |
| AssociaÃ§Ã£o `Esteira` Ã© usada em `Checkpoint`                | FK `esteira_id` em `CHECKPOINT`       |
| AssociaÃ§Ã£o `Administrador` valida/supervisiona `Checkpoint` | FK `administrador_id` em `CHECKPOINT` |


### 3.6.3. Modelo Relacional e Modelo FÃ­sico (sprints 2 e 4)

O modelo relacional consiste em uma abordagem de organizaÃ§Ã£o e gerenciamento de dados baseada na representaÃ§Ã£o das informaÃ§Ãµes por meio de relaÃ§Ãµes, normalmente implementadas como tabelas compostas por linhas e colunas. Esse modelo possibilita a definiÃ§Ã£o de entidades, atributos e relacionamentos, alÃ©m de mecanismos que garantem integridade, consistÃªncia e reduÃ§Ã£o de redundÃ¢ncias no armazenamento das informaÃ§Ãµes. Sua estrutura fundamenta-se em conceitos como chaves primÃ¡rias, chaves estrangeiras e restriÃ§Ãµes de integridade, permitindo representar de forma estruturada as regras de negÃ³cio de um sistema (Codd, 1970).

No contexto deste projeto, o modelo relacional foi desenvolvido a partir dos requisitos funcionais e das regras de negÃ³cio levantadas nas etapas anteriores, com o objetivo de estruturar o armazenamento das informaÃ§Ãµes referentes Ã s competiÃ§Ãµes, equipes, corredores, esteiras, registros de desempenho e processos de auditoria. A modelagem proposta busca garantir integridade referencial, rastreabilidade das operaÃ§Ãµes e escalabilidade para futuras evoluÃ§Ãµes do sistema.

#### 3.6.3.1 Modelo Relacional

Com base nos requisitos funcionais, nas regras de negÃ³cio e na modelagem conceitual definida nas etapas anteriores, foi elaborado o modelo relacional do sistema, contemplando as principais entidades, seus atributos e os relacionamentos necessÃ¡rios para garantir integridade e consistÃªncia dos dados. A Figura 28 apresenta a estrutura relacional proposta para o projeto.

<div align="center">
  <sub>Figura 28 - Modelo Relacional</sub><br>
  <img src="../assets/programacao/modelorelacional.png" width="100%" alt="Modelo relacional do sistema representando as tabelas do banco de dados, seus atributos, chaves primÃ¡rias, chaves estrangeiras e os relacionamentos entre competiÃ§Ãµes, equipes, corredores, checkpoints, administradores e esteiras"><br>
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

##### DescriÃ§Ã£o das entidades

**Tabela `competicao`**  
A tabela `competicao` armazena as informaÃ§Ãµes referentes aos eventos esportivos cadastrados na plataforma, incluindo dados relacionados ao endereÃ§o e Ã  data de realizaÃ§Ã£o de cada competiÃ§Ã£o. Essa entidade representa a base organizacional do sistema, servindo como referÃªncia para o cadastro das equipes participantes e para os registros operacionais gerados durante a competiÃ§Ã£o.

**Tabela `equipe`**  
A tabela `equipe` registra os grupos participantes vinculados a uma competiÃ§Ã£o especÃ­fica. AlÃ©m de sua chave primÃ¡ria, contempla atributos de identificaÃ§Ã£o que permitem individualizar cada equipe dentro da plataforma e associÃ¡-la ao respectivo evento esportivo.

**Tabela `corredor`**  
A tabela `corredor` armazena os dados cadastrais dos participantes, incluindo informaÃ§Ãµes de identificaÃ§Ã£o e contato, como nome, email, telefone e CPF, alÃ©m de um indicador de status operacional, utilizado para representar a situaÃ§Ã£o atual do participante no sistema. Por meio da chave estrangeira `equipe_id`, cada corredor Ã© associado Ã  sua respectiva equipe.

**Tabela `esteira`**  
A tabela `esteira` representa os equipamentos utilizados durante a coleta das mÃ©tricas de desempenho dos participantes, armazenando informaÃ§Ãµes que permitem identificar individualmente cada dispositivo utilizado durante a competiÃ§Ã£o.

**Tabela `administrador`**  
A tabela `administrador` armazena os dados dos usuÃ¡rios responsÃ¡veis pela gestÃ£o operacional da plataforma, incluindo informaÃ§Ãµes de identificaÃ§Ã£o, autenticaÃ§Ã£o e rastreabilidade temporal.

**Tabela `checkpoint`**  
A tabela `checkpoint` centraliza os registros operacionais das corridas, armazenando um identificador Ãºnico de registro, mÃ©tricas de desempenho e evidÃªncias capturadas pelo sistema. AlÃ©m disso, essa entidade mantÃ©m relacionamento com as tabelas `corredor`, `competicao`, `esteira` e `administrador`, permitindo rastrear a origem, o contexto e a validaÃ§Ã£o administrativa associada a cada registro.

Adicionalmente, todas as entidades contemplam atributos temporais, como `criado_em`, permitindo rastreabilidade histÃ³rica das operaÃ§Ãµes realizadas na plataforma.

##### Relacionamentos e integridade referencial

Os relacionamentos entre as entidades foram definidos por meio de chaves primÃ¡rias (*Primary Keys*) e chaves estrangeiras (*Foreign Keys*), respeitando as dependÃªncias identificadas durante a modelagem conceitual e garantindo integridade referencial entre as tabelas. Nesse contexto:

- uma `competicao` pode possuir mÃºltiplas `equipes` *(1:N)*;
- uma `equipe` pode possuir mÃºltiplos `corredores` *(1:N)*;
- um `corredor` pode gerar mÃºltiplos `checkpoints` *(1:N)*;
- uma `competicao` pode possuir mÃºltiplos `checkpoints` *(1:N)*;
- uma `esteira` pode estar associada a mÃºltiplos `checkpoints` *(1:N)*;
- Um `administrador` pode validar mÃºltiplos checkpoints (1:N).

##### Constraints do modelo relacional

As constraints do modelo relacional definem as regras de integridade que serÃ£o implementadas posteriormente no modelo fÃ­sico. Elas indicam quais campos identificam unicamente cada registro, quais relacionamentos devem ser preservados entre as tabelas e quais valores precisam respeitar regras especÃ­ficas do domÃ­nio do sistema.

| Tabela | Constraint | Campo(s) | Finalidade |
| :--- | :--- | :--- | :--- |
| Todas as tabelas | `PRIMARY KEY` | `id` | Garante a identificaÃ§Ã£o Ãºnica dos registros principais do sistema. |
| `equipe` | `FOREIGN KEY` | `competicao_id` | Indica que cada equipe pertence a uma competiÃ§Ã£o. |
| `corredor` | `FOREIGN KEY` | `equipe_id` | Indica que cada corredor pertence a uma equipe. |
| `checkpoint` | `FOREIGN KEY` | `corredor_id`, `competicao_id`, `esteira_id`, `administrador_id` | Indica que cada checkpoint deve estar associado a um corredor, uma competiÃ§Ã£o, uma esteira e um administrador. |
| `equipe` | `UNIQUE` | `uuid` | Define que o identificador pÃºblico da equipe nÃ£o pode se repetir. |
| `corredor` | `UNIQUE` | `cpf`, `email` | Define que CPF e email devem ser exclusivos para cada corredor. |
| `checkpoint` | `UNIQUE` | `identificador` | Define que cada registro operacional possui um identificador prÃ³prio. |
| `corredor` | `CHECK` | `status` | Limita o status do participante aos papÃ©is previstos no sistema. |
| `checkpoint` | `CHECK` | `km` | Impede valores incompatÃ­veis com a regra de distÃ¢ncia percorrida. |
| Principais campos obrigatÃ³rios | `NOT NULL` | Campos de identificaÃ§Ã£o, relacionamento e rastreabilidade | Define quais informaÃ§Ãµes mÃ­nimas precisam existir para manter a consistÃªncia dos cadastros e registros operacionais. |


#### 3.6.3.2 Modelo FÃ­sico
Segundo a empresa de tecnologia AMAZON (2024), o modelo fÃ­sico Ã© a Ãºltima etapa da modelagem do banco de dados, refinando aquilo que jÃ¡ foi trabalhado e passando a organizaÃ§Ã£o para uma tecnologia especÃ­fica. Ou seja, representa a implementaÃ§Ã£o do banco de dados no SGBD escolhido, detalhando tabelas, atributos, tipos de dados, chaves primÃ¡rias, chaves estrangeiras e constraints. Nesta seÃ§Ã£o, serÃ£o apresentados os scripts SQL responsÃ¡veis pela criaÃ§Ã£o da estrutura da aplicaÃ§Ã£o do evento Red Bull 24 Horas, garantindo integridade, consistÃªncia e suporte Ã s regras de negÃ³cio do sistema.

O arquivo pode ser visto aqui: [Modelo FÃ­sico](outros/migration.sql).

A implementaÃ§Ã£o fÃ­sica do banco de dados foi elaborada com base na estrutura relacional definida na subseÃ§Ã£o anterior, contemplando a traduÃ§Ã£o das entidades, atributos e relacionamentos em instruÃ§Ãµes DDL (Data Definition Language) executÃ¡veis no PostgreSQL. O arquivo migration.sql reÃºne todas as instruÃ§Ãµes necessÃ¡rias para a criaÃ§Ã£o do esquema, respeitando a ordem de dependÃªncias entre as tabelas e aplicando as restriÃ§Ãµes de integridade identificadas durante a modelagem conceitual e relacional.

#### Tabela CompetiÃ§Ã£o

 
##### Tabela `competicao`
 
```sql
CREATE TABLE competicao (
    id          SMALLINT        NOT NULL GENERATED ALWAYS AS IDENTITY,
    endereco    VARCHAR(255)    NOT NULL,
    data        DATE            NOT NULL,
    criado_em   TIMESTAMP       NOT NULL DEFAULT NOW(),
 
    PRIMARY KEY (id)
);
 
CREATE INDEX idx_competicao_data ON competicao (data);
```

A tabela **competiÃ§Ã£o** nÃ£o possui dependÃªncias externas e, portanto, Ã© criada em primeiro lugar. O campo **id** Ã© do tipo `SMALLINT` â equivalente ao `int2` definido no modelo relacional â e utiliza `GENERATED ALWAYS AS IDENTITY` para geraÃ§Ã£o automÃ¡tica e sequencial de identificadores. O campo **endereÃ§o** Ã© definido como `NOT NULL`, pois toda competiÃ§Ã£o deve possuir um local de realizaÃ§Ã£o. O campo **data** armazena exclusivamente a data do evento, sem componente horÃ¡ria. O atributo `criado_em` recebe `DEFAULT NOW()`, garantindo rastreabilidade automÃ¡tica da criaÃ§Ã£o do registro sem exigir intervenÃ§Ã£o da aplicaÃ§Ã£o. Um **Ã­ndice** Ã© criado sobre `data` para otimizar consultas por perÃ­odo de realizaÃ§Ã£o.

#### Tabela equipe
```sql
CREATE TABLE equipe (
    id              SMALLINT        NOT NULL GENERATED ALWAYS AS IDENTITY,
    nome            VARCHAR(100)    NOT NULL,
    uuid            UUID            NOT NULL DEFAULT gen_random_uuid(),
    qr_code         JSON            NULL,
    competicao_id   SMALLINT        NOT NULL,
    criado_em       TIMESTAMP       NOT NULL DEFAULT NOW(),
 
    PRIMARY KEY (id),
    UNIQUE (uuid)
);
 
ALTER TABLE equipe
    ADD CONSTRAINT equipe_competicao_id_foreign
    FOREIGN KEY (competicao_id) REFERENCES competicao (id);
 
CREATE INDEX idx_equipe_competicao_id ON equipe (competicao_id);
```
A tabela **equipe** depende de **competiÃ§Ã£o** por meio da chave estrangeira `competicao_id`. O campo **uuid** utiliza `gen_random_uuid()` como valor padrÃ£o e possui restriÃ§Ã£o `UNIQUE`, garantindo que cada equipe possua um identificador pÃºblico Ãºnico e nÃ£o sequencial, adequado para exposiÃ§Ã£o em QR Codes sem revelar o `id` interno numÃ©rico. O campo **qr_code** Ã© armazenado como `JSON` e definido como `NULL`, pois pode ser gerado em etapa posterior ao cadastro inicial. O Ã­ndice sobre `competicao_id` otimiza operaÃ§Ãµes de junÃ§Ã£o entre as tabelas.

#### Tabela corredor
 
```sql
CREATE TABLE corredor (
    id          SMALLINT        NOT NULL GENERATED ALWAYS AS IDENTITY,
    nome        VARCHAR(100)    NOT NULL,
    status      VARCHAR(50)     NOT NULL DEFAULT 'corredor',
    email       VARCHAR(150)    NOT NULL,
    telefone    VARCHAR(20)     NULL,
    cpf         VARCHAR(14)     NOT NULL,
    equipe_id   SMALLINT        NOT NULL,
    criado_em   TIMESTAMP       NOT NULL DEFAULT NOW(),
 
    PRIMARY KEY (id),
    UNIQUE (cpf),
    UNIQUE (email),
    CHECK (status IN ('corredor', 'capitao'))
);
 
ALTER TABLE corredor
    ADD CONSTRAINT corredor_equipe_id_foreign
    FOREIGN KEY (equipe_id) REFERENCES equipe (id);
 
CREATE INDEX idx_corredor_equipe_id ON corredor (equipe_id);
CREATE INDEX idx_corredor_cpf       ON corredor (cpf);
```
 
A tabela **corredor** depende de **equipe** por meio da chave estrangeira `equipe_id`. Os campos **cpf** e **email** possuem restriÃ§Ã£o `UNIQUE` para garantir que nÃ£o existam dois participantes cadastrados com os mesmos dados de identificaÃ§Ã£o. O `cpf` Ã© armazenado como `VARCHAR(14)` para comportar o formato com mÃ¡scara (`000.000.000-00`). O campo **status** recebe `DEFAULT 'corredor'` no momento do cadastro e Ã© validado pela restriÃ§Ã£o `CHECK`, que restringe os valores aceitos a `'corredor'` e `'capitao'`, diferenciando participantes comuns dos responsÃ¡veis pela equipe. O campo **telefone** Ã© opcional e, por isso, definido como `NULL`. Dois Ã­ndices sÃ£o criados: um sobre `equipe_id` para otimizar junÃ§Ãµes e outro sobre `cpf` para acelerar buscas por identificaÃ§Ã£o.
 

#### Tabela esteira
 
```sql
CREATE TABLE esteira (
    id              SMALLINT    NOT NULL GENERATED ALWAYS AS IDENTITY,
    nome            TEXT        NOT NULL,
    especificacao   TEXT        NULL,
    criado_em       TIMESTAMP   NOT NULL DEFAULT NOW(),
 
    PRIMARY KEY (id)
);
```
 
A tabela **esteira** nÃ£o possui chaves estrangeiras e pode ser criada de forma independente. Os campos **nome** e **especificacao** utilizam o tipo `TEXT`, adequado para descriÃ§Ãµes sem limite de comprimento predefinido. O campo **especificacao** Ã© opcional, pois nem todos os equipamentos exigem detalhamento tÃ©cnico no momento do cadastro.

#### Tabela administrador
 
```sql
CREATE TABLE administrador (
    id          SMALLINT        NOT NULL GENERATED ALWAYS AS IDENTITY,
    nome        VARCHAR(100)    NOT NULL,
    area        VARCHAR(100)    NULL,
    senha       VARCHAR(255)    NOT NULL,
    criado_em   TIMESTAMP       NOT NULL DEFAULT NOW(),
 
    PRIMARY KEY (id)
);
```
A tabela **administrador** tambÃ©m nÃ£o possui chaves estrangeiras, sendo criada de forma independente antes da tabela **checkpoint**, da qual Ã© referenciada. O campo **senha** utiliza `VARCHAR(255)` para armazenar o hash gerado por algoritmos como bcrypt ou Argon2, que produzem saÃ­das de atÃ© 100 caracteres â nunca a senha em texto puro. O campo **area** Ã© opcional e representa a Ã¡rea de atuaÃ§Ã£o do usuÃ¡rio dentro da plataforma, podendo ser preenchido em etapa posterior ao cadastro.
 
 #### Tabela checkpoint
 
```sql
CREATE TABLE checkpoint (
    id                  SMALLINT        NOT NULL GENERATED ALWAYS AS IDENTITY,
    identificador       VARCHAR(100)    NOT NULL,
    km                  NUMERIC(6, 3)   NOT NULL,
    pace                VARCHAR(20)     NULL,
    tempo               VARCHAR(20)     NULL,
    imagem              JSON            NULL,
    corredor_id         SMALLINT        NOT NULL,
    competicao_id       SMALLINT        NOT NULL,
    esteira_id          SMALLINT        NOT NULL,
    administrador_id    SMALLINT        NOT NULL,
    criado_em           TIMESTAMP       NOT NULL DEFAULT NOW(),
 
    PRIMARY KEY (id),
    UNIQUE (identificador),
    CHECK (km >= 0)
);
 
ALTER TABLE checkpoint
    ADD CONSTRAINT checkpoint_corredor_id_foreign
    FOREIGN KEY (corredor_id) REFERENCES corredor (id);
 
ALTER TABLE checkpoint
    ADD CONSTRAINT checkpoint_competicao_id_foreign
    FOREIGN KEY (competicao_id) REFERENCES competicao (id);
 
ALTER TABLE checkpoint
    ADD CONSTRAINT checkpoint_esteira_id_foreign
    FOREIGN KEY (esteira_id) REFERENCES esteira (id);
 
ALTER TABLE checkpoint
    ADD CONSTRAINT checkpoint_administrador_id_foreign
    FOREIGN KEY (administrador_id) REFERENCES administrador (id);
 
CREATE INDEX idx_checkpoint_corredor_id       ON checkpoint (corredor_id);
CREATE INDEX idx_checkpoint_competicao_id     ON checkpoint (competicao_id);
CREATE INDEX idx_checkpoint_esteira_id        ON checkpoint (esteira_id);
CREATE INDEX idx_checkpoint_administrador_id  ON checkpoint (administrador_id);
CREATE INDEX idx_checkpoint_criado_em         ON checkpoint (criado_em);
```
 
A tabela **checkpoint** Ã© a entidade central do sistema operacional e a Ãºltima a ser criada, pois concentra quatro chaves estrangeiras: `corredor_id`, `competicao_id`, `esteira_id` e `administrador_id`. O campo **km** utiliza o tipo `NUMERIC(6, 3)`, que suporta atÃ© trÃªs casas decimais de precisÃ£o, adequado para registros de distÃ¢ncia como `42,195 km`. A restriÃ§Ã£o `CHECK (km >= 0)` assegura que nenhum valor negativo seja inserido. Os campos **pace** e **tempo** sÃ£o armazenados como `VARCHAR`, pois seguem formatos textuais como `"5:30/km"` e `"01:23:45"`, sendo opcionais pois podem nÃ£o estar disponÃ­veis em todos os registros. O campo **imagem** Ã© definido como `JSON` para armazenar metadados ou referÃªncias das evidÃªncias capturadas no ponto de controle. O campo **identificador** possui restriÃ§Ã£o `UNIQUE` para garantir unicidade entre os registros operacionais. O campo **administrador_id** registra qual usuÃ¡rio administrativo foi responsÃ¡vel pelo checkpoint, refletindo a relaÃ§Ã£o *1:N* entre administrador e checkpoints â um administrador pode estar associado a mÃºltiplos registros ao longo de uma competiÃ§Ã£o. Cinco Ã­ndices sÃ£o criados: quatro sobre as chaves estrangeiras para otimizar junÃ§Ãµes e um sobre `criado_em` para acelerar relatÃ³rios cronolÃ³gicos de desempenho.

##### ConsideraÃ§Ãµes gerais sobre a implementaÃ§Ã£o
 
A implementaÃ§Ã£o fÃ­sica adota o padrÃ£o de separar a definiÃ§Ã£o das colunas e restriÃ§Ãµes estruturais (`PRIMARY KEY`, `UNIQUE`, `CHECK`) dentro do bloco `CREATE TABLE`, enquanto os relacionamentos externos sÃ£o adicionados via `ALTER TABLE ... ADD CONSTRAINT` logo apÃ³s cada tabela. Essa abordagem favorece a legibilidade, facilita a manutenÃ§Ã£o incremental do esquema e permite que as instruÃ§Ãµes DDL sejam executadas de forma modular.
 
Todos os campos de identificaÃ§Ã£o seguem o tipo `SMALLINT` â equivalente ao `int2` definido no modelo relacional â com geraÃ§Ã£o automÃ¡tica por `GENERATED ALWAYS AS IDENTITY`. Adicionalmente, todos os campos de auditoria temporal (`criado_em`) sÃ£o preenchidos automaticamente por meio de `DEFAULT NOW()`, garantindo rastreabilidade histÃ³rica sem exigir intervenÃ§Ã£o da aplicaÃ§Ã£o. A implementaÃ§Ã£o completa e executÃ¡vel encontra-se no arquivo `migration.sql`, disponÃ­vel no repositÃ³rio do projeto.

### 3.6.4. Consultas SQL e lÃ³gica proposicional (sprint 2)

A presente subseÃ§Ã£o apresenta um conjunto de consultas SQL utilizadas pela aplicaÃ§Ã£o, selecionadas para demonstrar a diversidade de operaÃ§Ãµes (`SELECT`, `UPDATE`, `DELETE`) e de combinaÃ§Ãµes lÃ³gicas (`AND`, `OR`, `NOT`, `LIKE`, `NOT LIKE`, `IN`, `NOT IN`, `BETWEEN`) suportadas pela modelagem definida nas seÃ§Ãµes anteriores. Cada consulta Ã© apresentada com seu cÃ³digo SQL, descriÃ§Ã£o em palavras, e a estrutura prevista para o preenchimento das proposiÃ§Ãµes lÃ³gicas, da expressÃ£o lÃ³gica proposicional e da tabela-verdade.

O cÃ³digo completo das consultas com suas respectivas anÃ¡lises proposicionais encontra-se tambÃ©m documentado no arquivo [`documentos/outros/mapeamento-consultas-sql.md`](../outros/mapeamento-consultas-sql.md), disponÃ­vel no repositÃ³rio para consulta e rastreabilidade.

#### Q01 â `SELECT` com `AND` e `OR`

<div align="center">
  <sub>Quadro 36 - Consulta Q01</sub>
</div>

| Atributo | ConteÃºdo |
|----------|----------|
| **Tipo de operaÃ§Ã£o** | `SELECT` |
| **Operadores lÃ³gicos** | `AND`, `OR` |
| **Operadores relacionais** | `=`, `>`, `<` |
| **Contexto de negÃ³cio** | Identificar checkpoints com quilometragem fora da faixa esperada em uma competiÃ§Ã£o, sinalizando registros candidatos a revisÃ£o manual. |

<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

**ExpressÃ£o SQL:**

```sql
SELECT id, identificador, km, criado_em
FROM checkpoint
WHERE competicao_id = 1
  AND (km > 10 OR km < 2);
```

**DescriÃ§Ã£o em palavras:** seleciona o identificador, a quilometragem e a data de criaÃ§Ã£o dos checkpoints pertencentes Ã  competiÃ§Ã£o de identificador `1` cuja quilometragem registrada estÃ¡ fora da faixa esperada de 2 a 10 km. A clÃ¡usula `WHERE` combina trÃªs condiÃ§Ãµes: o filtro obrigatÃ³rio por competiÃ§Ã£o Ã© exigido em conjunto (`AND`) com uma disjunÃ§Ã£o (`OR`) entre dois extremos de quilometragem, agrupada por parÃªnteses para garantir a precedÃªncia correta entre `AND` e `OR`.

#### ProposiÃ§Ãµes lÃ³gicas

Considerando a clÃ¡usula `WHERE`, definem-se as seguintes proposiÃ§Ãµes atÃ´micas:

- **P:** o checkpoint pertence Ã  competiÃ§Ã£o de ID 1.  
  `competicao_id = 1`

- **Q:** o checkpoint possui quilometragem maior que 10 km.  
  `km > 10`

- **R:** o checkpoint possui quilometragem menor que 2 km.  
  `km < 2`

#### ExpressÃ£o lÃ³gica proposicional

A expressÃ£o lÃ³gica correspondente Ã  consulta Ã©:

```text
P â§ (Q â¨ R)
```

Em palavras:  
o checkpoint serÃ¡ selecionado se pertencer Ã  competiÃ§Ã£o 1 e possuir quilometragem maior que 10 km ou menor que 2 km.

#### IdentificaÃ§Ã£o dos conectivos lÃ³gicos

- **â§ (AND):** exige que ambas as condiÃ§Ãµes relacionadas sejam verdadeiras em conjunto;
- **â¨ (OR):** permite que pelo menos uma das condiÃ§Ãµes de quilometragem seja verdadeira.

#### Tabela-verdade

| P | Q | R | Q â¨ R | P â§ (Q â¨ R) | Resultado |
|---|---|---|---|---|---|
| V | V | V | V | V | Seleciona |
| V | V | F | V | V | Seleciona |
| V | F | V | V | V | Seleciona |
| V | F | F | F | F | NÃ£o seleciona |
| F | V | V | V | F | NÃ£o seleciona |
| F | V | F | V | F | NÃ£o seleciona |
| F | F | V | V | F | NÃ£o seleciona |
| F | F | F | F | F | NÃ£o seleciona |

### InterpretaÃ§Ã£o da tabela-verdade

A tabela demonstra que a consulta retorna registros apenas quando o checkpoint pertence Ã  competiÃ§Ã£o de identificador 1 e, ao mesmo tempo, apresenta quilometragem fora da faixa esperada. Caso o checkpoint nÃ£o pertenÃ§a Ã  competiÃ§Ã£o especificada ou esteja dentro da faixa entre 2 e 10 km, o registro nÃ£o serÃ¡ selecionado.

#### Q02 â `SELECT` com `LIKE`, `AND` e `NOT`

<div align="center">
  <sub>Quadro 37 - Consulta Q02</sub>
</div>


| Atributo | ConteÃºdo |
|----------|----------|
| **Tipo de operaÃ§Ã£o** | `SELECT` |
| **Operadores lÃ³gicos** | `AND`, `NOT` |
| **Operadores especiais** | `LIKE` |
| **Operadores relacionais** | `=` |
| **Contexto de negÃ³cio** | Listar corredores ativos cujo nome comeÃ§a com uma letra especÃ­fica, Ãºtil em buscas rÃ¡pidas durante a operaÃ§Ã£o da competiÃ§Ã£o. |


<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

**ExpressÃ£o SQL:**

```sql
SELECT id, nome, status, equipe_id
FROM corredor
WHERE nome LIKE 'A%'
  AND NOT status = 'Em descanso';
```

**DescriÃ§Ã£o em palavras:** seleciona os corredores cujo nome inicia com a letra "A" e que nÃ£o estÃ£o com status "Em descanso". A clÃ¡usula `WHERE` aplica trÃªs operadores distintos: o `LIKE` para correspondÃªncia por padrÃ£o textual com curinga (`%`), o `AND` para exigir simultaneidade entre as duas condiÃ§Ãµes e o `NOT` como operador lÃ³gico de negaÃ§Ã£o aplicado diretamente sobre a comparaÃ§Ã£o de igualdade â forma equivalente a `<>`, escolhida aqui para evidenciar o uso do `NOT` como conectivo proposicional.

#### ProposiÃ§Ãµes lÃ³gicas

Considerando a clÃ¡usula `WHERE`, definem-se as seguintes proposiÃ§Ãµes atÃ´micas:

- **P:** o nome do corredor inicia com a letra âAâ.  
  `nome LIKE 'A%'`

- **Q:** o corredor estÃ¡ com status âEm descansoâ.  
  `status = 'Em descanso'`

#### ExpressÃ£o lÃ³gica proposicional

A expressÃ£o lÃ³gica correspondente Ã  consulta Ã©:

```text
P â§ Â¬Q
```

Em palavras:  
o corredor serÃ¡ selecionado se o nome iniciar com a letra âAâ e o corredor nÃ£o estiver em descanso.

#### IdentificaÃ§Ã£o dos conectivos lÃ³gicos

- **â§ (AND):** exige que ambas as condiÃ§Ãµes sejam verdadeiras simultaneamente;
- **Â¬ (NOT):** inverte o valor lÃ³gico da proposiÃ§Ã£o relacionada ao status do corredor.

#### Tabela-verdade

| P | Q | Â¬Q | P â§ Â¬Q | Resultado |
|---|---|---|---|---|
| V | V | F | F | NÃ£o seleciona |
| V | F | V | V | Seleciona |
| F | V | F | F | NÃ£o seleciona |
| F | F | V | F | NÃ£o seleciona |

### InterpretaÃ§Ã£o da tabela-verdade

A tabela demonstra que a consulta retorna registros apenas quando o nome do corredor inicia com a letra âAâ e, conjuntamente, o corredor nÃ£o estÃ¡ com status âEm descansoâ. Caso o nome nÃ£o comece com âAâ ou o corredor esteja em descanso, o registro nÃ£o serÃ¡ selecionado.

#### Q03 â `UPDATE` com `AND` e `IN`

<div align="center">
  <sub>Quadro 38 - Consulta Q03</sub>
</div>


| Atributo | ConteÃºdo |
|----------|----------|
| **Tipo de operaÃ§Ã£o** | `UPDATE` |
| **Operadores lÃ³gicos** | `AND`, `OR` |
| **Operadores especiais** | `IN` |
| **Operadores relacionais** | `=` |
| **Contexto de negÃ³cio** | Ao final de um turno de corrida, marcar como "Em descanso" todos os corredores de uma equipe que estavam em corrida ou previstos para entrar (RN07). |


<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

**ExpressÃ£o SQL:**

```sql
UPDATE corredor
SET status = 'Em descanso'
WHERE equipe_id = 1
  AND status IN ('Em corrida', 'PrÃ³ximo');
```

**DescriÃ§Ã£o em palavras:** atualiza o status para "Em descanso" de todos os corredores pertencentes Ã  equipe de identificador `1` cujo status atual seja "Em corrida" ou "PrÃ³ximo". A clÃ¡usula `WHERE` utiliza o operador lÃ³gico `AND` em conjunto com o operador `IN`, que representa uma verificaÃ§Ã£o de pertencimento a um conjunto de valores e pode ser expandido logicamente como uma disjunÃ§Ã£o (`OR`) entre comparaÃ§Ãµes de igualdade.

#### ProposiÃ§Ãµes lÃ³gicas

Considerando a clÃ¡usula `WHERE`, definem-se as seguintes proposiÃ§Ãµes atÃ´micas:

- **P:** o corredor pertence Ã  equipe de identificador 1.  
  `equipe_id = 1`

- **Q:** o corredor estÃ¡ com status âEm corridaâ.  
  `status = 'Em corrida'`

- **R:** o corredor estÃ¡ com status âPrÃ³ximoâ.  
  `status = 'PrÃ³ximo'`

#### ExpressÃ£o lÃ³gica proposicional

A expressÃ£o lÃ³gica correspondente Ã  consulta Ã©:

```text
P â§ (Q â¨ R)
```

Em palavras:  
o status do corredor serÃ¡ atualizado para âEm descansoâ se ele pertencer Ã  equipe 1 e estiver com status âEm corridaâ ou âPrÃ³ximoâ.

#### IdentificaÃ§Ã£o dos conectivos lÃ³gicos

- **â§ (AND):** exige que o corredor pertenÃ§a Ã  equipe especificada e satisfaÃ§a uma das condiÃ§Ãµes de status;
- **â¨ (OR):** representa a expansÃ£o lÃ³gica do operador `IN`, permitindo que o status seja âEm corridaâ ou âPrÃ³ximoâ.

#### Tabela-verdade

| P | Q | R | Q â¨ R | P â§ (Q â¨ R) | Resultado |
|---|---|---|---|---|---|
| V | V | V | V | V | Atualiza |
| V | V | F | V | V | Atualiza |
| V | F | V | V | V | Atualiza |
| V | F | F | F | F | NÃ£o atualiza |
| F | V | V | V | F | NÃ£o atualiza |
| F | V | F | V | F | NÃ£o atualiza |
| F | F | V | V | F | NÃ£o atualiza |
| F | F | F | F | F | NÃ£o atualiza |

### InterpretaÃ§Ã£o da tabela-verdade

A tabela demonstra que a atualizaÃ§Ã£o ocorrerÃ¡ apenas quando o corredor pertencer Ã  equipe de identificador `1` e, simultaneamente, estiver com status âEm corridaâ ou âPrÃ³ximoâ. Caso o corredor pertenÃ§a a outra equipe ou possua um status diferente dos especificados, o registro nÃ£o serÃ¡ atualizado.

#### Q04 â `DELETE` com `AND` e `NOT LIKE`

<div align="center">
  <sub>Quadro 39 - Consulta Q04</sub>
</div>


| Atributo | ConteÃºdo |
|----------|----------|
| **Tipo de operaÃ§Ã£o** | `DELETE` |
| **Operadores lÃ³gicos** | `AND` |
| **Operadores especiais** | `NOT LIKE` |
| **Operadores relacionais** | `=` |
| **Contexto de negÃ³cio** | Remover registros de checkpoint criados fora do padrÃ£o esperado de identificador (por exemplo, registros provenientes de testes ou inserÃ§Ãµes manuais invÃ¡lidas), para uma competiÃ§Ã£o especÃ­fica. |


<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

**ExpressÃ£o SQL:**

```sql
DELETE FROM checkpoint
WHERE competicao_id = 1
  AND identificador NOT LIKE 'CP-%';
```

**DescriÃ§Ã£o em palavras:** remove da tabela de checkpoints todos os registros pertencentes Ã  competiÃ§Ã£o de identificador `1` cujo campo `identificador` nÃ£o segue o padrÃ£o `CP-` seguido de qualquer sequÃªncia de caracteres. A clÃ¡usula `WHERE` combina uma igualdade simples (`=`) com a negaÃ§Ã£o de um padrÃ£o textual (`NOT LIKE`), conectadas pelo operador `AND`, garantindo que apenas registros que satisfazem ambas as condiÃ§Ãµes sejam removidos.

#### ProposiÃ§Ãµes lÃ³gicas

Considerando a clÃ¡usula `WHERE`, definem-se as seguintes proposiÃ§Ãµes atÃ´micas:

- **P:** o checkpoint pertence Ã  competiÃ§Ã£o de identificador 1.
  `competicao_id = 1`

- **Q:** o identificador do checkpoint segue o padrÃ£o esperado iniciado por `CP-`.
  `identificador LIKE 'CP-%'`

#### ExpressÃ£o lÃ³gica proposicional

A expressÃ£o lÃ³gica correspondente Ã  consulta Ã©:

```text
P â§ Â¬Q
```

Em palavras:
o checkpoint serÃ¡ removido se pertencer Ã  competiÃ§Ã£o 1 e seu identificador nÃ£o seguir o padrÃ£o esperado iniciado por `CP-`.

#### IdentificaÃ§Ã£o dos conectivos lÃ³gicos

- **â§ (AND):** exige que o checkpoint pertenÃ§a Ã  competiÃ§Ã£o especificada e, ao mesmo tempo, nÃ£o siga o padrÃ£o de identificador esperado;
- **Â¬ (NOT):** representa a negaÃ§Ã£o do padrÃ£o textual `LIKE 'CP-%'`, expressa na consulta pelo operador `NOT LIKE`.

#### Tabela-verdade

| P | Q | Â¬Q | P â§ Â¬Q | Resultado |
|---|---|---|---|---|
| V | V | F | F | NÃ£o remove |
| V | F | V | V | Remove |
| F | V | F | F | NÃ£o remove |
| F | F | V | F | NÃ£o remove |

### InterpretaÃ§Ã£o da tabela-verdade

A tabela demonstra que a exclusÃ£o ocorre apenas quando o checkpoint pertence Ã  competiÃ§Ã£o de identificador `1` e, simultaneamente, seu identificador nÃ£o segue o padrÃ£o `CP-`. Caso o checkpoint pertenÃ§a a outra competiÃ§Ã£o ou possua identificador vÃ¡lido, o registro nÃ£o serÃ¡ removido.

---

#### Q05 â `SELECT` com `BETWEEN`, `AND` e `NOT IN`

<div align="center">
  <sub>Quadro 40 - Consulta Q05</sub>
</div>


| Atributo | ConteÃºdo |
|----------|----------|
| **Tipo de operaÃ§Ã£o** | `SELECT` |
| **Operadores lÃ³gicos** | `AND` |
| **Operadores especiais** | `BETWEEN`, `NOT IN` |
| **Contexto de negÃ³cio** | Listar checkpoints com quilometragem dentro de uma faixa tÃ­pica de desempenho, excluindo corredores especÃ­ficos (por exemplo, atletas de equipes desclassificadas ou substituÃ­dos durante a competiÃ§Ã£o). |


<div align="center">
  <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

**ExpressÃ£o SQL:**

```sql
SELECT id, identificador, km, pace, corredor_id
FROM checkpoint
WHERE km BETWEEN 4 AND 6
  AND corredor_id NOT IN (1, 7);
```

**DescriÃ§Ã£o em palavras:** seleciona os checkpoints cuja quilometragem estÃ¡ entre 4 e 6 km (inclusive nos extremos, conforme a semÃ¢ntica do `BETWEEN`) e cujo identificador de corredor nÃ£o pertence ao conjunto `{1, 7}`. A clÃ¡usula `WHERE` combina o operador `BETWEEN` â equivalente a uma conjunÃ§Ã£o entre `>=` e `<=` â com o operador `NOT IN`, conectados pelo `AND`, permitindo restringir simultaneamente intervalo numÃ©rico e exclusÃ£o por conjunto de identificadores.

#### ProposiÃ§Ãµes lÃ³gicas

Considerando a clÃ¡usula `WHERE`, definem-se as seguintes proposiÃ§Ãµes atÃ´micas:

- **P:** o checkpoint possui quilometragem maior ou igual a 4 km.
  `km >= 4`

- **Q:** o checkpoint possui quilometragem menor ou igual a 6 km.
  `km <= 6`

- **R:** o checkpoint pertence ao corredor de identificador 1.
  `corredor_id = 1`

- **S:** o checkpoint pertence ao corredor de identificador 7.
  `corredor_id = 7`

#### ExpressÃ£o lÃ³gica proposicional

A expressÃ£o lÃ³gica correspondente Ã  consulta Ã©:

```text
P â§ Q â§ Â¬R â§ Â¬S
```

Em palavras:
o checkpoint serÃ¡ selecionado se sua quilometragem estiver entre 4 e 6 km, inclusive, e se o corredor associado nÃ£o for o de identificador 1 nem o de identificador 7.

#### IdentificaÃ§Ã£o dos conectivos lÃ³gicos

- **â§ (AND):** exige que todas as condiÃ§Ãµes sejam verdadeiras simultaneamente;
- **Â¬ (NOT):** representa a exclusÃ£o dos corredores listados no conjunto do operador `NOT IN`. No caso especÃ­fico da consulta, `corredor_id NOT IN (1, 7)` equivale a `Â¬R â§ Â¬S`; em conjuntos maiores, a expansÃ£o segue o mesmo padrÃ£o, de modo que `NOT IN (a, b, c, ...)` equivale Ã  conjunÃ§Ã£o das negaÃ§Ãµes de cada igualdade individual.

#### Tabela-verdade

| P | Q | R | S | Â¬R | Â¬S | P â§ Q â§ Â¬R â§ Â¬S | Resultado |
|---|---|---|---|---|---|---|---|
| V | V | V | V | F | F | F | NÃ£o seleciona |
| V | V | V | F | F | V | F | NÃ£o seleciona |
| V | V | F | V | V | F | F | NÃ£o seleciona |
| V | V | F | F | V | V | V | Seleciona |
| V | F | V | V | F | F | F | NÃ£o seleciona |
| V | F | V | F | F | V | F | NÃ£o seleciona |
| V | F | F | V | V | F | F | NÃ£o seleciona |
| V | F | F | F | V | V | F | NÃ£o seleciona |
| F | V | V | V | F | F | F | NÃ£o seleciona |
| F | V | V | F | F | V | F | NÃ£o seleciona |
| F | V | F | V | V | F | F | NÃ£o seleciona |
| F | V | F | F | V | V | F | NÃ£o seleciona |
| F | F | V | V | F | F | F | NÃ£o seleciona |
| F | F | V | F | F | V | F | NÃ£o seleciona |
| F | F | F | V | V | F | F | NÃ£o seleciona |
| F | F | F | F | V | V | F | NÃ£o seleciona |

#### ObservaÃ§Ã£o sobre dependÃªncias semÃ¢nticas

A tabela-verdade apresenta as 16 combinaÃ§Ãµes proposicionais possÃ­veis para quatro variÃ¡veis, mas nem todas representam situaÃ§Ãµes possÃ­veis no domÃ­nio real da consulta. As proposiÃ§Ãµes **P** e **Q** dependem do mesmo atributo `km`: quando **P = F** e **Q = F**, a linha indicaria simultaneamente `km < 4` e `km > 6`, o que nÃ£o pode ocorrer para um Ãºnico valor de quilometragem. JÃ¡ os casos **P = F, Q = V** e **P = V, Q = F** sÃ£o possÃ­veis e representam, respectivamente, quilometragem abaixo de 4 km e quilometragem acima de 6 km.

O mesmo raciocÃ­nio vale para **R** e **S**, pois um mesmo checkpoint possui apenas um `corredor_id`. Assim, linhas em que **R = V** e **S = V** sÃ£o proposicionalmente listadas na tabela, mas nÃ£o ocorrem na prÃ¡tica para um Ãºnico registro, jÃ¡ que o corredor nÃ£o pode ter simultaneamente os identificadores `1` e `7`.

### InterpretaÃ§Ã£o da tabela-verdade

A tabela demonstra que a consulta seleciona registros apenas quando a quilometragem estÃ¡ dentro da faixa de 4 a 6 km e, ao mesmo tempo, o corredor associado nÃ£o pertence ao conjunto de identificadores excluÃ­dos. A linha **P = V, Q = V, R = F, S = F** Ã© a Ãºnica que resulta em seleÃ§Ã£o, pois indica um checkpoint dentro do intervalo permitido e associado a um corredor diferente dos IDs `1` e `7`. Quando **P = V** e **Q = F**, por exemplo, o checkpoint tem `km > 6` e fica fora da faixa superior; quando **P = F** e **Q = V**, o checkpoint tem `km < 4` e fica fora da faixa inferior. Se **R** ou **S** forem verdadeiros, o registro tambÃ©m nÃ£o Ã© selecionado, mesmo que a quilometragem esteja dentro do intervalo.

## 3.7. WebAPI e endpoints (sprints 3 e 4)

A documentaÃ§Ã£o completa da WebAPI foi organizada em uma pÃ¡gina HTML especÃ­fica, reunindo os endpoints por domÃ­nio funcional, seus mÃ©todos HTTP, exemplos de payload, formatos de resposta, cÃ³digos de status esperados e indicaÃ§Ã£o de quais recursos jÃ¡ estÃ£o implementados ou planejados. Esse material complementa a matriz RF/RN/Endpoint apresentada na seÃ§Ã£o 3.1.4, detalhando o contrato de comunicaÃ§Ã£o entre frontend, backend e banco de dados.

A versÃ£o versionada no repositÃ³rio pode ser consultada em [documentos/outros/api-documentation.html](outros/api-documentation.html). Para facilitar a leitura externa e a validaÃ§Ã£o do artefato sem necessidade de clonar o projeto, a mesma documentaÃ§Ã£o tambÃ©m foi publicada em ambiente web no link: [https://web-api-deploy-d81981.pages.git.inteli.edu.br/](https://web-api-deploy-d81981.pages.git.inteli.edu.br/).

## 3.8. AutenticaÃ§Ã£o, AutorizaÃ§Ã£o e ResiliÃªncia (sprint 5)

### 3.8.1. AutenticaÃ§Ã£o

*Descreva o fluxo de autenticaÃ§Ã£o implementado: persistÃªncia de senha com hash bcrypt/argon2 (parÃ¢metros de custo explÃ­citos e justificados), validaÃ§Ã£o de credenciais e criaÃ§Ã£o de sessÃ£o. Senhas em texto plano no banco nÃ£o sÃ£o aceitas.*

### 3.8.2. Controle de sessÃ£o

*Descreva o controle de sessÃ£o baseado em `session id` persistido em tabela prÃ³pria, com expiraÃ§Ã£o. Se optar por JWT, justifique a escolha explicando os trade-offs (stateless, nÃ£o revogÃ¡vel, payload exposto).*

### 3.8.3. AutorizaÃ§Ã£o

*Descreva as regras de autorizaÃ§Ã£o por rota e por operaÃ§Ã£o, baseadas no perfil do usuÃ¡rio autenticado. A verificaÃ§Ã£o deve ocorrer no backend â o frontend nunca Ã© fonte de verdade para autorizaÃ§Ã£o.*

### 3.8.4. EstratÃ©gias de ResiliÃªncia

*Descreva as estratÃ©gias aplicadas no tratamento de falhas de rede: timeout, retry com backoff exponencial, circuit breaker e idempotÃªncia em operaÃ§Ãµes crÃ­ticas (`PUT`, `DELETE`, operaÃ§Ãµes de pagamento etc.).*

## 3.9. Matriz de Rastreabilidade (RTM) (sprints 3 a 5)

A Matriz de Rastreabilidade (Requirements Traceability Matrix â RTM) tem como objetivo garantir a rastreabilidade completa entre as necessidades dos usuÃ¡rios, os requisitos funcionais, as regras de negÃ³cio, os endpoints implementados, as telas do sistema, os testes executados e as evidÃªncias geradas durante o desenvolvimento. Dessa forma, Ã© possÃ­vel verificar que cada funcionalidade implementada possui correspondÃªncia com uma necessidade identificada, uma regra de negÃ³cio associada, um mecanismo de implementaÃ§Ã£o e uma forma de validaÃ§Ã£o.

A rastreabilidade contribui para a manutenÃ§Ã£o da consistÃªncia entre os artefatos do projeto, reduzindo ambiguidades e facilitando processos de validaÃ§Ã£o, testes e evoluÃ§Ã£o da soluÃ§Ã£o ao longo das sprints.

<div align="center">

  <sub>Quadro 35 - Matriz de Rastreabilidade (RTM)</sub>

</div>

### Quadro 35 â Matriz de Rastreabilidade (RTM)

| Persona        | RF    | RN         | Endpoint                                            | Tela                           | Teste                        | EvidÃªncia                                                     |
| -------------- | ----- | ---------- | --------------------------------------------------- | ------------------------------ | ---------------------------- | ------------------------------------------------------------- |
| Marina Costa   | RF001 | RN03       | POST `/competitions`                                | Cadastro de CompetiÃ§Ã£o         | competition.e2e.spec.ts      | CompetiÃ§Ã£o criada com sucesso e persistida no banco           |
| Marina Costa   | RF002 | RN18       | GET/POST `/competitions`                            | Dashboard Principal            | competitionService.spec.ts   | Dados da competiÃ§Ã£o cadastrados e recuperados corretamente    |
| Marina Costa   | RF003 | RN01, RN07 | POST `/competitions/:id/teams`                      | Cadastro de Equipes            | team.e2e.spec.ts             | Equipe criada e vinculada Ã  competiÃ§Ã£o                        |
| Marina Costa   | RF003 | RN01       | POST `/competitions/:id/teams/:teamId/athletes`     | Cadastro de Equipes            | athlete.e2e.spec.ts          | Atleta vinculado corretamente Ã  equipe                        |
| Marina Costa   | RF004 | RN02, RN03 | POST `/auth/sessions`                               | Dashboard Principal            | authService.test.ts          | SessÃ£o autenticada com sucesso                                |
| Marina Costa   | RF005 | RN06       | POST `/ocr/extractions`                             | Captura da Foto da Esteira     | checkpointService.spec.ts    | Dados extraÃ­dos via OCR retornados para validaÃ§Ã£o             |
| Marina Costa   | RF006 | RN04, RN05 | POST `/ocr/extractions`                             | Dados ExtraÃ­dos via OCR        | checkpointService.spec.ts    | Dados disponibilizados para conferÃªncia antes da persistÃªncia |
| Marina Costa   | RF007 | RN06, RN12 | PATCH `/ocr/extractions/:extractionId`              | Dados ExtraÃ­dos via OCR        | checkpointService.spec.ts    | Dados corrigidos e registrados em log                         |
| Marina Costa   | RF008 | RN04, RN05 | POST `/checkpoints`                                 | Registro Manual                | checkpointService.spec.ts    | Checkpoint registrado com sucesso                             |
| Marina Costa   | RF008 | RN04, RN05 | GET `/checkpoints`                                  | Checkpoints Salvos             | checkpointService.spec.ts    | HistÃ³rico de checkpoints recuperado corretamente              |
| Marina Costa   | RF009 | RN06       | GET `/competitions/:id/checkpoints/inconsistencies` | Dados ExtraÃ­dos via OCR        | checkpointService.spec.ts    | InconsistÃªncias identificadas e exibidas ao operador          |
| Bruno Monteiro | RF010 | RN09, RN11 | GET `/competitions/:id/ranking/teams`               | Dashboard Principal            | rankingService.spec.ts       | Ranking administrativo atualizado automaticamente             |
| Bruno Monteiro | RF011 | RN07, RN10 | GET `/competitions/:id/teams/:teamId/athletes`      | Painel Operacional das Equipes | athleteService.spec.ts       | ExibiÃ§Ã£o do atleta em corrida e prÃ³ximo atleta previsto       |
| Bruno Monteiro | RF012 | RN14       | PATCH `/competitions/:id`                           | Dashboard Principal            | competitionService.spec.ts   | CompetiÃ§Ã£o encerrada e bloqueio de novos registros validado   |
| Bruno Monteiro | RF013 | RN15       | GET `/competitions/:id/export`                      | Dashboard Principal            | export.e2e.spec.ts           | Arquivo de exportaÃ§Ã£o gerado com sucesso                      |
| Bruno Monteiro | RF014 | RN16, RN17 | GET `/competitions/:id/reports`                     | Dashboard Principal            | exportService.spec.ts        | RelatÃ³rios e indicadores gerados corretamente                 |
| Amanda Azevedo | RF015 | RN09, RN13 | GET `/competitions/:id/ranking/athletes`            | Painel PÃºblico da Equipe       | rankingService.spec.ts       | Ranking pÃºblico atualizado e exibido corretamente             |
| Bruno Monteiro | RF004 | RN02, RN03 | GET `/administradores`                              | Dashboard Principal            | administratorService.spec.ts | Administradores recuperados corretamente                      |
| Bruno Monteiro | RF004 | RN02, RN03 | POST `/administradores`                             | Dashboard Principal            | administratorService.spec.ts | Administrador criado com sucesso                              |
| Bruno Monteiro | RF004 | RN02, RN03 | PUT `/administradores/:id`                          | Dashboard Principal            | administratorService.spec.ts | Dados administrativos atualizados corretamente                |
| Bruno Monteiro | RF004 | RN02, RN03 | DELETE `/administradores/:id`                       | Dashboard Principal            | administratorService.spec.ts | Administrador removido corretamente                           |

<div align="center">

  <sup>Fonte: Elaborado pelos autores (2026).</sup>

</div>

A matriz apresentada demonstra que todos os fluxos centrais do sistema possuem rastreabilidade entre as necessidades das personas, os requisitos definidos, as regras de negÃ³cio estabelecidas, os endpoints implementados, as interfaces projetadas e os mecanismos de validaÃ§Ã£o utilizados durante o desenvolvimento. Dessa forma, garante-se maior controle sobre a evoluÃ§Ã£o da soluÃ§Ã£o e alinhamento entre os artefatos produzidos ao longo das sprints.

# <a name="c4"></a>4. Desenvolvimento da AplicaÃ§Ã£o Web

## 4.1. Primeira versÃ£o da aplicaÃ§Ã£o web (sprint 3)

### (a) O que foi implementado

Nesta sprint foi consolidada a base do backend da aplicaÃ§Ã£o, estruturada em **Node.js + TypeScript + Supabase**, seguindo arquitetura em camadas (Routes â Controllers â Services â Repositories) para garantir separaÃ§Ã£o de responsabilidades e aderÃªncia aos princÃ­pios SOLID (Martin,2002).

<div align="center">
  <sub>Figura 1 - Estrutura de pastas</sub><br>
    <img src="../assets/programacao/estrutura-de-pastas.png" width="100%" alt="Estrutura de pastas do projeto"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

<div align="center">
  <sub>Figura 1 - Pasta supabaseClient.ts</sub><br>
    <img src="../assets/programacao/pasta-supabaseClient.ts.png" width="100%" alt="RepresentaÃ§Ã£o da pasta supabaseClient.ts do projeto"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

**- ConfiguraÃ§Ã£o do ambiente e gestÃ£o de dependÃªncias:** o arquivo `package.json` foi estruturado contendo as dependÃªncias de produÃ§Ã£o e de desenvolvimento, alÃ©m de scripts padronizados de execuÃ§Ã£o (`dev`, `build`, `start`, `test`, `test:e2e`, `test:unit`, `test:integration`), garantindo que qualquer membro da equipe consiga rodar o projeto e os testes de forma consistente. Foi configurado tambÃ©m o arquivo `.env` para gerenciamento seguro de variÃ¡veis sensÃ­veis (URL e chave do Supabase, porta da aplicaÃ§Ã£o, ambiente de execuÃ§Ã£o), com um `.env.example` versionado no repositÃ³rio para servir de referÃªncia, mantendo o arquivo real fora do controle de versÃ£o via `.gitignore`. Essa estrutura padroniza o setup local, evita o vazamento de credenciais e prepara o projeto para deploy em diferentes ambientes (desenvolvimento, teste e produÃ§Ã£o).

<div align="center">
  <sub>Figura 1 - Pasta Package.json</sub><br>
    <img src="../assets/programacao/pasta-package.json.png" width="100%" alt="RepresentaÃ§Ã£o do package.json do projeto"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

<div align="center">
  <sub>Figura 2 - RepresentaÃ§Ã£o do .env</sub><br>
    <img src="../assets/programacao/pasta-.env.png" width="100%" alt="RepresentaÃ§Ã£o do .env do projeto"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

**- Infraestrutura base:** servidor Express configurado, integraÃ§Ã£o com Supabase, sistema de erros customizados (`ValidationError`, `NotFoundError`, `ConflictError`, `UnprocessableError`), middleware centralizado de tratamento de erros e helper `asyncHandler` para padronizaÃ§Ã£o do fluxo assÃ­ncrono.

<div align="center">
  <sub>Figura 1 - Pasta appError.ts</sub><br>
    <img src="../assets/programacao/pasta-apperror.ts.png" width="100%" alt="RepresentaÃ§Ã£o da pasta appError.ts do projeto"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

**- MÃ³dulo de CompetiÃ§Ãµes (RF002, RF012):** CRUD completo com endpoint adicional de encerramento (`PATCH`), validaÃ§Ã£o dos campos obrigatÃ³rios (nome, data e local â RN18) e controle de status da competiÃ§Ã£o (nÃ£o iniciada / em andamento / encerrada), garantindo o bloqueio de novos registros apÃ³s o encerramento.

**- MÃ³dulo de Equipes (RF003):** CRUD completo com rotas aninhadas sob competiÃ§Ã£o, refletindo a hierarquia do domÃ­nio.

**- MÃ³dulo de Atletas (RF003):** CRUD completo com rotas aninhadas sob equipe, limite de 16 atletas por equipe (RN17), validaÃ§Ã£o de CPF, unicidade de CPF e e-mail, controle de status (corredor/capitÃ£o) e proteÃ§Ã£o contra remoÃ§Ã£o de atletas com checkpoints vinculados.

**- MÃ³dulo de Checkpoints (RF005 a RF009):** CRUD completo sob rota aninhada de atleta, contemplando tanto o fluxo manual quanto o fluxo via OCR, com persistÃªncia dos campos obrigatÃ³rios definidos pela RN04 (distÃ¢ncia, pace e tempo total) e log de auditoria registrando o mÃ©todo de entrada (OCR ou manual) conforme RN05.

**- MÃ³dulo de Rankings (RF010, RF011, RF015):** endpoints de leitura agregada para o painel administrativo e para o painel pÃºblico, calculando distÃ¢ncia total por equipe, pace mÃ©dio, atleta em corrida e prÃ³ximo atleta da escalaÃ§Ã£o, com atualizaÃ§Ã£o periÃ³dica via polling.

**- MÃ³dulo de Reports (RF013, RF014):** endpoints de relatÃ³rio consolidado da competiÃ§Ã£o, relatÃ³rio por equipe e exportaÃ§Ã£o CSV contendo checkpoints, timestamps e logs de validaÃ§Ã£o, incluindo o relatÃ³rio de inconsistÃªncias derivado do log de auditoria.

**- MÃ³dulo de AutenticaÃ§Ã£o (RF001, RF004, RN03):** controle de acesso por sala administrativa via senha definida na criaÃ§Ã£o da sala, com escopo limitado Ã  Ã¡rea administrativa e mantendo o acesso pÃºblico sem autenticaÃ§Ã£o para o painel da equipe via UUID (US12).

**- ProtÃ³tipo de alta fidelidade de todas as telas finalizado:** o design system, os fluxos de navegaÃ§Ã£o e o layout completo das interfaces administrativas e pÃºblicas estÃ£o concluÃ­dos no Figma, contemplando todas as telas previstas no escopo (painel administrativo, gestÃ£o de equipes e atletas, painel operacional da competiÃ§Ã£o, captura e validaÃ§Ã£o OCR, registro manual de checkpoint, tabela consolidada da equipe, relatÃ³rios e painel pÃºblico acessado via UUID). Essa entrega serve de base direta para a implementaÃ§Ã£o do frontend funcional na sprint 4.

Para mais informaÃ§Ãµes acesse a [SeÃ§Ã£o 3.5 â ProtÃ³tipo de alta fidelidade](#prototipo-alta-fidelidade)


**- ProtÃ³tipo do OCR finalizado:** o fluxo de captura, extraÃ§Ã£o e validaÃ§Ã£o dos dados da esteira jÃ¡ estÃ¡ validado em protÃ³tipo funcional, com o funcionamento end-to-end definido (captura da imagem â processamento â retorno dos campos extraÃ­dos â validaÃ§Ã£o humana antes da persistÃªncia). A soluÃ§Ã£o foi implementada com **OpenCV** em conjunto com **Tesseract.js**, rodando inteiramente no prÃ³prio navegador (client-side), o que elimina a dependÃªncia de serviÃ§os externos de OCR e mantÃ©m o processamento sob controle da aplicaÃ§Ã£o. Nesta versÃ£o, o OCR opera de forma isolada e ainda nÃ£o realiza detecÃ§Ã£o automÃ¡tica de campos â a segmentaÃ§Ã£o das regiÃµes do display correspondentes a distÃ¢ncia, pace e tempo total serÃ¡ refinada na sprint 4. O comportamento atual estÃ¡ alinhado com os critÃ©rios de aceite da US09, restando apenas a aprovaÃ§Ã£o final do parceiro e a integraÃ§Ã£o refinada com o mÃ³dulo de Checkpoints.

<div align="center">
  <sub>Figura 1 - Adicionar imagem</sub><br>
    <img src="../assets/programacao/OCR-add-img.jpg" width="100%" alt="OCR: RepresentaÃ§Ã£o da tela de adicionar imagem."><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

<div align="center">
  <sub>Figura 1 - Leitura da imagem</sub><br>
    <img src="../assets/programacao/OCR-leitura-img.jpg" width="100%" alt="OCR: RepresentaÃ§Ã£o da tela de leitura da imagem."><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

<div align="center">
  <sub>Figura 1 - Registro das informaÃ§Ãµes</sub><br>
    <img src="../assets/programacao/OCR-registro.jpg" width="100%" alt="RepresentaÃ§Ã£o do registro das informaÃ§Ãµes da foto"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>

**- Desenvolvimento orientado a testes (TDD) em todos os mÃ³dulos:** a equipe adotou a prÃ¡tica de **Test-Driven Development** durante toda a sprint, escrevendo primeiro os testes com **Jest** e **Supertest** para cada funcionalidade planejada, executando-os para confirmar que falhavam como esperado (fase *red* do ciclo) e somente entÃ£o implementando os endpoints, services e repositories necessÃ¡rios para fazÃª-los passar (fase *green*), seguida da refatoraÃ§Ã£o quando aplicÃ¡vel (fase *refactor*). Essa abordagem foi aplicada nos trÃªs nÃ­veis de teste â E2E, unitÃ¡rio e integraÃ§Ã£o â garantindo que toda regra de negÃ³cio e contrato de API entregue na sprint nasceu a partir de um teste falho e, portanto, possui cobertura automatizada associada desde o primeiro commit.

<div align="center">
  <sub>Figura 1 - Testes jest e supertest</sub><br>
    <img src="../assets/programacao/testes.jpg" width="100%" alt="Testes jest e supertest"><br>
      <sup>Fonte: Elaborado pelos autores (2026).</sup>
</div>


### (b) O que nÃ£o foi concluÃ­do

**- Refinamento do OCR:** apesar do protÃ³tipo estar finalizado e do fluxo estar definido, ainda Ã© necessÃ¡rio aprimorar a precisÃ£o da captura das informaÃ§Ãµes da imagem (distÃ¢ncia, pace e tempo total), tratar variaÃ§Ãµes de iluminaÃ§Ã£o e posicionamento do display da esteira, ajustar o limiar de discrepÃ¢ncia para acionamento dos alertas visuais (RN06) e refinar detalhes de integraÃ§Ã£o para entregar o mÃ³dulo em nÃ­vel de MVP funcional.

**- Frontend funcional integrado:** entregue atÃ© o momento apenas o protÃ³tipo de alta fidelidade; a integraÃ§Ã£o com o backend serÃ¡ iniciada na sprint 4.

### (c) Dificuldades tÃ©cnicas

**- Tratamento manual de erros de constraint do PostgreSQL** via Supabase, especificamente os cÃ³digos `23505` (violaÃ§Ã£o de UNIQUE) e `23503` (violaÃ§Ã£o de FK), que exigiram interceptaÃ§Ã£o e conversÃ£o para os erros customizados da aplicaÃ§Ã£o em cada repository.

**- EstruturaÃ§Ã£o de rotas aninhadas respeitando o escopo do recurso pai**, garantindo que operaÃ§Ãµes sobre atletas estejam sempre vinculadas a uma equipe vÃ¡lida, operaÃ§Ãµes sobre equipes vinculadas a uma competiÃ§Ã£o vÃ¡lida e operaÃ§Ãµes sobre checkpoints vinculadas a um atleta vÃ¡lido.

**- Ambiente de testes E2E com banco real evitando colisÃ£o de dados Ãºnicos entre execuÃ§Ãµes** â mitigado parcialmente com geraÃ§Ã£o de dados aleatÃ³rios por run; soluÃ§Ã£o definitiva (uso de prefixos ou IDs descartÃ¡veis padronizados) prevista para a sprint 4.

### (d) PrÃ³ximos passos

Com base no que jÃ¡ foi entregue na sprint 3 e considerando o que o TAP estabelece como prioritÃ¡rio para o MVP, o foco da sprint 4 serÃ¡ **integrar o frontend ao backend jÃ¡ existente e refinar os fluxos crÃ­ticos da operaÃ§Ã£o** durante as 24 horas do evento. As frentes de trabalho previstas sÃ£o:

**1. Frontend funcional integrado ao backend**
MigraÃ§Ã£o do protÃ³tipo de alta fidelidade para uma aplicaÃ§Ã£o funcional consumindo a API jÃ¡ implementada, com foco nas telas crÃ­ticas para a operaÃ§Ã£o do evento: painel operacional administrativo, captura e validaÃ§Ã£o OCR, registro manual de checkpoint, tabela consolidada da equipe com auto-refresh, relatÃ³rios e painel pÃºblico acessado via UUID sem autenticaÃ§Ã£o (US12). A UX deve seguir os wireframes jÃ¡ validados na sprint 2, priorizando uso em iPad conforme escopo do TAP.

**2. Refinamento do mÃ³dulo de OCR**
Aprimoramento da precisÃ£o de extraÃ§Ã£o dos dados da imagem, tratamento de variaÃ§Ãµes de iluminaÃ§Ã£o e posicionamento do display da esteira, ajuste do limiar de discrepÃ¢ncia para acionamento dos alertas visuais (RN06) e validaÃ§Ã£o prÃ¡tica com imagens reais do ambiente operacional. O objetivo Ã© elevar o OCR ao nÃ­vel de MVP funcional, aderente aos critÃ©rios de aceite da US09.

**3. Registro das rotas do mÃ³dulo de UsuÃ¡rios**
ConclusÃ£o do mÃ³dulo jÃ¡ iniciado na sprint 3 (model, repository e service), registrando as rotas no Express e completando a cadeia da arquitetura em camadas.

**4. Testes automatizados e Matriz de Rastreabilidade**
ManutenÃ§Ã£o da abordagem de TDD para todas as novas funcionalidades, expandindo a cobertura para o frontend conforme aplicÃ¡vel e reforÃ§ando os testes dos mÃ³dulos consolidados na sprint 3. Em paralelo, preenchimento da RTM (seÃ§Ã£o 3.9), conectando persona â RF â RN â endpoint â tela â teste â evidÃªncia, sem lacunas nos fluxos centrais a partir desta sprint, conforme exigido pelo template.

**5. DÃ­vida tÃ©cnica identificada na sprint 3**
AvaliaÃ§Ã£o da centralizaÃ§Ã£o do tratamento de erros de constraint do PostgreSQL (cÃ³digos 23505 e 23503) em um helper Ãºnico, evitando a repetiÃ§Ã£o desse padrÃ£o entre repositories, e adoÃ§Ã£o de prefixos ou IDs descartÃ¡veis no ambiente de testes E2E para eliminar a colisÃ£o de dados Ãºnicos entre execuÃ§Ãµes.

## 4.2. Segunda versÃ£o da aplicaÃ§Ã£o web (sprint 4)

*Descreva e ilustre aqui o desenvolvimento da segunda versÃ£o do sistema web, com foco no que foi consolidado entre a primeira versÃ£o funcional e o sistema operacional integrado. Utilize prints de tela para ilustrar. Indique obrigatoriamente: (a) o que foi implementado, (b) o que nÃ£o foi concluÃ­do, (c) dificuldades tÃ©cnicas enfrentadas e prÃ³ximos passos.*

## 4.3. VersÃ£o final da aplicaÃ§Ã£o web (sprint 5)

*Descreva e ilustre aqui o desenvolvimento da versÃ£o final do sistema web, com foco em refatoraÃ§Ãµes, correÃ§Ãµes finais e na camada de autenticaÃ§Ã£o/autorizaÃ§Ã£o entregue. Utilize prints de tela para ilustrar. Indique obrigatoriamente: (a) o que foi refinado ou adicionado desde a sprint 4, (b) pendÃªncias remanescentes, (c) dificuldades tÃ©cnicas enfrentadas.*

# <a name="c5"></a>5. Testes

## 5.1. RelatÃ³rio de testes de integraÃ§Ã£o de endpoints automatizados (sprint 4)

*Liste e descreva os testes automatizados dos endpoints criados e planejados para sua soluÃ§Ã£o, implementados com **Jest**. Cubra as duas abordagens:*

- ***White-box*** *â testes unitÃ¡rios de Service que exercitam ramos internos, exceÃ§Ãµes e regras de negÃ³cio (conhecimento da implementaÃ§Ã£o).*
- ***Black-box*** *â testes de integraÃ§Ã£o dos endpoints via Jest + Supertest, verificando apenas o contrato HTTP (status, body, efeito observÃ¡vel), sem depender da implementaÃ§Ã£o interna.*

*Posicione aqui tambÃ©m o relatÃ³rio de cobertura de testes Jest se houver (atravÃ©s de link ou transcrito para estrutura markdown).*

## 5.2. Testes de usabilidade (sprint 5)

### 5.2.1. RelatÃ³rio de testes de guerrilha

*Posicione aqui as tabelas com enunciados de tarefas, etapas e resultados de testes de usabilidade. Ou utilize um link para seu relatÃ³rio de testes (mantenha o link sempre pÃºblico para visualizaÃ§Ã£o).*

### 5.2.2. RelatÃ³rio de testes SUS (System Usability Scale)

*Posicione aqui o relatÃ³rio dos testes SUS realizados.*

# <a name="c6"></a>6. Estudo de Mercado e Plano de Marketing (sprint 4)

## 6.1 Resumo Executivo

*Preencher com atÃ© 300 palavras, sem necessidade de fonte*

*Apresente de forma clara e objetiva os principais destaques do projeto: oportunidades de mercado, diferenciais competitivos da aplicaÃ§Ã£o web e os objetivos estratÃ©gicos pretendidos.*

## 6.2 AnÃ¡lise de Mercado

*a) VisÃ£o Geral do Setor (atÃ© 250 palavras)*
*Contextualize o setor no qual a aplicaÃ§Ã£o estÃ¡ inserida, considerando aspectos econÃ´micos, tecnolÃ³gicos e regulatÃ³rios. Utilize fontes confiÃ¡veis.*

*b) Tamanho e Crescimento do Mercado (atÃ© 250 palavras)*
*Apresente dados quantitativos sobre o tamanho atual e projeÃ§Ãµes de crescimento do mercado. Utilize fontes confiÃ¡veis.*

*c) TendÃªncias de Mercado (atÃ© 300 palavras)*
*Identifique e analise tendÃªncias relevantes (tecnolÃ³gicas, comportamentais e mercadolÃ³gicas) que influenciam o setor. Utilize fontes confiÃ¡veis.*

## 6.3 AnÃ¡lise da ConcorrÃªncia

*a) Principais Concorrentes (atÃ© 250 palavras)*
*Liste os concorrentes diretos e indiretos, destacando suas principais caracterÃ­sticas e posicionamento no mercado.*

*b) Vantagens Competitivas da AplicaÃ§Ã£o Web (atÃ© 250 palavras)*
*Descreva os diferenciais da sua aplicaÃ§Ã£o em relaÃ§Ã£o aos concorrentes, sem necessidade de citaÃ§Ã£o de fontes.*


## 6.4 PÃºblico-Alvo

*a) SegmentaÃ§Ã£o de Mercado (atÃ© 250 palavras)*
Descreva os principais segmentos de mercado a serem atendidos pela aplicaÃ§Ã£o. Utilize bases de dados e fontes confiÃ¡veis.*

*b) Perfil do PÃºblico-Alvo (atÃ© 250 palavras)*
*Caracterize o pÃºblico-alvo com dados demogrÃ¡ficos, psicogrÃ¡ficos e comportamentais, incluindo necessidades especÃ­ficas. Utilize fontes obrigatÃ³rias.*


## 6.5 Posicionamento

*a) Proposta de Valor Ãnica (atÃ© 250 palavras)*
*Defina de maneira clara o que torna a sua aplicaÃ§Ã£o Ãºnica e valiosa para o mercado.*

*b) EstratÃ©gia de DiferenciaÃ§Ã£o (atÃ© 250 palavras)*
*Explique como sua aplicaÃ§Ã£o se destacarÃ¡ da concorrÃªncia, evidenciando a lÃ³gica por trÃ¡s do posicionamento.*

## 6.6 EstratÃ©gia de Marketing 

*a) Produto/ServiÃ§o (atÃ© 200 palavras)*
*Descreva as funcionalidades, benefÃ­cios e diferenciais da aplicaÃ§Ã£o*

*b) PreÃ§o (atÃ© 200 palavras)*
*Explique o modelo de precificaÃ§Ã£o adotado e justifique com base nas anÃ¡lises anteriores.*

*c) PraÃ§a (DistribuiÃ§Ã£o) (atÃ© 200 palavras)*
*Apresente os canais digitais utilizados para distribuir e entregar a aplicaÃ§Ã£o ao pÃºblico.*

*d) PromoÃ§Ã£o (atÃ© 200 palavras)*
*Descreva as estratÃ©gias digitais planejadas, como SEO, redes sociais, marketing de conteÃºdo e campanhas pagas.*

# <a name="c7"></a>7. ConclusÃµes e trabalhos futuros (sprint 5)

*Escreva de que formas a soluÃ§Ã£o da aplicaÃ§Ã£o web atingiu os objetivos descritos na seÃ§Ã£o 2 deste documento. Indique pontos fortes e pontos a melhorar de maneira geral.*

*Relacione os pontos de melhorias evidenciados nos testes com planos de aÃ§Ãµes para serem implementadas. O grupo nÃ£o precisa implementÃ¡-las, pode deixar registrado aqui o plano para aÃ§Ãµes futuras*

*Relacione tambÃ©m quaisquer outras ideias que o grupo tenha para melhorias futuras*

# <a name="c8"></a>8. ReferÃªncias (sprints 1 a 5)

ALURA. MER e DER: funÃ§Ãµes e diferenÃ§as. Alura, [s.d.]. DisponÃ­vel em: https://alura.com.br/artigos/mer-e-der-funcoes. Acesso em: 7 maio 2026.

AMAZON WEB SERVICES. A diferenÃ§a entre modelo de dados lÃ³gico e fÃ­sico. DisponÃ­vel em: https://aws.amazon.com/pt/compare/the-difference-between-logical-and-physical-data-model/. Acesso em: 11 maio 2026.

BASS, Len; CLEMENTS, Paul; KAZMAN, Rick. Software Architecture in Practice. 3. ed. Boston: Addison-Wesley, 2012.

BEN SALEM, Hela. INVEST in good user stories. 2023. DisponÃ­vel em: https://www.bensalem.dev. Acesso em: 1 maio 2026.

CASAROTTO, Camila. AnÃ¡lise SWOT: o que Ã© e como fazer. 2019. DisponÃ­vel em: https://rockcontent.com/br/blog/analise-swot/. Acesso em: 1 maio 2026.

DEVMEDIA. MER e DER: modelagem de bancos de dados. DevMedia, 2014. DisponÃ­vel em: https://www.devmedia.com.br/mer-e-der-modelagem-de-bancos-de-dados/14332. Acesso em: 7 maio 2026.

DEVMEDIA. Tecnologias de banco de dados e modelagem de dados. DevMedia, [s.d.]. DisponÃ­vel em: https://www.devmedia.com.br/tecnologias-de-banco-de-dados-e-modelagem-de-dados/1660. Acesso em: 7 maio 2026.

DEVMEDIA. MER e DER: modelagem de bancos de dados. DisponÃ­vel em: https://www.devmedia.com.br/mer-e-der-modelagem-de-bancos-de-dados/14332. Acesso em: 6 maio 2026.

FIGUEIREDO, R. M. Diagrama de SequÃªncia. Belo Horizonte: UFMG, 2026. DisponÃ­vel em: https://homepages.dcc.ufmg.br/~figueiredo/disciplinas/aulas/uml-diagrama-sequencia_v01.pdf. Acesso em: 12 maio 2026.

FOWLER, Martin. Patterns of Enterprise Application Architecture. Boston: Addison-Wesley, 2002.

GARRETT, Jesse James. The elements of user experience: user centered design for the web and beyond. 2. ed. Berkeley: New Riders, 2011.

Interaction Design Foundation. User stories in UX. 2024. DisponÃ­vel em: https://www.interaction-design.org. Acesso em: 1 maio 2026.

LUCID SOFTWARE INC. O que Ã© um diagrama entidade relacionamento?. DisponÃ­vel em: https://www.lucidchart.com/pages/pt/o-que-e-diagrama-entidade-relacionamento. Acesso em: 6 maio 2026.  

MARTIN, Robert C. Agile Software Development: Principles, Patterns, and Practices. Upper Saddle River: Prentice Hall, 2002. DisponÃ­vel em: https://openlibrary.org/books/OL9297484M/Agile_Software_Development_Principles_Patterns_and_Practices. Acesso em: 28 maio 2026.

Microsoft. Best practices for RESTful web API design. 2023. Microsoft Azure Architecture Center. DisponÃ­vel em: https://learn.microsoft.com. Acesso em: 1 maio 2026.

Nielsen Norman Group. Personas and user-centered design. 2024. DisponÃ­vel em: https://www.nngroup.com. Acesso em: 1 maio 2026.

OSTERWALDER, Alexander; PIGNEUR, Yves. Value proposition design: how to create products and services customers want. Hoboken: John Wiley & Sons, 2011.

PERERA, Nuwan. Understanding Crowâs Foot Notation: Symbols & Usage Guide. Creately, 18 fev. 2026. DisponÃ­vel em: https://creately.com/guides/crows-foot-notation/. Acesso em: 11 maio 2026.

PLANTUML. PlantUML: open-source tool that uses simple textual descriptions to draw UML diagrams. DisponÃ­vel em: https://plantuml.com. Acesso em: 12 maio 2026.

PMI (PROJECT MANAGEMENT INSTITUTE). A guide to the project management body of knowledge (PMBOKÂ® Guide). 7. ed. Newtown Square: Project Management Institute, 2021.

PM3. Style guide: o que Ã© e como criar um guia de estilo para produtos digitais. PM3, [s.d.]. DisponÃ­vel em: https://pm3.com.br/blog/style-guide/?utm_source=chatgpt.com. Acesso em: 13 maio 2026.

PORTER, Michael E. The five competitive forces that shape strategy. Harvard Business Review, Boston, v. 86, n. 1, p. 78â93, 2008.

RED BULL. Red Bull 24 Hours. 2025. DisponÃ­vel em: https://www.redbull.com/se-en/events/24-hours. Acesso em: 1 maio 2026.

RICHARDS, Mark. Software Architecture Patterns. Sebastopol: O'Reilly Media, 2015.

TYMOSHCHENKO, Kateryna. Acceptance criteria in agile development. 2023. DisponÃ­vel em: https://www.atlassian.com. Acesso em: 1 maio 2026.

# <a name="c9"></a>Anexos

*Inclua aqui quaisquer complementos para seu projeto, como diagramas, imagens, tabelas etc. Organize em sub-tÃ³picos utilizando headings menores (use ## ou ### para isso)*
