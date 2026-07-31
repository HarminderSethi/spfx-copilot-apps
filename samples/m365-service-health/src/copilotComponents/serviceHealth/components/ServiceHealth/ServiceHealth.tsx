import * as React from 'react';
import {
  Body1,
  Button,
  Caption1,
  FluentProvider,
  IdPrefixProvider,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
  Subtitle1,
  webDarkTheme,
  webLightTheme
} from '@fluentui/react-components';
import {
  ArrowExpand20Regular,
  ArrowMinimize20Regular,
  ArrowSync20Regular,
} from '@fluentui/react-icons';

import { useAsyncResource } from '../../hooks';
import type { IServiceHealthResponse } from '../../models';
import { formatRelativeTime, formatString, toFriendlyErrorMessage } from '../../utils';
import ServiceHealthOverview from '../ServiceHealthOverview';
import { useStyles } from './ServiceHealth.styles';
import type { IServiceHealthProps } from './ServiceHealth.types';

export default function ServiceHealth(props: Readonly<IServiceHealthProps>): React.ReactElement {
  const styles = useStyles();
  const { serviceName, hostContext, onRequestDisplayMode, strings, loadServiceHealth, loadServiceIssues } = props;

  const theme = hostContext.theme === 'dark' ? webDarkTheme : webLightTheme;
  const isFullscreen = hostContext.displayMode === 'fullscreen';
  const [reloadVersion, setReloadVersion] = React.useState(0);

  const health = useAsyncResource<IServiceHealthResponse>(loadServiceHealth, `${serviceName}:${reloadVersion}`);

  const handleToggleDisplayMode = React.useCallback(() => {
    onRequestDisplayMode(isFullscreen ? 'inline' : 'fullscreen').catch(() => undefined);
  }, [isFullscreen, onRequestDisplayMode]);

  const handleReload = React.useCallback(() => {
    setReloadVersion((current) => current + 1);
  }, []);

  // const handleAskAboutView = React.useCallback(() => {
  //   const isOverall = !health.data || health.data.requestedService === 'all';
  //   askCopilot(
  //     isOverall
  //       ? strings.FollowUpMessageOverall
  //       : formatString(strings.FollowUpMessageService, health.data?.requestedService as string)
  //   );
  // }, [askCopilot, health.data, strings]);

  const isSpecificService = health.data !== undefined && health.data.requestedService !== 'all';
  const updatedLabel = formatRelativeTime(health.data?.generatedAt);

  return (
    <IdPrefixProvider value="service-health-">
      <FluentProvider theme={theme} targetDocument={props.targetDocument} className={styles.provider}>
        <div className={styles.root}>
          <header className={styles.header}>
            <div className={styles.heading}>
              <Subtitle1>{strings.ComponentTitle}</Subtitle1>
              <Body1 className={styles.subtitle}>
                {isSpecificService
                  ? formatString(strings.SpecificSubtitle, health.data?.requestedService as string)
                  : strings.OverallSubtitle}
              </Body1>
              {updatedLabel && <Caption1 className={styles.subtitle}>{formatString(strings.UpdatedLabel, updatedLabel)}</Caption1>}
            </div>

            <div className={styles.actions}>
              <Button
                appearance="subtle"
                icon={<ArrowSync20Regular />}
                aria-label={strings.RefreshButtonLabel}
                title={strings.RefreshButtonLabel}
                disabled={health.isLoading}
                onClick={handleReload}
              />
              <Button
                appearance="subtle"
                icon={isFullscreen ? <ArrowMinimize20Regular /> : <ArrowExpand20Regular />}
                aria-label={isFullscreen ? strings.CollapseButtonLabel : strings.ExpandButtonLabel}
                title={isFullscreen ? strings.CollapseButtonLabel : strings.ExpandButtonLabel}
                onClick={handleToggleDisplayMode}
              />
            </div>
          </header>

          {health.isLoading && (
            <div className={styles.loading}>
              <Spinner labelPosition="below" label={strings.LoadingLabel} />
            </div>
          )}

          {!health.isLoading && health.error !== undefined && (
            <MessageBar intent="error" politeness="assertive">
              <MessageBarBody>
                <MessageBarTitle>{strings.ErrorTitle}</MessageBarTitle>
                {toFriendlyErrorMessage(health.error, strings)}
              </MessageBarBody>
              <MessageBarActions>
                <Button appearance="transparent" onClick={handleReload}>
                  {strings.RetryButtonLabel}
                </Button>
              </MessageBarActions>
            </MessageBar>
          )}

          {!health.isLoading && health.error === undefined && health.data && (
            <ServiceHealthOverview
              response={health.data}
              loadServiceIssues={loadServiceIssues}
              strings={strings}
            />
          )}
        </div>
      </FluentProvider>
    </IdPrefixProvider>
  );
}
