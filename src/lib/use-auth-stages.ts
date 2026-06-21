"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Hook that cycles through a sequence of loading-stage messages
 * while an async operation is pending. Creates a "RPG system booting"
 * feel — even if the server operation takes a moment, the user
 * sees progressive stages instead of a static spinner.
 *
 * @param isPending  — the `useTransition` pending flag
 * @param stages     — ordered array of { label, ms } objects.
 *                      `ms` is the delay *before* this stage appears.
 *                      The last stage is shown indefinitely once reached.
 * @returns  { label, stageIndex, isFinalStage }
 *
 * Example:
 * ```tsx
 * const { label } = useAuthStages(isPending, [
 *   { label: "Authenticating...",      ms: 0    },
 *   { label: "Verifying credentials...", ms: 800 },
 *   { label: "Accessing system...",     ms: 1800 },
 *   { label: "Access Granted",         ms: 2800 },
 * ])
 * ```
 */

export interface AuthStage {
  label: string;
  /** Delay in ms before this stage appears (cumulative from start). */
  ms: number;
}

export function useAuthStages(
  isPending: boolean,
  stages: AuthStage[]
): { label: string; stageIndex: number; isFinalStage: boolean } {
  const [stageIndex, setStageIndex] = useState(0);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  // Clear all pending timers
  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  useEffect(() => {
    if (!isPending) {
      clearTimers();
      setStageIndex(0);
      return;
    }

    // Set timers for each stage after the first
    clearTimers();
    setStageIndex(0);

    stages.forEach((stage, i) => {
      if (i === 0) return; // first stage shown immediately
      const timer = setTimeout(() => {
        setStageIndex(i);
      }, stage.ms);
      timersRef.current.push(timer);
    });

    return clearTimers;
  }, [isPending]); // eslint-disable-line react-hooks/exhaustive-deps

  const current = stages[stageIndex] || stages[0];

  return {
    label: current.label,
    stageIndex,
    isFinalStage: stageIndex === stages.length - 1,
  };
}
