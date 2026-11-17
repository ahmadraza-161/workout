import { getChallenge, getContentPack } from '../content/repository';

import { dayPart, planWeek, recommendPlanId, trainingDays } from './plan';

it('recommends an existing plan for every goal and level, starting beginners gently', () => {
  for (const goal of ['keep_fit', 'build_muscle', 'burn_fat', 'flexibility'] as const) {
    for (const level of [1, 2, 3] as const) expect(getChallenge(recommendPlanId(goal, level))).toBeDefined();
  }
  expect(recommendPlanId('burn_fat', 1)).toBe('ch_beginner_start_challenge');
  expect(recommendPlanId('flexibility', 1)).toBe('ch_flexibility_mobility_challenge');
});

it('shows the current seven-day block with done, today, rest and upcoming days', () => {
  const plan = getChallenge('ch_beginner_start_challenge')!;
  const week = planWeek(plan, 4, new Set([1, 2]));
  expect(week.map((day) => day.day)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  expect(week.map((day) => day.state)).toEqual(['done', 'done', 'rest', 'today', 'upcoming', 'upcoming', 'rest']);
  expect(planWeek(plan, 9, new Set([8]))[0]).toEqual({ day: 8, state: 'done' });
  expect(planWeek(plan, plan.days + 1, new Set()).at(-1)?.day).toBe(plan.days);
});

it('counts only training days and names the time of day', () => {
  for (const plan of getContentPack().challenges) {
    expect(trainingDays(plan)).toBe(plan.schedule.filter((entry) => !entry.rest).length);
    expect(trainingDays(plan)).toBeLessThan(plan.days);
  }
  expect(dayPart(new Date(2026, 9, 27, 7))).toBe('morning');
  expect(dayPart(new Date(2026, 9, 27, 13))).toBe('afternoon');
  expect(dayPart(new Date(2026, 9, 27, 21))).toBe('evening');
});
