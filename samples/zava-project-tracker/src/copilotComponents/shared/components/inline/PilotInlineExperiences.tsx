import * as React from 'react';

import { Avatar } from '@fluentui/react-avatar';
import { Text } from '@fluentui/react-text';
import { makeStyles, mergeClasses } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import {
  ArrowLeft20Regular,
  CheckmarkCircle20Filled,
  DismissCircle20Filled,
  Send20Regular,
  Warning20Regular
} from '@fluentui/react-icons';
import { curveMonotoneX, line, stack } from 'd3-shape';

import { EMBEDDED_FACES } from '../../mockData/embeddedFaces';
import type { IProjectIntentProperties } from '../../models/projectPortfolio';

const useStyles = makeStyles({
  stack: { display: 'flex', flexDirection: 'column', gap: '12px' },
  toolbar: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  field: { display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 },
  label: { color: tokens.colorNeutralForeground3, fontSize: tokens.fontSizeBase200 },
  input: {
    minWidth: 0,
    minHeight: '34px',
    padding: '6px 8px',
    color: tokens.colorNeutralForeground1,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium
  },
  grow: { flexGrow: 1 },
  segment: { display: 'inline-flex', border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, overflow: 'hidden' },
  segmentButton: { minHeight: '32px', padding: '5px 9px', border: 'none', color: tokens.colorNeutralForeground2, backgroundColor: tokens.colorNeutralBackground1, cursor: 'pointer' },
  segmentActive: { color: tokens.colorNeutralForegroundOnBrand, backgroundColor: tokens.colorBrandBackground },
  primary: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', minHeight: '34px', padding: '7px 11px', border: 'none', borderRadius: tokens.borderRadiusMedium, color: tokens.colorNeutralForegroundOnBrand, backgroundColor: tokens.colorBrandBackground, fontWeight: tokens.fontWeightSemibold, cursor: 'pointer' },
  secondary: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', minHeight: '34px', padding: '7px 11px', border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, color: tokens.colorNeutralForeground2, backgroundColor: tokens.colorNeutralBackground1, fontWeight: tokens.fontWeightSemibold, cursor: 'pointer' },
  danger: { color: tokens.colorNeutralForegroundOnBrand, backgroundColor: tokens.colorPaletteRedBackground3 },
  actions: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  chartGrid: { display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(145px, .5fr)', gap: '14px', alignItems: 'stretch' },
  compactGrid: { gridTemplateColumns: 'minmax(0, 1fr)' },
  chart: { width: '100%', height: '172px', backgroundColor: tokens.colorNeutralBackground2, borderRadius: tokens.borderRadiusMedium },
  sideStats: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '8px' },
  stat: { padding: '9px', borderLeft: `3px solid ${tokens.colorBrandStroke1}`, backgroundColor: tokens.colorNeutralBackground2 },
  statValue: { display: 'block', color: tokens.colorNeutralForeground1, fontSize: tokens.fontSizeBase500, fontWeight: tokens.fontWeightBold },
  muted: { color: tokens.colorNeutralForeground3 },
  legend: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', color: tokens.colorNeutralForeground3 },
  legendItem: { display: 'inline-flex', alignItems: 'center', gap: '5px' },
  swatch: { width: '9px', height: '9px', borderRadius: tokens.borderRadiusCircular, backgroundColor: tokens.colorBrandBackground },
  forecastSwatch: { backgroundColor: tokens.colorPaletteMarigoldBackground3 },
  requestHeader: { display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr) auto', gap: '10px', alignItems: 'center', padding: '10px', backgroundColor: tokens.colorNeutralBackground2, borderRadius: tokens.borderRadiusMedium },
  detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' },
  detailSingle: { gridTemplateColumns: 'minmax(0, 1fr)' },
  detail: { padding: '9px', backgroundColor: tokens.colorNeutralBackground2, borderRadius: tokens.borderRadiusMedium },
  alert: { display: 'grid', gridTemplateColumns: '22px minmax(0, 1fr)', gap: '8px', padding: '10px', color: tokens.colorPaletteMarigoldForeground2, backgroundColor: tokens.colorPaletteMarigoldBackground2, borderRadius: tokens.borderRadiusMedium },
  success: { display: 'grid', gridTemplateColumns: '28px minmax(0, 1fr)', gap: '9px', padding: '12px', color: tokens.colorPaletteGreenForeground1, backgroundColor: tokens.colorPaletteGreenBackground2, border: `1px solid ${tokens.colorPaletteGreenBorderActive}`, borderRadius: tokens.borderRadiusMedium },
  form: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '9px' },
  formCompact: { gridTemplateColumns: 'minmax(0, 1fr)' },
  span: { gridColumn: '1 / -1' },
  impact: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '7px' },
  impactCompact: { gridTemplateColumns: 'minmax(0, 1fr)' },
  impactItem: { padding: '9px', textAlign: 'center', backgroundColor: tokens.colorNeutralBackground2, borderRadius: tokens.borderRadiusMedium },
  allocationTrack: { height: '11px', overflow: 'hidden', backgroundColor: tokens.colorNeutralBackground4, borderRadius: tokens.borderRadiusCircular },
  allocationFill: { height: '100%', backgroundColor: tokens.colorPaletteRedBackground3, borderRadius: tokens.borderRadiusCircular },
  allocationWarning: { backgroundColor: tokens.colorPaletteMarigoldBackground3 },
  allocationNear: { width: '98%' },
  allocationFull: { width: '100%' },
  receipt: { color: tokens.colorNeutralForeground3, fontSize: tokens.fontSizeBase200 }
});

