import * as React from 'react';
import { Badge } from '@fluentui/react-components';

import { getServiceSeverity, getServiceStatusLabel } from '../../services';
import { SEVERITY_APPEARANCE } from './StatusBadge.constants';
import { useStyles } from './StatusBadge.styles';
import type { IStatusBadgeProps } from './StatusBadge.types';

export default function StatusBadge(props: Readonly<IStatusBadgeProps>): React.ReactElement {
  const styles = useStyles();
  const { color, Icon } = SEVERITY_APPEARANCE[getServiceSeverity(props.status)];
  const label = getServiceStatusLabel(props.status, props.strings);

  return (
    <Badge className={styles.badge} appearance="tint" color={color} size="medium" icon={<Icon />}>
      {label}
    </Badge>
  );
}
