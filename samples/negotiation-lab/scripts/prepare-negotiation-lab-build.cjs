const fs = require('node:fs');
const path = require('node:path');

const sampleRoot = path.resolve(__dirname, '..');
const generatedDirectories = [
  path.join(sampleRoot, 'teams'),
  path.join(sampleRoot, 'sharepoint', 'solution'),
  path.join(sampleRoot, 'dist'),
  path.join(sampleRoot, 'release', 'assets')
];

function removeMatchingFiles(directory, extension) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(extension)) {
      fs.rmSync(path.join(directory, entry.name));
    }
  }
}

removeMatchingFiles(generatedDirectories[0], '.zip');
removeMatchingFiles(generatedDirectories[1], '.sppkg');
fs.rmSync(path.join(generatedDirectories[1], 'debug'), {
  force: true,
  recursive: true
});
fs.rmSync(generatedDirectories[2], { force: true, recursive: true });
fs.rmSync(generatedDirectories[3], { force: true, recursive: true });

console.log('Cleared generated Teams, SharePoint and client-side build artifacts.');
