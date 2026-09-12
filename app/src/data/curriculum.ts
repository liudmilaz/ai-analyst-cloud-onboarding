import { Phase } from "../lib/types";

export const CURRICULUM_PHASES: Phase[] = [
  {
    id: 1,
    slug: "data-discovery",
    title: "Phase 1: Data Discovery & Trap Identification",
    subtitle: "Explore raw BigQuery datasets, audit data relationships, formulate hypotheses, and identify analytical traps before modeling.",
    estimatedHours: "2-3 hours",
    deliverable: "Business Requirements Document (BRD) & Data Anomalies Audit",
    investigativeQuestions: [
      "In raw_subscriptions, inspect the scale of mrr_local. How are financial currency amounts stored in operational databases, and what unit conversion is required?",
      "In raw_markets, how many countries share the EUR currency? If you join subscriptions directly on currency, does every subscription match exactly once, or does a Cartesian fan-out occur?",
      "Inspect the distinct cost_category values in raw_operating_costs. Do all rows represent recurring operational expense outflows, or is there a point-in-time balance sheet asset included?",
      "Compare the total number of signups in raw_merchants with merchants who actually purchased a subscription. Who legitimately belongs in the denominator when calculating logo churn?"
    ],
    objectives: [
      "Query raw tables in BigQuery: `aiwomen26ham-4452.invented_software_raw`",
      "Investigate row counts and foreign key relationships across merchants, subscriptions, and markets",
      "Formulate and test queries in BigQuery to uncover silent data anomalies",
      "Define standard business logic for revenue, retention, and operating expenses in your BRD"
    ],
    tasks: [
      {
        id: "p1-t1",
        title: "Audit Merchant Accounts & Subscription Lifecycles",
        instruction: "Examine the relationship between raw_merchants and raw_subscriptions in BigQuery. Compare total merchant records with the subset that have at least one paid subscription.",
        socraticQuestion: "If a business signs up for a free trial or account but never subscribes to a paid plan, should they be counted as a churned customer when their account becomes inactive? What is the business impact on retention metrics?",
        investigativeHint: "Count distinct merchant_id in raw_merchants vs raw_subscriptions. Filter by merchant status.",
        bigQueryTables: ["raw_merchants", "raw_subscriptions"]
      },
      {
        id: "p1-t2",
        title: "Investigate Foreign Exchange & International Markets Join",
        instruction: "Inspect raw_markets and determine the appropriate join path to convert subscription revenue into EUR. Test what happens if you join on currency versus routing the relationship through the merchant.",
        socraticQuestion: "How many countries in raw_markets use EUR? If a subscription in Germany is billed in EUR, what happens if the query joins raw_subscriptions to raw_markets ON s.currency = m.currency? Does the record multiply?",
        investigativeHint: "Compare the row count of raw_subscriptions before and after joining to raw_markets. Look at the country_code field.",
        bigQueryTables: ["raw_subscriptions", "raw_markets", "raw_merchants"]
      },
      {
        id: "p1-t3",
        title: "Audit Operating Expense Categories & Monthly Flows",
        instruction: "Query raw_operating_costs in BigQuery. Group by cost_category and compute the monthly average spend across each category.",
        socraticQuestion: "Look at the magnitude of each category in raw_operating_costs. Does one category account for the vast majority of the sum? In corporate accounting, what is the difference between a flow of expense and a stock of cash balance?",
        investigativeHint: "Run `SELECT cost_category, SUM(amount_eur), AVG(amount_eur) FROM raw_operating_costs GROUP BY cost_category`. Inspect `cash_balance_eom`.",
        bigQueryTables: ["raw_operating_costs"]
      }
    ],
    checkpoint: [
      {
        id: "c1",
        question: "When converting local subscription revenue to EUR, why must the join to raw_markets route through raw_merchants.country_code rather than directly on currency?",
        suggestedQuery: `-- Test join on currency vs merchant country in BigQuery Studio:
SELECT
  COUNT(*) AS joined_rows,
  COUNT(DISTINCT s.subscription_id) AS original_subscriptions,
  ROUND(SUM(s.mrr_local / 100 * m.eur_fx), 2) AS calculated_revenue_eur
FROM \`aiwomen26ham-4452.invented_software_raw.raw_subscriptions\` s
JOIN \`aiwomen26ham-4452.invented_software_raw.raw_markets\` m
  ON s.currency = m.currency;`,
        options: [
          "BigQuery does not permit joins on string columns like currency",
          "Multiple countries in raw_markets share the EUR currency (DE, FR, IT, ES), causing a Cartesian join fan-out across all 4 countries",
          "The exchange rates fluctuate daily in raw_subscriptions",
          "There is duplicate data in the raw_merchants table"
        ],
        correctIndex: 1,
        explanation: "Because DE, FR, IT, and ES all use EUR, joining directly on currency duplicates each EUR subscription across 4 rows (from 117 to 300 rows). The correct foreign key path is subscriptions -> merchants -> markets."
      },
      {
        id: "c2",
        question: "In raw_operating_costs, why must rows with cost_category = 'cash_balance_eom' be excluded when computing monthly operating burn?",
        suggestedQuery: `-- Inspect distribution of cost categories in BigQuery Studio:
SELECT
  cost_category,
  COUNT(*) AS months_present,
  ROUND(SUM(amount_eur) / 100, 2) AS total_sum_eur,
  ROUND(AVG(amount_eur) / 100, 2) AS monthly_avg_eur
FROM \`aiwomen26ham-4452.invented_software_raw.raw_operating_costs\`
GROUP BY cost_category
ORDER BY total_sum_eur DESC;`,
        options: [
          "The records are corrupted and contain negative numbers",
          "Cash balance at end-of-month is a point-in-time asset stock on the balance sheet, not a monthly expense flow on the P&L",
          "The category was already included in raw_acquisition_costs",
          "BigQuery cannot sum rows with string categories"
        ],
        correctIndex: 1,
        explanation: "Cash balance is an asset snapshot (stock), not an expense outflow (flow). Including it distorts monthly operating costs by over 16x (€54,814 vs true opex of €3,419)."
      },
      {
        id: "c3",
        question: "When auditing customer retention, why should the 65 non-subscribing merchants be excluded from the logo churn denominator?",
        suggestedQuery: `-- Compare signups vs paying customers in BigQuery Studio:
SELECT
  COUNT(DISTINCT m.merchant_id) AS total_signups,
  COUNT(DISTINCT s.merchant_id) AS paying_customers,
  COUNT(DISTINCT CASE WHEN s.merchant_id IS NULL THEN m.merchant_id END) AS never_paid_signups,
  COUNT(DISTINCT CASE WHEN m.status = 'churned' AND s.merchant_id IS NOT NULL THEN m.merchant_id END) AS churned_paying
FROM \`aiwomen26ham-4452.invented_software_raw.raw_merchants\` m
LEFT JOIN \`aiwomen26ham-4452.invented_software_raw.raw_subscriptions\` s
  ON m.merchant_id = s.merchant_id;`,
        options: [
          "To artificially make the churn rate look lower",
          "Because a customer who never subscribed or paid cannot churn from a paid SaaS product; including them conflates marketing acquisition drop-off with product retention",
          "Because BigQuery cannot divide by numbers greater than 100",
          "Because non-paying merchants registered before 2024"
        ],
        correctIndex: 1,
        explanation: "True customer retention measures the health of paying customers. Dividing churned merchants (9) by all 160 signups yields 5.6%, whereas true product churn among paying customers is 9 / 95 = 9.5%."
      }
    ]
  },
  {
    id: 2,
    slug: "cloud-architecture",
    title: "Phase 2: Cloud Architecture & Technology Selection",
    subtitle: "Evaluate BigQuery, Dataform, Cloud Run, and Looker Studio against legacy containerized dbt and Metabase stacks.",
    estimatedHours: "2 hours",
    deliverable: "Architecture Decision Record (ADR) & Google Cloud System Architecture",
    investigativeQuestions: [
      "What are the operational tradeoffs between self-hosted dbt Core inside Docker containers versus Google Cloud Dataform running in BigQuery?",
      "How does hosting an analytics portal on Google Cloud Run compare with maintaining persistent virtual machines in terms of cost, scaling, and operational maintenance?",
      "How does Looker Studio integrate natively with BigQuery security, caching, and authorized views?"
    ],
    objectives: [
      "Compare PostgreSQL + dbt Core + Metabase against BigQuery + Dataform + Looker Studio",
      "Document architectural advantages of native BigQuery execution graphs and serverless scaling",
      "Establish the Google Cloud Lakehouse architecture for project `aiwomen26ham-4452`"
    ],
    tasks: [
      {
        id: "p2-t1",
        title: "Draft the Architecture Decision Record (ADR)",
        instruction: "Document the tradeoffs across data ingestion, transformation engines (Dataform vs dbt), compute models, and presentation tools in the Google Cloud ecosystem.",
        socraticQuestion: "Why is an in-database transformation tool like Dataform advantageous over an external pipeline that extracts data to a runner, transforms it, and loads it back?",
        investigativeHint: "Consider data egress costs, IAM permission inheritance, and execution performance for large datasets.",
        bigQueryTables: []
      }
    ],
    checkpoint: [
      {
        id: "c4",
        question: "What is the primary operational advantage of Google Cloud Dataform over self-hosted dbt Core in Docker containers?",
        suggestedQuery: `-- Check BigQuery dataset location and IAM configuration:
SELECT schema_name, location
FROM \`aiwomen26ham-4452.INFORMATION_SCHEMA.SCHEMATA\`
WHERE schema_name LIKE 'invented_software_%';`,
        options: [
          "Dataform requires writing complex Python code instead of SQL",
          "Dataform is fully serverless, integrated into BigQuery IAM, and compiles SQLX into native BigQuery execution graphs without maintaining container infrastructure or local python environments",
          "Dataform only works with MySQL",
          "Dataform does not support lineage dependency graphs"
        ],
        correctIndex: 1,
        explanation: "Dataform compiles SQLX to native BigQuery execution graphs with zero infrastructure maintenance, built-in version control, and native GCP IAM."
      }
    ]
  },
  {
    id: 3,
    slug: "bigquery-ingestion",
    title: "Phase 3: BigQuery Lakehouse & Schema Design",
    subtitle: "Establish lakehouse schemas, partitioning strategies, and verify table ingestion in aiwomen26ham-4452.",
    estimatedHours: "2-3 hours",
    deliverable: "BigQuery Raw Lakehouse Dataset with Row Count & Schema Verifications",
    investigativeQuestions: [
      "Why are monetary columns (mrr_local, amount_eur, cogs_eur) defined as INT64 in raw lakehouse tables rather than FLOAT64?",
      "How does partitioning historical tables by year_month or date optimize query cost and performance in BigQuery?",
      "How do column descriptions in BigQuery schema DDL improve self-service data discovery for downstream analysts?"
    ],
    objectives: [
      "Verify dataset `aiwomen26ham-4452.invented_software_raw` in EU region",
      "Inspect DDL definitions and column descriptions in `bigquery/ddl_raw_tables.sql`",
      "Query all 6 tables directly in Google Cloud BigQuery Studio",
      "Validate that all raw records are queryable without loss or truncation"
    ],
    tasks: [
      {
        id: "p3-t1",
        title: "Inspect BigQuery Tables in Google Cloud Console",
        instruction: "Open BigQuery Studio in the Google Cloud Console for project aiwomen26ham-4452. Query each table to verify row counts and column data types.",
        socraticQuestion: "What is the risk of using floating-point types (FLOAT64) for monetary amounts in an accounting system? Why is integer storage in minor units preferred?",
        investigativeHint: "Notice binary floating-point representation (e.g. 0.1 + 0.2 != 0.3) can cause rounding drift over thousands of financial records.",
        bigQueryTables: ["raw_merchants", "raw_subscriptions", "raw_products", "raw_markets", "raw_acquisition_costs", "raw_operating_costs"]
      }
    ],
    checkpoint: [
      {
        id: "c5",
        question: "How should currency fields (e.g. mrr_local, amount_eur) be initially stored in raw BigQuery lakehouse tables?",
        suggestedQuery: `-- Inspect column types in raw lakehouse schema:
SELECT table_name, column_name, data_type
FROM \`aiwomen26ham-4452.invented_software_raw.INFORMATION_SCHEMA.COLUMNS\`
WHERE column_name IN ('mrr_local', 'amount_eur', 'spend_amount');`,
        options: [
          "Converted to FLOAT64 immediately with automatic rounding",
          "Stored as INT64 in minor units (cents) to preserve arithmetic precision without IEEE float rounding artifacts",
          "Stored as STRING with currency symbols",
          "Truncated to integers"
        ],
        correctIndex: 1,
        explanation: "Storing currency as INT64 in minor units guarantees exact financial arithmetic without binary floating-point inaccuracy, converted explicitly in staging views."
      }
    ]
  },
  {
    id: 4,
    slug: "dataform-modeling",
    title: "Phase 4: Transformation Modeling with Dataform (SQLX)",
    subtitle: "Build production staging views, date-spine explosions, business marts, and data quality assertions.",
    estimatedHours: "4-5 hours",
    deliverable: "Production Dataform Repository with Passing Assertions & Lineage Graph",
    investigativeQuestions: [
      "How does Dataform use the `${ref(\"model_name\")}` syntax to automatically infer dependency DAGs without manual orchestration?",
      "How do we construct an uninterrupted calendar spine in BigQuery using GENERATE_DATE_ARRAY to explode subscription lifecycles month by month?",
      "How do Dataform assertions work? What row count condition indicates a passing test vs a failing test?",
      "How does Dataform staging layer isolate business logic so changes in raw data structures do not break downstream mart models?"
    ],
    objectives: [
      "Develop staging views: `stg_merchants`, `stg_subscriptions`, `stg_products`, `stg_markets`, `stg_acquisition_costs`, `stg_operating_costs`",
      "Develop intermediate models: `int_monthly_revenue` (date-spine explosion) and `int_merchant_lifecycle`",
      "Develop mart models: `mart_mrr_monthly`, `mart_unit_economics`, `mart_pnl_summary`, `mart_executive_kpis`",
      "Implement automated Dataform assertions to test for negative revenue, broken foreign keys, and balance pollution",
      "Inspect the corrected production Dataform reference project"
    ],
    tasks: [
      {
        id: "p4-t1",
        title: "Build the Staging Layer Views",
        instruction: "Create staging SQLX views that clean strings, divide minor units by 100.0, apply EUR exchange rates through merchant country codes, and classify cost categories into flows vs balances.",
        socraticQuestion: "In Dataform, what is the difference between setting `type: \"view\"` versus `type: \"table\"` in the config block? Which is more appropriate for lightweight staging transformations?",
        investigativeHint: "Views execute the underlying query dynamically upon access, saving BigQuery storage costs for staging layers.",
        bigQueryTables: ["raw_subscriptions", "raw_merchants", "raw_markets", "raw_operating_costs"]
      },
      {
        id: "p4-t2",
        title: "Build the Intermediate Date Spine & Explode Monthly Revenue",
        instruction: "Use `GENERATE_DATE_ARRAY` to generate continuous monthly dates. Join active subscriptions where the month falls between subscription start and end dates.",
        socraticQuestion: "If a subscription starts on 2024-03-15 and has no end date, how should your query ensure it is represented in every subsequent month through December 2025?",
        investigativeHint: "Join the date spine with conditions: `month_date >= DATE_TRUNC(start_date, MONTH) AND (end_date IS NULL OR month_date <= DATE_TRUNC(end_date, MONTH))`.",
        bigQueryTables: []
      },
      {
        id: "p4-t3",
        title: "Create Dataform Quality Assertions",
        instruction: "Develop assertions for clean operating costs, positive MRR, and referential integrity.",
        socraticQuestion: "In Dataform, how does the system know whether an assertion passed or failed? What should a quality query return when the data is 100% clean?",
        investigativeHint: "In Dataform and dbt, a test passes if 0 rows are returned. If 1 or more rows are returned, those rows represent violating records, failing the assertion.",
        bigQueryTables: []
      }
    ],
    checkpoint: [
      {
        id: "c6",
        question: "When writing a Dataform assertion SQLX model (type: 'assertion'), what query result triggers a test failure?",
        suggestedQuery: `-- Check assertion logic: returns rows only when a violation occurs
SELECT
  cost_id, year_month, cost_category, amount_eur
FROM \`aiwomen26ham-4452.invented_software_raw.raw_operating_costs\`
WHERE cost_category = 'cash_balance_eom';`,
        options: [
          "The query returns a single row with the value 'FALSE'",
          "The query returns 1 or more rows (any rows returned represent data violating the constraint)",
          "The query returns 0 rows",
          "The query times out"
        ],
        correctIndex: 1,
        explanation: "Dataform assertions follow the zero-row rule: if the query returns any rows, those rows represent failing records, and the assertion fails."
      }
    ]
  },
  {
    id: 5,
    slug: "looker-studio-bi",
    title: "Phase 5: Executive BI Dashboard with Looker Studio",
    subtitle: "Connect Looker Studio to BigQuery mart tables and construct executive scorecards, waterfalls, and cohorts.",
    estimatedHours: "3-4 hours",
    deliverable: "Interactive Executive Dashboard with 12 Canonical KPIs",
    investigativeQuestions: [
      "How do you design executive scorecards that distinguish between top-of-funnel lead velocity and customer retention?",
      "Why must cash runway calculations compare point-in-time cash balances against true net monthly burn (revenue minus clean opex and CAC)?",
      "How do you configure Looker Studio date range parameters to seamlessly filter BigQuery partitioned tables?"
    ],
    objectives: [
      "Connect Looker Studio to BigQuery mart tables (`mart_mrr_monthly`, `mart_pnl_summary`, `mart_unit_economics`)",
      "Build MRR Progression chart across 2024-2025",
      "Build Executive Scorecards for Exit ARR, Blended Margin, Logo Churn, and Cash Runway",
      "Verify that executive visualizations reflect clean business logic rather than distorted raw figures"
    ],
    tasks: [
      {
        id: "p5-t1",
        title: "Design the Looker Studio Dashboard Architecture",
        instruction: "Connect Looker Studio to `aiwomen26ham-4452.invented_software_mart.mart_mrr_monthly` and `mart_pnl_summary`. Create executive scorecards and trend visualizations.",
        socraticQuestion: "If an executive asks for 'Cash Runway', what two metrics must you compare? If an analyst inadvertently used unfiltered operating costs, how would the runway calculation mislead the board?",
        investigativeHint: "Runway = Latest Cash Balance / Monthly Net Burn. Compare the result using clean opex vs unfiltered opex.",
        bigQueryTables: []
      }
    ],
    checkpoint: [
      {
        id: "c7",
        question: "When presenting cash runway to executive leadership, what is the formula for implied runway in months?",
        suggestedQuery: `-- Calculate latest cash balance and average monthly net burn in BigQuery:
WITH latest_cash AS (
  SELECT ROUND(amount_eur / 100, 2) AS cash_balance
  FROM \`aiwomen26ham-4452.invented_software_raw.raw_operating_costs\`
  WHERE cost_category = 'cash_balance_eom' AND year_month = '2025-12-01'
)
SELECT cash_balance FROM latest_cash;`,
        options: [
          "Total Revenue divided by CAC",
          "Latest Cash Balance divided by Monthly Net Burn (Clean Opex + CAC - Monthly Revenue)",
          "Exit ARR multiplied by 12",
          "Total Signups divided by Churned Merchants"
        ],
        correctIndex: 1,
        explanation: "Cash runway measures how many months a business can survive at current cash consumption: Latest Cash Balance / Monthly Net Burn (€57,235 / €3,253 = ~17.6 months)."
      }
    ]
  },
  {
    id: 6,
    slug: "executive-presentation",
    title: "Phase 6: Executive Defense & Production Automation",
    subtitle: "Defend analytical methodology to leadership and automate data refreshes with Cloud Build and Cloud Run.",
    estimatedHours: "2-3 hours",
    deliverable: "Executive Presentation Briefing & Automated CI/CD Pipeline",
    investigativeQuestions: [
      "How do you defend excluding non-paying merchant signups from the logo churn denominator when questioned by the CFO?",
      "How do you justify your currency conversion methodology when cross-border exchange rates vary?",
      "How do automated CI/CD pipelines prevent faulty models from reaching production in BigQuery?"
    ],
    objectives: [
      "Prepare executive defense explaining your resolution of the 3 data traps",
      "Defend business metric definitions against tough simulated questions from the AI Mentor",
      "Deploy the automated application and pipeline to Google Cloud Run and BigQuery"
    ],
    tasks: [
      {
        id: "p6-t1",
        title: "Executive Defense Simulation",
        instruction: "Use the AI Mentor in 'Presentation Defense' mode. Defend why your logo churn rate reflects paying customers, why opex excludes cash balances, and how your Dataform models protect data integrity.",
        socraticQuestion: "If a board member asks: 'Why is our logo churn 9.5% when our customer success dashboard says 5.6%?', how do you explain the difference in customer base definition?",
        investigativeHint: "Explain the critical difference between product churn (paying customers leaving) and lead drop-off (free signups never activating).",
        bigQueryTables: []
      }
    ],
    checkpoint: [
      {
        id: "c8",
        question: "When defending your logo churn calculation to the executive team, why do you exclude the 65 non-subscribing merchants from the denominator?",
        suggestedQuery: `-- Compare paying vs non-paying merchants in BigQuery Studio:
SELECT
  COUNT(DISTINCT merchant_id) AS total_accounts,
  COUNT(DISTINCT CASE WHEN status = 'churned' THEN merchant_id END) AS total_churned
FROM \`aiwomen26ham-4452.invented_software_raw.raw_merchants\`;`,
        options: [
          "To make the churn number look artificially lower",
          "Because a customer who never subscribed or paid cannot churn from a paid SaaS product; including them conflates lead conversion failure with customer retention",
          "Because BigQuery cannot divide by numbers greater than 100",
          "Because the non-paying merchants churned before 2024"
        ],
        correctIndex: 1,
        explanation: "True customer retention measures the health of paying customers. Merging top-of-funnel non-converting leads with churned customers obfuscates true product retention."
      }
    ]
  }
];
