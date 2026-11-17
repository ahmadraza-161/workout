import pack from '../../assets/data/content-pack.json';
import strings from '../../assets/i18n/en.json';

import {
  challengeCopySlugs,
  challengeDescriptionFor,
  workoutCopySlugs,
  workoutIntroFor,
} from './programCopy';

describe('bundled program copy', () => {
  it('covers all 60 workout intros without stale entries or blanks', () => {
    const slugs = pack.workouts.map(({ introKey }) => introKey.split('.')[1]!);
    expect(workoutCopySlugs().sort()).toEqual([...slugs].sort());
    for (const slug of slugs) {
      expect(workoutIntroFor(slug).length).toBeGreaterThan(35);
      expect(strings.workout[slug as keyof typeof strings.workout].intro).toBe(workoutIntroFor(slug));
    }
  });

  it('covers all 12 challenge descriptions without stale entries or blanks', () => {
    const slugs = pack.challenges.map(({ descKey }) => descKey.split('.')[1]!);
    expect(challengeCopySlugs().sort()).toEqual([...slugs].sort());
    for (const slug of slugs) {
      expect(challengeDescriptionFor(slug).length).toBeGreaterThan(35);
      expect(strings.challenge[slug as keyof typeof strings.challenge].desc)
        .toBe(challengeDescriptionFor(slug));
    }
  });
});
