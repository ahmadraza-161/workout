import rawPack from '../../../assets/data/content-pack.json';
import { buildIndex, filterWorkouts, type ContentIndex, type WorkoutFilter } from './pack';
import { relatedWorkouts, searchContent, type SearchResults } from './query';
import type { Challenge, ContentPack, Exercise, Workout } from './types';

// The validated JSON is read once; content never enters the user database.
const content: ContentIndex = buildIndex(rawPack as ContentPack);

export function getContentPack(): ContentPack {
  return content.pack;
}

export function getExercise(id: string): Exercise | undefined {
  return content.exercisesById.get(id);
}

export function getWorkout(id: string): Workout | undefined {
  const authored = content.workoutsById.get(id);
  if (authored) return authored;
  for (const challenge of content.pack.challenges) {
    const prefix = `cday_${challenge.id}_`;
    if (!id.startsWith(prefix)) continue;
    const day = Number(id.slice(prefix.length));
    if (Number.isInteger(day)) {
      const resolved = getChallengeDayWorkout(challenge.id, day);
      return resolved?.id === id ? resolved : undefined;
    }
  }
  return undefined;
}

const DEFAULT_SET_REST_SECONDS = 20;
const REP_ESTIMATE_SECONDS = 3;

/** Resolves regular challenge days and builds single-exercise ramp days on demand. */
export function getChallengeDayWorkout(challengeId: string, dayNumber: number): Workout | undefined {
  const challenge = content.challengesById.get(challengeId);
  const day = challenge?.schedule.find((entry) => entry.day === dayNumber);
  if (!challenge || !day || day.rest) return undefined;
  if (day.workoutId) return content.workoutsById.get(day.workoutId);
  if (!day.exerciseId || !content.exercisesById.has(day.exerciseId)) return undefined;
  if (!Number.isInteger(day.sets) || !day.sets || day.sets < 1) return undefined;
  if (!day.seconds && !day.reps) return undefined;
  const exercise = content.exercisesById.get(day.exerciseId)!;
  const items = Array.from({ length: day.sets }, (_, index) => ({
    exerciseId: exercise.id,
    ...(day.seconds ? { seconds: day.seconds } : { reps: day.reps }),
    rest: index === day.sets! - 1 ? 0 : DEFAULT_SET_REST_SECONDS,
  }));
  const activeSeconds = day.sets * (day.seconds ?? (day.reps ?? 0) * REP_ESTIMATE_SECONDS);
  const estimatedMinutes = Math.max(1, Math.ceil((activeSeconds + (day.sets - 1) * DEFAULT_SET_REST_SECONDS) / 60));
  return {
    id: `cday_${challenge.id}_${dayNumber}`,
    titleKey: challenge.titleKey,
    introKey: challenge.descKey,
    bodyFocus: challenge.bodyFocus,
    goal: challenge.goal,
    type: 'strength',
    level: challenge.level,
    estimatedMinutes,
    quietSafe: exercise.quietSafe,
    gradient: challenge.gradient,
    items,
  };
}

export function getChallenge(id: string): Challenge | undefined {
  return content.challengesById.get(id);
}

export function listWorkouts(filter?: WorkoutFilter): Workout[] {
  return filterWorkouts(content, filter);
}

export function listExercises(): Exercise[] {
  return content.pack.exercises;
}

export function listChallenges(): Challenge[] {
  return content.pack.challenges;
}

export function searchCatalog(query: string, labelFor: (key: string) => string): SearchResults {
  return searchContent(content, query, labelFor);
}

export function getRelatedWorkouts(workoutId: string, limit?: number): Workout[] {
  return relatedWorkouts(content, workoutId, limit);
}
