import * as React from 'react';
import {
  Badge,
  Body1,
  Button,
  Caption1,
  Divider,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
  Subtitle2
} from '@fluentui/react-components';
import {
  CheckmarkCircle24Filled,
  ChevronRight20Regular,
  ErrorCircle16Filled,
  Warning16Filled
} from '@fluentui/react-icons';

import type { IServiceHealthIssue, IServiceHealthStrings } from '../../models';
import { formatRelativeTime, formatString, sortByDateDescending } from '../../utils';
import EmptyState from '../EmptyState';
import { useStyles } from './IssueList.styles';
import type { IIssueListProps } from './IssueList.types';

function getClassificationLabel(issue: IServiceHealthIssue, strings: IServiceHealthStrings): string {
  const classification = issue.classification?.toLowerCase();

  if (classification === 'advisory') {
    return strings.ClassificationAdvisory;
  }
  if (classification === 'incident') {
    return strings.ClassificationIncident;
  }

  return strings.ClassificationUnknown;
}

export default function IssueList(props: Readonly<IIssueListProps>): React.ReactElement {
  const styles = useStyles();
  const { service, issues, isLoading, error, strings, onSelectIssue, onRetry } = props;

  const { active, resolved } = React.useMemo(() => {
    const sorted = issues
      .slice()
      .sort((first, second) => sortByDateDescending(first.lastModifiedDateTime, second.lastModifiedDateTime));

    return {
      active: sorted.filter((issue) => !issue.isResolved),
      resolved: sorted.filter((issue) => issue.isResolved)
    };
  }, [issues]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spinner labelPosition="below" label={formatString(strings.LoadingIssuesLabel, service)} />
      </div>
    );
  }

  if (error) {
    return (
      <MessageBar intent="error" politeness="assertive">
        <MessageBarBody>
          <MessageBarTitle>{strings.ErrorTitle}</MessageBarTitle>
          {error}
        </MessageBarBody>
        <MessageBarActions>
          <Button appearance="transparent" onClick={onRetry}>
            {strings.RetryButtonLabel}
          </Button>
        </MessageBarActions>
      </MessageBar>
    );
  }

  if (active.length === 0 && resolved.length === 0) {
    return (
      <EmptyState
        icon={<CheckmarkCircle24Filled />}
        title={strings.NoActiveIssuesTitle}
        detail={formatString(strings.NoActiveIssuesDetail, service)}
      />
    );
  }

  const renderGroup = (heading: string, groupIssues: IServiceHealthIssue[]): React.ReactElement | null => {
    if (groupIssues.length === 0) {
      return null;
    }

    return (
      <section className={styles.group} aria-label={heading}>
        <Subtitle2>{heading}</Subtitle2>
        {groupIssues.map((issue) => {
          const isAdvisory = issue.severity === 'advisory';
          const updated = formatRelativeTime(issue.lastModifiedDateTime);

          return (
            <button
              type="button"
              key={issue.id || `${issue.title}-${issue.startDateTime}`}
              className={styles.issue}
              onClick={() => onSelectIssue(issue)}
            >
              <span className={styles.issueText}>
                <Body1 className={styles.title} title={issue.title}>
                  {issue.title || strings.IssueDetailFallbackTitle}
                </Body1>
                <span className={styles.meta}>
                  <Badge
                    appearance="tint"
                    size="small"
                    color={issue.isResolved ? 'success' : isAdvisory ? 'warning' : 'danger'}
                    icon={issue.isResolved ? undefined : isAdvisory ? <Warning16Filled /> : <ErrorCircle16Filled />}
                  >
                    {issue.isResolved ? strings.ResolvedBadgeLabel : getClassificationLabel(issue, strings)}
                  </Badge>
                  {issue.id && <Caption1>{issue.id}</Caption1>}
                  {updated && (
                    <>
                      <Caption1 aria-hidden="true">·</Caption1>
                      <Caption1>{formatString(strings.UpdatedLabel, updated)}</Caption1>
                    </>
                  )}
                </span>
              </span>
              <ChevronRight20Regular className={styles.chevron} aria-hidden="true" />
            </button>
          );
        })}
      </section>
    );
  };

  return (
    <div className={styles.root}>
      {renderGroup(strings.ActiveIssuesHeading, active)}
      {active.length > 0 && resolved.length > 0 && <Divider />}
      {renderGroup(strings.ResolvedIssuesHeading, resolved)}
    </div>
  );
}
