-- 0001_create_competicao.sql
-- Cria a tabela competicao, raiz do modelo (sem dependências externas).

CREATE TABLE competicao (
    id          SMALLINT        NOT NULL GENERATED ALWAYS AS IDENTITY,
    nome        VARCHAR(100)    NOT NULL,
    endereco    VARCHAR(255)    NOT NULL,
    data        DATE            NOT NULL,
    status      VARCHAR(30)     NOT NULL DEFAULT 'não iniciado',
    criado_em   TIMESTAMP       NOT NULL DEFAULT NOW(),

    PRIMARY KEY (id),
    CHECK (status IN ('não iniciado', 'em andamento', 'encerrada')),
    CHECK (length(trim(nome)) > 0),
    CHECK (data >= DATE '2020-01-01')
);

CREATE INDEX idx_competicao_data ON competicao (data);
