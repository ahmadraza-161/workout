import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import sharp from 'sharp';

const ROOT = join(import.meta.dirname, '..', '..');
const OUTPUT = process.argv[2] ? resolve(process.argv[2]) : join(ROOT, '.expo', 'image-qa');
const COLUMNS = 4;
const ROWS = 5;
const CELL_WIDTH = 380;
const CELL_HEIGHT = 440;
const CAPTION_HEIGHT = 48;
const pack = JSON.parse(readFileSync(join(ROOT, 'assets/data/content-pack.json'), 'utf8')) as {
  exercises: { id: string }[];
};
const manifest = readFileSync(join(ROOT, 'src/modules/content/exerciseImages.generated.ts'), 'utf8');
const entries = [...manifest.matchAll(/'([^']+)': require\('([^']+)'\)/g)];
const images = new Map(entries.map((entry) => [entry[1]!, resolve(ROOT, 'src/modules/content', entry[2]!)]));
if (entries.length !== images.size) throw new Error('Duplicate image mapping');
if (images.size !== pack.exercises.length) throw new Error('Unexpected image mapping count');
mkdirSync(OUTPUT, { recursive: true });
const report: { id: string; path: string; width: number; height: number; alpha: boolean; partialAlphaFraction: number; bytes: number }[] = [];
const tiles: Buffer[] = [];
const blueTiles: Buffer[] = [];

for (const [index, exercise] of pack.exercises.entries()) {
  const path = images.get(exercise.id);
  if (!path) throw new Error(`Missing image: ${exercise.id}`);
  const metadata = await sharp(path).metadata();
  if (!metadata.width || !metadata.height || !['jpeg', 'png'].includes(metadata.format ?? '')) {
    throw new Error(`Invalid image: ${exercise.id}`);
  }
  // Full decoding catches corrupted files that still have a readable header.
  const image = await sharp(path).resize(CELL_WIDTH, CELL_HEIGHT - CAPTION_HEIGHT,
    { fit: 'contain', background: '#FFFFFF' }).png().toBuffer();
  const caption = Buffer.from(`<svg width="${CELL_WIDTH}" height="${CAPTION_HEIGHT}">
    <rect width="100%" height="100%" fill="#F0F2F5"/>
    <text x="10" y="20" font-family="sans-serif" font-size="15">${index + 1}. ${exercise.id}</text>
    <text x="10" y="39" font-family="sans-serif" font-size="12">${metadata.width} x ${metadata.height}; ${metadata.hasAlpha ? 'alpha' : 'opaque'}</text>
  </svg>`);
  const blue = await sharp(path).resize(CELL_WIDTH, CELL_HEIGHT - CAPTION_HEIGHT,
    { fit: 'contain', background: '#004BFF' }).flatten({ background: '#004BFF' }).png().toBuffer();
  blueTiles.push(await sharp({ create: { width: CELL_WIDTH, height: CELL_HEIGHT, channels: 3,
    background: '#004BFF' } }).composite([
    { input: blue, left: 0, top: 0 }, { input: caption, left: 0, top: CELL_HEIGHT - CAPTION_HEIGHT },
  ]).png().toBuffer());
  tiles.push(await sharp({ create: { width: CELL_WIDTH, height: CELL_HEIGHT, channels: 3,
    background: '#FFFFFF' } }).composite([
    { input: image, left: 0, top: 0 }, { input: caption, left: 0, top: CELL_HEIGHT - CAPTION_HEIGHT },
  ]).png().toBuffer());
  const raw = await sharp(path).resize({ width: 256, height: 256, fit: 'inside' }).ensureAlpha().raw().toBuffer();
  let partial = 0;
  for (let offset = 3; offset < raw.length; offset += 4) {
    if (raw[offset]! > 16 && raw[offset]! < 239) partial++;
  }
  report.push({ id: exercise.id, path, width: metadata.width, height: metadata.height,
    alpha: metadata.hasAlpha ?? false, partialAlphaFraction: partial / (raw.length / 4), bytes: statSync(path).size });
}

const pageSize = COLUMNS * ROWS;
for (let start = 0; start < tiles.length; start += pageSize) {
  for (const [name, source] of [['sheet', tiles], ['blue', blueTiles]] as const) {
    const batch = source.slice(start, start + pageSize);
    await sharp({ create: { width: COLUMNS * CELL_WIDTH, height: ROWS * CELL_HEIGHT,
      channels: 3, background: '#FFFFFF' } }).composite(batch.map((input, index) => ({
      input, left: (index % COLUMNS) * CELL_WIDTH, top: Math.floor(index / COLUMNS) * CELL_HEIGHT,
    }))).jpeg({ quality: 92 }).toFile(join(OUTPUT, `${name}-${Math.floor(start / pageSize) + 1}.jpg`));
  }
}
writeFileSync(join(OUTPUT, 'audit.json'), JSON.stringify(report, null, 2));
console.log(`${report.length} mapped images decoded; ${(report.reduce((sum, row) => sum + row.bytes, 0) / 1048576).toFixed(2)} MB; ${report.filter((row) => row.alpha).length} with alpha.`);
console.log(`Contact sheets and metadata: ${OUTPUT}`);

// Browse assets are independent of the exercise instruction poses.
const characterTiles: Buffer[] = [];
const characterNames = ['male-trainer', 'male-plank', 'male-squat', 'female-trainer', 'trainers-mixed'];
for (const name of characterNames) {
  const path = join(ROOT, 'assets/images/characters/optimized', `${name}.png`);
  const metadata = await sharp(path).metadata();
  const stats = await sharp(path).stats();
  // Palette compression can quantize a solid 255 alpha to 254. Require a
  // transparent background and an effectively opaque subject, not exact 255.
  if (!metadata.hasAlpha || stats.channels[3]?.min !== 0 || (stats.channels[3]?.max ?? 0) < 250) {
    throw new Error(`Character must have transparent background and near-opaque subject: ${name}`);
  }
  for (const background of ['#004BFF', '#171A21']) {
    // Preview compositing only; source PNG alpha remains untouched.
    characterTiles.push(await sharp(path).resize(CELL_WIDTH, CELL_HEIGHT,
      { fit: 'contain', background }).flatten({ background }).jpeg({ quality: 92 }).toBuffer());
  }
}
await sharp({ create: { width: CELL_WIDTH * characterNames.length, height: CELL_HEIGHT * 2, channels: 3,
  background: '#FFFFFF' } }).composite(characterTiles.map((input, index) => ({
    input, left: Math.floor(index / 2) * CELL_WIDTH, top: index % 2 * CELL_HEIGHT,
  }))).jpeg({ quality: 92 }).toFile(join(OUTPUT, 'characters.jpg'));
console.log(`${characterNames.length} male/female character PNGs decoded and verified with real transparency; blue/dark previews saved.`);
