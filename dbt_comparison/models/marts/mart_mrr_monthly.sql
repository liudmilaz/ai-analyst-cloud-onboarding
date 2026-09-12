{{ config(materialized="table") }}

select
    month_date,
    count(distinct merchant_id) as active_subscribers_count,
    round(sum(mrr_eur), 2) as total_mrr_eur,
    round(sum(mrr_eur) * 12, 2) as arr_eur
from {{ ref("int_monthly_revenue") }}
group by month_date
order by month_date
