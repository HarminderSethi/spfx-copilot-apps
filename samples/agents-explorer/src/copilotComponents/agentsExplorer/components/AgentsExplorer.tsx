import * as React from 'react';
import {
  FluentProvider,
  IdPrefixProvider,
  webLightTheme,
  webDarkTheme,
  Title3,
  Caption1,
  Text,
  Badge,
  Avatar,
  Card,
  CardHeader,
  Input,
  ToggleButton,
  Button,
  MessageBar,
  MessageBarBody,
  Tooltip,
  makeStyles,
  tokens
} from '@fluentui/react-components';
import { Search24Regular, BotRegular, ArrowExpandRegular, ArrowMinimizeRegular } from '@fluentui/react-icons';

import type { ICopilotAgent } from '../../../services/AgentsExplorerService';
import type { IAgentsExplorerProps } from './IAgentsExplorerProps';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingHorizontalM
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalM
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS
  },
  titleGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalS
  },
  filters: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: tokens.spacingHorizontalM
  },
  cardIcon: {
    width: '36px',
    height: '36px',
    borderRadius: tokens.borderRadiusMedium,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    flexShrink: 0
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `0 ${tokens.spacingHorizontalM} ${tokens.spacingVerticalM}`
  }
});

function normalize(value?: string): string {
  return (value ?? '').trim().toLowerCase();
}

function toReadableDate(dateValue?: string): string {
  if (!dateValue) {
    return 'N/A';
  }
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return 'N/A';
  }
  return parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}

function getAgentIconUrl(agent: ICopilotAgent): string | undefined {
  const icon = (agent.iconBase64 ?? '').trim();
  if (!icon) {
    return undefined;
  }
  return icon.startsWith('data:') ? icon : `data:image/png;base64,${icon}`;
}

function getStudioUrl(agent: ICopilotAgent): string | undefined {
  if (!agent.environmentId || !agent.cdsBotId) {
    return undefined;
  }
  return `https://copilotstudio.microsoft.com/environments/${encodeURIComponent(agent.environmentId)}/bots/${encodeURIComponent(agent.cdsBotId)}`;
}

/**
 * Main React UI for the Agents Explorer Copilot Component. Lists the Copilot
 * Agents (Dataverse bots) fetched by `AgentsExplorerCopilotComponent.onInit`,
 * with client-side search and ownership filtering. Selecting a card opens the
 * agent in Copilot Studio through the host bridge (`bridge.openLinkAsync`),
 * since components run inside a sandboxed iframe with no direct DOM access
 * to the host window.
 */
