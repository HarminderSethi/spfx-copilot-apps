import * as React from 'react';

import { Text } from '@fluentui/react-text';
import { makeStyles, mergeClasses } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import {
  ArrowLeft20Regular,
  CheckmarkCircle20Filled,
  DismissCircle20Filled,
  Send20Regular,
  Warning20Filled,
  Warning20Regular
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  stack: { display: 'flex', flexDirection: 'column', gap: '12px' },
  heading: { display: 'flex', flexDirection: 'column', gap: '3px' },
  summary: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '7px' },
  compact: { gridTemplateColumns: 'minmax(0, 1fr)' },
  item: { minWidth: 0, padding: '9px', backgroundColor: tokens.colorNeutralBackground2, borderRadius: tokens.borderRadiusMedium },
  span: { gridColumn: '1 / -1' },
  label: { color: tokens.colorNeutralForeground3 },
  value: { overflowWrap: 'anywhere' },
  actions: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  primary: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', minHeight: '34px', padding: '7px 11px', border: 'none', borderRadius: tokens.borderRadiusMedium, color: tokens.colorNeutralForegroundOnBrand, backgroundColor: tokens.colorBrandBackground, fontWeight: tokens.fontWeightSemibold, cursor: 'pointer' },
  secondary: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', minHeight: '34px', padding: '7px 11px', border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, color: tokens.colorNeutralForeground2, backgroundColor: tokens.colorNeutralBackground1, fontWeight: tokens.fontWeightSemibold, cursor: 'pointer' },
  alert: { display: 'grid', gridTemplateColumns: '22px minmax(0, 1fr)', gap: '8px', padding: '10px', color: tokens.colorPaletteMarigoldForeground2, backgroundColor: tokens.colorPaletteMarigoldBackground2, borderRadius: tokens.borderRadiusMedium },
  success: { display: 'grid', gridTemplateColumns: '30px minmax(0, 1fr)', gap: '10px', padding: '13px', color: tokens.colorPaletteGreenForeground1, backgroundColor: tokens.colorPaletteGreenBackground2, border: `1px solid ${tokens.colorPaletteGreenBorderActive}`, borderRadius: tokens.borderRadiusMedium },
  statusBadge: { display: 'inline-flex', alignItems: 'center', gap: '5px', width: 'fit-content', padding: '4px 8px', borderRadius: tokens.borderRadiusCircular, fontWeight: tokens.fontWeightSemibold },
  green: { color: tokens.colorPaletteGreenForeground1, backgroundColor: tokens.colorPaletteGreenBackground2 },
  amber: { color: tokens.colorPaletteDarkOrangeForeground1, backgroundColor: tokens.colorPaletteMarigoldBackground2 },
  red: { color: tokens.colorPaletteRedForeground1, backgroundColor: tokens.colorPaletteRedBackground2 },
  dayGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '5px' },
  day: { padding: '8px 4px', textAlign: 'center', backgroundColor: tokens.colorNeutralBackground2, borderRadius: tokens.borderRadiusMedium },
  statusGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '6px' },
  receiptMeta: { color: tokens.colorNeutralForeground3 }
});

export interface ISubmissionReviewProps {
  intentKey: string;
  values: Record<string, string | number>;
  compact: boolean;
  onEdit: () => void;
  onConfirm: () => void;
}

export interface ISubmissionReceiptProps {
  intentKey: string;
  values: Record<string, string | number>;
  onReset: () => void;
}

const ReviewItem: React.FunctionComponent<{ label: string; value: React.ReactNode; span?: boolean }> = ({ label, value, span }) => {
  const styles = useStyles();
  return <div className={mergeClasses(styles.item, span && styles.span)}><Text size={100} className={styles.label} block>{label}</Text><div className={styles.value}>{value}</div></div>;
};

