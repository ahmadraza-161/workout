// Writes the front and back muscle maps (T2.13).
//
// Run through: npm run assets

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { coverage, toSvg, type MapView } from './muscle-map.ts';

const OUT_DIR = join(import.meta.dirname, '..', '..', 'assets', 'svg', 'muscle-map');
mkdirSync(OUT_DIR, { recursive: true });

for (const view of ['front', 'back'] as MapView[]) {
  const svg = toSvg(view);
  writeFileSync(join(OUT_DIR, `${view}.svg`), `${svg}\n`, 'utf8');
  console.log(`  ${view.padEnd(6)} ${String(svg.length).padStart(5)} bytes`);
}

const missing = coverage().filter((entry) => entry.views.length === 0);
console.log(`Muscle map: 2 views, ${coverage().length - missing.length}/${coverage().length} muscles placed`);
if (missing.length > 0) {
  console.error(`Not on any view: ${missing.map((entry) => entry.muscle).join(', ')}`);
  process.exit(1);
}
