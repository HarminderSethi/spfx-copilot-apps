import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import unzipper from 'unzipper';

const root = path.resolve(import.meta.dirname, '..');
const packageConfig = JSON.parse(fs.readFileSync(path.join(root, 'config', 'package-solution.json'), 'utf8'));
const bundleConfig = JSON.parse(fs.readFileSync(path.join(root, 'config', 'config.json'), 'utf8'));
const packagePath = path.resolve(root, 'sharepoint', packageConfig.paths.zippedPackage);
const agentZipPath = path.join(root, 'teams', 'zava-it-concierge.zip');
const releaseAssetsPath = path.join(root, 'release', 'assets');
const evidencePath = path.join(root, 'assets', 'release-evidence.json');
const maximumEntryBytes = Number(process.env.MAX_PRODUCTION_ENTRY_BYTES || 2 * 1024 * 1024);
const maximumJavaScriptBytes = Number(process.env.MAX_PRODUCTION_JS_BYTES || 4 * 1024 * 1024);
const maximumPackageBytes = Number(process.env.MAX_SPPKG_BYTES || 10 * 1024 * 1024);
const mediaPattern = /\.(?:avif|gif|jpe?g|png|svg|webp)$/i;
const hashedJavaScriptPattern = /_[0-9a-f]{20}\.js$/i;
const inlineImagePattern = /data:image\/[^;,]+;base64,([A-Za-z0-9+/=]+)/g;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const hash = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');

assert(fs.existsSync(packagePath), `Production package not found at ${packagePath}. Run npm run build first.`);
assert(fs.existsSync(agentZipPath), `Generated agent package not found at ${agentZipPath}. Run npm run build first.`);
const archive = await unzipper.Open.file(packagePath);
const files = archive.files.filter((entry) => entry.type === 'File');
const clientAssets = files.filter((entry) => entry.path.startsWith('ClientSideAssets/'));
const javascriptEntries = clientAssets.filter((entry) => entry.path.endsWith('.js'));
const primaryEntries = javascriptEntries.filter((entry) => /\/zava-it-concierge-copilot-components_[0-9a-f]{20}\.js$/i.test(entry.path));
const lazyChunks = javascriptEntries.filter((entry) => /\/chunk\./i.test(entry.path));
const packagedAgentEntry = clientAssets.find((entry) => entry.path.endsWith('/zava-it-concierge.zip'));
const staleEntries = clientAssets.filter((entry) => /hot-update|zava-it-concierge-copilot-components\.js$/i.test(entry.path));
const unhashedJavaScript = javascriptEntries.filter((entry) => !hashedJavaScriptPattern.test(entry.path));
const configuredBundleCount = Object.keys(bundleConfig.bundles).length;
const configuredComponents = Object.values(bundleConfig.bundles).flatMap((bundle) => bundle.components);
const configuredManifestCount = new Set(configuredComponents.map((component) => component.manifest)).size;
assert(configuredComponents.length === 31, `Expected 31 configured component entries, found ${configuredComponents.length}.`);
assert(configuredManifestCount === 31, `Expected 31 unique component manifests, found ${configuredManifestCount}.`);
assert(primaryEntries.length === configuredBundleCount, `Expected ${configuredBundleCount} primary production entry, found ${primaryEntries.length}.`);
assert(lazyChunks.length > 0, 'Expected purpose-gated lazy chunks for charts and geography.');
assert(staleEntries.length === 0, `Stale development output found: ${staleEntries.map((entry) => entry.path).join(', ')}`);
assert(unhashedJavaScript.length === 0, `Unhashed JavaScript found: ${unhashedJavaScript.map((entry) => entry.path).join(', ')}`);
assert(packagedAgentEntry, 'The production package does not contain zava-it-concierge.zip.');
assert(hash(await packagedAgentEntry.buffer()) === hash(fs.readFileSync(agentZipPath)), 'The SPPKG contains a stale generated agent ZIP.');

const agentArchive = await unzipper.Open.file(agentZipPath);
const agentIconHashes = {};
for (const iconName of ['color.png', 'outline.png']) {
  const iconEntry = agentArchive.files.find((entry) => entry.path === iconName);
  assert(iconEntry, `Generated agent package does not contain ${iconName}.`);
  const sourceBytes = fs.readFileSync(path.join(root, 'copilot', iconName));
  const packagedBytes = await iconEntry.buffer();
  assert(hash(packagedBytes) === hash(sourceBytes), `Generated agent package contains a stale ${iconName}.`);
  agentIconHashes[iconName] = hash(packagedBytes);
}