const StatusBadge: React.FunctionComponent<{ value: string }> = ({ value }) => {
  const styles = useStyles();
  const normalized = value.toLowerCase();
  const semanticClass = normalized === 'green' ? styles.green : normalized === 'red' ? styles.red : styles.amber;
  const icon = normalized === 'green' ? <CheckmarkCircle20Filled /> : normalized === 'red' ? <DismissCircle20Filled /> : <Warning20Filled />;
  const meaning = normalized === 'green' ? 'On track' : normalized === 'red' ? 'Off track' : 'Needs attention';
  return <span className={mergeClasses(styles.statusBadge, semanticClass)} data-status={normalized}>{icon}<span>{normalized} / {meaning}</span></span>;
};

const ReviewActions: React.FunctionComponent<{ onEdit: () => void; onConfirm: () => void; confirmLabel: string }> = ({ onEdit, onConfirm, confirmLabel }) => {
  const styles = useStyles();
  return <div className={styles.actions}><button type="button" className={styles.secondary} onClick={onEdit}><ArrowLeft20Regular /> Edit</button><button type="button" className={styles.primary} onClick={onConfirm}><Send20Regular /> {confirmLabel}</button></div>;
};

const WeeklyUpdateReview: React.FunctionComponent<ISubmissionReviewProps> = ({ values, compact, onEdit, onConfirm }) => {
  const styles = useStyles();
  return <div className={styles.stack} data-layout="SubmitWeeklyUpdate-review"><div className={styles.heading}><Text size={500} weight="semibold">Review weekly update</Text><Text size={200} className={styles.label}>{String(values.project)} / week ending {String(values.date)}</Text></div><div className={mergeClasses(styles.summary, compact && styles.compact)}><ReviewItem label="Overall status" value={<StatusBadge value={String(values.confidence)} />} /><ReviewItem label="Accomplishments" value={<Text size={200} weight="semibold">{String(values.accomplishments)}</Text>} span /><ReviewItem label="Next steps" value={<Text size={200} weight="semibold">{String(values.nextSteps)}</Text>} span /><ReviewItem label="Blocker / help needed" value={<Text size={200} weight="semibold">{String(values.blockers)}</Text>} span /></div><div className={styles.alert}><Warning20Regular /><Text size={200}>This update will be visible to the project team and sponsor in the mocked status history.</Text></div><ReviewActions onEdit={onEdit} onConfirm={onConfirm} confirmLabel="Publish weekly update" /></div>;
};

const TimesheetReview: React.FunctionComponent<ISubmissionReviewProps> = ({ values, compact, onEdit, onConfirm }) => {
  const styles = useStyles();
  const hours = [0, 1, 2, 3, 4].map((index) => Number(values[`d${index}`]));
  const total = hours.reduce((sum, value) => sum + value, 0);
  return <div className={styles.stack} data-layout="SubmitTimesheet-review"><div className={styles.heading}><Text size={500} weight="semibold">Review weekly timesheet</Text><Text size={200} className={styles.label}>{String(values.project)} / {String(values.workCategory)}</Text></div><div className={mergeClasses(styles.summary, compact && styles.compact)}><ReviewItem label="Week ending" value={<Text weight="semibold">{String(values.date)}</Text>} /><ReviewItem label="Weekly total" value={<Text weight="semibold">{total} hours</Text>} /><ReviewItem label="Capacity position" value={<Text weight="semibold">{total <= 40 ? `${40 - total}h remaining` : `${total - 40}h over`}</Text>} /></div><div className={styles.dayGrid}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => <div className={styles.day} key={day}><Text size={100} className={styles.label} block>{day}</Text><Text weight="semibold">{hours[index]}h</Text></div>)}</div><ReviewItem label="Notes" value={<Text size={200}>{String(values.notes)}</Text>} /><ReviewActions onEdit={onEdit} onConfirm={onConfirm} confirmLabel="Submit timesheet" /></div>;
};

