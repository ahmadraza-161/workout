import { readdirSync } from 'node:fs';
import sharp from 'sharp';
const names = readdirSync('reference-img').sort();
const overlays: sharp.OverlayOptions[] = [];
for (let i = 0; i < names.length; i++) {
  const left = (i % 5) * 220, top = Math.floor(i / 5) * 350;
  const image = await sharp(`reference-img/${names[i]}`).resize(200, 310, { fit: 'contain', background: '#e9e9e9' }).png().toBuffer();
  overlays.push({ input: image, left, top });
  const label = names[i]!.match(/_(\d{6})_Home/)?.[1] ?? names[i]!;
  overlays.push({ input: Buffer.from(`<svg width="220" height="30"><text x="4" y="20" font-size="16">${label}</text></svg>`), left, top: top + 312 });
}
await sharp({ create: { width: 1100, height: Math.ceil(names.length / 5) * 350, channels: 3, background: '#e9e9e9' } })
  .composite(overlays).png().toFile('.expo/reference-labels.png');
