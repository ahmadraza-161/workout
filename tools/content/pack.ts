// Turns the generated catalog into the content pack the app loads, and the
// English strings that go with it (T2.20).
//
// This is the bridge between the generators and the app. Everything above it
// works in catalog numbers; everything below it works in ids and i18n keys,
// because that is what the screens and the database use.

import type { Catalog, CatalogExercise, CatalogWorkout } from './catalog.ts';
import { METRICS } from './metrics.ts';
import type { Category, Collection, AchievementRule } from './placements.ts';
import type { Resolved } from './resolve.ts';
import type { GeneratedChallenge } from './challenges.ts';
import type { GeneratedWorkout } from './workouts.ts';
import { exerciseCopyFor, exerciseCopySlugs } from './copy.ts';
import {
  challengeCopySlugs,
  challengeDescriptionFor,
  workoutCopySlugs,
  workoutIntroFor,
} from './programCopy.ts';

/** Ids are the slug with a short prefix, so they read clearly in a stack trace. */
export const exerciseId = (exercise: { slug: string }) => `ex_${exercise.slug.replace(/-/g, '_')}`;
export const workoutId = (workout: { slug: string }) => `wo_${workout.slug.replace(/-/g, '_')}`;
export const challengeId = (challenge: { slug: string }) => `ch_${challenge.slug.replace(/-/g, '_')}`;

const keyOf = (slug: string) => slug.replace(/-/g, '_');

/** The twelve gradients, assigned by body focus and type (DESIGN §2.5). */
const GRADIENT_BY_FOCUS: Record<string, string> = {
  abs: 'blue',
  chest: 'slate',
  arm: 'violet',
  shoulder: 'indigo',
  back: 'teal',
  leg: 'cyan',
  butt: 'purple',
  full_body: 'orange',
};

const GRADIENT_BY_TYPE: Record<string, string> = {
  hiit: 'red',
  stretch: 'mint',
  cooldown: 'mint',
  warmup: 'green',
};

function gradientFor(workout: CatalogWorkout): string {
  return GRADIENT_BY_TYPE[workout.type] ?? GRADIENT_BY_FOCUS[workout.bodyFocus] ?? 'blue';
}

/** Focus chips in the exercise guide, taken from the primary muscles. */
function focusAreaKeys(exercise: CatalogExercise): string[] {
  return (METRICS[exercise.number]?.primary ?? []).map((muscle) => `focus.${muscle}`);
}

export interface PackInputs {
  catalog: Catalog;
  resolved: Resolved;
  workouts: GeneratedWorkout[];
  challenges: GeneratedChallenge[];
  categories: Category[];
  collections: Collection[];
  badgeRules: AchievementRule[];
  /** Bumped whenever the generated content changes shape. */
  contentVersion: number;
}

export function buildPack(inputs: PackInputs) {
  const { catalog, resolved, workouts, challenges, categories, collections, badgeRules } = inputs;

  const exerciseById = new Map(catalog.exercises.map((exercise) => [exercise.number, exercise]));
  const workoutById = new Map(catalog.workouts.map((workout) => [workout.number, workout]));

  const idFor = (number: number) => {
    const exercise = exerciseById.get(number);
    return exercise ? exerciseId(exercise) : null;
  };

  const exercises = catalog.exercises.map((exercise) => {
    const metrics = METRICS[exercise.number]!;
    const key = keyOf(exercise.slug);

    return {
      id: exerciseId(exercise),
      slug: exercise.slug,
      nameKey: `exercise.${key}.name`,
      type: exercise.type,
      defaultSeconds: metrics.seconds ?? null,
      defaultReps: metrics.reps ?? null,
      oneSided: exercise.oneSided,
      difficulty: exercise.level,
      quietSafe: exercise.quietSafe,
      quietSwapId: idFor(resolved.quietSwap.get(exercise.number) ?? -1),
      equipment: exercise.equipment,
      props: exercise.props,
      view: exercise.view,
      focusAreaKeys: focusAreaKeys(exercise),
      primaryMuscles: metrics.primary,
      secondaryMuscles: metrics.secondary,
      met: metrics.met,
      instructionsKey: `exercise.${key}.instructions`,
      mistakesKey: `exercise.${key}.mistakes`,
      breathingKey: `exercise.${key}.breathing`,
      easierId: idFor(resolved.easier.get(exercise.number) ?? -1),
      harderId: idFor(resolved.harder.get(exercise.number) ?? -1),
    };
  });

  const packWorkouts = catalog.workouts.map((workout) => {
    const generated = workouts.find((entry) => entry.number === workout.number)!;
    const key = keyOf(workout.slug);
    const items = generated.items.map((item) => ({
      exerciseId: idFor(item.exerciseNumber)!,
      ...(item.seconds === undefined ? {} : { seconds: item.seconds }),
      ...(item.reps === undefined ? {} : { reps: item.reps }),
      rest: item.rest,
      ...(item.side === undefined ? {} : { side: item.side }),
    }));

    return {
      id: workoutId(workout),
      titleKey: `workout.${key}.title`,
      introKey: `workout.${key}.intro`,
      bodyFocus: workout.bodyFocus,
      goal: workout.goal,
      type: workout.type,
      level: workout.level,
      estimatedMinutes: Math.round(generated.totalSeconds / 60),
      // A workout is quiet-safe when nothing in it jumps, whatever the
      // catalog's own column says.
      quietSafe: items.every((item) => {
        const exercise = catalog.exercises.find((entry) => exerciseId(entry) === item.exerciseId);
        return exercise?.quietSafe ?? false;
      }),
      gradient: gradientFor(workout),
      items,
    };
  });

  const packChallenges = catalog.challenges.map((challenge) => {
    const generated = challenges.find((entry) => entry.number === challenge.number)!;
    const key = keyOf(challenge.slug);

    return {
      id: challengeId(challenge),
      titleKey: `challenge.${key}.title`,
      descKey: `challenge.${key}.desc`,
      days: challenge.days,
      // Challenges climb through the levels, so the card shows where they end.
      level: challenge.days <= 14 ? 2 : 3,
      bodyFocus: packWorkouts.find((workout) => workout.id === idForWorkout(generated, workoutById))?.bodyFocus ?? 'full_body',
      goal: challenge.goal,
      dailyMinutes: challenge.dailyTime,
      gradient: challenge.gradient,
      schedule: generated.days.map((day) => ({
        day: day.day,
        ...(day.rest ? { rest: true } : {}),
        ...(day.workoutNumber === undefined
          ? {}
          : { workoutId: workoutId(workoutById.get(day.workoutNumber)!) }),
        ...(day.exerciseNumber === undefined ? {} : { exerciseId: idFor(day.exerciseNumber)! }),
        ...(day.seconds === undefined ? {} : { seconds: day.seconds }),
        ...(day.reps === undefined ? {} : { reps: day.reps }),
        ...(day.sets === undefined ? {} : { sets: day.sets }),
      })),
    };
  });

  const packCategories = categories.map((category) => ({
    id: category.id,
    titleKey: `category.${keyOf(category.id)}.title`,
    descKey: `category.${keyOf(category.id)}.desc`,
    icon: category.id,
    workoutIds: category.workoutNumbers.map((number) => workoutId(workoutById.get(number)!)),
  }));

  const packCollections = collections.map((collection) => ({
    id: collection.id,
    titleKey: `collection.${collection.id}.title`,
    goal: collection.goal,
    workoutIds: collection.workoutNumbers.map((number) => workoutId(workoutById.get(number)!)),
  }));

  const packAchievements = catalog.achievements.map((achievement) => {
    const rule = badgeRules.find((entry) => entry.id === achievement.id)!;
    return {
      id: achievement.id,
      titleKey: `achievement.${achievement.id}.title`,
      group: achievement.group.replace(/\s*\(.*\)$/, '').trim(),
      metric: rule.metric,
      threshold: rule.threshold,
      ...(rule.scope === undefined ? {} : { scope: rule.scope }),
    };
  });

  return {
    contentVersion: inputs.contentVersion,
    exercises,
    workouts: packWorkouts,
    challenges: packChallenges,
    categories: packCategories,
    collections: packCollections,
    achievements: packAchievements,
  };
}

