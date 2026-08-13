import type { IGraphEvent, IGraphExternalItem, IZavaHrSignalProperties } from './graph';
import type { IZavaDestination, PrivacyLevel, HrPriority } from './zavaEmployee';
import type { ZavaFamilyId } from './families';

export interface IMockHrSignalSeed
  extends Omit<IGraphExternalItem<IZavaHrSignalProperties>, 'properties'> {
  properties: Omit<IZavaHrSignalProperties, 'dueDateTime'> & {
    dueOffsetMin?: number;
  };
}

export interface IMockEventSeed
  extends Omit<IGraphEvent, 'start' | 'end'> {
  startOffsetMin: number;
  durationMin: number;
  timeZone: string;
  destination: IZavaDestination;
}

export interface IMockTimelineSeed {
  id: string;
  family: ZavaFamilyId;
  title: string;
  summary: string;
  occursOffsetMin: number;
  destination: IZavaDestination;
}

export interface IMockMilestoneSeed {
  id: string;
  title: string;
  summary: string;
  occursOffsetDays: number;
  imageKey: string;
  destination: IZavaDestination;
}

export interface IMockSignalDefinition {
  id: string;
  family: ZavaFamilyId;
  title: string;
  summary: string;
  status: string;
  priority: HrPriority;
  privacyLevel: PrivacyLevel;
  dueOffsetMin?: number;
  destination: IZavaDestination;
  relatedPersonIds: string[];
  imageKey?: string;
  groundingIds: string[];
}