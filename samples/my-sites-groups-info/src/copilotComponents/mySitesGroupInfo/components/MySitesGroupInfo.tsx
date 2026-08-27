import * as React from 'react';
import {
  FluentProvider,
  IdPrefixProvider,
  MessageBar,
  MessageBarBody,
  makeStyles,
  tokens,
  webLightTheme
} from '@fluentui/react-components';
import { Globe24Regular, Group24Regular } from '@fluentui/react-icons';
import type { IGroupPerson, IResourceItem } from '../services/SitesGroupInfoService';
import type { IMySitesGroupInfoProps } from './IMySitesGroupInfoProps';
import type { IMySitesGroupInfoState } from './IMySitesGroupInfoState';
import { GroupMemberDrawer } from './GroupMemberDrawer/GroupMemberDrawer';
import { ResourceHeader } from './ResourceHeader/ResourceHeader';
import { ResourceList } from './ResourceList/ResourceList';

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalM, padding: tokens.spacingHorizontalM, width: '100%', minHeight: '100%', boxSizing: 'border-box', maxWidth: '900px' },
  expandedRoot: { maxWidth: 'none', minHeight: '100vh', height: '100vh', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: tokens.spacingHorizontalM },
  intro: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXS },
  list: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXS, marginTop: tokens.spacingVerticalM },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: tokens.spacingHorizontalM, padding: tokens.spacingVerticalS, borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
  itemText: { minWidth: 0, display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXXS },
  itemTitle: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  count: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalXS, color: tokens.colorNeutralForeground2 },
  panelSection: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS, marginTop: tokens.spacingVerticalM },
  peopleList: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS },
  person: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: tokens.spacingHorizontalS, padding: tokens.spacingVerticalS, borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
  personText: { display: 'flex', flexDirection: 'column', minWidth: 0 },
  memberActions: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS, marginTop: tokens.spacingVerticalS }
});

