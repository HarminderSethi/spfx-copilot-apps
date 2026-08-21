import * as React from 'react';

import { Avatar } from '@fluentui/react-avatar';
import { Text } from '@fluentui/react-text';
import { makeStyles } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import { ArrowLeft20Regular, CheckmarkCircle20Filled, DismissCircle20Filled, Warning20Regular } from '@fluentui/react-icons';

import { embeddedImages } from '../mockData/embeddedImages';

type Decision = 'approved' | 'declined';
type ApprovalStage = 'queue' | 'review' | 'confirm' | 'decided';

interface IApprovalRecord {
  id: string;
  person: string;
  photoUrl: string;
  title: string;
  due: string;
  context: string;
  summary: string;
  details: ReadonlyArray<{ label: string; value: string }>;
  risk: string;
}

const approvals: ReadonlyArray<IApprovalRecord> = [
  { id: 'leave-lee', person: 'Lee Gu', photoUrl: embeddedImages.leeGu, title: 'Vacation request', due: 'Due today', context: 'Customer support coverage', summary: 'Lee requests vacation from August 4 through August 12 for a family trip.', details: [{ label: 'Working days', value: '7' }, { label: 'Balance after', value: '11 days' }, { label: 'Team coverage', value: 'Healthy' }, { label: 'Calendar conflict', value: 'Customer review · Aug 6' }], risk: 'Tuesday has the lowest coverage, but four team members remain available.' },
  { id: 'learning-nestor', person: 'Nestor Wilke', photoUrl: embeddedImages.nestorWilke, title: 'Learning plan', due: 'Due tomorrow', context: 'Role development', summary: 'Nestor requests protected learning time for the Benefits Operations leadership path.', details: [{ label: 'Learning time', value: '4 hours' }, { label: 'Target date', value: 'August 21' }, { label: 'Course fit', value: '92%' }, { label: 'Coverage', value: 'No conflict' }], risk: 'The learning block does not overlap payroll or enrollment deadlines.' },
  { id: 'schedule-patti', person: 'Patti Fernandez', photoUrl: embeddedImages.pattiFernandez, title: 'Schedule change', due: 'Due Friday', context: 'No coverage impact', summary: 'Patti requests a temporary early-start schedule for two weeks.', details: [{ label: 'Starts', value: 'August 17' }, { label: 'Duration', value: '2 weeks' }, { label: 'Daily hours', value: 'Unchanged' }, { label: 'Coverage', value: 'No impact' }], risk: 'The schedule keeps all customer and team overlap commitments.' }
];

