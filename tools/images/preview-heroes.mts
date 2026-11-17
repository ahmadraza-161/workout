import { readdirSync } from 'node:fs';
import sharp from 'sharp';
const names = readdirSync('assets/images/heroes/optimized').sort();
const composite: sharp.OverlayOptions[] = [];
for (let i = 0; i < names.length; i++) {
  const tile = await sharp(`assets/images/heroes/optimized/${names[i]}`).resize(200, 225, { fit: 'contain', background: '#263040' })
    .flatten({ background: '#263040' }).png().toBuffer();
  composite.push({ input: tile, left: (i % 5) * 220, top: Math.floor(i / 5) * 260 });
  composite.push({ input: Buffer.from(`<svg width="220" height="28"><text x="2" y="18" font-size="12" fill="white">${names[i].replace('.png', '')}</text></svg>`),
    left: (i % 5) * 220, top: Math.floor(i / 5) * 260 + 228 });
}
await sharp({ create: { width: 1100, height: Math.ceil(names.length / 5) * 260, channels: 3, background: '#263040' } })
  .composite(composite).png().toFile('.expo/heroes-qa.png');
