-- 0006_create_checkpoint.sql
-- Creates checkpoint, linked to runner, competition and admin.

CREATE TABLE checkpoint (
  id               INTEGER      NOT NULL GENERATED ALWAYS AS IDENTITY,
  identifier       VARCHAR(100) NOT NULL,
  distance_km      NUMERIC(6, 3) NOT NULL,
  pace             VARCHAR(20)  NULL,
  time             VARCHAR(20)  NULL,
  image            JSONB        NULL,
  id_runner        INTEGER      NOT NULL,
  id_competition   INTEGER      NOT NULL,
  id_admin         INTEGER      NOT NULL,
  created_at       TIMESTAMP    NOT NULL DEFAULT NOW(),

  CONSTRAINT pk_checkpoint          PRIMARY KEY (id),
  CONSTRAINT uq_checkpoint_identifier UNIQUE (identifier),
  CONSTRAINT ck_checkpoint_distance_km
    CHECK (distance_km >= 0 AND distance_km <= 1000),
  CONSTRAINT ck_checkpoint_pace_format
    CHECK (pace IS NULL OR pace ~ '^[0-9]{1,2}:[0-9]{2}/km$'),
  CONSTRAINT ck_checkpoint_time_format
    CHECK (time IS NULL OR time ~ '^[0-9]{2}:[0-9]{2}:[0-9]{2}$'),
  CONSTRAINT fk_checkpoint_id_runner
    FOREIGN KEY (id_runner)      REFERENCES runner      (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_checkpoint_id_competition
    FOREIGN KEY (id_competition) REFERENCES competition (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_checkpoint_id_admin
    FOREIGN KEY (id_admin)       REFERENCES admin       (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_checkpoint_id_runner     ON checkpoint (id_runner);
CREATE INDEX idx_checkpoint_id_competition ON checkpoint (id_competition);
CREATE INDEX idx_checkpoint_id_admin      ON checkpoint (id_admin);
CREATE INDEX idx_checkpoint_created_at    ON checkpoint (created_at);
