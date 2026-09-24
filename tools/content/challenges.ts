// Builds the 12 challenge schedules from the rules in PRD §8.3 (T2.5,
// ADR-015, ADR-039, ADR-050).
//
// Two kinds of challenge exist. A daily plan assigns one of the 60 workouts
// to each training day. A single-exercise ramp repeats one exercise, adding
// about 10% per training day from a beginner baseline.

import type { CatalogChallenge, CatalogExercise, CatalogWorkout } from './catalog.ts';

/** Train, train, rest, train, train, train, rest (PRD §8.3). */
const WEEK_PATTERN = [true, true, false, true, true, true, false];

export interface ChallengeDay {
  day: number;
  rest: boolean;
  /** Daily plans: which of the 60 workouts to run. */
  workoutNumber?: number;
  /** Ramps: the exercise and the target for the day. */
  exerciseNumber?: number;
  seconds?: number;
  reps?: number;
  sets?: number;
}

export interface GeneratedChallenge {
  number: number;
  slug: string;
  days: ChallengeDay[];
  trainingDays: number;
}

/**
 * Which progression week a challenge day belongs to. A 14-day challenge
 * compresses the four-week progression into two; 21 days covers weeks 1 to 3;
 * 30 days runs weeks 1 to 4 plus two more days at the week-4 level (ADR-039).
 */
export function progressionWeek(day: number, totalDays: number): 1 | 2 | 3 | 4 {
  const week = Math.floor((day - 1) / 7) + 1;
  if (totalDays === 14) {
    // Two calendar weeks carry the full four-week progression, so each
    // calendar week covers two progression weeks: days 1-3 week 1, 4-7 week 2,
    // 8-10 week 3, 11-14 week 4.
    const position = (day - 1) % 7;
    const half = position < 3 ? 0 : 1;
    return ((week - 1) * 2 + half + 1) as 1 | 2 | 3 | 4;
  }
  return Math.min(4, week) as 1 | 2 | 3 | 4;
}

/** Level and duration stretch for a progression week (PRD §8.3). */
function weekRules(week: 1 | 2 | 3 | 4): { levels: (1 | 2 | 3)[]; durationScale: number } {
  switch (week) {
    case 1:
      return { levels: [1], durationScale: 1 };
    case 2:
      return { levels: [1], durationScale: 1.1 };
    case 3:
      return { levels: [2], durationScale: 1.1 };
    case 4:
      return { levels: [2, 3], durationScale: 1.1 };
  }
}

/** Single-exercise ramp baselines (ADR-050). */
const RAMPS: Record<number, { exercise: number; upgradeAt?: { level: 2; exercise: number }; seconds?: number; reps?: number; sets: number }> = {
  // Plank Challenge: Forearm Plank, 20 s x 3.
  8: { exercise: 20, seconds: 20, sets: 3 },
  // Push-Up Challenge: Knee Push-Up at level 1, Standard Push-Up from level 2.
  9: { exercise: 32, upgradeAt: { level: 2, exercise: 33 }, reps: 5, sets: 3 },
  // Squat Challenge: Bodyweight Squat, 10 reps x 3.
  10: { exercise: 64, reps: 10, sets: 3 },
};

/** Roughly +10% per training day, rounded up so it always moves (ADR-050). */
function ramped(base: number, trainingDay: number): number {
  return Math.ceil(base * 1.1 ** (trainingDay - 1));
}

/**
 * Which of the 60 workouts suit a challenge. Focus text in the catalog is
 * prose, so it is matched against the body focuses and types the workouts
 * actually carry.
 */
function candidateWorkouts(
  challenge: CatalogChallenge,
  workouts: CatalogWorkout[],
): CatalogWorkout[] {
  const focus = challenge.focus.toLowerCase();
  const kind = challenge.kind.toLowerCase();

  // The catalog spells out two challenges' workout types in their Kind column.
  if (kind.includes('stretch')) return workouts.filter((workout) => workout.type === 'stretch');
  if (kind.includes('posture')) {
    return workouts.filter((workout) => ['back', 'abs', 'shoulder'].includes(workout.bodyFocus));
  }

  const wanted = new Set<string>();
  if (focus.includes('full body')) wanted.add('full_body');
  if (focus.includes('abs') || focus.includes('core')) wanted.add('abs');
  if (focus.includes('legs') || focus.includes('glutes')) {
    wanted.add('leg');
    wanted.add('butt');
  }
  if (focus.includes('chest')) wanted.add('chest');
  if (focus.includes('arms')) wanted.add('arm');
  if (focus.includes('shoulders')) wanted.add('shoulder');
  if (focus.includes('burn fat')) wanted.add('full_body');

  const matched = workouts.filter((workout) => wanted.has(workout.bodyFocus));
  // "strength" and anything unmatched fall back to the whole strength set, so
  // a challenge is never left with nothing to schedule.
  if (matched.length > 0) return matched;
  return workouts.filter((workout) => workout.type === 'strength' || workout.type === 'hiit');
}

export function generateChallenge(
  challenge: CatalogChallenge,
  workouts: CatalogWorkout[],
  exercises: CatalogExercise[],
): GeneratedChallenge {
  const ramp = RAMPS[challenge.number];
  const days: ChallengeDay[] = [];
  let trainingDay = 0;

  const pool = ramp ? [] : candidateWorkouts(challenge, workouts);

  for (let day = 1; day <= challenge.days; day++) {
    const rest = !WEEK_PATTERN[(day - 1) % 7];
    if (rest) {
      days.push({ day, rest: true });
      continue;
    }

    trainingDay += 1;
    const week = progressionWeek(day, challenge.days);
    const rules = weekRules(week);

    if (ramp) {
      // The push-up ramp swaps to the harder variant once the plan reaches
      // level 2 (ADR-050).
      const exercise =
        ramp.upgradeAt && rules.levels.some((level) => level >= ramp.upgradeAt!.level)
          ? ramp.upgradeAt.exercise
          : ramp.exercise;

      days.push({
        day,
        rest: false,
        exerciseNumber: exercise,
        sets: ramp.sets,
        ...(ramp.seconds ? { seconds: ramped(ramp.seconds, trainingDay) } : {}),
        ...(ramp.reps ? { reps: ramped(ramp.reps, trainingDay) } : {}),
      });
      continue;
    }

    // Pick from the week's levels, stepping through the pool so a challenge
    // does not repeat the same workout on consecutive training days.
    const forWeek = pool.filter((workout) => rules.levels.includes(workout.level));
    const usable = forWeek.length > 0 ? forWeek : pool;
    const chosen = usable[(trainingDay - 1) % usable.length];

    days.push({ day, rest: false, workoutNumber: chosen?.number });
  }

  return { number: challenge.number, slug: challenge.slug, days, trainingDays: trainingDay };
}

export function generateChallenges(
  challenges: CatalogChallenge[],
  workouts: CatalogWorkout[],
  exercises: CatalogExercise[],
): GeneratedChallenge[] {
  return challenges.map((challenge) => generateChallenge(challenge, workouts, exercises));
}
