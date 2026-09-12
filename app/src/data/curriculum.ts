import { Phase } from "../lib/types";

export const CURRICULUM_PHASES: Phase[] = [
  {
    id: 1,
    slug: "data-discovery",
    title: "Phase 1: Data Discovery & Trap Identification",
    subtitle: "Explore the raw datasets in BigQuery, uncover the 3 deliberate traps, and define the SaaS KPI spine.",
    estimatedHours: "2-3 hours",
    deliverable: "Business Requirements Document (BRD) & Data Traps Audit",
    trapsHighlighted: [
      "Minor units: All money is in cents. Forgetting /100 creates a 100x error.",
      "Currency join fan-out: Joining subscriptions on currency balloons rows from 117 to 300.",
      "Stock among flows: Operating costs table includes cash_balance_eom (16x error)."
    ],
    objectives: [
      "Query raw tables in BigQuery dataset: `aiwomen26ham-4452.invented_software_raw`",
      "Inspect row counts: 160 merchants (65 never subscribed), 117 subscriptions, 8 markets",
      "Verify the 3 deliberate traps with interactive SQL queries",
      "Select 3 to 5 canonical KPIs from the 12 SaaS metrics to specify in your BRD"
    ],
    tasks: [
      {
        id: "p1-t1",
        title: "Audit the Raw Merchant & Subscription Tables",
        instruction: "Inspect merchant counts versus subscription counts. Notice that 65 merchants signed up but never held a paid subscription. Understand why counting all 160 merchants in the churn denominator is flawed.",
        verificationTip: "Paying merchants = 95. Churned among paying = 9. Logo churn = 9 / 95 = 9.5%."
      },
      {
        id: "p1-t2",
        title: "Test the Currency Fan-Out Trap",
        instruction: "Write a query joining raw_subscriptions to raw_markets on `currency`. Notice row count jumps to 300! Next, route the join through `raw_merchants.country_code` -> exactly 117 rows.",
        keyTrapAlert: "Joining on currency causes multiple European markets (DE, FR, IT, ES) to match each EUR subscription, inflating MRR by 2.61x!"
      },
      {
        id: "p1-t3",
        title: "Isolate Cash Balance in Operating Costs",
        instruction: "Calculate the average monthly operating costs. If you do not filter out `cash_balance_eom`, your monthly burn is €54,814. If you filter it, actual opex is €3,419/month.",
        keyTrapAlert: "93.8% of the column sum is a point-in-time bank balance, not a cost flow!"
      }
    ],
    checkpoint: [
      {
        id: "c1",
        question: "Why does joining raw_subscriptions to raw_markets on currency result in 300 rows instead of 117?",
        options: [
          "There is duplicate data in raw_subscriptions",
          "Multiple countries in raw_markets share the EUR currency (DE, FR, IT, ES), causing a Cartesian join fan-out",
          "BigQuery does not support inner joins on string columns",
          "The exchange rates fluctuate daily in the dataset"
        ],
        correctIndex: 1,
        explanation: "Because DE, FR, IT, and ES all use EUR, each EUR subscription record matches 4 market rows. The correct foreign key path is subscriptions -> merchants -> markets."
      },
      {
        id: "c2",
        question: "What is the true monthly operating cost of Invented Software when excluding the cash_balance_eom stock balance?",
        options: [
          "€54,814 / month",
          "€113,785 / month",
          "€3,419 / month",
          "€12,500 / month"
        ],
        correctIndex: 2,
        explanation: "Excluding cash_balance_eom leaves the 5 true operational expense categories, averaging €3,419 per month across 2024-2025."
      }
    ]
  },
  {
    id: 2,
    slug: "cloud-architecture",
    title: "Phase 2: Cloud Architecture & Technology Selection",
    subtitle: "Evaluate BigQuery, Dataform, Cloud Run, and Looker Studio against the original Docker/PostgreSQL stack.",
    estimatedHours: "2 hours",
    deliverable: "Architecture Decision Record (ADR) & GCP System Diagram",
    trapsHighlighted: [
      "Over-engineering local container networks vs serverless cloud infrastructure",
      "Choosing tools without native BigQuery integration (introducing ingress/egress latency)"
    ],
    objectives: [
      "Compare PostgreSQL + dbt Core + Metabase against BigQuery + Dataform + Looker Studio",
      "Document why Dataform SQLX was chosen for native BigQuery compilation and zero-maintenance execution",
      "Design zero-server pipeline using Cloud Run, Cloud Build, and BigQuery"
    ],
    tasks: [
      {
        id: "p2-t1",
        title: "Draft the Architecture Decision Record (ADR)",
        instruction: "Document the tradeoffs: BigQuery provides petabyte scalability with zero index management; Dataform runs in-database with native lineage graphs; Cloud Run hosts the Next.js training portal with auto-scaling to zero.",
        verificationTip: "Review the ADR against enterprise security, scalability, and operational overhead criteria."
      }
    ],
    checkpoint: [
      {
        id: "c3",
        question: "What is the primary operational advantage of Google Cloud Dataform over self-hosted dbt Core in Docker?",
        options: [
          "Dataform requires writing Python code instead of SQL",
          "Dataform is fully serverless, integrated into BigQuery IAM, and executes without maintaining container infrastructure or local Python environments",
          "Dataform only works with MySQL",
          "Dataform doesn\x27t support lineage graphs"
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
    subtitle: "Establish schemas, partition strategies, and ingest all 6 raw CSV tables into project aiwomen26ham-4452.",
    estimatedHours: "2-3 hours",
    deliverable: "BigQuery Raw Dataset with Ingestion Scripts and Row Count Validations",
    trapsHighlighted: [
      "Date parsing errors on YYYY-MM-DD strings",
      "Treating minor integer cents as decimal floats during schema inference"
    ],
    objectives: [
      "Create dataset aiwomen26ham-4452.invented_software_raw in EU region",
      "Define DDL schemas for all 6 tables with field descriptions",
      "Execute bigquery/load_raw_data.py or gcp/load_bigquery_tables.sh",
      "Validate row counts: merchants (160), subscriptions (117), markets (8), products (5), cac (768), opex (144)"
    ],
    tasks: [
      {
        id: "p3-t1",
        title: "Deploy BigQuery Tables and Ingest Data",
        instruction: "Execute the DDL in bigquery/ddl_raw_tables.sql and run bigquery/load_raw_data.py or bq load scripts.",
        verificationTip: "Verify that SELECT count(*) FROM invented_software_raw.raw_subscriptions returns exactly 117."
      }
    ],
    checkpoint: [
      {
        id: "c4",
        question: "How should money fields (e.g. mrr_local, amount_eur) be initially loaded into raw BigQuery tables?",
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
    subtitle: "Develop staging views, intermediate month explosions, mart tables, and automated data quality assertions.",
    estimatedHours: "4-5 hours",
    deliverable: "Production Dataform Repository with Passing Assertions",
    trapsHighlighted: [
      "Correct join path for FX (subscriptions -> merchants -> markets)",
      "Flagging cash_balance_eom as stock balance in staging layer",
      "Exploding subscription lifecycles across calendar months without missing months"
    ],
    objectives: [
      "Build staging layer views: stg_merchants, stg_subscriptions, stg_products, stg_markets, stg_acquisition_costs, stg_operating_costs",
      "Build intermediate models: int_monthly_revenue and int_merchant_lifecycle",
      "Build mart models: mart_mrr_monthly, mart_unit_economics, mart_pnl_summary, mart_executive_kpis",
      "Implement Dataform assertions to test for negative MRR, duplicate subscriptions, and opex balance pollution",
      "Compare every model with the equivalent dbt syntax in the dbt Track tab"
    ],
    tasks: [
      {
        id: "p4-t1",
        title: "Build the Staging Models",
        instruction: "Develop stg_subscriptions.sqlx with cents / 100 and correct FX join path. Develop stg_operating_costs.sqlx with is_cost_flow flag.",
        dataformSnippet: "ROUND((s.mrr_local / 100.0) * mkt.eur_fx, 2) AS mrr_eur",
        dbtSnippet: "round((s.mrr_local / 100.0) * mkt.eur_fx, 2) as mrr_eur"
      },
      {
        id: "p4-t2",
        title: "Build Intermediate Date Spine and Marts",
        instruction: "Explode active subscriptions into month rows using GENERATE_DATE_ARRAY. Aggregate into mart_mrr_monthly.",
        verificationTip: "December 2025 MRR must be €1,509.78. Exit ARR must be €18,117.34."
      },
      {
        id: "p4-t3",
        title: "Run Dataform Assertions",
        instruction: "Compile and execute assert_clean_operating_costs and assert_mrr_positive. Verify 0 assertion failures.",
        verificationTip: "An assertion fails in Dataform if any rows are returned by the query."
      }
    ],
    checkpoint: [
      {
        id: "c5",
        question: "What is the expected Exit ARR (Dec 2025 MRR * 12) produced by mart_mrr_monthly?",
        options: [
          "€1,509.78",
          "€18,117.34",
          "€54,813.80",
          "€4,433.36"
        ],
        correctIndex: 1,
        explanation: "December 2025 MRR is €1,509.78. Multiplied by 12, the Exit ARR is exactly €18,117.34."
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
    trapsHighlighted: [
      "Showing non-paying signups in churn visualizations",
      "Mixing cash balance and monthly burn on the same chart axis"
    ],
    objectives: [
      "Connect Looker Studio to BigQuery mart tables (mart_mrr_monthly, mart_pnl_summary, mart_unit_economics)",
      "Build MRR Waterfall & Trend chart (Jan 2024 to Dec 2025)",
      "Create Executive Scorecard with Exit ARR (€18.1k), Blended Margin (84.9%), Logo Churn (9.5%), Cash Runway (~17.6 mos)",
      "Embed interactive dashboard component in the training portal"
    ],
    tasks: [
      {
        id: "p5-t1",
        title: "Design the Looker Studio Dashboard Layout",
        instruction: "Organize into 4 views: Executive Summary, MRR & Growth, Unit Economics & CAC, and Cash & P&L Burn.",
        verificationTip: "Ensure the Cash Runway gauge reflects the €57,235 balance divided by €3,253 net burn = ~17.6 months."
      }
    ],
    checkpoint: [
      {
        id: "c6",
        question: "What is the implied cash runway for Invented Software as of December 2025?",
        options: [
          "1.0 month (using unfiltered opex of €54k)",
          "~17.6 months (using verified net burn of €3,253 and cash balance of €57,235)",
          "Over 10 years",
          "Zero runway (bankrupt)"
        ],
        correctIndex: 1,
        explanation: "With verified monthly net burn of €3,253 (clean opex €3,419 + CAC €1,352 - revenue €1,517) and cash balance of €57,235, runway is ~17.6 months."
      }
    ]
  },
  {
    id: 6,
    slug: "executive-presentation",
    title: "Phase 6: Executive Defense & Production Automation",
    subtitle: "Defend your analytical decisions to leadership and automate data refreshes with Cloud Build and Cloud Run.",
    estimatedHours: "2-3 hours",
    deliverable: "Executive Briefing Deck & Automated CI/CD Pipeline",
    trapsHighlighted: [
      "Failing to document deliberate KPI ambiguities (e.g. CAC denominator: signups vs paying)",
      "Unmonitored scheduled pipelines without data assertions"
    ],
    objectives: [
      "Draft executive summary defending CAC definition, gross margin calculation, and runway estimate",
      "Deploy automated deployment pipeline using gcp/cloudbuild.yaml",
      "Deploy Next.js application to Google Cloud Run in aiwomen26ham-4452"
    ],
    tasks: [
      {
        id: "p6-t1",
        title: "Executive Presentation Defense",
        instruction: "Use the AI Mentor in Presentation Defense mode. The mentor will ask tough questions simulating the CEO/CFO.",
        verificationTip: "Defend why logo churn is 9.5% (9/95) rather than 5.6% (9/160), and why opex excludes cash_balance_eom."
      },
      {
        id: "p6-t2",
        title: "Deploy to Cloud Run",
        instruction: "Run gcp/deploy_cloud_run.sh to build and deploy the application container to Cloud Run.",
        verificationTip: "Verify Cloud Run HTTPS URL returns 200 OK."
      }
    ],
    checkpoint: [
      {
        id: "c7",
        question: "When defending your logo churn calculation to the executive team, why do you exclude the 65 non-subscribing merchants from the denominator?",
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
