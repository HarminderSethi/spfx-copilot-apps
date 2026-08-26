import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateGallery } from './gallery-model.mjs';

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = path.resolve(siteRoot, '..');
const result = await generateGallery({ repositoryRoot, siteRoot });

console.log(
  `[gallery] generated ${result.componentCount} components from ${result.sampleFolderCount} sample folders ` +
  `with ${result.contributorCount} contributors`,
);
if (result.excludedSamples.length > 0) {
  console.warn(`[gallery] excluded ${result.excludedSamples.length} sample(s) with missing metadata`);
}