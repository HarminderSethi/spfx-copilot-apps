import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const provenancePath = path.join(projectRoot, 'assets', 'asset-provenance.json');
const provenance = JSON.parse(await readFile(provenancePath, 'utf8'));
const errors = [];
const agentIconSpecifications = [
  { key: 'color', path: 'copilot/color.png', size: 192 },
  { key: 'outline', path: 'copilot/outline.png', size: 32 }
];

for (const asset of provenance.assets) {
  try {
    const bytes = await readFile(path.join(projectRoot, asset.path));
    const actualHash = createHash('sha256').update(bytes).digest('hex');
    if (actualHash !== asset.sha256) {
      errors.push(`${asset.path} hash changed.`);
    }
  } catch {
    errors.push(`${asset.path} is missing.`);
  }
}

try {
  const manifest = JSON.parse(await readFile(path.join(projectRoot, 'copilot', 'manifest.json'), 'utf8'));
  for (const icon of agentIconSpecifications) {
    if (manifest.icons?.[icon.key] !== path.basename(icon.path)) {
      errors.push(`copilot/manifest.json must reference ${icon.path} as its ${icon.key} icon.`);
    }
    const bytes = await readFile(path.join(projectRoot, icon.path));
    if (bytes.length <= 24 || bytes.subarray(1, 4).toString('ascii') !== 'PNG') {
      errors.push(`${icon.path} is not a readable PNG.`);
      continue;
    }
    const width = bytes.readUInt32BE(16);
    const height = bytes.readUInt32BE(20);
    if (width !== icon.size || height !== icon.size) {
      errors.push(`${icon.path} must be ${icon.size}x${icon.size}; found ${width}x${height}.`);
    }
  }
  if (manifest.accentColor !== '#0B5A7A') {
    errors.push('copilot/manifest.json accentColor must match the Zava IT Concierge steel icon field.');
  }
} catch {
  errors.push('Agent manifest or icon files could not be validated.');
}

if (errors.length > 0) {
  console.error(`Asset validation failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Asset validation passed: ${provenance.assets.length} local files, ${agentIconSpecifications.length} agent icons, ${provenance.pendingAcquisitions.length} documented fallbacks.`);
}