const ProjectStatusReview: React.FunctionComponent<ISubmissionReviewProps> = ({ values, compact, onEdit, onConfirm }) => {
  const styles = useStyles();
  const dimensions = ['delivery', 'budget', 'scope', 'value', 'risk'];
  return <div className={styles.stack} data-layout="SubmitProjectStatus-review"><div className={styles.heading}><Text size={500} weight="semibold">Review project status report</Text><Text size={200} className={styles.label}>{String(values.project)} / reporting date {String(values.date)}</Text></div><div className={mergeClasses(styles.statusGrid, compact && styles.compact)}>{dimensions.map((dimension) => <ReviewItem key={dimension} label={`${dimension} status`} value={<StatusBadge value={String(values[`${dimension}Status`])} />} />)}</div><ReviewItem label="Executive summary" value={<Text size={200} weight="semibold">{String(values.summary)}</Text>} /><div className={mergeClasses(styles.summary, compact && styles.compact)}><ReviewItem label="Accomplishments" value={<Text size={200}>{String(values.accomplishments)}</Text>} /><ReviewItem label="Next steps" value={<Text size={200}>{String(values.nextSteps)}</Text>} /><ReviewItem label="Help needed / status reasons" value={<Text size={200}>{String(values.help)}</Text>} /></div><ReviewActions onEdit={onEdit} onConfirm={onConfirm} confirmLabel="Submit status report" /></div>;
};

const AiUsageReview: React.FunctionComponent<ISubmissionReviewProps> = ({ values, compact, onEdit, onConfirm }) => {
  const styles = useStyles();
  const inputTokens = Number(values.inputTokens);
  const outputTokens = Number(values.outputTokens);
  const cost = Math.round(inputTokens * .0011 + outputTokens * .002);
  return <div className={styles.stack} data-layout="SubmitAiUsage-review"><div className={styles.heading}><Text size={500} weight="semibold">Review AI usage record</Text><Text size={200} className={styles.label}>{String(values.project)} / {String(values.model)} / {String(values.environment)}</Text></div><div className={mergeClasses(styles.summary, compact && styles.compact)}><ReviewItem label="Input tokens" value={<Text weight="semibold">{inputTokens.toLocaleString()}</Text>} /><ReviewItem label="Output tokens" value={<Text weight="semibold">{outputTokens.toLocaleString()}</Text>} /><ReviewItem label="Estimated cost" value={<Text weight="semibold">${cost.toLocaleString()}</Text>} /><ReviewItem label="Data classification" value={<Text weight="semibold">Internal</Text>} /><ReviewItem label="Forecast impact" value={<Text weight="semibold">+0.4%</Text>} /><ReviewItem label="Attestation" value={<Text weight="semibold">Confirmed</Text>} /></div><ReviewItem label="Usage purpose" value={<Text size={200}>{String(values.purpose)}</Text>} /><ReviewActions onEdit={onEdit} onConfirm={onConfirm} confirmLabel="Submit usage record" /></div>;
};

const ProjectRequestReview: React.FunctionComponent<ISubmissionReviewProps> = ({ values, compact, onEdit, onConfirm }) => {
  const styles = useStyles();
  return <div className={styles.stack} data-layout="SubmitProjectRequest-review"><div className={styles.heading}><Text size={500} weight="semibold">Review project intake request</Text><Text size={200} className={styles.label}>New project / governance intake</Text></div><div className={mergeClasses(styles.summary, compact && styles.compact)}><ReviewItem label="Project title" value={<Text weight="semibold">{String(values.title)}</Text>} /><ReviewItem label="Sponsor" value={<Text weight="semibold">{String(values.sponsor)}</Text>} /><ReviewItem label="Strategic objective" value={<Text weight="semibold">{String(values.objective)}</Text>} /><ReviewItem label="Target start" value={<Text weight="semibold">{String(values.targetStart)}</Text>} /><ReviewItem label="Expected value" value={<Text weight="semibold">{String(values.expectedValue)}</Text>} /><ReviewItem label="Estimated budget" value={<Text weight="semibold">${Number(values.budget).toLocaleString()}</Text>} /><ReviewItem label="AI classification" value={<Text weight="semibold">{String(values.aiClassification)}</Text>} /></div><ReviewItem label="Business problem" value={<Text size={200}>{String(values.problem)}</Text>} span /><div className={styles.alert}><Warning20Regular /><Text size={200}>Approval path: Portfolio sponsor, Finance, Responsible AI, then Product Council.</Text></div><ReviewActions onEdit={onEdit} onConfirm={onConfirm} confirmLabel="Submit project request" /></div>;
};

