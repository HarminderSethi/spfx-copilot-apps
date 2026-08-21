import * as React from 'react';

import { Text } from '@fluentui/react-text';
import { CheckmarkCircle20Filled, Dismiss20Regular, Send20Regular, Warning20Regular } from '@fluentui/react-icons';
import { makeStyles, mergeClasses } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';

import { EMBEDDED_FACES } from '../../mockData/embeddedFaces';
import { getIntentDefinition } from '../../mockData/intentCatalog';
import { ALL_REVIEW_DECISIONS, REVIEW_KIND_BY_INTENT, type ReviewKind } from '../../mockData/reviewDecisionCatalog';
import type { IProjectPortfolioExperience } from '../../models/portfolioDomain';
import type { IIntentTransientState } from '../../models/intentInvocation';
import type { IIntentDefinition, IProjectIntentProperties } from '../../models/projectPortfolio';
import { getAiBudgetConsumption, getBenefitCostRatio, getPersonAllocation } from '../../services/portfolioCalculations';
import { getSessionActionReceipts, resetSessionActions, subscribeToSessionActions } from '../../services/SessionActionStore';
import {
  CapacityBarChart,
  ProgressPieChart,
  TrendChart,
  WaterfallChart
} from '../charts/InlineCharts';
import { CompanyForecastTrajectory, CompanyInvestmentLandscape } from './FullscreenPortfolioCharts';
import type { OperationalWorkspace } from './ProjectFullscreenShell';
import ReviewInlineExperiences, { type ReviewDecision } from '../inline/ReviewInlineExperiences';
import SubmissionInlineExperiences from '../inline/SubmissionInlineExperiences';

