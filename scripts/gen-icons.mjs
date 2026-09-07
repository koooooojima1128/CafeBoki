/* Rasterize the SVG sources into the PNGs Expo needs. Run: node scripts/gen-icons.mjs */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const full = readFileSync(resolve(root, 'assets/icon-src.svg'));
const fg = readFileSync(resolve(root, 'assets/icon-foreground-src.svg'));
const TEAL = '#2E7D6B';

async function png(svg, size, out, bg) {
  let img = sharp(svg, { density: 384 }).resize(size, size, {
    fit: 'contain',
    background: bg ?? { r: 0, g: 0, b: 0, alpha: 0 },
  });
  if (bg) img = img.flatten({ background: bg });
  await img.png().toFile(resolve(root, out));
  console.log('  ✓', out, `${size}x${size}`);
}

await png(full, 1024, 'assets/icon.png', TEAL); // iOS + fallback
await png(fg, 1024, 'assets/adaptive-icon.png'); // Android foreground (transparent)
await png(fg, 1024, 'assets/splash-icon.png'); // splash mark (transparent)
await png(full, 196, 'assets/favicon.png', TEAL); // web favicon
console.log('done');
