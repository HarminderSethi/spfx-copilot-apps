import * as React from 'react';
import {
  Button,
  Caption1,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  MessageBar,
  MessageBarBody,
  Spinner,
  Tab,
  TabList
} from '@fluentui/react-components';
import { Dismiss24Regular, PersonAdd24Regular } from '@fluentui/react-icons';
import type { IGroupMembership, IGroupPerson, IResourceItem } from '../../services/SitesGroupInfoService';
import { PeoplePicker } from '../PeoplePicker/PeoplePicker';
import { PersonRow } from '../PersonRow/PersonRow';

export interface IGroupMemberDrawerProps {
  selectedGroup?: IResourceItem;
  membership?: IGroupMembership;
  membershipError?: string;
  isMembershipLoading: boolean;
  selectedPeopleTab: 'owners' | 'members';
  selectedUsers: IGroupPerson[];
  peopleQuery: string;
  peopleSuggestions: IGroupPerson[];
  isPeopleLoading: boolean;
  isMemberSaving: boolean;
  onClose: () => void;
  onTabSelect: (tab: 'owners' | 'members') => void;
  onSearchPeople: (query: string) => void;
  onSelectedUsersChange: (users: IGroupPerson[]) => void;
  onAddMembers: () => void;
  onRemoveMember: (personId: string) => void;
  panelSectionClassName?: string;
  peopleListClassName?: string;
  personClassName?: string;
  personTextClassName?: string;
  memberActionsClassName?: string;
}

export function GroupMemberDrawer(props: Readonly<IGroupMemberDrawerProps>): React.ReactElement {
  const {
    selectedGroup,
    membership,
    membershipError,
    isMembershipLoading,
    selectedPeopleTab,
    selectedUsers,
    peopleQuery,
    peopleSuggestions,
    isPeopleLoading,
    isMemberSaving,
    onClose,
    onTabSelect,
    onSearchPeople,
    onSelectedUsersChange,
    onAddMembers,
    onRemoveMember,
    panelSectionClassName,
    peopleListClassName,
    personClassName,
    personTextClassName,
    memberActionsClassName
  } = props;

  const visiblePeople = selectedPeopleTab === 'owners' ? membership?.owners ?? [] : membership?.members ?? [];

  return (
    <Drawer
      type="overlay"
      position="end"
      size="medium"
      open={selectedGroup !== undefined}
      onOpenChange={(_, data) => {
        if (!data.open) onClose();
      }}
    >
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <Button
              appearance="subtle"
              icon={<Dismiss24Regular />}
              onClick={onClose}
              aria-label="Close group panel"
            />
          }
        >
          {selectedGroup?.title}
        </DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody>
        {membershipError && (
          <MessageBar intent="error">
            <MessageBarBody>{membershipError}</MessageBarBody>
          </MessageBar>
        )}
        {isMembershipLoading ? (
          <Spinner label="Loading group membership" />
        ) : (
          membership && (
            <>
              <TabList
                selectedValue={selectedPeopleTab}
                onTabSelect={(_, data) => onTabSelect(data.value as 'owners' | 'members')}
              >
                <Tab value="owners">Owners ({membership.owners.length})</Tab>
                <Tab value="members">Members ({membership.members.length})</Tab>
              </TabList>

              {selectedPeopleTab === 'members' && membership.canManageMembership && (
                <div className={memberActionsClassName}>
                  <PeoplePicker
                    selectedUsers={selectedUsers}
                    suggestions={peopleSuggestions}
                    query={peopleQuery}
                    isLoading={isPeopleLoading}
                    onQueryChange={onSearchPeople}
                    onSelectedUsersChange={onSelectedUsersChange}
                  />
                  <Button
                    appearance="primary"
                    icon={<PersonAdd24Regular />}
                    onClick={onAddMembers}
                    disabled={isMemberSaving || selectedUsers.length === 0}
                  >
                    Add members
                  </Button>
                </div>
              )}

              <div className={panelSectionClassName}>
                <div className={peopleListClassName}>
                  {visiblePeople.map((person) => (
                    <PersonRow
                      key={person.id}
                      person={person}
                      personClassName={personClassName}
                      personTextClassName={personTextClassName}
                      canRemove={selectedPeopleTab === 'members' && membership.canManageMembership}
                      onRemove={() => onRemoveMember(person.id)}
                    />
                  ))}
                </div>
              </div>

              {!membership.canManageMembership && (
                <Caption1>You can view membership, but only group owners can add or remove members.</Caption1>
              )}
            </>
          )
        )}
      </DrawerBody>
    </Drawer>
  );
}
