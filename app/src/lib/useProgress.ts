"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "linia_completed_phases";

function loadCompletedPhases(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

function saveCompletedPhases(phases: number[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(phases));
  } catch {
    // localStorage can be unavailable (private browsing, quota) - progress just won't persist
  }
}

export function useProgress() {
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);

  useEffect(() => {
    setCompletedPhases(loadCompletedPhases());
  }, []);

  const markPhaseComplete = (phaseId: number) => {
    setCompletedPhases((prev) => {
      if (prev.includes(phaseId)) return prev;
      const next = [...prev, phaseId];
      saveCompletedPhases(next);
      return next;
    });
  };

  return { completedPhases, markPhaseComplete };
}
