import { selectWorkoutArtwork } from './artwork';
import { getContentPack, getExercise } from './repository';

it('does not repeat a cover across the 60 catalog workouts', () => {
  const covers = getContentPack().workouts.map(selectWorkoutArtwork);
  expect(covers).not.toContain(null);
  expect(new Set(covers).size).toBe(covers.length);
});

it('keeps every cover relevant to an exercise in that workout', () => {
  for (const workout of getContentPack().workouts) {
    const id = selectWorkoutArtwork(workout);
    expect(workout.items.some((item) => item.exerciseId === id)).toBe(true);
  }
  expect(selectWorkoutArtwork(undefined)).toBeNull();
});

it('chooses chest and core exercises by their actual primary muscles', () => {
  const pack = getContentPack();
  for (const focus of ['chest', 'abs']) {
    for (const workout of pack.workouts.filter((item) => item.bodyFocus === focus)) {
      const exercise = getExercise(selectWorkoutArtwork(workout)!);
      const targetMuscles = focus === 'abs' ? ['abs', 'obliques'] : ['chest'];
      expect(exercise?.primaryMuscles.some((muscle) => targetMuscles.includes(muscle))).toBe(true);
    }
  }
});
