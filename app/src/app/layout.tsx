import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LINIA | Human-Led & AI-Powered Cloud Analytics Onboarding",
  description: "Interactive onboarding and upskilling platform for data specialists using BigQuery, Dataform, Antigravity, Looker Studio, and Gemini AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070B14] text-slate-100 antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
