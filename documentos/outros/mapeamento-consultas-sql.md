# Mapeamento das Consultas SQL da Seção 3.6.4

Documento que identifica e detalha as cinco consultas SQL presentes na
seção 3.6.4 do WAD, justificando cada uma pelos RFs e RNs que atende e
descrevendo as entidades e relacionamentos do DER (seções 3.6.2 e 3.6.3)
que ela percorre. As consultas foram selecionadas para atender ao critério
de diversidade de operações e operadores lógicos exigido pelo barema da
disciplina de Matemática.

## 1. Critério de seleção

Uma consulta foi incluída neste mapeamento quando atende simultaneamente a:

- pertencer a um dos tipos de operação exigidos pelo barema: `SELECT`,
  `UPDATE` ou `DELETE`;
- utilizar ao menos dois operadores lógicos ou especiais distintos entre
  `AND`, `OR`, `NOT`, `LIKE`, `NOT LIKE`, `IN`, `NOT IN`, `BETWEEN`;
- operar sobre tabelas do modelo relacional definido nas seções 3.6.2 e
  3.6.3, podendo ser justificada por pelo menos um RF do sistema.

## 2. Consultas Mapeadas

### 2.1. Q01 — `SELECT` com `AND` e `OR`

| Campo                  | Conteúdo                                                                 |
|------------------------|--------------------------------------------------------------------------|
| Tipo de operação       | `SELECT`                                                                 |
| Operadores lógicos     | `AND`, `OR`                                                              |
| Operadores relacionais | `=`, `>`, `<`                                                            |
| RF atendido            | RF008, RF009                                                             |
| RNs justificadas       | RN06 (valores que divergirem da média histórica devem ser destacados)    |
| Tabela percorrida      | `checkpoint`                                                             |
| Relacionamentos do DER | `checkpoint.competicao_id → competicao.id` (N:1)                        |
| Contexto de negócio    | Identificar checkpoints com quilometragem fora da faixa esperada em uma competição, sinalizando registros candidatos a revisão manual. |

**Justificativa:** RF009 exige identificar inconsistências nos dados de
checkpoint antes da validação. A disjunção `OR` entre dois extremos de
quilometragem, combinada com o filtro por competição via `AND`, expressa
exatamente a condição de outlier que a regra RN06 determina destacar.

---

### 2.2. Q02 — `SELECT` com `LIKE`, `AND` e `NOT`

| Campo                  | Conteúdo                                                                 |
|------------------------|--------------------------------------------------------------------------|
| Tipo de operação       | `SELECT`                                                                 |
| Operadores lógicos     | `AND`, `NOT`                                                             |
| Operadores especiais   | `LIKE`                                                                   |
| Operadores relacionais | `=`                                                                      |
| RF atendido            | RF003, RF011                                                             |
| RNs justificadas       | RN07 (apenas um atleta por equipe com status "Em corrida" simultaneamente) |
| Tabela percorrida      | `corredor`                                                               |
| Relacionamentos do DER | `corredor.equipe_id → equipe.id` (N:1)                                   |
| Contexto de negócio    | Listar corredores ativos cujo nome começa com uma letra específica, útil em buscas rápidas durante a operação da competição. |

**Justificativa:** RF003 cobre o cadastro e a consulta de atletas; RF011
exige a exibição do atleta em corrida no painel administrativo. A
combinação de `LIKE` para busca textual com `NOT` para exclusão de status
reflete a necessidade de filtrar corredores disponíveis para atribuição
de turno.

---

### 2.3. Q03 — `UPDATE` com `AND` e `IN`

| Campo                  | Conteúdo                                                                 |
|------------------------|--------------------------------------------------------------------------|
| Tipo de operação       | `UPDATE`                                                                 |
| Operadores lógicos     | `AND`                                                                    |
| Operadores especiais   | `IN`                                                                     |
| Operadores relacionais | `=`                                                                      |
| RF atendido            | RF011                                                                    |
| RNs justificadas       | RN07 (ao confirmar troca, atleta anterior deve ser definido como "Em descanso" automaticamente) |
| Tabela percorrida      | `corredor`                                                               |
| Relacionamentos do DER | `corredor.equipe_id → equipe.id` (N:1)                                   |
| Contexto de negócio    | Ao final de um turno de corrida, marcar como "Em descanso" todos os corredores de uma equipe que estavam em corrida ou previstos para entrar. |

