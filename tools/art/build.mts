// Writes the front and back muscle maps (T2.13).
//
// Run through: npm run assets

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { APPROXIMATED, VIEW_BOX, bodyPaths, coverage, musclePaths, toSvg, type MapView } from './muscle-map.ts';

const ROOT = join(import.meta.dirname, '..', '..');
const OUT_DIR = join(ROOT, 'assets', 'svg', 'muscle-map');
mkdirSync(OUT_DIR, { recursive: true });

for (const view of ['front', 'back'] as MapView[]) {
  const svg = toSvg(view);
  writeFileSync(join(OUT_DIR, `${view}.svg`), `${svg}\n`, 'utf8');
  console.log(`  ${view.padEnd(6)} ${String(svg.length).padStart(6)} bytes, ${musclePaths(view).length} muscles`);
}

// React Native renders paths directly; it cannot import the generated SVG files
// as components without another transformer package.
const pathData = Object.fromEntries((['front', 'back'] as MapView[]).map((view) => [view, {
  viewBox: VIEW_BOX[view],
  body: bodyPaths(view),
  muscles: musclePaths(view),
}]));
writeFileSync(join(ROOT, 'assets', 'data', 'muscle-map-paths.json'), `${JSON.stringify(pathData)}\n`, 'utf8');

const placed = coverage().filter((entry) => entry.views.length > 0);
const missing = coverage().filter((entry) => entry.views.length === 0);

console.log(
  `Muscle map: ${placed.length}/${coverage().length} muscles placed, ` +
    `${APPROXIMATED.length} approximated (${APPROXIMATED.join(', ')})`,
);

if (missing.length > 0) {
  console.error(`Not on any view: ${missing.map((entry) => entry.muscle).join(', ')}`);
  process.exit(1);
}
