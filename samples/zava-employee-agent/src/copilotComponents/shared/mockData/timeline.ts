import type { IMockTimelineSeed } from '../models/seeds';

export const mockTimeline: ReadonlyArray<IMockTimelineSeed> = [
  {
    id: 'timeline-pay-statement', family: 'money', title: 'New pay statement available',
    summary: 'A one-time recognition adjustment is included.', occursOffsetMin: -60,
    destination: { family: 'money', route: 'latest-pay', params: { period: 'latest' } }
  },
  {
    id: 'timeline-learning-deadline', family: 'learning', title: 'Privacy course deadline',
    summary: 'One 24-minute module remains.', occursOffsetMin: 3 * 24 * 60,
    destination: { family: 'learning', route: 'course-detail', params: { courseId: 'privacy-foundations' } }
  },
  {
    id: 'timeline-one-to-one', family: 'people', title: 'Career growth one-to-one',
    summary: 'Prepare keynote reflections and next-role goals.', occursOffsetMin: 2 * 24 * 60,
    destination: { family: 'people', route: 'people/meeting', params: { meetingId: 'event-one-to-one-diego' } }
  },
  {
    id: 'timeline-equity-vest', family: 'rewards', title: 'Equity vest',
    summary: '42 Zava units are scheduled.', occursOffsetMin: 17 * 24 * 60,
    destination: { family: 'rewards', route: 'equity-vesting', params: { includeEquity: true } }
  },
  {
    id: 'timeline-enrollment-close', family: 'benefits', title: 'Open enrollment closes',
    summary: 'Review family coverage before the window closes.', occursOffsetMin: 23 * 24 * 60,
    destination: { family: 'benefits', route: 'enrollment-checklist' }
  }
];