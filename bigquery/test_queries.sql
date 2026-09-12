-- BigQuery Verification Queries for Invented Software
-- Validates calculations, traps, and canonical metrics

-- 1. TRAP CHECK: Join Fan-Out test (Joining subscriptions on currency vs merchant join path)
-- Bad join: joins on currency -> fans out to 300 rows!
SELECT
  COUNT(*) as row_count,
  ROUND(SUM(s.mrr_local / 100 * m.eur_fx), 2) as inflated_mrr_eur
FROM `aiwomen26ham-4452.invented_software_raw.raw_subscriptions` s
JOIN `aiwomen26ham-4452.invented_software_raw.raw_markets` m
  ON s.currency = m.currency;
-- Expected: row_count = 300, inflated_mrr_eur = 4433.36 (2.61x overcounted!)

-- Correct join: routes through merchant -> exactly 117 rows
SELECT
  COUNT(*) as row_count,
  ROUND(SUM(s.mrr_local / 100 * m.eur_fx), 2) as correct_total_subscription_mrr
FROM `aiwomen26ham-4452.invented_software_raw.raw_subscriptions` s
JOIN `aiwomen26ham-4452.invented_software_raw.raw_merchants` merc
  ON s.merchant_id = merc.merchant_id
JOIN `aiwomen26ham-4452.invented_software_raw.raw_markets` m
  ON merc.country_code = m.country_code;
-- Expected: row_count = 117, correct_mrr = 1697.75

-- 2. TRAP CHECK: Operating Costs vs Balance
SELECT
  -- Unfiltered (includes cash_balance_eom): €54,814/month
  ROUND(SUM(amount_eur) / 100 / 24, 2) as unfiltered_monthly_opex_eur,
  -- Flows only (excluding cash_balance_eom): €3,419/month
  ROUND(SUM(CASE WHEN cost_category != "cash_balance_eom" THEN amount_eur ELSE 0 END) / 100 / 24, 2) as clean_monthly_opex_eur,
  -- Cash balance percentage of column:
  ROUND(SUM(CASE WHEN cost_category = "cash_balance_eom" THEN amount_eur ELSE 0 END) / SUM(amount_eur) * 100, 1) as balance_pct_of_column
FROM `aiwomen26ham-4452.invented_software_raw.raw_operating_costs`;

-- 3. TRAP CHECK: Paying Base Logo Churn
SELECT
  COUNT(DISTINCT merchant_id) as total_merchants, -- 160
  COUNT(DISTINCT s.merchant_id) as paying_merchants, -- 95
  COUNT(DISTINCT CASE WHEN m.status = "churned" AND s.merchant_id IS NOT NULL THEN m.merchant_id END) as churned_paying, -- 9
  ROUND(COUNT(DISTINCT CASE WHEN m.status = "churned" AND s.merchant_id IS NOT NULL THEN m.merchant_id END) * 100.0 / COUNT(DISTINCT s.merchant_id), 1) as paying_logo_churn_pct -- 9.5%
FROM `aiwomen26ham-4452.invented_software_raw.raw_merchants` m
LEFT JOIN `aiwomen26ham-4452.invented_software_raw.raw_subscriptions` s
  ON m.merchant_id = s.merchant_id;
