import type { Exercise, Workout } from '@/modules/content';

/** Replaces only jumping items that have an authored quiet alternative. */
export function resolveQuietWorkout(
  workout: Workout,
  quietMode: boolean,
  exerciseFor: (id: string) => Exercise | undefined,
): Workout {
  if (!quietMode) return workout;
  return {
    ...workout,
    items: workout.items.map((item) => {
      const exercise = exerciseFor(item.exerciseId);
      return exercise && !exercise.quietSafe && exercise.quietSwapId
        ? { ...item, exerciseId: exercise.quietSwapId }
        : item;
    }),
  };
}

export function restoreWorkoutPlan(workout: Workout, exerciseIds: readonly string[]): Workout {
  return {
    ...workout,
    items: workout.items.map((item, index) => ({ ...item, exerciseId: exerciseIds[index] ?? item.exerciseId })),
  };
}
