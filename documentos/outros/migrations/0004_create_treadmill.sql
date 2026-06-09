-- 0004_create_treadmill.sql
-- Creates treadmill.

CREATE TABLE treadmill (
    id             INTEGER    NOT NULL GENERATED ALWAYS AS IDENTITY,
    name           TEXT       NOT NULL,
    specification  TEXT       NULL,
    created_at     TIMESTAMP  NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_treadmill PRIMARY KEY (id),
    CONSTRAINT ck_treadmill_name_not_empty
        CHECK (length(trim(name)) > 0)
);
