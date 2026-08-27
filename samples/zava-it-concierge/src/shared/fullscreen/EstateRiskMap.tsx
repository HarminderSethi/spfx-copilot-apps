import * as React from 'react';

import type { IBabylonChartModel } from '../ui/babylon/chartModels';

import styles from './EstateRiskMap.module.scss';

const LazyD3EstateRiskMap = React.lazy(async () => {
  const module = await import(/* webpackChunkName: 'zava-estate-risk-map' */ './D3EstateRiskMap');
  return { default: module.D3EstateRiskMap };
});

export interface IEstateRiskMapProps {
  readonly isDark: boolean;
  readonly model: IBabylonChartModel;
  readonly selectedId?: string;
  readonly onSelect: (markId: string) => void;
}

export function EstateRiskMap(props: IEstateRiskMapProps): React.ReactElement {
  return (
    <React.Suspense fallback={<div className={`${styles.loading} ${props.isDark ? styles.dark : ''}`} role="status">Loading geographic estate data...</div>}>
      <LazyD3EstateRiskMap {...props} />
    </React.Suspense>
  );
}