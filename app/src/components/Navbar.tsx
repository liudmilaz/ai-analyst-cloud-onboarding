"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrackSelector } from "./TrackSelector";
import { LearningTrack } from "../lib/types";

interface NavbarProps {
  currentTrack: LearningTrack;
  onTrackChange: (track: LearningTrack) => void;
  onOpenChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTrack, onTrackChange, onOpenChat }) => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-500/30">
              Δ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100">AI Analyst Onboarding</span>
                <span className="rounded bg-indigo-900/60 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-700/50">
                  GCP Cloud Edition
                </span>
              </div>
              <p className="text-xs text-slate-400">Invented Software • aiwomen26ham-4452</p>
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
            <a
              href="https://console.cloud.google.com/bigquery/dataform/locations/europe-west1/repositories/invented-software-transformations/workspaces/production?project=aiwomen26ham-4452"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-md transition text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 bg-emerald-950/40 border border-emerald-800/50 hover:bg-emerald-900/50"
              title="Open ready deployed Dataform project in Google Cloud"
            >
              <span>Dataform Project (Corrected)</span>
              <span className="text-xs">↗</span>
            </a>
            <Link
              href="/dataform"
              className={`px-3 py-1.5 rounded-md transition ${
                pathname === "/dataform" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Code Explorer
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
          {/* Direct Google Cloud Links */}
          <div className="hidden lg:flex items-center gap-1.5 border-r border-slate-800 pr-3">
            <a
              href="https://console.cloud.google.com/bigquery?project=aiwomen26ham-4452"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded bg-slate-900 border border-slate-800 hover:border-indigo-600/60 px-2 py-1 text-[11px] font-medium text-slate-300 hover:text-white transition"
              title="Open Google BigQuery Studio in Cloud Console"
            >
              <span>BigQuery Studio</span>
              <span className="text-[10px] text-slate-500">↗</span>
            </a>
            <a
              href="https://console.cloud.google.com/bigquery/dataform/locations/europe-west1/repositories/invented-software-transformations/workspaces/production?project=aiwomen26ham-4452"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded bg-slate-900 border border-slate-800 hover:border-emerald-600/60 px-2 py-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 transition"
              title="Open Google Cloud Dataform in Cloud Console"
            >
              <span>Dataform Workspace</span>
              <span className="text-[10px] text-slate-500">↗</span>
            </a>
          </div>

          <TrackSelector currentTrack={currentTrack} onTrackChange={onTrackChange} />

          <button
            onClick={onOpenChat}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md hover:from-indigo-500 hover:to-violet-500 transition"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>AI Mentor</span>
          </button>
        </div>
      </div>
    </header>
  );
};
