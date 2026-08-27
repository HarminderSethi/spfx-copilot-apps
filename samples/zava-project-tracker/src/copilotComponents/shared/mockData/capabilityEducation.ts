import { getInlineOperation } from '../models/intentOperations';
import type {
  ICapabilityEducationDefinition,
  IIntentPerson,
  IProjectIntentProperties,
  ProjectWorkspace
} from '../models/projectPortfolio';

const prompts: Readonly<Record<string, string>> = {
  GetMyWorkSummary: 'What needs my attention across my projects this week?',
  GetMyTasks: 'Group my current tasks by project and show the blocked work.',
  GetMyCapacity: 'How does my capacity look over the next six weeks?',
  GetMyGoalContributions: 'How is my work contributing to our responsible AI objective?',
  SubmitWeeklyUpdate: 'Draft my weekly update for Customer Service Copilot.',
  SubmitTimesheet: 'Help me review this week\'s project time before I submit it.',
  GetProjectHealth: 'How is Customer Service Copilot doing and what needs attention?',
  GetProjectTimeline: 'Show the critical path for Customer Service Copilot through launch.',
  GetProjectMilestones: 'Which Customer Service Copilot milestones are at risk this quarter?',
  GetProjectRisks: 'Show the highest-exposure risks for Customer Service Copilot.',
  GetProjectBudget: 'Are we within budget for Customer Service Copilot and what is the forecast?',
  GetProjectAiSpend: 'Show AI spend and forecast for Customer Service Copilot this month.',
  GetProjectTeamCapacity: 'Who is overallocated on Customer Service Copilot next sprint?',
  SubmitProjectStatus: 'Prepare the current Customer Service Copilot status report.',
  SubmitAiUsage: 'Record the latest GPT-5 evaluation usage for Customer Service Copilot.',
  SubmitProjectRequest: 'Start a project request for a supplier exception agent.',
  RequestAiBudget: 'Request another 75 thousand dollars of AI budget for production.',
  CompareProjects: 'Compare Customer Service Copilot with Contract Intelligence on delivery and value.',
  GetPortfolioHealth: 'How is the AI project portfolio performing?',
  GetStrategicAlignment: 'Which projects support our responsible AI objective?',
  GetPortfolioRoadmap: 'Show launches and stage gates across the next two quarters.',
  GetPortfolioBudgetForecast: 'Where will the portfolio exceed its funding forecast?',
  GetPortfolioAiSpend: 'Which projects drive AI spend and unit-cost growth?',
  GetPortfolioCapacity: 'Do we have enough AI engineering capacity next quarter?',
  GetPortfolioRiskExposure: 'What systemic risks could affect multiple projects?',
  GetApprovalInbox: 'What project and portfolio decisions need me today?',
  ReviewProjectRequest: 'Review the supplier exception agent proposal.',
  ReviewProjectBudget: 'Review the additional AI budget request.',
  ReviewResourceAssignment: 'Can Pradeep join Customer Service Copilot at 40 percent?',
  ReviewStageGate: 'Is Customer Service Copilot ready to exit pilot?'
};

const featuredRanks: Readonly<Record<string, number>> = {
  GetMyWorkSummary: 1,
  GetProjectHealth: 2,
  GetProjectAiSpend: 3,
  CompareProjects: 4,
  GetPortfolioHealth: 5,
  GetPortfolioCapacity: 6,
  GetApprovalInbox: 7,
  ReviewResourceAssignment: 8,
  SubmitWeeklyUpdate: 9,
  RequestAiBudget: 10
};

const previewOverrides: Readonly<Record<string, IProjectIntentProperties>> = {
  GetMyTasks: { groupBy: 'project', status: 'blocked' },
  GetMyCapacity: { scenario: 'forecast' },
  GetMyGoalContributions: { objectiveId: 'Responsible AI adoption', includeIndirect: true },
  SubmitWeeklyUpdate: { projectId: 'Customer Service Copilot', confidence: 'amber' },
  SubmitTimesheet: { projectId: 'Contract Intelligence', workCategory: 'Model evaluation' },
  GetProjectAiSpend: { projectId: 'Customer Service Copilot', period: 'month', groupBy: 'model' },
  SubmitAiUsage: { projectId: 'Customer Service Copilot', model: 'GPT-5', environment: 'Evaluation' },
  CompareProjects: { projectIds: ['Customer Service Copilot', 'Contract Intelligence'], compareOn: 'delivery' },
  GetPortfolioAiSpend: { portfolioId: 'AI Portfolio', metric: 'cost' },
  GetPortfolioCapacity: { portfolioId: 'AI Portfolio', scenario: 'forecast' },
  ReviewResourceAssignment: { projectId: 'Customer Service Copilot', personId: 'Pradeep Gupta', allocationPercent: 40 },
  ReviewProjectBudget: { projectId: 'Customer Service Copilot', decision: 'review' }
};

const defaultPreviewProperties = (workspace: Exclude<ProjectWorkspace, 'education'>): IProjectIntentProperties => {
  if (workspace === 'project') {
    return { projectId: 'Customer Service Copilot' };
  }
  if (workspace === 'portfolio') {
    return { portfolioId: 'AI Portfolio' };
  }
  return {};
};

export const createCapabilityEducation = (
  key: string,
  workspace: Exclude<ProjectWorkspace, 'education'>,
  title: string,
  summary: string,
  people: IIntentPerson[]
): ICapabilityEducationDefinition => {
  const operation = getInlineOperation(key);
  if (operation === 'education') {
    throw new Error(`Education intent ${key} cannot advertise itself.`);
  }
  const prompt = prompts[key];
  if (!prompt) {
    throw new Error(`Missing capability education prompt for ${key}.`);
  }
  return {
    scenarioName: title,
    businessOutcome: summary,
    category: workspace,
    audience: Array.from(new Set(people.map((person) => person.role))),
    operation,
    examplePrompt: prompt,
    tags: [workspace, operation, ...title.toLowerCase().split(/\s+/).filter((word) => word.length > 3)],
    featuredRank: featuredRanks[key],
    previewProperties: { ...defaultPreviewProperties(workspace), ...(previewOverrides[key] || {}) },
    previewSafety: operation === 'information' ? 'read-only' : 'stop-before-confirm'
  };
};

export const CAPABILITY_EXAMPLE_PROMPTS = prompts;
