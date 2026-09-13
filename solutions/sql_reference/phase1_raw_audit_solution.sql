-- ====================================================================
-- PHASE 1: Solution - Raw Lakehouse Audit & Stock-vs-Flow Discovery
-- ====================================================================

-- 1. Breakdown of costs by category
SELECT
  cost_category,
  COUNT(*) AS transaction_count,
  ROUND(SUM(amount_in_cents) / 100.0, 2) AS total_amount_eur,
  ROUND(SUM(amount_in_cents) * 100.0 / SUM(SUM(amount_in_cents)) OVER(), 2) AS pct_of_total_spend
FROM
  `aiwomen26ham-4452.invented_software_raw.raw_operating_costs`
GROUP BY
  cost_category
ORDER BY
  total_amount_eur DESC;

-- Key Finding:
-- cash_balance_eom represents €1,233,485.81 (93.8% of the column sum).
-- It is a balance sheet snapshot (stock), NOT an operating expense (flow).
