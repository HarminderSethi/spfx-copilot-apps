import * as React from 'react';

import { Avatar } from '@fluentui/react-avatar';
import { Text } from '@fluentui/react-text';
import { makeStyles, mergeClasses } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import { CheckmarkCircle20Filled, DocumentText20Regular, ShieldLock20Regular } from '@fluentui/react-icons';

import AnimatedDetailsPanel from '../shared/components/AnimatedDetailsPanel';
import InlineDetailHeader from '../shared/components/InlineDetailHeader';
import type { IZavaUser } from '../shared/models/zavaEmployee';
import type { INormalizedPolicyAnswerProperties } from './PolicyAnswerCopilotComponentProperties';
import type { INormalizedPolicyComparisonProperties } from '../policyComparison/PolicyComparisonCopilotComponentProperties';
import { MockPolicyDataService } from './PolicyDataService';

const service = new MockPolicyDataService();

const useStyles = makeStyles({
  inline: { width: '100%', minWidth: 0, boxSizing: 'border-box', padding: '12px', backgroundColor: tokens.colorNeutralBackground2 },
  card: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '14px', backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium, boxShadow: tokens.shadow4 },
  eyebrow: { color: tokens.colorPalettePurpleForeground2, fontWeight: tokens.fontWeightSemibold, textTransform: 'uppercase' },
  answer: { fontWeight: tokens.fontWeightSemibold, lineHeight: tokens.lineHeightBase400 },
  muted: { color: tokens.colorNeutralForeground3 },
  receipt: { display: 'grid', gridTemplateColumns: '24px minmax(0, 1fr)', gap: '8px', alignItems: 'start', padding: '9px', backgroundColor: tokens.colorPalettePurpleBackground2, borderRadius: tokens.borderRadiusMedium },
  meterTrack: { height: '8px', overflow: 'hidden', backgroundColor: tokens.colorNeutralBackground4, borderRadius: tokens.borderRadiusCircular },
  meterFill: { height: '100%', backgroundColor: tokens.colorPaletteGreenBackground3, borderRadius: tokens.borderRadiusCircular },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', minWidth: '420px', borderCollapse: 'collapse' },
  cell: { padding: '9px', textAlign: 'left', borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
  headerCell: { color: tokens.colorNeutralForeground2, backgroundColor: tokens.colorNeutralBackground3, fontWeight: tokens.fontWeightSemibold },
  emphasized: { color: tokens.colorPalettePurpleForeground2, backgroundColor: tokens.colorPalettePurpleBackground2, fontWeight: tokens.fontWeightSemibold },
  dashboardRoot: { display: 'flex', flexDirection: 'column', gap: '18px' },
  hero: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '18px', alignItems: 'center', padding: '20px', color: tokens.colorNeutralForegroundInverted, backgroundColor: tokens.colorPalettePurpleForeground2, borderRadius: tokens.borderRadiusMedium, '@media (max-width: 680px)': { gridTemplateColumns: '1fr' } },
  heroIdentity: { display: 'flex', alignItems: 'center', gap: '12px' },
  metrics: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(100px, 1fr))', gap: '8px', '@media (max-width: 760px)': { gridTemplateColumns: 'repeat(2, minmax(100px, 1fr))' }, '@media (max-width: 420px)': { gridTemplateColumns: '1fr' } },
  metric: { minWidth: 0, padding: '11px 12px', color: tokens.colorNeutralForeground1, backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium, boxShadow: tokens.shadow2 },
  dashboardGrid: { display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)', gap: '14px', '@media (max-width: 900px)': { gridTemplateColumns: '1fr' } },
  button: { alignSelf: 'flex-start', padding: '8px 12px', color: tokens.colorNeutralForegroundInverted, backgroundColor: tokens.colorPalettePurpleForeground2, border: 'none', borderRadius: tokens.borderRadiusMedium, cursor: 'pointer', fontWeight: tokens.fontWeightSemibold }
});

export type PolicyIntent =
  | { kind: 'answer'; properties: INormalizedPolicyAnswerProperties }
  | { kind: 'comparison'; properties: INormalizedPolicyComparisonProperties };

export interface IPolicyInlineProps {
  intent: PolicyIntent;
  onRequestFullscreen?: () => void;
}

