import * as React from 'react';
import { Body1, mergeClasses } from '@fluentui/react-components';
import { ChevronRight20Regular } from '@fluentui/react-icons';

import type { IServiceHealthItem } from '../../models';
import { formatString } from '../../utils';
import StatusBadge from '../StatusBadge';
import { useStyles } from './ServiceList.styles';
import type { IServiceListProps } from './ServiceList.types';

export default function ServiceList(props: Readonly<IServiceListProps>): React.ReactElement {
  const styles = useStyles();
  const { items, strings, onSelectService } = props;

  return (
    <ul className={styles.list} aria-label={strings.ServiceListAriaLabel}>
      {items.map((item: IServiceHealthItem, index: number) => (
        <li key={item.id}>
          <button
            type="button"
            className={mergeClasses(styles.row, index === 0 && styles.firstRow)}
            onClick={() => onSelectService(item)}
            aria-label={formatString(strings.ViewIssuesButtonLabel, item.service)}
          >
            <Body1 className={styles.name} title={item.service}>
              {item.service}
            </Body1>
            <StatusBadge status={item.status} strings={strings} />
            <ChevronRight20Regular className={styles.chevron} aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}
