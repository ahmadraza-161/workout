import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { loadCatalog } from './catalog.ts';
import { ACHIEVEMENT_RULES, achievementRules, categoriesFrom, collectionsFrom } from './placements.ts';

const markdown = readFileSync(join(__dirname, '..', '..', 'DOC', 'CONTENT_MAP.md'), 'utf8');
const catalog = loadCatalog(markdown);
const workoutNumbers = new Set(catalog.workouts.map((workout) => workout.number));
const exerciseNumbers = new Set(catalog.exercises.map((exercise) => exercise.number));

describe('Discover tiles', () => {
  const categories = categoriesFrom(catalog.workouts);

  it('builds the six tiles the catalog promises', () => {
    expect(categories).toHaveLength(6);
  });

  it('gives every tile something to show', () => {
    for (const category of categories) expect(category.workoutNumbers.length).toBeGreaterThan(0);
  });

  it('only lists workouts that exist', () => {
    for (const category of categories) {
      for (const number of category.workoutNumbers) expect(workoutNumbers.has(number)).toBe(true);
    }
  });
});

describe('collections', () => {
  const { collections, unmatched } = collectionsFrom(markdown, catalog.workouts);

  it('resolves every workout name the catalog lists', () => {
    // A name that does not match a workout would quietly shorten a collection.
    expect(unmatched).toEqual([]);
  });

  it('builds the four collections from ADR-044', () => {
    expect(collections.map((collection) => collection.id)).toEqual(['c1', 'c2', 'c3', 'c4']);
    for (const collection of collections) expect(collection.workoutNumbers.length).toBeGreaterThanOrEqual(5);
  });
});

describe('achievement rules', () => {
  const paired = achievementRules(catalog.achievements);

  it('covers all 35 badges with nothing left over', () => {
    // A badge with no rule can never unlock, and a rule with no badge is dead
    // code; neither shows up at runtime, so they are caught here.
    expect(paired.missing).toEqual([]);
    expect(paired.extra).toEqual([]);
    expect(paired.rules).toHaveLength(35);
  });

  it('gives every rule a threshold that can actually be reached', () => {
    for (const rule of ACHIEVEMENT_RULES) expect(rule.threshold).toBeGreaterThan(0);
  });

  it('scopes rep and hold records to exercises that exist', () => {
    for (const rule of ACHIEVEMENT_RULES) {
      for (const number of rule.scope?.exercises ?? []) {
        expect(exerciseNumbers.has(number)).toBe(true);
      }
    }
  });

  it('keeps the rep records to rep-based exercises and holds to holds', () => {
    const byNumber = new Map(catalog.exercises.map((exercise) => [exercise.number, exercise]));

    for (const rule of ACHIEVEMENT_RULES) {
      for (const number of rule.scope?.exercises ?? []) {
        const exercise = byNumber.get(number)!;
        if (rule.metric === 'best_reps') expect(exercise.type).toBe('reps');
        if (rule.metric === 'best_hold') expect(exercise.type).toBe('hold');
      }
    }
  });

  it('has a unique id per rule', () => {
    const ids = ACHIEVEMENT_RULES.map((rule) => rule.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
