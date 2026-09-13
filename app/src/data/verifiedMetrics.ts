export const VERIFIED_METRICS = {
  company: "NovaScale Analytics",
  project: "aiwomen26ham-4452",
  dataset: "invented_software_mart",
  counts: {
    totalMerchants: 160,
    payingMerchants: 95,
    nonPayingSignups: 65,
    subscriptionRecords: 117,
    churnedPayingMerchants: 9,
    logoChurnRatePct: 9.5,
  },
  mrrTimeline: [
    { month: "Jan 2024", mrr: 1137.85, activeMerchants: 72, note: "Inclusive end_date, no proration" },
    { month: "Apr 2024", mrr: 1290.40, activeMerchants: 78, note: "Expansion in Western Europe" },
    { month: "Jul 2024", mrr: 1450.15, activeMerchants: 84, note: "New signups onboarding" },
    { month: "Dec 2024", mrr: 1640.77, activeMerchants: 91, note: "Peak 2024 MRR" },
    { month: "Jun 2025", mrr: 1580.20, activeMerchants: 88, note: "Summer seasonal churn" },
    { month: "Dec 2025", mrr: 1509.78, activeMerchants: 86, note: "Exit month (MRR €1,509.78)" }
  ],
  exitArrEur: 18117.34,
  costs: {
    unfilteredMonthlyOpexEur: 54813.80,
    cleanMonthlyOpexEur: 3418.56,
    totalCacSpend24mEur: 32439.19,
    monthlyAverageCacEur: 1351.63,
    netMonthlyBurnEur: 3253.00,
    latestCashBalanceEur: 57234.59,
    impliedRunwayMonths: 17.6,
  },
  trapsSummary: [
    {
      id: "minor_units",
      name: "Trap 1: Minor Units (Cents)",
      description: "All monetary fields in raw tables are stored in cents. Forgetting to divide by 100 causes a 100x inflation.",
      impact: "Revenue shows €113,785 instead of €1,137.85"
    },
    {
      id: "fanout_currency",
      name: "Trap 2: FX Join Fan-out",
      description: "Joining raw_subscriptions to raw_markets on currency directly fans out rows from 117 to 300 because multiple countries share EUR. Correct path: subscriptions -> merchants -> markets.",
      impact: "Row count balloons to 300, MRR inflates 2.61x (€4,433.36 vs €1,697.75)"
    },
    {
      id: "stock_among_flows",
      name: "Trap 3: Stock Among Flows",
      description: "raw_operating_costs contains cost_category = cash_balance_eom, which is a point-in-time balance, not a monthly expense flow. It comprises 93.8% of column value.",
      impact: "Monthly operating cost appears to be €54,814/mo instead of €3,419/mo (16x error)!"
    }
  ]
};
