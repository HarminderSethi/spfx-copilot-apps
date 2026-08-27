import { copyFile, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { context } from 'esbuild';

const sourceDirectory = path.dirname(fileURLToPath(import.meta.url));
const outputDirectory = path.resolve(sourceDirectory, '../../temp/visual-harness');
const port = Number(process.env.ZAVA_VISUAL_PORT || 4173);

await rm(outputDirectory, { force: true, recursive: true });
await mkdir(outputDirectory, { recursive: true });
await copyFile(path.join(sourceDirectory, 'index.html'), path.join(outputDirectory, 'index.html'));

const buildContext = await context({
  bundle: true,
  define: { 'process.env.NODE_ENV': '"development"' },
  entryNames: 'app',
  entryPoints: [path.join(sourceDirectory, 'index.tsx')],
  loader: { '.png': 'file', '.scss': 'local-css' },
  outdir: outputDirectory,
  sourcemap: true
});

const server = await buildContext.serve({ host: '127.0.0.1', port, servedir: outputDirectory });
console.log(`Zava visual review: http://127.0.0.1:${server.port}`);