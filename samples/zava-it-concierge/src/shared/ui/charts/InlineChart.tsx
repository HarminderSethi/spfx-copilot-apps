import * as React from 'react';

import type { IBabylonChartModel } from '../babylon/chartModels';

import styles from './InlineChart.module.scss';

const LazyD3InlineChart = React.lazy(async () => {
  const module = await import(/* webpackChunkName: 'zava-inline-charts' */ './D3InlineChart');
  return { default: module.D3InlineChart };
});

export interface IInlineChartProps {
  readonly isDark: boolean;
  readonly model: IBabylonChartModel;
  readonly selectedId?: string;
  readonly onSelect: (markId: string) => void;
}

export function InlineChart(props: IInlineChartProps): React.ReactElement {
  return (
    <React.Suspense fallback={<div className={`${styles.loading} ${props.isDark ? styles.dark : ''}`} role="status"><span /><strong>Preparing visualization...</strong></div>}>
      <LazyD3InlineChart {...props} />
    </React.Suspense>
  );
}