const useStyles = makeStyles({
  stack: { position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 },
  hero: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '18px', minWidth: 0,
    padding: '18px 20px', color: tokens.colorNeutralForegroundOnBrand, backgroundColor: tokens.colorBrandBackground,
    backgroundImage: `linear-gradient(112deg, ${tokens.colorBrandBackground} 0%, ${tokens.colorBrandBackground} 78%, ${tokens.colorPaletteGreenBackground3} 100%)`,
    borderRadius: tokens.borderRadiusLarge, overflow: 'hidden'
  },
  heroProject: { backgroundColor: tokens.colorPaletteBerryBackground3, backgroundImage: `linear-gradient(112deg, ${tokens.colorPaletteBerryBackground3} 0%, ${tokens.colorPaletteBerryBackground3} 78%, ${tokens.colorBrandBackground} 100%)` },
  heroPortfolio: { backgroundColor: tokens.colorPaletteGreenBackground3, backgroundImage: `linear-gradient(112deg, ${tokens.colorPaletteGreenBackground3} 0%, ${tokens.colorPaletteGreenBackground3} 78%, ${tokens.colorBrandBackground} 100%)` },
  heroDecisions: { backgroundColor: tokens.colorPaletteDarkOrangeBackground3, backgroundImage: `linear-gradient(112deg, ${tokens.colorPaletteDarkOrangeBackground3} 0%, ${tokens.colorPaletteDarkOrangeBackground3} 78%, ${tokens.colorPaletteBerryBackground3} 100%)` },
  heroCompact: { alignItems: 'flex-start', flexDirection: 'column' },
  identity: { display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 },
  heroCopy: { display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 },
  heroTitle: { letterSpacing: '0', lineHeight: '1.1' },
  heroSummary: { color: tokens.colorNeutralForegroundOnBrand, opacity: .9 },
  avatar: { width: '52px', height: '52px', flexShrink: 0, borderRadius: tokens.borderRadiusCircular, objectFit: 'cover', border: '2px solid rgba(255,255,255,.75)' },
  avatarSmall: { width: '34px', height: '34px', borderRadius: tokens.borderRadiusCircular, objectFit: 'cover' },
  people: { display: 'flex', alignItems: 'center' },
  personAvatar: { marginLeft: '-7px', ':first-child': { marginLeft: 0 } },
  selector: {
    minWidth: '230px', maxWidth: '100%', minHeight: '38px', padding: '7px 32px 7px 10px',
    color: tokens.colorNeutralForeground1, backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium
  },
  metricGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px' },
  metricGridCompact: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  metric: {
    minWidth: 0, padding: '12px 14px', border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderTop: `3px solid ${tokens.colorBrandStroke1}`, borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1, boxShadow: tokens.shadow2
  },
  metricWarning: { borderTopColor: tokens.colorPaletteMarigoldBorderActive },
  metricDanger: { borderTopColor: tokens.colorPaletteRedBorderActive },
  metricPositive: { borderTopColor: tokens.colorPaletteGreenBorderActive },
  metricLabel: { color: tokens.colorNeutralForeground3 },
  metricValue: { marginTop: '3px', fontSize: tokens.fontSizeBase500, lineHeight: '24px', fontWeight: tokens.fontWeightSemibold },
  actionBand: { padding: '14px', border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorNeutralBackground1, boxShadow: tokens.shadow2 },
  actionGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px' },
  actionGridCompact: { gridTemplateColumns: 'minmax(0, 1fr)' },
  actionButton: { minWidth: 0, minHeight: '52px', display: 'grid', gridTemplateColumns: '22px minmax(0, 1fr)', gap: '8px', alignItems: 'center', padding: '9px 10px', textAlign: 'left', color: tokens.colorNeutralForeground1, backgroundColor: tokens.colorNeutralBackground2, border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium, cursor: 'pointer' },
  actionCopy: { display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 },
  actionSuccess: { display: 'grid', gridTemplateColumns: '22px minmax(0, 1fr)', gap: '8px', marginTop: '10px', padding: '9px', color: tokens.colorPaletteGreenForeground1, backgroundColor: tokens.colorPaletteGreenBackground2, borderRadius: tokens.borderRadiusMedium },
  resetActions: { display: 'flex', justifyContent: 'flex-end' },
  submissionOverlay: { position: 'absolute', inset: 0, zIndex: 18, minHeight: '100%', backgroundColor: 'rgba(0, 0, 0, .32)' },
  submissionPanel: { position: 'absolute', top: 0, right: 0, bottom: 0, width: 'min(720px, 100%)', boxSizing: 'border-box', overflowY: 'auto', padding: '20px', color: tokens.colorNeutralForeground1, backgroundColor: tokens.colorNeutralBackground1, boxShadow: tokens.shadow64 },
  submissionHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' },
  submissionHeading: { display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 },
  closeButton: { width: '36px', height: '36px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium, color: tokens.colorNeutralForeground2, backgroundColor: tokens.colorNeutralBackground1, cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: '14px', alignItems: 'start' },
  gridCompact: { gridTemplateColumns: 'minmax(0, 1fr)' },
  span4: { gridColumn: 'span 4' },
  span5: { gridColumn: 'span 5' },
  span6: { gridColumn: 'span 6' },
  span7: { gridColumn: 'span 7' },
  span8: { gridColumn: 'span 8' },
  span12: { gridColumn: '1 / -1' },
  compactSpan: { gridColumn: '1' },
  panel: {
    minWidth: 0, padding: '14px', border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorNeutralBackground1, boxShadow: tokens.shadow2
  },
  focusPanel: { borderTop: `4px solid ${tokens.colorBrandStroke1}` },
  panelHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '11px' },
  panelTitle: { display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 },
  muted: { color: tokens.colorNeutralForeground3 },
  rows: { display: 'flex', flexDirection: 'column' },
  row: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '10px', alignItems: 'center', padding: '9px 2px', borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
  rowThree: { gridTemplateColumns: '36px minmax(0, 1fr) auto' },
  rowCopy: { display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 },
  badge: { width: 'fit-content', padding: '3px 7px', color: tokens.colorBrandForeground1, backgroundColor: tokens.colorBrandBackground2, borderRadius: tokens.borderRadiusCircular, fontSize: tokens.fontSizeBase100, fontWeight: tokens.fontWeightSemibold },
  badgeWarning: { color: tokens.colorPaletteDarkOrangeForeground1, backgroundColor: tokens.colorPaletteMarigoldBackground2 },
  badgeDanger: { color: tokens.colorPaletteRedForeground1, backgroundColor: tokens.colorPaletteRedBackground2 },
  badgeSuccess: { color: tokens.colorPaletteGreenForeground1, backgroundColor: tokens.colorPaletteGreenBackground2 },
  progressRow: { display: 'grid', gridTemplateColumns: '110px minmax(0, 1fr) 38px', gap: '8px', alignItems: 'center', padding: '7px 0' },
  progressTrack: { height: '8px', overflow: 'hidden', borderRadius: tokens.borderRadiusCircular, backgroundColor: tokens.colorNeutralBackground4 },
  progressFill: { height: '100%', borderRadius: tokens.borderRadiusCircular, backgroundColor: tokens.colorBrandBackground },
  progressWarning: { backgroundColor: tokens.colorPaletteMarigoldBackground3 },
  progressDanger: { backgroundColor: tokens.colorPaletteRedBackground3 },
  chartPair: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 126px', gap: '10px', alignItems: 'center' },
  chartPairCompact: { gridTemplateColumns: 'minmax(0, 1fr)' },
  summaryList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  summaryItem: { display: 'flex', alignItems: 'flex-start', gap: '7px', padding: '8px', borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorNeutralBackground2 },
  decisionGrid: { display: 'grid', gridTemplateColumns: 'minmax(280px, .72fr) minmax(0, 1.28fr)', minHeight: '460px' },
  decisionGridCompact: { gridTemplateColumns: 'minmax(0, 1fr)' },
  inboxPanel: { minWidth: 0, overflow: 'hidden', border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorNeutralBackground1, boxShadow: tokens.shadow2 },
  inboxList: { minWidth: 0, padding: '14px', borderRight: `1px solid ${tokens.colorNeutralStroke2}` },
  inboxListCompact: { borderRight: 'none', borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
  inboxDetail: { minWidth: 0, padding: '14px' },
  inboxToolbar: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '7px', marginBottom: '10px' },
  inboxToolbarCompact: { gridTemplateColumns: 'minmax(0, 1fr)' },
  filterSelect: { minWidth: 0, minHeight: '34px', padding: '5px 7px', color: tokens.colorNeutralForeground1, backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium },
  requestButton: { minHeight: '32px', padding: '5px 10px', border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, color: tokens.colorBrandForeground1, backgroundColor: tokens.colorNeutralBackground1, cursor: 'pointer', fontWeight: tokens.fontWeightSemibold },
  requestActive: { backgroundColor: tokens.colorBrandBackground2 },
  empty: { padding: '26px', textAlign: 'center', color: tokens.colorNeutralForeground3 },
  financeTable: { width: '100%', borderCollapse: 'collapse' },
  tableScroll: { width: '100%', overflowX: 'auto' },
  tableHeader: { color: tokens.colorNeutralForeground3, fontSize: tokens.fontSizeBase100, textAlign: 'left' },
  tableCell: { padding: '8px 5px', borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
  alignRight: { textAlign: 'right' },
  mixGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px', marginBottom: '12px' },
  mixItem: { padding: '10px', borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorNeutralBackground2 },
  overview: { display: 'flex', flexDirection: 'column', gap: '12px' },
  overviewCallout: { display: 'grid', gridTemplateColumns: '22px minmax(0, 1fr)', gap: '8px', padding: '12px', color: tokens.colorBrandForeground1, backgroundColor: tokens.colorBrandBackground2, borderRadius: tokens.borderRadiusMedium }
});

