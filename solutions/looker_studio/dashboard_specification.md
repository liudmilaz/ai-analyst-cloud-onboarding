# Looker Studio Executive Dashboard Blueprint

## Overview
This specification details the executive BI configuration for NovaScale Analytics connecting directly to `aiwomen26ham-4452.invented_software_mart`.

## Verified Executive Metrics
- **Exit ARR (Dec 2025)**: €18,117.34 (Dec 2025 MRR of €1,509.78 × 12)
- **Logo Churn Rate**: 9.47% (9 churned / 95 paying base)
- **Net Monthly Burn Rate**: €3,253 / month
- **Cash Runway**: 15.5 to 17.6 months

## Chart Specifications
1. **MRR Waterfall Bar Chart**:
   - Dimension: `month_date` (2024-01-01 to 2025-12-01)
   - Breakdown: New MRR, Expansion MRR, Churn MRR
   - Metric: `total_mrr_eur`
2. **Gross Margin & Opex Trend**:
   - Dimension: `month_date`
   - Metrics: `clean_opex_eur`, `cac_spend_eur`, `revenue_eur`
3. **Cohort Retention Heatmap**:
   - Row Dimension: `cohort_month`
   - Column Dimension: `months_since_signup`
   - Metric: `retained_customer_pct`
