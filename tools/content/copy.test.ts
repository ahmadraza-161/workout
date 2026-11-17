import rawPack from '../../assets/data/content-pack.json';

import { exerciseCopyFor, exerciseCopySlugs } from './copy';

const slugs = (rawPack.exercises as { slug: string }[])
  .map((exercise) => exercise.slug.replace(/-/g, '_'));

describe('exercise-guide copy', () => {
  it('covers each catalog exercise once with complete original sections', () => {
    expect(new Set(exerciseCopySlugs()).size).toBe(slugs.length);
    expect(exerciseCopySlugs().sort()).toEqual([...slugs].sort());
    for (const slug of slugs) {
      const copy = exerciseCopyFor(slug);
      expect(copy.instructions).toHaveLength(3);
      expect(copy.mistakes).toHaveLength(3);
      expect(copy.breathing).toHaveLength(3);
      for (const line of [...copy.instructions, ...copy.mistakes, ...copy.breathing]) {
        expect(line.trim().length).toBeGreaterThan(15);
      }
    }
  });
});
