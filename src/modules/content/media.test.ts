import rawPack from '../../../assets/data/content-pack.json';

import { getExerciseImage } from './media';

describe('bundled exercise media', () => {
  it('has an offline source for every catalog exercise and a safe unknown-ID fallback', () => {
    expect(rawPack.exercises).toHaveLength(119);
    for (const exercise of rawPack.exercises) {
      expect(getExerciseImage(exercise.id)).not.toBeNull();
    }
    expect(getExerciseImage('not_an_exercise')).toBeNull();
  });
});
