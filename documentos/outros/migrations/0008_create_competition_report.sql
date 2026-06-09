-- 0008_create_competition_report.sql
-- Creates competition_report, linked to competition by id_competition.

CREATE TABLE competition_report (
    id_competition  INTEGER    NOT NULL,
    summary         JSONB      NOT NULL,
    highlights      JSONB      NOT NULL,
    generated_at    TIMESTAMP  NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_competition_report PRIMARY KEY (id_competition),
    CONSTRAINT fk_competition_report_id_competition
        FOREIGN KEY (id_competition) REFERENCES competition (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