const ComparisonTable: React.FunctionComponent<{ topic: string }> = ({ topic }) => {
  const styles = useStyles();
  const data = service.getPolicyExperience(undefined, topic);
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table} aria-label={`${topic} comparison`}>
        <thead><tr><th className={mergeClasses(styles.cell, styles.headerCell)}>Policy detail</th><th className={mergeClasses(styles.cell, styles.headerCell)}>Finland</th><th className={mergeClasses(styles.cell, styles.headerCell)}>Sweden</th></tr></thead>
        <tbody>{data.comparison.map((row) => (
          <tr key={row.label}>
            <th scope="row" className={styles.cell}>{row.label}</th>
            <td className={mergeClasses(styles.cell, row.emphasis === 'finland' && styles.emphasized)}>{row.finland}</td>
            <td className={mergeClasses(styles.cell, row.emphasis === 'sweden' && styles.emphasized)}>{row.sweden}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
};

export const PolicyInline: React.FunctionComponent<IPolicyInlineProps> = (props) => {
  const styles = useStyles();
  const data = props.intent.kind === 'answer'
    ? service.getPolicyExperience(props.intent.properties.question, undefined, props.intent.properties.effectiveOn)
    : service.getPolicyExperience(undefined, props.intent.properties.topic, props.intent.properties.effectiveOn);
  return (
    <section className={styles.inline} data-policy-intent={props.intent.kind}>
      <InlineDetailHeader title={props.intent.kind === 'answer' ? 'Policy answer' : 'Compare policies'} onRequestFullscreen={props.onRequestFullscreen} />
      <div className={styles.card}>
        <Text size={100} className={styles.eyebrow}>{props.intent.kind === 'answer' ? 'Answer with receipts' : 'Jurisdiction matrix'}</Text>
        {props.intent.kind === 'answer' ? (
          <>
            <Text size={400} block className={styles.answer}>{data.answer}</Text>
            <Text size={200} block className={styles.muted}>{data.applicability}</Text>
            <div><Text size={200}>Answer confidence {data.confidence}%</Text><div className={styles.meterTrack} aria-label={`Answer confidence ${data.confidence}%`}><div className={styles.meterFill} style={{ width: `${data.confidence}%` }} /></div></div>
            {props.intent.properties.includeSources && data.sources.map((source) => (
              <div className={styles.receipt} key={source.id}><DocumentText20Regular /><span><Text block weight="semibold">{source.title}</Text><Text size={200}>{source.section} · Effective {source.effectiveOn}</Text></span></div>
            ))}
          </>
        ) : <ComparisonTable topic={props.intent.properties.topic} />}
      </div>
    </section>
  );
};

export interface IPolicyDashboardProps {
  user: IZavaUser;
  viewRef?: React.RefObject<HTMLDivElement>;
}

export const PolicyDashboard: React.FunctionComponent<IPolicyDashboardProps> = ({ user, viewRef }) => {
  const styles = useStyles();
  const data = service.getPolicyExperience();
  const [reviewOpen, setReviewOpen] = React.useState(false);
  return (
    <div ref={viewRef} tabIndex={-1} className={styles.dashboardRoot} data-family-view="policy" data-family-implemented="true">
      <section className={styles.hero} aria-labelledby="policy-dashboard-heading">
        <div className={styles.heroIdentity}><Avatar name={user.displayName} image={{ src: user.photoUrl }} size={56} /><span><Text id="policy-dashboard-heading" as="h1" size={700} block>Policy answers you can trust</Text><Text block>Two policies apply to your question; one changed recently.</Text></span></div>
        <ShieldLock20Regular fontSize={32} aria-hidden="true" />
      </section>
      <div className={styles.metrics} aria-label="Policy metrics">
        <div className={styles.metric}><Text size={500} block weight="bold">{data.confidence}%</Text><Text size={200}>Answer confidence</Text></div>
        <div className={styles.metric}><Text size={500} block weight="bold">{data.sources.length}</Text><Text size={200}>Applicable sources</Text></div>
        <div className={styles.metric}><Text size={500} block weight="bold">1</Text><Text size={200}>Recent change</Text></div>
        <div className={styles.metric}><Text size={500} block weight="bold">Ready</Text><Text size={200}>Sensitive path</Text></div>
      </div>
      <div className={styles.dashboardGrid}>
        <section className={styles.card} data-family-route="policy/answer"><Text size={500} block weight="semibold">Answer receipt</Text><Text>{data.answer}</Text><Text size={200} className={styles.muted}>{data.applicability}</Text><button type="button" className={styles.button} onClick={() => setReviewOpen(true)}>Review this answer</button></section>
        <section className={styles.card} data-family-route="policy/compare"><Text size={500} block weight="semibold">Finland and Sweden</Text><ComparisonTable topic={data.topic} /></section>
        <section className={styles.card} data-family-route="policy/sources"><Text size={500} block weight="semibold">Answer sources</Text>{data.sources.map((source) => <div className={styles.receipt} key={source.id}><CheckmarkCircle20Filled /><span><Text block weight="semibold">{source.title}</Text><Text size={200}>{source.section} · Effective {source.effectiveOn}</Text></span></div>)}<Text size={200} className={styles.muted}>Every receipt is deterministic mock policy evidence for this offline showcase.</Text></section>
        <section className={styles.card} data-family-route="policy/changes"><Text size={500} block weight="semibold">What changed</Text><Text>{data.changedClause}</Text><div className={styles.receipt}><DocumentText20Regular /><span><Text block weight="semibold">Changed clause highlighted</Text><Text size={200}>Review the effective date before applying the updated entitlement.</Text></span></div></section>
        <section className={styles.card} data-family-route="policy/private-support"><Text size={500} block weight="semibold">Private support</Text><Text>Your question can be handed to HR without exposing sensitive context in the shared answer.</Text><div className={styles.receipt}><ShieldLock20Regular /><span><Text block weight="semibold">Private by design</Text><Text size={200}>Only the assigned HR team receives the details you explicitly review.</Text></span></div><button type="button" className={styles.button}>Start private handoff</button></section>
      </div>
      {reviewOpen && (
        <AnimatedDetailsPanel
          title="Your policy follow-ups"
          reviewingText="Reviewing the answer, applicability, and policy receipts..."
          headline="Five details explain how this policy answer applies to you."
          readyText="Your policy follow-ups are ready."
          items={[
            { id: 'applicability', eyebrow: 'Applicability', title: 'Confirm where the answer applies', summary: data.applicability },
            { id: 'answer', eyebrow: 'Key answer', title: 'Keep the answer in context', summary: data.answer },
            { id: 'sources', eyebrow: 'Receipts', title: 'Review the effective sources', summary: `${data.sources.length} effective policy sources support this answer.` },
            { id: 'changes', eyebrow: 'Recent change', title: 'Review the changed clause', summary: data.changedClause },
            { id: 'private', eyebrow: 'Private path', title: 'Use private support when needed', summary: 'Continue privately with HR without exposing sensitive context in the shared answer.' }
          ]}
          footnote="AI-style details are generated locally from deterministic sample policy data. No AI service is called, and changes are not saved."
          onDismiss={() => setReviewOpen(false)}
        />
      )}
    </div>
  );
};