import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const componentsRoot = path.join(root, 'src', 'copilotComponents');

const definitions = [
  ['GetMyWorkSummary', 'getMyWorkSummary', 'Summarize the signed-in user\'s priority work, capacity, blockers, and time-sensitive actions.', ['period', 'projectId', 'focus', 'includeCompleted']],
  ['GetMyTasks', 'getMyTasks', 'Show the signed-in user\'s tasks filtered and grouped for delivery decisions.', ['projectId', 'status', 'due', 'priority', 'groupBy']],
  ['GetMyCapacity', 'getMyCapacity', 'Analyze the signed-in user\'s committed and forecast capacity over a selected period.', ['startDate', 'endDate', 'projectId', 'includeOperationalWork', 'scenario']],
  ['GetMyGoalContributions', 'getMyGoalContributions', 'Map the signed-in user\'s work to strategic objectives and measurable key results.', ['objectiveId', 'period', 'projectId', 'includeIndirect']],
  ['SubmitWeeklyUpdate', 'submitWeeklyUpdate', 'Prepare an editable weekly project update for review before mock submission.', ['projectId', 'weekEnding', 'accomplishments', 'nextSteps', 'blockers', 'confidence']],
  ['SubmitTimesheet', 'submitTimesheet', 'Prepare editable project time entries for review before mock submission.', ['projectId', 'workDate', 'hours', 'workCategory', 'notes', 'weekEnding']],
  ['GetProjectHealth', 'getProjectHealth', 'Explain a project\'s delivery, financial, value, scope, and risk health.', ['projectId', 'asOfDate', 'period', 'focus', 'compareToBaseline']],
  ['GetProjectTimeline', 'getProjectTimeline', 'Visualize a project timeline, dependencies, baseline variance, and critical path.', ['projectId', 'startDate', 'endDate', 'workstream', 'criticalOnly', 'showBaseline']],
  ['GetProjectMilestones', 'getProjectMilestones', 'Show project milestones, stage gates, confidence, status, and accountable owners.', ['projectId', 'period', 'status', 'milestoneId', 'includeCompleted']],
  ['GetProjectRisks', 'getProjectRisks', 'Analyze project RAID exposure, movement, mitigation, due dates, and ownership.', ['projectId', 'riskType', 'minimumExposure', 'status', 'ownerId', 'includeIssues']],
  ['GetProjectBudget', 'getProjectBudget', 'Analyze project budget baseline, actuals, commitments, forecast, and estimate at completion.', ['projectId', 'period', 'costCategory', 'scenario', 'includeCommitments']],
  ['GetProjectAiSpend', 'getProjectAiSpend', 'Analyze project AI spend, usage, model mix, unit cost, budget guardrail, and forecast.', ['projectId', 'period', 'model', 'environment', 'costType', 'groupBy', 'forecastThrough']],
  ['GetProjectTeamCapacity', 'getProjectTeamCapacity', 'Analyze project team allocation, role demand, overload, and skill gaps.', ['projectId', 'startDate', 'endDate', 'role', 'personId', 'scenario', 'showSkillGaps']],
  ['SubmitProjectStatus', 'submitProjectStatus', 'Prepare an editable project status report for review before mock submission.', ['projectId', 'reportingDate', 'overallStatus', 'summary', 'accomplishments', 'nextSteps', 'helpNeeded']],
  ['SubmitAiUsage', 'submitAiUsage', 'Prepare an AI usage record with cost and governance context for review before mock submission.', ['projectId', 'usageDate', 'model', 'environment', 'feature', 'inputTokens', 'outputTokens', 'requests', 'purpose']],
  ['SubmitProjectRequest', 'submitProjectRequest', 'Prepare a new project request with business value, sponsor, dates, cost, and AI context.', ['title', 'businessProblem', 'sponsorId', 'objectiveId', 'targetStartDate', 'targetEndDate', 'estimatedBudget', 'aiEnabled']],
  ['RequestAiBudget', 'requestAiBudget', 'Prepare an AI budget change request with forecast impact and alternatives for review.', ['projectId', 'amount', 'currency', 'neededBy', 'budgetCategory', 'justification', 'model', 'environment']],
  ['CompareProjects', 'compareProjects', 'Compare two or more projects across delivery, financials, value, risk, and capacity.', ['projectIds', 'period', 'compareOn', 'includeForecast', 'highlightDifferences']],
  ['GetPortfolioHealth', 'getPortfolioHealth', 'Summarize portfolio investment, value, delivery health, and top exceptions.', ['portfolioId', 'period', 'status', 'phase', 'sponsorId', 'focus']],
  ['GetStrategicAlignment', 'getStrategicAlignment', 'Map portfolio objectives and key results to project contribution evidence.', ['portfolioId', 'objectiveId', 'projectId', 'period', 'minimumContribution', 'includeUnaligned']],
  ['GetPortfolioRoadmap', 'getPortfolioRoadmap', 'Visualize cross-project phases, milestones, stage gates, dependencies, and collisions.', ['portfolioId', 'startDate', 'endDate', 'phase', 'projectIds', 'milestoneType', 'showDependencies']],
  ['GetPortfolioBudgetForecast', 'getPortfolioBudgetForecast', 'Analyze portfolio funding, forecast variance, allocation, and investment-to-outcome flow.', ['portfolioId', 'period', 'costCategory', 'scenario', 'groupBy', 'varianceOnly']],
  ['GetPortfolioAiSpend', 'getPortfolioAiSpend', 'Analyze portfolio AI spend, usage, model mix, unit cost, and project concentration.', ['portfolioId', 'period', 'projectIds', 'model', 'environment', 'groupBy', 'metric']],
  ['GetPortfolioCapacity', 'getPortfolioCapacity', 'Analyze portfolio role and skill demand versus supply with safe what-if scenarios.', ['portfolioId', 'startDate', 'endDate', 'role', 'skill', 'location', 'scenario', 'includeOpenRoles']],
  ['GetPortfolioRiskExposure', 'getPortfolioRiskExposure', 'Analyze systemic portfolio risk, concentration, propagation, and shared mitigations.', ['portfolioId', 'period', 'riskType', 'minimumExposure', 'status', 'includeDependencies']],
  ['GetApprovalInbox', 'getApprovalInbox', 'Prioritize the current manager\'s project, budget, resource, and stage-gate approvals.', ['approvalType', 'projectId', 'due', 'minimumAmount', 'requesterId', 'status']],
  ['ReviewProjectRequest', 'reviewProjectRequest', 'Review project request strategy, value, feasibility, risk, evidence, and duplication.', ['requestId', 'focus', 'compareProjectId', 'decision']],
  ['ReviewProjectBudget', 'reviewProjectBudget', 'Review a project budget request, forecast bridge, alternatives, and benefit impact.', ['approvalId', 'projectId', 'budgetType', 'period', 'decision', 'showSensitiveCosts']],
  ['ReviewResourceAssignment', 'reviewResourceAssignment', 'Review a proposed resource assignment against capacity, skills, cost, and milestones.', ['approvalId', 'projectId', 'personId', 'allocationPercent', 'startDate', 'endDate', 'role', 'decision']],
  ['ReviewStageGate', 'reviewStageGate', 'Review project stage-gate criteria, evidence, RAID, spend, value, and accountable owners.', ['approvalId', 'projectId', 'gateId', 'focus', 'decision']],
  ['ExploreAgentCapabilities', 'exploreAgentCapabilities', 'Help users discover project and portfolio scenarios, realistic prompts, business value, and safe experience previews.', ['category', 'audience', 'query', 'scenarioKey', 'tour']]
];

