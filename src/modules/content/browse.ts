import type { BodyFocus, ContentPack, Goal, Level, Workout } from './types';

export const FOCUS_OPTIONS: BodyFocus[] = ['abs', 'arm', 'chest', 'shoulder', 'back', 'leg', 'butt', 'full_body'];
export const GOAL_OPTIONS: Goal[] = ['build_muscle', 'burn_fat', 'keep_fit'];
export const DURATION_OPTIONS = ['short', 'medium', 'long'] as const;
export const QUICK_IDS = ['wo_4_minute_wake_up', 'wo_5_minute_morning_boost', 'wo_6_minute_tabata', 'wo_7_minute_full_body', 'wo_10_minute_abs'];
export const STRETCH_IDS = ['wo_before_workout_warm_up', 'wo_morning_warm_up', 'wo_full_body_stretching', 'wo_upper_body_stretching',
  'wo_lower_body_stretching', 'wo_back_stretching', 'wo_neck_shoulder_tension_relief', 'wo_lower_back_relief',
  'wo_knee_friendly_mobility', 'wo_sleepy_time_stretching', 'wo_posture_reset', 'wo_hip_mobility'];
const RECENT_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export interface BrowseContext {
  goal: Goal;
  level: Level;
  recent: { workoutId: string; endedAt: number }[];
  disliked: string[];
}
export const DEFAULT_BROWSE_CONTEXT: BrowseContext = { goal: 'keep_fit', level: 1, recent: [], disliked: [] };
export interface BrowseFilter {
  focus?: string;
  duration?: string;
  goal?: string;
  group?: string;
  id?: string;
}

export function browseWorkouts(pack: ContentPack, filter: BrowseFilter = {}): Workout[] {
  const equipmentExercises = new Set(pack.exercises.filter((exercise) => exercise.equipment !== 'none').map((exercise) => exercise.id));
  const group = filter.group === 'collection' ? pack.collections.find((item) => item.id === filter.id)
    : filter.group === 'category' ? pack.categories.find((item) => item.id === filter.id) : undefined;
  // Unknown group IDs must show an empty state rather than an unrelated catalog.
  if (['collection', 'category'].includes(filter.group ?? '') && !group) return [];
  return pack.workouts.filter((workout) =>
    (!filter.focus || workout.bodyFocus === filter.focus) &&
    (!filter.goal || workout.goal === filter.goal) &&
    (!group || group.workoutIds.includes(workout.id)) &&
    (filter.group !== 'quick' || QUICK_IDS.includes(workout.id)) &&
    (filter.group !== 'stretch' || STRETCH_IDS.includes(workout.id)) &&
    (filter.group !== 'warmup' || workout.type === 'warmup') &&
    (filter.group !== 'beginners' || workout.level === 1) &&
    (filter.group !== 'equipment' || workout.items.some((item) => equipmentExercises.has(item.exerciseId))) &&
    (filter.duration !== 'short' || workout.estimatedMinutes < 7) &&
    (filter.duration !== 'medium' || (workout.estimatedMinutes >= 7 && workout.estimatedMinutes <= 15)) &&
    (filter.duration !== 'long' || workout.estimatedMinutes > 15));
}

/** Ranks local catalog workouts without changing the pack or dropping disliked exercises. */
export function rankWorkouts(workouts: Workout[], context: BrowseContext, now: number): Workout[] {
  const recentlyDone = new Set(context.recent.filter((entry) => entry.endedAt >= now - RECENT_WINDOW_MS).map((entry) => entry.workoutId));
  const disliked = new Set(context.disliked);
  const score = (workout: Workout): number =>
    (workout.goal === context.goal ? 6 : 0) + (workout.level === context.level ? 4 : 0) -
    Math.abs(workout.level - context.level) -
    (workout.items.some((item) => disliked.has(item.exerciseId)) ? 20 : 0);
  return workouts.filter((item) => !recentlyDone.has(item.id)).sort((a, b) => score(b) - score(a) || a.estimatedMinutes - b.estimatedMinutes || a.id.localeCompare(b.id));
}

export function featuredWorkout(pack: ContentPack, context: BrowseContext, now: number): Workout | undefined {
  const noEquipment = new Set(pack.exercises.filter((item) => item.equipment === 'none').map((item) => item.id));
  const suitable = pack.workouts.filter((item) => item.level <= context.level &&
    (item.type === 'strength' || item.type === 'hiit') &&
    item.items.every((exercise) => noEquipment.has(exercise.exerciseId)));
  if (!context.recent.length && context.level === 1) {
    const beginner = suitable.find((item) => item.id === 'wo_daily_move');
    if (beginner) return beginner;
  }
  const ranked = rankWorkouts(suitable, context, now);
  const candidates = ranked.filter((item) => item.goal === context.goal && item.level === context.level);
  const pool = candidates.length ? candidates : ranked;
  if (!pool.length) return undefined;
  return pool[Math.floor(now / WEEK_MS) % pool.length];
}

export function recentWorkouts(pack: ContentPack, context: BrowseContext): Workout[] {
  const ids = [...new Set([...context.recent].sort((a, b) => b.endedAt - a.endedAt).map((item) => item.workoutId))];
  return ids.flatMap((id) => { const workout = pack.workouts.find((item) => item.id === id); return workout ? [workout] : []; });
}
