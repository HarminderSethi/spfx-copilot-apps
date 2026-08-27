import type { HrPriority, PrivacyLevel, ZavaDestinationParameter } from './zavaEmployee';
import type { ZavaFamilyId } from './families';

export interface IGraphUser {
  id: string;
  displayName: string;
  givenName: string;
  mail: string;
  jobTitle?: string;
  department?: string;
  officeLocation?: string;
}

export interface IGraphDateTimeTimeZone {
  dateTime: string;
  timeZone: string;
}

export interface IGraphEmailAddress {
  name: string;
  address: string;
}

export interface IGraphRecipient {
  emailAddress: IGraphEmailAddress;
}

export interface IGraphEvent {
  id: string;
  subject: string;
  bodyPreview: string;
  start: IGraphDateTimeTimeZone;
  end: IGraphDateTimeTimeZone;
  organizer: IGraphRecipient;
  attendees: IGraphRecipient[];
  isOnlineMeeting: boolean;
}

export interface IGraphExternalItemContent {
  type: 'text';
  value: string;
}

export interface IZavaHrSignalProperties {
  family: ZavaFamilyId;
  title: string;
  status: string;
  priority: HrPriority;
  privacyLevel: PrivacyLevel;
  dueDateTime?: string;
  route: string;
  routeParams?: { [key: string]: ZavaDestinationParameter };
  relatedPersonIds: string[];
  imageKey?: string;
  groundingIds: string[];
}

export interface IGraphExternalItem<TProperties> {
  id: string;
  content: IGraphExternalItemContent;
  properties: TProperties;
}

export interface IZavaGroundingRecord {
  id: string;
  title: string;
  sourceType: 'mockPolicy' | 'mockHrSystem' | 'mockCalendar' | 'mockLearning' | 'mockPeople';
  reviewedOffsetDays?: number;
}