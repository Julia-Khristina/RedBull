-- ============================================================
-- Verification: 003_verify_statistics_competition_1319
-- Execute APÓS a limpeza e antes de confirmar o COMMIT
-- Todos os valores devem bater com a tabela de métricas esperadas
-- ============================================================

-- 1. Total de checkpoints (deve ser 98)
SELECT COUNT(*) AS total_checkpoints
FROM checkpoint
WHERE id_competition = 1319;

-- 2. KM total por equipe (usando JOIN com runner)
SELECT
  t.id AS team_id,
  t.name AS team_name,
  COUNT(c.id) AS total_voltas,
  COALESCE(SUM(c.distance_km), 0) AS total_km
FROM team t
LEFT JOIN runner r ON r.id_team = t.id
LEFT JOIN checkpoint c ON c.id_runner = r.id AND c.id_competition = 1319
WHERE t.id_competition = 1319
GROUP BY t.id, t.name
ORDER BY total_km DESC;

-- 3. KM total geral (deve ser 490 km)
SELECT COALESCE(SUM(distance_km), 0) AS total_km_geral
FROM checkpoint
WHERE id_competition = 1319;

-- 4. Amanda Almeida (id_runner = 1494) — KM total (deve ser 35 km, 7 checkpoints)
SELECT
  r.name,
  COUNT(c.id) AS checkpoints,
  COALESCE(SUM(c.distance_km), 0) AS total_km
FROM runner r
LEFT JOIN checkpoint c ON c.id_runner = r.id AND c.id_competition = 1319
WHERE r.id = 1494
GROUP BY r.id, r.name;

-- 5. Amanda Almeida — pace médio (deve ser ~06:00/km)
SELECT
  r.name,
  AVG(
    CAST(split_part(split_part(c.pace, ':', 2), '/', 1) AS INTEGER)
    + CAST(split_part(c.pace, ':', 1) AS INTEGER) * 60
  ) AS pace_medio_segundos
FROM runner r
JOIN checkpoint c ON c.id_runner = r.id AND c.id_competition = 1319
WHERE r.id = 1494 AND c.pace IS NOT NULL
GROUP BY r.id, r.name;

-- 6. Checkpoints por operador (admin)
SELECT
  a.id AS admin_id,
  a.name AS admin_name,
  COUNT(c.id) AS total_checkpoints
FROM admin a
JOIN checkpoint c ON c.id_admin = a.id AND c.id_competition = 1319
GROUP BY a.id, a.name
ORDER BY a.id;

-- Deve retornar:
-- admin_id=279 (Carlos)  → 17
-- admin_id=282 (Juliana) → 36
