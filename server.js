import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';

const BASE_DIR = fileURLToPath(new URL('.', import.meta.url));
const INDEX_PATH = join(BASE_DIR, 'index.html');

const PORT = process.env.PORT || 8000;
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const safePath = url.pathname === '/' ? '/index.html' : url.pathname;
    const candidatePath = decodeURIComponent(safePath.replace(/^\/+/, ''));
    const filePath = join(BASE_DIR, candidatePath);

    if (!filePath.startsWith(BASE_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('Directory access is not allowed.');
      return;
    }

    let fileStat;
    try {
      fileStat = await stat(filePath);
    } catch (error) {
      if (error.code === 'ENOENT' && (req.method === 'GET' || req.method === 'HEAD')) {
        const fallback = await readFile(INDEX_PATH);
        res.writeHead(200, { 'Content-Type': MIME_TYPES['.html'] });
        res.end(req.method === 'HEAD' ? undefined : fallback);
        return;
      }
      throw error;
    }

    if (fileStat.isDirectory()) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('Directory access is not allowed.');
      return;
    }

    const ext = extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const content = await readFile(filePath);

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
    res.end('Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`Email Generator UI running at http://localhost:${PORT}`);
});
