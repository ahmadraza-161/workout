import { EXERCISE_IMAGES } from './exerciseImages.generated';

/** Returns a bundled, offline image; missing IDs use the UI fallback. */
export function getExerciseImage(id: string): number | null {
  return EXERCISE_IMAGES[id] ?? null;
}