export interface IPilotExperienceProps {
  properties: IProjectIntentProperties;
  compact: boolean;
  onComplete?: () => void;
}

export const AiSpendControlTower: React.FunctionComponent<IPilotExperienceProps> = ({ properties, compact }) => {
  const styles = useStyles();
  const [period, setPeriod] = React.useState(String(properties.period || 'month'));
  const [groupBy, setGroupBy] = React.useState(String(properties.groupBy || 'model'));
  const actual = [82, 96, 111, 128, 151, 178];
  const forecast = [96, 112, 132, 154, 180, period === 'quarter' ? 226 : 198];
  const actualPath = line<number>().x((_value, index) => 18 + index * 55).y((value) => 150 - value * 0.55).curve(curveMonotoneX)(actual) || '';
  const forecastPath = line<number>().x((_value, index) => 18 + index * 55).y((value) => 150 - value * 0.55).curve(curveMonotoneX)(forecast) || '';
  const stacks = stack<{ evaluation: number; pilot: number; production: number }>().keys(['evaluation', 'pilot', 'production'])([
    { evaluation: 34, pilot: 26, production: 40 }, { evaluation: 42, pilot: 20, production: 38 }, { evaluation: 51, pilot: 18, production: 31 }
  ]);

  return <div className={styles.stack} data-layout="ai-spend-control-tower">
    <div className={styles.toolbar}>
      <div className={styles.segment} aria-label="Spend period">
        {['month', 'quarter'].map((value) => <button type="button" key={value} className={mergeClasses(styles.segmentButton, period === value && styles.segmentActive)} onClick={() => setPeriod(value)}>{value === 'month' ? 'This month' : 'Quarter'}</button>)}
      </div>
      <label className={styles.field}><span className={styles.label}>Group by</span><select className={styles.input} value={groupBy} onChange={(event) => setGroupBy(event.currentTarget.value)}><option value="model">Model</option><option value="feature">Feature</option><option value="environment">Environment</option></select></label>
      <Text size={200} className={styles.muted}>{groupBy === 'model' ? 'GPT-5 drives evaluation growth' : `Grouped by ${groupBy}`}</Text>
    </div>
    <div className={mergeClasses(styles.chartGrid, compact && styles.compactGrid)}>
      <div>
        <svg className={styles.chart} viewBox="0 0 310 172" role="img" aria-label="Actual and forecast AI spend against the 220 thousand dollar budget guardrail">
          <title>AI spend actual and forecast</title><desc>Actual spend reaches 178 thousand dollars. Forecast reaches 198 thousand this month and remains below the 220 thousand budget.</desc>
          <line x1="18" y1="29" x2="296" y2="29" stroke={tokens.colorPaletteRedBorderActive} strokeDasharray="5 4" /><text x="292" y="22" textAnchor="end" fill={tokens.colorPaletteRedForeground1} fontSize="10">$220k guardrail</text>
          <path d={forecastPath} fill="none" stroke={tokens.colorPaletteMarigoldBorderActive} strokeWidth="3" strokeDasharray="5 4" />
          <path d={actualPath} fill="none" stroke={tokens.colorBrandStroke1} strokeWidth="4" />
          {actual.map((value, index) => <circle key={index} cx={18 + index * 55} cy={150 - value * .55} r="4" fill={tokens.colorNeutralBackground1} stroke={tokens.colorBrandStroke1} strokeWidth="2" />)}
          {stacks.map((series, seriesIndex) => series.map((point, index) => <rect key={`${seriesIndex}-${index}`} x={188 + index * 33} y={154 - point[1] * .45} width="24" height={(point[1] - point[0]) * .45} fill={seriesIndex === 0 ? tokens.colorPaletteBerryBackground3 : seriesIndex === 1 ? tokens.colorPaletteLightTealBackground2 : tokens.colorBrandBackground} opacity=".8" />))}
          <text x="18" y="166" fill={tokens.colorNeutralForeground3} fontSize="10">Mar</text><text x="292" y="166" textAnchor="end" fill={tokens.colorNeutralForeground3} fontSize="10">Aug</text>
        </svg>
        <div className={styles.legend}><span className={styles.legendItem}><i className={styles.swatch} />Actual</span><span className={styles.legendItem}><i className={mergeClasses(styles.swatch, styles.forecastSwatch)} />Forecast</span><span>{groupBy} mix shown in bars</span></div>
      </div>
      <div className={styles.sideStats}><div className={styles.stat}><span className={styles.statValue}>81%</span><Text size={200}>Budget consumed</Text></div><div className={styles.stat}><span className={styles.statValue}>$0.42</span><Text size={200}>Unit cost / -11%</Text></div><div className={styles.stat}><span className={styles.statValue}>{period === 'quarter' ? '04 Nov' : '18 Oct'}</span><Text size={200}>Forecast cap date</Text></div></div>
    </div>
  </div>;
};

