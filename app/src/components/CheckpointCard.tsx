"use client";

import React, { useState } from "react";
import { CheckpointQuestion } from "../lib/types";

interface CheckpointCardProps {
  questions: CheckpointQuestion[];
  onComplete: () => void;
  isCompleted: boolean;
}

export const CheckpointCard: React.FC<CheckpointCardProps> = ({
  questions,
  onComplete,
  isCompleted
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(isCompleted);

  const allAnswered = questions.every((q) => selectedAnswers[q.id] !== undefined);
  const allCorrect = questions.every((q) => selectedAnswers[q.id] === q.correctIndex);

  const handleSubmit = () => {
    setSubmitted(true);
    if (allCorrect) {
      onComplete();
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Phase Completion Checkpoint</h3>
          <p className="text-xs text-slate-400">Validate your analytical findings to unlock the next phase</p>
        </div>
        {isCompleted && (
          <span className="rounded bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 text-xs font-semibold">
            ✓ Phase Passed
          </span>
        )}
      </div>

      <div className="space-y-6">
        {questions.map((q, qIdx) => {
          const selected = selectedAnswers[q.id];
          const isQCorrect = selected === q.correctIndex;

          return (
            <div key={q.id} className="space-y-2">
              <p className="text-xs font-medium text-slate-200">
                {qIdx + 1}. {q.question}
              </p>

              <div className="space-y-1.5">
                {q.options.map((opt, optIdx) => {
                  let optStyle = "border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800";
                  if (submitted) {
                    if (optIdx === q.correctIndex) {
                      optStyle = "border-emerald-600 bg-emerald-950/60 text-emerald-200";
                    } else if (selected === optIdx && !isQCorrect) {
                      optStyle = "border-red-600 bg-red-950/60 text-red-200";
                    }
                  } else if (selected === optIdx) {
                    optStyle = "border-indigo-600 bg-indigo-950/60 text-indigo-200";
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={submitted && isCompleted}
                      onClick={() =>
                        setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                      }
                      className={`w-full rounded-lg border p-2.5 text-left text-xs transition flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {submitted && optIdx === q.correctIndex && (
                        <span className="text-emerald-400 text-xs font-bold">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div
                  className={`rounded-lg p-2.5 text-[11px] leading-relaxed ${
                    isQCorrect
                      ? "bg-emerald-950/30 text-emerald-300 border border-emerald-800/40"
                      : "bg-red-950/30 text-red-300 border border-red-800/40"
                  }`}
                >
                  <strong>{isQCorrect ? "Correct!" : "Not quite."}</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-end">
        {!isCompleted && (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            Submit Checkpoint Answers
          </button>
        )}
      </div>
    </div>
  );
};