export default function AgentsExplorer(props: IAgentsExplorerProps): React.ReactElement {
  const { userDisplayName, agents, errorMessage, hostContext, bridge, onRequestDisplayMode, strings } = props;
  const styles = useStyles();

  const [searchText, setSearchText] = React.useState<string>(props.searchText ?? '');
  const [ownershipFilter, setOwnershipFilter] = React.useState<'all' | 'my' | 'shared'>(props.ownershipFilter ?? 'all');
  const [isExpanded, setIsExpanded] = React.useState<boolean>(hostContext.displayMode === 'fullscreen');

  const theme = hostContext.theme === 'dark' ? webDarkTheme : webLightTheme;

  const handleToggleExpand = React.useCallback(async (): Promise<void> => {
    await onRequestDisplayMode(isExpanded ? 'inline' : 'fullscreen');
    setIsExpanded(!isExpanded);
  }, [onRequestDisplayMode, isExpanded]);

  const handleOpenAgent = React.useCallback(
    async (agent: ICopilotAgent): Promise<void> => {
      const studioUrl = getStudioUrl(agent);
      if (studioUrl) {
        await bridge.openLinkAsync(studioUrl);
      }
    },
    [bridge]
  );

  const filteredAgents = React.useMemo(() => {
    const searchLower = searchText.toLowerCase();
    const currentUser = normalize(userDisplayName);

    return agents.filter((agent) => {
      const matchesSearch =
        !searchText ||
        agent.name.toLowerCase().includes(searchLower) ||
        (agent.owner ?? '').toLowerCase().includes(searchLower) ||
        (agent.schemaName ?? '').toLowerCase().includes(searchLower);

      const isOwnedByCurrentUser = !!currentUser && normalize(agent.owner) === currentUser;
      const matchesOwnership =
        ownershipFilter === 'all' ||
        (ownershipFilter === 'my' && isOwnedByCurrentUser) ||
        (ownershipFilter === 'shared' && !isOwnedByCurrentUser);

      return matchesSearch && matchesOwnership;
    });
  }, [agents, searchText, ownershipFilter, userDisplayName]);

  const renderCard = (agent: ICopilotAgent): React.ReactElement => {
    const iconUrl = getAgentIconUrl(agent);
    const isPublished = !!agent.publishedOn;
    const lastModified = toReadableDate(agent.botModifiedOn ?? agent.createdOn);

    return (
      <Card key={agent.cdsBotId} onClick={() => handleOpenAgent(agent)} style={{ cursor: 'pointer' }}>
        <CardHeader
          image={
            <div className={styles.cardIcon}>
              {iconUrl ? <img src={iconUrl} width={24} height={24} alt="" /> : <BotRegular fontSize={20} />}
            </div>
          }
          header={<Text weight="semibold">{agent.name || strings.UntitledAgentLabel}</Text>}
          description={
            <div className={styles.titleRow}>
              <Avatar name={agent.owner || strings.UnknownOwnerLabel} size={20} />
              <Caption1>{agent.owner || strings.UnknownOwnerLabel}</Caption1>
            </div>
          }
        />
        <div className={styles.cardFooter}>
          <Caption1>
            {strings.LastModifiedLabel} {lastModified}
          </Caption1>
          <Badge appearance="tint" color={isPublished ? 'success' : 'warning'}>
            {isPublished ? strings.PublishedLabel : strings.NotPublishedLabel}
          </Badge>
        </div>
      </Card>
    );
  };

  return (
    <IdPrefixProvider value="agents-explorer-">
      <FluentProvider theme={theme} targetDocument={props.targetDocument} style={{ minHeight: '100%' }}>
        <div className={styles.root}>
          <div className={styles.header}>
            <div className={styles.titleGroup}>
              <div className={styles.titleRow}>
                <BotRegular fontSize={24} />
                <Title3>{strings.Title}</Title3>
              </div>
              <Caption1>
                {strings.SubtitlePrefix} • {agents.length}
              </Caption1>
            </div>
            <Tooltip content={isExpanded ? strings.CompactLabel : strings.ExpandLabel} relationship="label">
              <Button
                appearance="subtle"
                icon={isExpanded ? <ArrowMinimizeRegular /> : <ArrowExpandRegular />}
                onClick={() => handleToggleExpand()}
              />
            </Tooltip>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.filters}>
              <ToggleButton checked={ownershipFilter === 'all'} onClick={() => setOwnershipFilter('all')}>
                {strings.FilterAllLabel}
              </ToggleButton>
              <ToggleButton checked={ownershipFilter === 'my'} onClick={() => setOwnershipFilter('my')}>
                {strings.FilterMyLabel}
              </ToggleButton>
              <ToggleButton checked={ownershipFilter === 'shared'} onClick={() => setOwnershipFilter('shared')}>
                {strings.FilterSharedLabel}
              </ToggleButton>
            </div>
            <Input
              contentBefore={<Search24Regular fontSize={16} />}
              placeholder={strings.SearchPlaceholder}
              value={searchText}
              onChange={(_, data) => setSearchText(data.value)}
            />
          </div>

          {errorMessage ? (
            <MessageBar intent="error">
              <MessageBarBody>{errorMessage}</MessageBarBody>
            </MessageBar>
          ) : filteredAgents.length === 0 ? (
            <MessageBar intent="info">
              <MessageBarBody>{strings.NoAgentsMessage}</MessageBarBody>
            </MessageBar>
          ) : (
            <div className={styles.grid}>{filteredAgents.map((agent) => renderCard(agent))}</div>
          )}
        </div>
      </FluentProvider>
    </IdPrefixProvider>
  );
}
