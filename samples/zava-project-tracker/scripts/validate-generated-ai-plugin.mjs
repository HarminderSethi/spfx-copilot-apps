import fs from 'node:fs';
import path from 'node:path';
import appManifestPackage from '@microsoft/app-manifest';
import unzipper from 'unzipper';

const { AppManifestUtils } = appManifestPackage;
const root = path.resolve(import.meta.dirname, '..');
const agentZipPath = path.join(
  root,
  'sharepoint',
  'solution',
  'debug',
  'ClientSideAssets',
  'zava-ai-project-portfolio-agent.zip'
);
const STRING_LIMIT = 4000;
const METADATA_LIMITS = {
  name_for_human: 20,
  description_for_human: 100,
  description_for_model: 2048
};
const PARAMETER_TYPES = new Set(['string', 'array', 'boolean', 'integer', 'number']);
const PARAMETER_KEYS = new Set(['type', 'items', 'enum', 'description', 'default']);
const SIMPLE_PARAMETER_TYPES = new Set(['string', 'boolean', 'integer', 'number']);
const SIMPLE_PARAMETER_KEYS = new Set(['type', 'enum', 'description', 'default']);
const ALLOWED_PLACEHOLDERS = new Set(['{{TENANT_MCP_URL}}', '{{TENANT_ORIGIN}}']);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertString(value, label, maximum = STRING_LIMIT) {
  assert(typeof value === 'string' && value.trim().length > 0, `${label} must be a nonempty string.`);
  assert([...value].length <= maximum, `${label} exceeds the ${maximum}-character limit.`);
}

function assertOnlyKeys(value, allowed, label) {
  for (const key of Object.keys(value)) {
    assert(allowed.has(key), `${label} contains unsupported keyword '${key}'.`);
  }
}

function assertDefaultType(value, type, label) {
  if (value === undefined) {
    return;
  }
  const matches = type === 'array'
    ? Array.isArray(value)
    : type === 'integer'
      ? Number.isInteger(value)
      : typeof value === type;
  assert(matches, `${label}.default does not match type '${type}'.`);
}

function assertParameter(parameter, label, simple = false) {
  assert(parameter && typeof parameter === 'object' && !Array.isArray(parameter), `${label} must be an object.`);
  assertOnlyKeys(parameter, simple ? SIMPLE_PARAMETER_KEYS : PARAMETER_KEYS, label);
  const supportedTypes = simple ? SIMPLE_PARAMETER_TYPES : PARAMETER_TYPES;
  assert(supportedTypes.has(parameter.type), `${label}.type '${parameter.type}' is unsupported.`);
  if (simple) {
    if (parameter.description !== undefined) {
      assertString(parameter.description, `${label}.description`);
    }
  } else {
    assertString(parameter.description, `${label}.description`);
  }
  if (parameter.enum !== undefined) {
    assert(parameter.type === 'string', `${label}.enum is supported only for string parameters.`);
    assert(Array.isArray(parameter.enum) && parameter.enum.length > 0, `${label}.enum must be a nonempty array.`);
    parameter.enum.forEach((item, index) => assertString(item, `${label}.enum[${index}]`));
  }
  if (parameter.type === 'array') {
    assert(parameter.items !== undefined, `${label}.items is required for an array parameter.`);
    assertParameter(parameter.items, `${label}.items`, true);
  } else {
    assert(parameter.items === undefined, `${label}.items is supported only for array parameters.`);
  }
  assertDefaultType(parameter.default, parameter.type, label);
}

function assertParameters(parameters, label) {
  assert(parameters && typeof parameters === 'object' && !Array.isArray(parameters), `${label} must be an object.`);
  assertOnlyKeys(parameters, new Set(['type', 'properties', 'required']), label);
  assert(parameters.type === undefined || parameters.type === 'object', `${label}.type must be 'object'.`);
  assert(parameters.properties && typeof parameters.properties === 'object', `${label}.properties is required.`);
  for (const [name, parameter] of Object.entries(parameters.properties)) {
    assert(/^[A-Za-z0-9_]+$/.test(name), `${label} property '${name}' is not a valid plugin parameter name.`);
    assertParameter(parameter, `${label}.properties.${name}`);
  }
  if (parameters.required !== undefined) {
    assert(Array.isArray(parameters.required), `${label}.required must be an array.`);
    for (const name of parameters.required) {
      assert(typeof name === 'string' && Object.hasOwn(parameters.properties, name), `${label}.required references unknown property '${name}'.`);
    }
  }
}

function assertPublishedStringLimits(value, label = 'plugin') {
  if (typeof value === 'string') {
    if (!ALLOWED_PLACEHOLDERS.has(value)) {
      assert([...value].length <= STRING_LIMIT, `${label} exceeds the ${STRING_LIMIT}-character plugin string limit.`);
      assert(!value.includes('{{') && !value.includes('}}'), `${label} contains an unsupported deployment placeholder.`);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertPublishedStringLimits(item, `${label}[${index}]`));
    return;
  }
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => assertPublishedStringLimits(item, `${label}.${key}`));
  }
}

