import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Analyst Onboarding | Google Cloud & Dataform Edition",
  description: "End-to-end training and upskilling ground for data analysts using BigQuery, Dataform, Looker Studio, and Gemini AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
