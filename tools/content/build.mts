// Reads the catalog, validates it, and writes the intermediate data the other
// generators build on (T2.1, T2.8).
//
// Run: npm run assets

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { loadCatalog } from './catalog.ts';
import { readCatalog } from './markdown.ts';
import { METRICS, MUSCLE_GROUPS } from './metrics.ts';
import { resolveReferences } from './resolve.ts';
import { generateWorkouts } from './workouts.ts';
import { assertValid, EXPECTED } from './validate.ts';

const ROOT = join(import.meta.dirname, '..', '..');
const CATALOG_PATH = join(ROOT, 'DOC', 'CONTENT_MAP.md');
const OUT_DIR = join(ROOT, 'assets', 'data');

const markdown = readCatalog(CATALOG_PATH);
const catalog = loadCatalog(markdown);
const resolved = resolveReferences(catalog.exercises, markdown);

assertValid(catalog, resolved);

// Reference maps are written as plain objects so the file stays diffable.
const fromMap = (map: Map<number, number>) => Object.fromEntries([...map].map(([k, v]) => [String(k), v]));

const workouts = generateWorkouts(catalog.workouts, catalog.exercises);

const data = {
  generatedFrom: 'DOC/CONTENT_MAP.md',
  // Catalog rows joined with the hand-authored metrics (T2.2).
  exercises: catalog.exercises.map((exercise) => ({ ...exercise, ...METRICS[exercise.number]! })),
  workouts: catalog.workouts.map((workout) => ({
    ...workout,
    ...workouts.find((generated) => generated.number === workout.number)!,
  })),
  challenges: catalog.challenges,
  achievements: catalog.achievements,
  references: {
    easier: fromMap(resolved.easier),
    harder: fromMap(resolved.harder),
    quietSwap: fromMap(resolved.quietSwap),
  },
};

mkdirSync(OUT_DIR, { recursive: true });
const path = join(OUT_DIR, 'catalog.generated.json');
writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');

const counts = Object.entries(EXPECTED)
  .map(([key, expected]) => `${key} ${catalog[key as keyof typeof EXPECTED].length}/${expected}`)
  .join(' · ');

console.log(`Catalog valid: ${counts}`);
console.log(
  `References: ${resolved.easier.size} easier, ${resolved.harder.size} harder, ` +
    `${resolved.quietSwap.size} quiet swaps`,
);

// The muscle map needs a named group for every muscle the content mentions,
// so the generator reports which ones the catalog actually loads (T2.13).
const asPrimary = new Set<string>();
const atAll = new Set<string>();
for (const metrics of Object.values(METRICS)) {
  for (const muscle of metrics.primary) {
    asPrimary.add(muscle);
    atAll.add(muscle);
  }
  for (const muscle of metrics.secondary) atAll.add(muscle);
}
const neverPrimary = MUSCLE_GROUPS.filter((muscle) => !asPrimary.has(muscle));
console.log(`Muscles: ${atAll.size}/${MUSCLE_GROUPS.length} used, never primary: ${neverPrimary.join(', ') || 'none'}`);
const flexed = workouts.filter((workout) => workout.blockSizeFlexed).length;
const worstGap = Math.max(
  ...workouts.map((generated) => {
    const target = catalog.workouts.find((workout) => workout.number === generated.number)!.minutes * 60;
    return Math.abs(generated.totalSeconds - target);
  }),
);
console.log(
  `Workouts: ${workouts.length} built, worst duration gap ${worstGap}s, ` +
    `${flexed} needed a block size outside PRD 8.2`,
);
console.log(`Wrote ${path}`);

// The catalog names 19 easier/harder variations that do not exist, and adding
// exercises is not allowed, so every link resolves to "none" (ADR-013,
// ADR-040). The guide's Easier/Harder buttons therefore never appear in v1.
if (resolved.easier.size === 0 && resolved.harder.size === 0) {
  console.log(
    '\nNote: no variation links resolve, so the exercise guide will show no ' +
      'Easier/Harder buttons in v1 (ADR-040). T4.8 should build the feature to ' +
      'stay hidden rather than assume data.',
  );
}
