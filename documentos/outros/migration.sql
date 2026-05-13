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



-- TABELA: corredor
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
    CHECK (status IN ('corredor', 'capitão'))
);


ALTER TABLE corredor
    ADD CONSTRAINT corredor_equipe_id_foreign
    FOREIGN KEY (equipe_id) REFERENCES equipe (id);


CREATE INDEX idx_corredor_equipe_id ON corredor (equipe_id);
CREATE INDEX idx_corredor_cpf       ON corredor (cpf);

-- TABELA: esteira
CREATE TABLE esteira (
    id              SMALLINT    NOT NULL GENERATED ALWAYS AS IDENTITY,
    nome            TEXT        NOT NULL,
    especificacao   TEXT        NULL,
    criado_em       TIMESTAMP   NOT NULL DEFAULT NOW(),

    PRIMARY KEY (id)
);

-- TABELA: administrador
CREATE TABLE administrador (
    id          SMALLINT        NOT NULL GENERATED ALWAYS AS IDENTITY,
    nome        VARCHAR(100)    NOT NULL,
    area        VARCHAR(100)    NULL,
    senha       VARCHAR(255)    NOT NULL,
    criado_em   TIMESTAMP       NOT NULL DEFAULT NOW(),

    PRIMARY KEY (id)
);

-- TABELA: checkpoint
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