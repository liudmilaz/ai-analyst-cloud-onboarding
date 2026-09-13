/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_GCP_PROJECT_ID: process.env.GCP_PROJECT_ID || "aiwomen26ham-4452",
  }
};

module.exports = nextConfig;
