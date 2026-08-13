import * as React from 'react';

import { Text } from '@fluentui/react-text';
import { makeStyles } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import { ShieldCheckmark20Regular } from '@fluentui/react-icons';

import type { IZavaGroundingSource } from '../models/zavaEmployee';

const useStyles = makeStyles({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: tokens.colorNeutralForeground3
  }
});

export interface IGroundingSourceProps {
  source?: IZavaGroundingSource;
  fallbackLabel?: string;
}

const GroundingSource: React.FunctionComponent<IGroundingSourceProps> = ({ source, fallbackLabel }) => {
  const styles = useStyles();
  const label = source ? `Grounded in ${source.title}` : fallbackLabel;
  if (!label) {
    return null;
  }
  return (
    <span className={styles.root}>
      <ShieldCheckmark20Regular aria-hidden="true" />
      <Text size={200}>{label}</Text>
    </span>
  );
};

export default GroundingSource;