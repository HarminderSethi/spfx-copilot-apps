import * as React from 'react';

import { Text } from '@fluentui/react-text';
import { makeStyles } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';

const useStyles = makeStyles({
  root: {
    padding: '18px',
    color: tokens.colorNeutralForeground3,
    textAlign: 'center'
  }
});

export interface IEmptyStateProps {
  message: string;
}

const EmptyState: React.FunctionComponent<IEmptyStateProps> = ({ message }) => {
  const styles = useStyles();
  return <Text className={styles.root} role="status" aria-live="polite">{message}</Text>;
};

export default EmptyState;