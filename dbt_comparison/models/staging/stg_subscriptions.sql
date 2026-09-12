{{ config(materialized="view") }}

-- TRAP 1 & 2 AVOIDED:
-- 1. Minor units (cents) divided by 100
-- 2. FX joined through merchant -> markets (never on currency!)
select
    s.subscription_id,
    s.merchant_id,
    s.plan_sku,
    s.start_date,
    s.end_date,
    round(s.mrr_local / 100.0, 2) as mrr_local,
    s.currency,
    m.country_code,
    mkt.eur_fx,
    round((s.mrr_local / 100.0) * mkt.eur_fx, 2) as mrr_eur,
    s.cancellation_reason
from {{ source("raw", "raw_subscriptions") }} s
join {{ ref("stg_merchants") }} m
    on s.merchant_id = m.merchant_id
join {{ ref("stg_markets") }} mkt
    on m.country_code = mkt.country_code
