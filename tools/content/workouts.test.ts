import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { loadCatalog, type CatalogWorkout } from './catalog.ts';
import { METRICS } from './metrics.ts';
import { generateWorkout, generateWorkouts, searchOrdering, totalSeconds } from './workouts.ts';

// These run against the real catalog rather than a fixture: the rules in
// PRD §8.2 only mean anything against the 119 exercises that actually exist,
// and a pool that turns out too small is exactly the kind of failure a
// fixture would hide.

const markdown = readFileSync(join(__dirname, '..', '..', 'DOC', 'CONTENT_MAP.md'), 'utf8');
const catalog = loadCatalog(markdown);
const generated = generateWorkouts(catalog.workouts, catalog.exercises);
const byNumber = new Map(catalog.workouts.map((workout) => [workout.number, workout]));
const exerciseByNumber = new Map(catalog.exercises.map((exercise) => [exercise.number, exercise]));

const workoutsOfType = (type: string) => generated.filter((g) => byNumber.get(g.number)!.type === type);

describe('generateWorkouts', () => {
  it('builds every workout in the catalog', () => {
    expect(generated).toHaveLength(60);
    for (const workout of generated) expect(workout.items.length).toBeGreaterThan(0);
  });

  it('matches each catalog duration within a minute', () => {
    const off = generated
      .map((workout) => ({ workout, target: byNumber.get(workout.number)!.minutes * 60 }))
      .filter(({ workout, target }) => Math.abs(workout.totalSeconds - target) > 60)
      .map(({ workout }) => byNumber.get(workout.number)!.name);

    expect(off).toEqual([]);
  });

  it('is deterministic, so a rebuild does not reshuffle reviewed workouts', () => {
    const again = generateWorkouts(catalog.workouts, catalog.exercises);
    expect(again).toEqual(generated);
  });

  it('plays one-sided exercises twice in a row, left then right', () => {
    for (const workout of generated) {
      for (let i = 0; i < workout.items.length; i++) {
        const item = workout.items[i]!;
        const exercise = exerciseByNumber.get(item.exerciseNumber)!;
        if (!exercise.oneSided) {
          expect(item.side).toBeUndefined();
          continue;
        }
        if (item.side === 'left') {
          const next = workout.items[i + 1];
          expect(next?.exerciseNumber).toBe(item.exerciseNumber);
          expect(next?.side).toBe('right');
        }
      }
    }
  });

  it('uses only quiet-safe exercises in workouts the catalog marks quiet', () => {
    const quiet = generated.filter((g) => byNumber.get(g.number)!.quiet.startsWith('Yes'));
    expect(quiet.length).toBeGreaterThan(0);

    for (const workout of quiet) {
      for (const item of workout.items) {
        expect(exerciseByNumber.get(item.exerciseNumber)!.quietSafe).toBe(true);
      }
    }
  });

  it('keeps stretch workouts to holds with no rest', () => {
    const stretches = workoutsOfType('stretch');
    expect(stretches.length).toBeGreaterThan(0);

    for (const workout of stretches) {
      for (const item of workout.items) {
        expect(item.rest).toBe(0);
        expect(exerciseByNumber.get(item.exerciseNumber)!.type).toBe('hold');
      }
    }
  });

  it('keeps HIIT rest inside the 10 to 15 second window', () => {
    const hiit = workoutsOfType('hiit');
    expect(hiit.length).toBeGreaterThan(0);

    for (const workout of hiit) {
      for (const item of workout.items.slice(0, -1)) {
        expect(item.rest).toBeGreaterThanOrEqual(10);
        expect(item.rest).toBeLessThanOrEqual(15);
      }
    }
  });

  it('respects each level"s difficulty range', () => {
    for (const workout of generated) {
      const catalogWorkout = byNumber.get(workout.number)!;
      const allowed = catalogWorkout.level === 1 ? [1, 2] : catalogWorkout.level === 2 ? [1, 3] : [2, 3];

      for (const item of workout.items) {
        const exercise = exerciseByNumber.get(item.exerciseNumber)!;
        // Warm-up and cool-down blocks are level 1 by nature and sit outside
        // the main block's difficulty rule.
        if (exercise.category === 'Warm-Up' || exercise.category === 'Stretch & Cool-Down') continue;
        expect(exercise.level).toBeGreaterThanOrEqual(allowed[0]!);
        expect(exercise.level).toBeLessThanOrEqual(allowed[1]!);
      }
    }
  });

  /** The main block: what the generator is free to order (PRD §8.2). */
  const mainBlockOf = (workout: (typeof generated)[number]) =>
    workout.items
      // Collapse the one-sided pairs, which are meant to sit together.
      .filter((item, index) => index === 0 || item.exerciseNumber !== workout.items[index - 1]!.exerciseNumber)
      .map((item) => exerciseByNumber.get(item.exerciseNumber)!)
      .filter((exercise) => exercise.category !== 'Warm-Up' && exercise.category !== 'Stretch & Cool-Down');

  const clashesIn = (sequence: typeof catalog.exercises) =>
    sequence.filter((exercise, index) => {
      if (index === 0) return false;
      const previous = METRICS[sequence[index - 1]!.number]?.primary ?? [];
      return (METRICS[exercise.number]?.primary ?? []).some((muscle) => previous.includes(muscle));
    });

  it('never leaves a same-muscle neighbour that a different order could have avoided', () => {
    // The rule cannot always hold. An exercise leads with several muscles at
    // once, so placing it blocks all of them, and some pools have no clash-free
    // order at all: the full-body pool at levels 2 to 3 holds 14 exercises of
    // which 9 lead with quads. So rather than demanding zero, this re-runs the
    // exhaustive search on the workout's own main block and fails only where a
    // clean order existed and was missed.
    //
    // Only the main block, because the warm-up and cool-down blocks are fixed
    // in place by the structure rule; a "clean" order that scattered stretches
    // through the middle would not be a workout.
    const avoidable = generated
      .filter((workout) => byNumber.get(workout.number)!.type !== 'strength')
      .filter((workout) => {
        const main = mainBlockOf(workout);
        return clashesIn(main).length > 0 && searchOrdering(main, undefined) !== undefined;
      })
      .map((workout) => byNumber.get(workout.number)!.name);

    expect(avoidable).toEqual([]);
  });

  it('reports the workouts whose pools cannot avoid a same-muscle neighbour', () => {
    // A content finding, not a code defect: for these the catalog's pool has
    // no clash-free order at all. Pinned here so that a change to the catalog
    // which fixes or worsens it shows up rather than passing quietly.
    const forced = generated
      .filter((workout) => byNumber.get(workout.number)!.type !== 'strength')
      .filter((workout) => searchOrdering(mainBlockOf(workout), undefined) === undefined)
      .map((workout) => byNumber.get(workout.number)!.name);

    expect(forced).toEqual(['Fat Burning HIIT — Advanced', 'Daily Move']);
  });

  it('counts rest for every item except the last', () => {
    const workout: CatalogWorkout = { ...byNumber.get(1)!, minutes: 10 };
    const result = generateWorkout(workout, catalog.exercises);
    const manual = result.items.reduce((sum, item, index) => {
      const work = item.seconds ?? (item.reps ?? 0) * 3;
      return sum + work + (index === result.items.length - 1 ? 0 : item.rest);
    }, 0);

    expect(totalSeconds(result.items)).toBe(manual);
  });
});
