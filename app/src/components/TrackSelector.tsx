"use client";

import React from "react";
import { LearningTrack } from "../lib/types";

interface TrackSelectorProps {
  currentTrack: LearningTrack;
  onTrackChange: (track: LearningTrack) => void;
}

export const TrackSelector: React.FC<TrackSelectorProps> = ({ currentTrack, onTrackChange }) => {
  return (
    <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
      <button
        onClick={() => onTrackChange("dataform")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
          currentTrack === "dataform"
            ? "bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-sm"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
        <span>Dataform (Applied)</span>
      </button>
      <button
        onClick={() => onTrackChange("dbt")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
          currentTrack === "dbt"
            ? "bg-amber-600 text-white shadow-sm"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-amber-300"></span>
        <span>dbt Track (Comparison)</span>
      </button>
    </div>
  );
};
