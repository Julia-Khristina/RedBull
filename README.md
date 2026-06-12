<p align="center">
  <a href="https://www.inteli.edu.br/">
    <img src="assets/inteli.png" alt="Inteli - Instituto de Tecnologia e Liderança" border="0" width=40% height=40%>
  </a>
</p>

<br>

# Red Bull 24h 

## Grupo 01

## Integrantes:

| | | | |
|---|---|---|---|
|[<img src="assets/integrantes/Ana-Clara.jpg" width="120" alt="Ana Clara Tenório Pelegrini">](https://www.linkedin.com/in/ana-clara-pelegrini-5855303b3/)<br>Ana Clara Tenório Pelegrini | [<img src="assets/integrantes/beatriz.jpg" width="120" alt="Beatriz Okubo Vieira Lima">](https://www.linkedin.com/in/beatriz-okubo-v-lima-71984536a/)<br>Beatriz Okubo Vieira Lima | [<img src="assets/integrantes/Eduardo.jpg" width="120" alt="Eduardo Hirohito Izawa Maciel">](https://www.linkedin.com/in/eduardohirohito/)<br>Eduardo Hirohito Izawa Maciel | [<img src="assets/integrantes/isabella.png" width="120" alt="Isabella Sandra Santos">](https://www.linkedin.com/in/isabella-bessa-b72b393aa/)<br>Isabella Sandra Santos|
| [<img src="assets/integrantes/julia-khristina.jpg" width="120" alt="Julia Khristina de Oliveira Silva Souza">](https://www.linkedin.com/in/julia-khristina/)<br>Julia Khristina de Oliveira Silva Souza | [<img src="assets/integrantes/luizacardosofoto.jpeg" width="120" alt="Luiza Nicol Giusti Dias Cardoso">](https://www.linkedin.com/in/luiza-nicol-giusti-dias-cardoso-b379473a9/)<br>Luiza Nicol Giusti Dias Cardoso | [<img src="assets/integrantes/mariana.jpeg" width="120" alt="Mariana Azevedo Silva">](https://www.linkedin.com/in/marianaazvd)<br>Mariana Azevedo Silva | [<img src="assets/integrantes/vinicius.JPG" width="120" alt="Vinícius Tavares Castiglia">](https://www.linkedin.com/in/vinicius-castiglia/)<br>Vinícius Tavares Castiglia |

## Professores:

### Orientador(a)

- <a href="https://www.linkedin.com/in/profclaudioandre/">Claudio Fernando André</a>

### Instrutores

- <a href="https://www.linkedin.com/in/camilanarantes/?locale=en">Camila Naves Arantes</a>
- <a href="https://www.linkedin.com/in/cristiano-benites-ph-d-687647a8/">Cristiano da Silva Benites</a>
- <a href="https://www.linkedin.com/in/heloisacandello/">Heloisa Caroline de Souza Pereira Candello</a>
- <a href="https://www.linkedin.com/in/luciano-galdino-26191b36/">Luciano Galdino</a>
- <a href="https://www.linkedin.com/in/natalia-k-37a62052/">Natalia Varela da Rocha Kloeckner</a>

## Descrição
A **Red Bull**, por meio do time de Field Marketing, é a parceira deste projeto. O **Red Bull 24 Horas** é uma competição em que duas equipes de dezesseis corredores se revezam em esteiras durante 24 horas, disputando a maior quilometragem total.

O registro atual é feito manualmente: operadores anotam em pranchetas os horários de troca de corredor e os checkpoints a cada 5 minutos. O processo gera erros de anotação, inconsistências entre turnos e nenhuma rastreabilidade dos dados ao final do evento.

A solução é uma aplicação web em que o operador fotografa o visor da esteira e o sistema extrai os dados via OCR. Os dados passam por validação humana antes de serem confirmados, com alertas automáticos em caso de inconsistência.

A aplicação tem dois ambientes:

- **Administrativo:** acesso por login; cadastro de competições, equipes e corredores; registro de checkpoints via OCR ou entrada manual; exportação de relatórios.
- **Público (por equipe):** acesso via URL com UUID único, sem login; exibe ranking, status dos corredores e calculadora de descanso.

## Link de demonstração

_Em breve._

## Estrutura de pastas

```
g01/
│
├── assets/
│   ├── design/         
│   ├── integrantes/     
│   ├── negocios/       
│   └── programacao/    
│
├── documentos/
│   ├── wad.md          
│   └── outros/         
│       └── migrations/  
│
├── src/
│   ├── controllers/    
│   ├── services/        
│   ├── repositories/   
│   ├── routes/          
│   ├── models/        
│   ├── validators/     
│   ├── middlewares/    
│   ├── errors/         
│   ├── helpers/        
│   ├── database/        
│   └── server.ts        
│
├── dist/               
├── .env                 
├── .gitignore
├── jest.config.js
├── package.json
├── tsconfig.json
└── README.md
```

Dentre os arquivos e pastas presentes na raiz do projeto, destacam-se:

- **`assets/`:** Imagens e recursos visuais utilizados na documentação e no WAD.
- **`documentos/`:** Contém o Web Application Document (WAD) do projeto e documentação auxiliar.
- **`src/`:** Todo o código-fonte desenvolvido para o projeto, organizado em camadas (controllers, services, repositories, routes).
- **`dist/`:** Código TypeScript compilado para JavaScript, gerado automaticamente pelo `npm run build`.
- **`README.md`:** Arquivo que serve como guia introdutório e explicação geral sobre o projeto (o mesmo que você está lendo agora).

## Configuração para desenvolvimento e execução do código

### Requisitos

- Node.js (versão 18 ou superior)
- Visual Studio Code

### Como executar o projeto localmente

**1. Clone o repositório:**

```bash
git clone https://git.inteli.edu.br/graduacao/2026-1b/t27/g01.git
cd g01
```

**2. Instale as dependências:**

```bash
npm install
```

**3. Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_do_supabase
JWT_SECRET=sua_chave_secreta_jwt
PORT=3000
```

> Nunca versione o arquivo `.env`. Ele já está listado no `.gitignore`.

**4. Inicie o servidor em modo de desenvolvimento:**

```bash
npm run dev
```

O servidor rodará em `http://localhost:3000/`

**5. Para build de produção:**

```bash
npm run build
npm start
```

**6. Para executar os testes:**

```bash
npm test
```

## Histórico de lançamentos
- **0.5.0** – 26/06/2026 – Versão final: autenticação e autorização implementadas do zero, testes de usabilidade com 3+ participantes, conclusões do WAD, pitch para o parceiro e publicação do projeto.
- **0.4.0** – 12/06/2026 – Segunda versão funcional: integração ponta a ponta dos fluxos principais, suite de testes automatizados (cobertura ≥80% na camada Service), análise de mercado, Business Model Canvas e estratégia de marketing (4Ps).
- **0.3.0** – 29/05/2026 – Primeira versão funcional do backend: WebAPI operante, documentação de endpoints em HTML, arquitetura em camadas documentada, padrões de projeto aplicados, consultas SQL com lógica proposicional e tabelas verdade.
- **0.2.0** – 15/05/2026 – Wireframes de baixa fidelidade, guia de estilos, protótipo de alta fidelidade, diagramas de classes e sequência UML, modelo ER, DER, modelo relacional e migrations DDL.
- **0.1.0** – 01/05/2026 – Análise de negócios (Porter, SWOT, Value Proposition Canvas, matriz de riscos), personas, user stories no formato INVEST, requisitos funcionais e não funcionais (ISO/IEC 25010), casos de uso e matriz de rastreabilidade RF→RN→Endpoint.

## Licença/License

<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL">Red Bull 24h</a> by <a rel="cc:attributionURL dct:creator" property="cc:attributionName">Inteli, <a href="https://www.linkedin.com/in/ana-clara-pelegrini-5855303b3/">Ana Clara Tenório Pelegrini</a>, <a href="https://www.linkedin.com/in/beatriz-okubo-v-lima-71984536a/">Beatriz Okubo Vieira Lima</a>, <a href="https://www.linkedin.com/in/eduardohirohito/">Eduardo Hirohito Izawa Maciel</a>, <a href="https://www.linkedin.com/in/isabella-bessa-b72b393aa/">Isabella Sandra Santos</a>, <a href="https://www.linkedin.com/in/julia-khristina/">Julia Khristina de Oliveira Silva Souza</a>, <a href="https://www.linkedin.com/in/luiza-nicol-giusti-dias-cardoso-b379473a9/">Luiza Nicol Giusti Dias Cardoso</a>, <a href="https://www.linkedin.com/in/marianaazvd">Mariana Azevedo Silva</a>, <a href="https://www.linkedin.com/in/vinicius-castiglia/">Vinícius Tavares Castiglia</a></a> is licensed under <a href="http://creativecommons.org/licenses/by/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">Attribution 4.0 International</a>.</p>