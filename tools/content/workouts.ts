// Builds each of the 60 workouts' exercise lists from the rules in PRD §8.2
// (T2.4, ADR-015). The catalog says what each workout is — focus, level,
// type, duration — and these rules decide what goes in it.
//
// Generation is deterministic: the same catalog always produces the same
// workouts, so a rebuild is a no-op in git and a reviewed workout stays
// reviewed.

import type { CatalogExercise, CatalogWorkout } from './catalog.ts';
import { METRICS, type MuscleGroup } from './metrics.ts';

/** Seconds a single rep is assumed to take, for duration estimates (ADR-033). */
const SECONDS_PER_REP = 3;

export interface WorkoutItem {
  exerciseNumber: number;
  seconds?: number;
  reps?: number;
  /** Rest after this item. The last item carries none. */
  rest: number;
  /** One-sided exercises appear twice in a row (PRD §8.2). */
  side?: 'left' | 'right';
}

export interface GeneratedWorkout {
  number: number;
  slug: string;
  items: WorkoutItem[];
  /** Estimated total, including rest, in seconds. */
  totalSeconds: number;
  /** Main-block exercise count actually used. */
  mainCount: number;
  /** True when the block size had to leave the PRD §8.2 range. */
  blockSizeFlexed: boolean;
}

/** Block sizes by target duration (PRD §8.2). */
function blockSizes(minutes: number): { warmUp: number; main: [number, number]; coolDown: number } {
  if (minutes < 10) return { warmUp: 1, main: [4, 6], coolDown: 1 };
  if (minutes <= 20) return { warmUp: 2, main: [8, 12], coolDown: 2 };
  return { warmUp: 3, main: [12, 18], coolDown: 3 };
}

/** Difficulty range, work time and rest by level (PRD §8.2). */
function levelRules(level: 1 | 2 | 3) {
  switch (level) {
    case 1:
      return { difficulty: [1, 2], work: [30, 40], rest: [20, 30] } as const;
    case 2:
      return { difficulty: [1, 3], work: [40, 50], rest: [15, 20] } as const;
    case 3:
      return { difficulty: [2, 3], work: [45, 60], rest: [10, 15] } as const;
  }
}

const WARM_UP = 'Warm-Up';
const COOL_DOWN = 'Stretch & Cool-Down';
const CARDIO = 'Cardio & Conditioning';
const FULL_BODY = 'Full Body';

// Catalog titles with a concrete promise need a reviewed pool. The general
// focus rule cannot distinguish, for example, chair work from other full-body
// moves or neck/shoulder stretches from lower-body stretches.
const REVIEWED_MAIN: Record<number, readonly number[]> = {
  36: [30, 31, 32, 33, 34, 35, 38, 40, 42, 43, 44, 45, 46, 47, 48, 52, 53],
  37: [64, 65, 66, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
  38: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 44, 45, 48],
  42: [1, 2, 3, 4, 5, 6, 7, 8, 28, 52, 53, 78, 95, 97, 99, 103],
  48: [104, 105, 106, 114, 115, 116, 119],
  49: [106, 107, 108, 109, 110, 111, 112, 113, 118],
  50: [104, 105, 106, 107, 111, 112, 118, 119],
  51: [104, 105, 106, 114, 115, 116, 119],
  52: [104, 105, 107, 111, 112, 118, 119],
  53: [107, 108, 109, 112, 113, 118, 119],
  55: [104, 105, 106, 107, 114, 115, 116, 119],
  56: [106, 107, 108, 109, 111, 112, 113, 118, 119],
  58: [43, 44, 45, 46, 47, 48, 52, 53],
  59: [30, 31, 44, 64, 78, 81, 87, 93, 95],
  60: [11, 18, 20, 23, 29, 30, 32, 40, 61, 64, 65, 69, 73, 76, 77, 78, 87, 92, 93, 95, 97, 99, 102, 103],
};

/**
 * Which body focus an exercise can serve. Category decides most of it; the
 * two categories that cover two focuses each are split by primary muscle.
 */
export function focusesFor(exercise: CatalogExercise): string[] {
  const primary = METRICS[exercise.number]?.primary ?? [];
  const has = (...muscles: MuscleGroup[]) => muscles.some((muscle) => primary.includes(muscle));

  switch (exercise.category) {
    case 'Core & Abs':
      return ['abs'];
    case 'Chest & Push':
      return ['chest'];
    case 'Shoulders & Arms':
      // Deltoid-led moves serve "shoulder"; triceps and biceps serve "arm".
      return [...(has('deltoids') ? ['shoulder'] : []), ...(has('triceps', 'biceps', 'deltoids') ? ['arm'] : [])];
    case 'Back & Pull':
      return ['back'];
    case 'Legs & Glutes':
      return [
        ...(has('quads', 'hamstrings', 'calves', 'adductors') ? ['leg'] : []),
        ...(has('glutes') ? ['butt'] : []),
      ];
    case FULL_BODY:
    case CARDIO:
      return ['full_body'];
    default:
      // Warm-ups and stretches are not main-block material.
      return [];
  }
}

