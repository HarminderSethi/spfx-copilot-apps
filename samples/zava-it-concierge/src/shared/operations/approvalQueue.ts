export type ApprovalQueueStatus = 'pending' | 'approved' | 'declined';
export type ApprovalQueueFilter = ApprovalQueueStatus | 'all';

export interface IApprovalQueueItem {
  readonly id: string;
  readonly requesterName: string;
  readonly requesterRole: string;
  readonly department: string;
  readonly region: string;
  readonly requestTitle: string;
  readonly requestDetail: string;
  readonly submittedLabel: string;
  readonly dueLabel: string;
  readonly cost: number;
  readonly justification: string;
  readonly policySummary: string;
  readonly budgetSummary: string;
  readonly evidenceSummary: string;
  readonly status: ApprovalQueueStatus;
  readonly decisionRationale?: string;
}

export interface IApprovalQueueCounts {
  readonly pending: number;
  readonly approved: number;
  readonly declined: number;
}

export const APPROVAL_QUEUE_ITEMS: readonly IApprovalQueueItem[] = [
  {
    id: 'REQ-2048', requesterName: 'Megan Bowen', requesterRole: 'Product Manager', department: 'Product', region: 'North America',
    requestTitle: 'Surface Laptop request', requestDetail: '32 GB / 512 GB / Surface USB4 Dock', submittedLabel: 'Submitted 2 days ago', dueLabel: 'Due today', cost: 2068.98,
    justification: 'Customer workshops and product analysis need the larger memory configuration; battery capacity on the assigned device is 62%.',
    policySummary: 'Standard configuration / no exception', budgetSummary: '$30,221 remains after approval', evidenceSummary: '4 linked sources / complete', status: 'pending'
  },
  {
    id: 'REQ-2051', requesterName: 'Adele Vance', requesterRole: 'Product Designer', department: 'Product', region: 'Europe',
    requestTitle: 'Surface Laptop Studio 2', requestDetail: '32 GB / 1 TB / Slim Pen 2', submittedLabel: 'Submitted 5 days ago', dueLabel: 'Policy exception', cost: 2399,
    justification: 'Local model prototyping and design reviews require discrete graphics and pen input while working away from the studio.',
    policySummary: '18% above role threshold', budgetSummary: '$29,891 remains after approval', evidenceSummary: '3 linked sources / director safeguard', status: 'pending'
  },
  {
    id: 'REQ-2053', requesterName: 'Alex Wilber', requesterRole: 'Senior Manager', department: 'Product', region: 'North America',
    requestTitle: 'Surface Pro request', requestDetail: '16 GB / 512 GB / Flex Keyboard', submittedLabel: 'Submitted 6 days ago', dueLabel: 'Overdue', cost: 1899,
    justification: 'Frequent travel and customer briefings require a lighter device with reliable all-day mobility.',
    policySummary: 'Standard configuration / age evidence missing', budgetSummary: '$30,391 remains after approval', evidenceSummary: '2 linked sources / incomplete', status: 'pending'
  },
  {
    id: 'REQ-2058', requesterName: 'Johanna Lorenz', requesterRole: 'Frontline Manager', department: 'Operations', region: 'Europe',
    requestTitle: 'Surface Go request', requestDetail: '16 GB / 256 GB / rugged case', submittedLabel: 'Submitted today', dueLabel: 'Due Friday', cost: 799,
    justification: 'A shared frontline device supports inventory checks and shift handoffs on the warehouse floor.',
    policySummary: 'Frontline catalog match', budgetSummary: '$41,604 remains after approval', evidenceSummary: '3 linked sources / complete', status: 'pending'
  },
  {
    id: 'REQ-2045', requesterName: 'Nestor Wilke', requesterRole: 'Program Manager', department: 'Product', region: 'Europe',
    requestTitle: 'Surface Laptop request', requestDetail: '16 GB / 512 GB', submittedLabel: 'Reviewed yesterday', dueLabel: 'Completed', cost: 1699,
    justification: 'Program planning workshops require a standard mobile configuration for hybrid facilitation.',
    policySummary: 'Standard configuration', budgetSummary: '$32,290 remained after approval', evidenceSummary: '3 linked sources / complete', status: 'approved',
    decisionRationale: 'Approved within the standard role policy and current-quarter budget.'
  },
  {
    id: 'REQ-2042', requesterName: 'Patti Fernandez', requesterRole: 'Sales Manager', department: 'Sales', region: 'Latin America',
    requestTitle: 'Collaboration room upgrade', requestDetail: 'Large-room Teams system', submittedLabel: 'Reviewed 2 days ago', dueLabel: 'Completed', cost: 8999,
    justification: 'The regional briefing room needs improved camera coverage for customer presentations.',
    policySummary: 'Facilities ownership required', budgetSummary: 'Outside team hardware budget', evidenceSummary: '2 linked sources / ownership gap', status: 'declined',
    decisionRationale: 'Declined because the request belongs in the Facilities investment process.'
  },
  {
    id: 'REQ-2039', requesterName: 'Pradeep Gupta', requesterRole: 'Engineering Lead', department: 'Engineering', region: 'Asia Pacific',
    requestTitle: 'Surface Laptop request', requestDetail: '32 GB / 1 TB', submittedLabel: 'Reviewed 3 days ago', dueLabel: 'Completed', cost: 2099,
    justification: 'Local development and service diagnostics require the engineering memory and storage profile.',
    policySummary: 'Engineering profile match', budgetSummary: '$54,810 remained after approval', evidenceSummary: '4 linked sources / complete', status: 'approved',
    decisionRationale: 'Approved against the engineering device profile and allocated refresh budget.'
  }
];

export function summarizeApprovalQueue(items: readonly IApprovalQueueItem[]): IApprovalQueueCounts {
  return items.reduce<IApprovalQueueCounts>((counts, item) => ({
    pending: counts.pending + (item.status === 'pending' ? 1 : 0),
    approved: counts.approved + (item.status === 'approved' ? 1 : 0),
    declined: counts.declined + (item.status === 'declined' ? 1 : 0)
  }), { pending: 0, approved: 0, declined: 0 });
}

export function filterApprovalQueue(items: readonly IApprovalQueueItem[], filter: ApprovalQueueFilter): readonly IApprovalQueueItem[] {
  return filter === 'all' ? items : items.filter((item) => item.status === filter);
}

export function applyApprovalQueueDecision(
  items: readonly IApprovalQueueItem[],
  itemId: string,
  status: Exclude<ApprovalQueueStatus, 'pending'>,
  rationale: string
): readonly IApprovalQueueItem[] {
  return items.map((item) => item.id === itemId && item.status === 'pending'
    ? { ...item, status, decisionRationale: rationale.trim() }
    : item);
}

export interface IApprovalQueueDecisionSnapshot {
  readonly itemId: string;
  readonly status: Exclude<ApprovalQueueStatus, 'pending'>;
  readonly rationale: string;
}

export function restoreApprovalQueueDecisions(
  items: readonly IApprovalQueueItem[],
  snapshots: readonly IApprovalQueueDecisionSnapshot[]
): readonly IApprovalQueueItem[] {
  return snapshots.reduce<readonly IApprovalQueueItem[]>((current, snapshot) => applyApprovalQueueDecision(
    current,
    snapshot.itemId,
    snapshot.status,
    snapshot.rationale
  ), items);
}