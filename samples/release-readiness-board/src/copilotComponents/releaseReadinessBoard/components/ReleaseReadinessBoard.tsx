import * as React from 'react';
import {
  Badge,
  Button,
  Checkbox,
  Divider,
  FluentProvider,
  IdPrefixProvider,
  Input,
  Text,
  makeStyles,
  tokens,
  webDarkTheme,
  webLightTheme
} from '@fluentui/react-components';
import { ArrowExpand24Regular } from '@fluentui/react-icons';
import type { IReleaseCheck, IReleasePlan, TBlockerType, TReleaseCheckStatus } from '../models/IReleaseReadiness';
import type { IReleaseReadinessBoardProps } from './IReleaseReadinessBoardProps';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  inlineContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    padding: tokens.spacingHorizontalM
  },
  inlineHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalXS
  },
  statTile: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalS,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS
  },
  blockerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS
  },
  fullscreenLayout: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: tokens.spacingHorizontalM,
    height: '100%',
    overflow: 'hidden',
    padding: tokens.spacingHorizontalM,
    paddingBottom: tokens.spacingVerticalM
  },
  sidebar: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalS,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    overflow: 'auto'
  },
  releaseButton: {
    justifyContent: 'flex-start',
    fontWeight: tokens.fontWeightSemibold
  },
  mainPanel: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalM,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    overflow: 'hidden'
  },
  checksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    overflow: 'auto',
    paddingRight: tokens.spacingHorizontalXS
  },
  checkCard: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalS,
    display: 'flex',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalS,
    boxShadow: tokens.shadow2
  },
  checkMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS
  },
  checkBadges: {
    display: 'flex',
    gap: tokens.spacingHorizontalXXS,
    flexWrap: 'wrap'
  },
  checkActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: tokens.spacingVerticalXS
  },
  checkActionRow: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
    flexWrap: 'wrap',
    justifyContent: 'flex-end'
  },
  filters: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: tokens.spacingHorizontalS
  },
  actionCenter: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalS,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground2
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: tokens.spacingHorizontalS
  },
  actionButtonsRow: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap'
  },
  summaryChips: {
    display: 'flex',
    gap: tokens.spacingHorizontalXXS,
    flexWrap: 'wrap'
  },
  sectionHeading: {
    marginTop: tokens.spacingVerticalXS
  },
  noData: {
    color: tokens.colorNeutralForeground3,
    paddingTop: tokens.spacingVerticalM
  }
});

const deepCloneReleases = (releases: IReleasePlan[]): IReleasePlan[] => releases.map((release) => ({
  ...release,
  checks: release.checks.map((check) => ({ ...check }))
}));

const asDate = (value: string): Date => new Date(value);

const statusToBadgeAppearance = (status: TReleaseCheckStatus): 'filled' | 'tint' | 'outline' => {
  if (status === 'done') {
    return 'tint';
  }

  if (status === 'blocked') {
    return 'filled';
  }

  return 'outline';
};

const statusToBadgeColor = (status: TReleaseCheckStatus): 'success' | 'danger' | 'informative' => {
  if (status === 'done') {
    return 'success';
  }

  if (status === 'blocked') {
    return 'danger';
  }

  return 'informative';
};

const summarize = (checks: IReleaseCheck[]): { done: number; blocked: number; overdue: number; total: number; completionPercent: number } => {
  const now = new Date();
  const done = checks.filter((check) => check.status === 'done').length;
  const blocked = checks.filter((check) => check.status === 'blocked').length;
  const overdue = checks.filter((check) => check.status !== 'done' && asDate(check.dueDate) < now).length;
  const total = checks.length;
  const completionPercent = total === 0 ? 0 : Math.round((done / total) * 100);

  return { done, blocked, overdue, total, completionPercent };
};

const riskLabel = (blocked: number, completionPercent: number, strings: IReleaseReadinessBoardProps['strings']): string => {
  if (blocked > 0 || completionPercent < 60) {
    return strings.RiskHigh;
  }

  if (completionPercent < 85) {
    return strings.RiskMedium;
  }

  return strings.RiskLow;
};

const statusText = (status: TReleaseCheckStatus, strings: IReleaseReadinessBoardProps['strings']): string => {
  switch (status) {
    case 'done':
      return strings.StatusDone;
    case 'blocked':
      return strings.StatusBlocked;
    default:
      return strings.StatusPending;
  }
};

