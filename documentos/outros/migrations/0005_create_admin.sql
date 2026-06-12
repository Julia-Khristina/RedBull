-- 0005_create_admin.sql
-- Creates admin.

CREATE TABLE admin (
    id          INTEGER       NOT NULL GENERATED ALWAYS AS IDENTITY,
    name        VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  NOT NULL,
    area        VARCHAR(100)  NULL,
    password    VARCHAR(255)  NOT NULL,
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_admin PRIMARY KEY (id),
    CONSTRAINT uq_admin_email UNIQUE (email),
    CONSTRAINT ck_admin_name_not_empty
        CHECK (length(trim(name)) > 0),
    CONSTRAINT ck_admin_email_format
        CHECK (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')
);
