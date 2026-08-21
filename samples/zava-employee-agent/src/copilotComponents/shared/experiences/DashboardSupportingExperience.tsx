import * as React from 'react';

import { Avatar } from '@fluentui/react-avatar';
import { Text } from '@fluentui/react-text';
import { makeStyles } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import { CalendarLtr20Regular, CheckmarkCircle20Filled, DocumentText20Regular, Warning20Regular } from '@fluentui/react-icons';

import { embeddedImages } from '../mockData/embeddedImages';
import type { FamilyExperienceKind, IFamilyExperienceDefinition } from './familyExperienceCatalog';

type SupportingMode = 'bars' | 'timeline' | 'list' | 'calendar';

interface ISupportingItem {
  title: string;
  detail: string;
  value?: string;
  percent?: number;
  attention?: boolean;
  photoUrl?: string;
}

interface ISupportingContent {
  mode: SupportingMode;
  ariaLabel: string;
  items: ReadonlyArray<ISupportingItem>;
  note: string;
  action?: string;
}

const content: Partial<Record<FamilyExperienceKind, ISupportingContent>> = {
  requestStatus: { mode: 'timeline', ariaLabel: 'Time off request approval timeline', items: [{ title: 'Dates reviewed', detail: '7 working days · complete' }, { title: 'Coverage checked', detail: 'Healthy · complete' }, { title: 'Manager review', detail: 'Not sent yet', attention: true }], note: 'Nothing is submitted until you review and confirm.', action: 'Review draft request' },
  leaveUsage: { mode: 'bars', ariaLabel: 'Vacation usage across the year', items: [{ title: 'Used', detail: 'January to July', value: '9 days', percent: 26 }, { title: 'Planned', detail: 'August trip', value: '7 days', percent: 20 }, { title: 'Remaining', detail: 'After planned leave', value: '11 days', percent: 32 }], note: 'Three carryover days should be used before December 31.' },
  coverage: { mode: 'calendar', ariaLabel: 'Team coverage for proposed leave dates', items: [{ title: 'Mon', detail: '5 available' }, { title: 'Tue', detail: '4 available', attention: true }, { title: 'Wed', detail: '4 available' }, { title: 'Thu', detail: '6 available' }, { title: 'Fri', detail: '6 available' }], note: 'Tuesday has the lowest coverage, but remains above the four-person threshold.' },

  deductions: { mode: 'bars', ariaLabel: 'Pay deduction allocation', items: [{ title: 'Income tax', detail: 'Largest deduction', value: 'EUR 1,640', percent: 71 }, { title: 'Pension', detail: 'Employee contribution', value: 'EUR 420', percent: 18 }, { title: 'Benefits', detail: 'Medical and insurance', value: 'EUR 234', percent: 11 }], note: 'Deductions total EUR 2,294 for the latest period.' },
  payHistory: { mode: 'bars', ariaLabel: 'Six month net pay history', items: [{ title: 'May', detail: 'Regular period', value: 'EUR 4,998', percent: 82 }, { title: 'June', detail: 'Regular period', value: 'EUR 5,005', percent: 83 }, { title: 'July', detail: 'Recognition adjustment', value: 'EUR 5,126', percent: 92 }], note: 'July is higher because of a one-time recognition adjustment.' },
  payDocuments: { mode: 'list', ariaLabel: 'Private pay documents', items: [{ title: 'July pay statement', detail: 'Issued July 31', value: 'New' }, { title: 'June pay statement', detail: 'Issued June 30', value: 'PDF' }, { title: '2025 annual tax summary', detail: 'Issued January 15', value: 'PDF' }], note: 'Documents remain inside this private Money workspace.', action: 'Open document center' },

  currentBenefits: { mode: 'list', ariaLabel: 'Current benefit coverage', items: [{ title: 'Zava Plus medical', detail: 'Family coverage · active', value: 'EUR 182/mo' }, { title: 'Enhanced dental', detail: 'Family coverage · active', value: 'EUR 42/mo' }, { title: 'Wellbeing account', detail: 'Employee coverage · active', value: 'EUR 24/mo' }], note: 'All selected plans are active with no interruption in coverage.' },
  dependents: { mode: 'list', ariaLabel: 'Dependent benefit coverage', items: [{ title: 'Avery Bowen', detail: 'Medical and dental', value: 'Covered' }, { title: 'Riley Bowen', detail: 'Medical and dental', value: 'Covered' }, { title: 'Verification document', detail: 'Relationship evidence', value: 'Due in 12 days', attention: true }], note: 'No coverage gaps were detected for either dependent.', action: 'Review dependents' },
  enrollment: { mode: 'timeline', ariaLabel: 'Open enrollment checklist', items: [{ title: 'Review current plans', detail: 'Complete' }, { title: 'Compare 2027 options', detail: 'Complete' }, { title: 'Confirm dependents', detail: 'Document needed', attention: true }, { title: 'Submit elections', detail: 'Due in 23 days' }], note: 'Dependent verification is the only item blocking submission.', action: 'Continue enrollment' },

  caseStatus: { mode: 'timeline', ariaLabel: 'HR case status timeline', items: [{ title: 'Case opened', detail: 'Yesterday · 09:18' }, { title: 'HR specialist assigned', detail: 'Yesterday · 10:02' }, { title: 'Private response received', detail: 'Today · 08:35', attention: true }], note: 'Case HR-2048 is waiting for your private response.', action: 'Open case HR-2048' },
  caseBoard: { mode: 'list', ariaLabel: 'My HR cases board', items: [{ title: 'HR-2048 · Payroll deduction', detail: 'Waiting for your response', value: 'Open', attention: true }, { title: 'HR-1981 · Benefit enrollment', detail: 'Resolved July 18', value: 'Resolved' }, { title: 'HR-1914 · Leave correction', detail: 'Resolved June 03', value: 'Resolved' }], note: 'Sensitive descriptions are intentionally omitted from this summary.', action: 'View all cases' },
  quickAnswer: { mode: 'list', ariaLabel: 'Knowledge answer before opening a case', items: [{ title: 'Likely explanation', detail: 'One-time recognition adjustment changed withholding', value: '88%' }, { title: 'Payroll guide', detail: 'Understanding deductions · section 4', value: 'Source' }, { title: 'Latest statement', detail: 'July 2026 · private', value: 'Evidence' }], note: 'You can still continue to a private case if this does not resolve the question.', action: 'Review grounded answer' },
  serviceHealth: { mode: 'bars', ariaLabel: 'HR desk service health', items: [{ title: 'First response', detail: 'Target: 8 hours', value: '4 hours', percent: 88 }, { title: 'First-reply resolution', detail: 'Last 30 days', value: '72%', percent: 72 }, { title: 'Satisfaction', detail: 'Employee rating', value: '4.7/5', percent: 94 }], note: 'Current service levels are within their published targets.' },

  continueLearning: { mode: 'timeline', ariaLabel: 'Active course modules', items: [{ title: 'Privacy principles', detail: 'Complete · 18 min' }, { title: 'Handling sensitive data', detail: 'In progress · 12 min left', attention: true }, { title: 'Knowledge check', detail: 'Not started · 12 min' }], note: 'The course resumes at Handling sensitive data.', action: 'Resume course' },
  learningProgress: { mode: 'bars', ariaLabel: 'Quarterly learning progress', items: [{ title: 'Compliance', detail: 'Required learning', value: '86%', percent: 86 }, { title: 'Role path', detail: 'Inclusive product leadership', value: '68%', percent: 68 }, { title: 'Elective goal', detail: 'Eight-hour quarterly target', value: '8.5h', percent: 100 }], note: 'Two role-path skills advanced this quarter.' },
  recommendations: { mode: 'list', ariaLabel: 'Role based learning recommendations', items: [{ title: 'Inclusive product leadership', detail: 'Evidence: current role and growth goal', value: '94% fit' }, { title: 'Accessible keynote delivery', detail: 'Evidence: upcoming customer presentation', value: '91% fit' }, { title: 'Coaching through change', detail: 'Evidence: team leadership path', value: '84% fit' }], note: 'Recommendations use mocked role and goal evidence, not inferred personal traits.', action: 'Review learning path' },
  teamLearning: { mode: 'list', ariaLabel: 'Team learning compliance status', items: [{ title: 'Eight team members', detail: 'All required learning complete', value: 'Compliant' }, { title: 'Lee Gu', detail: 'Privacy foundations due Friday', value: 'Due soon', attention: true }, { title: 'Team total', detail: 'No overdue assignments', value: '89%' }], note: 'Only managers can see person-level compliance details.', action: 'Review team learning' },

  compensationHistory: { mode: 'bars', ariaLabel: 'Three year total compensation history', items: [{ title: '2024', detail: 'Base, bonus, and benefits', value: 'EUR 146K', percent: 72 }, { title: '2025', detail: 'Expanded role scope', value: 'EUR 158K', percent: 82 }, { title: '2026', detail: 'New equity grant', value: 'EUR 184K', percent: 96 }], note: 'Values show annual employment value, not take-home pay.' },
  rewardsChange: { mode: 'bars', ariaLabel: 'Year over year total rewards change', items: [{ title: 'Equity grant', detail: 'Primary increase driver', value: '+EUR 18K', percent: 70 }, { title: 'Pension', detail: 'Employer contribution', value: '+EUR 5K', percent: 20 }, { title: 'Base and benefits', detail: 'Combined change', value: '+EUR 3K', percent: 12 }], note: 'Total estimated employment value increased EUR 26,000.' },
  equityVesting: { mode: 'timeline', ariaLabel: 'Equity vesting timeline', items: [{ title: 'October 2026', detail: 'Expected vest · EUR 8K', attention: true }, { title: 'January 2027', detail: 'Expected vest · EUR 6K' }, { title: 'April 2027', detail: 'Expected vest · EUR 6K' }, { title: 'October 2027', detail: 'Expected vest · EUR 4K' }], note: 'Values use the current mocked grant value and may change.' },
  pensionValue: { mode: 'list', ariaLabel: 'Pension and employer funded benefits', items: [{ title: 'Employer pension', detail: 'Annual contribution', value: 'EUR 25K' }, { title: 'Medical and dental', detail: 'Employer-funded value', value: 'EUR 11K' }, { title: 'Insurance and wellbeing', detail: 'Employer-funded value', value: 'EUR 7K' }], note: 'These values are included in total rewards but not paid as salary.' },

  teamHub: { mode: 'list', ariaLabel: 'Manager team roster', items: [{ title: 'Lee Gu', detail: 'Principal Product Manager · Stockholm', value: 'Check-in due' }, { title: 'Patti Fernandez', detail: 'HR Business Partner · Helsinki', value: 'Available' }, { title: 'Nestor Wilke', detail: 'Benefits Operations Lead · Munich', value: 'Learning due', attention: true }], note: 'Role-aware summaries avoid exposing private employee details.', action: 'Open team directory' },
  teamSignals: { mode: 'list', ariaLabel: 'Explainable team attention signals', items: [{ title: 'Tuesday coverage overlap', detail: 'Two people away · coverage remains healthy', value: 'Review' }, { title: 'Privacy course deadline', detail: 'One team member due Friday', value: 'Due soon', attention: true }, { title: 'Check-in cadence', detail: 'Two conversations due this week', value: 'Plan' }], note: 'Signals describe work context only; no health or sentiment is inferred.' },
  checkIn: { mode: 'timeline', ariaLabel: 'Manager check-in preparation', items: [{ title: 'Progress', detail: 'Customer keynote and accessibility review' }, { title: 'Support', detail: 'Coverage during planned leave' }, { title: 'Development', detail: 'Inclusive product leadership path' }], note: 'Review the agenda before scheduling or sharing it.', action: 'Review check-in agenda' },

  network: { mode: 'list', ariaLabel: 'People collaboration network', items: [{ title: 'Lee Gu', detail: 'Closest collaborator · Customer programs', value: 'Daily', photoUrl: embeddedImages.leeGu }, { title: 'Patti Fernandez', detail: 'HR partner · Career development', value: 'Weekly', photoUrl: embeddedImages.pattiFernandez }, { title: 'Johanna Lorenz', detail: 'Extended network · Accessibility', value: '2 hops', photoUrl: embeddedImages.johannaLorenz }], note: 'Relationship labels come from mocked collaboration context.' },
  meeting: { mode: 'timeline', ariaLabel: 'Upcoming meeting preparation', items: [{ title: 'Progress', detail: 'Keynote accessibility review' }, { title: 'Decision', detail: 'Next role milestone' }, { title: 'Support', detail: 'Inclusive design network' }], note: 'Career growth one-to-one with Diego Siciliani · Tomorrow at 10:00.', action: 'Prepare conversation' },
  orgSignals: { mode: 'timeline', ariaLabel: 'Organization change signals', items: [{ title: 'Accessibility practice', detail: 'New leadership role opens next month', attention: true }, { title: 'Customer programs', detail: 'Two roles added for keynote delivery' }, { title: 'Experience platform', detail: 'Reporting line changes September 1' }], note: 'Signals report published organization changes without speculative people analytics.' }
};

