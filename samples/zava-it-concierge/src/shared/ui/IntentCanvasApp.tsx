import * as React from 'react';
import { Button } from '@fluentui/react-components';
import { ArrowExpand20Regular, ArrowMinimize20Regular, Eye20Regular, Pen20Regular } from '@fluentui/react-icons';

import type { IIntentDefinition } from '../intents/intentCatalog';
import { EstateRiskMap } from '../fullscreen/EstateRiskMap';
import { buildChartModel } from './babylon/chartModels';
import { InlineChart } from './charts/InlineChart';
import { EXPERIENCE_PRESENTATIONS } from './experiencePresentations';
import { InlineExperienceDetails } from './InlineExperienceDetails';
import { OperationPanel } from './OperationPanel';

import styles from './IntentCanvasApp.module.scss';

const LazyDashboardFullScreenExperience = React.lazy(async () => {
  const module = await import(/* webpackChunkName: 'zava-fullscreen-dashboard' */ '../fullscreen/DashboardFullScreenExperience');
  return { default: module.DashboardFullScreenExperience };
});

const INLINE_CHART_INTENTS = new Set([
  'MyDeviceStatus', 'GetDeviceHealth', 'GetTeamBudget', 'PreviewRequestCost',
  'GetFleetHealth', 'GetDeviceAgeDistribution', 'GetTeamTicketTrend',
  'GetTicketDeflectionTrend', 'GetTopItIssues', 'GetServiceHealth',
  'GetLicenseReclaim', 'GetItSpendBridge', 'PlanRefreshWaves', 'CorrelateMajorIncident'
]);

function operationDescription(operation: IIntentDefinition['operation']): string {
  if (operation === 'submit') return 'Submission workflow';
  if (operation === 'review') return 'Decision workflow';
  if (operation === 'education') return 'Guided exploration';
  return 'Read-only insight';
}

export interface IIntentCanvasAppProps {
  readonly intent: IIntentDefinition;
  readonly isDark: boolean;
  readonly isFullscreen: boolean;
  readonly ownerWindow: Window | undefined;
  readonly properties: Readonly<Record<string, unknown>>;
  readonly userName: string;
  readonly onDisplayModeChange: (mode: 'inline' | 'fullscreen') => void;
}

export function IntentCanvasApp(props: IIntentCanvasAppProps): React.ReactElement {
  const chartModel = React.useMemo(() => buildChartModel(props.intent), [props.intent]);
  const presentation = EXPERIENCE_PRESENTATIONS[props.intent.name as keyof typeof EXPERIENCE_PRESENTATIONS];
  const [selectedId, setSelectedId] = React.useState(chartModel.marks[0]?.id);
  const selectedMark = chartModel.marks.find((mark) => mark.id === selectedId) ?? chartModel.marks[0];
  const isTransactional = props.intent.operation === 'submit' || props.intent.operation === 'review';
  const isEstateMap = props.intent.name === 'GetFleetHealth';
  const hasInlineChart = INLINE_CHART_INTENTS.has(props.intent.name);
  const showDetailsInEvidence = (isTransactional && props.intent.name !== 'GetApprovalQueue') || hasInlineChart;

  if (props.isFullscreen) {
    return (
      <React.Suspense fallback={<div className={styles.canvasFallback} role="status">Preparing full-screen workspace...</div>}>
        <LazyDashboardFullScreenExperience intent={props.intent} isDark={props.isDark} ownerWindow={props.ownerWindow} properties={props.properties} userName={props.userName} onExit={() => props.onDisplayModeChange('inline')} />
      </React.Suspense>
    );
  }

  return (
    <main className={`${styles.app} ${props.isDark ? styles.dark : ''}`} data-profile={presentation.profile} aria-labelledby="zava-intent-heading">
      <header className={styles.header}>
        <div className={styles.headerIdentity}>
          <div className={styles.brand}><span className={styles.brandMark} aria-hidden="true" /> Zava IT Concierge</div>
          <h2 className={styles.title} id="zava-intent-heading">{props.intent.title}</h2>
        </div>
        <Button
          aria-label={props.isFullscreen ? 'Back to conversation' : 'View in full screen'}
          appearance="subtle"
          className={styles.fullscreenButton}
          icon={props.isFullscreen ? <ArrowMinimize20Regular /> : <ArrowExpand20Regular />}
          onClick={() => props.onDisplayModeChange(props.isFullscreen ? 'inline' : 'fullscreen')}
          size="small"
          title={props.isFullscreen ? 'Back to conversation' : 'View in full screen'}
        >
          <span className={styles.fullscreenLabel}>{props.isFullscreen ? 'Back' : 'Full screen'}</span>
        </Button>
      </header>
      <section className={`${styles.body} ${isTransactional ? styles.transactionBody : ''} ${showDetailsInEvidence ? '' : styles.singleBody}`}>
        {isTransactional ? (
          <div className={styles.transactionMain}>
            <div className={styles.transactionIntro}>
              <span>{props.intent.operation === 'submit' ? 'Create and review' : 'Evidence-backed decision'}</span>
              <h3>{props.intent.title}</h3>
              <p>{props.intent.description}</p>
            </div>
            <OperationPanel intent={props.intent} isDark={props.isDark} ownerWindow={props.ownerWindow} properties={props.properties} />
          </div>
        ) : hasInlineChart ? (
          <div className={styles.visualStage}>
            <div className={styles.metric}>
              <span className={styles.metricValue}>{selectedId === chartModel.marks[0]?.id ? presentation.metricValue : `${selectedMark?.value ?? 0}${chartModel.kind === 'ring' || chartModel.kind === 'landscape' ? '%' : ''}`}</span>
              <span className={styles.metricLabel}>{selectedId === chartModel.marks[0]?.id ? presentation.metricLabel : selectedMark?.label ?? props.intent.visualIdentity.metricLabel}</span>
            </div>
            {isEstateMap
              ? <EstateRiskMap isDark={props.isDark} model={chartModel} selectedId={selectedId} onSelect={setSelectedId} />
              : <InlineChart isDark={props.isDark} model={chartModel} selectedId={selectedId} onSelect={setSelectedId} />}
          </div>
        ) : (
          <div className={styles.purposeStage}>
            <div className={styles.purposeMetric}><span>{presentation.metricLabel}</span><strong>{presentation.metricValue}</strong><p>{presentation.insight}</p></div>
            <InlineExperienceDetails presentation={presentation} ownerWindow={props.ownerWindow} />
          </div>
        )}
        {showDetailsInEvidence && (
          <aside className={styles.evidence} aria-label="Supporting evidence">
            <InlineExperienceDetails presentation={presentation} ownerWindow={props.ownerWindow} />
            <div className={styles.operationMode} aria-label={`Experience type: ${operationDescription(props.intent.operation)}`}>
              {isTransactional ? <Pen20Regular aria-hidden="true" /> : <Eye20Regular aria-hidden="true" />}
              <span>{operationDescription(props.intent.operation)}</span>
            </div>
          </aside>
        )}
      </section>
      <footer className={styles.footer}>
        <span>Prepared for {props.userName}</span>
        <span>{props.intent.route}</span>
      </footer>
    </main>
  );
}