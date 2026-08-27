import type {
  IGraphEvent,
  IGraphExternalItem,
  IZavaGroundingRecord,
  IZavaHrSignalProperties
} from '../models/graph';
import type {
  IMockEventSeed,
  IMockHrSignalSeed,
  IMockMilestoneSeed,
  IMockTimelineSeed
} from '../models/seeds';
import type { IZavaDestination } from '../models/zavaEmployee';

const MINUTE_MS = 60 * 1000;
const DAY_MS = 24 * 60 * MINUTE_MS;

const addMinutes = (date: Date, minutes: number): Date =>
  new Date(date.getTime() + minutes * MINUTE_MS);

const addDays = (date: Date, days: number): Date =>
  new Date(date.getTime() + days * DAY_MS);

export interface IResolvedEventRecord {
  event: IGraphEvent;
  destination: IZavaDestination;
}

export interface IResolvedTimelineRecord extends Omit<IMockTimelineSeed, 'occursOffsetMin'> {
  occursAt: Date;
}

export interface IResolvedMilestoneRecord extends Omit<IMockMilestoneSeed, 'occursOffsetDays'> {
  occursAt: Date;
}

export interface IResolvedGroundingRecord extends Omit<IZavaGroundingRecord, 'reviewedOffsetDays'> {
  reviewedAt?: Date;
}

export const resolveHrSignals = (
  seeds: ReadonlyArray<IMockHrSignalSeed>,
  now: Date
): Array<IGraphExternalItem<IZavaHrSignalProperties>> =>
  seeds.map((seed) => {
    const { dueOffsetMin, ...properties } = seed.properties;
    return {
      id: seed.id,
      content: seed.content,
      properties: {
        ...properties,
        dueDateTime: dueOffsetMin === undefined ? undefined : addMinutes(now, dueOffsetMin).toISOString()
      }
    };
  });

export const resolveEvents = (
  seeds: ReadonlyArray<IMockEventSeed>,
  now: Date
): IResolvedEventRecord[] =>
  seeds.map((seed) => {
    const start = addMinutes(now, seed.startOffsetMin);
    const end = addMinutes(start, seed.durationMin);
    return {
      destination: seed.destination,
      event: {
        id: seed.id,
        subject: seed.subject,
        bodyPreview: seed.bodyPreview,
        start: { dateTime: start.toISOString(), timeZone: seed.timeZone },
        end: { dateTime: end.toISOString(), timeZone: seed.timeZone },
        organizer: seed.organizer,
        attendees: seed.attendees,
        isOnlineMeeting: seed.isOnlineMeeting
      }
    };
  });

export const resolveTimeline = (
  seeds: ReadonlyArray<IMockTimelineSeed>,
  now: Date
): IResolvedTimelineRecord[] =>
  seeds.map(({ occursOffsetMin, ...seed }) => ({
    ...seed,
    occursAt: addMinutes(now, occursOffsetMin)
  }));

export const resolveMilestones = (
  seeds: ReadonlyArray<IMockMilestoneSeed>,
  now: Date
): IResolvedMilestoneRecord[] =>
  seeds.map(({ occursOffsetDays, ...seed }) => ({
    ...seed,
    occursAt: addDays(now, occursOffsetDays)
  }));

export const resolveGrounding = (
  records: ReadonlyArray<IZavaGroundingRecord>,
  now: Date
): IResolvedGroundingRecord[] =>
  records.map(({ reviewedOffsetDays, ...record }) => ({
    ...record,
    reviewedAt: reviewedOffsetDays === undefined ? undefined : addDays(now, reviewedOffsetDays)
  }));