import type { ContentIndex } from './pack';
import type { Challenge, Exercise, Workout } from './types';

export interface SearchResults {
  workouts: Workout[];
  exercises: Exercise[];
  challenges: Challenge[];
}

function matches(label: string, terms: string[]): boolean {
  const normalized = label.normalize('NFKD').toLocaleLowerCase().trim();
  return terms.every((term) => normalized.includes(term));
}

/** Searches the bundled catalog without network access or mutable state. */
export function searchContent(
  index: ContentIndex,
  query: string,
  labelFor: (key: string) => string,
): SearchResults {
  const terms = query.normalize('NFKD').toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return { workouts: [], exercises: [], challenges: [] };

  return {
    workouts: index.pack.workouts.filter((item) => matches(labelFor(item.titleKey), terms)),
    exercises: index.pack.exercises.filter((item) => matches(labelFor(item.nameKey), terms)),
    challenges: index.pack.challenges.filter((item) => matches(labelFor(item.titleKey), terms)),
  };
}

/** Finds related workouts by shared focus, goal, level and exercises. */
export function relatedWorkouts(index: ContentIndex, workoutId: string, limit = 4): Workout[] {
  const current = index.workoutsById.get(workoutId);
  if (!current || limit <= 0) return [];
  const exerciseIds = new Set(current.items.map((item) => item.exerciseId));

  return index.pack.workouts
    .filter((candidate) => candidate.id !== workoutId)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.bodyFocus === current.bodyFocus ? 4 : 0) +
        (candidate.goal === current.goal ? 2 : 0) +
        (candidate.level === current.level ? 1 : 0) +
        candidate.items.filter((item) => exerciseIds.has(item.exerciseId)).length,
    }))
    .sort((a, b) => b.score - a.score || a.candidate.id.localeCompare(b.candidate.id))
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
