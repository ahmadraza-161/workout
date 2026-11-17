import type { Challenge } from '@/modules/content';
import { completedChallengeDays, nextChallengeDay } from './progression';

const challenge: Challenge = {
  id: 'test', titleKey: 'title', descKey: 'desc', days: 14, level: 1,
  bodyFocus: 'full_body', goal: 'keep_fit', dailyMinutes: '5 min', gradient: 'blue',
  schedule: Array.from({ length: 14 }, (_, index) => ({
    day: index + 1, ...(index === 2 || index === 13 ? { rest: true } : { workoutId: 'workout' }),
  })),
};

describe('challenge progression', () => {
  it('unlocks the next workout after a completed day and skips rest days', () => {
    expect(nextChallengeDay(challenge, new Set())).toBe(1);
    expect(nextChallengeDay(challenge, new Set([1]))).toBe(2);
    expect(nextChallengeDay(challenge, new Set([1, 2]))).toBe(4);
  });

  it('does not accept a later day while an earlier workout is missing', () => {
    expect(nextChallengeDay(challenge, new Set([2, 4]))).toBe(1);
  });

  it('marks completion after the final workout and trailing rest day', () => {
    const allWorkouts = new Set(challenge.schedule.filter((day) => !day.rest).map((day) => day.day));
    expect(nextChallengeDay(challenge, allWorkouts)).toBe(15);
  });

  it('only counts fully completed sessions from the current run', () => {
    const days = completedChallengeDays([
      { day: 1, completionPct: 100, startedAt: 100, endedAt: 150 },
      { day: 1, completionPct: 70, startedAt: 200, endedAt: 250 },
      { day: 2, completionPct: 100, startedAt: 220, endedAt: 260 },
    ], 200);
    expect([...days]).toEqual([2]);
    expect(nextChallengeDay(challenge, days)).toBe(1);
  });
});
