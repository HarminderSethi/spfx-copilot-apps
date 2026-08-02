export type TReleaseCheckStatus = 'pending' | 'done' | 'blocked';
export type TBlockerType = 'Dependency' | 'Environment' | 'Security' | 'Quality' | 'Approval' | 'Capacity';

export interface IReleaseCheck {
  id: string;
  title: string;
  area: 'Code' | 'QA' | 'Security' | 'Documentation' | 'Operations';
  owner: string;
  dueDate: string;
  status: TReleaseCheckStatus;
  userStoryIds?: string[];
  blockerType?: TBlockerType;
  note?: string;
  updatedAt: string;
}

export interface IReleasePlan {
  id: string;
  name: string;
  product: string;
  environment: 'Staging' | 'Production';
  targetDate: string;
  updatedAt: string;
  checks: IReleaseCheck[];
}
