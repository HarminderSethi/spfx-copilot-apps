import * as React from 'react';
import { Body1, Button, Caption1, Spinner } from '@fluentui/react-components';
import { Open24Regular, People24Regular, Star24Filled, Star24Regular } from '@fluentui/react-icons';
import type { IResourceItem } from '../../services/SitesGroupInfoService';

export interface IResourceItemRowProps {
  item: IResourceItem;
  target: 'm365_groups' | 'accessed_sites' | 'followed_sites';
  isFollowed: boolean;
  isFollowing?: boolean;
  onToggleFollow: (item: IResourceItem) => void;
  onOpenGroup: (group: IResourceItem) => void;
  itemClassName?: string;
  itemTextClassName?: string;
  itemTitleClassName?: string;
}

export function ResourceItemRow(props: Readonly<IResourceItemRowProps>): React.ReactElement {
  const { item, target, isFollowed, isFollowing, onToggleFollow, onOpenGroup } = props;

  return (
    <div className={props.itemClassName}>
      <div className={props.itemTextClassName}>
        <Body1 className={props.itemTitleClassName}>{item.title}</Body1>
        {item.description && <Caption1>{item.description}</Caption1>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {item.url && (
          <Button
            as="a"
            href={item.url}
            target="_blank"
            rel="noreferrer"
            appearance="subtle"
            icon={<Open24Regular />}
            aria-label={`Open ${item.title}`}
          />
        )}
        {target !== 'm365_groups' && item.url && (
          isFollowing ? (
            <Button appearance="subtle" icon={<Spinner size="tiny" />} disabled aria-label={`Updating ${item.title}`} />
          ) : (
            <Button
              appearance="subtle"
              icon={isFollowed ? <Star24Filled /> : <Star24Regular />}
              onClick={() => onToggleFollow(item)}
              aria-label={isFollowed ? `Unfollow ${item.title}` : `Follow ${item.title}`}
            />
          )
        )}
        {target === 'm365_groups' && (
          <Button
            appearance="subtle"
            icon={<People24Regular />}
            onClick={() => onOpenGroup(item)}
            aria-label={`Open members of ${item.title}`}
          />
        )}
      </div>
    </div>
  );
}
