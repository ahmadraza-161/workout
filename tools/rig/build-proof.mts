// Exports the four proof exercises to Lottie and reports their size against
// the 40 KB budget (ARCHITECTURE §9).
//
// Run: node tools/rig/build-proof.mts

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { PALETTES } from '../../src/modules/demo/rig/palette.ts';
import { PROOF_EXERCISES } from '../../src/modules/demo/rig/proof.ts';
import { exportLottie } from '../../src/modules/demo/rig/lottie.ts';

const BUDGET_BYTES = 40 * 1024;
const OUT_DIR = join(import.meta.dirname, '..', '..', 'assets', 'lottie', 'exercises');

mkdirSync(OUT_DIR, { recursive: true });

let worst = 0;
for (const exercise of PROOF_EXERCISES) {
  const animation = exportLottie({
    name: exercise.slug,
    poses: exercise.poses,
    durationSeconds: exercise.duration,
    palette: PALETTES.a,
    view: exercise.view,
  });

  const json = JSON.stringify(animation);
  const path = join(OUT_DIR, `${exercise.slug}.json`);
  writeFileSync(path, json, 'utf8');

  const bytes = Buffer.byteLength(json, 'utf8');
  worst = Math.max(worst, bytes);
  const percent = ((bytes / BUDGET_BYTES) * 100).toFixed(1);
  console.log(
    `${exercise.slug.padEnd(14)} ${String(bytes).padStart(6)} bytes  ${percent.padStart(5)}% of budget  ` +
      `${animation.layers.length} layers, ${exercise.poses.length} key poses`,
  );
}

console.log(
  `\nLargest: ${worst} bytes against a ${BUDGET_BYTES} byte budget ` +
    `(${((worst / BUDGET_BYTES) * 100).toFixed(1)}%).`,
);

if (worst > BUDGET_BYTES) {
  console.error('Over budget.');
  process.exit(1);
}
