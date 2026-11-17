import pack from '../../../assets/data/content-pack.json';
import strings from '../../../assets/i18n/en.json';

describe('bundled exercise-guide translations', () => {
  it('resolves every exercise section to three nonempty lines', () => {
    for (const exercise of pack.exercises) {
      const key = exercise.slug.replace(/-/g, '_') as keyof typeof strings.exercise;
      const copy = strings.exercise[key];
      expect(copy).toBeDefined();
      expect(copy.instructions).toHaveLength(3);
      expect(copy.mistakes).toHaveLength(3);
      expect(copy.breathing).toHaveLength(3);
      expect([...copy.instructions, ...copy.mistakes, ...copy.breathing]
        .every((line) => line.trim().length > 15)).toBe(true);
    }
  });
});
