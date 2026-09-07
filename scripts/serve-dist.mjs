/* Minimal static server that mimics Vercel's cleanUrls + 404.html, for local
 * sanity-checking `dist/` before deploy. Usage: node scripts/serve-dist.mjs [port] */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const dist = resolve(import.meta.dirname, '..', 'dist');
const port = Number(process.argv[2] ?? 4477);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

async function tryFile(p) {
  try {
    const s = await stat(p);
    if (s.isFile()) return p;
  } catch {}
  return null;
}

createServer(async (req, res) => {
  const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
  let file =
    (await tryFile(join(dist, url))) ||
    (url.endsWith('/') && (await tryFile(join(dist, url, 'index.html')))) ||
    (await tryFile(join(dist, `${url}.html`))) || // cleanUrls
    (await tryFile(join(dist, url, 'index.html')));

  let status = 200;
  if (!file) {
    status = 404;
    file = await tryFile(join(dist, '404.html'));
  }
  if (!file) {
    res.writeHead(404).end('not found');
    return;
  }
  const body = await readFile(file);
  res.writeHead(status, {
    'content-type': TYPES[extname(file)] ?? 'application/octet-stream',
  });
  res.end(body);
}).listen(port, () => console.log(`serving dist/ at http://localhost:${port}`));
