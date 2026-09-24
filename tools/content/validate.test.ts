import type { Catalog, CatalogExercise } from './catalog.ts';
import { METRICS } from './metrics.ts';
import type { Resolved } from './resolve.ts';
import { validate } from './validate.ts';

// The validator's job is to fail the build, so testing that it passes on good
// data proves almost nothing. Each case here breaks one thing and checks the
// validator notices.

function exercise(overrides: Partial<CatalogExercise> & { number: number }): CatalogExercise {
  return {
    name: `Exercise ${overrides.number}`,
    slug: `exercise-${overrides.number}`,
    // Take the type from the real metrics so the fixture stays consistent with
    // them; otherwise every case would trip the "reps but no rep count" check.
    type: METRICS[overrides.number]?.reps === undefined ? 'time' : 'reps',
    level: 1,
    quietSafe: true,
    basePose: 'standing',
    view: 'front',
    props: [],
    oneSided: false,
    variations: '',
    quietSwap: '',
    equipment: 'none',
    ...overrides,
  };
}

function catalog(overrides: Partial<Catalog> = {}): Catalog {
  return {
    exercises: Array.from({ length: 119 }, (_, index) => exercise({ number: index + 1 })),
    workouts: Array.from({ length: 60 }, (_, index) => ({
      number: index + 1,
      name: `Workout ${index + 1}`,
      slug: `workout-${index + 1}`,
      group: 'Body Focus',
      minutes: 12,
      level: 1 as const,
      bodyFocus: 'abs',
      goal: 'build_muscle',
      type: 'strength',
      quiet: 'Auto',
      tiles: [],
      placements: '',
    })),
    challenges: Array.from({ length: 12 }, (_, index) => ({
      number: index + 1,
      name: `Challenge ${index + 1}`,
      slug: `challenge-${index + 1}`,
      days: 28,
      focus: 'full body',
      dailyTime: '7–22 min',
      gradient: 'blue',
      kind: 'Daily plan',
      goal: 'build_muscle',
      filterChips: [],
    })),
    achievements: Array.from({ length: 35 }, (_, index) => ({
      number: index + 1,
      id: `badge_${index + 1}`,
      badge: `Badge ${index + 1}`,
      group: 'Getting started',
      condition: 'Do a thing',
    })),
    ...overrides,
  };
}

const noRefs = (): Resolved => ({ easier: new Map(), harder: new Map(), quietSwap: new Map() });

describe('validate', () => {
  it('passes on a well-formed catalog', () => {
    expect(validate(catalog(), noRefs())).toEqual([]);
  });

  it('catches a missing exercise, which is how a dropped row would show up', () => {
    const data = catalog();
    data.exercises = data.exercises.slice(0, 118);
    expect(validate(data, noRefs()).join(' ')).toContain('found 118');
  });

  it('catches duplicate slugs, which would collide as ids and file names', () => {
    const data = catalog();
    data.exercises[5] = exercise({ number: 6, slug: 'exercise-1' });
    expect(validate(data, noRefs()).join(' ')).toContain('share the slug');
  });

  it('catches a gap in the numbering that everything joins on', () => {
    const data = catalog();
    data.exercises[10] = exercise({ number: 200 });
    const problems = validate(data, noRefs()).join(' ');
    expect(problems).toContain('missing number 11');
  });

  it('catches a reference to an exercise that does not exist', () => {
    const refs = noRefs();
    refs.harder.set(5, 999);
    expect(validate(catalog(), refs).join(' ')).toContain('#999, which does not exist');
  });

  it('catches an exercise pointing at itself', () => {
    const refs = noRefs();
    refs.easier.set(5, 5);
    expect(validate(catalog(), refs).join(' ')).toContain('points at itself');
  });

  it('catches a quiet swap that is not actually quiet, which would defeat Quiet Mode', () => {
    const data = catalog();
    data.exercises[0] = exercise({ number: 1, quietSafe: false });
    data.exercises[1] = exercise({ number: 2, quietSafe: false });
    const refs = noRefs();
    refs.quietSwap.set(1, 2);
    refs.quietSwap.set(2, 1);
    expect(validate(data, refs).join(' ')).toContain('which is not quiet-safe');
  });

  it('catches a jumping exercise left without a quiet swap', () => {
    const data = catalog();
    data.exercises[3] = exercise({ number: 4, quietSafe: false });
    expect(validate(data, noRefs()).join(' ')).toContain('has no swap');
  });

  it('catches an implausible workout duration', () => {
    const data = catalog();
    data.workouts[0]!.minutes = 0;
    expect(validate(data, noRefs()).join(' ')).toContain('implausible duration');
  });

  it('catches a challenge length the progression rules do not cover', () => {
    const data = catalog();
    data.challenges[0]!.days = 17;
    expect(validate(data, noRefs()).join(' ')).toContain('not 14, 21, 28 or 30');
  });

  it('catches banned wording, so a content-rule breach cannot reach the store', () => {
    const data = catalog();
    data.workouts[0]!.name = 'Height Increase Challenge';
    data.exercises[0] = exercise({ number: 1, name: 'Belly Fat Melt Away' });
    const problems = validate(data, noRefs()).join(' ');
    expect(problems).toContain('height increase');
    expect(problems).toContain('melt away');
  });

  it('catches an achievement id that is not snake_case', () => {
    const data = catalog();
    data.achievements[0]!.id = 'First Workout';
    expect(validate(data, noRefs()).join(' ')).toContain('not a snake_case id');
  });

  it('catches an exercise with no metrics, which is how a missed row shows up', () => {
    const data = catalog();
    data.exercises.push(exercise({ number: 120 }));
    expect(validate(data, noRefs()).join(' ')).toContain('#120 Exercise 120 has none');
  });

  it('catches a timed exercise whose metrics give reps instead of seconds', () => {
    const data = catalog();
    // #20 Forearm Plank is a hold, so its metrics carry seconds.
    data.exercises[19] = exercise({ number: 20, type: 'reps' });
    expect(validate(data, noRefs()).join(' ')).toContain('is reps but has no rep count');
  });

  it('catches a muscle listed as both primary and secondary', () => {
    const data = catalog();
    const original = METRICS[1]!;
    METRICS[1] = { ...original, primary: ['abs'], secondary: ['abs'] };
    try {
      expect(validate(data, noRefs()).join(' ')).toContain('both primary and secondary');
    } finally {
      METRICS[1] = original;
    }
  });

  it('catches an implausible MET, which would skew every kcal estimate', () => {
    const data = catalog();
    const original = METRICS[1]!;
    METRICS[1] = { ...original, met: 45 };
    try {
      expect(validate(data, noRefs()).join(' ')).toContain('implausible MET');
    } finally {
      METRICS[1] = original;
    }
  });

  it('reports every problem at once rather than stopping at the first', () => {
    const data = catalog();
    data.workouts[0]!.minutes = 0;
    data.challenges[0]!.days = 17;
    data.achievements[0]!.id = 'Bad Id';
    expect(validate(data, noRefs()).length).toBeGreaterThanOrEqual(3);
  });
});
