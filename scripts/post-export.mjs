/* After `expo export --platform web`: make Vercel/static hosts serve the
 * Expo Router "not found" page for unmatched routes by copying it to 404.html. */
import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve(import.meta.dirname, '..', 'dist');
const src = resolve(dist, '+not-found.html');
const dest = resolve(dist, '404.html');

if (existsSync(src)) {
  copyFileSync(src, dest);
  console.log('post-export: wrote dist/404.html');
} else {
  console.warn('post-export: dist/+not-found.html not found — skipped 404.html');
}
