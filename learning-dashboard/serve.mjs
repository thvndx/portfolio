import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const allowed = new Set(['index.html', 'styles.css', 'app.mjs', 'core.mjs', 'roadmap.mjs']);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8' };
const server = http.createServer(async (req, res) => {
  const headers = { 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Cache-Control': 'no-store', 'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'" };
  if (req.headers.host !== 'localhost:4317' && req.headers.host !== '127.0.0.1:4317') { res.writeHead(403, headers); res.end('Use http://localhost:4317'); return; }
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { ...headers, Allow: 'GET, HEAD' }); res.end('Method not allowed'); return; }
  let name;
  try { name = decodeURIComponent(new URL(req.url, 'http://localhost:4317').pathname).slice(1) || 'index.html'; }
  catch { res.writeHead(400, headers); res.end('Invalid path'); return; }
  if (!allowed.has(name)) { res.writeHead(404, headers); res.end('Not found'); return; }
  try {
    const body = await readFile(resolve(root, name));
    res.writeHead(200, { ...headers, 'Content-Type': mime[extname(name)] });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.writeHead(500, headers); res.end('Could not read dashboard file.'); }
});
server.on('error', err => {
  console.error(err.code === 'EADDRINUSE' ? 'Port 4317 is already in use. If Learning desk is already running, open http://localhost:4317. Keep this fixed address to retain your saved progress.' : err.message);
  process.exitCode = 1;
});
server.listen(4317, '127.0.0.1', () => console.log('Learning desk is ready: http://localhost:4317\nKeep this terminal open. Press Ctrl+C to stop.'));
