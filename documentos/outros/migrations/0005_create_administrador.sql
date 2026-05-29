-- 0005_create_administrador.sql
-- Cria a tabela administrador (sem dependências externas).

CREATE TABLE administrador (
    id          SMALLINT        NOT NULL GENERATED ALWAYS AS IDENTITY,
    nome        VARCHAR(100)    NOT NULL,
    area        VARCHAR(100)    NULL,
    senha       VARCHAR(255)    NOT NULL,
    criado_em   TIMESTAMP       NOT NULL DEFAULT NOW(),

    PRIMARY KEY (id),
    CHECK (length(trim(nome)) > 0)
);
