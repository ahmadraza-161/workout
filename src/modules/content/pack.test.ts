import rawPack from '../../../assets/data/content-pack.json';
import { buildIndex, filterWorkouts, findBrokenReferences } from './pack';
import type { ContentPack } from './types';

const pack = rawPack as ContentPack;
const sampleExercise = pack.exercises[0]!;
const sampleWorkout = {
  ...pack.workouts[0]!,
  id: 'wk_abs_beginner',
  bodyFocus: 'abs' as const,
  level: 1 as const,
  estimatedMinutes: 12,
  quietSafe: true,
  items: [{ exerciseId: sampleExercise.id, seconds: 30, rest: 0 }],
};
const samplePack: ContentPack = {
  ...pack,
  exercises: [sampleExercise],
  workouts: [sampleWorkout],
  challenges: [],
  categories: [],
  collections: [],
};

describe('content pack', () => {
  const index = buildIndex(samplePack);

  it('has no broken references', () => {
    expect(findBrokenReferences(buildIndex(pack))).toEqual([]);
  });

  it('indexes exercises and workouts by id', () => {
    expect(index.exercisesById.get(sampleExercise.id)?.slug).toBe(sampleExercise.slug);
    expect(index.workoutsById.get('wk_abs_beginner')?.bodyFocus).toBe('abs');
  });

  it('reports a workout that points to a missing exercise', () => {
    const broken: ContentPack = {
      ...samplePack,
      workouts: [{ ...sampleWorkout, items: [{ exerciseId: 'ex_missing', seconds: 30, rest: 0 }] }],
    };
    expect(findBrokenReferences(buildIndex(broken))).toEqual(['wk_abs_beginner → ex_missing']);
  });

  it('reports a challenge day that points to a missing exercise', () => {
    const broken: ContentPack = {
      ...samplePack,
      challenges: [{ ...pack.challenges[0]!, schedule: [{ day: 1, exerciseId: 'ex_missing', reps: 5, sets: 3 }] }],
    };
    expect(findBrokenReferences(buildIndex(broken))).toEqual([`${pack.challenges[0]!.id} day 1 → ex_missing`]);
  });

  it('filters workouts by body focus, level and duration', () => {
    expect(filterWorkouts(index, { bodyFocus: 'abs', level: 1 })).toHaveLength(1);
    expect(filterWorkouts(index, { bodyFocus: 'leg' })).toHaveLength(0);
    expect(filterWorkouts(index, { maxMinutes: 3 })).toHaveLength(0);
    expect(filterWorkouts(index, { quietOnly: true })).toHaveLength(1);
  });
});
