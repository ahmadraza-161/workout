// Discover tiles, collections and achievement rules (T2.6, T2.7, ADR-044,
// ADR-046).
//
// The catalog names these in prose — a tile column on each workout, a list of
// workout names per collection, an unlock condition per badge — so this file
// turns that prose into ids and machine-readable rules, and reports anything
// that does not line up rather than dropping it.

import type { CatalogAchievement, CatalogWorkout } from './catalog.ts';
import { plain, slugify, tablesUnder } from './markdown.ts';

export interface Category {
  id: string;
  title: string;
  workoutNumbers: number[];
}

export interface Collection {
  id: string;
  title: string;
  goal: string;
  workoutNumbers: number[];
}

/**
 * The six Discover tiles, built from the tile column each workout carries in
 * §8 rather than a separate list, so a workout cannot end up on a tile page
 * that does not know about it.
 */
export function categoriesFrom(workouts: CatalogWorkout[]): Category[] {
  const byTile = new Map<string, number[]>();

  for (const workout of workouts) {
    for (const tile of workout.tiles) {
      const list = byTile.get(tile) ?? [];
      list.push(workout.number);
      byTile.set(tile, list);
    }
  }

  return [...byTile.entries()]
    .map(([title, workoutNumbers]) => ({ id: slugify(title), title, workoutNumbers }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

/** The four curated collections from §9.3. */
export function collectionsFrom(
  markdown: string,
  workouts: CatalogWorkout[],
): { collections: Collection[]; unmatched: string[] } {
  const bySlug = new Map(workouts.map((workout) => [workout.slug, workout.number]));
  const unmatched: string[] = [];

  const collections = tablesUnder(markdown, '9')
    .filter((row) => /^C\d+$/.test(plain(row.ID ?? '')))
    .map((row) => {
      const names = plain(row.Workouts ?? '')
        // The cell ends with a count in brackets, e.g. "(5)".
        .replace(/\(\d+\)\s*$/, '')
        .split('·')
        .map((name) => name.trim())
        .filter(Boolean);

      const workoutNumbers: number[] = [];
      for (const name of names) {
        const number = bySlug.get(slugify(name));
        if (number === undefined) unmatched.push(name);
        else workoutNumbers.push(number);
      }

      return {
        id: plain(row.ID ?? '').toLowerCase(),
        title: plain(row.Collection ?? ''),
        goal: plain(row.Goal ?? ''),
        workoutNumbers,
      };
    });

  return { collections, unmatched };
}

/**
 * What the evaluator has to measure for each badge (ADR-046).
 *
 * These are written out one by one rather than parsed from the catalog's
 * English. A regular expression that misreads a condition produces a badge
 * that never unlocks, which looks exactly like one the user has not earned
 * yet — so there would be nothing to notice.
 */
export type AchievementMetric =
  | 'workouts'
  | 'distinct_days'
  | 'streak'
  | 'minutes'
  | 'kcal'
  | 'challenge_days'
  | 'challenges_by_length'
  | 'best_hold'
  | 'best_reps'
  | 'distinct_exercises'
  | 'distinct_focuses'
  | 'custom_workouts_saved'
  | 'weekly_goals_in_a_row'
  | 'session_before_hour'
  | 'session_after_hour'
  | 'days_within_window';

export interface AchievementRule {
  id: string;
  metric: AchievementMetric;
  threshold: number;
  /** Narrows the metric, e.g. which exercises a rep record counts. */
  scope?: { exercises?: number[]; minDays?: number; windowDays?: number };
}

/** One entry per badge in CONTENT_MAP §11. */
export const ACHIEVEMENT_RULES: AchievementRule[] = [
  { id: 'first_workout', metric: 'workouts', threshold: 1 },
  { id: 'workouts_3', metric: 'workouts', threshold: 3 },
  // "3 different days within 7 days of the first workout".
  { id: 'first_week_done', metric: 'days_within_window', threshold: 3, scope: { windowDays: 7 } },
  { id: 'first_challenge', metric: 'challenge_days', threshold: 1 },

  { id: 'streak_3', metric: 'streak', threshold: 3 },
  { id: 'streak_7', metric: 'streak', threshold: 7 },
  { id: 'streak_14', metric: 'streak', threshold: 14 },
  { id: 'streak_30', metric: 'streak', threshold: 30 },
  { id: 'streak_60', metric: 'streak', threshold: 60 },

  { id: 'workouts_10', metric: 'workouts', threshold: 10 },
  { id: 'workouts_25', metric: 'workouts', threshold: 25 },
  { id: 'workouts_50', metric: 'workouts', threshold: 50 },
  { id: 'workouts_100', metric: 'workouts', threshold: 100 },
  { id: 'workouts_250', metric: 'workouts', threshold: 250 },
  { id: 'days_100', metric: 'distinct_days', threshold: 100 },

  { id: 'minutes_60', metric: 'minutes', threshold: 60 },
  { id: 'minutes_300', metric: 'minutes', threshold: 300 },
  { id: 'minutes_600', metric: 'minutes', threshold: 600 },
  { id: 'minutes_1200', metric: 'minutes', threshold: 1200 },

  // Best single set across the rep-based push-up variants.
  {
    id: 'pushups_20',
    metric: 'best_reps',
    threshold: 20,
    scope: { exercises: [30, 31, 32, 33, 34, 35, 36, 37, 39, 41, 42] },
  },
  { id: 'squats_50', metric: 'best_reps', threshold: 50, scope: { exercises: [64, 65] } },
  { id: 'plank_60', metric: 'best_hold', threshold: 60, scope: { exercises: [20] } },
  { id: 'plank_120', metric: 'best_hold', threshold: 120, scope: { exercises: [20] } },
  { id: 'wallsit_30', metric: 'best_hold', threshold: 30, scope: { exercises: [67] } },
  { id: 'wallsit_90', metric: 'best_hold', threshold: 90, scope: { exercises: [67] } },

  { id: 'tried_25', metric: 'distinct_exercises', threshold: 25 },
  { id: 'tried_50', metric: 'distinct_exercises', threshold: 50 },
  { id: 'every_focus', metric: 'distinct_focuses', threshold: 8 },
  { id: 'custom_built', metric: 'custom_workouts_saved', threshold: 1 },

  // Finishing a shorter or a longer challenge (ADR-046).
  { id: 'challenge_14', metric: 'challenges_by_length', threshold: 1, scope: { minDays: 14 } },
  { id: 'challenge_28', metric: 'challenges_by_length', threshold: 1, scope: { minDays: 28 } },
  { id: 'goal_met', metric: 'weekly_goals_in_a_row', threshold: 1 },
  // 'Reach the weekly goal 4 weeks in a row', not four weeks in total.
  { id: 'goal_4_weeks', metric: 'weekly_goals_in_a_row', threshold: 4 },
  { id: 'early_bird', metric: 'session_before_hour', threshold: 8 },
  { id: 'night_owl', metric: 'session_after_hour', threshold: 21 },
];

/** Pairs the rules with the catalog, so neither can drift from the other. */
export function achievementRules(achievements: CatalogAchievement[]): {
  rules: AchievementRule[];
  missing: string[];
  extra: string[];
} {
  const byId = new Map(ACHIEVEMENT_RULES.map((rule) => [rule.id, rule]));
  const catalogIds = new Set(achievements.map((achievement) => achievement.id));

  return {
    rules: achievements
      .map((achievement) => byId.get(achievement.id))
      .filter((rule): rule is AchievementRule => rule !== undefined),
    missing: achievements.filter((achievement) => !byId.has(achievement.id)).map((achievement) => achievement.id),
    extra: ACHIEVEMENT_RULES.filter((rule) => !catalogIds.has(rule.id)).map((rule) => rule.id),
  };
}
