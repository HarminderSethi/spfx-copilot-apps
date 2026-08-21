import * as React from 'react';

import { Text } from '@fluentui/react-text';
import { makeStyles, mergeClasses } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';

import type { IZavaMetric } from '../models/zavaEmployee';

const useStyles = makeStyles({
  root: {
    minWidth: 0,
    padding: '11px 12px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderTop: `3px solid ${tokens.colorBrandStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow2
  },
  neutral: { borderTopColor: tokens.colorBrandStroke1 },
  positive: { borderTopColor: tokens.colorPaletteGreenBorderActive },
  attention: { borderTopColor: tokens.colorPaletteMarigoldBorderActive },
  critical: { borderTopColor: tokens.colorPaletteRedBorderActive },
  value: { fontWeight: tokens.fontWeightBold },
  label: { color: tokens.colorNeutralForeground3 }
});

export interface IMetricTileProps {
  metric: IZavaMetric;
}

const MetricTile: React.FunctionComponent<IMetricTileProps> = ({ metric }) => {
  const styles = useStyles();
  return (
    <div className={mergeClasses(styles.root, styles[metric.intent])} data-metric-id={metric.id}>
      <Text size={600} block className={styles.value}>{metric.value}</Text>
      <Text size={200} block className={styles.label}>{metric.label}</Text>
    </div>
  );
};

export default MetricTile;