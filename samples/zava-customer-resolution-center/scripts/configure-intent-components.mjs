import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const componentsRoot = path.join(root, 'src', 'copilotComponents');
const definitions = [
  ['TriageCustomerIssue',['customerHint','productHint','channel','language']],
  ['GetPriorityServiceQueue',['region','product','period','focus']],
  ['ExploreCustomerHealth',['customerId','period','product','selectedId']],
  ['BuildResolutionPlan',['caseId','focus','selectedId']],
  ['StartExpertSwarm',['caseId','region','focus','selectedId']],
  ['DetectServiceIncident',['caseId','product','region','period','similarityThreshold']],
  ['ReviewIncidentResponse',['caseId','focus','selectedId']],
  ['ReviewServiceRecovery',['caseId','amount','focus','selectedId']],
  ['ComposeCustomerUpdate',['caseId','channel','language','focus']],
  ['TrackResolutionOutcome',['caseId','customerId','period','selectedId']],
  ['CreateKnowledgeFromResolution',['caseId','product','language','focus']],
  ['ExploreServicePerformance',['period','region','product','focus','selectedId']],
  ['ExploreRegionalServiceImpact',['period','region','product','selectedId']],
  ['ExploreRecurringServiceDrivers',['period','product','focus','selectedId']],
  ['DiagnoseCaseEvidence',['caseId','product','period','selectedId']],
  ['ReviewEntitlementCoverage',['caseId','customerId','product','region']],
  ['ManageCaseEscalation',['caseId','region','focus','selectedId']],
  ['BalanceServiceWorkload',['period','region','focus','selectedId']],
  ['CoordinateFieldService',['caseId','region','period','selectedId']],
  ['ManageCustomerCommitments',['caseId','customerId','period','selectedId']],
  ['RunServiceQualityReview',['caseId','focus','selectedId']],
  ['PlanCustomerWinBack',['customerId','focus','amount','period']],
  ['ExploreAgentCapabilities',['query','focus']]
];
const descriptions = new Map([
  ['TriageCustomerIssue','Use when a customer reports a new or unresolved issue and a reviewable case intake is needed. Do not use after a case and resolution goal already exist.'],
  ['GetPriorityServiceQueue','Use when a representative asks which cases need judgment or attention next. Do not use for diagnosis or resolution detail of one named case.'],
  ['ExploreCustomerHealth','Use when asked about one customer relationship or the cross-customer health and renewal-risk portfolio. Do not use for service-operations backlog analysis.'],
  ['BuildResolutionPlan','Use when a named case needs an editable, evidence-linked resolution plan. Do not use to diagnose a cause, declare an incident, or approve recovery.'],
  ['StartExpertSwarm','Use when a case needs named specialists for one bounded decision question. Do not use for queue reassignment, escalation, or general workload balancing.'],
  ['DetectServiceIncident','Use when asked whether similar cases form an emerging incident or cohort. Do not use to declare, escalate, monitor, or close the incident.'],
  ['ReviewIncidentResponse','Use when a person must decide whether to declare, monitor, escalate, or close an incident candidate. Do not use for exploratory similarity analysis.'],
  ['ReviewServiceRecovery','Use when a named case needs a fair, policy-aware recovery or concession decision. Do not use to draft customer communication or a win-back plan.'],
  ['ComposeCustomerUpdate','Use when a named case needs an accurate localized customer-facing update. Do not use for internal diagnosis, recovery approval, or commitment governance.'],
  ['TrackResolutionOutcome','Use when asked whether a named case restored the customer promise and remained resolved. Do not use for aggregate service performance or quality review.'],
  ['CreateKnowledgeFromResolution','Use when a verified case resolution should become a reusable knowledge draft. Do not use for unverified diagnosis or direct publication.'],
  ['ExploreServicePerformance','Use when leadership asks how service demand, backlog, or resolution throughput is moving over time. Do not use for geography, recurring drivers, or one named case.'],
  ['ExploreRegionalServiceImpact','Use when leadership asks which regions have the most cases, SLA risk, or recovery exposure. Do not use for demand trends, recurring drivers, or one named customer.'],
  ['ExploreRecurringServiceDrivers','Use when leadership asks which recurring causes create the most case volume or customer effort. Do not use for geography, demand trends, or one incident cohort.'],
  ['DiagnoseCaseEvidence','Use when a named case needs competing hypotheses compared against verified, contrary, and missing evidence. Do not use to confirm an unsupported cause or build the final plan.'],
  ['ReviewEntitlementCoverage','Use when a named customer or case needs contract, warranty, SLA, exclusion, or remedy coverage explained. Do not use to approve compensation.'],
  ['ManageCaseEscalation','Use when a named case may move to another queue or owner with evidence and acceptance criteria. Do not use to recruit specialists or balance the whole team.'],
  ['BalanceServiceWorkload','Use when leadership asks where capacity creates SLA risk or how work could move across teams. Do not use for one case escalation or silent reassignment.'],
  ['CoordinateFieldService','Use when a named case requires site visits, technicians, parts, routes, or access windows. Do not use for digital-only resolution work.'],
  ['ManageCustomerCommitments','Use when company or customer promises need evidence, owners, due dates, renegotiation, or escalation. Do not use to infer completion or draft general updates.'],
  ['RunServiceQualityReview','Use when a resolved or active case needs transparent correctness, compliance, communication, or customer-effort review. Do not use opaque AI scoring or aggregate performance analysis.'],
  ['PlanCustomerWinBack','Use when a customer relationship needs a guarded multi-action trust and retention plan. Do not use for one recovery concession or automatic outreach.'],
  ['ExploreAgentCapabilities','Use when the user asks what the agent can do or needs help choosing a customer-resolution scenario. Do not use when a specific operational request is already clear.']
]);
const numeric = new Set(['amount','similarityThreshold']);
const componentEntries = [];
const componentIds = [];