/** A small deterministic generator, so a rebuild never reshuffles a workout. */
function rng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function pick<T>(items: T[], random: () => number): T | undefined {
  if (items.length === 0) return undefined;
  return items[Math.floor(random() * items.length)];
}

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

/** Estimated seconds of work for one item, before rest (ADR-033). */
function workSeconds(item: WorkoutItem): number {
  return item.seconds ?? (item.reps ?? 0) * SECONDS_PER_REP;
}

export function totalSeconds(items: WorkoutItem[]): number {
  return items.reduce((sum, item, index) => {
    const rest = index === items.length - 1 ? 0 : item.rest;
    return sum + workSeconds(item) + rest;
  }, 0);
}

interface Pools {
  warmUp: CatalogExercise[];
  coolDown: CatalogExercise[];
  main: CatalogExercise[];
}

function poolsFor(workout: CatalogWorkout, exercises: CatalogExercise[]): Pools {
  const quietOnly = workout.quiet.startsWith('Yes');
  const rules = levelRules(workout.level);
  const [minDifficulty, maxDifficulty] = rules.difficulty;
  const reviewedNumbers = REVIEWED_MAIN[workout.number];

  const allowed = (exercise: CatalogExercise) => !quietOnly || exercise.quietSafe;

  const main = exercises.filter((exercise) => {
    if (!allowed(exercise)) return false;
    if (exercise.level < minDifficulty || exercise.level > maxDifficulty) return false;
    if (reviewedNumbers) return reviewedNumbers.includes(exercise.number);

    // Stretch and cool-down workouts are holds only, with no cardio.
    if (workout.type === 'stretch' || workout.type === 'cooldown') {
      return exercise.category === COOL_DOWN && exercise.type === 'hold';
    }
    // Warm-up workouts draw from the warm-up pool.
    if (workout.type === 'warmup') return exercise.category === WARM_UP;

    // HIIT leans on cardio; everything else matches the workout's focus.
    if (workout.type === 'hiit') {
      return exercise.category === CARDIO || focusesFor(exercise).includes(workout.bodyFocus);
    }
    return focusesFor(exercise).includes(workout.bodyFocus);
  });

  return {
    warmUp: exercises.filter((exercise) => exercise.category === WARM_UP && allowed(exercise) &&
      (![42, 59, 60].includes(workout.number) || exercise.level === 1) &&
      (workout.number !== 42 || exercise.number !== 9)),
    coolDown: exercises.filter((exercise) => exercise.category === COOL_DOWN && allowed(exercise)),
    main,
  };
}

/** The muscles an exercise leads with, used to avoid back-to-back repeats. */
const primaryOf = (exercise: CatalogExercise): MuscleGroup[] => METRICS[exercise.number]?.primary ?? [];

function sharesPrimary(a: CatalogExercise, b: CatalogExercise): boolean {
  const first = primaryOf(a);
  return primaryOf(b).some((muscle) => first.includes(muscle));
}

/**
 * Chooses `count` exercises from a pool without putting two that work the
 * same main muscle next to each other. Strength workouts are exempt, because
 * training one area hard is the point (PRD §8.2).
 *
 * Selection and ordering are separate steps. Picking greedily and hoping the
 * next exercise happens not to clash fails on the full-body and cardio pools,
 * where almost everything leads with quads or abs: by the end only clashing
 * exercises are left. Ordering afterwards can spread them out instead.
 */
