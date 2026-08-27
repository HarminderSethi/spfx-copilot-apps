import type { IGroupMembership, IGroupPerson, IResourceItem } from '../services/SitesGroupInfoService';

export interface IMySitesGroupInfoState {
  items: IResourceItem[];
  error?: string;
  isLoading: boolean;
  followedUrls: Set<string>;
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
  followingSiteId?: string;
}
