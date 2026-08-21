import * as React from 'react';
import { Badge, MessageBar, MessageBarBody, MessageBarTitle } from '@fluentui/react-components';

import type { ServiceHealthSeverity } from '../../models';
import { formatString } from '../../utils';
import { useStyles } from './ServiceHealthSummary.styles';
import type { IServiceHealthSummaryProps } from './ServiceHealthSummary.types';

function countBySeverity(items: IServiceHealthSummaryProps['items']): Record<ServiceHealthSeverity, number> {
  const counts: Record<ServiceHealthSeverity, number> = { healthy: 0, advisory: 0, incident: 0, unknown: 0 };

  for (const item of items) {
    counts[item.severity]++;
  }

  return counts;
}

/** Renders the at-a-glance banner. Callers must not render it for an empty list. */
export default function ServiceHealthSummary(props: Readonly<IServiceHealthSummaryProps>): React.ReactElement {
  const styles = useStyles();
  const { items, strings } = props;
  const counts = React.useMemo(() => countBySeverity(items), [items]);

  const affected = counts.incident + counts.advisory;
  const intent = affected > 0 ? (counts.incident > 0 ? 'error' : 'warning') : counts.unknown > 0 ? 'info' : 'success';

  let title = formatString(strings.SummaryAllHealthy);
  let detail = formatString(strings.SummaryAllHealthyDetail, items.length);

  if (affected > 0) {
    title = formatString(strings.SummaryIssues, affected, items.length);
    detail = strings.SummaryIssuesDetail;
  } else if (counts.unknown > 0) {
    title = strings.SummaryUnknown;
    detail = strings.SummaryUnknownDetail;
  }

  return (
    <div className={styles.root}>
      <MessageBar intent={intent} politeness="polite">
        <MessageBarBody>
          <MessageBarTitle>{title}</MessageBarTitle>
          {detail}
        </MessageBarBody>
      </MessageBar>

      <div className={styles.counts}>
        {counts.incident > 0 && (
          <Badge appearance="tint" color="danger">
            {formatString(strings.IncidentCountLabel, counts.incident)}
          </Badge>
        )}
        {counts.advisory > 0 && (
          <Badge appearance="tint" color="warning">
            {formatString(strings.AdvisoryCountLabel, counts.advisory)}
          </Badge>
        )}
        {counts.healthy > 0 && (
          <Badge appearance="tint" color="success">
            {formatString(strings.HealthyCountLabel, counts.healthy)}
          </Badge>
        )}
      </div>
    </div>
  );
}