export default function MySitesGroupInfo(props: Readonly<IMySitesGroupInfoProps>): React.ReactElement {
  const styles = useStyles();
  const resourceQuery = props.query?.trim();
  const autoOpenedResource = React.useRef<string>();
  const [state, setState] = React.useState<IMySitesGroupInfoState>({
    items: [],
    error: undefined,
    isLoading: true,
    followedUrls: new Set<string>(),
    selectedGroup: undefined,
    membership: undefined,
    membershipError: undefined,
    isMembershipLoading: false,
    selectedPeopleTab: 'members',
    selectedUsers: [],
    peopleQuery: '',
    peopleSuggestions: [],
    isPeopleLoading: false,
    isMemberSaving: false
  });

  const updateState = React.useCallback((patch: Partial<IMySitesGroupInfoState>) => {
    setState((prevState) => ({ ...prevState, ...patch }));
  }, []);

  const sectionTitle = props.target === 'm365_groups'
    ? 'Groups having access'
    : props.target === 'accessed_sites'
    ? 'Sites having access'
    : 'Followed sites';

  const sectionIcon = props.target === 'm365_groups' ? <Group24Regular /> : <Globe24Regular />;

  const loadData = React.useCallback(async (): Promise<void> => {
    updateState({ isLoading: true, error: undefined });
    try {
      if (props.target === 'm365_groups') {
        const items = await props.service.getGroupsHavingAccess(props.top, resourceQuery);
        updateState({ items, isLoading: false });
      } else if (props.target === 'accessed_sites') {
        const [items, followedUrls] = await Promise.all([
          props.service.getSitesHavingAccess(props.top, resourceQuery),
          props.service.getFollowedSiteUrls()
        ]);
        updateState({ items, followedUrls, isLoading: false });
      } else {
        const items = await props.service.getFollowedSites(props.top, resourceQuery);
        const followedUrls = new Set(items.map((site) => normalizeUrl(site.url)));
        updateState({ items, followedUrls, isLoading: false });
      }
    } catch (loadError) {
      updateState({
        error: loadError instanceof Error ? loadError.message : 'Unable to load your sites and groups.',
        isLoading: false
      });
    }
  }, [props.service, props.target, props.top, resourceQuery, updateState]);

  React.useEffect(() => {
    loadData().catch(() => undefined);
  }, [loadData]);

  React.useEffect(() => {
    if (props.hostContext.displayMode !== 'fullscreen' || !props.targetDocument) return;
    const view = props.targetDocument.defaultView;
    const documentElement = props.targetDocument.documentElement;
    const width = Math.max(
      props.hostContext.containerDimensions?.maxWidth ?? 0,
      view?.innerWidth ?? 0,
      props.hostContext.containerDimensions?.width ?? 0,
      view?.screen?.availWidth ?? 0,
      documentElement?.clientWidth ?? 0,
      documentElement?.scrollWidth ?? 0
    );
    const height = Math.max(
      props.hostContext.containerDimensions?.maxHeight ?? 0,
      view?.innerHeight ?? 0,
      props.hostContext.containerDimensions?.height ?? 0,
      view?.screen?.availHeight ?? 0,
      documentElement?.clientHeight ?? 0,
      documentElement?.scrollHeight ?? 0
    );
    if (width > 0 && height > 0) {
      props.onRequestSizeChange(width, height).catch(() => undefined);
    }
  }, [props.hostContext.containerDimensions, props.hostContext.displayMode, props.onRequestSizeChange, props.targetDocument]);

  const toggleFollow = React.useCallback(
    async (site: IResourceItem): Promise<void> => {
      if (!site.url) return;
      const normalizedUrl = normalizeUrl(site.url);
      const isFollowed = state.followedUrls.has(normalizedUrl);
      updateState({ error: undefined, followingSiteId: site.id });
      try {
        if (isFollowed) {
          await props.service.unfollowSite(site.url);
          const nextFollowedUrls = without(state.followedUrls, normalizedUrl);
          if (props.target === 'followed_sites') {
            updateState({
              followedUrls: nextFollowedUrls,
              items: state.items.filter((item) => item.id !== site.id)
            });
          } else {
            updateState({ followedUrls: nextFollowedUrls });
          }
        } else {
          await props.service.followSite(site.url);
          const nextFollowedUrls = new Set(state.followedUrls).add(normalizedUrl);
          updateState({ followedUrls: nextFollowedUrls });
        }
      } catch (actionError) {
        updateState({ error: actionError instanceof Error ? actionError.message : 'Unable to update followed sites.' });
      } finally {
        updateState({ followingSiteId: undefined });
      }
    },
    [props.service, props.target, state.followedUrls, state.items, updateState]
  );

  const openGroup = React.useCallback(
    async (group: IResourceItem): Promise<void> => {
      updateState({
        selectedGroup: group,
        membership: undefined,
        membershipError: undefined,
        selectedPeopleTab: 'members',
        selectedUsers: [],
        peopleQuery: '',
        peopleSuggestions: [],
        isMembershipLoading: true
      });
      try {
        const membership = await props.service.getGroupMembership(group.id);
        updateState({ membership, isMembershipLoading: false });
      } catch (loadError) {
        updateState({
          membershipError: loadError instanceof Error ? loadError.message : 'Unable to load group membership.',
          isMembershipLoading: false
        });
      }
    },
    [props.service, updateState]
  );

  React.useEffect(() => {
    if (props.target !== 'm365_groups' || !resourceQuery || state.isLoading || state.items.length !== 1 || state.selectedGroup) return;
    const resource = state.items[0];
    const normalizedQuery = resourceQuery.toLowerCase();
    const matchesQuery = [resource.id, resource.title, resource.description, resource.url]
      .some((value) => value?.toLowerCase().includes(normalizedQuery));
    if (!matchesQuery) return;
    const resourceKey = `${props.target}:${normalizedQuery}`;
    if (autoOpenedResource.current === resourceKey) return;
    autoOpenedResource.current = resourceKey;
    openGroup(resource).catch(() => undefined);
  }, [openGroup, props.target, resourceQuery, state.isLoading, state.items, state.selectedGroup]);

  const closeGroup = React.useCallback(() => {
    updateState({
      selectedGroup: undefined,
      membership: undefined,
      selectedUsers: [],
      peopleQuery: '',
      peopleSuggestions: []
    });
  }, [updateState]);

  const searchPeople = React.useCallback(
    async (query: string): Promise<void> => {
      updateState({ peopleQuery: query });
      if (!query.trim() || !state.membership?.canManageMembership) {
        updateState({ peopleSuggestions: [] });
        return;
      }
      updateState({ isPeopleLoading: true });
      try {
        const suggestions = await props.service.searchUsers(query);
        updateState({ peopleSuggestions: suggestions, isPeopleLoading: false });
      } catch (searchError) {
        updateState({
          membershipError: searchError instanceof Error ? searchError.message : 'Unable to search users.',
          isPeopleLoading: false
        });
      }
    },
    [props.service, state.membership?.canManageMembership, updateState]
  );

  const addMembers = React.useCallback(async (): Promise<void> => {
    if (!state.selectedGroup || state.selectedUsers.length === 0 || !state.membership?.canManageMembership) return;
    updateState({ isMemberSaving: true, membershipError: undefined });
    try {
      await Promise.all(
        state.selectedUsers.map((person) => props.service.addGroupMember(state.selectedGroup!.id, person.email ?? person.id))
      );
      const updatedMembership = await props.service.getGroupMembership(state.selectedGroup.id);
      updateState({
        selectedUsers: [],
        peopleQuery: '',
        peopleSuggestions: [],
        membership: updatedMembership,
        isMemberSaving: false
      });
    } catch (actionError) {
      updateState({
        membershipError: actionError instanceof Error ? actionError.message : 'Unable to add group members.',
        isMemberSaving: false
      });
    }
  }, [props.service, state.membership?.canManageMembership, state.selectedGroup, state.selectedUsers, updateState]);

  const removeMember = React.useCallback(
    async (personId: string): Promise<void> => {
      if (!state.selectedGroup || !state.membership?.canManageMembership) return;
      updateState({ isMemberSaving: true, membershipError: undefined });
      try {
        await props.service.removeGroupMember(state.selectedGroup.id, personId);
        const updatedMembership = await props.service.getGroupMembership(state.selectedGroup.id);
        updateState({ membership: updatedMembership, isMemberSaving: false });
      } catch (actionError) {
        updateState({
          membershipError: actionError instanceof Error ? actionError.message : 'Unable to remove group member.',
          isMemberSaving: false
        });
      }
    },
    [props.service, state.membership?.canManageMembership, state.selectedGroup, updateState]
  );

  const handleSelectedUsersChange = React.useCallback(
    (users: IGroupPerson[]) => {
      updateState({ selectedUsers: users });
    },
    [updateState]
  );

  const handleTabSelect = React.useCallback(
    (tab: 'owners' | 'members') => {
      updateState({ selectedPeopleTab: tab, selectedUsers: [] });
    },
    [updateState]
  );

 



  return (
    <IdPrefixProvider value="my-sites-groups-info-">
      <FluentProvider
        theme={webLightTheme}
        targetDocument={props.targetDocument}
        style={{ minHeight: '100%', height: props.hostContext.displayMode === 'fullscreen' ? '100%' : undefined }}
      >
        <div className={props.hostContext.displayMode === 'fullscreen' ? `${styles.root} ${styles.expandedRoot}` : styles.root}>
          <ResourceHeader
            title={sectionTitle}
            isLoading={state.isLoading}
            isExpanded={props.hostContext.displayMode === "fullscreen"}
            onRefresh={() => {
              loadData().catch(() => undefined);
            }}
            onToggleExpand={() => props.onRequestDisplayModeChange(props.hostContext.displayMode === "fullscreen" ? "inline" : "fullscreen")}
            headerClassName={styles.header}
            introClassName={styles.intro}
          />
          {state.error && (
            <MessageBar intent="error">
              <MessageBarBody>{state.error}</MessageBarBody>
            </MessageBar>
          )}
          <ResourceList
            items={state.items}
            isLoading={state.isLoading}
            target={props.target}
            sectionIcon={sectionIcon}
            followedUrls={state.followedUrls}
            followingSiteId={state.followingSiteId}
            onToggleFollow={(item) => {
              toggleFollow(item).catch(() => undefined);
            }}
            onOpenGroup={(group) => {
              openGroup(group).catch(() => undefined);
            }}
            listClassName={styles.list}
            countClassName={styles.count}
            itemClassName={styles.item}
            itemTextClassName={styles.itemText}
            itemTitleClassName={styles.itemTitle}
          />
        </div>

        <GroupMemberDrawer
          selectedGroup={state.selectedGroup}
          membership={state.membership}
          membershipError={state.membershipError}
          isMembershipLoading={state.isMembershipLoading}
          selectedPeopleTab={state.selectedPeopleTab}
          selectedUsers={state.selectedUsers}
          peopleQuery={state.peopleQuery}
          peopleSuggestions={state.peopleSuggestions}
          isPeopleLoading={state.isPeopleLoading}
          isMemberSaving={state.isMemberSaving}
          onClose={closeGroup}
          onTabSelect={handleTabSelect}
          onSearchPeople={(query) => {
            searchPeople(query).catch(() => undefined);
          }}
          onSelectedUsersChange={handleSelectedUsersChange}
          onAddMembers={() => {
            addMembers().catch(() => undefined);
          }}
          onRemoveMember={(personId) => {
            removeMember(personId).catch(() => undefined);
          }}
          panelSectionClassName={styles.panelSection}
          peopleListClassName={styles.peopleList}
          personClassName={styles.person}
          personTextClassName={styles.personText}
          memberActionsClassName={styles.memberActions}
        />
      </FluentProvider>
    </IdPrefixProvider>
  );
}

function normalizeUrl(url: string | undefined): string {
  return (url ?? '').replace(/\/$/, '').toLowerCase();
}

function without(values: Set<string>, value: string): Set<string> {
  return new Set(Array.from(values).filter((item) => item !== value));
}
