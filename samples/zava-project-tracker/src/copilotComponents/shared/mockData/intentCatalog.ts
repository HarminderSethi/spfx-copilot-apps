import type { IIntentDefinition, ProjectWorkspace } from '../models/projectPortfolio';
import { createCapabilityEducation } from './capabilityEducation';

const megan = { name: 'Megan Bowen', role: 'Senior Program Manager', imageKey: 'Megan-Bowen' };
const joni = { name: 'Joni Sherman', role: 'Portfolio sponsor', imageKey: 'Joni-Sherman' };
const pradeep = { name: 'Pradeep Gupta', role: 'AI Platform Lead', imageKey: 'Pradeep-Gupta' };
const miriam = { name: 'Miriam Graham', role: 'Finance partner', imageKey: 'Miriam-Graham' };

const define = (
  key: string,
  workspace: Exclude<ProjectWorkspace, 'education'>,
  route: string,
  title: string,
  summary: string,
  visual: IIntentDefinition['visual'],
  metrics: IIntentDefinition['metrics'],
  insight: string,
  actionLabel: string,
  people = [megan]
): IIntentDefinition => ({
  key,
  workspace,
  route,
  eyebrow: workspace === 'my-work' ? 'MY WORK' : workspace.toUpperCase(),
  title,
  summary,
  status: workspace === 'approvals' ? 'Decision ready' : 'Updated moments ago',
  visual,
  metrics,
  insight,
  actionLabel,
  people,
  education: createCapabilityEducation(key, workspace, title, summary, people)
});

