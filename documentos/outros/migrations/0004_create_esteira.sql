-- 0004_create_esteira.sql
-- Cria a tabela esteira (sem dependências externas).

CREATE TABLE esteira (
    id              SMALLINT    NOT NULL GENERATED ALWAYS AS IDENTITY,
    nome            TEXT        NOT NULL,
    especificacao   TEXT        NULL,
    criado_em       TIMESTAMP   NOT NULL DEFAULT NOW(),

    PRIMARY KEY (id),
    CHECK (length(trim(nome)) > 0)
);
