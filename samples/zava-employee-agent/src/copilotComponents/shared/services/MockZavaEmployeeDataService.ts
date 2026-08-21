import {
  embeddedImages,
  mockEvents,
  mockGrounding,
  mockHrSignals,
  mockMilestones,
  mockPeople,
  mockTimeline
} from '../mockData';
import type {
  HrPriority,
  IZavaEmployeeExperience,
  IZavaHrSignal,
  IZavaMetric
} from '../models/zavaEmployee';
import type { IZavaEmployeeDataService } from './IZavaEmployeeDataService';
import { mapEvent, mapGrounding, mapMilestone, mapPerson, mapSignal, mapTimelineItem } from './mappers';
import {
  resolveEvents,
  resolveGrounding,
  resolveHrSignals,
  resolveMilestones,
  resolveTimeline
} from './resolveMockData';

const priorityRank: { [priority in HrPriority]: number } = {
  critical: 0,
  high: 1,
  normal: 2,
  optional: 3
};

const sortSignals = (left: IZavaHrSignal, right: IZavaHrSignal): number => {
  const priorityDifference = priorityRank[left.priority] - priorityRank[right.priority];
  if (priorityDifference !== 0) {
    return priorityDifference;
  }
  return (left.dueAt?.getTime() ?? Number.MAX_VALUE) -
    (right.dueAt?.getTime() ?? Number.MAX_VALUE);
};

const buildMetrics = (signals: ReadonlyArray<IZavaHrSignal>, now: Date): IZavaMetric[] => {
  const sevenDaysFromNow = now.getTime() + 7 * 24 * 60 * 60 * 1000;
  const openActions = signals.filter(
    (signal) => signal.priority === 'critical' || signal.priority === 'high'
  ).length;
  const dueThisWeek = signals.filter(
    (signal) => signal.dueAt && signal.dueAt.getTime() <= sevenDaysFromNow
  ).length;
  const nextDue = signals
    .filter((signal) => signal.dueAt && signal.dueAt.getTime() >= now.getTime())
    .sort((left, right) => (left.dueAt?.getTime() ?? 0) - (right.dueAt?.getTime() ?? 0))[0];

  return [
    { id: 'open-actions', label: 'Open actions', value: String(openActions), intent: 'attention' },
    { id: 'due-this-week', label: 'Due this week', value: String(dueThisWeek), intent: 'critical' },
    { id: 'profile-complete', label: 'Profile complete', value: '86%', intent: 'positive', destination: { family: 'home', route: 'profile' } },
    {
      id: 'next-important-date',
      label: 'Next important date',
      value: nextDue?.dueAt?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) || 'All clear',
      intent: 'neutral',
      destination: nextDue?.destination
    }
  ];
};

export class MockZavaEmployeeDataService implements IZavaEmployeeDataService {
  public getEmployeeExperience(now: Date = new Date()): IZavaEmployeeExperience {
    const people = mockPeople.map((person) => mapPerson(person, embeddedImages));
    const grounding = resolveGrounding(mockGrounding, now).map(mapGrounding);
    const signals = resolveHrSignals(mockHrSignals, now)
      .map((signal) => mapSignal(signal, people, grounding, embeddedImages))
      .sort(sortSignals);
    const events = resolveEvents(mockEvents, now)
      .map((event) => mapEvent(event, people))
      .sort((left, right) => left.start.getTime() - right.start.getTime());
    const timeline = resolveTimeline(mockTimeline, now)
      .map(mapTimelineItem)
      .sort((left, right) => left.occursAt.getTime() - right.occursAt.getTime());
    const milestones = resolveMilestones(mockMilestones, now)
      .map((milestone) => mapMilestone(milestone, embeddedImages))
      .sort((left, right) => left.occursAt.getTime() - right.occursAt.getTime());

    return {
      user: people.find((person) => person.relationship === 'self') || people[0],
      people,
      metrics: buildMetrics(signals, now),
      signals,
      events,
      timeline,
      milestones,
      media: embeddedImages
    };
  }
}