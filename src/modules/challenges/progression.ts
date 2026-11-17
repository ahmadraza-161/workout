import type { Challenge } from '@/modules/content';

/** The next workout day; scheduled rest days require no player session. */
export function nextChallengeDay(challenge: Challenge, completedDays: ReadonlySet<number>): number {
  let day = 1;
  while (day <= challenge.days) {
    const scheduled = challenge.schedule.find((entry) => entry.day === day);
    if (!scheduled || (!scheduled.rest && !completedDays.has(day))) break;
    day += 1;
  }
  return day;
}

export interface ChallengeSessionResult {
  day: number | null;
  completionPct: number;
  endedAt: number | null;
  startedAt: number;
}

export function completedChallengeDays(
  sessions: readonly ChallengeSessionResult[],
  runStartedAt: number,
): ReadonlySet<number> {
  return new Set(sessions.filter((row) => row.startedAt >= runStartedAt &&
    row.completionPct === 100 && row.endedAt !== null && row.day !== null)
    .map((row) => row.day as number));
}
