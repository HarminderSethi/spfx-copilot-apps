import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadIntentCatalog } from './load-intent-catalog.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const intents = await loadIntentCatalog(projectRoot);

function formatProperty(property) {
  return `  ${property.name}: z.${property.type}().describe(${JSON.stringify(property.description)}).optional()`;
}

function createPropertiesSource(intent) {
  const className = `${intent.name}CopilotComponent`;
  return `import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
${intent.properties.map(formatProperty).join(',\n')}
});

export type I${className}Properties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
`;
}

function createComponentSource(intent) {
  const className = `${intent.name}CopilotComponent`;
  return `import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { I${className}Properties } from './${className}Properties';

export default class ${className} extends IntentCopilotComponent<I${className}Properties> {
  protected readonly intentName: IntentName = '${intent.name}';
}
`;
}

function createManifest(intent) {
  const className = `${intent.name}CopilotComponent`;
  return {
    $schema: 'https://developer.microsoft.com/json-schemas/spfx/client-side-component-manifest.schema.json',
    id: intent.id,
    alias: className,
    componentType: 'CopilotComponent',
    copilotType: 'Ux',
    version: '*',
    manifestVersion: 2,
    capabilities: {
      availableDisplayModes: ['inline', 'fullscreen']
    },
    tools: [
      {
        name: `${intent.name}Tool`,
        description: { default: intent.description },
        propertiesSchema: {
          id: `$../../../lib/copilotComponents/${intent.folder}/${className}Properties.js:default;`
        }
      }
    ]
  };
}

function createBuildConfig() {
  const components = intents.map((intent) => {
    const className = `${intent.name}CopilotComponent`;
    return {
      entrypoint: `./lib/copilotComponents/${intent.folder}/${className}.js`,
      manifest: `./src/copilotComponents/${intent.folder}/${className}.manifest.json`
    };
  });

  const localizedResources = Object.fromEntries(intents.map((intent) => [
    `${intent.name}CopilotComponentStrings`,
    `lib/copilotComponents/${intent.folder}/loc/{locale}.js`
  ]));

  return {
    $schema: 'https://developer.microsoft.com/json-schemas/spfx-build/config.2.0.schema.json',
    version: '2.0',
    bundles: {
      'zava-it-concierge-copilot-components': { components }
    },
    externals: {},
    localizedResources
  };
}

for (const intent of intents) {
  const className = `${intent.name}CopilotComponent`;
  const componentRoot = path.join(projectRoot, 'src', 'copilotComponents', intent.folder);
  await mkdir(componentRoot, { recursive: true });
  await Promise.all([
    writeFile(path.join(componentRoot, `${className}.ts`), createComponentSource(intent), 'utf8'),
    writeFile(path.join(componentRoot, `${className}Properties.ts`), createPropertiesSource(intent), 'utf8'),
    writeFile(path.join(componentRoot, `${className}.manifest.json`), `${JSON.stringify(createManifest(intent), null, 2)}\n`, 'utf8')
  ]);
}

await writeFile(path.join(projectRoot, 'config', 'config.json'), `${JSON.stringify(createBuildConfig(), null, 2)}\n`, 'utf8');

const agentConfigPath = path.join(projectRoot, 'config', 'copilot-agent.json');
const agentConfig = JSON.parse(await readFile(agentConfigPath, 'utf8'));
agentConfig.agents[0].components = intents.map((intent) => intent.id);
await writeFile(agentConfigPath, `${JSON.stringify(agentConfig, null, 2)}\n`, 'utf8');

const declarativeAgentPath = path.join(projectRoot, 'copilot', 'declarativeAgent.json');
const declarativeAgent = JSON.parse(await readFile(declarativeAgentPath, 'utf8'));
declarativeAgent.conversation_starters = [
  { title: 'Submit a support ticket', text: 'Submit an IT support ticket because my video calls drop when I undock.' },
  { title: 'Diagnose my Surface', text: 'Run device diagnostics for battery drain on my Surface.' },
  { title: 'Review approval queue', text: 'Show all pending requests awaiting my approval.' },
  { title: 'Inspect fleet health', text: 'Show company fleet health by region and department.' },
  { title: 'Correlate an incident', text: 'Correlate signals for major incident INC-7091.' },
  { title: 'Explore capabilities', text: 'Explore what Zava IT Concierge can do.' }
];
await writeFile(declarativeAgentPath, `${JSON.stringify(declarativeAgent, null, 2)}\n`, 'utf8');

console.log(`Configured ${intents.length} intent components in one shared bundle.`);