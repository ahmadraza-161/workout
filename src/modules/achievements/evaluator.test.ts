import rawPack from '../../../assets/data/content-pack.json';

import type { ContentPack } from '@/modules/content';

import { evaluateAchievements, type AchievementFacts, type AchievementSession } from './evaluator';

const pack = rawPack as ContentPack;

function session(id: string, localDate: string, overrides: Partial<AchievementSession> = {}): AchievementSession {
  const endedAt = new Date(`${localDate}T12:00:00`).getTime();
  return { id, localDate, workoutId: pack.workouts[0]!.id, challengeId: null, day: null,
    startedAt: endedAt - 600_000, endedAt, completionPct: 100, durationSec: 600, ...overrides };
}

function facts(overrides: Partial<AchievementFacts> = {}): AchievementFacts {
  return { sessions: [], items: [], runs: [], customWorkoutCount: 0, weeklyTarget: 4,
    exercises: pack.exercises, workouts: pack.workouts, challenges: pack.challenges,
    today: new Date(2026, 8, 30, 12), ...overrides };
}

function earned(input: AchievementFacts): Set<string> {
  return evaluateAchievements(pack.achievements, input);
}

describe('achievement evaluator', () => {
  it('counts only qualifying completed workouts and keeps an earned streak after it ends', () => {
    const rows = [session('a', '2026-09-25'), session('b', '2026-09-26'), session('c', '2026-09-27'),
      session('d', '2026-09-28', { completionPct: 49 })];
    const result = earned(facts({ sessions: rows }));
    expect(result.has('first_workout')).toBe(true);
    expect(result.has('workouts_3')).toBe(true);
    expect(result.has('streak_3')).toBe(true);
    expect(result.has('streak_7')).toBe(false);
  });

  it('anchors the first-week badge to the first workout, not a later rolling week', () => {
    const rows = ['2026-09-01', '2026-09-09', '2026-09-10', '2026-09-11']
      .map((date, index) => session(String(index), date));
    expect(earned(facts({ sessions: rows })).has('first_week_done')).toBe(false);
    rows[1] = session('1', '2026-09-02');
    rows[2] = session('2', '2026-09-03');
    expect(earned(facts({ sessions: rows })).has('first_week_done')).toBe(true);
  });

  it('recognizes four consecutive weekly goals across a year boundary', () => {
    const dates = ['2025-12-28', '2025-12-29', '2026-01-04', '2026-01-05',
      '2026-01-11', '2026-01-12', '2026-01-18', '2026-01-19'];
    const result = earned(facts({ sessions: dates.map((date, index) => session(String(index), date)), weeklyTarget: 2 }));
    expect(result.has('goal_met')).toBe(true);
    expect(result.has('goal_4_weeks')).toBe(true);
  });

  it('requires an entire challenge run, including all non-rest days', () => {
    const challenge = pack.challenges.find((entry) => entry.days === 14)!;
    const startedAt = new Date(2026, 8, 1).getTime();
    const rows = challenge.schedule.filter((day) => !day.rest).map((day) =>
      session(String(day.day), '2026-09-20', { challengeId: challenge.id, day: day.day, startedAt: startedAt + day.day * 1000 }));
    const run = { challengeId: challenge.id, startedAt, status: 'active' as const };
    expect(earned(facts({ sessions: rows.slice(0, -1), runs: [run] })).has('challenge_14')).toBe(false);
    expect(earned(facts({ sessions: rows, runs: [run] })).has('challenge_14')).toBe(true);
    expect(earned(facts({ sessions: rows, runs: [{ ...run, startedAt: startedAt + 100_000 }] })).has('challenge_14')).toBe(false);
  });

  it('uses actual set results for strength and exercise exploration', () => {
    const rows = [session('a', '2026-09-20')];
    const items = [
      { sessionId: 'a', exerciseId: pack.exercises[19]!.id, doneSeconds: 120, doneReps: null, skipped: false },
      { sessionId: 'a', exerciseId: pack.exercises[63]!.id, doneSeconds: 0, doneReps: 50, skipped: false },
      { sessionId: 'a', exerciseId: pack.exercises[29]!.id, doneSeconds: 0, doneReps: 20, skipped: true },
    ];
    const result = earned(facts({ sessions: rows, items }));
    expect(result.has('plank_120')).toBe(true);
    expect(result.has('squats_50')).toBe(true);
    expect(result.has('pushups_20')).toBe(false);
  });

  it('uses the workout finish time for early and late badges', () => {
    const early = new Date(2026, 8, 20, 7, 59).getTime();
    const late = new Date(2026, 8, 21, 21).getTime();
    const result = earned(facts({ sessions: [session('a', '2026-09-20', { endedAt: early }),
      session('b', '2026-09-21', { endedAt: late })] }));
    expect(result.has('early_bird')).toBe(true);
    expect(result.has('night_owl')).toBe(true);
  });

  it('evaluates every authored badge rule', () => {
    expect(pack.achievements).toHaveLength(35);
    expect(earned(facts()).size).toBe(0);
  });
});
