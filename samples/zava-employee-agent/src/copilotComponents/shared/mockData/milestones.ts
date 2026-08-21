import type { IMockMilestoneSeed } from '../models/seeds';

export const mockMilestones: ReadonlyArray<IMockMilestoneSeed> = [
  {
    id: 'milestone-five-years',
    title: 'Five years at Zava',
    summary: 'Your anniversary story and updated rewards statement are nearly ready.',
    occursOffsetDays: 28,
    imageKey: 'meganBowen',
    destination: { family: 'rewards', route: 'service-milestone', params: { milestoneId: 'five-years' } }
  }
];