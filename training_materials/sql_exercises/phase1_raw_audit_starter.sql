-- ====================================================================
-- PHASE 1: Raw Lakehouse Data Audit
-- Task: Explore raw tables in BigQuery, discover schema anomalies,
--       and identify minor unit representations (cents vs euros).
-- Target: `aiwomen26ham-4452.invented_software_raw`
-- ====================================================================

-- 1. Inspect table schemas and record counts
SELECT 'raw_merchants' AS table_name, COUNT(*) AS total_rows FROM `aiwomen26ham-4452.invented_software_raw.raw_merchants`
UNION ALL
SELECT 'raw_subscriptions', COUNT(*) FROM `aiwomen26ham-4452.invented_software_raw.raw_subscriptions`
UNION ALL
SELECT 'raw_operating_costs', COUNT(*) FROM `aiwomen26ham-4452.invented_software_raw.raw_operating_costs`;

-- 2. INVESTIGATION QUESTION:
-- Look at raw_operating_costs.amount_in_cents and distinct cost_categories.
-- What unexpected category exists, and what percentage of total spend does it comprise?
-- Write your investigative query below:


