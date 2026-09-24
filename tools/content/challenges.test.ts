import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { generateChallenges, progressionWeek } from './challenges.ts';
import { loadCatalog } from './catalog.ts';

const markdown = readFileSync(join(__dirname, '..', '..', 'DOC', 'CONTENT_MAP.md'), 'utf8');
const catalog = loadCatalog(markdown);
const generated = generateChallenges(catalog.challenges, catalog.workouts, catalog.exercises);
const byNumber = new Map(catalog.challenges.map((challenge) => [challenge.number, challenge]));
const workoutNumbers = new Set(catalog.workouts.map((workout) => workout.number));
const exerciseNumbers = new Set(catalog.exercises.map((exercise) => exercise.number));

describe('progressionWeek', () => {
  it('runs one calendar week per progression week for 21- and 30-day plans', () => {
    expect(progressionWeek(1, 28)).toBe(1);
    expect(progressionWeek(8, 28)).toBe(2);
    expect(progressionWeek(15, 28)).toBe(3);
    expect(progressionWeek(22, 28)).toBe(4);
  });

  it('holds the last two days of a 30-day plan at week 4 (ADR-039)', () => {
    expect(progressionWeek(29, 30)).toBe(4);
    expect(progressionWeek(30, 30)).toBe(4);
  });

  it('compresses the four-week progression into two for a 14-day plan', () => {
    expect(progressionWeek(1, 14)).toBe(1);
    expect(progressionWeek(4, 14)).toBe(2);
    expect(progressionWeek(8, 14)).toBe(3);
    expect(progressionWeek(14, 14)).toBe(4);
  });
});

describe('generateChallenges', () => {
  it('builds every challenge in the catalog', () => {
    expect(generated).toHaveLength(12);
  });

  it('runs for exactly the number of days the catalog states', () => {
    for (const challenge of generated) {
      expect(challenge.days).toHaveLength(byNumber.get(challenge.number)!.days);
      expect(challenge.days.map((day) => day.day)).toEqual(
        Array.from({ length: challenge.days.length }, (_, index) => index + 1),
      );
    }
  });

  it('follows the train, train, rest, train, train, train, rest pattern', () => {
    for (const challenge of generated) {
      for (const day of challenge.days) {
        const position = (day.day - 1) % 7;
        expect(day.rest).toBe(position === 2 || position === 6);
      }
    }
  });

  it('gives every training day something to do', () => {
    for (const challenge of generated) {
      for (const day of challenge.days) {
        if (day.rest) continue;
        const scheduled = day.workoutNumber !== undefined || day.exerciseNumber !== undefined;
        expect(scheduled).toBe(true);
      }
    }
  });

  it('only references workouts and exercises that exist', () => {
    for (const challenge of generated) {
      for (const day of challenge.days) {
        if (day.workoutNumber !== undefined) expect(workoutNumbers.has(day.workoutNumber)).toBe(true);
        if (day.exerciseNumber !== undefined) expect(exerciseNumbers.has(day.exerciseNumber)).toBe(true);
      }
    }
  });

  it('ramps the single-exercise challenges upward and never backwards', () => {
    const ramps = generated.filter((challenge) =>
      challenge.days.some((day) => day.exerciseNumber !== undefined),
    );
    expect(ramps).toHaveLength(3);

    for (const challenge of ramps) {
      const targets = challenge.days
        .filter((day) => !day.rest)
        .map((day) => day.seconds ?? day.reps ?? 0);

      for (let i = 1; i < targets.length; i++) {
        expect(targets[i]!).toBeGreaterThanOrEqual(targets[i - 1]!);
      }
      // ADR-050 expects the last training day at roughly 2.6x the baseline.
      expect(targets[targets.length - 1]! / targets[0]!).toBeGreaterThan(2);
    }
  });

  it('starts the ramps at the baselines ADR-050 sets', () => {
    const first = (number: number) =>
      generated.find((challenge) => challenge.number === number)!.days.find((day) => !day.rest)!;

    expect(first(8).seconds).toBe(20); // Plank, 20 s
    expect(first(9).reps).toBe(5); // Push-Up, 5 reps
    expect(first(10).reps).toBe(10); // Squat, 10 reps
    for (const number of [8, 9, 10]) expect(first(number).sets).toBe(3);
  });

  it('swaps the push-up ramp to the harder variant once it reaches level 2', () => {
    const pushUp = generated.find((challenge) => challenge.number === 9)!;
    const used = new Set(pushUp.days.filter((day) => !day.rest).map((day) => day.exerciseNumber));
    // #32 Knee Push-Up early, #33 Standard Push-Up later (ADR-050).
    expect(used).toEqual(new Set([32, 33]));
  });

  it('keeps the flexibility challenge to stretch workouts', () => {
    const flexibility = generated.find((challenge) => challenge.number === 11)!;
    const types = flexibility.days
      .filter((day) => day.workoutNumber !== undefined)
      .map((day) => catalog.workouts.find((workout) => workout.number === day.workoutNumber)!.type);

    expect(new Set(types)).toEqual(new Set(['stretch']));
  });

  it('is deterministic', () => {
    expect(generateChallenges(catalog.challenges, catalog.workouts, catalog.exercises)).toEqual(generated);
  });
});
