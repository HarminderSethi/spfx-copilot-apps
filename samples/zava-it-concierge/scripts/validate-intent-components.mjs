import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { loadIntentCatalog } from './load-intent-catalog.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

function check(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}

function checkUnique(intents, field) {
  const values = intents.map((intent) => intent[field]);
  check(new Set(values).size === values.length, `Catalog field '${field}' must be unique.`);
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(projectRoot, relativePath), 'utf8'));
}

async function validateIntent(intent) {
  const componentRoot = path.join(projectRoot, 'src', 'copilotComponents', intent.folder);
  const className = `${intent.name}CopilotComponent`;
  const manifestPath = path.join(componentRoot, `${className}.manifest.json`);
  const propertiesPath = path.join(componentRoot, `${className}Properties.ts`);
  const componentPath = path.join(componentRoot, `${className}.ts`);

  await Promise.all([access(manifestPath), access(propertiesPath), access(componentPath)]).catch(() => {
    errors.push(`${intent.name} is missing generated component files.`);
  });

  const propertyNames = new Set(intent.properties.map((property) => property.name));
  check(propertyNames.size === intent.properties.length, `${intent.name} has duplicate prompt properties.`);
  check(Object.keys(intent.previewProperties).every((key) => propertyNames.has(key)), `${intent.name} preview uses an unknown property.`);
  for (const property of intent.properties) {
    const previewValue = intent.previewProperties[property.name];
    check(previewValue !== undefined, `${intent.name}.${property.name} needs a preview value.`);
    check(typeof previewValue === property.type, `${intent.name}.${property.name} preview type must be ${property.type}.`);
  }

  try {
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    const expectedSchemaReference = `$../../../lib/copilotComponents/${intent.folder}/${className}Properties.js:default;`;
    check(manifest.id === intent.id, `${intent.name} manifest GUID does not match the catalog.`);
    check(manifest.alias === className, `${intent.name} manifest alias does not match the class name.`);
    check(manifest.tools?.length === 1, `${intent.name} must expose exactly one tool.`);
    check(manifest.tools?.[0]?.name === `${intent.name}Tool`, `${intent.name} tool name is incorrect.`);
    check(manifest.tools?.[0]?.description?.default === intent.description, `${intent.name} tool description is not catalog-driven.`);
    check(manifest.tools?.[0]?.propertiesSchema?.id === expectedSchemaReference, `${intent.name} property schema reference is incorrect.`);
  } catch {
    errors.push(`${intent.name} manifest could not be read.`);
  }

  try {
    const propertiesSource = await readFile(propertiesPath, 'utf8');
    for (const property of intent.properties) {
      check(propertiesSource.includes(`${property.name}: z.${property.type}()`), `${intent.name}.${property.name} is missing from its Zod schema.`);
    }
    check((propertiesSource.match(/\.optional\(\)/g) ?? []).length === intent.properties.length, `${intent.name} prompt properties must all be optional.`);
  } catch {
    // Missing files are reported above.
  }

  try {
    const componentSource = await readFile(componentPath, 'utf8');
    check(componentSource.includes('extends IntentCopilotComponent'), `${intent.name} does not extend the shared intent component.`);
    check(new RegExp(`intentName(?:\\s*:\\s*IntentName)?\\s*=\\s*'${intent.name}'`).test(componentSource), `${intent.name} does not bind its catalog intent.`);
  } catch {
    // Missing files are reported above.
  }
}

const intents = await loadIntentCatalog(projectRoot);
check(intents.length === 31, `Expected 31 intents, found ${intents.length}.`);
for (const field of ['name', 'folder', 'id', 'route']) {
  checkUnique(intents, field);
}

for (const intent of intents) {
  check(intent.description.startsWith('Use '), `${intent.name} description must start with a positive routing boundary.`);
  check(intent.description.includes('Do not use'), `${intent.name} description must include a negative routing boundary.`);
  await validateIntent(intent);
}

const buildConfig = await readJson('config/config.json');
const bundleNames = Object.keys(buildConfig.bundles ?? {});
check(bundleNames.length === 1, `Expected one shared bundle, found ${bundleNames.length}.`);
const bundleComponents = buildConfig.bundles?.['zava-it-concierge-copilot-components']?.components ?? [];
check(bundleComponents.length === intents.length, `Shared bundle must contain ${intents.length} components.`);
for (const intent of intents) {
  const className = `${intent.name}CopilotComponent`;
  check(bundleComponents.some((component) => component.entrypoint === `./lib/copilotComponents/${intent.folder}/${className}.js`), `${intent.name} is missing from the shared bundle.`);
}
check(Object.keys(buildConfig.localizedResources ?? {}).length === intents.length, 'Localized resource count must match the catalog.');

const agentConfig = await readJson('config/copilot-agent.json');
const agentIds = agentConfig.agents?.[0]?.components ?? [];
check(agentIds.length === intents.length, 'Agent component count must match the catalog.');
check(intents.every((intent, index) => agentIds[index] === intent.id), 'Agent component order or GUIDs do not match the catalog.');

const plugin = await readJson('copilot/ai-plugin.json');
check(plugin.name_for_human.length <= 20, 'Plugin human name exceeds the 20-character limit.');
check(plugin.description_for_human.length <= 100, 'Plugin human description exceeds the 100-character limit.');
check(plugin.description_for_model.length <= 8000, 'Plugin model description exceeds the 8,000-character limit.');

const declarativeAgent = await readJson('copilot/declarativeAgent.json');
const starters = declarativeAgent.conversation_starters ?? [];
const expectedStarters = [
  ['Submit a support ticket', 'Submit an IT support ticket because my video calls drop when I undock.', 'ReportItIssue'],
  ['Diagnose my Surface', 'Run device diagnostics for battery drain on my Surface.', 'RunDeviceDiagnostics'],
  ['Review approval queue', 'Show all pending requests awaiting my approval.', 'GetApprovalQueue'],
  ['Inspect fleet health', 'Show company fleet health by region and department.', 'GetFleetHealth'],
  ['Correlate an incident', 'Correlate signals for major incident INC-7091.', 'CorrelateMajorIncident'],
  ['Explore capabilities', 'Explore what Zava IT Concierge can do.', 'ExploreAgentCapabilities']
];
check(starters.length === expectedStarters.length, `Expected ${expectedStarters.length} conversation starters, found ${starters.length}.`);
expectedStarters.forEach(([title, text, target], index) => {
  check(starters[index]?.title === title, `Starter ${index + 1} title must target ${target}.`);
  check(starters[index]?.text === text, `Starter ${index + 1} prompt must target ${target}.`);
});
check(starters.at(-1)?.text === 'Explore what Zava IT Concierge can do.', 'The final starter must open capability exploration.');

if (errors.length > 0) {
  console.error(`Intent catalog validation failed with ${errors.length} issue(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Intent catalog validation passed: ${intents.length} intents, 1 shared bundle, ${starters.length} starters.`);
}