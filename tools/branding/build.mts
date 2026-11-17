// Export the original AI character artwork as a consistent app identity.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { APP_NAME, APP_TAGLINE } from '../../app.config.ts';

const ROOT = join(import.meta.dirname, '../..');
const OUT = join(ROOT, 'assets/images');
const BRAND = join(OUT, 'branding');
const svg = (body: string, width = 1024, height = width): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`;
const tile = (rounded = false): string => `<defs><linearGradient id="brand" x2="0" y2="1"><stop stop-color="#4A0B24"/><stop offset="1" stop-color="#BA2346"/></linearGradient></defs><rect width="1024" height="1024" ${rounded ? 'rx="224"' : ''} fill="url(#brand)"/>`;
mkdirSync(BRAND, { recursive: true });
const source = join(import.meta.dirname, 'characters.png');
const characters = await sharp(source).trim().resize(800, 800, { fit: 'inside' }).png().toBuffer();
const image = (x: number, y: number, size: number): string =>
  `<image x="${x}" y="${y}" width="${size}" height="${size}" href="data:image/png;base64,${characters.toString('base64')}"/>`;
const logo = (): string => `${tile(true)}<defs><clipPath id="logo-mask"><rect width="1024" height="1024" rx="224"/></clipPath></defs><g clip-path="url(#logo-mask)">${image(50, 100, 924)}</g>`;
const save = async (name: string, body: string, size = 1024): Promise<void> => {
  await sharp(Buffer.from(svg(body))).resize(size, size).png().toFile(join(OUT, name));
};
await save('icon.png', tile() + image(50, 100, 924));
await save('android-icon-background.png', tile());
await save('android-icon-foreground.png', image(212, 250, 600));
// A clean bodyweight glyph stays recognisable in Android's single-colour theme.
const monochrome = readFileSync(join(import.meta.dirname, 'mark.svg'), 'utf8')
  .replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replaceAll('#D5FF5F', '#FFFFFF');
await save('android-icon-monochrome.png', `<g transform="translate(143 143) scale(.72)">${monochrome}</g>`);
await save('splash-icon.png', logo());
await save('favicon.png', tile() + image(50, 100, 924), 64);
await sharp(characters).toFile(join(BRAND, 'workoutstride-characters.png'));
writeFileSync(join(BRAND, 'workoutstride-logo.svg'), svg(logo()));
const wordmark = `<g transform="translate(68 98) scale(.25)">${logo()}</g><text x="358" y="250" font-family="Arial, sans-serif" font-size="88" font-weight="700" letter-spacing="-3" fill="#111827">${APP_NAME}</text><text x="362" y="316" font-family="Arial, sans-serif" font-size="30" fill="#536174">${APP_TAGLINE}</text>`;
writeFileSync(join(BRAND, 'workoutstride-wordmark.svg'), svg(wordmark, 1024, 448));
writeFileSync(join(BRAND, 'workoutstride-wordmark-dark.svg'), svg(wordmark.replace('#111827', '#FFFFFF').replace('#536174', '#AAB5C7'), 1024, 448));
await sharp(Buffer.from(svg(`<rect width="1024" height="448" fill="#FFFFFF"/>${wordmark}`, 1024, 448)))
  .png().toFile(join(BRAND, 'workoutstride-brand-preview.png'));
console.log(`${APP_NAME}: character logo, launcher, adaptive, monochrome, splash, favicon and wordmarks built.`);
