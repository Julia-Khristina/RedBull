-- 0002_create_equipe.sql
-- Cria a tabela equipe, vinculada à competicao via FK.

CREATE TABLE equipe (
    id              SMALLINT        NOT NULL GENERATED ALWAYS AS IDENTITY,
    nome            VARCHAR(100)    NOT NULL,
    uuid            UUID            NOT NULL DEFAULT gen_random_uuid(),
    qr_code         JSON            NULL,
    competicao_id   SMALLINT        NOT NULL,
    criado_em       TIMESTAMP       NOT NULL DEFAULT NOW(),

    PRIMARY KEY (id),
    UNIQUE (uuid),
    CHECK (length(trim(nome)) > 0)
);

ALTER TABLE equipe
    ADD CONSTRAINT equipe_competicao_id_foreign
    FOREIGN KEY (competicao_id) REFERENCES competicao (id);

CREATE INDEX idx_equipe_competicao_id ON equipe (competicao_id);
