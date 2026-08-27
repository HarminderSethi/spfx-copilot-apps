import type { IZavaGroundingRecord } from '../models/graph';

export const mockGrounding: ReadonlyArray<IZavaGroundingRecord> = [
  { id: 'ground-learning', title: 'Zava Learning assignment record', sourceType: 'mockLearning', reviewedOffsetDays: -1 },
  { id: 'ground-calendar', title: 'Megan Bowen calendar projection', sourceType: 'mockCalendar' },
  { id: 'ground-leave', title: 'Zava leave balance and request record', sourceType: 'mockHrSystem', reviewedOffsetDays: -1 },
  { id: 'ground-benefits', title: 'Zava benefits enrollment record', sourceType: 'mockHrSystem', reviewedOffsetDays: -2 },
  { id: 'ground-payroll', title: 'Zava payroll statement projection', sourceType: 'mockHrSystem' },
  { id: 'ground-case', title: 'Zava HR case record', sourceType: 'mockHrSystem' },
  { id: 'ground-rewards', title: 'Zava rewards statement projection', sourceType: 'mockHrSystem', reviewedOffsetDays: -3 },
  { id: 'ground-team', title: 'Zava manager approval record', sourceType: 'mockHrSystem' },
  { id: 'ground-people', title: 'Zava organization and expertise profile', sourceType: 'mockPeople', reviewedOffsetDays: -1 },
  { id: 'ground-policy', title: 'Flexible work policy', sourceType: 'mockPolicy', reviewedOffsetDays: -5 }
];