const catalog: IIntentDefinition[] = [
  define('GetMyWorkSummary', 'my-work', 'my-work/summary', 'Your week, made actionable', 'Seven commitments across three projects, ranked by delivery impact.', 'trend', [
    { label: 'Due this week', value: '7', change: '+2', tone: 'warning' },
    { label: 'Blocked', value: '1', change: 'Needs owner', tone: 'danger' },
    { label: 'Capacity', value: '92%', change: '+6 pts', tone: 'warning' }
  ], 'Moving the evaluation review to Wednesday protects Friday\'s gate decision.', 'Review my priorities'),
  define('GetMyTasks', 'my-work', 'my-work/tasks', 'Work that moves delivery', 'Tasks are grouped by urgency and dependency impact, not just due date.', 'timeline', [
    { label: 'Open', value: '12' }, { label: 'At risk', value: '3', tone: 'warning' }, { label: 'Completed', value: '18', tone: 'positive' }
  ], 'One blocked evaluation task affects two downstream milestones.', 'Open task board'),
  define('GetMyCapacity', 'my-work', 'my-work/capacity', 'Capacity before commitments collide', 'Committed project work, operational load, and available time across six weeks.', 'allocation', [
    { label: 'Next week', value: '112%', tone: 'danger' }, { label: 'Available', value: '6h' }, { label: 'Project work', value: '31h' }
  ], 'A 20% shift from Contract Intelligence restores a sustainable load.', 'Explore capacity'),
  define('GetMyGoalContributions', 'my-work', 'my-work/goals', 'Your work connected to outcomes', 'Current assignments mapped to measurable key-result movement.', 'flow', [
    { label: 'Objectives', value: '3' }, { label: 'Direct impact', value: '68%', tone: 'positive' }, { label: 'Unmapped', value: '8%', tone: 'warning' }
  ], 'Customer Service Copilot contributes most strongly to responsible adoption.', 'See contribution map'),
  define('SubmitWeeklyUpdate', 'my-work', 'my-work/weekly-update', 'Weekly update ready to shape', 'A structured draft keeps accomplishments, blockers, and next steps decision-ready.', 'form', [
    { label: 'Confidence', value: 'Amber', tone: 'warning' }, { label: 'Accomplishments', value: '3' }, { label: 'Blockers', value: '1', tone: 'danger' }
  ], 'The production-readiness blocker needs sponsor visibility this week.', 'Review draft'),
  define('SubmitTimesheet', 'my-work', 'my-work/timesheet', 'Time aligned to outcomes', 'A day-by-day view reconciles project effort with weekly capacity.', 'matrix', [
    { label: 'Logged', value: '33.5h' }, { label: 'Remaining', value: '6.5h' }, { label: 'Projects', value: '3' }
  ], 'Model evaluation is 2.5 hours above plan but remains within project forecast.', 'Review timesheet'),

  define('GetProjectHealth', 'project', 'project/health', 'Customer Service Copilot is amber', 'Schedule, cost, scope, value, and risk signals reconciled in one health story.', 'radial', [
    { label: 'Schedule', value: '-8d', tone: 'danger' }, { label: 'Budget', value: '74%' }, { label: 'Value', value: 'On plan', tone: 'positive' }
  ], 'Evaluation readiness, not engineering throughput, now drives the launch date.', 'Open health evidence', [megan, joni]),
  define('GetProjectTimeline', 'project', 'project/timeline', 'The critical path to production', 'Baseline and forecast dates reveal the dependency driving launch.', 'timeline', [
    { label: 'Forecast launch', value: '30 Sep' }, { label: 'Variance', value: '+8d', tone: 'danger' }, { label: 'Critical tasks', value: '5' }
  ], 'Evaluation sign-off is the single predecessor controlling production launch.', 'Explore critical path'),
  define('GetProjectMilestones', 'project', 'project/milestones', 'Milestones that need confidence', 'Stage gates and accountable owners across the current quarter.', 'timeline', [
    { label: 'This quarter', value: '6' }, { label: 'At risk', value: '2', tone: 'warning' }, { label: 'Complete', value: '3', tone: 'positive' }
  ], 'Pilot exit criteria are 82% complete with one Responsible AI control open.', 'Review milestones', [megan, pradeep]),
  define('GetProjectRisks', 'project', 'project/risks', 'Risk exposure, not a static register', 'Probability, impact, movement, and mitigation ownership in one view.', 'matrix', [
    { label: 'High exposure', value: '3', tone: 'danger' }, { label: 'Improving', value: '4', tone: 'positive' }, { label: 'Mitigations due', value: '2', tone: 'warning' }
  ], 'Evaluation data quality is now the highest exposure after supplier risk declined.', 'Open risk register', [megan, pradeep]),
  define('GetProjectBudget', 'project', 'project/budget', 'Forecast stays inside the approved envelope', 'Baseline, actual, committed, and estimate-at-completion by cost category.', 'comparison', [
    { label: 'Approved', value: '$920k' }, { label: 'EAC', value: '$897k', tone: 'positive' }, { label: 'Variance', value: '$23k', tone: 'positive' }
  ], 'AI consumption pressure is offset by lower implementation services spend.', 'Explore budget', [megan, miriam]),
  define('GetProjectAiSpend', 'project', 'project/ai-spend', 'AI spend control tower', 'Actual, forecast, model mix, feature economics, and guardrails for this project.', 'trend', [
    { label: 'Consumed', value: '81%', tone: 'warning' }, { label: 'Unit cost', value: '$0.42', change: '-11%', tone: 'positive' }, { label: 'Cap date', value: '18 Oct' }
  ], 'Evaluation traffic drives 63% of August growth; production unit cost is improving.', 'Open spend drivers', [megan, pradeep, miriam]),
  define('GetProjectTeamCapacity', 'project', 'project/team-capacity', 'Team load before the next sprint', 'Person-by-week allocation with role demand and skill gaps.', 'allocation', [
    { label: 'Team load', value: '94%', tone: 'warning' }, { label: 'Overallocated', value: '2', tone: 'danger' }, { label: 'Skill gaps', value: '1' }
  ], 'AI platform review is concentrated on Pradeep across three projects.', 'Review team capacity', [megan, pradeep]),
  define('SubmitProjectStatus', 'project', 'project/status-report', 'Status report grounded in changes', 'RAG dimensions, milestone movement, decisions, and help needed.', 'form', [
    { label: 'Overall', value: 'Amber', tone: 'warning' }, { label: 'Changes', value: '4' }, { label: 'Decisions', value: '2' }
  ], 'The report should elevate evaluation readiness rather than repeat task progress.', 'Review status report'),
  define('SubmitAiUsage', 'project', 'project/ai-usage', 'AI usage with cost and governance context', 'Model, feature, environment, volume, purpose, and classification in one attested record.', 'form', [
    { label: 'Input tokens', value: '2.4m' }, { label: 'Est. cost', value: '$3,860' }, { label: 'Classification', value: 'Internal' }
  ], 'Evaluation usage is within policy and will move the forecast by 0.4%.', 'Review usage record', [megan, pradeep]),
  define('SubmitProjectRequest', 'project', 'project/new-request', 'A project request built for decisions', 'Problem, sponsor, strategic fit, value, cost range, and AI classification.', 'form', [
    { label: 'Strategic fit', value: 'High', tone: 'positive' }, { label: 'Value range', value: '$1.8m' }, { label: 'Evidence', value: '72%', tone: 'warning' }
  ], 'The supplier-risk proposal overlaps one platform capability but fills a portfolio gap.', 'Review project request', [megan, joni]),
  define('RequestAiBudget', 'project', 'project/ai-budget-request', 'Budget request with the trade-off visible', 'Current consumption, forecast, requested amount, alternatives, and approval path.', 'comparison', [
    { label: 'Requested', value: '$75k' }, { label: 'Current cap', value: '$220k' }, { label: 'Forecast impact', value: '+$68k', tone: 'warning' }
  ], 'The request protects production launch and avoids a higher-cost model fallback.', 'Review budget request', [megan, miriam]),
  define('CompareProjects', 'project', 'project/compare', 'Two projects, one decision surface', 'Aligned delivery, investment, value, risk, and capacity measures without scorecard noise.', 'comparison', [
    { label: 'Delivery gap', value: '11d', tone: 'warning' }, { label: 'Value delta', value: '+24%', tone: 'positive' }, { label: 'Capacity gap', value: '1.3 FTE', tone: 'danger' }
  ], 'Customer Service Copilot has stronger value; Contract Intelligence has lower delivery confidence.', 'Open comparison studio', [megan, pradeep]),

  define('GetPortfolioHealth', 'portfolio', 'portfolio/health', 'AI portfolio: value with pressure points', 'Investment, value, delivery risk, and top exceptions across active projects.', 'comparison', [
    { label: 'Active', value: '8' }, { label: 'At risk', value: '3', tone: 'warning' }, { label: 'Benefits', value: '$14.2m', tone: 'positive' }
  ], 'Three projects create 71% of forecast value and 64% of delivery exposure.', 'Open portfolio health', [joni, megan]),
  define('GetStrategicAlignment', 'portfolio', 'portfolio/strategy', 'Investment connected to strategy', 'Objectives, key results, projects, and measurable contribution evidence.', 'flow', [
    { label: 'Objectives', value: '5' }, { label: 'Aligned spend', value: '91%', tone: 'positive' }, { label: 'Unaligned', value: '$420k', tone: 'warning' }
  ], 'Responsible AI Controls unlocks contribution confidence for every AI-enabled project.', 'Explore alignment', [joni, megan]),
  define('GetPortfolioRoadmap', 'portfolio', 'portfolio/roadmap', 'The roadmap where collisions surface', 'Cross-project phases, launches, stage gates, and shared dependencies.', 'timeline', [
    { label: 'Next 90 days', value: '14 gates' }, { label: 'Collisions', value: '3', tone: 'warning' }, { label: 'Critical links', value: '5' }
  ], 'Two September launches depend on the same platform release and review capacity.', 'Open roadmap'),
  define('GetPortfolioBudgetForecast', 'portfolio', 'portfolio/budget', 'Funding from investment to outcome', 'Allocation, actual, forecast, and value flow by project and outcome.', 'flow', [
    { label: 'Forecast', value: '$7.84m' }, { label: 'Variance', value: '+2.8%', tone: 'warning' }, { label: 'Benefits', value: '1.8x', tone: 'positive' }
  ], 'Portfolio variance is concentrated in two projects, not systemic overspend.', 'Explore funding flow', [joni, miriam]),
  define('GetPortfolioAiSpend', 'portfolio', 'portfolio/ai-spend', 'AI economics across the portfolio', 'Spend, tokens, requests, model mix, and unit-cost movement.', 'trend', [
    { label: 'Monthly spend', value: '$486k' }, { label: 'Growth', value: '+9%', tone: 'warning' }, { label: 'Unit cost', value: '-7%', tone: 'positive' }
  ], 'Evaluation workloads grow fastest while production unit economics improve.', 'Open AI economics', [pradeep, miriam]),
  define('GetPortfolioCapacity', 'portfolio', 'portfolio/capacity', 'Demand, supply, and the work at risk', 'Role demand versus supply by week, location, skill, and scenario.', 'flow', [
    { label: 'Gap next quarter', value: '4.2 FTE', tone: 'danger' }, { label: 'Open roles', value: '3' }, { label: 'At-risk value', value: '$2.1m', tone: 'warning' }
  ], 'AI platform review is the constraint; general engineering capacity is sufficient.', 'Model capacity scenario', [megan, pradeep]),
  define('GetPortfolioRiskExposure', 'portfolio', 'portfolio/risks', 'Systemic risk and dependency exposure', 'Concentration, propagation paths, movement, and shared mitigations.', 'radial', [
    { label: 'Portfolio exposure', value: '68', tone: 'warning' }, { label: 'Systemic risks', value: '4', tone: 'danger' }, { label: 'Improving', value: '6', tone: 'positive' }
  ], 'One shared platform dependency connects three of the four highest exposures.', 'Explore risk network', [joni, pradeep]),

  define('GetApprovalInbox', 'approvals', 'approvals/inbox', 'Decisions that need you now', 'A prioritized queue ranked by urgency, value at risk, and evidence readiness.', 'matrix', [
    { label: 'Waiting', value: '9' }, { label: 'Due in 48h', value: '3', tone: 'warning' }, { label: 'Requested', value: '$1.42m' }
  ], 'The resource assignment has the highest schedule consequence and complete evidence.', 'Open decision center', [joni, miriam]),
  define('ReviewProjectRequest', 'approvals', 'approvals/project-request', 'Project intake with evidence attached', 'Strategic fit, value, feasibility, risk, duplication, and decision safeguards.', 'radial', [
    { label: 'Strategic fit', value: '86', tone: 'positive' }, { label: 'Evidence', value: '72%', tone: 'warning' }, { label: 'Requested', value: '$640k' }
  ], 'The proposal is strategically strong but its benefit baseline needs one revision.', 'Review request evidence', [joni, megan]),
  define('ReviewProjectBudget', 'approvals', 'approvals/budget', 'Budget decision with consequences', 'Current forecast, request bridge, alternatives, benefits, and finance comments.', 'comparison', [
    { label: 'Request', value: '$75k' }, { label: 'Benefit protected', value: '$620k', tone: 'positive' }, { label: 'Evidence', value: '94%' }
  ], 'Approval protects the launch date; returning it creates an eight-week delay risk.', 'Review budget decision', [joni, miriam]),
  define('ReviewResourceAssignment', 'approvals', 'approvals/resource-assignment', 'See the impact before assigning', 'Proposed allocation compared with capacity, skills, conflicts, cost, and milestones.', 'allocation', [
    { label: 'Proposed', value: '40%' }, { label: 'Resulting load', value: '118%', tone: 'danger' }, { label: 'Milestones affected', value: '2', tone: 'warning' }
  ], 'A 20% assignment meets the review need without delaying Contract Intelligence.', 'Model assignment', [pradeep, megan]),
  define('ReviewStageGate', 'approvals', 'approvals/stage-gate', 'Pilot exit gate: nearly ready', 'Exit criteria, evidence, unresolved RAID, spend, value, and accountable owners.', 'radial', [
    { label: 'Criteria complete', value: '82%', tone: 'warning' }, { label: 'Open blockers', value: '1', tone: 'danger' }, { label: 'Value confidence', value: 'High', tone: 'positive' }
  ], 'Responsible AI evidence is the only blocking criterion before production approval.', 'Review gate evidence', [joni, megan, pradeep])
  ,{
    key: 'ExploreAgentCapabilities',
    workspace: 'education',
    route: 'education/capabilities',
    eyebrow: 'EXPLORE',
    title: 'Discover what Zava can help you accomplish',
    summary: 'Browse project and portfolio scenarios, see the business value, and start with a realistic prompt.',
    status: '30 scenarios available',
    visual: 'matrix',
    metrics: [
      { label: 'Scenarios', value: '30' },
      { label: 'Categories', value: '4' },
      { label: 'Preview mode', value: 'Safe', tone: 'positive' }
    ],
    insight: 'Start with the outcome you need; Zava will route your prompt to the matching experience.',
    actionLabel: 'Explore scenarios',
    people: [megan]
  }
];

export const getIntentDefinition = (key: string): IIntentDefinition => {
  const definition = catalog.find((item) => item.key === key);
  if (!definition) {
    throw new Error(`Unknown project portfolio intent: ${key}`);
  }
  return definition;
};

export const PROJECT_INTENT_CATALOG: ReadonlyArray<IIntentDefinition> = catalog;