for (const [key, fields] of definitions) {
  const folder = `${key[0].toLowerCase()}${key.slice(1)}`;
  const folderPath = path.join(componentsRoot, folder);
  const manifestPath = path.join(folderPath, `${key}CopilotComponent.manifest.json`);
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing Yeoman manifest for ${key}`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  componentIds.push(manifest.id);
  fs.writeFileSync(path.join(folderPath, `${key}CopilotComponent.tsx`), `import ServiceCopilotComponentBase from '../../shared/ServiceCopilotComponentBase';\nimport type { IServiceProperties, ServiceIntentKey } from '../../shared/catalog';\n\nexport default class ${key}CopilotComponent extends ServiceCopilotComponentBase<IServiceProperties> {\n  protected intentKey: ServiceIntentKey = '${key}';\n}\n`);
  const schemaFields = fields.map((field) => `  ${field}: z.${numeric.has(field) ? 'number' : 'string'}().optional().describe('${field} extracted from the user request when provided.')`);
  fs.writeFileSync(path.join(folderPath, `${key}CopilotComponentProperties.ts`), `import { z } from 'zod';\nimport zodToJsonSchema from 'zod-to-json-schema';\n\nconst schema = z.object({\n${schemaFields.join(',\n')}\n});\nexport type I${key}CopilotComponentProperties = z.infer<typeof schema>;\nexport default zodToJsonSchema(schema);\n`);
  fs.rmSync(path.join(folderPath, 'components'), { recursive: true, force: true });
  fs.rmSync(path.join(folderPath, 'loc'), { recursive: true, force: true });
  manifest.alias = `${key}CopilotComponent`;
  manifest.tools[0].name = key;
  manifest.tools[0].description.default = descriptions.get(key);
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  componentEntries.push({ entrypoint: `./lib/copilotComponents/${folder}/${key}CopilotComponent.js`, manifest: `./src/copilotComponents/${folder}/${key}CopilotComponent.manifest.json` });
}

const configPath = path.join(root, 'config', 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
config.bundles = { 'zava-customer-resolution-components': { components: componentEntries } };
config.localizedResources = {};
fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

const agentPath = path.join(root, 'config', 'copilot-agent.json');
const agent = JSON.parse(fs.readFileSync(agentPath, 'utf8'));
agent.agents[0].name.default = 'Zava Customer Resolution';
agent.agents[0].description.default = 'Turn fragmented customer evidence into safe, accountable resolution action.';
agent.agents[0].components = componentIds;
fs.writeFileSync(agentPath, `${JSON.stringify(agent, null, 2)}\n`);
const starters = JSON.parse(fs.readFileSync(path.join(root, 'config', 'conversation-starters.json'), 'utf8')).starters;
const declarativePath = path.join(root, 'copilot', 'declarativeAgent.json');
const declarative = JSON.parse(fs.readFileSync(declarativePath, 'utf8'));
declarative.conversation_starters = starters.map(({ title, text }) => ({ title, text }));
fs.writeFileSync(declarativePath, `${JSON.stringify(declarative, null, 2)}\n`);
console.log(`Configured ${definitions.length} immutable service components in one shared bundle.`);
