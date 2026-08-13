import { isZavaFamilyId } from '../models/families';
import { MockZavaEmployeeDataService } from './MockZavaEmployeeDataService';
import { embeddedImages } from '../mockData/embeddedImages';

describe('MockZavaEmployeeDataService', () => {
  const now = new Date(2026, 7, 11, 12, 0, 0);
  const data = new MockZavaEmployeeDataService().getEmployeeExperience(now);

  test('returns the coherent employee story and distinct experts', () => {
    expect(data.user.displayName).toBe('Megan Bowen');
    expect(data.signals.map((signal) => signal.id)).toEqual(expect.arrayContaining([
      'signal-learning-privacy',
      'signal-leave-conflict',
      'signal-benefits-enrollment',
      'signal-payroll-adjustment',
      'signal-case-response',
      'signal-equity-vest',
      'signal-approval-leave',
      'signal-approval-learning',
      'signal-expert-match'
    ]));
    expect(data.people.filter((person) => person.relationship === 'expert')).toHaveLength(3);
    expect(data.events.find((event) => event.id === 'event-one-to-one-diego')).toBeDefined();
  });

  test('uses only embedded data URIs for all mock media', () => {
    const media: string[] = Object.keys(data.media).map((key) => data.media[key]);
    expect(media).toHaveLength(10);
    expect(media.every((value) => value.startsWith('data:image/'))).toBe(true);
    expect(media.some((value) => /^https?:/i.test(value))).toBe(false);
    expect(data.people.every((person) => person.photoUrl.startsWith('data:image/'))).toBe(true);
    expect(data.milestones.every((milestone) => milestone.imageUrl.startsWith('data:image/'))).toBe(true);
    expect(data.milestones[0].imageUrl).toBe(embeddedImages.meganBowen);
  });

  test('keeps destinations valid and IDs unique', () => {
    const ids = data.signals.map((signal) => signal.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(data.signals.every((signal) =>
      isZavaFamilyId(signal.destination.family) && signal.destination.route.length > 0
    )).toBe(true);
    expect(data.signals.every((signal) => signal.grounding.length > 0)).toBe(true);
  });

  test('sorts critical and high-priority actions before normal items', () => {
    expect(data.signals.slice(0, 4).map((signal) => signal.priority))
      .toEqual(['critical', 'high', 'high', 'high']);
  });

  test('keeps actionable dates future-biased when the mount clock changes', () => {
    const morning = new MockZavaEmployeeDataService().getEmployeeExperience(
      new Date(2026, 7, 11, 8, 0, 0)
    );
    const evening = new MockZavaEmployeeDataService().getEmployeeExperience(
      new Date(2026, 7, 11, 19, 0, 0)
    );
    expect(morning.signals.filter((signal) => signal.dueAt)
      .every((signal) => (signal.dueAt?.getTime() ?? 0) > new Date(2026, 7, 11, 8, 0, 0).getTime()))
      .toBe(true);
    expect(evening.signals.filter((signal) => signal.dueAt)
      .every((signal) => (signal.dueAt?.getTime() ?? 0) > new Date(2026, 7, 11, 19, 0, 0).getTime()))
      .toBe(true);
    expect(
      evening.events[0].start.getTime() - morning.events[0].start.getTime()
    ).toBe(11 * 60 * 60 * 1000);
  });
});