type MetricTone = 'neutral' | 'warning' | 'danger' | 'positive';

interface IDashboardMetric {
  label: string;
  value: string;
  detail: string;
  tone?: MetricTone;
}

export interface IFullscreenWorkspaceDashboardProps {
  workspace: OperationalWorkspace;
  activeDefinition: IIntentDefinition;
  initialProperties: IProjectIntentProperties;
  currentUserName: string;
  containerWidth?: number;
  experience: IProjectPortfolioExperience;
  currency: string;
  onSelectIntent: (intentKey: string) => void;
  transientState?: IIntentTransientState;
}

export const ContinuedContext: React.FunctionComponent<{ state?: IIntentTransientState }> = ({ state }) => {
  const styles = useStyles();
  if (!state || Object.keys(state).length === 0) return null;
  const detail = state.information
    ? `${state.information.filter || 'All'} / ${state.information.selectedId || 'No evidence selected'}`
    : state.review
      ? `${state.review.statusFilter || 'All'} / ${state.review.selectedId || 'No decision selected'}`
      : state.submit
        ? `${state.submit.stage || 'edit'} / ${Object.keys(state.submit.values || {}).length} draft fields`
        : 'Prompt context';
  return <div className={styles.overviewCallout} data-layout="continued-inline-context"><CheckmarkCircle20Filled aria-hidden="true"/><span><Text weight="semibold" block>Continued from inline</Text><Text size={200}>{detail}</Text></span></div>;
};

const metricClass = (styles: ReturnType<typeof useStyles>, tone: MetricTone = 'neutral'): string => mergeClasses(
  styles.metric,
  tone === 'warning' && styles.metricWarning,
  tone === 'danger' && styles.metricDanger,
  tone === 'positive' && styles.metricPositive
);

const Metrics: React.FunctionComponent<{ metrics: IDashboardMetric[]; compact: boolean }> = ({ metrics, compact }) => {
  const styles = useStyles();
  return <div className={mergeClasses(styles.metricGrid, compact && styles.metricGridCompact)}>{metrics.map((metric) => <div className={metricClass(styles, metric.tone)} key={metric.label}><Text size={100} block className={styles.metricLabel}>{metric.label}</Text><div className={styles.metricValue}>{metric.value}</div><Text size={100} block className={styles.muted}>{metric.detail}</Text></div>)}</div>;
};

const PanelHeader: React.FunctionComponent<{ title: string; subtitle?: string }> = ({ title, subtitle }) => {
  const styles = useStyles();
  return <div className={styles.panelHeader}><div className={styles.panelTitle}><Text size={300} weight="semibold">{title}</Text>{subtitle && <Text size={100} className={styles.muted}>{subtitle}</Text>}</div></div>;
};

const personalActions = [
  { key: 'SubmitWeeklyUpdate', label: 'Weekly update', detail: 'Share progress, blockers, and next steps' },
  { key: 'SubmitTimesheet', label: 'Timesheet', detail: 'Record this week\'s project hours' },
  { key: 'SubmitProjectStatus', label: 'Project status', detail: 'Submit delivery, budget, scope, value, and risk' },
  { key: 'SubmitAiUsage', label: 'AI usage', detail: 'Record model usage and cost context' },
  { key: 'SubmitProjectRequest', label: 'Project request', detail: 'Start a governed project intake' },
  { key: 'RequestAiBudget', label: 'AI budget request', detail: 'Request additional AI funding' }
] as const;

