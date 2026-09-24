// One-time developer tool: downloads the Poppins font files (SIL Open Font
// License) from the Google Fonts repository into assets/fonts/. The files are
// committed, so the app itself never touches the network (ADR-003, RULES §7).
// Run: npm run fonts

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = 'https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/';
const FILES = [
  'Poppins-Regular.ttf',
  'Poppins-Medium.ttf',
  'Poppins-SemiBold.ttf',
  'Poppins-Bold.ttf',
  'Poppins-ExtraBold.ttf',
  'OFL.txt',
];
const OUT_DIR = join(import.meta.dirname, '..', '..', 'assets', 'fonts');

mkdirSync(OUT_DIR, { recursive: true });
for (const file of FILES) {
  const response = await fetch(BASE + file);
  if (!response.ok) throw new Error(`Download failed for ${file}: HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  writeFileSync(join(OUT_DIR, file), bytes);
  console.log(`saved ${file} (${Math.round(bytes.length / 1024)} KB)`);
}
