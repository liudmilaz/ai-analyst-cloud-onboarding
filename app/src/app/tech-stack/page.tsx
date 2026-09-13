"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { PhaseSidebar } from "../../components/PhaseSidebar";
import { MentorChatModal } from "../../components/MentorChatModal";
import { LearningTrack } from "../../lib/types";

export default function TechStackPage() {
  const [currentTrack, setCurrentTrack] = useState<LearningTrack>("dataform");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [completedPhases] = useState<number[]>([1, 2]);

  const tools = [
    {
      id: "antigravity",
      name: "Google Antigravity",
      badge: "Implementation Engine",
      role: "AI-First Development Platform & Agentic Pair Programmer",
      badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/40",
      accentColor: "border-sky-500/30 hover:border-sky-400/60",
      iconBg: "bg-gradient-to-br from-blue-600 to-sky-500 text-white",
      iconText: "AG",
      link: "https://antigravity.google",
      linkLabel: "Launch Antigravity",
      description:
        "The primary authoring environment for the course. While you (the human data specialist) direct the architecture, model logic, and metric definitions, Antigravity accelerates your implementation—scaffolding SQLX files, creating automated assertions, generating boilerplate, and debugging compilation issues.",
      howUsed: [
        "Authoring Dataform SQLX models from scratch with AI pair assistance",
        "Rapidly scaffolding date spine queries and staging transformation views",
        "Refactoring SQL models while preserving strict business definitions",
        "Automating repetitive pipeline configurations and schema descriptions"
      ],
      keyCapabilities: [
        "Context-aware codebase understanding",
        "Multi-file agentic editing and debugging",
        "Built-in terminal and workflow execution",
        "Human-in-the-loop control for critical logic"
      ],
      proTip:
        "Prompt Antigravity with specific business constraints (e.g. 'Generate a daily calendar spine from 2023 to 2024 with zero nulls') rather than generic questions to get optimal code."
    },
    {
      id: "bigquery",
      name: "Google BigQuery",
      badge: "Cloud Lakehouse",
      role: "Serverless Enterprise Data Warehouse & Query Execution Engine",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      accentColor: "border-blue-500/30 hover:border-blue-400/60",
      iconBg: "bg-gradient-to-br from-blue-700 to-indigo-600 text-white",
      iconText: "BQ",
      link: "https://console.cloud.google.com/bigquery?project=aiwomen26ham-4452&ws=!1m5!1m4!4m3!1saiwomen26ham-4452!2sinvented_software_raw!2sraw_subscriptions",
      linkLabel: "Open BigQuery Console",
      description:
        "Google Cloud's fully managed, petabyte-scale analytics engine. BigQuery hosts the raw SaaS lakehouse dataset (raw_subscriptions, raw_customers, raw_events, raw_exchange_rates, raw_refunds) and serves as the destination compute engine where all your transformations execute.",
      howUsed: [
        "Initial exploratory data discovery and schema interrogation",
        "Auditing raw tables for hidden duplicates and foreign key orphans",
        "Querying intermediate staging views and finalized dimensional marts",
        "Analyzing execution plans, bytes billed, and query performance"
      ],
      keyCapabilities: [
        "Serverless SQL engine with instant scaling",
        "Partitioning and clustering for cost optimization",
        "Native semi-structured JSON and ARRAY/STRUCT support",
        "Deep integration with Dataform and Looker Studio"
      ],
      proTip:
        "Always inspect column data types in BigQuery before writing joins. Watch out for amounts stored in minor currency units (cents vs dollars) and timestamp timezones."
    },
    {
      id: "dataform",
      name: "Google Dataform",
      badge: "Transformation Layer",
      role: "In-Warehouse Data Modeling, Orchestration & Testing (SQLX)",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      accentColor: "border-emerald-500/30 hover:border-emerald-400/60",
      iconBg: "bg-gradient-to-br from-emerald-600 to-teal-500 text-white",
      iconText: "DF",
      link: "https://console.cloud.google.com/bigquery/dataform?project=aiwomen26ham-4452",
      linkLabel: "Open Dataform Workspace",
      description:
        "Google Cloud's native data modeling and transformation framework built into BigQuery. In this course, you will build a clean, multi-layered data model (staging views -> intermediate date spines -> production marts) using SQLX and enforce data quality via automated assertions.",
      howUsed: [
        "Writing modular SQLX files combining standard SQL with JS config blocks",
        "Building reliable date spines to track continuous daily active MRR",
        "Configuring automated data quality assertions (row conditions, unique keys)",
        "Managing table dependencies and compilation dependency graphs (DAGs)"
      ],
      keyCapabilities: [
        "Native SQLX declarative syntax with reusable JS includes",
        "Built-in assertion framework that halts bad data before publication",
        "Visual Dependency Graph (DAG) for data lineage tracking",
        "Version control with Git branch and workspace isolation"
      ],
      proTip:
        "Use Dataform assertions to trap silent errors: assert that invoice revenue is never negative, exchange rates are within valid ranges, and subscription IDs are unique."
    },
    {
      id: "lookerstudio",
      name: "Google Looker Studio",
      badge: "BI & Reporting",
      role: "Self-Service Business Intelligence & Executive Dashboard Canvas",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      accentColor: "border-amber-500/30 hover:border-amber-400/60",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-500 text-white",
      iconText: "LS",
      link: "https://lookerstudio.google.com/reporting/create",
      linkLabel: "Open Looker Studio Canvas",
      description:
        "The visual presentation layer where your data modeling and transformation work translates into executive business impact. You connect Looker Studio directly to your curated BigQuery marts to construct executive SaaS scorecards, MRR waterfalls, and cohort retention matrices.",
      howUsed: [
        "Connecting zero-copy to curated BigQuery production marts",
        "Creating executive scorecards for Net MRR, Churn Rate, and ARR",
        "Visualizing cohort retention heatmaps and customer lifetime value",
        "Adding interactive date range controllers and plan tier filters"
      ],
      keyCapabilities: [
        "Direct zero-maintenance connection to Google BigQuery tables",
        "Custom calculated metrics and parameterized fields",
        "Interactive filtering, cross-chart filtering, and drill-downs",
        "Executive-ready styling and presentation sharing controls"
      ],
      proTip:
        "Never calculate complex business logic inside Looker Studio. Pre-compute metrics in your Dataform marts so dashboards load instantaneously and remain 100% reproducible."
    }
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col font-sans">
      <Navbar
        currentTrack={currentTrack}
        onTrackChange={setCurrentTrack}
        onOpenChat={() => setIsChatOpen(true)}
      />

      <div className="flex flex-1">
        <PhaseSidebar completedPhases={completedPhases} />

        <main className="flex-1 p-8 pt-10 max-w-5xl mx-auto space-y-8">
          {/* Header Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-sky-500/20 bg-gradient-to-br from-[#0B1528] via-[#09101E] to-[#070B14] p-8 shadow-2xl shadow-sky-950/40 space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2.5 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-sky-950/80 px-2.5 py-0.5 text-[11px] font-bold text-sky-300 border border-sky-700/50">
                    Course Architecture & Tooling
                  </span>
                  <span className="text-xs text-slate-400">Page 2 of Overview</span>
                </div>

                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  The Four Core Technologies
                </h1>

                <p className="text-sm text-slate-300 leading-relaxed">
                  This onboarding program utilizes an integrated modern cloud analytics stack. Each tool has a clearly delineated role, working in synergy to turn raw data into executive insights while keeping you in full intellectual command.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 flex-shrink-0">
                <Link
                  href="/curriculum"
                  className="rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 px-5 py-2.5 text-center text-xs font-bold text-white shadow-lg shadow-sky-900/40 hover:from-blue-500 hover:to-cyan-400 transition flex items-center justify-center gap-2"
                >
                  <span>Curriculum Roadmap</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/"
                  className="rounded-xl bg-slate-900/90 border border-slate-700 hover:border-sky-500/60 px-5 py-2.5 text-center text-xs font-semibold text-slate-300 hover:text-white transition flex items-center justify-center gap-2"
                >
                  <span>← Back to Course Home</span>
                </Link>
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-sky-900/40">
              {tools.map((tool) => (
                <a
                  key={tool.id}
                  href={`#${tool.id}`}
                  className="rounded-xl bg-slate-900/70 border border-slate-800 p-3 hover:border-sky-500/50 hover:bg-slate-850 transition text-center group"
                >
                  <div className="text-xs font-bold text-slate-200 group-hover:text-sky-300 transition">
                    {tool.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{tool.badge}</div>
                </a>
              ))}
            </div>
          </div>

          {/* End-to-End Pipeline Architecture Flow */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>🔄</span>
                  <span>How the 4 Tools Connect: End-to-End Analytics Pipeline</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  From raw lakehouse ingest to boardroom presentation, with AI pair programming at every step.
                </p>
              </div>
              <span className="hidden sm:inline-flex rounded-full bg-blue-950/70 border border-blue-500/40 px-2.5 py-1 text-[11px] font-semibold text-blue-200">
                Google Cloud Native
              </span>
            </div>

            {/* Architecture Pipeline Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Step 1: BigQuery Raw */}
              <div className="rounded-xl bg-slate-950/80 border border-blue-500/30 p-4 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Step 1 • Raw Ingest</span>
                  <span className="text-xs font-bold text-blue-400">BigQuery</span>
                </div>
                <h3 className="text-xs font-bold text-white">Raw Lakehouse</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Holds raw SaaS subscriptions, events, and currency exchange tables. You explore schemas and identify traps.
                </p>
              </div>

              {/* Step 2: Antigravity + Dataform */}
              <div className="rounded-xl bg-slate-950/80 border border-sky-500/30 p-4 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Step 2 • Data Transformation</span>
                  <span className="text-xs font-bold text-sky-400">Antigravity + DF</span>
                </div>
                <h3 className="text-xs font-bold text-white">Model Implementation</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Write SQLX staging views and date spines using Antigravity AI pair programming. You lead the architecture.
                </p>
              </div>

              {/* Step 3: Assertions in Dataform */}
              <div className="rounded-xl bg-slate-950/80 border border-emerald-500/30 p-4 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Step 3 • Validation</span>
                  <span className="text-xs font-bold text-emerald-400">Dataform</span>
                </div>
                <h3 className="text-xs font-bold text-white">Quality Assertions</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Execute automated tests to trap row multiplication, currency mismatches, and negative revenue anomalies.
                </p>
              </div>

              {/* Step 4: Looker Studio BI */}
              <div className="rounded-xl bg-slate-950/80 border border-amber-500/30 p-4 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Step 4 • Delivery</span>
                  <span className="text-xs font-bold text-amber-400">Looker Studio</span>
                </div>
                <h3 className="text-xs font-bold text-white">Executive Scorecard</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Build C-suite scorecards for Net MRR, Churn Rate, and Cohorts backed by clean, defensible BigQuery marts.
                </p>
              </div>
            </div>
          </div>

          {/* Deep Dives into Each Tool */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>📚</span>
                <span>Detailed Tool Summaries & Resources</span>
              </h2>
              <span className="text-xs text-slate-400">
                Click links to open tools in new tabs
              </span>
            </div>

            {tools.map((tool) => (
              <div
                key={tool.id}
                id={tool.id}
                className={`rounded-2xl border ${tool.accentColor} bg-slate-900/60 p-6 sm:p-7 space-y-5 transition shadow-lg`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl font-extrabold text-sm flex-shrink-0 shadow-md ${tool.iconBg}`}
                    >
                      {tool.iconText}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-xl font-extrabold text-white">{tool.name}</h3>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${tool.badgeColor}`}
                        >
                          {tool.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium mt-0.5">{tool.role}</p>
                    </div>
                  </div>

                  <a
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start sm:self-center rounded-xl bg-slate-900 border border-slate-700 hover:border-sky-500 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{tool.linkLabel}</span>
                    <span className="text-sky-400 text-xs">↗</span>
                  </a>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed">{tool.description}</p>

                {/* How Used & Key Capabilities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-4 space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <span>🎯</span>
                      <span>How It Is Used in the Course</span>
                    </h4>
                    <ul className="space-y-1.5 text-[11px] text-slate-300">
                      {tool.howUsed.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-sky-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-4 space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <span>⚡</span>
                      <span>Key Platform Capabilities</span>
                    </h4>
                    <ul className="space-y-1.5 text-[11px] text-slate-300">
                      {tool.keyCapabilities.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Pro Tip */}
                <div className="rounded-xl bg-blue-950/30 border border-blue-900/50 p-3.5 flex items-start gap-3 text-xs">
                  <span className="text-base flex-shrink-0">💡</span>
                  <div>
                    <strong className="text-sky-300 font-semibold">Specialist Pro-Tip: </strong>
                    <span className="text-slate-300 text-[11px] leading-relaxed">{tool.proTip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Summary Table */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>📋</span>
              <span>Quick Tech Stack Reference Matrix</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3 font-semibold">Technology</th>
                    <th className="py-2.5 px-3 font-semibold">Course Role</th>
                    <th className="py-2.5 px-3 font-semibold">Primary Deliverable</th>
                    <th className="py-2.5 px-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                  <tr className="hover:bg-slate-850/50 transition">
                    <td className="py-2.5 px-3 font-bold text-sky-400">Antigravity</td>
                    <td className="py-2.5 px-3">AI Pair Programming & Code Authoring</td>
                    <td className="py-2.5 px-3">Clean SQLX transformations & test configs</td>
                    <td className="py-2.5 px-3">
                      <a
                        href="https://antigravity.google"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:underline"
                      >
                        Launch ↗
                      </a>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-850/50 transition">
                    <td className="py-2.5 px-3 font-bold text-blue-400">BigQuery</td>
                    <td className="py-2.5 px-3">Serverless Data Lakehouse & SQL Engine</td>
                    <td className="py-2.5 px-3">Raw audit queries & final production marts</td>
                    <td className="py-2.5 px-3">
                      <a
                        href="https://console.cloud.google.com/bigquery?project=aiwomen26ham-4452&ws=!1m5!1m4!4m3!1saiwomen26ham-4452!2sinvented_software_raw!2sraw_subscriptions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        Console ↗
                      </a>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-850/50 transition">
                    <td className="py-2.5 px-3 font-bold text-emerald-400">Dataform</td>
                    <td className="py-2.5 px-3">In-Warehouse Pipeline Modeling (SQLX)</td>
                    <td className="py-2.5 px-3">Staging views, date spines & assertions</td>
                    <td className="py-2.5 px-3">
                      <a
                        href="https://console.cloud.google.com/bigquery/dataform?project=aiwomen26ham-4452"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:underline"
                      >
                        Workspace ↗
                      </a>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-850/50 transition">
                    <td className="py-2.5 px-3 font-bold text-amber-400">Looker Studio</td>
                    <td className="py-2.5 px-3">Executive BI & Visual Dashboards</td>
                    <td className="py-2.5 px-3">SaaS Scorecard, Cohorts & MRR Waterfall</td>
                    <td className="py-2.5 px-3">
                      <a
                        href="https://lookerstudio.google.com/reporting/create"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:underline"
                      >
                        Open ↗
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>🗺️</span>
                <span>Ready to start the hands-on phases?</span>
              </h3>
              <p className="text-xs text-slate-400">
                Proceed to the Course Journey to begin with the course goals, then continue to Phase 1: BigQuery Schema Auditing.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition"
              >
                ← Home
              </Link>
              <Link
                href="/curriculum"
                className="rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 px-5 py-2.5 text-xs font-bold text-white transition flex items-center gap-2 shadow-md shadow-sky-900/40"
              >
                <span>Curriculum Roadmap</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </main>
      </div>

      <MentorChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentTrack={currentTrack}
        activePhaseTitle="Tech Stack & Tools"
      />
    </div>
  );
}
