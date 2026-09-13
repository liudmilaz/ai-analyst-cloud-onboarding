-- ====================================================================
-- PHASE 2: Solution - Entity-Based Join Path (Avoiding FX Fan-Out)
-- ====================================================================

-- Correct Join Path: raw_subscriptions -> raw_merchants -> raw_markets
SELECT
  s.subscription_id,
  s.merchant_id,
  m.merchant_name,
  mk.market_name,
  s.currency,
  s.price_in_cents / 100.0 AS price_original_currency,
  ROUND((s.price_in_cents / 100.0) / mk.fx_rate_to_eur, 2) AS price_eur
FROM
  `aiwomen26ham-4452.invented_software_raw.raw_subscriptions` s
JOIN
  `aiwomen26ham-4452.invented_software_raw.raw_merchants` m
  ON s.merchant_id = m.merchant_id
JOIN
  `aiwomen26ham-4452.invented_software_raw.raw_markets` mk
  ON m.market_id = mk.market_id;

-- Verification:
-- Exactly 117 rows returned (no Cartesian explosion).
