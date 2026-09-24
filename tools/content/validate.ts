// Fails the build on anything wrong with the catalog (T2.8).
//
// This runs before any asset is generated, because a bad reference here would
// otherwise surface as a missing animation or a crash in the player, long
// after the cause.

import type { Catalog } from './catalog.ts';
import { METRICS, MUSCLE_GROUPS, type MuscleGroup } from './metrics.ts';
import type { Resolved } from './resolve.ts';

/** Counts the catalog promises and the app ships exactly (PRD §8.1). */
export const EXPECTED = {
  exercises: 119,
  workouts: 60,
  challenges: 12,
  achievements: 35,
} as const;

/**
 * Copy rules from PRD §9. These are checked against names here and against
 * generated copy once it exists, so a banned claim cannot reach the store.
 */
const BANNED = [
  // Spot reduction
  'spot reduction',
  'melt away',
  'burn belly fat',
  'target belly fat',
  // Height claims
  'height increase',
  'grow taller',
  'taller',
  // Shaming
  'no excuses',
  'falling behind',
  'lazy',
  'guilt',
  // Body shaming and crude naming
  'man boobs',
  'shred',
  // Diet claims, which are out of scope entirely
  'diet',
  'detox',
  'fasting',
];

export class ValidationError extends Error {}

export function validate(catalog: Catalog, resolved: Resolved): string[] {
  const problems: string[] = [];
  const fail = (message: string) => problems.push(message);

  // Counts
  for (const [key, expected] of Object.entries(EXPECTED) as [keyof typeof EXPECTED, number][]) {
    const actual = catalog[key].length;
    if (actual !== expected) fail(`${key}: found ${actual}, catalog promises ${expected}`);
  }

  // Numbering: 1..n with no gaps or repeats, since everything joins on it.
  const checkNumbering = (name: string, items: { number: number }[]) => {
    const seen = new Set<number>();
    for (const item of items) {
      if (seen.has(item.number)) fail(`${name}: duplicate number ${item.number}`);
      seen.add(item.number);
    }
    for (let i = 1; i <= items.length; i++) {
      if (!seen.has(i)) fail(`${name}: missing number ${i}`);
    }
  };
  checkNumbering('exercises', catalog.exercises);
  checkNumbering('workouts', catalog.workouts);
  checkNumbering('challenges', catalog.challenges);
  checkNumbering('achievements', catalog.achievements);

  // Slugs become ids and file names, so they must be unique and usable.
  const checkSlugs = (name: string, items: { slug: string; name: string }[]) => {
    const seen = new Map<string, string>();
    for (const item of items) {
      if (!item.slug) fail(`${name}: "${item.name}" has an empty slug`);
      const clash = seen.get(item.slug);
      if (clash) fail(`${name}: "${item.name}" and "${clash}" share the slug "${item.slug}"`);
      seen.set(item.slug, item.name);
    }
  };
  checkSlugs('exercises', catalog.exercises);
  checkSlugs('workouts', catalog.workouts);
  checkSlugs('challenges', catalog.challenges);

  // Achievement ids are hand-written in the catalog, so check them too.
  const achievementIds = new Set<string>();
  for (const achievement of catalog.achievements) {
    if (!/^[a-z0-9_]+$/.test(achievement.id)) {
      fail(`achievements: "${achievement.id}" is not a snake_case id`);
    }
    if (achievementIds.has(achievement.id)) fail(`achievements: duplicate id "${achievement.id}"`);
    achievementIds.add(achievement.id);
  }

  // Cross-references must point at exercises that exist.
  const numbers = new Set(catalog.exercises.map((exercise) => exercise.number));
  const checkRefs = (name: string, map: Map<number, number>) => {
    for (const [from, to] of map) {
      if (!numbers.has(from)) fail(`${name}: source #${from} does not exist`);
      if (!numbers.has(to)) fail(`${name}: #${from} points at #${to}, which does not exist`);
      if (from === to) fail(`${name}: #${from} points at itself`);
    }
  };
  checkRefs('easier', resolved.easier);
  checkRefs('harder', resolved.harder);
  checkRefs('quiet swap', resolved.quietSwap);

  // A quiet swap has to actually be quiet, or Quiet Mode achieves nothing.
  const byNumber = new Map(catalog.exercises.map((exercise) => [exercise.number, exercise]));
  for (const [from, to] of resolved.quietSwap) {
    const source = byNumber.get(from);
    const target = byNumber.get(to);
    if (source?.quietSafe) fail(`quiet swap: #${from} ${source.name} is already quiet-safe`);
    if (target && !target.quietSafe) fail(`quiet swap: #${from} swaps to #${to} ${target.name}, which is not quiet-safe`);
  }

  // Every exercise that is not quiet-safe needs somewhere to go in Quiet Mode.
  for (const exercise of catalog.exercises) {
    if (!exercise.quietSafe && !resolved.quietSwap.has(exercise.number)) {
      fail(`quiet swap: #${exercise.number} ${exercise.name} is not quiet-safe and has no swap`);
    }
  }

  // Durations have to be plausible, since they drive the workout generator.
  for (const workout of catalog.workouts) {
    if (!Number.isFinite(workout.minutes) || workout.minutes < 3 || workout.minutes > 60) {
      fail(`workouts: "${workout.name}" has an implausible duration of ${workout.minutes} min`);
    }
  }
  for (const challenge of catalog.challenges) {
    if (![14, 21, 28, 30].includes(challenge.days)) {
      fail(`challenges: "${challenge.name}" runs ${challenge.days} days, which is not 14, 21, 28 or 30`);
    }
  }

  // Per-exercise metrics (T2.2). These are authored by hand against the
  // catalog's numbering, so the easiest mistake is simply missing a row.
  const validMuscles = new Set<string>(MUSCLE_GROUPS);
  for (const exercise of catalog.exercises) {
    const metrics = METRICS[exercise.number];
    if (!metrics) {
      fail(`metrics: #${exercise.number} ${exercise.name} has none`);
      continue;
    }

    const where = `metrics: #${exercise.number} ${exercise.name}`;
    if (metrics.primary.length === 0) fail(`${where} has no primary muscle`);

    for (const muscle of [...metrics.primary, ...metrics.secondary]) {
      if (!validMuscles.has(muscle)) fail(`${where} uses unknown muscle "${muscle}"`);
    }

    // A muscle listed as both primary and secondary would be drawn twice on
    // the map, in two different strengths.
    const secondary = new Set<MuscleGroup>(metrics.secondary);
    for (const muscle of metrics.primary) {
      if (secondary.has(muscle)) fail(`${where} lists "${muscle}" as both primary and secondary`);
    }

    // The Compendium's bands run from gentle stretching to vigorous work.
    // Anything outside this range is a typo, and kcal estimates scale on it.
    if (!(metrics.met >= 2 && metrics.met <= 10)) {
      fail(`${where} has an implausible MET of ${metrics.met}`);
    }

    // Timed work needs a duration; rep work needs a count. Getting this wrong
    // would leave the player with nothing to count down.
    const timed = exercise.type === 'time' || exercise.type === 'hold';
    if (timed && !metrics.seconds) fail(`${where} is ${exercise.type} but has no seconds`);
    if (!timed && !metrics.reps) fail(`${where} is reps but has no rep count`);
    if (timed && metrics.reps) fail(`${where} is ${exercise.type} but also sets reps`);
    if (!timed && metrics.seconds) fail(`${where} is reps but also sets seconds`);

    if (metrics.seconds !== undefined && (metrics.seconds < 10 || metrics.seconds > 120)) {
      fail(`${where} has an implausible default of ${metrics.seconds}s`);
    }
    if (metrics.reps !== undefined && (metrics.reps < 4 || metrics.reps > 40)) {
      fail(`${where} has an implausible default of ${metrics.reps} reps`);
    }
  }

  // Content rules (PRD §9).
  const names = [
    ...catalog.exercises.map((item) => ['exercise', item.name] as const),
    ...catalog.workouts.map((item) => ['workout', item.name] as const),
    ...catalog.challenges.map((item) => ['challenge', item.name] as const),
    ...catalog.achievements.map((item) => ['achievement', item.badge] as const),
  ];
  for (const [kind, name] of names) {
    const lower = name.toLowerCase();
    for (const banned of BANNED) {
      if (lower.includes(banned)) fail(`${kind} "${name}" uses banned wording "${banned}" (PRD §9)`);
    }
  }

  return problems;
}

/** Throws with every problem listed, rather than only the first. */
export function assertValid(catalog: Catalog, resolved: Resolved): void {
  const problems = validate(catalog, resolved);
  if (problems.length > 0) {
    throw new ValidationError(`Catalog validation failed:\n  - ${problems.join('\n  - ')}`);
  }
}
