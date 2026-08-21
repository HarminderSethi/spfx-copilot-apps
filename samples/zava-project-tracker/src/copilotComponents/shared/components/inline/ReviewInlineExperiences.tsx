import * as React from 'react';

import { Avatar } from '@fluentui/react-avatar';
import { Text } from '@fluentui/react-text';
import { makeStyles, mergeClasses } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import { ArrowLeft20Regular, CheckmarkCircle20Filled, DismissCircle20Filled, Warning20Regular } from '@fluentui/react-icons';

import { EMBEDDED_FACES } from '../../mockData/embeddedFaces';
import { REVIEW_QUEUE_BY_INTENT, type IReviewItem } from '../../mockData/reviewDecisionCatalog';
import type { IIntentDefinition, IProjectIntentProperties } from '../../models/projectPortfolio';
import type { IIntentTransientState } from '../../models/intentInvocation';
import { getSessionActionReceipts, recordSessionAction, subscribeToSessionActions } from '../../services/SessionActionStore';

type Stage = 'queue' | 'review' | 'confirm' | 'receipt';
export type ReviewDecision = 'approved' | 'returned' | 'rejected';

const useStyles = makeStyles({
  stack: { display: 'flex', flexDirection: 'column', gap: '12px' },
  toolbar: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  select: { minHeight: '32px', padding: '5px 8px', color: tokens.colorNeutralForeground1, backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium },
  queue: { display: 'flex', flexDirection: 'column', borderTop: `1px solid ${tokens.colorNeutralStroke2}` },
  queueItem: { display: 'grid', gridTemplateColumns: '40px minmax(0, 1fr) auto', gap: '9px', alignItems: 'center', padding: '9px 4px', borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
  queueItemCompact: { gridTemplateColumns: '36px minmax(0, 1fr)' },
  queueActionCompact: { gridColumn: '2' },
  primary: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', minHeight: '34px', padding: '7px 11px', border: 'none', borderRadius: tokens.borderRadiusMedium, color: tokens.colorNeutralForegroundOnBrand, backgroundColor: tokens.colorBrandBackground, fontWeight: tokens.fontWeightSemibold, cursor: 'pointer' },
  secondary: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', minHeight: '34px', padding: '7px 11px', border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, color: tokens.colorNeutralForeground2, backgroundColor: tokens.colorNeutralBackground1, fontWeight: tokens.fontWeightSemibold, cursor: 'pointer' },
  danger: { color: tokens.colorNeutralForegroundOnBrand, backgroundColor: tokens.colorPaletteRedBackground3 },
  actions: { display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' },
  header: { display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr) auto', gap: '10px', alignItems: 'center', padding: '10px', backgroundColor: tokens.colorNeutralBackground2, borderRadius: tokens.borderRadiusMedium },
  muted: { color: tokens.colorNeutralForeground3 },
  badge: { padding: '2px 6px', borderRadius: tokens.borderRadiusCircular, color: tokens.colorPaletteMarigoldForeground2, backgroundColor: tokens.colorPaletteMarigoldBackground2, fontSize: tokens.fontSizeBase100 },
  badgeApproved: { color: tokens.colorPaletteGreenForeground1, backgroundColor: tokens.colorPaletteGreenBackground2 },
  badgeDeclined: { color: tokens.colorPaletteRedForeground1, backgroundColor: tokens.colorPaletteRedBackground2 },
  detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px' },
  compact: { gridTemplateColumns: 'minmax(0, 1fr)' },
  detail: { padding: '9px', backgroundColor: tokens.colorNeutralBackground2, borderRadius: tokens.borderRadiusMedium },
  label: { color: tokens.colorNeutralForeground3 },
  alert: { display: 'grid', gridTemplateColumns: '22px minmax(0, 1fr)', gap: '8px', padding: '10px', color: tokens.colorPaletteMarigoldForeground2, backgroundColor: tokens.colorPaletteMarigoldBackground2, borderRadius: tokens.borderRadiusMedium },
  field: { display: 'flex', flexDirection: 'column', gap: '4px' },
  input: { minWidth: 0, minHeight: '34px', padding: '7px 8px', color: tokens.colorNeutralForeground1, backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium },
  success: { display: 'grid', gridTemplateColumns: '28px minmax(0, 1fr)', gap: '9px', padding: '12px', color: tokens.colorPaletteGreenForeground1, backgroundColor: tokens.colorPaletteGreenBackground2, border: `1px solid ${tokens.colorPaletteGreenBorderActive}`, borderRadius: tokens.borderRadiusMedium },
  decisionResult: { display: 'grid', gridTemplateColumns: '28px minmax(0, 1fr)', gap: '9px', padding: '12px', borderRadius: tokens.borderRadiusMedium },
  decisionApproved: { color: tokens.colorPaletteGreenForeground1, backgroundColor: tokens.colorPaletteGreenBackground2, border: `1px solid ${tokens.colorPaletteGreenBorderActive}` },
  decisionDeclined: { color: tokens.colorPaletteRedForeground1, backgroundColor: tokens.colorPaletteRedBackground2, border: `1px solid ${tokens.colorPaletteRedBorderActive}` },
  scoreGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, minmax(42px, 1fr))', gap: '6px' },
  score: { padding: '9px 4px', textAlign: 'center', backgroundColor: tokens.colorNeutralBackground2, borderRadius: tokens.borderRadiusMedium },
  bridge: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '6px', alignItems: 'end' },
  bridgeItem: { minHeight: '78px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '8px', backgroundColor: tokens.colorNeutralBackground2, borderRadius: tokens.borderRadiusMedium },
  bridgeRequest: { color: tokens.colorNeutralForegroundOnBrand, backgroundColor: tokens.colorPaletteMarigoldBackground3 },
  checklist: { display: 'flex', flexDirection: 'column' },
  checkRow: { display: 'grid', gridTemplateColumns: '24px minmax(0, 1fr) auto', gap: '8px', alignItems: 'center', padding: '8px 3px', borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
  blocked: { color: tokens.colorPaletteRedForeground1 },
  receipt: { color: tokens.colorNeutralForeground3, fontSize: tokens.fontSizeBase200 },
  allocationTrack: { height: '10px', overflow: 'hidden', backgroundColor: tokens.colorNeutralBackground4, borderRadius: tokens.borderRadiusCircular },
  allocationFill: { height: '100%', backgroundColor: tokens.colorPaletteRedBackground3, borderRadius: tokens.borderRadiusCircular },
  allocationWarning: { backgroundColor: tokens.colorPaletteMarigoldBackground3 },
  allocationNear: { width: '98%' },
  allocationFull: { width: '100%' }
});

const decisionBadgeClass = (styles: ReturnType<typeof useStyles>, decision: ReviewDecision): string => decision === 'approved' ? styles.badgeApproved : styles.badgeDeclined;

const getRecordedDecisions = (intentKey: string): Record<string, ReviewDecision> =>
  getSessionActionReceipts().filter((receipt) => receipt.kind === 'decision' && receipt.intentKey === intentKey)
    .reduce<Record<string, ReviewDecision>>((result, receipt) => {
      if (receipt.status === 'approved' || receipt.status === 'returned' || receipt.status === 'rejected') result[receipt.recordId] = receipt.status;
      return result;
    }, {});

const EvidenceBody: React.FunctionComponent<{ item: IReviewItem; compact: boolean; allocation: number; setAllocation: (value: number) => void }> = ({ item, compact, allocation, setAllocation }) => {
  const styles = useStyles();
  if (item.kind === 'project') {
    return <><div className={mergeClasses(styles.scoreGrid, compact && styles.compact)}>{[['Fit','86'],['Value','$1.8m'],['Feasible','74'],['Risk','Medium'],['Evidence',`${item.evidence}%`]].map((score) => <div className={styles.score} key={score[0]}><Text size={100} className={styles.label} block>{score[0]}</Text><Text weight="semibold">{score[1]}</Text></div>)}</div><div className={styles.alert}><Warning20Regular/><Text size={200}>{item.evidence < 80 ? 'Benefit baseline and duplicate-platform evidence need revision.' : 'Evidence is complete enough for an intake decision.'}</Text></div></>;
  }
  if (item.kind === 'budget') {
    const amount = item.amount || 0;
    return <><div className={mergeClasses(styles.bridge, compact && styles.compact)}><div className={styles.bridgeItem}><Text size={100}>Current EAC</Text><Text weight="semibold">$897k</Text></div><div className={mergeClasses(styles.bridgeItem, styles.bridgeRequest)}><Text size={100}>Request</Text><Text weight="semibold">+${amount.toLocaleString()}</Text></div><div className={styles.bridgeItem}><Text size={100}>Savings</Text><Text weight="semibold">-$7k</Text></div><div className={styles.bridgeItem}><Text size={100}>Evidence</Text><Text weight="semibold">{item.evidence}%</Text></div></div><div className={mergeClasses(styles.detailGrid, compact && styles.compact)}><div className={styles.detail}><Text size={100} className={styles.label} block>Benefit protected</Text><Text weight="semibold">$620k</Text></div><div className={styles.detail}><Text size={100} className={styles.label} block>Alternative</Text><Text weight="semibold">Lower-cost model mix</Text></div><div className={styles.detail}><Text size={100} className={styles.label} block>Finance</Text><Text weight="semibold">Within contingency</Text></div></div></>;
  }
  if (item.kind === 'resource') {
    const resultingLoad = 78 + allocation;
    return <><label className={styles.field}><Text size={200}>Proposed allocation: {allocation}% / Scenario - not applied</Text><input aria-label="Proposed allocation" type="range" min="20" max="50" step="5" value={allocation} onChange={(event) => setAllocation(Number(event.currentTarget.value))}/></label><div className={styles.toolbar}><Text size={200}>Approved load 78%</Text><Text size={200} weight="semibold">Proposed {resultingLoad}%</Text></div><div className={styles.allocationTrack}><div data-tone={resultingLoad > 100 ? 'danger' : 'warning'} className={mergeClasses(styles.allocationFill, resultingLoad <= 100 && styles.allocationWarning, resultingLoad < 100 ? styles.allocationNear : styles.allocationFull)}/></div><div className={mergeClasses(styles.detailGrid, compact && styles.compact)}><div className={styles.detail}><Text size={100} className={styles.label} block>Skill fit</Text><Text weight="semibold">96%</Text></div><div className={styles.detail}><Text size={100} className={styles.label} block>Schedule impact</Text><Text weight="semibold">2 milestones</Text></div><div className={styles.detail}><Text size={100} className={styles.label} block>Evidence</Text><Text weight="semibold">{item.evidence}%</Text></div></div>{resultingLoad > 100 && <div className={styles.alert}><Warning20Regular/><Text size={200}>This allocation overloads the assignee. Review a lower scenario before approval.</Text></div>}</>;
  }
  const criteria = [['Security evidence',true],['Evaluation threshold',true],['Responsible AI evidence',!item.blocked],['Budget tolerance',true]];
  return <><div className={styles.checklist}>{criteria.map((criterion) => <div className={styles.checkRow} key={String(criterion[0])}>{criterion[1] ? <CheckmarkCircle20Filled color={tokens.colorPaletteGreenForeground1}/> : <DismissCircle20Filled className={styles.blocked}/>}<Text>{criterion[0]}</Text><Text size={100} className={criterion[1] ? styles.muted : styles.blocked}>{criterion[1] ? 'Complete' : 'Blocking'}</Text></div>)}</div>{item.blocked && <div className={styles.alert}><Warning20Regular/><Text size={200}>Approve stays blocked until the remaining evidence is complete.</Text></div>}</>;
};

interface IReviewQueueProps {
  intentKey: string;
  properties: IProjectIntentProperties;
  compact: boolean;
  fullscreen: boolean;
  embedded?: boolean;
  onDecisionComplete?: (decision: ReviewDecision) => void;
  transientState?: IIntentTransientState;
  onTransientStateChange?: (state: IIntentTransientState) => void;
}

const ReviewQueue: React.FunctionComponent<IReviewQueueProps> = ({ intentKey, properties, compact, fullscreen, embedded, onDecisionComplete, transientState, onTransientStateChange }) => {
  const styles = useStyles();
  const items = REVIEW_QUEUE_BY_INTENT[intentKey];
  const requestedApprovalId = String(properties.approvalId || '');
  const initialSelection = fullscreen && intentKey !== 'GetApprovalInbox'
    ? items.find((item) => item.id === requestedApprovalId)?.id || items[0]?.id
    : undefined;
  const [selectedId, setSelectedId] = React.useState<string | undefined>(transientState?.review?.selectedId || initialSelection);
  const [statusFilter, setStatusFilter] = React.useState(transientState?.review?.statusFilter || 'all');
  const [decisions, setDecisions] = React.useState<Record<string, ReviewDecision>>(() => getRecordedDecisions(intentKey));
  const selected = items.find((item) => item.id === selectedId);
  const visibleItems = items.filter((item) => statusFilter === 'all' || (statusFilter === 'pending' ? !decisions[item.id] : Boolean(decisions[item.id])));

  React.useEffect(() => subscribeToSessionActions(() => setDecisions(getRecordedDecisions(intentKey))), [intentKey]);

  if (selected) {
    return <ConfiguredReview item={selected} properties={properties} compact={compact} embedded={embedded} onBack={() => setSelectedId(undefined)} onDecision={(decision) => { recordSessionAction({ intentKey, recordId: selected.id, kind: 'decision', status: decision, summary: `${selected.title}: ${decision}` }); setDecisions((current) => ({ ...current, [selected.id]: decision })); onDecisionComplete?.(decision); }}/>
  }

  return <div className={styles.stack} data-layout={`${intentKey}-queue`}><div className={styles.toolbar}><select aria-label="Review status" className={styles.select} value={statusFilter} onChange={(event)=>{const nextFilter=event.currentTarget.value;setStatusFilter(nextFilter);onTransientStateChange?.({...transientState,review:{selectedId,statusFilter:nextFilter}});}}><option value="all">All items</option><option value="pending">Pending</option><option value="processed">Processed</option></select><span className={styles.badge}>{items.filter((item) => !decisions[item.id]).length} pending</span></div><div className={styles.queue}>{visibleItems.map((item)=><div className={mergeClasses(styles.queueItem, compact && styles.queueItemCompact)} key={item.id}><Avatar name={item.person} image={{src:EMBEDDED_FACES[item.imageKey]}} size={40}/><span><Text block weight="semibold">{item.title}</Text><Text size={200}>{item.person} / {item.context}</Text><Text size={100} className={styles.muted}>{item.due} / evidence {item.evidence}%</Text></span>{decisions[item.id] ? <span data-decision={decisions[item.id]} data-tone={decisions[item.id]==='approved'?'success':'danger'} className={mergeClasses(styles.badge,decisionBadgeClass(styles,decisions[item.id]))}>{decisions[item.id]}</span> : <button className={mergeClasses(styles.primary, compact && styles.queueActionCompact)} onClick={()=>{setSelectedId(item.id);onTransientStateChange?.({...transientState,review:{selectedId:item.id,statusFilter}});}}>Review</button>}</div>)}</div></div>;
};

interface IConfiguredReviewProps {
  item: IReviewItem;
  properties: IProjectIntentProperties;
  compact: boolean;
  embedded?: boolean;
  onBack: () => void;
  onDecision: (decision: ReviewDecision) => void;
}

function ConfiguredReview({ item, properties, compact, embedded, onBack, onDecision }: IConfiguredReviewProps): React.ReactElement {
  const styles = useStyles();
  const [stage, setStage] = React.useState<Stage>('review');
  const promptDecision = String(properties.decision || 'approved');
  const [decision, setDecision] = React.useState<ReviewDecision>(promptDecision === 'returned' || promptDecision === 'rejected' ? promptDecision : 'approved');
  const [reason, setReason] = React.useState('');
  const requestedAllocation = Number(properties.allocationPercent);
  const [allocation, setAllocation] = React.useState(Number.isFinite(requestedAllocation) ? Math.max(20, Math.min(50, requestedAllocation)) : item.allocation || 25);
  const approvalBlocked = Boolean(item.blocked) || (item.kind === 'resource' && 78 + allocation > 100);
  const rationaleRequired = decision !== 'approved';
  const rationaleValid = !rationaleRequired || reason.trim().length >= 3;

  if (stage === 'receipt') return <div className={styles.stack} data-layout={`${item.intentKey}-receipt`}><div data-decision={decision} data-tone={decision==='approved'?'success':'danger'} className={mergeClasses(styles.decisionResult,decision==='approved'?styles.decisionApproved:styles.decisionDeclined)} role="status">{decision==='approved'?<CheckmarkCircle20Filled/>:<DismissCircle20Filled/>}<span><Text block weight="semibold">Decision recorded: {decision}</Text><Text size={200}>{item.receiptId} / {item.person} notified in this session-only workflow.</Text></span></div><Text className={styles.receipt}>No live project tracking system was updated.</Text>{!embedded && <button className={styles.secondary} onClick={onBack}><ArrowLeft20Regular/> Back to queue</button>}</div>;
  if (stage === 'confirm') return <div className={styles.stack} data-layout={`${item.intentKey}-confirm`}><Text size={500} weight="semibold">Confirm {decision}</Text><div className={styles.header}><Avatar name={item.person} image={{src:EMBEDDED_FACES[item.imageKey]}} size={40}/><span><Text block weight="semibold">{item.title}</Text><Text size={200}>{item.consequence}</Text></span><span data-decision={decision} data-tone={decision==='approved'?'success':'danger'} className={mergeClasses(styles.badge,decisionBadgeClass(styles,decision))}>{decision}</span></div>{rationaleRequired&&<label className={styles.field}><Text size={200}>Rationale (required)</Text><textarea aria-label="Decision rationale" aria-describedby="decision-rationale-help" className={styles.input} rows={3} value={reason} onChange={(event)=>setReason(event.currentTarget.value)}/><Text id="decision-rationale-help" size={100} className={rationaleValid?styles.muted:styles.blocked}>{rationaleValid?'Rationale ready.':'Enter at least 3 characters to confirm this decision.'}</Text></label>}<div className={styles.actions}><button className={styles.secondary} onClick={()=>setStage('review')}><ArrowLeft20Regular/> Back</button><button className={mergeClasses(styles.primary,rationaleRequired&&styles.danger)} disabled={!rationaleValid} onClick={()=>{onDecision(decision);setStage('receipt');}}>Confirm decision</button></div></div>;
  return <div className={styles.stack} data-layout={`${item.intentKey}-review`}><div className={styles.header}><Avatar name={item.person} image={{src:EMBEDDED_FACES[item.imageKey]}} size={40}/><span><Text block weight="semibold">{item.title}</Text><Text size={200}>{item.person} / {item.context}</Text></span><span className={styles.badge}>Pending</span></div><EvidenceBody item={item} compact={compact} allocation={allocation} setAllocation={setAllocation}/><div className={styles.actions}>{!embedded && <button className={styles.secondary} onClick={onBack}><ArrowLeft20Regular/> Queue</button>}<button className={styles.primary} disabled={approvalBlocked} onClick={()=>{setDecision('approved');setStage('confirm');}}><CheckmarkCircle20Filled/> Approve</button><button className={styles.secondary} onClick={()=>{setDecision('returned');setStage('confirm');}}>Return</button><button className={mergeClasses(styles.secondary,styles.danger)} onClick={()=>{setDecision('rejected');setStage('confirm');}}><DismissCircle20Filled/> Reject</button></div></div>;
}

export interface IReviewExperienceProps {
  definition: IIntentDefinition;
  properties: IProjectIntentProperties;
  compact: boolean;
  fullscreen?: boolean;
  embedded?: boolean;
  onDecisionComplete?: (decision: ReviewDecision) => void;
  transientState?: IIntentTransientState;
  onTransientStateChange?: (state: IIntentTransientState) => void;
}

const ReviewInlineExperiences: React.FunctionComponent<IReviewExperienceProps> = (props) => {
  return <ReviewQueue intentKey={props.definition.key} properties={props.properties} compact={props.compact} fullscreen={Boolean(props.fullscreen)} embedded={props.embedded} onDecisionComplete={props.onDecisionComplete} transientState={props.transientState} onTransientStateChange={props.onTransientStateChange}/>;
};

export default ReviewInlineExperiences;
