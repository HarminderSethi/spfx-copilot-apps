import * as React from 'react';
import { Badge, Body1, Caption1, Divider, Subtitle2 } from '@fluentui/react-components';
import {  ErrorCircle16Filled, Warning16Filled } from '@fluentui/react-icons';

import { getServiceStatusLabel } from '../../services';
import { formatDateTime, htmlToParagraphs, sortByDateDescending } from '../../utils';
import { useStyles } from './IssueDetail.styles';
import type { IFactProps, IIssueDetailProps } from './IssueDetail.types';

function Fact(props: Readonly<IFactProps>): React.ReactElement {
  const styles = useStyles();

  return (
    <div className={styles.fact}>
      <Caption1 className={styles.factLabel}>{props.label}</Caption1>
      <Body1>{props.value}</Body1>
    </div>
  );
}

export default function IssueDetail(props: Readonly<IIssueDetailProps>): React.ReactElement {
  const styles = useStyles();
  const { issue, strings } = props;

  const impact = React.useMemo(() => htmlToParagraphs(issue.impactDescription).join('\n\n'), [issue.impactDescription]);
  const updates = React.useMemo(
    () =>
      (issue.posts || [])
        .slice()
        .sort((first, second) => sortByDateDescending(first.createdDateTime, second.createdDateTime))
        .map((post) => ({
          createdDateTime: post.createdDateTime,
          body: htmlToParagraphs(post.description?.content).join('\n\n')
        }))
        .filter((post) => post.body.length > 0),
    [issue.posts]
  );

  const isAdvisory = issue.severity === 'advisory';
  const classificationLabel = isAdvisory
    ? strings.ClassificationAdvisory
    : issue.classification?.toLowerCase() === 'incident'
      ? strings.ClassificationIncident
      : strings.ClassificationUnknown;

  const facts = React.useMemo(
    () =>
      [
        { label: strings.AffectedServiceLabel, value: issue.service },
        { label: strings.IssueStatusLabel, value: issue.status ? getServiceStatusLabel(issue.status, strings) : undefined },
        { label: strings.IssueTypeLabel, value: classificationLabel },
        { label: strings.IssueOriginLabel, value: issue.origin },
        { label: strings.StartedLabel, value: formatDateTime(issue.startDateTime) },
        { label: strings.EndedLabel, value: formatDateTime(issue.endDateTime) },
        { label: strings.LastUpdatedLabel, value: formatDateTime(issue.lastModifiedDateTime) }
      ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value)),
    [issue, classificationLabel, strings]
  );

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Subtitle2>{issue.title || strings.IssueDetailFallbackTitle}</Subtitle2>
        <div className={styles.headerMeta}>
          <Badge
            appearance="tint"
            color={issue.isResolved ? 'success' : isAdvisory ? 'warning' : 'danger'}
            icon={issue.isResolved ? undefined : isAdvisory ? <Warning16Filled /> : <ErrorCircle16Filled />}
          >
            {issue.isResolved ? strings.ResolvedBadgeLabel : classificationLabel}
          </Badge>
          {issue.id && <Caption1>{issue.id}</Caption1>}
        </div>
      </header>

      <div className={styles.factGrid}>
        {facts.map((fact) => (
          <Fact key={fact.label} label={fact.label} value={fact.value} />
        ))}
      </div>

      <section className={styles.section} aria-label={strings.UserImpactHeading}>
        <Subtitle2>{strings.UserImpactHeading}</Subtitle2>
        {impact.length > 0 ? (
          <Body1 className={styles.paragraph}>{impact}</Body1>
        ) : (
          <Body1 className={styles.muted}>{strings.NoImpactDetail}</Body1>
        )}
      </section>

      <Divider />

      <section className={styles.section} aria-label={strings.UpdatesHeading}>
        <Subtitle2>{strings.UpdatesHeading}</Subtitle2>
        {updates.length > 0 ? (
          updates.map((update) => (
            <div className={styles.update} key={`${update.createdDateTime || ''}-${update.body.length}`}>
              <Caption1 className={styles.factLabel}>{formatDateTime(update.createdDateTime)}</Caption1>
              <Body1 className={styles.paragraph}>{update.body}</Body1>
            </div>
          ))
        ) : (
          <Body1 className={styles.muted}>{strings.NoUpdatesDetail}</Body1>
        )}
      </section>

    </div>
  );
}
