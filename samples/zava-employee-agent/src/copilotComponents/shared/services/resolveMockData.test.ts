import { mockEvents, mockHrSignals, mockMilestones, mockTimeline } from '../mockData';
import {
  resolveEvents,
  resolveHrSignals,
  resolveMilestones,
  resolveTimeline
} from './resolveMockData';

describe('resolveMockData', () => {
  const now = new Date(2026, 7, 11, 12, 0, 0);

  test('resolves signal deadlines from relative minute offsets', () => {
    const learning = resolveHrSignals(mockHrSignals, now)
      .find((signal) => signal.id === 'signal-learning-privacy');
    expect(learning?.properties.dueDateTime).toBe(
      new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString()
    );
  });

  test('resolves event duration without changing its destination', () => {
    const oneToOne = resolveEvents(mockEvents, now)[0];
    expect(
      new Date(oneToOne.event.end.dateTime).getTime() -
      new Date(oneToOne.event.start.dateTime).getTime()
    ).toBe(45 * 60 * 1000);
    expect(oneToOne.event.end.dateTime).toBe(
      new Date(now.getTime() + (2 * 24 * 60 + 45) * 60 * 1000).toISOString()
    );
    expect(oneToOne.destination).toEqual({
      family: 'people',
      route: 'people/meeting',
      params: { meetingId: 'event-one-to-one-diego' }
    });
  });

  test('resolves timeline and milestone dates against the same clock', () => {
    const timeline = resolveTimeline(mockTimeline, now);
    const milestones = resolveMilestones(mockMilestones, now);
    expect(timeline.find((item) => item.id === 'timeline-pay-statement')?.occursAt.getTime())
      .toBe(now.getTime() - 60 * 60 * 1000);
    expect(milestones[0].occursAt.getTime())
      .toBe(now.getTime() + 28 * 24 * 60 * 60 * 1000);
  });
});