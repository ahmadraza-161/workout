import type { Challenge } from '@/modules/content';

/** What the finish screen says after a fully completed plan day. */
export type PlanDayOutcome =
  | { kind: 'complete'; challengeId: string; titleKey: string; trainingDays: number }
  | {
    kind: 'next';
    challengeId: string;
    titleKey: string;
    day: number;
    doneDays: number;
    trainingDays: number;
    nextDay: number;
    /** The calendar day after this one is a planned rest day. */
    tomorrowRest: boolean;
    /** Title of the next day's workout, added by the repository. */
    nextTitleKey?: string;
  };

/**
 * `currentDay` and `completedDays` come from the plan's reconciled progress
 * after the session was saved; `currentDay` already skips rest days.
 */
export function planDayOutcome(challenge: Challenge, day: number, progress: {
  currentDay: number; completedDays: ReadonlySet<number>; status: 'active' | 'completed' | 'abandoned';
}): PlanDayOutcome | null {
  if (progress.status === 'abandoned' || !progress.completedDays.has(day)) return null;
  const trainingDays = challenge.schedule.filter((entry) => !entry.rest).length;
  if (progress.status === 'completed' || progress.currentDay > challenge.days) {
    return { kind: 'complete', challengeId: challenge.id, titleKey: challenge.titleKey, trainingDays };
  }
  const tomorrow = challenge.schedule.find((entry) => entry.day === day + 1);
  return {
    kind: 'next',
    challengeId: challenge.id,
    titleKey: challenge.titleKey,
    day,
    doneDays: progress.completedDays.size,
    trainingDays,
    nextDay: progress.currentDay,
    tomorrowRest: tomorrow?.rest === true,
  };
}
