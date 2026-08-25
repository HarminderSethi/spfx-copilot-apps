import fs from 'node:fs';
import path from 'node:path';
import appManifestPackage from '@microsoft/app-manifest';
import unzipper from 'unzipper';

const { AppManifestUtils } = appManifestPackage;
const root = path.resolve(import.meta.dirname, '..');
const agentZipPath = path.join(root, 'sharepoint', 'solution', 'debug', 'ClientSideAssets', 'zava-it-concierge.zip');
const expectedToolCount = 31;
const stringLimit = 4000;
const metadataLimits = { name_for_human: 20, description_for_human: 100, description_for_model: 2048 };
const parameterTypes = new Set(['string', 'array', 'boolean', 'integer', 'number']);
const parameterKeys = new Set(['type', 'items', 'enum', 'description', 'default']);
const simpleParameterKeys = new Set(['type', 'enum', 'description', 'default']);
const allowedPlaceholders = new Set(['{{TENANT_MCP_URL}}', '{{TENANT_ORIGIN}}']);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertString(value, label, maximum = stringLimit) {
  assert(typeof value === 'string' && value.trim().length > 0, `${label} must be a nonempty string.`);
  assert([...value].length <= maximum, `${label} exceeds the ${maximum}-character limit.`);
}

function assertOnlyKeys(value, allowed, label) {
  for (const key of Object.keys(value)) assert(allowed.has(key), `${label} contains unsupported keyword '${key}'.`);
}

function assertParameter(parameter, label, simple = false) {
  assert(parameter && typeof parameter === 'object' && !Array.isArray(parameter), `${label} must be an object.`);
  assertOnlyKeys(parameter, simple ? simpleParameterKeys : parameterKeys, label);
  assert(parameterTypes.has(parameter.type) && (!simple || parameter.type !== 'array'), `${label}.type '${parameter.type}' is unsupported.`);
  if (!simple || parameter.description !== undefined) assertString(parameter.description, `${label}.description`);
  if (parameter.enum !== undefined) assert(parameter.type === 'string' && Array.isArray(parameter.enum) && parameter.enum.length > 0, `${label}.enum is invalid.`);
  if (parameter.type === 'array') {
    assert(parameter.items, `${label}.items is required for an array parameter.`);
    assertParameter(parameter.items, `${label}.items`, true);
  } else {
    assert(parameter.items === undefined, `${label}.items is supported only for arrays.`);
  }
}

function assertParameters(parameters, label) {
  assert(parameters && typeof parameters === 'object' && !Array.isArray(parameters), `${label} must be an object.`);
  assertOnlyKeys(parameters, new Set(['type', 'properties', 'required']), label);
  assert(parameters.type === undefined || parameters.type === 'object', `${label}.type must be object.`);
  assert(parameters.properties && typeof parameters.properties === 'object', `${label}.properties is required.`);
  for (const [name, parameter] of Object.entries(parameters.properties)) {
    assert(/^[A-Za-z0-9_]+$/.test(name), `${label} property '${name}' is invalid.`);
    assertParameter(parameter, `${label}.properties.${name}`);
  }
}

function assertPublishedStrings(value, label = 'plugin') {
  if (typeof value === 'string') {
    if (!allowedPlaceholders.has(value)) {
      assert([...value].length <= stringLimit, `${label} exceeds the ${stringLimit}-character limit.`);
      assert(!value.includes('{{') && !value.includes('}}'), `${label} contains an unsupported placeholder.`);
    }
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => assertPublishedStrings(item, `${label}[${index}]`));
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => assertPublishedStrings(item, `${label}.${key}`));
  }
}

assert(fs.existsSync(agentZipPath), `Generated agent package not found at ${agentZipPath}. Run npm run build first.`);
const archive = await unzipper.Open.file(agentZipPath);
const pluginEntry = archive.files.find((entry) => entry.path === 'ai-plugin.json');
assert(pluginEntry, 'Generated agent package does not contain ai-plugin.json.');
const plugin = JSON.parse((await pluginEntry.buffer()).toString('utf8'));
assert(plugin.$schema === 'https://developer.microsoft.com/json-schemas/copilot/plugin/v2.4/schema.json', 'Generated API plugin must target the v2.4 schema.');
assert(plugin.schema_version === 'v2.4', 'Generated API plugin schema_version must be v2.4.');
for (const [key, limit] of Object.entries(metadataLimits)) if (plugin[key] !== undefined) assertString(plugin[key], key, limit);
assertPublishedStrings(plugin);

