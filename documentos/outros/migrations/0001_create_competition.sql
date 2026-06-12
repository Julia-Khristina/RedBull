-- 0001_create_competition.sql
-- Creates competition, the root table of the model.

CREATE TABLE competition (
    id          INTEGER       NOT NULL GENERATED ALWAYS AS IDENTITY,
    name        VARCHAR(100)  NOT NULL,
    address     VARCHAR(255)  NOT NULL,
    date        DATE          NOT NULL,
    status      VARCHAR(30)   NOT NULL DEFAULT 'not_started',
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_competition PRIMARY KEY (id),
    CONSTRAINT ck_competition_status
        CHECK (status IN ('not_started', 'in_progress', 'closed')),
    CONSTRAINT ck_competition_name_not_empty
        CHECK (length(trim(name)) > 0),
    CONSTRAINT ck_competition_date_min
        CHECK (date >= DATE '2020-01-01')
);

CREATE INDEX idx_competition_date ON competition (date);
