import rawPack from '../../../assets/data/content-pack.json';
import { buildIndex, filterWorkouts, findBrokenReferences } from './pack';
import type { ContentPack } from './types';

const pack = rawPack as ContentPack;

describe('content pack', () => {
  const index = buildIndex(pack);

  it('has no broken references', () => {
    expect(findBrokenReferences(index)).toEqual([]);
  });

  it('indexes exercises and workouts by id', () => {
    expect(index.exercisesById.get('ex_torso_twist')?.slug).toBe('torso-twist');
    expect(index.workoutsById.get('wk_abs_beginner')?.bodyFocus).toBe('abs');
  });

  it('reports a workout that points to a missing exercise', () => {
    const broken: ContentPack = {
      ...pack,
      workouts: [{ ...pack.workouts[0]!, items: [{ exerciseId: 'ex_missing', seconds: 30, rest: 0 }] }],
    };
    expect(findBrokenReferences(buildIndex(broken))).toEqual(['wk_abs_beginner → ex_missing']);
  });

  it('filters workouts by body focus, level and duration', () => {
    expect(filterWorkouts(index, { bodyFocus: 'abs', level: 1 })).toHaveLength(1);
    expect(filterWorkouts(index, { bodyFocus: 'leg' })).toHaveLength(0);
    expect(filterWorkouts(index, { maxMinutes: 3 })).toHaveLength(0);
    expect(filterWorkouts(index, { quietOnly: true })).toHaveLength(1);
  });
});
