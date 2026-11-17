// Offline review of simple raster Lottie compositions at their exact keyframes.
// This is a QA renderer, not a production player or a modification of source artwork.
import { mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const root = join(import.meta.dirname, '../..');
const out = join(root, '.expo/animation-qa');
mkdirSync(out, { recursive: true });
const slugs = ['high-stepping', 'triceps-dips', 'abs-crunches', 'sit-up'];
const tiles: { input: Buffer; left: number; top: number }[] = [];
type Keyframe = { t: number; s: number[]; e?: number[] };
type Property = { a: 0; k: number | number[] } | { a: 1; k: Keyframe[] };
type RasterLayer = { ind: number; parent?: number; refId: string;
  ks: { p: Property; a: Property; s: Property; r: Property; o: Property } };
type RasterComposition = { w: number; h: number; layers: RasterLayer[];
  assets: { id: string; p: string; w: number; h: number }[] };
for (const [row, slug] of slugs.entries()) {
  const source = JSON.parse(readFileSync(join(import.meta.dirname, 'source', `${slug}.json`), 'utf8')) as RasterComposition;
  const frames = slug === 'high-stepping' ? [0, 30] : [0, 60];
  for (const [column, frame] of frames.entries()) {
    const value = (property: Property): number[] => {
      if (property.a === 0) return Array.isArray(property.k) ? property.k : [property.k];
      const keys = property.k;
      const next = keys.findIndex((key) => key.t > frame + 0.001);
      if (next <= 0) return keys[next === 0 ? 0 : keys.length - 1]!.s;
      const before = keys[next - 1]!;
      const after = keys[next]!;
      const weight = (frame - before.t) / (after.t - before.t);
      return before.s.map((n, i) => n + (after.s[i]! - n) * weight);
    };
    const transform = (layer: RasterLayer): string => {
      const p = value(layer.ks.p); const a = value(layer.ks.a); const s = value(layer.ks.s);
      const r = value(layer.ks.r);
      const local = `translate(${p[0]} ${p[1]}) rotate(${r[0]}) scale(${s[0]! / 100} ${s[1]! / 100}) translate(${-a[0]!} ${-a[1]!})`;
      const parent = source.layers.find((candidate) => candidate.ind === layer.parent);
      return parent ? `${transform(parent)} ${local}` : local;
    };
    const images = [...source.layers].reverse().map((layer) => {
      const asset = source.assets.find((candidate) => candidate.id === layer.refId);
      if (!asset?.p || !/^[a-zA-Z0-9_-]+\.png$/.test(asset.p)) throw new Error(`Not a simple raster composition: ${slug}`);
      const png = readFileSync(join(import.meta.dirname, 'source', `${slug}-assets`, asset.p));
      const opacity = value(layer.ks.o);
      return `<image width="${asset.w}" height="${asset.h}" opacity="${opacity[0]! / 100}" transform="${transform(layer)}" href="data:image/png;base64,${png.toString('base64')}"/>`;
    }).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 ${source.w} ${source.h}"><rect width="100%" height="100%" fill="#eeeeee"/>${images}</svg>`;
    const input = await sharp(Buffer.from(svg)).png().toBuffer();
    tiles.push({ input, left: column * 320, top: row * 320 });
  }
}
await sharp({ create: { width: 640, height: slugs.length * 320, channels: 4, background: '#eeeeee' } })
  .composite(tiles).png().toFile(join(out, 'raster-keyframes.png'));
console.log('Rows: marching (frames 0/30), dips, crunch, standing squat (frames 0/60).');