const packageModifiedAt = fs.statSync(packagePath).mtimeMs;
const releaseInputs = fs.existsSync(releaseAssetsPath) ? fs.readdirSync(releaseAssetsPath).map((file) => fs.statSync(path.join(releaseAssetsPath, file)).mtimeMs) : [];
const newestInputModifiedAt = Math.max(
  fs.statSync(path.join(root, 'config', 'package-solution.json')).mtimeMs,
  fs.statSync(path.join(root, 'config', 'config.json')).mtimeMs,
  fs.statSync(path.join(root, 'copilot', 'color.png')).mtimeMs,
  fs.statSync(path.join(root, 'copilot', 'outline.png')).mtimeMs,
  fs.statSync(agentZipPath).mtimeMs,
  ...releaseInputs
);
assert(packageModifiedAt >= newestInputModifiedAt, 'The SPPKG is older than its current configuration or build outputs; packaging may have failed silently.');

const mediaEntries = clientAssets.filter((entry) => mediaPattern.test(entry.path));
const mediaHashes = new Map();
for (const entry of mediaEntries) {
  const digest = hash(await entry.buffer());
  const paths = mediaHashes.get(digest) || [];
  paths.push(entry.path);
  mediaHashes.set(digest, paths);
}
const duplicateMedia = [...mediaHashes.values()].filter((paths) => paths.length > 1);
assert(duplicateMedia.length === 0, `Duplicate packaged media found: ${duplicateMedia.map((paths) => paths.join(' = ')).join('; ')}`);

const inlineImageHashes = new Map();
let inlineImageCount = 0;
let fluentIconFontPayload = false;
let totalJavaScriptBytes = 0;
let largestJavaScript = { path: '', bytes: 0 };
for (const entry of javascriptEntries) {
  const buffer = await entry.buffer();
  const source = buffer.toString('utf8');
  totalJavaScriptBytes += entry.uncompressedSize;
  if (entry.uncompressedSize > largestJavaScript.bytes) largestJavaScript = { path: entry.path, bytes: entry.uncompressedSize };
  fluentIconFontPayload ||= /FluentSystemIcons-(?:Regular|Filled)|data:font\/(?:woff|woff2)/.test(source);
  for (const match of source.matchAll(inlineImagePattern)) {
    inlineImageCount += 1;
    const digest = hash(Buffer.from(match[1], 'base64'));
    const paths = inlineImageHashes.get(digest) || [];
    paths.push(entry.path);
    inlineImageHashes.set(digest, paths);
  }
}
const duplicateInlineImages = [...inlineImageHashes.values()].filter((paths) => new Set(paths).size > 1);
assert(duplicateInlineImages.length === 0, `Inline image payloads are duplicated across chunks: ${duplicateInlineImages.map((paths) => [...new Set(paths)].join(' = ')).join('; ')}`);
assert(!fluentIconFontPayload, 'A Fluent icon-font payload was bundled; use named SVG icon imports and verify tree-shaking.');

const packageBytes = fs.statSync(packagePath).size;
assert(largestJavaScript.bytes <= maximumEntryBytes, `Largest JavaScript entry exceeds ${maximumEntryBytes} bytes.`);
assert(totalJavaScriptBytes <= maximumJavaScriptBytes, `Total production JavaScript exceeds ${maximumJavaScriptBytes} bytes.`);
assert(packageBytes <= maximumPackageBytes, `SPPKG exceeds ${maximumPackageBytes} bytes.`);
const agentBytes = fs.readFileSync(agentZipPath);
const packageBytesBuffer = fs.readFileSync(packagePath);
const report = {
  schemaVersion: 1,
  package: path.relative(root, packagePath).replaceAll('\\', '/'),
  packageBytes,
  packageSha256: hash(packageBytesBuffer),
  agentPackage: path.relative(root, agentZipPath).replaceAll('\\', '/'),
  agentPackageBytes: agentBytes.length,
  agentPackageSha256: hash(agentBytes),
  agentIconHashes,
  configuredBundles: configuredBundleCount,
  configuredComponents: configuredComponents.length,
  primaryJavaScriptEntries: primaryEntries.length,
  lazyJavaScriptChunks: lazyChunks.length,
  productionJavaScriptFiles: javascriptEntries.length,
  totalJavaScriptBytes,
  largestJavaScript,
  packagedMediaFiles: mediaEntries.length,
  duplicateMediaHashes: duplicateMedia.length,
  inlineImagePayloads: inlineImageCount,
  duplicateInlineImagePayloads: duplicateInlineImages.length,
  staleOutputFiles: staleEntries.length,
  fluentIconFontPayload,
  limits: { maximumEntryBytes, maximumJavaScriptBytes, maximumPackageBytes }
};

fs.writeFileSync(evidencePath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(`Verified production package output:\n${JSON.stringify(report, null, 2)}`);