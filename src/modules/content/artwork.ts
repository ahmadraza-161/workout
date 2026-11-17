import { getContentPack, getExercise } from './repository';
import type { BodyFocus, Workout } from './types';

const FOCUS_MUSCLES: Record<BodyFocus, string[]> = {
  abs: ['abs', 'obliques'], arm: ['biceps', 'triceps', 'forearms'],
  chest: ['chest'], shoulder: ['deltoids', 'rear_deltoids'],
  back: ['upper_back', 'lats', 'erector_spinae', 'rear_deltoids'],
  leg: ['quads', 'hamstrings', 'calves', 'adductors'], butt: ['glutes'],
  full_body: ['chest', 'upper_back', 'abs', 'quads', 'glutes'],
};

function candidates(workout: Workout): { id: string; score: number }[] {
  const focus = FOCUS_MUSCLES[workout.bodyFocus];
  return [...new Set(workout.items.map((item) => item.exerciseId))].flatMap((id) => {
    const exercise = getExercise(id);
    return exercise ? [{ id, score: exercise.primaryMuscles.filter((muscle) => focus.includes(muscle)).length * 3
      + exercise.secondaryMuscles.filter((muscle) => focus.includes(muscle)).length }] : [];
  }).sort((a, b) => b.score - a.score);
}

/** Reserve distinct actual poses across the catalog, retaining muscle relevance. */
function catalogCovers(): Map<string, string> {
  const workouts = getContentPack().workouts;
  const all = new Map(workouts.map((workout) => [workout.id, candidates(workout)]));
  const choices = new Map(workouts.map((workout) => {
    const ranked = all.get(workout.id)!;
    const primary = ranked.filter((candidate) => candidate.score >= 3);
    return [workout.id, primary.length && workout.bodyFocus !== 'full_body' ? primary : ranked];
  }));
  const owners = new Map<string, string>();
  // Reassign an occupied pose only when its owner can move to another valid
  // candidate. A visited set bounds recursion and prevents allocation cycles.
  function assign(id: string, visited: Set<string>): boolean {
    for (const candidate of choices.get(id) ?? []) {
      if (visited.has(candidate.id)) continue;
      visited.add(candidate.id);
      const owner = owners.get(candidate.id);
      if (!owner || assign(owner, visited)) {
        owners.set(candidate.id, id);
        return true;
      }
    }
    return false;
  }
  const unmatched = workouts.filter((workout) => !assign(workout.id, new Set()));
  // A few mobility plans share every primary pose. Allow their other authored
  // movements rather than duplicating a cover or inventing an exercise.
  for (const workout of unmatched) {
    choices.set(workout.id, all.get(workout.id)!);
    assign(workout.id, new Set());
  }
  return new Map([...owners].map(([exercise, workout]) => [workout, exercise]));
}

const CATALOG_COVERS = catalogCovers();

/** Use an actual workout pose; catalog covers stay distinct across screens. */
export function selectWorkoutArtwork(workout: Workout | undefined): string | null {
  return workout ? CATALOG_COVERS.get(workout.id) ?? candidates(workout)[0]?.id ?? null : null;
}
