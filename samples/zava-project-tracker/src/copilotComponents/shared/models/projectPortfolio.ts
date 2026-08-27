export type ProjectWorkspace = 'my-work' | 'project' | 'portfolio' | 'approvals' | 'education';
export type IntentOperation = 'information' | 'review' | 'submit' | 'education';

export type IntentVisual =
  | 'allocation'
  | 'comparison'
  | 'flow'
  | 'form'
  | 'matrix'
  | 'radial'
  | 'timeline'
  | 'trend';

export interface IIntentMetric {
  label: string;
  value: string;
  change?: string;
  tone?: 'neutral' | 'positive' | 'warning' | 'danger';
}

export interface IIntentPerson {
  name: string;
  role: string;
  imageKey: string;
}

export interface ICapabilityEducationDefinition {
  scenarioName: string;
  businessOutcome: string;
  category: Exclude<ProjectWorkspace, 'education'>;
  audience: string[];
  operation: Exclude<IntentOperation, 'education'>;
  examplePrompt: string;
  tags: string[];
  featuredRank?: number;
  previewProperties: IProjectIntentProperties;
  previewSafety: 'read-only' | 'stop-before-confirm';
}

export interface IIntentDefinition {
  key: string;
  workspace: ProjectWorkspace;
  route: string;
  eyebrow: string;
  title: string;
  summary: string;
  status: string;
  visual: IntentVisual;
  metrics: IIntentMetric[];
  insight: string;
  actionLabel: string;
  people: IIntentPerson[];
  education?: ICapabilityEducationDefinition;
}

export interface IProjectIntentProperties {
  message?: string;
  projectId?: string;
  portfolioId?: string;
  period?: string;
  focus?: string;
  status?: string;
  scenario?: string;
  personId?: string;
  amount?: number;
  startDate?: string;
  endDate?: string;
  [key: string]: unknown;
}