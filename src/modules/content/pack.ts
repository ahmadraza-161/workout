import type { BodyFocus, Challenge, ContentPack, Exercise, Goal, Level, Workout } from './types';

// The content pack is read-only and small (< 1 MB), so it is loaded once and
// indexed in memory instead of being copied into SQLite (ADR-023).

export interface ContentIndex {
  pack: ContentPack;
  exercisesById: ReadonlyMap<string, Exercise>;
  workoutsById: ReadonlyMap<string, Workout>;
  challengesById: ReadonlyMap<string, Challenge>;
}

export function buildIndex(pack: ContentPack): ContentIndex {
  return {
    pack,
    exercisesById: new Map(pack.exercises.map((e) => [e.id, e])),
    workoutsById: new Map(pack.workouts.map((w) => [w.id, w])),
    challengesById: new Map(pack.challenges.map((c) => [c.id, c])),
  };
}

/** Returns every broken reference in the pack (empty array = valid). */
export function findBrokenReferences(index: ContentIndex): string[] {
  const problems: string[] = [];
  const { pack, exercisesById, workoutsById } = index;
  for (const exercise of pack.exercises) {
    for (const [field, id] of [
      ['quietSwapId', exercise.quietSwapId],
      ['easierId', exercise.easierId],
      ['harderId', exercise.harderId],
    ] as const) {
      if (id !== null && !exercisesById.has(id)) problems.push(`${exercise.id}.${field} → ${id}`);
    }
  }
  for (const workout of pack.workouts) {
    for (const item of workout.items) {
      if (!exercisesById.has(item.exerciseId)) problems.push(`${workout.id} → ${item.exerciseId}`);
    }
  }
  for (const challenge of pack.challenges) {
    for (const day of challenge.schedule) {
      if (day.workoutId && !workoutsById.has(day.workoutId)) {
        problems.push(`${challenge.id} day ${day.day} → ${day.workoutId}`);
      }
    }
  }
  for (const group of [...pack.categories, ...pack.collections]) {
    for (const id of group.workoutIds) {
      if (!workoutsById.has(id)) problems.push(`${group.id} → ${id}`);
    }
  }
  return problems;
}

export interface WorkoutFilter {
  bodyFocus?: BodyFocus;
  level?: Level;
  goal?: Goal;
  minMinutes?: number;
  maxMinutes?: number;
  quietOnly?: boolean;
}

export function filterWorkouts(index: ContentIndex, filter: WorkoutFilter = {}): Workout[] {
  return index.pack.workouts.filter(
    (w) =>
      (filter.bodyFocus === undefined || w.bodyFocus === filter.bodyFocus) &&
      (filter.level === undefined || w.level === filter.level) &&
      (filter.goal === undefined || w.goal === filter.goal) &&
      (filter.minMinutes === undefined || w.estimatedMinutes >= filter.minMinutes) &&
      (filter.maxMinutes === undefined || w.estimatedMinutes <= filter.maxMinutes) &&
      (!filter.quietOnly || w.quietSafe),
  );
}
