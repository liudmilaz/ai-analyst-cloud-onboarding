-- ====================================================================
-- PHASE 3: Solution - Clean Monthly MRR & Exit ARR (Dec 2025)
-- ====================================================================

WITH active_subs_dec_2025 AS (
  SELECT
    s.subscription_id,
    s.merchant_id,
    ROUND((s.price_in_cents / 100.0) / mk.fx_rate_to_eur, 2) AS mrr_eur
  FROM
    `aiwomen26ham-4452.invented_software_raw.raw_subscriptions` s
  JOIN
    `aiwomen26ham-4452.invented_software_raw.raw_merchants` m
    ON s.merchant_id = m.merchant_id
  JOIN
    `aiwomen26ham-4452.invented_software_raw.raw_markets` mk
    ON m.market_id = mk.market_id
  WHERE
    s.start_date <= '2025-12-01'
    AND (s.end_date IS NULL OR s.end_date >= '2025-12-01')
    AND s.status != 'cancelled_before_start'
)
SELECT
  COUNT(DISTINCT merchant_id) AS active_paying_merchants,
  COUNT(DISTINCT subscription_id) AS active_subscriptions,
  ROUND(SUM(mrr_eur), 2) AS total_mrr_eur,
  ROUND(SUM(mrr_eur) * 12, 2) AS exit_arr_eur
FROM
  active_subs_dec_2025;

-- Verified Benchmark:
-- Dec 2025 MRR = €1,509.78
-- Exit ARR     = €18,117.34
