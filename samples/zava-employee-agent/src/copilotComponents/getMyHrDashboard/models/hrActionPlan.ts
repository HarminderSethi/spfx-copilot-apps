import type {
  HrPriority,
  IZavaDestination
} from '../../shared/models/zavaEmployee';
import type { ZavaFamilyId } from '../../shared/models/families';

export type HrActionBucket = 'blocking' | 'overdue' | 'thisWeek' | 'later' | 'optional';

export interface IHrActionItem {
  id: string;
  family: ZavaFamilyId;
  sourceLabel: string;
  title: string;
  reason: string;
  priority: HrPriority;
  bucket: HrActionBucket;
  dueAt?: Date;
  destination: IZavaDestination;
  actionLabel: string;
}

export interface IHrActionPlan {
  headline: string;
  generatedAt: Date;
  items: IHrActionItem[];
}