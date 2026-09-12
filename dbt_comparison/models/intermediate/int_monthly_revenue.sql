{{ config(materialized="table") }}

with months_spine as (
    select month_date
    from unnest(generate_date_array('2022-06-01', '2025-12-01', interval 1 month)) as month_date
)

select
    m.month_date,
    s.subscription_id,
    s.merchant_id,
    s.plan_sku,
    s.mrr_eur
from months_spine m
join {{ ref("stg_subscriptions") }} s
    on m.month_date >= date_trunc(s.start_date, month)
    and (s.end_date is null or m.month_date <= date_trunc(s.end_date, month))
