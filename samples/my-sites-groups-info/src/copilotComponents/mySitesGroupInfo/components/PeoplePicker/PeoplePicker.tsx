import * as React from 'react';
import {
  Spinner,
  Tag,
  TagPicker,
  TagPickerControl,
  TagPickerGroup,
  TagPickerInput,
  TagPickerList,
  TagPickerOption,
  type TagPickerOnOptionSelectData
} from '@fluentui/react-components';
import { People24Regular } from '@fluentui/react-icons';
import type { IGroupPerson } from '../../services/SitesGroupInfoService';

export interface IPeoplePickerProps {
  selectedUsers: IGroupPerson[];
  suggestions: IGroupPerson[];
  query: string;
  isLoading: boolean;
  onQueryChange: (query: string) => void;
  onSelectedUsersChange: (users: IGroupPerson[]) => void;
}

export function PeoplePicker(props: Readonly<IPeoplePickerProps>): React.ReactElement {
  const selectedKeys = props.selectedUsers.map((user) => user.id);

  const handleSelect = (_event: Event | React.SyntheticEvent, data: TagPickerOnOptionSelectData): void => {
    const users = data.selectedOptions
      .map((key) => props.selectedUsers.find((user) => user.id === key) ?? props.suggestions.find((user) => user.id === key))
      .filter((user): user is IGroupPerson => Boolean(user));
    props.onSelectedUsersChange(users);
    props.onQueryChange('');
  };

  return (
    <TagPicker selectedOptions={selectedKeys} onOptionSelect={handleSelect}>
      <TagPickerControl secondaryAction={null} expandIcon={null}>
        <TagPickerGroup aria-label="Selected users">
          {props.selectedUsers.map((user) => (
            <Tag key={user.id} value={user.id} dismissible media={<People24Regular />}>
              {user.displayName}
            </Tag>
          ))}
        </TagPickerGroup>
        <TagPickerInput
          value={props.query}
          onChange={(event) => props.onQueryChange(event.currentTarget.value)}
          placeholder="Search users to add"
          aria-label="Search users to add"
        />
      </TagPickerControl>
      <TagPickerList aria-busy={props.isLoading}>
        {props.isLoading && <Spinner size="tiny" label="Searching users" />}
        {!props.isLoading &&
          props.suggestions.map((user) => (
            <TagPickerOption key={user.id} value={user.id} text={user.displayName}>
              {user.displayName}
              {user.email ? ` (${user.email})` : ''}
            </TagPickerOption>
          ))}
      </TagPickerList>
    </TagPicker>
  );
}