const PersonalSubmissionPanel: React.FunctionComponent<{ intentKey: string; properties: IProjectIntentProperties; compact: boolean; onClose: () => void; onComplete: (label: string) => void }> = ({ intentKey, properties, compact, onClose, onComplete }) => {
  const styles = useStyles();
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const definition = getIntentDefinition(intentKey);
  const action = personalActions.find((item) => item.key === intentKey)!;
  React.useEffect(() => { headingRef.current?.focus(); }, []);
  return <div className={styles.submissionOverlay} role="presentation" onKeyDown={(event) => { if (event.key === 'Escape') onClose(); }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className={styles.submissionPanel} role="dialog" aria-modal="true" aria-labelledby="personal-action-title" data-personal-action={intentKey}>
      <div className={styles.submissionHeader}><div className={styles.submissionHeading}><Text ref={headingRef} tabIndex={-1} as="h2" id="personal-action-title" size={600} weight="semibold">{action.label}</Text><Text size={200} className={styles.muted}>{action.detail}</Text></div><button type="button" className={styles.closeButton} aria-label="Close personal action" onClick={onClose}><Dismiss20Regular aria-hidden="true"/></button></div>
      <SubmissionInlineExperiences definition={definition} properties={properties} compact={compact} onComplete={() => onComplete(action.label)}/>
    </section>
  </div>;
};

const MyWorkDashboard: React.FunctionComponent<IFullscreenWorkspaceDashboardProps> = (props) => {
  const styles = useStyles();
  const compact = props.containerWidth !== undefined && props.containerWidth <= 760;
  const megan = props.experience.people.find((person) => person.id === 'megan')!;
  const allocation = getPersonAllocation('megan', props.experience.allocations);
  const owned = props.experience.workItems.filter((item) => item.ownerId === 'megan');
  const [personalAction, setPersonalAction] = React.useState<string | undefined>();
  const [completedAction, setCompletedAction] = React.useState<string | undefined>();
  const priorities = [...owned, ...props.experience.workItems.filter((item) => item.priority === 'critical' && item.ownerId !== 'megan')].slice(0, 4);
  const metrics: IDashboardMetric[] = [
    { label: 'Priority actions', value: String(priorities.length), detail: 'ranked by delivery impact', tone: 'warning' },
    { label: 'Committed capacity', value: `${allocation}%`, detail: 'across two active projects', tone: allocation > 100 ? 'danger' : 'warning' },
    { label: 'Blocked work', value: String(props.experience.workItems.filter((item) => item.status === 'blocked').length), detail: 'needs owner attention', tone: 'danger' },
    { label: 'Goal contribution', value: '68%', detail: 'directly mapped to outcomes', tone: 'positive' }
  ];
  return <div className={styles.stack} data-layout="my-work-dashboard">
    <section className={mergeClasses(styles.hero, compact && styles.heroCompact)}><div className={styles.identity}><img className={styles.avatar} src={EMBEDDED_FACES[megan.imageKey]} alt=""/><div className={styles.heroCopy}><Text size={100}>PERSONAL OPERATIONS</Text><Text as="h1" size={700} weight="semibold" className={styles.heroTitle}>Good afternoon, Megan</Text><Text size={200} className={styles.heroSummary}>Four commitments deserve your attention. One capacity move protects Friday's gate decision.</Text></div></div><span className={mergeClasses(styles.badge, styles.badgeWarning)}>Capacity needs review</span></section>
    <Metrics metrics={metrics} compact={compact}/>
    <section className={styles.actionBand}><PanelHeader title="Personal actions" subtitle="Submit updates and requests without leaving your personal workspace"/><div className={mergeClasses(styles.actionGrid, compact && styles.actionGridCompact)}>{personalActions.map((action) => <button type="button" className={styles.actionButton} key={action.key} aria-label={`Open ${action.label}`} onClick={() => { setCompletedAction(undefined); setPersonalAction(action.key); }}><Send20Regular aria-hidden="true"/><span className={styles.actionCopy}><Text size={200} weight="semibold">{action.label}</Text><Text size={100} className={styles.muted}>{action.detail}</Text></span></button>)}</div>{completedAction && <div className={styles.actionSuccess} role="status"><CheckmarkCircle20Filled aria-hidden="true"/><Text size={200}>{completedAction} completed in this session. The action panel is closed.</Text></div>}</section>
    <div className={mergeClasses(styles.grid, compact && styles.gridCompact)}>
      <section className={mergeClasses(styles.panel, styles.span7, compact && styles.compactSpan)}><PanelHeader title="What needs you" subtitle="Priority, dependency impact, then due date"/><div className={styles.rows}>{priorities.map((item) => { const project = props.experience.projects.find((candidate) => candidate.id === item.projectId); const owner = props.experience.people.find((person) => person.id === item.ownerId); return <div className={mergeClasses(styles.row, styles.rowThree)} key={item.id}><img className={styles.avatarSmall} src={EMBEDDED_FACES[owner?.imageKey || 'Megan-Bowen']} alt=""/><span className={styles.rowCopy}><Text size={200} weight="semibold">{item.title}</Text><Text size={100} className={styles.muted}>{project?.title} / {owner?.displayName}</Text></span><span className={mergeClasses(styles.badge, item.status === 'blocked' ? styles.badgeDanger : styles.badgeWarning)}>{item.status === 'blocked' ? 'Blocked' : 'Due soon'}</span></div>; })}</div></section>
      <section className={mergeClasses(styles.panel, styles.span5, compact && styles.compactSpan)}><PanelHeader title="Capacity horizon" subtitle="Planned load across the next six weeks"/><CapacityBarChart values={[92, 104, 98, 88, 82, 76].map((value) => Math.round(value * props.experience.scenario.allocationMultiplier))}/></section>
      <section className={mergeClasses(styles.panel, styles.span7, compact && styles.compactSpan)}><PanelHeader title="Your month ahead" subtitle="Milestones, reporting, and decision moments"/><div className={styles.rows}>{props.experience.milestones.slice(0, 4).map((milestone) => { const project = props.experience.projects.find((item) => item.id === milestone.projectId); return <div className={styles.row} key={milestone.id}><span className={styles.rowCopy}><Text size={200} weight="semibold">{milestone.title}</Text><Text size={100} className={styles.muted}>{project?.title} / {milestone.forecastDate.toLocaleDateString()}</Text></span><span className={mergeClasses(styles.badge, milestone.confidencePercent < 70 ? styles.badgeDanger : milestone.confidencePercent < 90 ? styles.badgeWarning : styles.badgeSuccess)}>{milestone.confidencePercent}%</span></div>; })}</div></section>
      <section className={mergeClasses(styles.panel, styles.span5, compact && styles.compactSpan)}><PanelHeader title="Contribution to outcomes" subtitle="Your work mapped to key results"/><div className={mergeClasses(styles.chartPair, compact && styles.chartPairCompact)}><ProgressPieChart label="Direct goal contribution" value={68} tone="green"/><div className={styles.summaryList}><div className={styles.summaryItem}><CheckmarkCircle20Filled color={tokens.colorPaletteGreenForeground1}/><Text size={100}>Customer productivity is the strongest direct contribution.</Text></div><div className={styles.summaryItem}><Warning20Regular color={tokens.colorPaletteDarkOrangeForeground1}/><Text size={100}>8% of current work remains unmapped.</Text></div></div></div></section>
    </div>
    {personalAction && <PersonalSubmissionPanel intentKey={personalAction} properties={{ ...props.initialProperties, projectId: props.initialProperties.projectId || 'Customer Service Copilot' }} compact={compact} onClose={() => setPersonalAction(undefined)} onComplete={(label) => { setCompletedAction(label); setPersonalAction(undefined); }}/>} 
  </div>;
};

const ProjectDashboard: React.FunctionComponent<IFullscreenWorkspaceDashboardProps> = (props) => {
  const styles = useStyles();
  const compact = props.containerWidth !== undefined && props.containerWidth <= 760;
  const requestedProject = String(props.initialProperties.projectId || 'PRJ-2601');
  const initialProject = props.experience.projects.find((project) => project.id === requestedProject || project.title === requestedProject) || props.experience.projects[0];
  const [projectId, setProjectId] = React.useState(initialProject.id);
  const project = props.experience.projects.find((item) => item.id === projectId) || initialProject;
  const manager = props.experience.people.find((person) => person.id === project.managerId)!;
  const sponsor = props.experience.people.find((person) => person.id === project.sponsorId)!;
  const projectWork = props.experience.workItems.filter((item) => item.projectId === project.id);
  const projectMilestones = props.experience.milestones.filter((item) => item.projectId === project.id);
  const projectRisks = props.experience.risks.filter((item) => item.projectId === project.id);
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: props.currency, maximumFractionDigits: 0 });
  const aiConsumption = getAiBudgetConsumption(project);
  const metrics: IDashboardMetric[] = [
    { label: 'Forecast cost', value: money.format(project.forecastCost), detail: `${money.format(project.baselineBudget - project.forecastCost)} headroom`, tone: project.forecastCost > project.baselineBudget ? 'danger' : 'positive' },
    { label: 'Schedule variance', value: `${project.scheduleVarianceDays > 0 ? '+' : ''}${project.scheduleVarianceDays} days`, detail: `next gate ${project.nextGateDate.toLocaleDateString()}`, tone: project.scheduleVarianceDays > 10 ? 'danger' : project.scheduleVarianceDays > 3 ? 'warning' : 'positive' },
    { label: 'AI budget used', value: `${aiConsumption}%`, detail: `${money.format(project.aiSpend)} consumed`, tone: aiConsumption > 90 ? 'danger' : aiConsumption > 75 ? 'warning' : 'positive' },
    { label: 'Forecast benefit', value: money.format(project.forecastBenefit), detail: `${(project.forecastBenefit / project.forecastCost).toFixed(1)}x benefit / cost`, tone: 'positive' }
  ];
  const progressWeight = { 'not-started': 0, blocked: 20, 'in-progress': 55, complete: 100 };
  const workComplete = projectWork.length === 0 ? 0 : Math.round(projectWork.reduce((total, item) => total + progressWeight[item.status], 0) / projectWork.length);
  return <div className={styles.stack} data-layout="project-dashboard" data-selected-project={project.id}>
    <section className={mergeClasses(styles.hero, styles.heroProject, compact && styles.heroCompact)}><div className={styles.identity}><div className={styles.people}><img className={styles.avatar} src={EMBEDDED_FACES[manager.imageKey]} alt=""/><img className={mergeClasses(styles.avatarSmall, styles.personAvatar)} src={EMBEDDED_FACES[sponsor.imageKey]} alt=""/></div><div className={styles.heroCopy}><Text size={100}>PROJECT COCKPIT / {project.phase.toUpperCase()}</Text><Text as="h1" size={700} weight="semibold" className={styles.heroTitle}>{project.title}</Text><Text size={200} className={styles.heroSummary}>{manager.displayName}, project manager / {sponsor.displayName}, sponsor</Text></div></div><select className={styles.selector} aria-label="Select project" value={project.id} onChange={(event) => setProjectId(event.currentTarget.value)}>{props.experience.projects.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></section>
    <Metrics metrics={metrics} compact={compact}/>
    <div className={mergeClasses(styles.grid, compact && styles.gridCompact)}>
      <section className={mergeClasses(styles.panel, styles.span7, compact && styles.compactSpan)}><PanelHeader title="Budget and forecast" subtitle="Approved baseline to current estimate at completion"/><WaterfallChart steps={[{ label: 'Approved', value: Math.round(project.baselineBudget / 1000), total: true }, { label: 'Delivery', value: Math.round((project.forecastCost - project.baselineBudget) / 1000) }, { label: 'Forecast', value: Math.round(project.forecastCost / 1000), total: true }]}/><div className={styles.progressRow}><Text size={100}>AI budget</Text><div className={styles.progressTrack}><div className={mergeClasses(styles.progressFill, aiConsumption > 75 && styles.progressWarning)} style={{ width: `${Math.min(aiConsumption, 100)}%` }}/></div><Text size={100}>{aiConsumption}%</Text></div></section>
      <section className={mergeClasses(styles.panel, styles.span5, compact && styles.compactSpan)}><PanelHeader title="Delivery health" subtitle={`${project.health.toUpperCase()} / ${projectRisks.length} tracked risks`}/><div className={styles.progressRow}><Text size={100}>Work complete</Text><div className={styles.progressTrack}><div className={styles.progressFill} style={{ width: `${workComplete}%` }}/></div><Text size={100}>{workComplete}%</Text></div><div className={styles.progressRow}><Text size={100}>Gate confidence</Text><div className={styles.progressTrack}><div className={styles.progressFill} style={{ width: `${projectMilestones[0]?.confidencePercent || 72}%` }}/></div><Text size={100}>{projectMilestones[0]?.confidencePercent || 72}%</Text></div><div className={styles.rows}>{projectRisks.slice(0, 3).map((risk) => <div className={styles.row} key={risk.id}><span className={styles.rowCopy}><Text size={100} weight="semibold">{risk.title}</Text><Text size={100} className={styles.muted}>{risk.trend}</Text></span><span className={mergeClasses(styles.badge, risk.exposure >= 20 ? styles.badgeDanger : styles.badgeWarning)}>{risk.exposure}</span></div>)}</div></section>
      <section className={mergeClasses(styles.panel, styles.span7, compact && styles.compactSpan)}><PanelHeader title="Work and milestones" subtitle="Current work alongside the next delivery moments"/><div className={styles.rows}>{projectWork.concat(projectWork.length ? [] : props.experience.workItems.slice(0, 2)).slice(0, 3).map((item) => <div className={styles.row} key={item.id}><span className={styles.rowCopy}><Text size={200} weight="semibold">{item.title}</Text><Text size={100} className={styles.muted}>{item.dueDate.toLocaleDateString()} / {item.priority}</Text></span><span className={mergeClasses(styles.badge, item.status === 'blocked' ? styles.badgeDanger : styles.badgeWarning)}>{item.status}</span></div>)}{projectMilestones.slice(0, 2).map((milestone) => <div className={styles.row} key={milestone.id}><span className={styles.rowCopy}><Text size={200} weight="semibold">{milestone.title}</Text><Text size={100} className={styles.muted}>Forecast {milestone.forecastDate.toLocaleDateString()}</Text></span><span className={styles.badge}>{milestone.confidencePercent}%</span></div>)}</div></section>
      <section className={mergeClasses(styles.panel, styles.span5, compact && styles.compactSpan)}><PanelHeader title="AI economics" subtitle="Consumption and unit-cost direction"/><TrendChart values={[46, 54, 63, 72, Math.max(74, aiConsumption - 4), aiConsumption]} labels={['Mar','Apr','May','Jun','Jul','Aug']} ariaLabel={`${project.title} AI budget consumption trend`}/><div className={styles.summaryItem}><CheckmarkCircle20Filled color={tokens.colorPaletteGreenForeground1}/><Text size={100}>Production unit cost is improving while evaluation volume grows.</Text></div></section>
    </div>
  </div>;
};

