import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import unzipper from 'unzipper';

const root = path.resolve(import.meta.dirname, '..');
const packageConfig = JSON.parse(fs.readFileSync(path.join(root, 'config', 'package-solution.json'), 'utf8'));
const packagePath = path.resolve(root, 'sharepoint', packageConfig.paths.zippedPackage);
const maximumJavaScriptBytes = Number(process.env.MAX_PRODUCTION_JS_BYTES || 1024 * 1024);
const maximumPackageBytes = Number(process.env.MAX_SPPKG_BYTES || 10 * 1024 * 1024);
const mediaPattern = /\.(?:avif|gif|jpe?g|png|svg|webp)$/i;
const hashedJavaScriptPattern = /_[0-9a-f]{20}\.js$/i;
const inlineImagePattern = /data:image\/[^;,]+;base64,([A-Za-z0-9+/=]+)/g;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const hash = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');

assert(fs.existsSync(packagePath), `Production package not found at ${packagePath}. Run npm run build first.`);
const archive = await unzipper.Open.file(packagePath);
const files = archive.files.filter((entry) => entry.type === 'File');
const clientAssets = files.filter((entry) => entry.path.startsWith('ClientSideAssets/'));
const javascriptEntries = clientAssets.filter((entry) => entry.path.endsWith('.js'));
const staleJavaScriptEntries = javascriptEntries.filter((entry) => !hashedJavaScriptPattern.test(entry.path));
assert(javascriptEntries.length > 0, 'The production package contains no client-side JavaScript.');
assert(staleJavaScriptEntries.length === 0, `Unhashed/stale JavaScript found: ${staleJavaScriptEntries.map((entry) => entry.path).join(', ')}`);

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
  if (entry.uncompressedSize > largestJavaScript.bytes) {
    largestJavaScript = { path: entry.path, bytes: entry.uncompressedSize };
  }
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
assert(duplicateInlineImages.length === 0, `Inline image payloads are duplicated across bundles: ${duplicateInlineImages.map((paths) => [...new Set(paths)].join(' = ')).join('; ')}`);
assert(!fluentIconFontPayload, 'A Fluent icon-font payload was bundled; use supported named SVG icon imports and verify tree-shaking.');

const packageBytes = fs.statSync(packagePath).size;
const report = {
  package: path.relative(root, packagePath).replaceAll('\\', '/'),
  packageBytes,
  productionJavaScriptFiles: javascriptEntries.length,
  totalJavaScriptBytes,
  largestJavaScript,
  packagedMediaFiles: mediaEntries.length,
  duplicateMediaHashes: duplicateMedia.length,
  inlineImagePayloads: inlineImageCount,
  duplicateInlineImagePayloads: duplicateInlineImages.length,
  fluentIconFontPayload,
  investigation: {
    javascriptEntryOverLimit: largestJavaScript.bytes > maximumJavaScriptBytes,
    packageOverLimit: packageBytes > maximumPackageBytes,
    maximumJavaScriptBytes,
    maximumPackageBytes
  }
};

console.log(`Verified production package output:\n${JSON.stringify(report, null, 2)}`);