type ReviewStage = 'review' | 'confirm' | 'receipt';

export const ResourceAssignmentReview: React.FunctionComponent<IPilotExperienceProps> = ({ properties, compact }) => {
  const styles = useStyles();
  const initial = typeof properties.allocationPercent === 'number' ? properties.allocationPercent : 40;
  const [allocation, setAllocation] = React.useState(initial);
  const [stage, setStage] = React.useState<ReviewStage>('review');
  const [decision, setDecision] = React.useState<'approved' | 'returned'>('approved');
  const [reason, setReason] = React.useState('Use a 20% review allocation to protect Contract Intelligence.');
  const resultingLoad = 78 + allocation;

  if (stage === 'receipt') {
    return <div className={styles.stack} data-layout="resource-assignment-receipt"><div className={styles.success} role="status"><CheckmarkCircle20Filled /><span><Text block weight="semibold">Assignment {decision === 'approved' ? 'approved' : 'returned'}</Text><Text size={200}>Decision APR-01 records {allocation}% for Pradeep Gupta in this session-only demo.</Text></span></div><Text className={styles.receipt}>No live project or resource system was updated.</Text><button type="button" className={styles.secondary} onClick={() => setStage('review')}><ArrowLeft20Regular /> Back to review</button></div>;
  }

  if (stage === 'confirm') {
    return <div className={styles.stack} data-layout="resource-assignment-confirm"><Text size={500} weight="semibold">Confirm {decision === 'approved' ? 'assignment' : 'return for changes'}</Text><div className={styles.requestHeader}><Avatar name="Pradeep Gupta" image={{ src: EMBEDDED_FACES['Pradeep-Gupta'] }} size={40} /><span><Text block weight="semibold">Pradeep Gupta / AI Platform Lead</Text><Text size={200}>Customer Service Copilot / {allocation}% / Sep-Oct</Text></span><Text weight="semibold">{resultingLoad}% load</Text></div>{decision === 'returned' && <label className={styles.field}><span className={styles.label}>Reason</span><textarea className={styles.input} rows={3} value={reason} onChange={(event) => setReason(event.currentTarget.value)} /></label>}<div className={styles.actions}><button type="button" className={styles.secondary} onClick={() => setStage('review')}><ArrowLeft20Regular /> Edit</button><button type="button" className={mergeClasses(styles.primary, decision === 'returned' && styles.danger)} onClick={() => setStage('receipt')}>{decision === 'approved' ? <CheckmarkCircle20Filled /> : <DismissCircle20Filled />} Confirm</button></div></div>;
  }

  return <div className={styles.stack} data-layout="resource-assignment-review">
    <div className={styles.requestHeader}><Avatar name="Pradeep Gupta" image={{ src: EMBEDDED_FACES['Pradeep-Gupta'] }} size={40} /><span><Text block weight="semibold">Pradeep Gupta / AI Platform Lead</Text><Text size={200}>Requested by Megan Bowen for Customer Service Copilot</Text></span><Text size={200} weight="semibold">Due tomorrow</Text></div>
    <label className={styles.field}><span className={styles.label}>Proposed allocation: {allocation}% / Scenario - not applied</span><input aria-label="Proposed allocation" type="range" min="20" max="50" step="5" value={allocation} onChange={(event) => setAllocation(Number(event.currentTarget.value))} /></label>
    <div><div className={styles.toolbar}><Text size={200}>Approved load 78%</Text><Text size={200} weight="semibold">Proposed {resultingLoad}%</Text></div><div className={styles.allocationTrack}><div data-tone={resultingLoad > 100 ? 'danger' : 'warning'} className={mergeClasses(styles.allocationFill, resultingLoad <= 100 && styles.allocationWarning, resultingLoad < 100 ? styles.allocationNear : styles.allocationFull)} /></div></div>
    <div className={mergeClasses(styles.detailGrid, compact && styles.detailSingle)}><div className={styles.detail}><Text size={100} className={styles.label} block>Skill fit</Text><Text weight="semibold">96% / AI platform review</Text></div><div className={styles.detail}><Text size={100} className={styles.label} block>Schedule impact</Text><Text weight="semibold">2 milestones at risk</Text></div><div className={styles.detail}><Text size={100} className={styles.label} block>Incremental cost</Text><Text weight="semibold">$18.4k</Text></div><div className={styles.detail}><Text size={100} className={styles.label} block>Conflict</Text><Text weight="semibold">Contract Intelligence review</Text></div></div>
    {resultingLoad > 100 && <div className={styles.alert}><Warning20Regular /><Text size={200}>This assignment overloads Pradeep. A 20% allocation avoids the milestone conflict.</Text></div>}
    <div className={styles.actions}><button type="button" className={styles.primary} onClick={() => { setDecision('approved'); setStage('confirm'); }}><CheckmarkCircle20Filled /> Approve {allocation}%</button><button type="button" className={mergeClasses(styles.secondary, styles.danger)} onClick={() => { setDecision('returned'); setStage('confirm'); }}><DismissCircle20Filled /> Return</button></div>
  </div>;
};

