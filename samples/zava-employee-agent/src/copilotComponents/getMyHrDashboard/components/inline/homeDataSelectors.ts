import type {
  IZavaHrSignal,
  IZavaTimelineItem
} from '../../../shared/models/zavaEmployee';
import type {
  HomeFocusArea,
  HomePeriod,
  INormalizedHomeProperties
} from '../../normalizeHomeProperties';

const periodInDays: { [period in HomePeriod]: number } = {
  today: 1,
  week: 7,
  month: 31,
  year: 366
};

export const selectVisibleSignals = (
  signals: ReadonlyArray<IZavaHrSignal>,
  properties: INormalizedHomeProperties,
  now: Date
): IZavaHrSignal[] => signals.filter((signal) => {
  const maximum = now.getTime() + periodInDays[properties.period] * 24 * 60 * 60 * 1000;
  const familyMatches = properties.focusArea === 'all' || signal.family === properties.focusArea;
  const sensitiveAllowed = signal.privacyLevel !== 'sensitive' ||
    properties.includeSensitive ||
    properties.privacyLevel === 'sensitive';
  const periodMatches = signal.dueAt === undefined || (
    signal.dueAt.getTime() >= now.getTime() && signal.dueAt.getTime() <= maximum
  );
  return familyMatches && sensitiveAllowed && periodMatches;
});

export const selectTimelineForPeriod = (
  timeline: ReadonlyArray<IZavaTimelineItem>,
  period: HomePeriod,
  now: Date,
  focusArea: HomeFocusArea
): IZavaTimelineItem[] => {
  const maximum = now.getTime() + periodInDays[period] * 24 * 60 * 60 * 1000;
  return timeline.filter((item) =>
    item.occursAt.getTime() >= now.getTime() &&
    item.occursAt.getTime() <= maximum &&
    (focusArea === 'all' || item.family === focusArea)
  );
};

export const buildHomeSummary = (
  signals: ReadonlyArray<IZavaHrSignal>,
  timeline: ReadonlyArray<IZavaTimelineItem>,
  period: HomePeriod
): string => {
  const highPriority = signals.filter(
    (signal) => signal.priority === 'critical' || signal.priority === 'high'
  ).length;
  const periodLabel = period === 'today' ? 'today' : `this ${period}`;
  if (highPriority === 0 && timeline.length === 0) {
    return `You are all caught up ${periodLabel}.`;
  }
  const actionText = `${highPriority} priorit${highPriority === 1 ? 'y' : 'ies'}`;
  const momentText = `${timeline.length} upcoming moment${timeline.length === 1 ? '' : 's'}`;
  return `You have ${actionText} and ${momentText} ${periodLabel}.`;
};