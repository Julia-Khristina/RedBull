-- 0007_create_ocr_extraction.sql
-- Creates ocr_extraction, optionally linked to checkpoint by id_checkpoint.

CREATE TABLE ocr_extraction (
    id              INTEGER     NOT NULL GENERATED ALWAYS AS IDENTITY,
    image           JSONB       NOT NULL,
    extracted_data  JSONB       NULL,
    validation      JSONB       NULL,
    status          VARCHAR(30) NOT NULL DEFAULT 'pending',
    id_checkpoint   INTEGER     NULL,
    created_at      TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP   NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_ocr_extraction PRIMARY KEY (id),
    CONSTRAINT ck_ocr_extraction_status
        CHECK (status IN ('pending', 'processed', 'validated', 'rejected')),
    CONSTRAINT fk_ocr_extraction_id_checkpoint
        FOREIGN KEY (id_checkpoint) REFERENCES checkpoint (id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE INDEX idx_ocr_extraction_status        ON ocr_extraction (status);
CREATE INDEX idx_ocr_extraction_id_checkpoint ON ocr_extraction (id_checkpoint);
