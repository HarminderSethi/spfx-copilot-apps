import type { ZavaFamilyId } from '../../shared/models/families';
import type {
  IZavaHrSignal,
  IZavaUser,
  PrivacyLevel
} from '../../shared/models/zavaEmployee';
import { getGreeting } from '../../shared/utils/greeting';
import type {
  HrActionBucket,
  IHrActionItem,
  IHrActionPlan
} from '../models/hrActionPlan';

const DAY_MS = 24 * 60 * 60 * 1000;

const FAMILY_LABELS: { [family in ZavaFamilyId]: string } = {
  home: 'Home',
  time: 'Time & Leave',
  money: 'Payroll',
  benefits: 'Benefits',
  rewards: 'Rewards',
  policy: 'Policy',
  support: 'HR Support',
  learning: 'Learning',
  team: 'My Team',
  people: 'People'
};

const ACTION_LABELS: { [family in ZavaFamilyId]: string } = {
  home: 'Open Home',
  time: 'Review leave request',
  money: 'Explain latest pay',
  benefits: 'Review benefits',
  rewards: 'Open rewards',
  policy: 'Review policy',
  support: 'Open HR case',
  learning: 'Open in Learning',
  team: 'Open approvals',
  people: 'Open People'
};

const resolveBucket = (signal: IZavaHrSignal, now: Date): HrActionBucket => {
  if (signal.priority === 'critical') {
    return 'blocking';
  }
  if (signal.dueAt && signal.dueAt.getTime() < now.getTime()) {
    return 'overdue';
  }
  if (signal.dueAt && signal.dueAt.getTime() <= now.getTime() + 7 * DAY_MS) {
    return 'thisWeek';
  }
  return signal.priority === 'optional' ? 'optional' : 'later';
};

const bucketRank: { [bucket in HrActionBucket]: number } = {
  blocking: 0,
  overdue: 1,
  thisWeek: 2,
  later: 3,
  optional: 4
};

const isVisibleAtPrivacy = (
  signal: IZavaHrSignal,
  privacyLevel: PrivacyLevel,
  includeSensitive: boolean
): boolean => signal.privacyLevel !== 'sensitive' ||
  includeSensitive ||
  privacyLevel === 'sensitive';

export const buildHrActionPlan = (
  signals: ReadonlyArray<IZavaHrSignal>,
  user: IZavaUser,
  now: Date,
  privacyLevel: PrivacyLevel,
  includeSensitive: boolean
): IHrActionPlan => {
  const items = signals
    .filter((signal) => isVisibleAtPrivacy(signal, privacyLevel, includeSensitive))
    .map<IHrActionItem>((signal) => ({
      id: `plan-${signal.id}`,
      family: signal.family,
      sourceLabel: FAMILY_LABELS[signal.family],
      title: signal.title,
      reason: signal.summary,
      priority: signal.priority,
      bucket: resolveBucket(signal, now),
      dueAt: signal.dueAt,
      destination: signal.destination,
      actionLabel: ACTION_LABELS[signal.family]
    }))
    .sort((left, right) => {
      const bucketDifference = bucketRank[left.bucket] - bucketRank[right.bucket];
      if (bucketDifference !== 0) {
        return bucketDifference;
      }
      const dueDifference = (left.dueAt?.getTime() ?? Number.MAX_VALUE) -
        (right.dueAt?.getTime() ?? Number.MAX_VALUE);
      return dueDifference !== 0 ? dueDifference : left.id.localeCompare(right.id);
    })
    .slice(0, 5);

  const greeting = getGreeting(now);
  const headline = items.length === 0
    ? `${greeting.text}, ${user.firstName}. You are all caught up across HR.`
    : `${greeting.text}, ${user.firstName}. Start with ${items[0].title.toLowerCase()}; the rest of your plan is ordered by urgency.`;

  return { headline, generatedAt: now, items };
};

export const getFamilyLabel = (family: ZavaFamilyId): string => FAMILY_LABELS[family];