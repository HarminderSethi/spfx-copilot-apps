import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = path.join(siteRoot, 'dist');
const basePath = '/spfx-copilot-components';
const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml; charset=utf-8'],
]);

async function fileForRequest(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, 'http://127.0.0.1').pathname);
  if (pathname !== basePath && !pathname.startsWith(`${basePath}/`)) return undefined;
  const relativePath = pathname.slice(basePath.length).replace(/^\//, '');
  let filePath = path.resolve(distRoot, relativePath || 'index.html');
  if (!filePath.startsWith(distRoot)) return undefined;

  try {
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) filePath = path.join(filePath, 'index.html');
    await stat(filePath);
    return filePath;
  } catch {
    return path.join(distRoot, '404.html');
  }
}

const server = createServer(async (request, response) => {
  const filePath = await fileForRequest(request.url ?? '/');
  if (!filePath) {
    response.writeHead(404).end('Not found');
    return;
  }
  const extension = path.extname(filePath).toLocaleLowerCase('en-US');
  response.writeHead(filePath.endsWith('404.html') ? 404 : 200, {
    'Content-Type': contentTypes.get(extension) ?? 'application/octet-stream',
  });
  createReadStream(filePath).pipe(response);
});

server.listen(4321, '127.0.0.1', () => {
  console.log(`Test server listening at http://127.0.0.1:4321${basePath}/`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}