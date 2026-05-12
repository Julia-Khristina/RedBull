-- TABELA: competicao
CREATE TABLE competicao (
    id          SMALLINT        NOT NULL GENERATED ALWAYS AS IDENTITY,
    endereco    VARCHAR(255)    NOT NULL,
    data        DATE            NOT NULL,
    criado_em   TIMESTAMP       NOT NULL DEFAULT NOW(),

    PRIMARY KEY (id)
);

CREATE INDEX idx_competicao_data ON competicao (data);

-- TABELA: equipe
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