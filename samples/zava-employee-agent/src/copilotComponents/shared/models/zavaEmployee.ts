import type { ZavaFamilyId } from './families';

export type HrPriority = 'critical' | 'high' | 'normal' | 'optional';
export type PrivacyLevel = 'standard' | 'private' | 'sensitive';
export type ZavaCurrency = 'EUR' | 'USD' | 'GBP';
export type ZavaJurisdiction = 'FI' | 'SE' | 'US';
export type HomePanelId = 'actions' | 'timeline' | 'snapshot' | 'learning' | 'people' | 'milestone';

export type ZavaDestinationParameter = string | number | boolean | string[];

export interface IZavaDestination {
  family: ZavaFamilyId;
  route: string;
  params?: { [key: string]: ZavaDestinationParameter };
}

export interface IZavaUser {
  id: string;
  displayName: string;
  firstName: string;
  email: string;
  jobTitle?: string;
  department?: string;
  photoUrl: string;
}

export interface IZavaPerson extends IZavaUser {
  relationship: 'self' | 'manager' | 'hrPartner' | 'collaborator' | 'expert';
  skills: string[];
}

export interface IZavaMetric {
  id: string;
  label: string;
  value: string;
  intent: 'neutral' | 'positive' | 'attention' | 'critical';
  destination?: IZavaDestination;
}

export interface IZavaGroundingSource {
  id: string;
  title: string;
  sourceType: 'mockPolicy' | 'mockHrSystem' | 'mockCalendar' | 'mockLearning' | 'mockPeople';
  reviewedAt?: Date;
}

export interface IZavaAction {
  id: string;
  label: string;
  destination: IZavaDestination;
}

export interface IZavaHrSignal {
  id: string;
  family: ZavaFamilyId;
  title: string;
  summary: string;
  status: string;
  priority: HrPriority;
  dueAt?: Date;
  privacyLevel: PrivacyLevel;
  destination: IZavaDestination;
  relatedPeople: IZavaPerson[];
  imageUrl?: string;
  grounding: IZavaGroundingSource[];
  actions: IZavaAction[];
}

export interface IZavaTimelineItem {
  id: string;
  family: ZavaFamilyId;
  title: string;
  summary: string;
  occursAt: Date;
  destination: IZavaDestination;
}

export interface IZavaCalendarEvent {
  id: string;
  title: string;
  summary: string;
  start: Date;
  end: Date;
  isOnline: boolean;
  organizer: IZavaPerson;
  attendees: IZavaPerson[];
  destination: IZavaDestination;
}

export interface IZavaMilestone {
  id: string;
  title: string;
  summary: string;
  occursAt: Date;
  imageUrl: string;
  destination: IZavaDestination;
}

export interface IZavaEmployeeExperience {
  user: IZavaUser;
  people: IZavaPerson[];
  metrics: IZavaMetric[];
  signals: IZavaHrSignal[];
  events: IZavaCalendarEvent[];
  timeline: IZavaTimelineItem[];
  milestones: IZavaMilestone[];
  media: { [key: string]: string };
}

export interface IZavaSettings {
  currency: ZavaCurrency;
  jurisdiction: ZavaJurisdiction;
  privacyLevel: PrivacyLevel;
  visibleHomePanels: HomePanelId[];
}