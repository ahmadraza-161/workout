import rawPack from '../../../assets/data/content-pack.json';
import { buildIndex } from './pack';
import { relatedWorkouts, searchContent } from './query';
import type { ContentPack } from './types';

const source = rawPack as ContentPack;
const plank = { ...source.exercises[0]!, id: 'ex_plank', nameKey: 'plank' };
const squat = { ...source.exercises[1]!, id: 'ex_squat', nameKey: 'squat' };
const workout = source.workouts[0]!;
const pack: ContentPack = {
  ...source,
  exercises: [plank, squat],
  workouts: [
    { ...workout, id: 'core', titleKey: 'core', bodyFocus: 'abs', goal: 'keep_fit', items: [{ exerciseId: plank.id, rest: 0 }] },
    { ...workout, id: 'core_2', titleKey: 'core_2', bodyFocus: 'abs', goal: 'keep_fit', items: [{ exerciseId: plank.id, rest: 0 }] },
    { ...workout, id: 'legs', titleKey: 'legs', bodyFocus: 'leg', goal: 'build_muscle', items: [{ exerciseId: squat.id, rest: 0 }] },
  ],
  challenges: [{ ...source.challenges[0]!, id: 'challenge', titleKey: 'challenge' }],
  categories: [],
  collections: [],
};
const index = buildIndex(pack);
const labels: Record<string, string> = {
  plank: 'Side Plank',
  squat: 'Bodyweight Squat',
  core: 'Core Strength',
  core_2: 'Core Strength Starter',
  legs: 'Leg Power',
  challenge: 'Core Challenge',
};

describe('catalog queries', () => {
  it('searches all groups with case-insensitive, multi-term input', () => {
    const results = searchContent(index, '  CORE   strength ', (key) => labels[key]!);
    expect(results.workouts.map((item) => item.id)).toEqual(['core', 'core_2']);
    expect(results.exercises).toEqual([]);
    expect(results.challenges).toEqual([]);
    expect(searchContent(index, 'plank', (key) => labels[key]!).exercises[0]?.id).toBe('ex_plank');
    expect(searchContent(index, 'challenge', (key) => labels[key]!).challenges[0]?.id).toBe('challenge');
  });

  it('does not show every catalog item for a blank query', () => {
    expect(searchContent(index, '  ', (key) => labels[key]!)).toEqual({
      workouts: [],
      exercises: [],
      challenges: [],
    });
  });

  it('ranks similar workouts first and excludes the current workout', () => {
    expect(relatedWorkouts(index, 'core').map((item) => item.id)).toEqual(['core_2', 'legs']);
    expect(relatedWorkouts(index, 'missing')).toEqual([]);
    expect(relatedWorkouts(index, 'core', 1).map((item) => item.id)).toEqual(['core_2']);
  });
});
