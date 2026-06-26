-- ============================================================
-- Migration: 002_add_checkpoint_constraints
-- Descrição: Adiciona constraints e trigger para validar
--            checkpoints (período, distância, pace)
-- ============================================================

-- ============================================================
-- Parte A: Trigger para validar período da competição
-- Impede INSERT/UPDATE quando:
--   - competição está "closed"
--   - created_at está fora do período esperado (+2 dias)
-- ============================================================

CREATE OR REPLACE FUNCTION fn_validate_checkpoint_period()
RETURNS TRIGGER AS $$
DECLARE
  comp_date DATE;
  comp_status VARCHAR;
BEGIN
  SELECT date, status INTO comp_date, comp_status
  FROM competition
  WHERE id = NEW.id_competition;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Competição % não encontrada.', NEW.id_competition;
  END IF;

  -- Bloqueia se a competição já foi encerrada
  IF comp_status = 'closed' THEN
    RAISE EXCEPTION 'Competição % já encerrada. Novos checkpoints não são permitidos.',
      NEW.id_competition;
  END IF;

  -- Bloqueia se created_at está fora do período (+2 dias de tolerância)
  IF NEW.created_at::date > comp_date + INTERVAL '2 days' THEN
    RAISE EXCEPTION 'created_at % está fora do período da competição (iniciada em %).',
      NEW.created_at, comp_date;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_checkpoint_period ON checkpoint;
CREATE TRIGGER trg_checkpoint_period
BEFORE INSERT OR UPDATE ON checkpoint
FOR EACH ROW EXECUTE FUNCTION fn_validate_checkpoint_period();


-- ============================================================
-- Parte B: Ajustar constraint de distance_km
-- Altera de 0–1000 para 1.0–42.2 (volta padrão 5 km)
-- ============================================================

ALTER TABLE checkpoint
DROP CONSTRAINT IF EXISTS ck_checkpoint_distance_km;

ALTER TABLE checkpoint
ADD CONSTRAINT ck_checkpoint_distance_km
CHECK (distance_km >= 1.0 AND distance_km <= 42.2);


-- ============================================================
-- Parte C: Ajustar constraint de pace (formato + range)
-- Reforça formato e adiciona range 03:00/km a 20:00/km
-- ============================================================

-- Função para validar range do pace (IMMUTABLE para uso em CHECK)
CREATE OR REPLACE FUNCTION fn_validate_pace_range(pace_str VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  minutes INT;
  seconds INT;
  total_seconds INT;
BEGIN
  -- Pace está no formato MM:SS/km
  minutes := CAST(split_part(pace_str, ':', 1) AS INT);
  seconds := CAST(split_part(split_part(pace_str, ':', 2), '/', 1) AS INT);

  -- Valida que segundos estão entre 0 e 59
  IF seconds < 0 OR seconds > 59 THEN
    RETURN FALSE;
  END IF;

  total_seconds := minutes * 60 + seconds;

  -- Range humano: 3:00/km (180s) a 20:00/km (1200s)
  RETURN total_seconds BETWEEN 180 AND 1200;
EXCEPTION
  WHEN OTHERS THEN RETURN FALSE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Remove constraint antiga de formato
ALTER TABLE checkpoint
DROP CONSTRAINT IF EXISTS ck_checkpoint_pace_format;

-- Adiciona nova constraint que valida formato E range
ALTER TABLE checkpoint
ADD CONSTRAINT ck_checkpoint_pace_format
CHECK (
  pace IS NULL
  OR (
    pace ~ '^[0-9]{1,3}:[0-9]{2}/km$'
    AND fn_validate_pace_range(pace)
  )
);