assert(fs.existsSync(agentZipPath), `Generated agent package not found at ${agentZipPath}. Run a production build and package-solution first.`);
const archive = await unzipper.Open.file(agentZipPath);
const pluginEntry = archive.files.find((entry) => entry.path === 'ai-plugin.json');
assert(pluginEntry, `Generated agent package ${agentZipPath} does not contain ai-plugin.json.`);
const plugin = JSON.parse((await pluginEntry.buffer()).toString('utf8'));
assert(plugin.$schema === 'https://developer.microsoft.com/json-schemas/copilot/plugin/v2.4/schema.json', 'Generated API plugin must target the v2.4 schema.');
assert(plugin.schema_version === 'v2.4', 'Generated API plugin schema_version must be v2.4.');
for (const [key, limit] of Object.entries(METADATA_LIMITS)) {
  if (plugin[key] !== undefined) {
    assertString(plugin[key], key, limit);
  }
}
assert(/^[A-Za-z0-9-]+$/.test(plugin.namespace), 'Plugin namespace contains unsupported characters.');
assertPublishedStringLimits(plugin);

const pluginWithoutPreviewRuntime = structuredClone(plugin);
delete pluginWithoutPreviewRuntime.runtimes;
const schemaErrors = await AppManifestUtils.validateAgainstSchema(pluginWithoutPreviewRuntime);
assert(schemaErrors.length === 0, `Generated API plugin metadata/functions fail Microsoft v2.4 schema validation:\n${schemaErrors.join('\n')}`);

assert(Array.isArray(plugin.functions) && plugin.functions.length > 0, 'Generated API plugin contains no functions.');
const functionsByName = new Map();
for (const fn of plugin.functions) {
  assertOnlyKeys(fn, new Set(['id', 'name', 'description', 'parameters', 'returns', 'states', 'capabilities']), `function '${fn.name || '<unnamed>'}'`);
  assert(/^[A-Za-z0-9_-]+$/.test(fn.name), `Function name '${fn.name}' is invalid.`);
  assert(!functionsByName.has(fn.name), `Function name '${fn.name}' is duplicated.`);
  assertString(fn.description, `function '${fn.name}'.description`);
  assertParameters(fn.parameters, `function '${fn.name}'.parameters`);
  functionsByName.set(fn.name, fn);
}

const remoteRuntimes = (plugin.runtimes || []).filter((runtime) => runtime.type === 'RemoteMCPServer');
assert(remoteRuntimes.length === 1, `Expected one RemoteMCPServer runtime, found ${remoteRuntimes.length}.`);
const runtime = remoteRuntimes[0];
assertOnlyKeys(runtime, new Set(['type', 'auth', 'run_for_functions', 'spec', 'output_template']), 'RemoteMCPServer runtime');
assert(runtime.auth?.type === 'None', 'Generated RemoteMCPServer runtime must use deployment-managed authentication type None.');
const runtimeUrl = runtime.spec?.url;
assert(runtimeUrl === '{{TENANT_MCP_URL}}' || URL.canParse(runtimeUrl), 'RemoteMCPServer URL must be the deployment placeholder or an absolute URL.');
assertOnlyKeys(runtime.spec, new Set(['url', 'mcp_tool_description']), 'RemoteMCPServer spec');
const tools = runtime.spec.mcp_tool_description?.tools;
assert(Array.isArray(tools), 'RemoteMCPServer inline MCP tool description must contain tools[].');
assert(tools.length === functionsByName.size, `Expected ${functionsByName.size} mirrored MCP tools, found ${tools.length}.`);
assert(new Set(runtime.run_for_functions || []).size === functionsByName.size, 'run_for_functions must contain every generated function exactly once.');

for (const tool of tools) {
  assertOnlyKeys(tool, new Set(['name', 'description', 'inputSchema', 'annotations', '_meta']), `MCP tool '${tool.name || '<unnamed>'}'`);
  const fn = functionsByName.get(tool.name);
  assert(fn, `MCP tool '${tool.name}' has no matching function.`);
  assert(tool.description === fn.description, `MCP tool '${tool.name}' description drifted from its function.`);
  assertParameters(tool.inputSchema, `MCP tool '${tool.name}'.inputSchema`);
  assert(JSON.stringify(tool.inputSchema) === JSON.stringify(fn.parameters), `MCP tool '${tool.name}' inputSchema drifted from function parameters.`);
  assert(tool.annotations?.readOnlyHint === true && tool.annotations?.destructiveHint === false, `MCP tool '${tool.name}' must retain SPFx read-only annotations.`);
  assert(tool._meta?.['openai/outputTemplate'] === 'ui://spfx/component.html', `MCP tool '${tool.name}' has an unexpected output template.`);
  assert(tool._meta?.['openai/widgetAccessible'] === true, `MCP tool '${tool.name}' must remain widget-accessible.`);
  assert(tool._meta?.['ui/csp']?.frameDomains?.[0] === '{{TENANT_ORIGIN}}', `MCP tool '${tool.name}' frame domain must use the deployment placeholder.`);
  assert(tool._meta?.['ui/csp']?.resourceDomains?.[0] === '{{TENANT_ORIGIN}}', `MCP tool '${tool.name}' resource domain must use the deployment placeholder.`);
}

for (const name of functionsByName.keys()) {
  assert(runtime.run_for_functions.includes(name), `run_for_functions is missing '${name}'.`);
}

const descriptions = [
  ...plugin.functions.map((fn) => fn.description),
  ...plugin.functions.flatMap((fn) => Object.values(fn.parameters.properties).map((parameter) => parameter.description).filter(Boolean))
];
console.log(`Verified generated API plugin v2.4 alignment: ${plugin.functions.length} functions, ${tools.length} mirrored MCP tools, ${descriptions.length} descriptions, and published string limits.`);