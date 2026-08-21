import * as React from 'react';

import { Text } from '@fluentui/react-text';
import { makeStyles, mergeClasses } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';

export type StatusIntent = 'neutral' | 'positive' | 'attention' | 'critical';

const useStyles = makeStyles({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 7px',
    borderRadius: tokens.borderRadiusCircular,
    whiteSpace: 'nowrap'
  },
  neutral: { color: tokens.colorNeutralForeground2, backgroundColor: tokens.colorNeutralBackground3 },
  positive: { color: tokens.colorPaletteGreenForeground2, backgroundColor: tokens.colorPaletteGreenBackground2 },
  attention: { color: tokens.colorPaletteMarigoldForeground2, backgroundColor: tokens.colorPaletteMarigoldBackground2 },
  critical: { color: tokens.colorPaletteRedForeground2, backgroundColor: tokens.colorPaletteRedBackground2 }
});

export interface IStatusBadgeProps {
  label: string;
  intent?: StatusIntent;
}

const StatusBadge: React.FunctionComponent<IStatusBadgeProps> = ({ label, intent = 'neutral' }) => {
  const styles = useStyles();
  return <Text size={200} className={mergeClasses(styles.root, styles[intent])}>{label}</Text>;
};

export default StatusBadge;