const arrayFields = new Set(['accomplishments', 'blockers', 'nextSteps', 'projectIds']);
const booleanFields = new Set([
  'aiEnabled', 'compareToBaseline', 'criticalOnly', 'highlightDifferences', 'includeCommitments',
  'includeCompleted', 'includeDependencies', 'includeForecast', 'includeIndirect', 'includeIssues',
  'includeOpenRoles', 'includeOperationalWork', 'includeUnaligned', 'showBaseline', 'showDependencies',
  'showSensitiveCosts', 'showSkillGaps', 'varianceOnly'
]);
const numberFields = new Set([
  'allocationPercent', 'amount', 'estimatedBudget', 'hours', 'inputTokens', 'minimumAmount',
  'minimumContribution', 'minimumExposure', 'outputTokens', 'requests'
]);

const describe = (field) => field
  .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  .replace(/^./, (character) => character.toUpperCase());

for (const [key, folder, description, fields] of definitions) {
  const componentPath = path.join(componentsRoot, folder, `${key}CopilotComponent.ts`);
  const propertiesPath = path.join(componentsRoot, folder, `${key}CopilotComponentProperties.ts`);
  const manifestPath = path.join(componentsRoot, folder, `${key}CopilotComponent.manifest.json`);

  if (!fs.existsSync(componentPath) || !fs.existsSync(propertiesPath) || !fs.existsSync(manifestPath)) {
    throw new Error(`Missing Yeoman scaffold for ${key}`);
  }

  const componentSource = `import ProjectIntentCopilotComponentBase from '../shared/components/ProjectIntentCopilotComponentBase';\nimport type { IProjectIntentProperties } from '../shared/models/projectPortfolio';\n\nexport default class ${key}CopilotComponent\n  extends ProjectIntentCopilotComponentBase<IProjectIntentProperties> {\n  protected intentKey = '${key}';\n}\n`;
  fs.writeFileSync(componentPath, componentSource);

  const fieldLines = fields.map((field) => {
    const schema = arrayFields.has(field) ? 'z.array(z.string())' :
      booleanFields.has(field) ? 'z.boolean()' :
      numberFields.has(field) ? 'z.number()' : 'z.string()';
    return `  ${field}: ${schema}.optional().describe('${describe(field)} extracted from the user prompt when provided.')`;
  });
  const propertiesSource = `import { z } from 'zod';\nimport zodToJsonSchema from 'zod-to-json-schema';\n\nconst propertiesSchema = z.object({\n${fieldLines.join(',\n')}\n});\n\nexport type I${key}CopilotComponentProperties = z.infer<typeof propertiesSchema>;\n\nexport default zodToJsonSchema(propertiesSchema);\n`;
  fs.writeFileSync(propertiesPath, propertiesSource);

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.tools[0].name = key;
  manifest.tools[0].description.default = description;
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

console.log(`Configured ${definitions.length} final-named intent components.`);