export const SubmissionReviewExperience: React.FunctionComponent<ISubmissionReviewProps> = (props) => {
  switch (props.intentKey) {
    case 'SubmitWeeklyUpdate': return <WeeklyUpdateReview {...props} />;
    case 'SubmitTimesheet': return <TimesheetReview {...props} />;
    case 'SubmitProjectStatus': return <ProjectStatusReview {...props} />;
    case 'SubmitAiUsage': return <AiUsageReview {...props} />;
    case 'SubmitProjectRequest': return <ProjectRequestReview {...props} />;
    default: throw new Error(`No submission review for ${props.intentKey}`);
  }
};

const ReceiptShell: React.FunctionComponent<{ title: string; detail: string; receiptId: string; onReset: () => void }> = ({ title, detail, receiptId, onReset }) => {
  const styles = useStyles();
  return <div className={styles.stack}><div className={styles.success} role="status"><CheckmarkCircle20Filled /><span><Text block weight="semibold">{title}</Text><Text size={200}>{detail}</Text></span></div><Text className={styles.receiptMeta}>Receipt {receiptId} / stored in this browser session only. No live system was updated.</Text><button type="button" className={styles.secondary} onClick={onReset}>Create another</button></div>;
};

export const SubmissionReceiptExperience: React.FunctionComponent<ISubmissionReceiptProps> = ({ intentKey, values, onReset }) => {
  const total = [0, 1, 2, 3, 4].reduce((sum, index) => sum + Number(values[`d${index}`] || 0), 0);
  switch (intentKey) {
    case 'SubmitWeeklyUpdate': return <div data-layout="SubmitWeeklyUpdate-receipt"><ReceiptShell title="Weekly update published" detail={`${String(values.project)} / ${String(values.confidence)} / week ending ${String(values.date)}`} receiptId="WSU-2601-34" onReset={onReset} /></div>;
    case 'SubmitTimesheet': return <div data-layout="SubmitTimesheet-receipt"><ReceiptShell title="Timesheet submitted" detail={`${total} hours for ${String(values.project)} / ${String(values.workCategory)} are pending manager review.`} receiptId="TSH-2601-0818" onReset={onReset} /></div>;
    case 'SubmitProjectStatus': return <div data-layout="SubmitProjectStatus-receipt"><ReceiptShell title="Project status report submitted" detail={`${String(values.project)} / ${String(values.date)} / Delivery ${String(values.deliveryStatus)}, Budget ${String(values.budgetStatus)}, Scope ${String(values.scopeStatus)}, Value ${String(values.valueStatus)}, Risk ${String(values.riskStatus)}.`} receiptId="PSR-2601-0818" onReset={onReset} /></div>;
    case 'SubmitAiUsage': return <div data-layout="SubmitAiUsage-receipt"><ReceiptShell title="AI usage record submitted" detail={`${String(values.project)} / ${String(values.model)} / ${String(values.environment)} / ${Number(values.inputTokens).toLocaleString()} input and ${Number(values.outputTokens).toLocaleString()} output tokens recorded.`} receiptId="AIU-2601-0817" onReset={onReset} /></div>;
    case 'SubmitProjectRequest': return <div data-layout="SubmitProjectRequest-receipt"><ReceiptShell title="Project intake request created" detail={`${String(values.title)} / ${String(values.sponsor)} / $${Number(values.budget).toLocaleString()} is pending portfolio sponsor and Finance review.`} receiptId="PRQ-2611" onReset={onReset} /></div>;
    default: throw new Error(`No submission receipt for ${intentKey}`);
  }
};
