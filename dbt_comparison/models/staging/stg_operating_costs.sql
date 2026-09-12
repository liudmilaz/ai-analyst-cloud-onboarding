{{ config(materialized="view") }}

-- TRAP 3 AVOIDED:
-- Distinguish cash_balance_eom from cost flows!
select
    cost_id,
    year_month,
    trim(cost_category) as cost_category,
    round(amount_eur / 100.0, 2) as amount_eur,
    case
        when trim(cost_category) = 'cash_balance_eom' then false
        else true
    end as is_cost_flow
from {{ source("raw", "raw_operating_costs") }}
