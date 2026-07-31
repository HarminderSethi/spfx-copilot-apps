import * as React from 'react';
import { Body1, Subtitle2 } from '@fluentui/react-components';

import { useStyles } from './EmptyState.styles';
import type { IEmptyStateProps } from './EmptyState.types';

export default function EmptyState(props: Readonly<IEmptyStateProps>): React.ReactElement {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      {props.icon && (
        <div className={styles.icon} aria-hidden="true">
          {props.icon}
        </div>
      )}
      <Subtitle2>{props.title}</Subtitle2>
      {props.detail && <Body1 className={styles.detail}>{props.detail}</Body1>}
      {props.children}
    </div>
  );
}
