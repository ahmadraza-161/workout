import { MUSCLE_GROUPS } from '../content/metrics.ts';
import { APPROXIMATED, bodyPaths, coverage, musclePaths, toSvg, VIEW_BOX } from './muscle-map.ts';

// The guide highlights muscles by group id, so a muscle with no shape would
// silently highlight nothing rather than fail.

describe('muscle map', () => {
  it('places every one of the 19 groups on at least one view', () => {
    expect(coverage().filter((entry) => entry.views.length === 0)).toEqual([]);
  });

  it('puts front-only and back-only muscles on the right side of the body', () => {
    const front = new Set(musclePaths('front').map((path) => path.muscle));
    const back = new Set(musclePaths('back').map((path) => path.muscle));

    // You cannot see your own lats or glutes in a mirror.
    expect(front.has('chest')).toBe(true);
    expect(front.has('biceps')).toBe(true);
    expect(front.has('abs')).toBe(true);
    expect(back.has('lats')).toBe(true);
    expect(back.has('glutes')).toBe(true);
    expect(back.has('rear_deltoids')).toBe(true);
    expect(front.has('glutes')).toBe(false);
    expect(back.has('chest')).toBe(false);
  });

  it('names every group after its muscle id, which is how the guide finds it', () => {
    for (const view of ['front', 'back'] as const) {
      const svg = toSvg(view);
      for (const path of musclePaths(view)) expect(svg).toContain(`id="${path.muscle}"`);
    }
  });

  it('uses only ids the metrics file knows about', () => {
    const known = new Set<string>(MUSCLE_GROUPS);
    for (const view of ['front', 'back'] as const) {
      for (const path of musclePaths(view)) expect(known.has(path.muscle)).toBe(true);
    }
  });

  it('gives every muscle real path data rather than an empty shape', () => {
    for (const view of ['front', 'back'] as const) {
      for (const path of musclePaths(view)) {
        expect(path.d.startsWith('M')).toBe(true);
        expect(path.d.length).toBeGreaterThan(40);
      }
    }
  });

  it('draws the head, hands and feet so the muscles sit on a body', () => {
    // The front also carries knees and shins, which the back view does not,
    // so the counts differ; what matters is that neither view is bare.
    expect(bodyPaths('front').length).toBeGreaterThanOrEqual(5);
    expect(bodyPaths('back').length).toBeGreaterThanOrEqual(3);
  });

  it('frames each view separately, since both share one coordinate space', () => {
    // The source draws the front around x 54-648 and the back around x 789-1384.
    expect(VIEW_BOX.front).not.toBe(VIEW_BOX.back);
    expect(Number(VIEW_BOX.back.split(' ')[0])).toBeGreaterThan(700);
  });

  it('leaves colours to the theme rather than baking them in', () => {
    const svg = toSvg('front');
    expect(svg).toContain('var(--muscle-');
    // The reference blue must not be hard-coded; dark mode recolours the map.
    expect(svg).not.toContain('#0062FF');
  });

  it('records which muscles the source does not draw separately', () => {
    // The guide should not imply more precision than the artwork has.
    expect(APPROXIMATED).toEqual(['lats', 'hip_flexors']);
  });
});
