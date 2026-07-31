import * as React from 'react';
import {
  Body1,
  Button,
  Caption1,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  OverlayDrawer,
  SearchBox,
  Tab,
  TabList,
  type SelectTabData,
  type SelectTabEvent
} from '@fluentui/react-components';
import { ArrowLeft20Regular, Dismiss24Regular, Search20Regular } from '@fluentui/react-icons';

import { useAsyncResource } from '../../hooks';
import type { IServiceHealthIssue, IServiceHealthItem } from '../../models';
import { formatString, toFriendlyErrorMessage } from '../../utils';
import EmptyState from '../EmptyState';
import IssueDetail from '../IssueDetail';
import IssueList from '../IssueList';
import ServiceHealthSummary from '../ServiceHealthSummary';
import ServiceList from '../ServiceList';
import { useStyles } from './ServiceHealthOverview.styles';
import { type ServiceFilter } from './ServiceHealthOverview.constants';
import type { IServiceHealthOverviewProps } from './ServiceHealthOverview.types';

function matchesFilter(item: IServiceHealthItem, filter: ServiceFilter): boolean {
  if (filter === 'attention') {
    return item.severity === 'incident' || item.severity === 'advisory';
  }
  if (filter === 'healthy') {
    return item.severity === 'healthy';
  }

  return true;
}

export default function ServiceHealthOverview(props: Readonly<IServiceHealthOverviewProps>): React.ReactElement {
  const styles = useStyles();
  const { response, loadServiceIssues, strings } = props;

  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState<ServiceFilter>('all');
  const [selectedService, setSelectedService] = React.useState<IServiceHealthItem>();
  const [selectedIssue, setSelectedIssue] = React.useState<IServiceHealthIssue>();

  const selectedServiceId = selectedService?.service;
  const issuesResource = useAsyncResource<IServiceHealthIssue[]>(
    React.useCallback(
      async () => (selectedServiceId ? loadServiceIssues(selectedServiceId) : []),
      [loadServiceIssues, selectedServiceId]
    ),
    selectedServiceId
  );

  const visibleItems = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return response.items.filter(
      (item) =>
        matchesFilter(item, filter) &&
        (normalizedQuery.length === 0 || item.service.toLowerCase().indexOf(normalizedQuery) >= 0)
    );
  }, [response.items, filter, query]);

  const closeDrawer = React.useCallback(() => {
    setSelectedService(undefined);
    setSelectedIssue(undefined);
  }, []);

  const handleSelectService = React.useCallback((item: IServiceHealthItem) => {
    setSelectedIssue(undefined);
    setSelectedService(item);
  }, []);

  const handleTabSelect = React.useCallback((_event: SelectTabEvent, data: SelectTabData) => {
    setFilter(data.value as ServiceFilter);
  }, []);

  const hasServices = response.items.length > 0;

  return (
    <div className={styles.root}>
      {response.unmatchedService && (
        <MessageBar intent="info" politeness="polite">
          <MessageBarBody>
            <MessageBarTitle>{formatString(strings.ServiceNotFoundTitle, response.unmatchedService)}</MessageBarTitle>
            {strings.ServiceNotFoundDetail}
          </MessageBarBody>
        </MessageBar>
      )}

      {response.items.length > 0 && <ServiceHealthSummary items={response.items} strings={strings} />}

      {hasServices && response.items.length > 1 && (
        <div className={styles.toolbar}>
          <TabList selectedValue={filter} onTabSelect={handleTabSelect} size="small">
            <Tab value="all">{strings.FilterAllLabel}</Tab>
            <Tab value="attention">{strings.FilterAttentionLabel}</Tab>
            <Tab value="healthy">{strings.FilterHealthyLabel}</Tab>
          </TabList>
          <SearchBox
            className={styles.search}
            size="small"
            placeholder={strings.SearchPlaceholder}
            aria-label={strings.SearchAriaLabel}
            value={query}
            contentBefore={<Search20Regular />}
            onChange={(_event, data) => setQuery(data.value)}
          />
        </div>
      )}

      {!hasServices && <EmptyState title={strings.EmptyServicesTitle} detail={strings.EmptyServicesDetail} />}

      {hasServices && visibleItems.length === 0 && (
        <EmptyState title={strings.EmptyFilterTitle} detail={strings.EmptyFilterDetail} />
      )}

      {visibleItems.length > 0 && (
        <>
          <ServiceList items={visibleItems} strings={strings} onSelectService={handleSelectService} />
          <Caption1 className={styles.count} role="status" aria-live="polite">
            {formatString(strings.ServiceCountLabel, visibleItems.length, response.items.length)}
          </Caption1>
        </>
      )}

      <OverlayDrawer
        className={styles.drawer}
        open={selectedService !== undefined}
        position="end"
        size="medium"
        onOpenChange={(_event, data) => {
          if (!data.open) {
            closeDrawer();
          }
        }}
      >
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <Button appearance="subtle" aria-label={strings.CloseButtonLabel} icon={<Dismiss24Regular />} onClick={closeDrawer} />
            }
          >
            {selectedIssue ? (
              <Button appearance="transparent" icon={<ArrowLeft20Regular />} onClick={() => setSelectedIssue(undefined)}>
                {strings.BackButtonLabel}
              </Button>
            ) : (
              selectedService?.service
            )}
          </DrawerHeaderTitle>
          {!selectedIssue && <Body1 className={styles.drawerSubtitle}>{strings.IssuesPanelSubtitle}</Body1>}
        </DrawerHeader>
        <DrawerBody>
          {selectedService && !selectedIssue && (
            <IssueList
              service={selectedService.service}
              issues={issuesResource.data || []}
              isLoading={issuesResource.isLoading}
              error={issuesResource.error ? toFriendlyErrorMessage(issuesResource.error, strings) : undefined}
              strings={strings}
              onSelectIssue={setSelectedIssue}
              onRetry={issuesResource.reload}
            />
          )}
          {selectedIssue && <IssueDetail issue={selectedIssue} strings={strings} />}
        </DrawerBody>
      </OverlayDrawer>
    </div>
  );
}