type FormStage = 'edit' | 'review' | 'receipt';

export const AiBudgetRequestForm: React.FunctionComponent<IPilotExperienceProps> = ({ properties, compact, onComplete }) => {
  const styles = useStyles();
  const initialAmount = typeof properties.amount === 'number' ? properties.amount : 75000;
  const initialNeededBy = String(properties.neededBy || '2026-10-01');
  const initialEnvironment = String(properties.environment || 'production');
  const initialModel = String(properties.model || 'GPT-5');
  const initialJustification = String(properties.justification || 'Protect production launch while evaluation demand remains elevated.');
  const initialAlternative = 'Shift evaluation traffic to GPT-5 mini';
  const [stage, setStage] = React.useState<FormStage>('edit');
  const [amount, setAmount] = React.useState(initialAmount);
  const [neededBy, setNeededBy] = React.useState(initialNeededBy);
  const [environment, setEnvironment] = React.useState(initialEnvironment);
  const [model, setModel] = React.useState(initialModel);
  const [justification, setJustification] = React.useState(initialJustification);
  const [alternative, setAlternative] = React.useState(initialAlternative);
  const proposedCap = 220000 + amount;
  const valid = amount > 0 && neededBy.length > 0 && justification.trim().length >= 12 && alternative.trim().length >= 5;
  const resetDraft = ():void => { setAmount(initialAmount); setNeededBy(initialNeededBy); setEnvironment(initialEnvironment); setModel(initialModel); setJustification(initialJustification); setAlternative(initialAlternative); setStage('edit'); };

  if (stage === 'receipt') {
    return <div className={styles.stack} data-layout="ai-budget-request-receipt"><div className={styles.success} role="status"><CheckmarkCircle20Filled /><span><Text block weight="semibold">AI budget request created</Text><Text size={200}>Request ABR-2601-04 for ${amount.toLocaleString()} is pending Finance and portfolio sponsor review.</Text></span></div><Text className={styles.receipt}>Showcase only: the request is stored in this browser session.</Text><button type="button" className={styles.secondary} onClick={resetDraft}>Edit another request</button></div>;
  }

  if (stage === 'review') {
    return <div className={styles.stack} data-layout="ai-budget-request-review"><Text size={500} weight="semibold">Review AI budget request</Text><div className={mergeClasses(styles.detailGrid, compact && styles.detailSingle)}><div className={styles.detail}><Text size={100} className={styles.label} block>Requested</Text><Text weight="semibold">${amount.toLocaleString()}</Text></div><div className={styles.detail}><Text size={100} className={styles.label} block>Proposed cap</Text><Text weight="semibold">${proposedCap.toLocaleString()}</Text></div><div className={styles.detail}><Text size={100} className={styles.label} block>Needed by</Text><Text weight="semibold">{neededBy}</Text></div><div className={styles.detail}><Text size={100} className={styles.label} block>Environment</Text><Text weight="semibold">{environment}</Text></div><div className={styles.detail}><Text size={100} className={styles.label} block>Model</Text><Text weight="semibold">{model}</Text></div></div><div className={styles.alert}><Warning20Regular /><Text size={200}>Approval protects $620k forecast benefit. Finance and portfolio sponsor approval are required.</Text></div><Text size={200}>{justification}</Text><div className={styles.actions}><button type="button" className={styles.secondary} onClick={() => setStage('edit')}><ArrowLeft20Regular /> Edit</button><button type="button" className={styles.primary} onClick={() => { if (onComplete) { onComplete(); } else { setStage('receipt'); } }}><Send20Regular /> Submit request</button></div></div>;
  }

  return <div className={styles.stack} data-layout="ai-budget-request-form"><div className={mergeClasses(styles.impact, compact && styles.impactCompact)}><div className={styles.impactItem}><Text size={100} className={styles.label} block>Current cap</Text><Text weight="semibold">$220k</Text></div><div className={styles.impactItem}><Text size={100} className={styles.label} block>Consumed</Text><Text weight="semibold">81%</Text></div><div className={styles.impactItem}><Text size={100} className={styles.label} block>Forecast</Text><Text weight="semibold">$288k</Text></div></div><div className={mergeClasses(styles.form, compact && styles.formCompact)}><label className={styles.field}><span className={styles.label}>Requested amount (USD)</span><input className={styles.input} type="number" min="1" value={amount} onChange={(event) => setAmount(Number(event.currentTarget.value))} /></label><label className={styles.field}><span className={styles.label}>Needed by</span><input className={styles.input} type="date" value={neededBy} onChange={(event) => setNeededBy(event.currentTarget.value)} /></label><label className={styles.field}><span className={styles.label}>Environment</span><select className={styles.input} value={environment} onChange={(event) => setEnvironment(event.currentTarget.value)}><option value="production">Production</option><option value="pilot">Pilot</option><option value="evaluation">Evaluation</option></select></label><label className={styles.field}><span className={styles.label}>Model</span><select aria-label="AI budget model" className={styles.input} value={model} onChange={(event)=>setModel(event.currentTarget.value)}><option>GPT-5</option><option>GPT-5 mini</option></select></label><label className={mergeClasses(styles.field, styles.span)}><span className={styles.label}>Justification</span><textarea className={styles.input} rows={2} value={justification} onChange={(event) => setJustification(event.currentTarget.value)} /></label><label className={mergeClasses(styles.field, styles.span)}><span className={styles.label}>Alternative considered</span><input className={styles.input} value={alternative} onChange={(event) => setAlternative(event.currentTarget.value)} /></label></div>{!valid&&<Text role="alert" className={styles.muted}>Enter a positive amount, needed-by date, meaningful justification, and alternative.</Text>}<Text size={200}>Proposed cap: ${proposedCap.toLocaleString()} / approval route: Finance + portfolio sponsor</Text><button type="button" className={styles.primary} disabled={!valid} onClick={() => setStage('review')}>Review request</button></div>;
};