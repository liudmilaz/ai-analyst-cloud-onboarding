-- ====================================================================
-- PHASE 2: Multi-Currency & FX Normalization
-- Task: Join raw_subscriptions to markets without causing row explosion.
-- Target: `aiwomen26ham-4452.invented_software_raw`
-- ====================================================================

-- 1. NAIVE QUERY TRAP:
-- What happens when you join on currency?
-- SELECT COUNT(*) FROM raw_subscriptions s JOIN raw_markets m ON s.currency = m.currency;
-- Notice how 117 rows explode to 300!

-- 2. INVESTIGATION QUESTION:
-- Write the correct entity join path through raw_merchants to keep exactly 117 rows.
-- Write your query below:


