import rawPack from '../../../assets/data/content-pack.json';
import { buildIndex, filterWorkouts, type ContentIndex, type WorkoutFilter } from './pack';
import type { Challenge, ContentPack, Exercise, Workout } from './types';

// Loaded once at start-up. The JSON is generated and validated at build time
// (tools/content, Phase 2), so the cast is safe.
const content: ContentIndex = buildIndex(rawPack as ContentPack);

export function getContentPack(): ContentPack {
  return content.pack;
}

export function getExercise(id: string): Exercise | undefined {
  return content.exercisesById.get(id);
}

export function getWorkout(id: string): Workout | undefined {
  return content.workoutsById.get(id);
}

export function getChallenge(id: string): Challenge | undefined {
  return content.challengesById.get(id);
}

export function listWorkouts(filter?: WorkoutFilter): Workout[] {
  return filterWorkouts(content, filter);
}

export { buildIndex, findBrokenReferences, filterWorkouts } from './pack';
export type { ContentIndex, WorkoutFilter } from './pack';
export type * from './types';
