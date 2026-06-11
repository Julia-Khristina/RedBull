-- 0002_create_team.sql
-- Creates team, linked to competition by id_competition.

CREATE TABLE team (
    id              INTEGER       NOT NULL GENERATED ALWAYS AS IDENTITY,
    name            VARCHAR(100)  NOT NULL,
    uuid            UUID          NOT NULL DEFAULT gen_random_uuid(),
    qr_code         JSONB         NULL,
    id_competition  INTEGER       NOT NULL,
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_team PRIMARY KEY (id),
    CONSTRAINT uq_team_uuid UNIQUE (uuid),
    CONSTRAINT ck_team_name_not_empty
        CHECK (length(trim(name)) > 0),
    CONSTRAINT fk_team_id_competition
        FOREIGN KEY (id_competition) REFERENCES competition (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE INDEX idx_team_id_competition ON team (id_competition);
