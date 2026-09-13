"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LearningTrack } from "../lib/types";

interface NavbarProps {
  currentTrack?: LearningTrack;
  onTrackChange?: (track: LearningTrack) => void;
  onOpenChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenChat }) => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur shadow-md">
      <div className="flex min-h-[68px] py-2.5 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 py-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-500/30 flex-shrink-0">
              Δ
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 text-sm md:text-base tracking-tight leading-snug">
                  Data Specialist Onboarding
                </span>
                <span className="rounded bg-indigo-900/60 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-700/50">
                  Human-Led & AI-Powered
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">NovaScale Analytics • GCP: aiwomen26ham-4452</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-md transition ${
                pathname === "/" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Curriculum
            </Link>
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-md transition ${
                pathname === "/dashboard" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Executive BI Dashboard
            </Link>
            <Link
              href="/playground"
              className={`px-3 py-1.5 rounded-md transition ${
                pathname === "/playground" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              SQL & Traps Playground
            </Link>
            <Link
              href="/dataform"
              className={`px-3 py-1.5 rounded-md transition ${
                pathname === "/dataform" ? "bg-slate-800 text-emerald-300" : "text-slate-400 hover:text-emerald-300"
              }`}
            >
              Reference Solutions
            </Link>
            <Link
              href="/compare"
              className={`px-3 py-1.5 rounded-md transition ${
                pathname === "/compare" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Dataform vs dbt
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Direct Google Cloud & Antigravity Links to Empty / Prepared Tools */}
          <div className="hidden lg:flex items-center gap-1.5 border-r border-slate-800 pr-3">
            <a
              href="https://console.cloud.google.com/bigquery?project=aiwomen26ham-4452&ws=!1m5!1m4!4m3!1saiwomen26ham-4452!2sinvented_software_raw!2sraw_subscriptions"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded bg-slate-900 border border-slate-800 hover:border-blue-500/60 px-2 py-1 text-[11px] font-medium text-blue-300 hover:text-white transition"
              title="Open prepared raw lakehouse dataset in BigQuery"
            >
              <span>BigQuery (Raw)</span>
              <span className="text-[10px] text-blue-400">↗</span>
            </a>
            <a
              href="https://console.cloud.google.com/bigquery/dataform?project=aiwomen26ham-4452"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded bg-slate-900 border border-slate-800 hover:border-emerald-600/60 px-2 py-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 transition"
              title="Open empty Dataform workspace for training"
            >
              <span>Dataform (Empty)</span>
              <span className="text-[10px] text-emerald-500">↗</span>
            </a>
            <a
              href="https://lookerstudio.google.com/reporting/create"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded bg-slate-900 border border-slate-800 hover:border-amber-600/60 px-2 py-1 text-[11px] font-medium text-amber-300 hover:text-amber-200 transition"
              title="Open empty Looker Studio report"
            >
              <span>Looker Studio (Blank)</span>
              <span className="text-[10px] text-amber-500">↗</span>
            </a>
            <a
              href="https://antigravity.google"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded bg-slate-900 border border-slate-800 hover:border-purple-500/60 px-2 py-1 text-[11px] font-medium text-purple-300 hover:text-purple-200 transition"
              title="Open Google Antigravity AI-first development platform"
            >
              <span>Antigravity</span>
              <span className="text-[10px] text-purple-400">↗</span>
            </a>
          </div>

          <button
            onClick={onOpenChat}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md hover:from-indigo-500 hover:to-violet-500 transition"
            title="Open Gemini AI Socratic Coach in right corner"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Gemini AI Mentor</span>
          </button>
        </div>
      </div>
    </header>
  );
};
