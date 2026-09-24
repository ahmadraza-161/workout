// Reads the catalog, validates it, and writes the intermediate data the other
// generators build on (T2.1, T2.8).
//
// Run: npm run assets

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { loadCatalog } from './catalog.ts';
import { readCatalog } from './markdown.ts';
import { resolveReferences } from './resolve.ts';
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

const data = {
  generatedFrom: 'DOC/CONTENT_MAP.md',
  exercises: catalog.exercises,
  workouts: catalog.workouts,
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
