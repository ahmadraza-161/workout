import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Original downloads are preserved. Remove full-canvas backgrounds and explicitly
// reviewed decorative labels; character geometry, timing and motion stay intact.
const root = join(import.meta.dirname, '../..');
const catalog = JSON.parse(readFileSync(join(import.meta.dirname, 'catalog.json'), 'utf8')) as {
  slug: string; exerciseId: string; title: string; creator: string;
  page: string; download: string; license: string;
  playback?: { startFrame: number; endFrame: number; loop: boolean };
  mappingNote?: string;
  removeLayerNames?: string[];
  viewport?: { x: number; y: number; width: number; height: number };
}[];
const pack = JSON.parse(readFileSync(join(root, 'assets/data/content-pack.json'), 'utf8')) as {
  exercises: { id: string }[];
};
const out = join(root, 'assets/lottie/imported');
mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'LICENSE.txt'), readFileSync(join(import.meta.dirname, 'LICENSE.txt')));
const sources: string[] = [];
const playback: string[] = [];
const ids = new Set<string>();
const slugs = new Set<string>();
const provenance = catalog.map((item) => {
  if (ids.has(item.exerciseId) || slugs.has(item.slug) || !/^[a-z0-9-]+$/.test(item.slug)) {
    throw new Error(`Duplicate or invalid animation mapping: ${item.slug}`);
  }
  ids.add(item.exerciseId);
  slugs.add(item.slug);
  if (!pack.exercises.some((exercise) => exercise.id === item.exerciseId)) throw new Error(`Unknown exercise ${item.exerciseId}`);
  const original = readFileSync(join(import.meta.dirname, 'source', `${item.slug}.json`));
  const animation = JSON.parse(original.toString()) as {
    v: string; w: number; h: number; ip: number; op: number; fr: number;
    assets: { p?: string; u?: string; e?: number; w?: number; h?: number; layers?: { ty: number; sw?: number; sh?: number; nm?: string }[] }[];
    layers: { ty: number; sw?: number; sh?: number; nm?: string; parent?: number;
      ks?: { p?: { a: number; k: number[] } } }[];
  };
  if (!animation.layers.length || animation.fr <= 0 || animation.op <= animation.ip ||
    animation.w <= 0 || animation.h <= 0 || animation.assets.some((asset) => asset.u)) {
    throw new Error(`Invalid or externally dependent animation: ${item.slug}`);
  }
  const embeddedImages: { file: string; sha256: string }[] = [];
  for (const asset of animation.assets) {
    if (!asset.p) continue;
    // Embedded PNGs are decoded by Lottie Android without a network or asset-folder dependency.
    if (!/^[a-zA-Z0-9_-]+\.png$/.test(asset.p)) throw new Error(`Unsupported image path: ${item.slug}`);
    const image = readFileSync(join(import.meta.dirname, 'source', `${item.slug}-assets`, asset.p));
    if (image.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error(`Invalid PNG: ${item.slug}`);
    embeddedImages.push({ file: asset.p, sha256: createHash('sha256').update(image).digest('hex') });
    asset.p = `data:image/png;base64,${image.toString('base64')}`;
    asset.u = '';
    asset.e = 1;
  }
  if (item.playback && (item.playback.startFrame < animation.ip ||
    item.playback.endFrame >= animation.op || item.playback.endFrame <= item.playback.startFrame)) {
    throw new Error(`Invalid playback segment: ${item.slug}`);
  }
  const removed: string[] = [];
  const removedLabels: string[] = [];
  for (const name of item.removeLayerNames ?? []) {
    const matches = animation.layers.filter((layer) => layer.nm === name);
    if (matches.length !== 1) throw new Error(`Missing or ambiguous decorative layer: ${item.slug}/${name}`);
    animation.layers = animation.layers.filter((layer) => layer.nm !== name);
    removedLabels.push(name);
  }
  const transparent = (layers: typeof animation.layers, w: number, h: number) => layers.filter((layer) => {
    const background = layer.ty === 1 && layer.sw === w && layer.sh === h;
    if (background) removed.push(layer.nm ?? 'Unnamed background');
    return !background;
  });
  animation.layers = transparent(animation.layers, animation.w, animation.h);
  for (const asset of animation.assets) {
    if (asset.layers) asset.layers = transparent(asset.layers, asset.w ?? animation.w, asset.h ?? animation.h);
  }
  // A reviewed viewport removes unused canvas space, preserving character paths,
  // parent transforms and timing. Animated root positions need separate review.
  if (item.viewport) {
    const { x, y, width, height } = item.viewport;
    if (![x, y, width, height].every(Number.isFinite) || x < 0 || y < 0 ||
      width <= 0 || height <= 0 || x + width > animation.w || y + height > animation.h) {
      throw new Error(`Invalid reviewed viewport: ${item.slug}`);
    }
    for (const layer of animation.layers.filter((entry) => entry.parent === undefined)) {
      const position = layer.ks?.p;
      if (!position || position.a !== 0 || !Array.isArray(position.k) || position.k.length < 2) {
        throw new Error(`Unsupported viewport root position: ${item.slug}`);
      }
      position.k[0]! -= x;
      position.k[1]! -= y;
    }
    animation.w = width;
    animation.h = height;
  }
  const json = JSON.stringify(animation) + '\n';
  writeFileSync(join(out, `${item.slug}.json`), json);
  sources.push(`  '${item.exerciseId}': require('../../../assets/lottie/imported/${item.slug}.json'),`);
  if (item.playback) playback.push(`  '${item.exerciseId}': ${JSON.stringify(item.playback)},`);
  return { ...item, originalSha256: createHash('sha256').update(original).digest('hex'),
    bundledBytes: Buffer.byteLength(json), removedBackgrounds: removed, removedLabels, embeddedImages,
    modification: 'Removed full-canvas background solids for theme-compatible transparency; embedded source PNGs where present; removed explicitly reviewed decorative labels where specified; cropped unused canvas only where a reviewed viewport is specified.' };
});
writeFileSync(join(out, 'provenance.json'), JSON.stringify(provenance, null, 2) + '\n');
writeFileSync(join(import.meta.dirname, 'coverage.generated.json'), JSON.stringify({
  totalExercises: pack.exercises.length,
  animatedExerciseIds: catalog.map((item) => item.exerciseId),
  remainingExerciseIds: pack.exercises.filter((exercise) => !ids.has(exercise.id)).map((exercise) => exercise.id),
}, null, 2) + '\n');
writeFileSync(join(root, 'src/modules/content/animations.generated.ts'),
  `// Generated by tools/animations/build.mts. Do not edit.\nimport type { AnimationObject } from 'lottie-react-native';\n\nexport const EXERCISE_ANIMATIONS: Readonly<Record<string, AnimationObject>> = {\n${sources.join('\n')}\n};\n\nexport const EXERCISE_ANIMATION_PLAYBACK: Readonly<Record<string, { startFrame: number; endFrame: number; loop: boolean }>> = {\n${playback.join('\n')}\n};\n`);
console.log(`Bundled ${catalog.length} offline animations (${provenance.reduce((sum, item) => sum + item.bundledBytes, 0)} bytes).`);
