// Writes the four cue sounds and reports their size (T2.16).
//
// Run through: npm run assets

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { renderSound, SOUNDS } from './synth.ts';

const BUDGET_BYTES = 25 * 1024;
const OUT_DIR = join(import.meta.dirname, '..', '..', 'assets', 'sounds');

mkdirSync(OUT_DIR, { recursive: true });

let worst = 0;
for (const name of Object.keys(SOUNDS)) {
  const wav = renderSound(name);
  writeFileSync(join(OUT_DIR, `${name}.wav`), wav);
  worst = Math.max(worst, wav.length);
  console.log(`  ${name.padEnd(12)} ${String(wav.length).padStart(6)} bytes  ${((wav.length / BUDGET_BYTES) * 100).toFixed(1).padStart(5)}% of budget`);
}

console.log(`Sounds: 4 written, largest ${worst} bytes of a ${BUDGET_BYTES} byte budget.`);
if (worst > BUDGET_BYTES) {
  console.error('Over budget.');
  process.exit(1);
}
