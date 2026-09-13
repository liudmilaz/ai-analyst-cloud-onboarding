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
  // Store selected option index per question ID
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [copiedQueryId, setCopiedQueryId] = useState<string | null>(null);

  const handleSelectOption = (questionId: string, optionIdx: number, correctIdx: number) => {
    const updated = { ...selectedAnswers, [questionId]: optionIdx };
    setSelectedAnswers(updated);

    // Check if all questions are now answered correctly
    const allAnswered = questions.every((q) => updated[q.id] !== undefined);
    const allCorrect = questions.every((q) => updated[q.id] === q.correctIndex);

    if (allAnswered && allCorrect) {
      onComplete();
    }
  };

  const handleResetQuestion = (questionId: string) => {
    const updated = { ...selectedAnswers };
    delete updated[questionId];
    setSelectedAnswers(updated);
  };

  const handleCopySql = (qId: string, sql: string) => {
    navigator.clipboard.writeText(sql);
    setCopiedQueryId(qId);
    setTimeout(() => setCopiedQueryId(null), 2000);
  };

  return (
    <div className="rounded-2xl border border-sky-500/20 bg-[#0B1528]/80 p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-900/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-sky-950/70 px-2 py-0.5 text-[11px] font-bold text-sky-300 border border-sky-700/50">
              Interactive Analytical Validation
            </span>
            <span className="text-xs text-slate-400">Google BigQuery Lakehouse</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            Phase Completion Checkpoint
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Test each hypothesis live in BigQuery, select your findings, and inspect the verified results.
          </p>
        </div>

        {isCompleted && (
          <span className="self-start sm:self-auto rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-700 px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow">
            <span>✓</span>
            <span>Phase Unlocked</span>
          </span>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-8">
        {questions.map((q, qIdx) => {
          const selected = selectedAnswers[q.id];
          const hasSelected = selected !== undefined;
          const isCorrect = selected === q.correctIndex;

          return (
            <div
              key={q.id}
              className="rounded-xl border border-slate-800/90 bg-[#070B14]/80 p-5 space-y-4"
            >
              {/* Step 1: The Question */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
                  <span>Question {qIdx + 1} of {questions.length}</span>
                  {hasSelected && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        isCorrect
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-700/60"
                          : "bg-red-950 text-red-300 border border-red-700/60"
                      }`}
                    >
                      {isCorrect ? "✓ Answered Correctly" : "✗ Needs Review"}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-white leading-relaxed">
                  {q.question}
                </h4>
              </div>

              {/* Step 2: Run in BigQuery Link & Query Snippet */}
              {q.suggestedQuery && (
                <div className="rounded-lg border border-slate-800 bg-[#0B1528] overflow-hidden">
                  <div className="flex items-center justify-between bg-[#070B14]/90 px-3 py-1.5 border-b border-sky-900/30 text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1.5 text-sky-300 font-medium">
                      <span>⚡ BigQuery Validation Query</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopySql(q.id, q.suggestedQuery!)}
                        className="text-slate-400 hover:text-white transition"
                      >
                        {copiedQueryId === q.id ? "✓ Copied!" : "Copy SQL"}
                      </button>
                      <a
                        href="https://console.cloud.google.com/bigquery?project=aiwomen26ham-4452"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 px-2 py-0.5 text-[11px] font-sans font-semibold text-white transition flex items-center gap-1 shadow-sm"
                      >
                        <span>Run in BigQuery Studio</span>
                        <span>↗</span>
                      </a>
                    </div>
                  </div>
                  <pre className="p-3 text-[11px] font-mono text-sky-200 overflow-x-auto leading-relaxed">
                    {q.suggestedQuery}
                  </pre>
                </div>
              )}

              {/* Step 3: Multiple Choice Options & Step 4: Highlight upon click */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Select your analytical finding:
                </span>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isOptionSelected = selected === optIdx;
                    const isThisTheCorrectOption = optIdx === q.correctIndex;

                    let containerStyle =
                      "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900";
                    let badgeStyle = "bg-slate-800 text-slate-400 border-slate-700";

                    if (hasSelected) {
                      if (isThisTheCorrectOption) {
                        // Highlight the correct one in green!
                        containerStyle =
                          "border-emerald-500 bg-emerald-950/50 text-white font-medium ring-1 ring-emerald-500/50";
                        badgeStyle = "bg-emerald-600 text-white border-emerald-500";
                      } else if (isOptionSelected && !isCorrect) {
                        // Highlight user's incorrect choice in red!
                        containerStyle =
                          "border-red-500/80 bg-red-950/40 text-red-200 ring-1 ring-red-500/30";
                        badgeStyle = "bg-red-600 text-white border-red-500";
                      } else {
                        // Inactive other choices
                        containerStyle = "border-slate-800/60 bg-slate-950/40 text-slate-500 opacity-60";
                        badgeStyle = "bg-slate-900 text-slate-600 border-slate-800";
                      }
                    }

                    const optionLetters = ["A", "B", "C", "D", "E"];

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx, q.correctIndex)}
                        className={`w-full rounded-xl border p-3.5 text-left text-xs transition flex items-start gap-3 shadow-sm ${containerStyle}`}
                      >
                        <span
                          className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-[11px] font-bold border transition ${badgeStyle}`}
                        >
                          {hasSelected && isThisTheCorrectOption ? (
                            "✓"
                          ) : hasSelected && isOptionSelected && !isCorrect ? (
                            "✗"
                          ) : (
                            optionLetters[optIdx] || optIdx + 1
                          )}
                        </span>

                        <div className="flex-1 pt-0.5">
                          <span className="leading-relaxed">{opt}</span>
                        </div>

                        {hasSelected && isThisTheCorrectOption && (
                          <span className="rounded bg-emerald-900/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 border border-emerald-700">
                            Correct Answer
                          </span>
                        )}

                        {hasSelected && isOptionSelected && !isCorrect && (
                          <span className="rounded bg-red-900/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-300 border border-red-700">
                            Your Selection
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback and Explanation revealed after clicking */}
              {hasSelected && (
                <div
                  className={`rounded-xl p-4 text-xs leading-relaxed border space-y-1.5 animate-fadeIn ${
                    isCorrect
                      ? "bg-emerald-950/40 text-emerald-200 border-emerald-800/60"
                      : "bg-red-950/40 text-red-200 border-red-800/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5 text-sm">
                      {isCorrect ? (
                        <>
                          <span className="text-emerald-400">✓ Excellent Analysis!</span>
                        </>
                      ) : (
                        <>
                          <span className="text-red-400">✗ Not quite. Here is the analytical explanation:</span>
                        </>
                      )}
                    </span>

                    {!isCorrect && (
                      <button
                        onClick={() => handleResetQuestion(q.id)}
                        className="text-[11px] text-slate-300 hover:text-white underline font-semibold transition"
                      >
                        Try Again
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-200 leading-relaxed pt-1">
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
