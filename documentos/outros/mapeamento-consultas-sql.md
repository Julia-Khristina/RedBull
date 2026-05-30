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
| RF atendido            | RF003                                                                    |
| RNs justificadas       | Não há RN específica; apoia a operação do RF003                          |
| Tabela percorrida      | `corredor`                                                               |
| Relacionamentos do DER | `corredor.equipe_id → equipe.id` (N:1)                                   |
| Contexto de negócio    | Listar participantes comuns cujo nome começa com uma letra específica, excluindo capitães da busca operacional. |

**Justificativa:** RF003 cobre o cadastro e a consulta de atletas. A
combinação de `LIKE` para busca textual com `NOT` para exclusão do papel
`capitao` permite filtrar participantes comuns sem violar a restrição
física da tabela `corredor`, cujo campo `status` aceita apenas `corredor`
e `capitao`.

---

### 2.3. Q03 — `UPDATE` com `AND` e `IN`

| Campo                  | Conteúdo                                                                 |
|------------------------|--------------------------------------------------------------------------|
| Tipo de operação       | `UPDATE`                                                                 |
| Operadores lógicos     | `AND`                                                                    |
| Operadores especiais   | `IN`                                                                     |
| Operadores relacionais | `=`                                                                      |
| RF atendido            | RF003                                                                    |
| RNs justificadas       | Não há RN específica; apoia a operação do RF003                          |
| Tabela percorrida      | `corredor`                                                               |
| Relacionamentos do DER | `corredor.equipe_id → equipe.id` (N:1)                                   |
| Contexto de negócio    | Atualizar o papel cadastral de corredores específicos de uma equipe, promovendo-os a capitães. |

**Justificativa:** RF003 cobre o gerenciamento de atletas vinculados a uma
equipe. O operador `IN` expressa a seleção de um conjunto de corredores
por identificador, enquanto `AND` garante que a atualização fique restrita
à equipe correta. A consulta mantém compatibilidade com o `CHECK` do
modelo físico ao atualizar o status para `capitao`.

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
| Q02 | `SELECT` | `corredor`       | `AND`, `NOT`, `LIKE`, `=`         | RF003         |
| Q03 | `UPDATE` | `corredor`       | `AND`, `IN`, `=`                  | RF003         |
| Q04 | `DELETE` | `checkpoint`     | `AND`, `NOT LIKE`, `=`            | RF008         |
| Q05 | `SELECT` | `checkpoint`     | `AND`, `BETWEEN`, `NOT IN`        | RF010, RF013  |

As cinco consultas cobrem os três tipos de operação exigidos pelo barema
(SELECT, UPDATE, DELETE), sete operadores lógicos e especiais distintos
e quatro das seis tabelas do modelo relacional (`checkpoint`, `corredor`,
`equipe` via FK, `competicao` via FK).