function chooseSequence(
  pool: CatalogExercise[],
  count: number,
  random: () => number,
  allowSameMuscleAdjacent: boolean,
  /** Last exercise of the previous block, so boundaries do not clash. */
  after?: CatalogExercise,
): CatalogExercise[] {
  if (pool.length === 0) return [];

  // Step 1: take `count` exercises, preferring unused ones.
  const selected: CatalogExercise[] = [];
  let remaining = [...pool];
  while (selected.length < count) {
    if (remaining.length === 0) remaining = [...pool];
    const next = pick(remaining, random);
    if (!next) break;
    selected.push(next);
    remaining = remaining.filter((exercise) => exercise.number !== next.number);
  }

  if (allowSameMuscleAdjacent || selected.length < 3) return selected;

  // Step 2: reorder so that clashing exercises are spread out. This is the
  // classic "rearrange so no two neighbours match" problem, and its greedy
  // solution is to always place whichever remaining exercise belongs to the
  // most crowded muscle, because those are the ones that run out of room.
  const left = [...selected];
  const ordered: CatalogExercise[] = [];

  /** How many exercises are still waiting for each muscle. */
  const remainingByMuscle = () => {
    const counts = new Map<MuscleGroup, number>();
    for (const exercise of left) {
      for (const muscle of primaryOf(exercise)) counts.set(muscle, (counts.get(muscle) ?? 0) + 1);
    }
    return counts;
  };

  while (left.length > 0) {
    const previous = ordered[ordered.length - 1] ?? after;
    const usable = previous ? left.filter((exercise) => !sharesPrimary(previous, exercise)) : left;
    // If everything clashes, the pool genuinely cannot avoid it here.
    const candidates = usable.length > 0 ? usable : left;

    const counts = remainingByMuscle();
    const crowding = (exercise: CatalogExercise) =>
      Math.max(0, ...primaryOf(exercise).map((muscle) => counts.get(muscle) ?? 0));

    let best = candidates[0]!;
    for (const exercise of candidates) {
      if (crowding(exercise) > crowding(best)) best = exercise;
    }

    ordered.push(best);
    left.splice(left.indexOf(best), 1);
  }

  // Step 3: if the greedy order still has neighbours sharing a muscle, search
  // properly for one that does not.
  //
  // Greedy is not enough here because an exercise leads with several muscles
  // at once, so placing it blocks every one of them. That makes this a
  // Hamiltonian path through a compatibility graph rather than the textbook
  // single-label rearrangement, and greedy can paint itself into a corner
  // that a different earlier choice would have avoided. The search is bounded
  // so a genuinely impossible pool cannot stall the build; when it runs out,
  // the greedy order stands.
  const hasClash = (list: CatalogExercise[]) =>
    list.some((exercise, index) => {
      const previous = index > 0 ? list[index - 1] : after;
      return previous !== undefined && sharesPrimary(previous, exercise);
    });

  if (!hasClash(ordered)) return ordered;

  const perfect = searchOrdering(selected, after);
  return perfect ?? ordered;
}

/** Budget for the ordering search, generous enough for a 26-item workout. */
const SEARCH_STEPS = 200_000;

/**
 * Backtracking search for an order where no two neighbours share a main
 * muscle. Returns undefined if none exists within the step budget, which for
 * these pool sizes means none exists at all.
 */
export function searchOrdering(
  exercises: CatalogExercise[],
  after: CatalogExercise | undefined,
): CatalogExercise[] | undefined {
  const size = exercises.length;
  if (size > 30) return undefined;

  // Precompute compatibility so the inner loop is a lookup, not a set scan.
  const compatible = exercises.map((a) => exercises.map((b) => !sharesPrimary(a, b)));
  const canStart = exercises.map((exercise) => after === undefined || !sharesPrimary(after, exercise));

  const order: number[] = [];
  const used = new Array<boolean>(size).fill(false);
  let steps = 0;

  const place = (depth: number): boolean => {
    if (depth === size) return true;
    if (++steps > SEARCH_STEPS) return false;

    const previous = depth === 0 ? -1 : order[depth - 1]!;
    for (let index = 0; index < size; index++) {
      if (used[index]) continue;
      if (depth === 0 ? !canStart[index] : !compatible[previous]![index]) continue;

      used[index] = true;
      order.push(index);
      if (place(depth + 1)) return true;
      order.pop();
      used[index] = false;
    }
    return false;
  };

  return place(0) ? order.map((index) => exercises[index]!) : undefined;
}

/** Turns a chosen exercise into one or two items, with timing for the level. */
function toItems(
  exercise: CatalogExercise,
  workout: CatalogWorkout,
  work: number,
  rest: number,
): WorkoutItem[] {
  const metrics = METRICS[exercise.number];
  const timed = exercise.type === 'time' || exercise.type === 'hold';

  const base: WorkoutItem = timed
    ? { exerciseNumber: exercise.number, seconds: work, rest }
    : {
        exerciseNumber: exercise.number,
        // Convert the level's work window into a rep count at 3 s per rep,
        // then keep it near the exercise's own default so it stays sensible.
        reps: clamp(Math.round(work / SECONDS_PER_REP), 4, (metrics?.reps ?? 12) + 6),
        rest,
      };

  // Stretch and cool-down workouts run without rest (PRD §8.2).
  if (workout.type === 'stretch' || workout.type === 'cooldown') base.rest = 0;

  if (!exercise.oneSided) return [base];
  return [
    { ...base, side: 'left' },
    { ...base, side: 'right' },
  ];
}