const PortfolioDashboard: React.FunctionComponent<IFullscreenWorkspaceDashboardProps> = (props) => {
  const styles = useStyles();
  const compact = props.containerWidth !== undefined && props.containerWidth <= 760;
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: props.currency, maximumFractionDigits: 0 });
  const approved = props.experience.projects.reduce((total, project) => total + project.baselineBudget, 0);
  const forecast = props.experience.projects.reduce((total, project) => total + project.forecastCost, 0);
  const benefits = props.experience.projects.reduce((total, project) => total + project.forecastBenefit, 0);
  const aiSpend = props.experience.projects.reduce((total, project) => total + project.aiSpend, 0);
  const metrics: IDashboardMetric[] = [
    { label: 'Approved investment', value: money.format(approved), detail: 'across eight active projects' },
    { label: 'Current forecast', value: money.format(forecast), detail: `${money.format(forecast - approved)} variance`, tone: forecast > approved ? 'warning' : 'positive' },
    { label: 'Forecast benefits', value: money.format(benefits), detail: `${getBenefitCostRatio(props.experience.projects)}x benefit / cost`, tone: 'positive' },
    { label: 'AI consumption', value: money.format(aiSpend), detail: 'project AI budgets combined', tone: 'warning' }
  ];
  return <div className={styles.stack} data-layout="portfolio-dashboard">
    <section className={mergeClasses(styles.hero, styles.heroPortfolio, compact && styles.heroCompact)}><div className={styles.heroCopy}><Text size={100}>ZAVA GLOBAL / ENTERPRISE PORTFOLIO</Text><Text as="h1" size={700} weight="semibold" className={styles.heroTitle}>Investment command center</Text><Text size={200} className={styles.heroSummary}>Company-wide capital, run-rate, benefits, AI consumption, and delivery exposure across eight active transformations.</Text></div><span className={mergeClasses(styles.badge, styles.badgeWarning)}>3 projects need attention</span></section>
    <Metrics metrics={metrics} compact={compact}/>
    <div className={mergeClasses(styles.grid, compact && styles.gridCompact)}>
      <section className={mergeClasses(styles.panel, styles.span12, compact && styles.compactSpan)}><PanelHeader title="Company investment landscape" subtitle="All ongoing transformations: approved baseline, current forecast, health, phase, and expected benefit"/>{compact ? <div className={styles.rows}>{[...props.experience.projects].sort((left, right) => right.forecastCost - left.forecastCost).map((project) => <div className={styles.row} key={project.id}><span className={styles.rowCopy}><Text size={200} weight="semibold">{project.title}</Text><Text size={100} className={styles.muted}>{project.phase} / {project.health} / {money.format(project.forecastCost)} forecast</Text></span><span className={mergeClasses(styles.badge, project.health === 'red' ? styles.badgeDanger : project.health === 'amber' ? styles.badgeWarning : styles.badgeSuccess)}>{money.format(project.forecastBenefit)}</span></div>)}</div> : <CompanyInvestmentLandscape projects={props.experience.projects}/>}</section>
      <section className={mergeClasses(styles.panel, styles.span8, compact && styles.compactSpan)}><PanelHeader title="Twelve-month portfolio run-rate" subtitle="Current monthly forecast compared with the approved funding baseline"/>{compact ? <TrendChart values={[536,558,579,601,608,616]} labels={['Sep','Oct','Nov','Dec','Jan','Feb']} forecast ariaLabel="Portfolio run-rate forecast"/> : <CompanyForecastTrajectory/>}<div className={styles.summaryItem}><Warning20Regular color={tokens.colorPaletteDarkOrangeForeground1}/><Text size={100}>The portfolio crosses baseline in October; platform and evaluation capacity account for 72% of the increase.</Text></div></section>
      <section className={mergeClasses(styles.panel, styles.span4, compact && styles.compactSpan)}><PanelHeader title="Investment mix" subtitle="Where company funding is working"/><div className={styles.mixGrid}>{[['People & delivery','42%'],['Platforms','24%'],['AI consumption','14%'],['Change & adoption','12%']].map((item) => <div className={styles.mixItem} key={item[0]}><Text size={100} block className={styles.muted}>{item[0]}</Text><Text size={500} weight="semibold">{item[1]}</Text></div>)}</div><PanelHeader title="Executive exceptions"/><div className={styles.rows}>{[...props.experience.projects].sort((left, right) => Math.abs(right.forecastCost - right.baselineBudget) - Math.abs(left.forecastCost - left.baselineBudget)).slice(0, 3).map((project) => <div className={styles.row} key={project.id}><span className={styles.rowCopy}><Text size={200} weight="semibold">{project.title}</Text><Text size={100} className={styles.muted}>{project.scheduleVarianceDays > 0 ? `+${project.scheduleVarianceDays} days` : 'On schedule'}</Text></span><span className={mergeClasses(styles.badge, project.health === 'red' ? styles.badgeDanger : project.health === 'amber' ? styles.badgeWarning : styles.badgeSuccess)}>{project.health}</span></div>)}</div></section>
      <section className={mergeClasses(styles.panel, styles.span12, compact && styles.compactSpan)}><PanelHeader title="Executive project ledger" subtitle="Complete company portfolio financial and delivery position"/>{compact ? <div className={styles.rows}>{props.experience.projects.map((project) => <div className={styles.row} key={project.id}><span className={styles.rowCopy}><Text size={200} weight="semibold">{project.title}</Text><Text size={100} className={styles.muted}>{project.phase} / approved {money.format(project.baselineBudget)} / variance {money.format(project.forecastCost - project.baselineBudget)}</Text></span><span className={mergeClasses(styles.badge, project.health === 'red' ? styles.badgeDanger : project.health === 'amber' ? styles.badgeWarning : styles.badgeSuccess)}>{project.health}</span></div>)}</div> : <div className={styles.tableScroll}><table className={styles.financeTable}><thead><tr><th className={mergeClasses(styles.tableCell, styles.tableHeader)}>Project</th><th className={mergeClasses(styles.tableCell, styles.tableHeader)}>Phase</th><th className={mergeClasses(styles.tableCell, styles.tableHeader)}>Health</th><th className={mergeClasses(styles.tableCell, styles.tableHeader, styles.alignRight)}>Approved</th><th className={mergeClasses(styles.tableCell, styles.tableHeader, styles.alignRight)}>Forecast</th><th className={mergeClasses(styles.tableCell, styles.tableHeader, styles.alignRight)}>Variance</th><th className={mergeClasses(styles.tableCell, styles.tableHeader, styles.alignRight)}>Benefits</th><th className={mergeClasses(styles.tableCell, styles.tableHeader, styles.alignRight)}>AI spend</th></tr></thead><tbody>{props.experience.projects.map((project) => <tr key={project.id}><td className={styles.tableCell}><Text size={200} weight="semibold">{project.title}</Text></td><td className={styles.tableCell}>{project.phase}</td><td className={styles.tableCell}><span className={mergeClasses(styles.badge, project.health === 'red' ? styles.badgeDanger : project.health === 'amber' ? styles.badgeWarning : styles.badgeSuccess)}>{project.health}</span></td><td className={mergeClasses(styles.tableCell, styles.alignRight)}>{money.format(project.baselineBudget)}</td><td className={mergeClasses(styles.tableCell, styles.alignRight)}>{money.format(project.forecastCost)}</td><td className={mergeClasses(styles.tableCell, styles.alignRight)}>{money.format(project.forecastCost - project.baselineBudget)}</td><td className={mergeClasses(styles.tableCell, styles.alignRight)}>{money.format(project.forecastBenefit)}</td><td className={mergeClasses(styles.tableCell, styles.alignRight)}>{money.format(project.aiSpend)}</td></tr>)}</tbody></table></div>}</section>
    </div>
  </div>;
};