const schemaCandidate = structuredClone(plugin);
delete schemaCandidate.runtimes;
const schemaErrors = await AppManifestUtils.validateAgainstSchema(schemaCandidate);
assert(schemaErrors.length === 0, `Generated API plugin fails Microsoft v2.4 schema validation:\n${schemaErrors.join('\n')}`);

assert(Array.isArray(plugin.functions) && plugin.functions.length === expectedToolCount, `Expected ${expectedToolCount} functions, found ${plugin.functions?.length || 0}.`);
const functionsByName = new Map();
for (const fn of plugin.functions) {
  assert(/^[A-Za-z0-9_-]+$/.test(fn.name), `Function name '${fn.name}' is invalid.`);
  assert(!functionsByName.has(fn.name), `Function name '${fn.name}' is duplicated.`);
  assertString(fn.description, `function '${fn.name}'.description`);
  assertParameters(fn.parameters, `function '${fn.name}'.parameters`);
  functionsByName.set(fn.name, fn);
}

const runtimes = (plugin.runtimes || []).filter((runtime) => runtime.type === 'RemoteMCPServer');
assert(runtimes.length === 1, `Expected one RemoteMCPServer runtime, found ${runtimes.length}.`);
const runtime = runtimes[0];
assert(runtime.auth?.type === 'None', 'RemoteMCPServer authentication must be deployment-managed type None.');
assert(runtime.spec?.url === '{{TENANT_MCP_URL}}' || URL.canParse(runtime.spec?.url), 'RemoteMCPServer URL is invalid.');
const tools = runtime.spec?.mcp_tool_description?.tools;
assert(Array.isArray(tools) && tools.length === expectedToolCount, `Expected ${expectedToolCount} mirrored MCP tools, found ${tools?.length || 0}.`);
assert(new Set(runtime.run_for_functions || []).size === expectedToolCount, 'run_for_functions must contain every function exactly once.');

for (const tool of tools) {
  const fn = functionsByName.get(tool.name);
  assert(fn, `MCP tool '${tool.name}' has no matching function.`);
  assert(tool.description === fn.description, `MCP tool '${tool.name}' description drifted from its function.`);
  assertParameters(tool.inputSchema, `MCP tool '${tool.name}'.inputSchema`);
  assert(JSON.stringify(tool.inputSchema) === JSON.stringify(fn.parameters), `MCP tool '${tool.name}' inputSchema drifted from its function.`);
  assert(tool.annotations?.readOnlyHint === true && tool.annotations?.destructiveHint === false, `MCP tool '${tool.name}' annotations are unsafe.`);
  assert(tool._meta?.['openai/outputTemplate'] === 'ui://spfx/component.html', `MCP tool '${tool.name}' has an unexpected output template.`);
  assert(tool._meta?.['openai/widgetAccessible'] === true, `MCP tool '${tool.name}' must be widget-accessible.`);
  assert(tool._meta?.['ui/csp']?.frameDomains?.[0] === '{{TENANT_ORIGIN}}', `MCP tool '${tool.name}' frame domain must use the tenant placeholder.`);
  assert(tool._meta?.['ui/csp']?.resourceDomains?.[0] === '{{TENANT_ORIGIN}}', `MCP tool '${tool.name}' resource domain must use the tenant placeholder.`);
}

for (const name of functionsByName.keys()) assert(runtime.run_for_functions.includes(name), `run_for_functions is missing '${name}'.`);
const descriptions = plugin.functions.flatMap((fn) => [fn.description, ...Object.values(fn.parameters.properties).map((parameter) => parameter.description).filter(Boolean)]);
console.log(`Verified generated API plugin v2.4 alignment: ${plugin.functions.length} functions, ${tools.length} mirrored MCP tools, and ${descriptions.length} descriptions.`);