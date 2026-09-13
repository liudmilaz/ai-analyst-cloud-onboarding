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
          <Link href="/" className="flex items-center gap-2.5 py-1 group" title="Return to LINIA Home">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-500/30 flex-shrink-0 group-hover:bg-indigo-500 transition">
              Δ
            </div>
            <span className="font-bold text-slate-100 text-sm md:text-base tracking-tight group-hover:text-indigo-300 transition">
              Human-Led & AI-Powered
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/curriculum"
              className={`px-3 py-1.5 rounded-md transition ${
                pathname === "/curriculum" || pathname.startsWith("/phases")
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Curriculum Roadmap
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