/** First scheduled workout of a challenge, used to infer its body focus. */
function idForWorkout(challenge: GeneratedChallenge, byNumber: Map<number, CatalogWorkout>): string | null {
  const first = challenge.days.find((day) => day.workoutNumber !== undefined);
  const workout = first?.workoutNumber === undefined ? undefined : byNumber.get(first.workoutNumber);
  return workout ? workoutId(workout) : null;
}

/**
 * The English strings the pack refers to.
 *
 * Names come from the catalog; original exercise instructions and cues come
 * from the authored copy table (T2.3).
 */
export function buildStrings(inputs: PackInputs) {
  const { catalog } = inputs;

  const exercise: Record<string, unknown> = {};
  const catalogSlugs = new Set(catalog.exercises.map((entry) => keyOf(entry.slug)));
  const extraCopy = exerciseCopySlugs().filter((slug) => !catalogSlugs.has(slug));
  if (extraCopy.length > 0) throw new Error(`Exercise guide copy has unknown slugs: ${extraCopy.join(', ')}`);
  for (const entry of catalog.exercises) {
    exercise[keyOf(entry.slug)] = {
      name: entry.name,
      ...exerciseCopyFor(keyOf(entry.slug)),
    };
  }

  const workout: Record<string, unknown> = {};
  const workoutSlugs = new Set(catalog.workouts.map((entry) => keyOf(entry.slug)));
  const extraWorkouts = workoutCopySlugs().filter((slug) => !workoutSlugs.has(slug));
  if (extraWorkouts.length > 0) throw new Error(`Workout intros have unknown slugs: ${extraWorkouts.join(', ')}`);
  for (const entry of catalog.workouts) {
    workout[keyOf(entry.slug)] = { title: entry.name, intro: workoutIntroFor(keyOf(entry.slug)) };
  }

  const challenge: Record<string, unknown> = {};
  const challengeSlugs = new Set(catalog.challenges.map((entry) => keyOf(entry.slug)));
  const extraChallenges = challengeCopySlugs().filter((slug) => !challengeSlugs.has(slug));
  if (extraChallenges.length > 0) throw new Error(`Challenge descriptions have unknown slugs: ${extraChallenges.join(', ')}`);
  for (const entry of catalog.challenges) {
    challenge[keyOf(entry.slug)] = {
      title: entry.name,
      desc: challengeDescriptionFor(keyOf(entry.slug)),
    };
  }

  const achievement: Record<string, unknown> = {};
  for (const entry of catalog.achievements) {
    achievement[entry.id] = { title: entry.badge };
  }

  const category: Record<string, unknown> = {};
  for (const entry of inputs.categories) {
    category[keyOf(entry.id)] = { title: entry.title, desc: CATEGORY_DESCRIPTIONS[entry.id] ?? '' };
  }

  const collection: Record<string, unknown> = {};
  for (const entry of inputs.collections) {
    collection[entry.id] = { title: entry.title };
  }

  return { exercise, workout, challenge, achievement, category, collection };
}
import { CATEGORY_DESCRIPTIONS } from './categoryDescriptions.ts';
