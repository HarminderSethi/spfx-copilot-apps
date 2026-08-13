import type { IGraphExternalItem, IZavaHrSignalProperties } from '../models/graph';
import type {
  IZavaCalendarEvent,
  IZavaGroundingSource,
  IZavaHrSignal,
  IZavaMilestone,
  IZavaPerson,
  IZavaTimelineItem
} from '../models/zavaEmployee';
import type { IMockPersonRecord } from '../mockData/people';
import type {
  IResolvedEventRecord,
  IResolvedGroundingRecord,
  IResolvedMilestoneRecord,
  IResolvedTimelineRecord
} from './resolveMockData';

const findPersonById = (people: ReadonlyArray<IZavaPerson>, id: string): IZavaPerson | undefined =>
  people.find((person) => person.id === id);

const findPersonByEmail = (
  people: ReadonlyArray<IZavaPerson>,
  email: string
): IZavaPerson | undefined =>
  people.find((person) => person.email.toLowerCase() === email.toLowerCase());

export const mapPerson = (
  record: IMockPersonRecord,
  images: { [key: string]: string }
): IZavaPerson => ({
  id: record.profile.id,
  displayName: record.profile.displayName,
  firstName: record.profile.givenName,
  email: record.profile.mail,
  jobTitle: record.profile.jobTitle,
  department: record.profile.department,
  photoUrl: images[record.photoKey] || images.profilePlaceholder,
  relationship: record.relationship,
  skills: record.skills.slice()
});

export const mapGrounding = (record: IResolvedGroundingRecord): IZavaGroundingSource => ({
  id: record.id,
  title: record.title,
  sourceType: record.sourceType,
  reviewedAt: record.reviewedAt
});

export const mapSignal = (
  item: IGraphExternalItem<IZavaHrSignalProperties>,
  people: ReadonlyArray<IZavaPerson>,
  grounding: ReadonlyArray<IZavaGroundingSource>,
  images: { [key: string]: string }
): IZavaHrSignal => {
  const destination = {
    family: item.properties.family,
    route: item.properties.route,
    params: item.properties.routeParams
  };
  return {
    id: item.id,
    family: item.properties.family,
    title: item.properties.title,
    summary: item.content.value,
    status: item.properties.status,
    priority: item.properties.priority,
    dueAt: item.properties.dueDateTime ? new Date(item.properties.dueDateTime) : undefined,
    privacyLevel: item.properties.privacyLevel,
    destination,
    relatedPeople: item.properties.relatedPersonIds
      .map((id) => findPersonById(people, id))
      .filter((person): person is IZavaPerson => person !== undefined),
    imageUrl: item.properties.imageKey ? images[item.properties.imageKey] : undefined,
    grounding: item.properties.groundingIds
      .map((id) => grounding.find((source) => source.id === id))
      .filter((source): source is IZavaGroundingSource => source !== undefined),
    actions: [{ id: `${item.id}-open`, label: 'Open details', destination }]
  };
};

export const mapEvent = (
  record: IResolvedEventRecord,
  people: ReadonlyArray<IZavaPerson>
): IZavaCalendarEvent => {
  const fallback = people[0];
  const organizer =
    findPersonByEmail(people, record.event.organizer.emailAddress.address) || fallback;
  return {
    id: record.event.id,
    title: record.event.subject,
    summary: record.event.bodyPreview,
    start: new Date(record.event.start.dateTime),
    end: new Date(record.event.end.dateTime),
    isOnline: record.event.isOnlineMeeting,
    organizer,
    attendees: record.event.attendees
      .map((attendee) => findPersonByEmail(people, attendee.emailAddress.address))
      .filter((person): person is IZavaPerson => person !== undefined),
    destination: record.destination
  };
};

export const mapTimelineItem = (record: IResolvedTimelineRecord): IZavaTimelineItem => ({
  id: record.id,
  family: record.family,
  title: record.title,
  summary: record.summary,
  occursAt: record.occursAt,
  destination: record.destination
});

export const mapMilestone = (
  record: IResolvedMilestoneRecord,
  images: { [key: string]: string }
): IZavaMilestone => ({
  id: record.id,
  title: record.title,
  summary: record.summary,
  occursAt: record.occursAt,
  imageUrl: images[record.imageKey] || images.employeeMoments,
  destination: record.destination
});