const reviewKindLabel: Readonly<Record<ReviewKind, string>> = {
  project: 'Project request',
  budget: 'Budget',
  resource: 'Resource',
  gate: 'Stage gate'
};

const getProcessedDecisions = (): Record<string, ReviewDecision> =>
  getSessionActionReceipts().filter((receipt) => receipt.kind === 'decision')
    .reduce<Record<string, ReviewDecision>>((result, receipt) => {
      if (receipt.status === 'approved' || receipt.status === 'returned' || receipt.status === 'rejected') result[receipt.recordId] = receipt.status;
      return result;
    }, {});

const DecisionsDashboard: React.FunctionComponent<IFullscreenWorkspaceDashboardProps> = (props) => {
  const styles = useStyles();
  const compact = props.containerWidth !== undefined && props.containerWidth <= 760;
  const initialTypeFilter = REVIEW_KIND_BY_INTENT[props.activeDefinition.key] || 'all';
  const [selectedApprovalId, setSelectedApprovalId] = React.useState<string | undefined>();
  const [typeFilter, setTypeFilter] = React.useState<ReviewKind | 'all'>(initialTypeFilter);
  const [readinessFilter, setReadinessFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [processed, setProcessed] = React.useState<Record<string, ReviewDecision>>(getProcessedDecisions);
  const selectedApproval = ALL_REVIEW_DECISIONS.find((approval) => approval.id === selectedApprovalId);
  const selectedDefinition = selectedApproval ? getIntentDefinition(selectedApproval.intentKey) : undefined;
  const requested = ALL_REVIEW_DECISIONS.reduce((total, approval) => total + (approval.amount || 0), 0);
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: props.currency, maximumFractionDigits: 0 });
  React.useEffect(() => subscribeToSessionActions(() => setProcessed(getProcessedDecisions())), []);
  const metrics: IDashboardMetric[] = [
    { label: 'Waiting', value: String(ALL_REVIEW_DECISIONS.length), detail: 'across four decision types', tone: 'warning' },
    { label: 'Due now', value: String(ALL_REVIEW_DECISIONS.filter((approval) => /today|tomorrow|2 days/i.test(approval.due)).length), detail: 'requires near-term attention', tone: 'danger' },
    { label: 'Evidence ready', value: String(ALL_REVIEW_DECISIONS.filter((approval) => approval.evidence >= 90).length), detail: '90% or more complete', tone: 'positive' },
    { label: 'Requested value', value: money.format(requested), detail: 'budget and intake requests' }
  ];
  const visibleApprovals = ALL_REVIEW_DECISIONS.filter((approval) => {
    const matchesType = typeFilter === 'all' || approval.kind === typeFilter;
    const matchesReadiness = readinessFilter === 'all' || (readinessFilter === 'ready' ? approval.evidence >= 90 : approval.evidence < 90);
    const isProcessed = Boolean(processed[approval.id]);
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'pending' ? !isProcessed : isProcessed);
    return matchesType && matchesReadiness && matchesStatus;
  });
  const selectRequest = (approvalId: string): void => {
    const approval = ALL_REVIEW_DECISIONS.find((item) => item.id === approvalId);
    if (!approval) return;
    setSelectedApprovalId(approvalId);
    props.onSelectIntent(approval.intentKey);
  };
  return <div className={styles.stack} data-layout="decisions-dashboard" data-selected-decision={selectedApprovalId || 'none'}>
    <section className={mergeClasses(styles.hero, styles.heroDecisions, compact && styles.heroCompact)}><div className={styles.heroCopy}><Text size={100}>DECISION CENTER</Text><Text as="h1" size={700} weight="semibold" className={styles.heroTitle}>Decisions that need you now</Text><Text size={200} className={styles.heroSummary}>Incoming requests prioritized by urgency, value at risk, and evidence readiness.</Text></div><span className={mergeClasses(styles.badge, styles.badgeWarning)}>2 due in 48 hours</span></section>
    <Metrics metrics={metrics} compact={compact}/><div className={styles.resetActions}><button type="button" className={styles.requestButton} onClick={resetSessionActions}>Reset demo decisions</button></div>
    <section className={styles.inboxPanel}>
      <div className={mergeClasses(styles.decisionGrid, compact && styles.decisionGridCompact)}>
        <div className={mergeClasses(styles.inboxList, compact && styles.inboxListCompact)}><PanelHeader title="Incoming requests" subtitle={`${visibleApprovals.length} of ${ALL_REVIEW_DECISIONS.length} requests shown`}/><div className={mergeClasses(styles.inboxToolbar, compact && styles.inboxToolbarCompact)}><select aria-label="Filter decisions by type" className={styles.filterSelect} value={typeFilter} onChange={(event) => setTypeFilter(event.currentTarget.value as ReviewKind | 'all')}><option value="all">All types</option><option value="project">Project request</option><option value="budget">Budget</option><option value="resource">Resource</option><option value="gate">Stage gate</option></select><select aria-label="Filter decisions by evidence" className={styles.filterSelect} value={readinessFilter} onChange={(event) => setReadinessFilter(event.currentTarget.value)}><option value="all">All evidence</option><option value="ready">Ready (90%+)</option><option value="needs-evidence">Needs evidence</option></select><select aria-label="Filter decisions by status" className={styles.filterSelect} value={statusFilter} onChange={(event) => setStatusFilter(event.currentTarget.value)}><option value="all">All statuses</option><option value="pending">Pending</option><option value="processed">Processed</option></select></div><div className={styles.rows}>{visibleApprovals.map((approval) => { const active = selectedApprovalId === approval.id; const result = processed[approval.id]; return <div data-approval-id={approval.id} className={mergeClasses(styles.row, styles.rowThree, active && styles.requestActive)} key={approval.id}><img className={styles.avatarSmall} src={EMBEDDED_FACES[approval.imageKey]} alt=""/><span className={styles.rowCopy}><Text size={200} weight="semibold">{approval.title}</Text><Text size={100} className={styles.muted}>{reviewKindLabel[approval.kind]} / {approval.person} / {approval.due} / evidence {approval.evidence}%</Text></span>{result ? <span data-decision={result} className={mergeClasses(styles.badge, result === 'approved' ? styles.badgeSuccess : styles.badgeDanger)}>{result}</span> : <button type="button" className={styles.requestButton} aria-label={`Review ${approval.title}`} onClick={() => selectRequest(approval.id)}>Review</button>}</div>; })}{visibleApprovals.length === 0 && <div className={styles.empty}>No decision requests match these filters.</div>}</div></div>
        <div className={styles.inboxDetail}>{selectedDefinition && selectedApproval ? <><PanelHeader title={reviewKindLabel[selectedApproval.kind]} subtitle={`${selectedApproval.title} / ${selectedApproval.evidence}% evidence complete`}/><ReviewInlineExperiences key={selectedApproval.id} definition={selectedDefinition} properties={{ ...props.initialProperties, approvalId: selectedApproval.id, requestId: selectedApproval.id, gateId: selectedApproval.id, allocationPercent: selectedApproval.intentKey === 'ReviewResourceAssignment' ? Number(props.initialProperties.allocationPercent || selectedApproval.allocation || 20) : props.initialProperties.allocationPercent }} compact={compact} fullscreen embedded onDecisionComplete={(decision) => setProcessed((current) => ({ ...current, [selectedApproval.id]: decision }))}/></> : <div className={styles.overview}><PanelHeader title="No decision item selected" subtitle="Choose Review from the incoming request list to inspect evidence and make a decision."/><div className={styles.overviewCallout}><CheckmarkCircle20Filled aria-hidden="true"/><Text size={200}>The selected request's project, requester, evidence, consequences, and approval controls will appear here.</Text></div></div>}</div>
      </div>
    </section>
  </div>;
};

const FullscreenWorkspaceDashboard: React.FunctionComponent<IFullscreenWorkspaceDashboardProps> = (props) => {
  switch (props.workspace) {
    case 'my-work': return <MyWorkDashboard {...props}/>;
    case 'project': return <ProjectDashboard {...props}/>;
    case 'portfolio': return <PortfolioDashboard {...props}/>;
    case 'approvals': return <DecisionsDashboard {...props}/>;
  }
};

export default FullscreenWorkspaceDashboard;