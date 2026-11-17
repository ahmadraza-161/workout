import type { Workout } from '@/modules/content';

import type { PlayerState } from './engine';

export interface SessionSummary {
  durationSec: number;
  completionPct: number;
  kcal: number;
  localDate: string;
}

/** Uses completed exercise time and MET values; unknown weight defaults to 70 kg. */
export function summarizeSession(
  state: PlayerState,
  workout: Workout,
  endedAt: number,
  weightKg: number | null,
  metFor: (exerciseId: string) => number,
): SessionSummary {
  const effectiveWeight = weightKg && weightKg > 0 ? weightKg : 70;
  const completed = state.done.filter((item) => !item.skipped);
  const kcal = completed.reduce(
    (total, item) => total + (metFor(item.exerciseId) * 3.5 * effectiveWeight * item.doneSeconds) / 12000,
    0,
  );
  const pausedMs = state.pausedTotalMs + (state.pausedAt === null ? 0 : Math.max(0, endedAt - state.pausedAt));
  const durationSec = Math.max(0, Math.round((endedAt - state.startedAt - pausedMs) / 1000));
  const date = new Date(endedAt);
  const localDate = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  return {
    durationSec,
    completionPct: workout.items.length === 0 ? 0 : Math.round((completed.length / workout.items.length) * 100),
    kcal: Math.round(kcal * 10) / 10,
    localDate,
  };
}
