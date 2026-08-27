export type IntentOperation = 'information' | 'review' | 'submit' | 'education';
export type IntentLens = 'me' | 'team' | 'company' | 'contextual' | 'education';
export type IntentPropertyType = 'string' | 'number' | 'boolean';
export type IntentPropertyValue = string | number | boolean;
export type TransientSnapshotAdapter = 'selection' | 'filters' | 'form' | 'review' | 'education';

export interface IIntentPropertyDefinition {
  readonly name: string;
  readonly type: IntentPropertyType;
  readonly description: string;
}

export interface IIntentDefinition {
  readonly name: string;
  readonly folder: string;
  readonly id: string;
  readonly operation: IntentOperation;
  readonly lens: IntentLens;
  readonly route: string;
  readonly title: string;
  readonly description: string;
  readonly properties: readonly IIntentPropertyDefinition[];
  readonly previewProperties: Readonly<Record<string, IntentPropertyValue>>;
  readonly transientSnapshot: TransientSnapshotAdapter;
  readonly education: {
    readonly category: string;
    readonly samplePrompt: string;
  };
  readonly visualIdentity: {
    readonly kind: string;
    readonly accent: string;
    readonly metricLabel: string;
  };
}

export const INTENT_CATALOG = [
  {
    name: 'MyDeviceStatus', folder: 'myDeviceStatus', id: '9db2cb5c-9458-4de8-b34b-8ed4353f39d6',
    operation: 'information', lens: 'me', route: 'me/my-it#device', title: 'My Surface',
    description: "Use for an assigned-device overview: Surface model, owner, warranty, compliance, and summary health. Do not use for detailed health metrics or running diagnostics.",
    properties: [{ name: 'deviceId', type: 'string', description: 'Optional asset or device identifier to inspect.' }],
    previewProperties: { deviceId: 'ZVA-SRF-1042' }, transientSnapshot: 'selection',
    education: { category: 'My devices', samplePrompt: 'Show the status of my Surface device.' },
    visualIdentity: { kind: 'status-ring', accent: '#0078D4', metricLabel: 'Device health' }
  },
  {
    name: 'GetDeviceHealth', folder: 'getDeviceHealth', id: '08493f09-3a61-4b1f-be6e-3354eb64b78e',
    operation: 'information', lens: 'me', route: 'me/my-it#health', title: 'Device health',
    description: 'Use for detailed Surface health metrics: battery, storage, performance, patch, and compliance. Do not use to run diagnostic checks or show warranty inventory.',
    properties: [{ name: 'deviceId', type: 'string', description: 'Optional asset or device identifier to inspect.' }],
    previewProperties: { deviceId: 'ZVA-SRF-1042' }, transientSnapshot: 'selection',
    education: { category: 'My devices', samplePrompt: 'Check the health of my Surface.' },
    visualIdentity: { kind: 'health-gauges', accent: '#00A4EF', metricLabel: 'Health score' }
  },
  {
    name: 'GetRefreshEligibility', folder: 'getRefreshEligibility', id: '3559c05e-39bc-47da-af88-d94c2af86588',
    operation: 'information', lens: 'me', route: 'me/my-it#refresh', title: 'Refresh eligibility',
    description: 'Use for one employee device refresh eligibility, timing, age, warranty, and policy. Do not use for company refresh-wave planning or browsing replacements.',
    properties: [{ name: 'deviceId', type: 'string', description: 'Optional asset or device identifier to evaluate.' }],
    previewProperties: { deviceId: 'ZVA-SRF-1042' }, transientSnapshot: 'selection',
    education: { category: 'My devices', samplePrompt: 'When is my Surface eligible for refresh?' },
    visualIdentity: { kind: 'policy-timeline', accent: '#00B294', metricLabel: 'Eligible date' }
  },
  {
    name: 'ExploreDeviceCatalog', folder: 'exploreDeviceCatalog', id: '003a6d55-58f8-4d2f-b2ad-fd0e34dbe38d',
    operation: 'information', lens: 'me', route: 'me/request-workspace#catalog', title: 'Surface catalog',
    description: 'Use to browse and compare approved Surface options, specs, prices, stock, lead time, and role fit. Do not use to configure or submit a specific request.',
    properties: [
      { name: 'role', type: 'string', description: 'Optional role used to rank device fit.' },
      { name: 'workload', type: 'string', description: 'Optional primary workload or scenario.' }
    ],
    previewProperties: { role: 'Product manager', workload: 'Hybrid collaboration' }, transientSnapshot: 'filters',
    education: { category: 'Requests', samplePrompt: 'Compare Surface devices for hybrid work.' },
    visualIdentity: { kind: 'product-stage', accent: '#E3008C', metricLabel: 'Best fit' }
  },
  {
    name: 'ConfigureDeviceRequest', folder: 'configureDeviceRequest', id: '77101364-aeb9-4e6d-a5b4-636973a7b084',
    operation: 'submit', lens: 'me', route: 'me/request-workspace#configure', title: 'Configure a request',
    description: 'Use to configure a specific Surface request with model, memory, storage, accessories, live price, and policy review. Do not use for catalog comparison or justification drafting.',
    properties: [
      { name: 'model', type: 'string', description: 'Optional preferred Surface model.' },
      { name: 'memoryGb', type: 'number', description: 'Optional requested memory in gigabytes.' },
      { name: 'storageGb', type: 'number', description: 'Optional requested storage in gigabytes.' }
    ],
    previewProperties: { model: 'Surface Laptop', memoryGb: 32, storageGb: 512 }, transientSnapshot: 'form',
    education: { category: 'Requests', samplePrompt: 'Configure a Surface Laptop request with 32 GB of memory.' },
    visualIdentity: { kind: 'configurator', accent: '#D83B01', metricLabel: 'Request total' }
  },
  {
    name: 'DraftDeviceJustification', folder: 'draftDeviceJustification', id: 'd52c4266-5f46-4e5f-b754-38de21b63374',
    operation: 'submit', lens: 'me', route: 'me/request-workspace#justify', title: 'Draft justification',
    description: 'Use only to draft or edit the business justification for an existing device request. Do not use to configure hardware, compare devices, or preview request cost.',
    properties: [
      { name: 'requestId', type: 'string', description: 'Optional request identifier to justify.' },
      { name: 'emphasis', type: 'string', description: 'Optional business outcome to emphasize.' }
    ],
    previewProperties: { requestId: 'REQ-2048', emphasis: 'Customer workshops' }, transientSnapshot: 'form',
    education: { category: 'Requests', samplePrompt: 'Draft a business justification for my device request.' },
    visualIdentity: { kind: 'justification', accent: '#8764B8', metricLabel: 'Evidence strength' }
  },
  {
    name: 'ReportItIssue', folder: 'reportItIssue', id: 'f41b498c-7218-4316-ab6d-b9f232c0a0cb',
    operation: 'submit', lens: 'me', route: 'me/request-workspace#report-issue', title: 'Report an IT issue',
    description: 'Use to create and submit a support issue with symptom, severity, context, review, and receipt. Do not use when the user asks to run diagnostics or find help content.',
    properties: [
      { name: 'symptom', type: 'string', description: 'Optional issue symptom or summary.' },
      { name: 'severity', type: 'string', description: 'Optional user-observed severity.' }
    ],
    previewProperties: { symptom: 'Video calls drop when undocked', severity: 'medium' }, transientSnapshot: 'form',
    education: { category: 'Support', samplePrompt: 'Report that my video calls drop when I undock.' },
    visualIdentity: { kind: 'issue-form', accent: '#C239B3', metricLabel: 'Impact' }
  },
  {
    name: 'RunDeviceDiagnostics', folder: 'runDeviceDiagnostics', id: '1047d81e-b04f-4b63-a7f8-9f8d8c95f1e2',
    operation: 'information', lens: 'me', route: 'me/my-it#diagnostics', title: 'Device diagnostics',
    description: 'Use when the user asks to run, check, test, troubleshoot, or diagnose a device symptom. Do not use to submit an issue or show static health metrics only.',
    properties: [
      { name: 'deviceId', type: 'string', description: 'Optional asset or device identifier to diagnose.' },
      { name: 'symptom', type: 'string', description: 'Optional symptom used to focus diagnostic checks.' }
    ],
    previewProperties: { deviceId: 'ZVA-SRF-1042', symptom: 'Battery drains quickly' }, transientSnapshot: 'selection',
    education: { category: 'Support', samplePrompt: 'Run diagnostics for my battery drain.' },
    visualIdentity: { kind: 'diagnostic-sequence', accent: '#107C10', metricLabel: 'Checks passed' }
  },
  {
    name: 'GetMyRequests', folder: 'getMyRequests', id: 'f41f3463-ae9c-43b3-b707-e45cf666fadc',
    operation: 'information', lens: 'me', route: 'me/my-it#requests', title: 'My requests',
    description: "Use to list the current user's own IT requests and tickets with status, owner, and ETA. Do not use for approval work, one shipment, or one process stage.",
    properties: [
      { name: 'status', type: 'string', description: 'Optional request status filter.' },
      { name: 'requestType', type: 'string', description: 'Optional request type filter.' }
    ],
    previewProperties: { status: 'active', requestType: 'device' }, transientSnapshot: 'filters',
    education: { category: 'My requests', samplePrompt: 'Show my active IT requests.' },
    visualIdentity: { kind: 'request-timeline', accent: '#5C2D91', metricLabel: 'Active requests' }
  },
  {
    name: 'FindKnowledgeMatch', folder: 'findKnowledgeMatch', id: '8b29f9c7-3d4f-474e-9196-ae501c470e90',
    operation: 'information', lens: 'me', route: 'me/my-it#knowledge', title: 'Knowledge match',
    description: 'Use to find and rank support articles for a question or symptom. Do not use to run diagnostics, report an issue, or inspect service incidents.',
    properties: [
      { name: 'query', type: 'string', description: 'Optional support question or symptom.' },
      { name: 'product', type: 'string', description: 'Optional product used to narrow matching.' }
    ],
    previewProperties: { query: 'Improve Teams call quality while undocked', product: 'Surface Laptop' }, transientSnapshot: 'selection',
    education: { category: 'Support', samplePrompt: 'Find help for poor Teams call quality.' },
    visualIdentity: { kind: 'ranked-knowledge', accent: '#038387', metricLabel: 'Match confidence' }
  },
  {
    name: 'TrackDeviceShipment', folder: 'trackDeviceShipment', id: '74cecdba-40e9-4513-bbcc-cfb41c6e6741',
    operation: 'information', lens: 'me', route: 'me/my-it#shipment', title: 'Device shipment',
    description: 'Use to track one device order or shipment through imaging, carrier delivery, setup, and return. Do not use for all requests or generic process status.',
    properties: [{ name: 'orderId', type: 'string', description: 'Optional order or shipment identifier.' }],
    previewProperties: { orderId: 'ORD-48291' }, transientSnapshot: 'selection',
    education: { category: 'My requests', samplePrompt: 'Track my Surface shipment.' },
    visualIdentity: { kind: 'shipment-journey', accent: '#498205', metricLabel: 'Expected delivery' }
  },
  {
    name: 'ReviewDeviceApproval', folder: 'reviewDeviceApproval', id: '950a81c0-f13d-4082-aecf-04823132efa8',
    operation: 'review', lens: 'team', route: 'team/team-it#approval', title: 'Device approval',
    description: 'Use to approve or decline one standard device request with a request ID or named requester. Do not use for a queue, policy exception, cost-only preview, or delegation.',
    properties: [{ name: 'requestId', type: 'string', description: 'Optional request identifier to review.' }],
    previewProperties: { requestId: 'REQ-2048' }, transientSnapshot: 'review',
    education: { category: 'Approvals', samplePrompt: 'Review device request REQ-2048.' },
    visualIdentity: { kind: 'approval-evidence', accent: '#D13438', metricLabel: 'Budget impact' }
  },
  {
    name: 'GetApprovalQueue', folder: 'getApprovalQueue', id: 'a3f42522-5656-4a61-862f-090bfa6d656f',
    operation: 'review', lens: 'team', route: 'team/team-it#approvals', title: 'Approval queue',
    description: 'Use to show multiple requests awaiting the current manager\'s approval, with status filters and counts. Do not use to decide one named request or exception.',
    properties: [
      { name: 'requestType', type: 'string', description: 'Optional approval request type filter.' },
      { name: 'status', type: 'string', description: 'Optional approval status filter.' }
    ],
    previewProperties: { requestType: 'all', status: 'pending' }, transientSnapshot: 'filters',
    education: { category: 'Approvals', samplePrompt: 'Show my pending approval queue.' },
    visualIdentity: { kind: 'approval-queue', accent: '#E74856', metricLabel: 'Awaiting review' }
  },
  {
    name: 'GetTeamBudget', folder: 'getTeamBudget', id: '2a7d9975-426c-46b7-a82e-993d5c5330b7',
    operation: 'information', lens: 'team', route: 'team/team-it#budget', title: 'Team IT budget',
    description: 'Use for the team-level IT budget: allocated, spent, committed, remaining, and pending totals. Do not use for one request cost or company-wide spend variance.',
    properties: [
      { name: 'period', type: 'string', description: 'Optional fiscal period to summarize.' },
      { name: 'includePending', type: 'boolean', description: 'Whether to include pending requests in the forecast.' }
    ],
    previewProperties: { period: 'current-quarter', includePending: true }, transientSnapshot: 'filters',
    education: { category: 'Team planning', samplePrompt: "Show this quarter's team IT budget including pending requests." },
    visualIdentity: { kind: 'budget-gauge', accent: '#CA5010', metricLabel: 'Remaining budget' }
  },
  {
    name: 'GetTeamAssets', folder: 'getTeamAssets', id: 'b5911ecc-b742-44e9-9632-f46555fa0dbc',
    operation: 'information', lens: 'team', route: 'team/team-it#assets', title: 'Team assets',
    description: 'Use for a manager roster of team members and assigned devices, age, compliance, and refresh risk. Do not use for company fleet health or one employee device.',
    properties: [
      { name: 'department', type: 'string', description: 'Optional department to inspect.' },
      { name: 'risk', type: 'string', description: 'Optional refresh-risk filter.' }
    ],
    previewProperties: { department: 'Product', risk: 'all' }, transientSnapshot: 'filters',
    education: { category: 'Team planning', samplePrompt: 'Show aging Surface devices on my team.' },
    visualIdentity: { kind: 'asset-roster', accent: '#8E8CD8', metricLabel: 'Refresh risk' }
  },
  {
    name: 'PreviewRequestCost', folder: 'previewRequestCost', id: 'df647f36-3209-434b-bb21-df97f0616f71',
    operation: 'information', lens: 'team', route: 'team/team-it#cost-impact', title: 'Request cost impact',
    description: 'Use to calculate the cost and before/after budget impact of one request ID. Do not use for total team budget, company spend, or approving the request.',
    properties: [{ name: 'requestId', type: 'string', description: 'Optional request identifier to price.' }],
    previewProperties: { requestId: 'REQ-2048' }, transientSnapshot: 'selection',
    education: { category: 'Approvals', samplePrompt: 'Preview the budget impact of REQ-2048.' },
    visualIdentity: { kind: 'cost-bridge', accent: '#986F0B', metricLabel: 'Forecast remaining' }
  },
  {
    name: 'ReviewPolicyException', folder: 'reviewPolicyException', id: 'dded869b-0b3b-4987-b8d7-dd0753144b88',
    operation: 'review', lens: 'team', route: 'team/team-it#exceptions', title: 'Policy exception',
    description: 'Use to approve or decline one off-catalog or over-threshold policy exception. Do not use for a standard device approval, approval queue, or cost-only preview.',
    properties: [{ name: 'exceptionId', type: 'string', description: 'Optional policy exception identifier to review.' }],
    previewProperties: { exceptionId: 'EXC-0317' }, transientSnapshot: 'review',
    education: { category: 'Approvals', samplePrompt: 'Review policy exception EXC-0317.' },
    visualIdentity: { kind: 'exception-evidence', accent: '#A4262C', metricLabel: 'Policy variance' }
  },
  {
    name: 'GetTeamTicketTrend', folder: 'getTeamTicketTrend', id: '10b1b998-cba8-4e2d-aa82-9053e0c1222d',
    operation: 'information', lens: 'team', route: 'team/team-it#tickets', title: 'Team ticket trend',
    description: 'Use for one team\'s monthly ticket volume, categories, and comparison with a company baseline. Do not use for company deflection or top issue ranking.',
    properties: [
      { name: 'period', type: 'string', description: 'Optional reporting period.' },
      { name: 'category', type: 'string', description: 'Optional ticket category filter.' }
    ],
    previewProperties: { period: 'six-months', category: 'all' }, transientSnapshot: 'filters',
    education: { category: 'Team planning', samplePrompt: "Show my team's six-month IT ticket trend." },
    visualIdentity: { kind: 'trend-small-multiples', accent: '#0099BC', metricLabel: 'Tickets this month' }
  },
  {
    name: 'DelegateApproval', folder: 'delegateApproval', id: 'e3ea2533-f0eb-4a5c-98c9-7469e74c1555',
    operation: 'submit', lens: 'team', route: 'team/team-it#delegate', title: 'Delegate approval',
    description: 'Use only to delegate or reassign one approval to another person with scope and rationale. Do not use to approve, decline, or list requests.',
    properties: [
      { name: 'requestId', type: 'string', description: 'Optional request identifier to delegate.' },
      { name: 'delegateEmail', type: 'string', description: 'Optional proposed delegate email address.' }
    ],
    previewProperties: { requestId: 'REQ-2048', delegateEmail: 'alex.wilber@zava.example.com' }, transientSnapshot: 'form',
    education: { category: 'Approvals', samplePrompt: 'Delegate approval for REQ-2048 to Alex Wilber.' },
    visualIdentity: { kind: 'delegate-form', accent: '#4F6BED', metricLabel: 'Delegation scope' }
  },
  {
    name: 'GetFleetHealth', folder: 'getFleetHealth', id: '2be6cb8e-b20a-4743-9933-4918fb2283b1',
    operation: 'information', lens: 'company', route: 'company/control-center#fleet-health', title: 'Fleet health',
    description: 'Use for company fleet health and risk concentration by region and department. Do not use for device age cohorts, refresh scheduling, team assets, or one device.',
    properties: [
      { name: 'region', type: 'string', description: 'Optional region filter.' },
      { name: 'department', type: 'string', description: 'Optional department filter.' }
    ],
    previewProperties: { region: 'all', department: 'all' }, transientSnapshot: 'filters',
    education: { category: 'Fleet operations', samplePrompt: 'Show fleet health across all regions.' },
    visualIdentity: { kind: 'estate-landscape', accent: '#00B7C3', metricLabel: 'Healthy devices' }
  },
  {
    name: 'GetDeviceAgeDistribution', folder: 'getDeviceAgeDistribution', id: '8575e938-9857-4058-86b6-751d1383d528',
    operation: 'information', lens: 'company', route: 'company/fleet-analytics#device-age', title: 'Device age distribution',
    description: 'Use for company device age cohorts, refresh threshold counts, and projected cohort cost. Do not use for overall fleet health or scheduling refresh waves.',
    properties: [
      { name: 'region', type: 'string', description: 'Optional region filter.' },
      { name: 'thresholdYears', type: 'number', description: 'Optional refresh threshold in years.' }
    ],
    previewProperties: { region: 'all', thresholdYears: 4 }, transientSnapshot: 'filters',
    education: { category: 'Fleet analytics', samplePrompt: 'Show devices approaching the four-year refresh threshold.' },
    visualIdentity: { kind: 'cohort-bars', accent: '#7A7574', metricLabel: 'Past threshold' }
  },
  {
    name: 'GetTicketDeflectionTrend', folder: 'getTicketDeflectionTrend', id: '7470ec99-dfed-467c-b23a-65ba439f6c66',
    operation: 'information', lens: 'company', route: 'company/control-center#deflection', title: 'Ticket deflection',
    description: 'Use for company-wide self-service ticket deflection rate versus agent-handled volume over time. Do not use for one team trend or issue-category ranking.',
    properties: [
      { name: 'period', type: 'string', description: 'Optional reporting period.' },
      { name: 'channel', type: 'string', description: 'Optional support channel filter.' }
    ],
    previewProperties: { period: 'six-months', channel: 'all' }, transientSnapshot: 'filters',
    education: { category: 'Service operations', samplePrompt: 'Show the six-month ticket deflection trend.' },
    visualIdentity: { kind: 'deflection-trend', accent: '#13A10E', metricLabel: 'Deflection rate' }
  },
  {
    name: 'GetTopItIssues', folder: 'getTopItIssues', id: 'e1533536-1bb6-4153-8038-e050ed47aee8',
    operation: 'information', lens: 'company', route: 'company/fleet-analytics#pareto', title: 'Top IT issues',
    description: 'Use to rank company IT issue categories and identify which causes account for most tickets. Do not use for deflection rate, one team trend, or service status.',
    properties: [
      { name: 'period', type: 'string', description: 'Optional reporting period.' },
      { name: 'region', type: 'string', description: 'Optional region filter.' }
    ],
    previewProperties: { period: 'quarter', region: 'all' }, transientSnapshot: 'filters',
    education: { category: 'Fleet analytics', samplePrompt: 'What issues account for most tickets this quarter?' },
    visualIdentity: { kind: 'pareto', accent: '#FF8C00', metricLabel: 'Cumulative impact' }
  },
  {
    name: 'GetServiceHealth', folder: 'getServiceHealth', id: 'f89f8973-b036-4043-befe-28103da89d63',
    operation: 'information', lens: 'company', route: 'company/control-center#services', title: 'Service health',
    description: 'Use for current Microsoft 365 service status and known incidents by service. Do not use to correlate raw signals into a major incident or report a user issue.',
    properties: [
      { name: 'service', type: 'string', description: 'Optional Microsoft 365 service filter.' },
      { name: 'region', type: 'string', description: 'Optional region filter.' }
    ],
    previewProperties: { service: 'all', region: 'all' }, transientSnapshot: 'filters',
    education: { category: 'Service operations', samplePrompt: 'Show current Microsoft 365 service health.' },
    visualIdentity: { kind: 'service-board', accent: '#6264A7', metricLabel: 'Services healthy' }
  },
  {
    name: 'GetLicenseReclaim', folder: 'getLicenseReclaim', id: '2231c536-3061-479d-80c7-177250842281',
    operation: 'information', lens: 'company', route: 'company/control-center#licenses', title: 'License reclaim',
    description: 'Use for inactive Microsoft 365 license cohorts, reclaimable seats, annual value, safeguards, and owners. Do not use for hardware spend or team budget.',
    properties: [
      { name: 'inactivityDays', type: 'number', description: 'Optional inactivity threshold in days.' },
      { name: 'department', type: 'string', description: 'Optional department filter.' }
    ],
    previewProperties: { inactivityDays: 90, department: 'all' }, transientSnapshot: 'filters',
    education: { category: 'Cost optimization', samplePrompt: 'Show licenses inactive for more than 90 days.' },
    visualIdentity: { kind: 'license-partition', accent: '#008272', metricLabel: 'Annual opportunity' }
  },
  {
    name: 'GetItSpendBridge', folder: 'getItSpendBridge', id: '76ff1266-0079-45b9-89b3-53bc3941aa98',
    operation: 'information', lens: 'company', route: 'company/control-center#spend', title: 'IT spend bridge',
    description: 'Use for company-wide IT budget-to-forecast variance and spend drivers. Do not use for a team budget, one request cost, or license reclaim.',
    properties: [
      { name: 'quarter', type: 'string', description: 'Optional fiscal quarter.' },
      { name: 'department', type: 'string', description: 'Optional department filter.' }
    ],
    previewProperties: { quarter: 'current', department: 'all' }, transientSnapshot: 'filters',
    education: { category: 'Cost optimization', samplePrompt: "Explain this quarter's IT spend variance." },
    visualIdentity: { kind: 'spend-waterfall', accent: '#C19C00', metricLabel: 'Forecast remaining' }
  },
  {
    name: 'PlanRefreshWaves', folder: 'planRefreshWaves', id: 'bb550394-80c3-463f-82c3-07eb4275d164',
    operation: 'information', lens: 'company', route: 'company/fleet-analytics#refresh-waves', title: 'Refresh wave plan',
    description: 'Use to model company device refresh schedules across quarters, regions, capacity, and budget without applying changes. Do not use for one device eligibility or age distribution.',
    properties: [
      { name: 'region', type: 'string', description: 'Optional region filter.' },
      { name: 'maxDevicesPerWeek', type: 'number', description: 'Optional weekly deployment capacity.' }
    ],
    previewProperties: { region: 'all', maxDevicesPerWeek: 42 }, transientSnapshot: 'filters',
    education: { category: 'Fleet analytics', samplePrompt: 'Plan refresh waves with capacity of 42 devices per week.' },
    visualIdentity: { kind: 'refresh-horizon', accent: '#F7630C', metricLabel: 'Peak weekly load' }
  },
  {
    name: 'CorrelateMajorIncident', folder: 'correlateMajorIncident', id: 'cb24c889-dd73-413e-b5ac-2aacc2135f38',
    operation: 'information', lens: 'company', route: 'company/control-center#incident-correlation', title: 'Incident correlation',
    description: 'Use to investigate or correlate signals, services, regions, and tickets for one potential major incident. Do not use for the general service-health board or user issue submission.',
    properties: [
      { name: 'incidentId', type: 'string', description: 'Optional incident identifier to focus.' },
      { name: 'service', type: 'string', description: 'Optional service used to narrow signals.' }
    ],
    previewProperties: { incidentId: 'INC-7091', service: 'Microsoft Teams' }, transientSnapshot: 'selection',
    education: { category: 'Service operations', samplePrompt: 'Correlate signals for major incident INC-7091.' },
    visualIdentity: { kind: 'incident-constellation', accent: '#E81123', metricLabel: 'Correlated signals' }
  },
  {
    name: 'GetProcessJourney', folder: 'getProcessJourney', id: '117279a9-ab9d-4fd5-978b-1ae163ed5025',
    operation: 'information', lens: 'contextual', route: 'workflow/process-journey', title: 'Process journey',
    description: 'Use for the current stage, owner, blocker, and next step of one known process or request ID. Do not use to list all requests or track carrier delivery specifically.',
    properties: [
      { name: 'processId', type: 'string', description: 'Optional process or request identifier.' },
      { name: 'processType', type: 'string', description: 'Optional process type.' }
    ],
    previewProperties: { processId: 'REQ-2048', processType: 'device-request' }, transientSnapshot: 'selection',
    education: { category: 'My requests', samplePrompt: 'Show the process journey for REQ-2048.' },
    visualIdentity: { kind: 'process-journey', accent: '#0078D4', metricLabel: 'Current stage' }
  },
  {
    name: 'GenerateItBrief', folder: 'generateItBrief', id: '881d4420-beb1-457f-aafb-96e446d75663',
    operation: 'information', lens: 'contextual', route: 'brief/current-scope', title: 'IT brief',
    description: 'Use only when the user asks for a brief, recap, executive summary, or narrative across a personal, team, or company scope. Do not use for a specific metric or action.',
    properties: [
      { name: 'scope', type: 'string', description: 'Optional personal, team, or company scope.' },
      { name: 'focus', type: 'string', description: 'Optional topic to emphasize.' }
    ],
    previewProperties: { scope: 'company', focus: 'risks and decisions' }, transientSnapshot: 'selection',
    education: { category: 'Briefings', samplePrompt: 'Generate a company IT brief focused on risks and decisions.' },
    visualIdentity: { kind: 'briefing', accent: '#005A9E', metricLabel: 'Priority decisions' }
  },
  {
    name: 'ExploreAgentCapabilities', folder: 'exploreAgentCapabilities', id: '796b08ab-b3ea-412d-9ff2-9e3fa7d77c01',
    operation: 'education', lens: 'education', route: 'education/capabilities', title: 'IT Concierge capabilities',
    description: 'Use only for broad capability discovery such as what can you do, available scenarios, or help getting started. Do not use when the user asks for any specific IT task.',
    properties: [
      { name: 'query', type: 'string', description: 'Optional capability search query.' },
      { name: 'lens', type: 'string', description: 'Optional Me, Team, or Company lens filter.' }
    ],
    previewProperties: { query: 'Surface refresh', lens: 'all' }, transientSnapshot: 'education',
    education: { category: 'Discover', samplePrompt: 'Explore what Zava IT Concierge can do.' },
    visualIdentity: { kind: 'capability-catalog', accent: '#243A5E', metricLabel: 'Operational tools' }
  }
] as const satisfies readonly IIntentDefinition[];

export type IntentName = typeof INTENT_CATALOG[number]['name'];

export function getIntentDefinition(name: IntentName): IIntentDefinition {
  const intent: IIntentDefinition | undefined = INTENT_CATALOG.find((candidate) => candidate.name === name);
  if (!intent) {
    throw new Error(`Unknown intent: ${name}`);
  }

  return intent;
}