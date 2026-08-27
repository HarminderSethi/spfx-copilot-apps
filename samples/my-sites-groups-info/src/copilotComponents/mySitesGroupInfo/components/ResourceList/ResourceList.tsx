import * as React from 'react';
import { Body1, Caption1, List, ListItem, Spinner } from '@fluentui/react-components';
import type { IResourceItem } from '../../services/SitesGroupInfoService';
import { ResourceItemRow } from '../ResourceItemRow/ResourceItemRow';

export interface IResourceListProps {
  items: IResourceItem[];
  isLoading: boolean;
  target: 'm365_groups' | 'accessed_sites' | 'followed_sites';
  sectionIcon: React.ReactNode;
  followedUrls: Set<string>;
  followingSiteId?: string;
  onToggleFollow: (item: IResourceItem) => void;
  onOpenGroup: (group: IResourceItem) => void;
  listClassName?: string;
  countClassName?: string;
  itemClassName?: string;
  itemTextClassName?: string;
  itemTitleClassName?: string;
}

function normalizeUrl(url: string | undefined): string {
  return (url ?? '').replace(/\/$/, '').toLowerCase();
}

export function ResourceList(props: Readonly<IResourceListProps>): React.ReactElement {
  const {
    items,
    isLoading,
    target,
    sectionIcon,
    followedUrls,
    followingSiteId,
    onToggleFollow,
    onOpenGroup,
    listClassName,
    countClassName,
    itemClassName,
    itemTextClassName,
    itemTitleClassName
  } = props;

  if (isLoading) {
    return <Spinner label="Loading resources" />;
  }

  return (
    <div className={listClassName}>
      <Caption1 className={countClassName}>
        {sectionIcon} {items.length} resources
      </Caption1>
      {items.length === 0 ? (
        <Body1>No resources found.</Body1>
      ) : (
        <List>
          {items.map((item) => {
            const isFollowed = item.url ? followedUrls.has(normalizeUrl(item.url)) : false;
            const isFollowing = followingSiteId === item.id;
            return (
              <ListItem key={`${item.source}-${item.id}`}>
                <ResourceItemRow
                  item={item}
                  target={target}
                  isFollowed={isFollowed}
                  isFollowing={isFollowing}
                  onToggleFollow={onToggleFollow}
                  onOpenGroup={onOpenGroup}
                  itemClassName={itemClassName}
                  itemTextClassName={itemTextClassName}
                  itemTitleClassName={itemTitleClassName}
                />
              </ListItem>
            );
          })}
        </List>
      )}
    </div>
  );
}