**Justificativa:** RN07 obriga que a troca de atleta seja feita de forma
atômica — todos os corredores com status `Em corrida` ou `Próximo` de uma
mesma equipe devem ser atualizados simultaneamente. O operador `IN`
expressa essa condição de pertinência a um conjunto de estados de forma
concisa, enquanto `AND` garante o escopo da equipe correta.

---

### 2.4. Q04 — `DELETE` com `AND` e `NOT LIKE`

| Campo                  | Conteúdo                                                                 |
|------------------------|--------------------------------------------------------------------------|
| Tipo de operação       | `DELETE`                                                                 |
| Operadores lógicos     | `AND`                                                                    |
| Operadores especiais   | `NOT LIKE`                                                               |
| Operadores relacionais | `=`                                                                      |
| RF atendido            | RF008                                                                    |
| RNs justificadas       | RN04 (checkpoint deve conter campos obrigatórios no padrão definido), RN05 (log de auditoria deve registrar o método de entrada) |
| Tabela percorrida      | `checkpoint`                                                             |
| Relacionamentos do DER | `checkpoint.competicao_id → competicao.id` (N:1)                        |
| Contexto de negócio    | Remover registros de checkpoint criados fora do padrão esperado de identificador (registros de teste ou inserções manuais inválidas) para uma competição específica. |

**Justificativa:** RF008 restringe o registro de checkpoints a dados
validados. A exclusão de registros cujo identificador não segue o padrão
`CP-` via `NOT LIKE`, combinada com o filtro por competição via `AND`,
implementa a limpeza de dados inválidos antes da consolidação do evento,
preservando a integridade exigida por RN04.

---

### 2.5. Q05 — `SELECT` com `BETWEEN`, `AND` e `NOT IN`

| Campo                  | Conteúdo                                                                 |
|------------------------|--------------------------------------------------------------------------|
| Tipo de operação       | `SELECT`                                                                 |
| Operadores lógicos     | `AND`                                                                    |
| Operadores especiais   | `BETWEEN`, `NOT IN`                                                      |
| RF atendido            | RF010, RF013                                                             |
| RNs justificadas       | RN09 (ranking atualizado a cada checkpoint), RN15 (exportação CSV inclui todos os checkpoints) |
| Tabela percorrida      | `checkpoint`                                                             |
| Relacionamentos do DER | `checkpoint.corredor_id → corredor.id` (N:1)                            |
| Contexto de negócio    | Listar checkpoints com quilometragem dentro de uma faixa típica de desempenho, excluindo corredores específicos (por exemplo, atletas que solicitaram exclusão de relatórios públicos). |

**Justificativa:** RF010 e RF013 demandam consultas sobre subconjuntos
de checkpoints — respectivamente para o ranking e para a exportação CSV.
O operador `BETWEEN` expressa restrição de intervalo numérico de forma
declarativa, enquanto `NOT IN` exclui corredores por conjunto de IDs,
combinação diretamente aplicável à filtragem de dados para ambas as
funcionalidades.

---

## 3. Resumo

| Q   | Tipo     | Tabela principal | Operadores                        | RF            |
|-----|----------|------------------|-----------------------------------|---------------|
| Q01 | `SELECT` | `checkpoint`     | `AND`, `OR`, `=`, `>`, `<`        | RF008, RF009  |
| Q02 | `SELECT` | `corredor`       | `AND`, `NOT`, `LIKE`, `=`         | RF003, RF011  |
| Q03 | `UPDATE` | `corredor`       | `AND`, `IN`, `=`                  | RF011         |
| Q04 | `DELETE` | `checkpoint`     | `AND`, `NOT LIKE`, `=`            | RF008         |
| Q05 | `SELECT` | `checkpoint`     | `AND`, `BETWEEN`, `NOT IN`        | RF010, RF013  |

As cinco consultas cobrem os três tipos de operação exigidos pelo barema
(SELECT, UPDATE, DELETE), sete operadores lógicos e especiais distintos
e quatro das seis tabelas do modelo relacional (`checkpoint`, `corredor`,
`equipe` via FK, `competicao` via FK).