export function generateWorkout(
  workout: CatalogWorkout,
  exercises: CatalogExercise[],
): GeneratedWorkout {
  const random = rng(workout.number * 7919);
  const pools = poolsFor(workout, exercises);
  const sizes = blockSizes(workout.minutes);
  const rules = levelRules(workout.level);

  // HIIT keeps rest short whatever the level (PRD §8.2).
  const restWindow = workout.type === 'hiit' ? ([10, 15] as const) : rules.rest;
  const rest = Math.round((restWindow[0] + restWindow[1]) / 2);

  const stretchLike = workout.type === 'stretch' || workout.type === 'cooldown';
  // Stretch holds run 30 to 45 s rather than the level's work window.
  const workWindow = stretchLike ? ([30, 45] as const) : rules.work;
  let work = Math.round((workWindow[0] + workWindow[1]) / 2);

  const allowSameMuscleAdjacent = workout.type === 'strength';
  const target = workout.minutes * 60;

  // A stretch or warm-up workout is all one block; it has nothing to warm up
  // for and nothing to cool down from.
  const singleBlock = stretchLike || workout.type === 'warmup';
  const warmUp = singleBlock ? [] : chooseSequence(pools.warmUp, sizes.warmUp, rng(workout.number * 31), true);

  const [preferredMin, preferredMax] = singleBlock ? [sizes.main[0], sizes.main[1] + 6] : sizes.main;

  // Exercise choice does not depend on timing, so each block size is picked
  // once and only the timings are searched over it. Each block is ordered
  // after the one before it, so the joins between blocks do not clash either.
  const blocksByCount = new Map<number, { main: CatalogExercise[]; coolDown: CatalogExercise[] }>();
  const blocksFor = (count: number) => {
    const cached = blocksByCount.get(count);
    if (cached) return cached;

    const main = chooseSequence(
      pools.main,
      count,
      rng(workout.number * 7919),
      allowSameMuscleAdjacent,
      warmUp[warmUp.length - 1],
    );
    const coolDown = singleBlock
      ? []
      : chooseSequence(pools.coolDown, sizes.coolDown, rng(workout.number * 131), false, main[main.length - 1]);

    const blocks = { main, coolDown };
    blocksByCount.set(count, blocks);
    return blocks;
  };

  const build = (mainCount: number, workSeconds: number, restSeconds: number, blockSeconds: number): WorkoutItem[] => {
    const blocks = blocksFor(mainCount);
    return [
      ...warmUp.flatMap((exercise) => toItems(exercise, workout, blockSeconds, restSeconds)),
      ...blocks.main.flatMap((exercise) => toItems(exercise, workout, workSeconds, restSeconds)),
      ...blocks.coolDown.flatMap((exercise) => toItems(exercise, workout, blockSeconds, restSeconds)),
    ];
  };

  // Search work time, rest and warm-up/cool-down length for the combination
  // landing closest to the catalog's duration. Every one of these is a range
  // in the rules, so all three are legitimate knobs.
  let best: WorkoutItem[] = [];
  let bestGap = Infinity;
  let bestCount = preferredMin;

  const search = (from: number, to: number) => {
    for (let count = from; count <= to; count++) {
      for (let seconds = workWindow[0]; seconds <= workWindow[1]; seconds++) {
        for (let pause = restWindow[0]; pause <= restWindow[1]; pause++) {
          for (let block = 20; block <= 35; block += 5) {
            const items = build(count, seconds, pause, block);
            if (items.length === 0) continue;
            const gap = Math.abs(totalSeconds(items) - target);
            if (gap < bestGap) {
              bestGap = gap;
              best = items;
              work = seconds;
              bestCount = count;
            }
          }
        }
      }
    }
  };

  search(preferredMin, preferredMax);

  // The catalog's durations and PRD §8.2's block sizes disagree for some
  // workouts: a 10-minute one cannot be built from 2 + 8 + 2 blocks even at
  // the shortest allowed timings, and a 20-minute advanced one cannot be
  // filled by 12 to 18. The stated duration is what the user sees on the card,
  // and PRD §8.2 makes matching it within a minute a hard rule, so the block
  // size gives way rather than the duration.
  const flexed = bestGap > 60;
  if (flexed) search(3, 26);

  return {
    number: workout.number,
    slug: workout.slug,
    items: best,
    totalSeconds: totalSeconds(best),
    mainCount: bestCount,
    /** True when the block size had to leave the PRD §8.2 range. */
    blockSizeFlexed: bestCount < preferredMin || bestCount > preferredMax,
  };

}

export function generateWorkouts(
  workouts: CatalogWorkout[],
  exercises: CatalogExercise[],
): GeneratedWorkout[] {
  return workouts.map((workout) => generateWorkout(workout, exercises));
}
