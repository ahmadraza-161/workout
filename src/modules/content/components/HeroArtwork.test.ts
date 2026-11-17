import { getContentPack } from '../repository';
import { HERO_IMAGES } from '../heroImages.generated';
import { challengeHeroKey } from './HeroArtwork';

it('gives every challenge and category its own bundled hero', () => {
  const pack = getContentPack();
  const keys = [...pack.challenges.map((item) => challengeHeroKey(item.id)), ...pack.categories.map((item) => `category-${item.id}`)];
  expect(new Set(keys).size).toBe(keys.length);
  for (const key of keys) expect(HERO_IMAGES).toHaveProperty(key);
});
