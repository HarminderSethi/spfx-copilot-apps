import { MockZavaEmployeeDataService } from '../../../shared/services/MockZavaEmployeeDataService';
import { normalizeHomeProperties } from '../../normalizeHomeProperties';
import {
  buildHomeSummary,
  selectTimelineForPeriod,
  selectVisibleSignals
} from './homeDataSelectors';

describe('Home data selectors', () => {
  const now = new Date(2026, 7, 11, 12, 0, 0);
  const data = new MockZavaEmployeeDataService().getEmployeeExperience(now);

  test('hides sensitive records unless the prompt explicitly allows them', () => {
    const standard = selectVisibleSignals(data.signals, normalizeHomeProperties({}), now);
    const sensitive = selectVisibleSignals(data.signals, normalizeHomeProperties({
      includeSensitive: true,
      period: 'month'
    }), now);
    expect(standard.some((signal) => signal.privacyLevel === 'sensitive')).toBe(false);
    expect(sensitive.some((signal) => signal.privacyLevel === 'sensitive')).toBe(true);
  });

  test('applies a requested family focus', () => {
    const learning = selectVisibleSignals(data.signals, normalizeHomeProperties({
      focusArea: 'learning'
    }), now);
    expect(learning).toHaveLength(1);
    expect(learning[0].family).toBe('learning');
  });

  test('applies the requested period to dated signals', () => {
    const today = selectVisibleSignals(data.signals, normalizeHomeProperties({
      period: 'today',
      includeSensitive: true
    }), now);
    expect(today.some((signal) => signal.id === 'signal-learning-privacy')).toBe(false);
    expect(today.some((signal) => signal.id === 'signal-approval-leave')).toBe(true);
  });

  test('filters timeline moments by period and focus area', () => {
    expect(selectTimelineForPeriod(data.timeline, 'today', now, 'all')).toHaveLength(0);
    expect(selectTimelineForPeriod(data.timeline, 'week', now, 'learning'))
      .toEqual([expect.objectContaining({ id: 'timeline-learning-deadline' })]);
    expect(selectTimelineForPeriod(data.timeline, 'month', now, 'all')).toHaveLength(4);
  });

  test('builds positive and actionable summary copy', () => {
    expect(buildHomeSummary([], [], 'today')).toBe('You are all caught up today.');
    expect(buildHomeSummary(data.signals.slice(0, 2), data.timeline.slice(0, 1), 'week'))
      .toBe('You have 2 priorities and 1 upcoming moment this week.');
  });
});