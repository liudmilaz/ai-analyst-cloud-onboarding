// Declare the 6 raw BigQuery Lakehouse tables ingested in GCP project aiwomen26ham-4452
const rawTables = [
  "raw_merchants",
  "raw_subscriptions",
  "raw_products",
  "raw_markets",
  "raw_acquisition_costs",
  "raw_operating_costs"
];

rawTables.forEach((table) => {
  declare({
    database: "aiwomen26ham-4452",
    schema: "invented_software_raw",
    name: table,
    description: `Raw lakehouse table for ${table}`
  });
});