const useStyles = makeStyles({
  stack: { display: 'flex', flexDirection: 'column', gap: '12px' },
  queue: { display: 'flex', flexDirection: 'column' },
  queueItem: { display: 'grid', gridTemplateColumns: '40px minmax(0, 1fr) auto', gap: '10px', alignItems: 'center', padding: '10px', borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
  muted: { color: tokens.colorNeutralForeground3 },
  personHeader: { display: 'flex', alignItems: 'center', gap: '10px' },
  summary: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px', '@media (max-width: 420px)': { gridTemplateColumns: '1fr' } },
  summaryItem: { padding: '10px', backgroundColor: tokens.colorNeutralBackground3, borderRadius: tokens.borderRadiusMedium },
  label: { color: tokens.colorNeutralForeground3 },
  alert: { display: 'grid', gridTemplateColumns: '24px minmax(0, 1fr)', gap: '8px', padding: '10px', color: tokens.colorPaletteMarigoldForeground2, backgroundColor: tokens.colorPaletteMarigoldBackground2, borderRadius: tokens.borderRadiusMedium },
  actions: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  primary: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 12px', color: tokens.colorNeutralForegroundOnBrand, backgroundColor: tokens.colorBrandBackground, border: 'none', borderRadius: tokens.borderRadiusMedium, cursor: 'pointer', fontWeight: tokens.fontWeightSemibold },
  secondary: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 12px', color: tokens.colorNeutralForeground2, backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, cursor: 'pointer', fontWeight: tokens.fontWeightSemibold },
  decline: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 12px', color: tokens.colorNeutralForegroundOnBrand, backgroundColor: tokens.colorPaletteRedBackground3, border: 'none', borderRadius: tokens.borderRadiusMedium, cursor: 'pointer', fontWeight: tokens.fontWeightSemibold },
  field: { display: 'flex', flexDirection: 'column', gap: '4px' },
  input: { minWidth: 0, padding: '8px', color: tokens.colorNeutralForeground1, backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium },
  outcome: { display: 'grid', gridTemplateColumns: '32px minmax(0, 1fr)', gap: '10px', padding: '14px', borderRadius: tokens.borderRadiusMedium },
  approved: { color: tokens.colorPaletteGreenForeground1, backgroundColor: tokens.colorPaletteGreenBackground2, border: `1px solid ${tokens.colorPaletteGreenBorderActive}` },
  declined: { color: tokens.colorPaletteRedForeground1, backgroundColor: tokens.colorPaletteRedBackground2, border: `1px solid ${tokens.colorPaletteRedBorderActive}` },
  outcomeIcon: { fontSize: '28px' },
  status: { padding: '3px 7px', color: tokens.colorPaletteGreenForeground1, backgroundColor: tokens.colorPaletteGreenBackground2, borderRadius: tokens.borderRadiusCircular }
});

const ApprovalDecisionWorkflow: React.FunctionComponent = () => {
  const styles = useStyles();
  const [stage, setStage] = React.useState<ApprovalStage>('queue');
  const [selectedId, setSelectedId] = React.useState<string>(approvals[0].id);
  const [pendingDecision, setPendingDecision] = React.useState<Decision>('approved');
  const [declineReason, setDeclineReason] = React.useState('Please choose dates with stronger customer coverage.');
  const [decisions, setDecisions] = React.useState<{ [id: string]: Decision }>({});
  const selected = approvals.find((approval) => approval.id === selectedId) || approvals[0];

  const review = (id: string): void => {
    setSelectedId(id);
    setStage('review');
  };

  const chooseDecision = (decision: Decision): void => {
    setPendingDecision(decision);
    setStage('confirm');
  };

  const confirmDecision = (): void => {
    setDecisions((current) => ({ ...current, [selected.id]: pendingDecision }));
    setStage('decided');
  };

  if (stage === 'decided') {
    const approved = pendingDecision === 'approved';
    return <div className={styles.stack} role="status" aria-live="polite"><div className={`${styles.outcome} ${approved ? styles.approved : styles.declined}`}>{approved ? <CheckmarkCircle20Filled className={styles.outcomeIcon} /> : <DismissCircle20Filled className={styles.outcomeIcon} />}<span><Text size={400} block weight="semibold">{selected.title} {approved ? 'approved' : 'declined'}</Text><Text size={200} block>{selected.person} was notified in this mocked workflow.{!approved && ` Reason: ${declineReason}`}</Text></span></div><Text size={200} className={styles.muted}>Showcase only: no approval decision was written to a live system.</Text><button type="button" className={styles.secondary} onClick={() => setStage('queue')}><ArrowLeft20Regular /> Back to approvals</button></div>;
  }

  if (stage === 'confirm') {
    const approved = pendingDecision === 'approved';
    return <div className={styles.stack}><Text size={500} weight="semibold">Confirm {approved ? 'approval' : 'decline'}</Text><div className={styles.personHeader}><Avatar name={selected.person} image={{ src: selected.photoUrl }} size={40} /><span><Text block weight="semibold">{selected.person} · {selected.title}</Text><Text size={200} className={styles.muted}>{selected.summary}</Text></span></div>{!approved && <label className={styles.field}><Text size={200}>Reason shared with {selected.person}</Text><textarea aria-label="Decline reason" className={styles.input} rows={3} value={declineReason} onChange={(event) => setDeclineReason(event.currentTarget.value)} /></label>}<div className={styles.alert}><Warning20Regular /><Text size={200}>This final confirmation changes only the local mocked approval state.</Text></div><div className={styles.actions}><button type="button" className={styles.secondary} onClick={() => setStage('review')}><ArrowLeft20Regular /> Back to review</button><button type="button" className={approved ? styles.primary : styles.decline} onClick={confirmDecision}>{approved ? <CheckmarkCircle20Filled /> : <DismissCircle20Filled />} Confirm {approved ? 'approval' : 'decline'}</button></div></div>;
  }

  if (stage === 'review') {
    return <div className={styles.stack}><div className={styles.personHeader}><Avatar name={selected.person} image={{ src: selected.photoUrl }} size={48} /><span><Text size={500} block weight="semibold">{selected.person} · {selected.title}</Text><Text size={200} className={styles.muted}>{selected.summary}</Text></span></div><div className={styles.summary}>{selected.details.map((detail) => <div className={styles.summaryItem} key={detail.label}><Text size={100} block className={styles.label}>{detail.label}</Text><Text weight="semibold">{detail.value}</Text></div>)}</div><div className={styles.alert}><Warning20Regular /><Text size={200}>{selected.risk}</Text></div><div className={styles.actions}><button type="button" className={styles.secondary} onClick={() => setStage('queue')}><ArrowLeft20Regular /> Back to approvals</button><button type="button" className={styles.primary} onClick={() => chooseDecision('approved')}><CheckmarkCircle20Filled /> Approve</button><button type="button" className={styles.decline} onClick={() => chooseDecision('declined')}><DismissCircle20Filled /> Decline</button></div></div>;
  }

  return <div className={styles.stack}><div className={styles.queue}>{approvals.map((approval) => <div className={styles.queueItem} key={approval.id}><Avatar name={approval.person} image={{ src: approval.photoUrl }} size={40} /><span><Text block weight="semibold">{approval.person} · {approval.title}</Text><Text size={200}>{approval.due} · {approval.context}</Text></span>{decisions[approval.id] ? <Text size={100} className={styles.status}>{decisions[approval.id]}</Text> : <button type="button" className={styles.primary} onClick={() => review(approval.id)} aria-label={`Review ${approval.person} ${approval.title}`}>Review</button>}</div>)}</div><div className={styles.alert}><Warning20Regular /><Text size={200}>Review the Tuesday overlap and request details before deciding. No approval is applied automatically.</Text></div></div>;
};

export default ApprovalDecisionWorkflow;