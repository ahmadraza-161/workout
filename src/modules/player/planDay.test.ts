import type { Challenge } from '@/modules/content';

import { planDayOutcome } from './planDay';

// Day 3 is a rest day; there are 13 training days.
const challenge = {
  id: 'ch_test', titleKey: 'challenge.test.title', days: 14,
  schedule: Array.from({ length: 14 }, (_, index) => index + 1 === 3
    ? { day: 3, rest: true }
    : { day: index + 1, workoutId: `wo_${index + 1}` }),
} as unknown as Challenge;

const progress = (days: number[], currentDay: number, status: 'active' | 'completed' | 'abandoned' = 'active') =>
  ({ completedDays: new Set(days), currentDay, status });

it('names the next workout day when tomorrow is a training day', () => {
  expect(planDayOutcome(challenge, 1, progress([1], 2))).toEqual({
    kind: 'next', challengeId: 'ch_test', titleKey: 'challenge.test.title',
    day: 1, doneDays: 1, trainingDays: 13, nextDay: 2, tomorrowRest: false,
  });
});

it('says tomorrow is a rest day and skips to the day after it', () => {
  expect(planDayOutcome(challenge, 2, progress([1, 2], 4))).toMatchObject({ kind: 'next', tomorrowRest: true, nextDay: 4 });
});

it('reports a finished plan after the last day', () => {
  const all = [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  expect(planDayOutcome(challenge, 14, progress(all, 15, 'completed')))
    .toEqual({ kind: 'complete', challengeId: 'ch_test', titleKey: 'challenge.test.title', trainingDays: 13 });
});

it('shows nothing for a partial day or a paused plan', () => {
  expect(planDayOutcome(challenge, 2, progress([1], 2))).toBeNull();
  expect(planDayOutcome(challenge, 1, progress([1], 2, 'abandoned'))).toBeNull();
});
