-- 0003_create_runner.sql
-- Creates runner, linked to team by id_team.

CREATE TABLE runner (
    id          INTEGER       NOT NULL GENERATED ALWAYS AS IDENTITY,
    name        VARCHAR(100)  NOT NULL,
    status      VARCHAR(50)   NOT NULL DEFAULT 'runner',
    email       VARCHAR(150)  NOT NULL,
    phone       VARCHAR(20)   NULL,
    cpf         VARCHAR(14)   NOT NULL,
    id_team     INTEGER       NOT NULL,
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_runner PRIMARY KEY (id),
    CONSTRAINT uq_runner_cpf UNIQUE (cpf),
    CONSTRAINT uq_runner_email UNIQUE (email),
    CONSTRAINT ck_runner_status
        CHECK (status IN ('runner', 'captain')),
    CONSTRAINT ck_runner_name_not_empty
        CHECK (length(trim(name)) > 0),
    CONSTRAINT ck_runner_cpf_format
        CHECK (cpf ~ '^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$'),
    CONSTRAINT ck_runner_email_format
        CHECK (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
    CONSTRAINT fk_runner_id_team
        FOREIGN KEY (id_team) REFERENCES team (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE INDEX idx_runner_id_team ON runner (id_team);
CREATE INDEX idx_runner_cpf     ON runner (cpf);