const formatDate = (isoDate: string): string => asDate(isoDate).toLocaleDateString();

const blockerPlaybook: Record<TBlockerType, string> = {
  Dependency: 'Escalate dependency owner and set delivery ETA.',
  Environment: 'Open infra ticket, assign platform owner, and book retest slot.',
  Security: 'Run remediation validation and require security sign-off.',
  Quality: 'Assign defect owner and rerun failing quality gate.',
  Approval: 'Schedule approval sync with owner and deadline.',
  Capacity: 'Rebalance ownership and reserve focused execution window.'
};

export default function ReleaseReadinessBoard(props: IReleaseReadinessBoardProps): React.ReactElement {
  const {
    releases,
    dataSourceLabel,
    releaseName,
    owner,
    showBlockedOnly,
    userDisplayName,
    hostContext,
    onRequestDisplayMode,
    onSendFollowUp,
    targetDocument,
    strings
  } = props;

  const styles = useStyles();
  const [releaseState, setReleaseState] = React.useState<IReleasePlan[]>(() => deepCloneReleases(releases));
  const [selectedReleaseId, setSelectedReleaseId] = React.useState<string>(() => releases[0]?.id || '');
  const [releaseFilter, setReleaseFilter] = React.useState<string>(releaseName || '');
  const [ownerFilter, setOwnerFilter] = React.useState<string>(owner || '');
  const [blockedOnly, setBlockedOnly] = React.useState<boolean>(showBlockedOnly === 'true');

  const filteredReleases = React.useMemo(() => {
    const releaseTerm = releaseFilter.trim().toLowerCase();
    return releaseState.filter((release) => {
      if (!releaseTerm) {
        return true;
      }

      return release.name.toLowerCase().includes(releaseTerm) || release.product.toLowerCase().includes(releaseTerm);
    });
  }, [releaseFilter, releaseState]);

  React.useEffect(() => {
    if (!filteredReleases.some((release) => release.id === selectedReleaseId)) {
      setSelectedReleaseId(filteredReleases[0]?.id || '');
    }
  }, [filteredReleases, selectedReleaseId]);

  const selectedRelease = React.useMemo(
    () => filteredReleases.find((release) => release.id === selectedReleaseId) || filteredReleases[0],
    [filteredReleases, selectedReleaseId]
  );

  const visibleChecks = React.useMemo(() => {
    if (!selectedRelease) {
      return [];
    }

    const ownerTerm = ownerFilter.trim().toLowerCase();

    return selectedRelease.checks.filter((check) => {
      if (blockedOnly && check.status !== 'blocked') {
        return false;
      }

      if (!ownerTerm) {
        return true;
      }

      return check.owner.toLowerCase().includes(ownerTerm);
    });
  }, [blockedOnly, ownerFilter, selectedRelease]);

  const summary = React.useMemo(() => summarize(visibleChecks), [visibleChecks]);
  const blockers = React.useMemo(
    () => visibleChecks.filter((check) => check.status === 'blocked').slice(0, 3),
    [visibleChecks]
  );

  const blockerByTypeSummary = React.useMemo(() => {
    const grouped = visibleChecks
      .filter((check) => check.status === 'blocked')
      .reduce((acc, check) => {
        const key = check.blockerType || 'Capacity';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<TBlockerType, number>);

    return (Object.keys(grouped) as TBlockerType[]).map((key): [TBlockerType, number] => [key, grouped[key]]);
  }, [visibleChecks]);

  const ownerWorkloadSummary = React.useMemo(() => {
    const grouped = visibleChecks.reduce((acc, check) => {
      acc[check.owner] = (acc[check.owner] || 0) + (check.status === 'done' ? 0 : 1);
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(grouped)
      .map((ownerName): [string, number] => [ownerName, grouped[ownerName]])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [visibleChecks]);

  const setCheckStatus = React.useCallback((releaseId: string, checkId: string, status: TReleaseCheckStatus): void => {
    setReleaseState((previous) => previous.map((release) => {
      if (release.id !== releaseId) {
        return release;
      }

      return {
        ...release,
        checks: release.checks.map((check) => {
          if (check.id !== checkId) {
            return check;
          }

          return {
            ...check,
            status,
            updatedAt: new Date().toISOString()
          };
        })
      };
    }));
  }, []);

  const markVisibleDone = React.useCallback((): void => {
    if (!selectedRelease) {
      return;
    }

    const visibleIds = new Set(visibleChecks.map((check) => check.id));
    setReleaseState((previous) => previous.map((release) => {
      if (release.id !== selectedRelease.id) {
        return release;
      }

      return {
        ...release,
        checks: release.checks.map((check) => {
          if (!visibleIds.has(check.id) || check.status === 'blocked') {
            return check;
          }

          return {
            ...check,
            status: 'done',
            updatedAt: new Date().toISOString()
          };
        })
      };
    }));
  }, [selectedRelease, visibleChecks]);

  const resetFilters = React.useCallback((): void => {
    setReleaseFilter('');
    setOwnerFilter('');
    setBlockedOnly(false);
  }, []);

  const postUnblockPlan = React.useCallback(async (): Promise<void> => {
    if (!selectedRelease) {
      return;
    }

    const blockedChecks = visibleChecks.filter((check) => check.status === 'blocked');
    if (blockedChecks.length === 0) {
      await onSendFollowUp(`No blockers in ${selectedRelease.name}. Recommended action: continue release execution and verify overdue checks.`);
      return;
    }

    const planLines = blockedChecks.map((check) => {
      const blockerType = check.blockerType || 'Capacity';
      return `- ${check.title} (${check.owner}) [${blockerType}]: ${blockerPlaybook[blockerType]}`;
    });

    const message = [
      `Unblock plan for ${selectedRelease.name}:`,
      ...planLines
    ].join('\n');

    await onSendFollowUp(message);
  }, [onSendFollowUp, selectedRelease, visibleChecks]);

  const postOwnerUpdate = React.useCallback(async (): Promise<void> => {
    if (!selectedRelease) {
      return;
    }

    const ownerLines = ownerWorkloadSummary.map(([ownerName, openCount]) => `- ${ownerName}: ${openCount} open checks`);
    const message = [
      `Owner handoff update for ${selectedRelease.name}:`,
      `Completion ${summary.completionPercent}% (${summary.done}/${summary.total}), blockers ${summary.blocked}, overdue ${summary.overdue}.`,
      'Priority owners:',
      ...ownerLines
    ].join('\n');

    await onSendFollowUp(message);
  }, [onSendFollowUp, ownerWorkloadSummary, selectedRelease, summary]);

  const postSummary = React.useCallback(async (): Promise<void> => {
    if (!selectedRelease) {
      return;
    }

    const summaryText = [
      `Release readiness summary for ${selectedRelease.name}:`,
      `Completion ${summary.completionPercent}% (${summary.done}/${summary.total}).`,
      `Blocked checks: ${summary.blocked}.`,
      `Overdue checks: ${summary.overdue}.`,
      `Owner: ${userDisplayName}.`
    ].join(' ');

    await onSendFollowUp(summaryText);
  }, [onSendFollowUp, selectedRelease, summary, userDisplayName]);

  const unblockCheck = React.useCallback((releaseId: string, checkId: string): void => {
    setReleaseState((previous) => previous.map((release) => {
      if (release.id !== releaseId) {
        return release;
      }

      return {
        ...release,
        checks: release.checks.map((check) => check.id === checkId ? {
          ...check,
          status: 'pending',
          updatedAt: new Date().toISOString()
        } : check)
      };
    }));
  }, []);

  const theme = hostContext.theme === 'dark' ? webDarkTheme : webLightTheme;
  const isFullscreen = hostContext.displayMode === 'fullscreen';

  const inlineView = (
    <div className={styles.inlineContainer}>
      <div className={styles.inlineHeader}>
        <Text weight="semibold">{strings.Title}</Text>
        <Button
          appearance="subtle"
          icon={<ArrowExpand24Regular />}
          onClick={() => { onRequestDisplayMode('fullscreen').catch(() => undefined); }}
        >
          {strings.ExpandButtonLabel}
        </Button>
      </div>
      {!selectedRelease && <Text className={styles.noData}>{strings.NoReleasesFound}</Text>}
      {selectedRelease && (
        <>
          <Text>{selectedRelease.name} · {selectedRelease.environment}</Text>
          <Text size={200}>{strings.DataSourceLabel}: {dataSourceLabel.includes('API') ? strings.DataSourceLiveLabel : strings.DataSourceMockLabel}</Text>
          <div className={styles.statsRow}>
            <div className={styles.statTile}>
              <Text size={200}>{strings.CompletionLabel}</Text>
              <Text weight="semibold">{summary.completionPercent}%</Text>
            </div>
            <div className={styles.statTile}>
              <Text size={200}>{strings.BlockersLabel}</Text>
              <Text weight="semibold">{summary.blocked}</Text>
            </div>
            <div className={styles.statTile}>
              <Text size={200}>{strings.OverdueLabel}</Text>
              <Text weight="semibold">{summary.overdue}</Text>
            </div>
          </div>
          <Text>
            {strings.HealthLabel}: <strong>{riskLabel(summary.blocked, summary.completionPercent, strings)}</strong>
          </Text>
          <div className={styles.blockerList}>
            {blockers.map((check) => (
              <Text key={check.id} size={200}>• {check.title} ({check.owner}){check.blockerType ? ` [${check.blockerType}]` : ''}</Text>
            ))}
            {blockers.length === 0 && <Text size={200}>{strings.NoBlockersRightNow}</Text>}
          </div>
          <div className={styles.actionButtonsRow}>
            <Button size="small" appearance="primary" onClick={() => { postSummary().catch(() => undefined); }}>
              {strings.PostSummaryLabel}
            </Button>
            <Button size="small" appearance="outline" onClick={() => { postUnblockPlan().catch(() => undefined); }}>
              {strings.SuggestUnblockPlanLabel}
            </Button>
          </div>
        </>
      )}
    </div>
  );

  const fullscreenView = (
    <div className={styles.fullscreenLayout}>
      <div className={styles.sidebar}>
        <Text weight="semibold">{strings.Title}</Text>
        <Input
          placeholder={strings.SearchPlaceholder}
          value={releaseFilter}
          onChange={(_, data) => setReleaseFilter(data.value)}
        />
        {filteredReleases.map((release) => (
          <Button
            key={release.id}
            className={styles.releaseButton}
            appearance={selectedRelease?.id === release.id ? 'primary' : 'subtle'}
            onClick={() => setSelectedReleaseId(release.id)}
          >
            {release.name} {release.checks.filter((check) => check.status === 'blocked').length > 0 ? `• ${release.checks.filter((check) => check.status === 'blocked').length} blocked` : ''}
          </Button>
        ))}
        {filteredReleases.length === 0 && <Text size={200}>{strings.NoReleaseMatchesFilter}</Text>}
      </div>
      <div className={styles.mainPanel}>
        {!selectedRelease && <Text className={styles.noData}>{strings.NoReleaseSelected}</Text>}
        {selectedRelease && (
          <>
            <Text weight="semibold">{selectedRelease.name} · {selectedRelease.product}</Text>
            <Text size={200}>{strings.DataSourceLabel}: {dataSourceLabel}</Text>
            <Text size={200}>
              {strings.TargetLabel}: {formatDate(selectedRelease.targetDate)} · {strings.LastUpdatedLabel}: {formatDate(selectedRelease.updatedAt)}
            </Text>
            <div className={styles.filters}>
              <Input
                placeholder={strings.OwnerPlaceholder}
                value={ownerFilter}
                onChange={(_, data) => setOwnerFilter(data.value)}
              />
              <Checkbox
                checked={blockedOnly}
                onChange={(_, data: { checked?: unknown }) => setBlockedOnly(Boolean(data.checked))}
                label={strings.ShowBlockedOnlyLabel}
              />
            </div>
            <div className={styles.statsRow}>
              <div className={styles.statTile}>
                <Text size={200}>{strings.CompletionLabel}</Text>
                <Text weight="semibold">{summary.completionPercent}%</Text>
              </div>
              <div className={styles.statTile}>
                <Text size={200}>{strings.BlockersLabel}</Text>
                <Text weight="semibold">{summary.blocked}</Text>
              </div>
              <div className={styles.statTile}>
                <Text size={200}>{strings.OverdueLabel}</Text>
                <Text weight="semibold">{summary.overdue}</Text>
              </div>
            </div>
            <Text>
              {strings.HealthLabel}: <strong>{riskLabel(summary.blocked, summary.completionPercent, strings)}</strong>
            </Text>
            <div className={styles.actionCenter}>
              <Text weight="semibold">{strings.ActionCenterLabel}</Text>
              <div className={styles.actionGrid}>
                <Button appearance="primary" onClick={() => { postSummary().catch(() => undefined); }}>
                  {strings.PostSummaryLabel}
                </Button>
                <Button appearance="outline" onClick={() => { postUnblockPlan().catch(() => undefined); }}>
                  {strings.SuggestUnblockPlanLabel}
                </Button>
                <Button appearance="outline" onClick={() => { postOwnerUpdate().catch(() => undefined); }}>
                  {strings.DraftOwnerUpdateLabel}
                </Button>
                <Button appearance="outline" onClick={markVisibleDone}>
                  {strings.MarkVisibleDoneLabel}
                </Button>
              </div>
              <Button size="small" appearance="subtle" onClick={resetFilters}>{strings.ResetFiltersLabel}</Button>
              <Text size={200}>{strings.BlockerSummaryLabel}</Text>
              <div className={styles.summaryChips}>
                {blockerByTypeSummary.length > 0
                  ? blockerByTypeSummary.map(([type, count]) => (
                    <Badge key={type} appearance="outline" color="warning">{type} {count}</Badge>
                  ))
                  : <Badge appearance="outline">None</Badge>}
              </div>
              <Text size={200}>{strings.OwnerWorkloadLabel}</Text>
              <div className={styles.summaryChips}>
                {ownerWorkloadSummary.length > 0
                  ? ownerWorkloadSummary.map(([ownerName, openCount]) => (
                    <Badge key={ownerName} appearance="outline">{ownerName} {openCount}</Badge>
                  ))
                  : <Badge appearance="outline">None</Badge>}
              </div>
            </div>
            <Divider />
            <Text weight="semibold" className={styles.sectionHeading}>{strings.ReleaseChecksLabel}</Text>
            <div className={styles.checksList}>
              {visibleChecks.map((check) => (
                <div
                  key={check.id}
                  className={styles.checkCard}
                  style={check.status === 'blocked' ? { borderLeft: `4px solid ${tokens.colorPaletteRedBorder2}` } : undefined}
                >
                  <div className={styles.checkMeta}>
                    <Text weight="semibold">{check.title}</Text>
                    <Text size={200}>{check.area} · {check.owner} · Due {formatDate(check.dueDate)}</Text>
                    <div className={styles.checkBadges}>
                      {check.blockerType && <Badge appearance="outline">{check.blockerType}</Badge>}
                      {check.userStoryIds && check.userStoryIds.length > 0 && <Badge appearance="tint">{check.userStoryIds.length} stories</Badge>}
                    </div>
                    {check.userStoryIds && check.userStoryIds.length > 0 && (
                      <Text size={200}>{strings.StoriesLabel}: {check.userStoryIds.join(', ')}</Text>
                    )}
                    {check.blockerType && (
                      <Text size={200}>{strings.BlockerTypeLabel}: {check.blockerType}</Text>
                    )}
                    {check.note && <Text size={200}>{check.note}</Text>}
                  </div>
                  <div className={styles.checkActions}>
                    <Badge appearance={statusToBadgeAppearance(check.status)} color={statusToBadgeColor(check.status)}>
                      {statusText(check.status, strings)}
                    </Badge>
                    <div className={styles.checkActionRow}>
                      {check.status !== 'done' && check.status !== 'blocked' && (
                        <Button size="small" appearance="subtle" onClick={() => setCheckStatus(selectedRelease.id, check.id, 'done')}>
                          {strings.SetDoneLabel}
                        </Button>
                      )}
                      {check.status === 'done' && (
                        <Button size="small" appearance="subtle" onClick={() => setCheckStatus(selectedRelease.id, check.id, 'pending')}>
                          {strings.ReopenLabel}
                        </Button>
                      )}
                      {check.status !== 'blocked' && (
                        <Button size="small" appearance="outline" onClick={() => setCheckStatus(selectedRelease.id, check.id, 'blocked')}>
                          {strings.MarkBlockedLabel}
                        </Button>
                      )}
                      {check.status === 'blocked' && (
                        <Button size="small" appearance="subtle" onClick={() => unblockCheck(selectedRelease.id, check.id)}>
                          {strings.UnblockLabel}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {visibleChecks.length === 0 && <Text className={styles.noData}>{strings.NoChecksMatchFilters}</Text>}
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <IdPrefixProvider value="release-readiness-">
      <FluentProvider
        theme={theme}
        targetDocument={targetDocument}
        style={{ height: isFullscreen ? '100%' : 'auto' }}
      >
        <div className={styles.root}>
          {isFullscreen ? fullscreenView : inlineView}
        </div>
      </FluentProvider>
    </IdPrefixProvider>
  );
}
