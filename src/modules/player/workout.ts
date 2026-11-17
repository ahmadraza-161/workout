import { getCustomPlayerWorkout, getCustomWorkout } from '@/modules/builder';
import { getExercise, getWorkout, type Workout } from '@/modules/content';
import { t } from '@/modules/core/i18n';

export function getPlayableWorkout(id: string): Workout | undefined {
  return getWorkout(id) ?? getCustomPlayerWorkout(id, getExercise);
}

export function playableWorkoutTitle(workout: Workout): string {
  return getCustomWorkout(workout.id)?.title ?? t(workout.titleKey);
}
