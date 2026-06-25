-- ============================================================
-- Migration: 001_cleanup_invalid_checkpoints_competition_1319
-- Descrição: Remove 5 checkpoints inválidos inseridos após o
--            encerramento da competição #1319 (Red Bull 24h SP)
-- Critério: created_at > '2026-06-22' (data posterior ao evento)
-- ============================================================

BEGIN;

-- Passo 1: Verificar quantos registros serão afetados
SELECT COUNT(*) AS total_para_remover
FROM checkpoint
WHERE id_competition = 1319
  AND created_at::date > '2026-06-22';

-- Passo 2: Listar os registros que serão removidos (para auditoria)
SELECT id, identifier, created_at, distance_km, pace, id_runner
FROM checkpoint
WHERE id_competition = 1319
  AND created_at::date > '2026-06-22'
ORDER BY created_at;

-- Passo 3: Remover os registros inválidos
DELETE FROM checkpoint
WHERE id_competition = 1319
  AND created_at::date > '2026-06-22';

-- Passo 4: Verificar que restaram exatamente 98 checkpoints
SELECT COUNT(*) AS total_restante
FROM checkpoint
WHERE id_competition = 1319;

-- Commit se tudo estiver correto (98 registros restantes)
-- Se o COUNT não for 98, executar ROLLBACK em vez de COMMIT
-- COMMIT;

-- Para validar antes de confirmar:
-- 1. Execute este script até aqui (ele fará o SELECT COUNT via BEGIN)
-- 2. Confirme que "total_para_remover" = 5
-- 3. Confirme que "total_restante" = 98
-- 4. Substitua o ROLLBACK abaixo por COMMIT
ROLLBACK;