const portraitByName: { [name: string]: string } = {
  'Lee Gu': embeddedImages.leeGu,
  'Patti Fernandez': embeddedImages.pattiFernandez,
  'Nestor Wilke': embeddedImages.nestorWilke,
  'Pradeep Gupta': embeddedImages.pradeepGupta,
  'Diego Siciliani': embeddedImages.diegoSiciliani,
  'Megan Bowen': embeddedImages.meganBowen
};

const useStyles = makeStyles({
  stack: { display: 'flex', flexDirection: 'column', gap: '9px' },
  row: { display: 'grid', gridTemplateColumns: '32px minmax(0, 1fr) auto', gap: '9px', alignItems: 'center', padding: '9px', borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
  avatar: { width: '32px', height: '32px', flexShrink: 0 },
  rowAttention: { backgroundColor: tokens.colorPaletteMarigoldBackground2, borderRadius: tokens.borderRadiusMedium },
  copy: { minWidth: 0 },
  muted: { color: tokens.colorNeutralForeground3 },
  value: { color: tokens.colorNeutralForeground2, fontWeight: tokens.fontWeightSemibold, textAlign: 'right' },
  barTrack: { height: '8px', marginTop: '5px', overflow: 'hidden', backgroundColor: tokens.colorNeutralBackground4, borderRadius: tokens.borderRadiusCircular },
  barFill: { height: '100%', backgroundColor: tokens.colorBrandBackground, borderRadius: tokens.borderRadiusCircular },
  calendar: { display: 'grid', gridTemplateColumns: 'repeat(5, minmax(72px, 1fr))', gap: '6px', overflowX: 'auto' },
  day: { minWidth: '72px', padding: '10px 7px', textAlign: 'center', backgroundColor: tokens.colorNeutralBackground3, borderRadius: tokens.borderRadiusMedium },
  dayAttention: { backgroundColor: tokens.colorPaletteMarigoldBackground2, border: `1px solid ${tokens.colorPaletteMarigoldBorderActive}` },
  note: { display: 'grid', gridTemplateColumns: '24px minmax(0, 1fr)', gap: '8px', padding: '9px', color: tokens.colorNeutralForeground2, backgroundColor: tokens.colorNeutralBackground3, borderRadius: tokens.borderRadiusMedium },
  button: { alignSelf: 'flex-start', padding: '8px 12px', color: tokens.colorNeutralForegroundOnBrand, backgroundColor: tokens.colorBrandBackground, border: 'none', borderRadius: tokens.borderRadiusMedium, cursor: 'pointer', fontWeight: tokens.fontWeightSemibold }
});

const StandardRows: React.FunctionComponent<{ data: ISupportingContent }> = ({ data }) => {
  const styles = useStyles();
  return <div className={styles.stack}>{data.items.map((item) => { const portrait = item.photoUrl || portraitByName[item.title]; return <div className={`${styles.row} ${item.attention ? styles.rowAttention : ''}`} key={item.title}>{portrait ? <Avatar className={styles.avatar} name={item.title} image={{ src: portrait }} size={32} /> : item.attention ? <Warning20Regular /> : data.mode === 'timeline' ? <CheckmarkCircle20Filled /> : <DocumentText20Regular />}<span className={styles.copy}><Text block weight="semibold">{item.title}</Text><Text size={200} className={styles.muted}>{item.detail}</Text>{data.mode === 'bars' && <div className={styles.barTrack}><div className={styles.barFill} style={{ width: `${item.percent || 0}%` }} /></div>}</span>{item.value && <Text size={200} className={styles.value}>{item.value}</Text>}</div>; })}</div>;
};

const CalendarRows: React.FunctionComponent<{ data: ISupportingContent }> = ({ data }) => {
  const styles = useStyles();
  return <div className={styles.calendar} role="img" aria-label={data.ariaLabel}>{data.items.map((item) => <div className={`${styles.day} ${item.attention ? styles.dayAttention : ''}`} key={item.title}><Text block weight="semibold">{item.title}</Text><Text size={200}>{item.detail}</Text></div>)}</div>;
};

export interface IDashboardSupportingExperienceProps {
  definition: IFamilyExperienceDefinition;
}

const DashboardSupportingExperience: React.FunctionComponent<IDashboardSupportingExperienceProps> = ({ definition }) => {
  const styles = useStyles();
  const data = content[definition.kind];
  if (!data) {
    return null;
  }
  return <><div role={data.mode === 'calendar' ? undefined : 'group'} aria-label={data.ariaLabel}>{data.mode === 'calendar' ? <CalendarRows data={data} /> : <StandardRows data={data} />}</div><div className={styles.note}><CalendarLtr20Regular /><Text size={200}>{data.note}</Text></div>{data.action && <button type="button" className={styles.button}>{data.action}</button>}</>;
};

export default DashboardSupportingExperience;