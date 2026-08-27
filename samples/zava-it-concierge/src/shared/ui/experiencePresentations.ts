import { buildAgeCohorts, buildFleetCells, buildSpendBridge, buildTicketTrend, buildTopIssues, getDeviceHealth } from '../data/analytics';
import { MOCK_GRAPH } from '../data/mockData';
import type { IntentName } from '../intents/intentCatalog';

export type ExperienceProfile = 'device' | 'journey' | 'catalog' | 'form' | 'queue' | 'roster' | 'analytics' | 'service' | 'brief' | 'education';
export type ExperienceTone = 'success' | 'warning' | 'danger' | 'neutral';

export interface IExperienceItem {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly detail?: string;
  readonly tone?: ExperienceTone;
  readonly persona?: 'megan' | 'diego' | 'lee';
}

export interface IExperiencePresentation {
  readonly profile: ExperienceProfile;
  readonly metricValue: string;
  readonly metricLabel: string;
  readonly insight: string;
  readonly items: readonly IExperienceItem[];
}

const graph = MOCK_GRAPH;
const meganDevice = graph.devices.find((device) => device.ownerId === 'megan') ?? graph.devices[0];
const meganSku = graph.surfaceCatalog.find((sku) => sku.id === meganDevice.skuId) ?? graph.surfaceCatalog[0];
const productBudget = graph.budgets.find((budget) => budget.department === 'Product' && budget.quarter === 'FY26 Q3') ?? graph.budgets[0];
const pendingRequest = graph.requests.find((request) => request.id === 'REQ-2048') ?? graph.requests[0];
const ageCohorts = buildAgeCohorts(graph);
const ticketTrend = buildTicketTrend(graph);
const topIssues = buildTopIssues(graph);
const spendBridge = buildSpendBridge(graph);
const fleetCells = buildFleetCells(graph);

function money(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function item(id: string, label: string, value: string, detail?: string, tone: ExperienceTone = 'neutral', persona?: 'megan' | 'diego' | 'lee'): IExperienceItem {
  return { id, label, value, detail, tone, persona };
}

export const EXPERIENCE_PRESENTATIONS: Readonly<Record<IntentName, IExperiencePresentation>> = {
  MyDeviceStatus: {
    profile: 'device', metricValue: `${getDeviceHealth(meganDevice)}%`, metricLabel: 'Overall health',
    insight: `${meganSku.name} is compliant; battery health is the only dimension below the Zava target.`,
    items: [item('asset', meganSku.name, meganDevice.id, 'Windows 11 Enterprise'), item('owner', 'Accountable owner', 'Megan Bowen', 'Product / North America', 'neutral', 'megan'), item('warranty', 'Warranty', '74 days remaining', 'Coverage ends Nov 4, 2026', 'warning'), item('compliance', 'Compliance', 'Compliant', 'Last checked today at 8:20 AM', 'success')]
  },
  GetDeviceHealth: {
    profile: 'device', metricValue: `${getDeviceHealth(meganDevice)}%`, metricLabel: 'Device health',
    insight: 'Patch and performance are healthy; battery runtime is the clearest constraint for mobile work.',
    items: [item('battery', 'Battery', `${meganDevice.batteryScore}%`, '2 h 15 m estimated runtime', 'warning'), item('storage', 'Storage', `${meganDevice.storageScore}%`, '455 GB available'), item('performance', 'Performance', `${meganDevice.performanceScore}%`, 'Good under current workload', 'success'), item('patch', 'Patch status', `${meganDevice.patchScore}%`, 'Up to date', 'success')]
  },
  GetRefreshEligibility: {
    profile: 'journey', metricValue: '74 days', metricLabel: 'Until eligibility',
    insight: 'The assigned Surface reaches Zava refresh eligibility when warranty coverage ends.',
    items: [item('assigned', 'Assigned', 'Feb 2023', 'Surface enrolled and compliant', 'success'), item('today', 'Current age', '42 months', 'Six months before policy threshold'), item('warranty', 'Warranty ends', 'Nov 4, 2026', 'Coverage remains active', 'warning'), item('eligible', 'Refresh eligible', 'Nov 5, 2026', 'Standard request path opens', 'success')]
  },
  ExploreDeviceCatalog: {
    profile: 'catalog', metricValue: '8', metricLabel: 'Surface device options',
    insight: 'Surface Laptop 13.8-inch balances hybrid collaboration, memory, availability, and policy fit.',
    items: graph.surfaceCatalog.filter((sku) => sku.category === 'device').map((sku) => item(sku.id, sku.name, money(sku.price), `${sku.memoryGb} GB / ${sku.storageGb} GB / ${sku.stock} in stock / ${sku.fit}`, sku.id === 'surface-laptop-138' ? 'success' : 'neutral'))
  },
  ConfigureDeviceRequest: {
    profile: 'form', metricValue: money(pendingRequest.cost), metricLabel: 'Estimated total',
    insight: 'The selected 32 GB configuration is within Product policy and current-quarter budget.',
    items: [item('model', 'Device', 'Surface Laptop 13.8-inch', 'Copilot+ PC'), item('processor', 'Processor', 'Snapdragon X Elite', 'Standard Product configuration'), item('memory', 'Memory / storage', '32 GB / 512 GB', 'Within role policy', 'success'), item('accessories', 'Accessories', 'Surface USB4 Dock', money(199))]
  },
  DraftDeviceJustification: {
    profile: 'form', metricValue: '4', metricLabel: 'Evidence sources',
    insight: 'The draft connects customer workshops, battery constraints, device age, and policy timing.',
    items: [item('outcome', 'Business outcome', 'Customer workshops', 'Reliable all-day facilitation'), item('health', 'Device evidence', 'Battery 62%', 'Below mobile-work target', 'warning'), item('age', 'Lifecycle evidence', '42 months', 'Approaching refresh threshold'), item('policy', 'Policy fit', 'Standard path', 'No exception required', 'success')]
  },
  ReportItIssue: {
    profile: 'form', metricValue: 'Medium', metricLabel: 'Suggested severity',
    insight: 'The symptom affects video calls while undocked and includes enough context for triage.',
    items: [item('symptom', 'Symptom', 'Calls drop when undocked', 'Reproduced twice today'), item('impact', 'Impact', 'Customer meetings', 'Workaround: remain docked', 'warning'), item('device', 'Device context', meganDevice.id, meganSku.name), item('attachment', 'Diagnostic metadata', 'Ready', 'No personal files included', 'success')]
  },
  RunDeviceDiagnostics: {
    profile: 'journey', metricValue: '3 / 4', metricLabel: 'Checks passed',
    insight: 'Battery wear is explainable; no self-heal action will run without a separate review.',
    items: [item('connectivity', 'Connectivity', 'Passed', 'Adapters and DNS healthy', 'success'), item('patch', 'Patch baseline', 'Passed', 'Current quality update', 'success'), item('battery', 'Battery health', 'Attention', '71% design capacity', 'warning'), item('performance', 'Workload trace', 'Passed', 'No sustained throttling', 'success')]
  },
  GetMyRequests: {
    profile: 'journey', metricValue: '3', metricLabel: 'Active requests',
    insight: 'The device request is waiting on Diego; shipment and support work continue independently.',
    items: [item('request', 'Device request', 'Manager review', 'REQ-2048 / updated 18 min ago', 'warning', 'diego'), item('shipment', 'USB4 Dock shipment', 'In transit', 'Expected in 2 days', 'success'), item('ticket', 'Call quality ticket', 'Investigating', 'Lee owns the correlated incident', 'warning', 'lee'), item('complete', 'Loaner return', 'Complete', 'Receipt retained', 'success')]
  },
  FindKnowledgeMatch: {
    profile: 'catalog', metricValue: '96%', metricLabel: 'Top match confidence',
    insight: 'The top article matches the Surface model, Teams symptom, and undocked network context.',
    items: graph.knowledge.map((article, index) => item(article.id, article.title, `${article.confidence}% match`, `${article.product} / ${article.minutes} min`, index === 0 ? 'success' : 'neutral'))
  },
  TrackDeviceShipment: {
    profile: 'journey', metricValue: '2 days', metricLabel: 'Expected delivery',
    insight: 'The Surface completed imaging and is in transit; setup guidance unlocks after delivery.',
    items: [item('order', 'Order confirmed', 'Complete', 'ORD-48291', 'success'), item('imaging', 'Zava imaging', 'Complete', 'Compliance profile applied', 'success'), item('carrier', 'Northwind Express', 'In transit', 'Regional distribution center', 'warning'), item('delivery', 'Delivery', 'Aug 24', 'Signature required'), item('return', 'Old device return', 'Not started', 'Kit ships after setup')]
  },
  ReviewDeviceApproval: {
    profile: 'queue', metricValue: money(pendingRequest.cost), metricLabel: 'Request cost',
    insight: "Megan's request is within policy and leaves 31% of the Product hardware budget uncommitted.",
    items: [item('requester', 'Megan Bowen', 'Product Manager', 'Requested 2 days ago', 'neutral', 'megan'), item('device', 'Surface Laptop 13.8-inch', '32 GB / 512 GB', 'Standard configuration'), item('budget', 'Budget after approval', money(productBudget.allocated - productBudget.spent - productBudget.committed - pendingRequest.cost), '31% remains', 'success'), item('evidence', 'Business case', '4 linked sources', 'Customer workshops and battery constraints', 'success')]
  },
  GetApprovalQueue: {
    profile: 'queue', metricValue: '4', metricLabel: 'Awaiting review',
    insight: 'Four submissions need a decision; completed approvals remain visible with their recorded outcome.',
    items: [item('req-2048', 'Megan Bowen', money(2068.98), 'Device / 2 days old', 'success', 'megan'), item('req-2051', 'Adele Vance', money(8999), 'Collaboration space / 5 days old', 'warning'), item('req-2053', 'Alex Wilber', money(1899), 'Device / 6 days old', 'danger'), item('req-2058', 'Johanna Lorenz', money(799), 'Frontline device / today')]
  },
  GetTeamBudget: {
    profile: 'analytics', metricValue: money(productBudget.allocated - productBudget.spent - productBudget.committed), metricLabel: 'Available budget',
    insight: 'Product remains within plan after committed work; pending device approvals would use another 4.6%.',
    items: [item('allocated', 'Allocated', money(productBudget.allocated), 'FY26 Q3'), item('spent', 'Spent', money(productBudget.spent), 'Posted actuals'), item('committed', 'Committed', money(productBudget.committed), 'Approved requests'), item('pending', 'Pending approvals', money(6218), 'Not yet committed', 'warning')]
  },
  GetTeamAssets: {
    profile: 'roster', metricValue: '18%', metricLabel: 'Refresh risk',
    insight: "Three Product devices are near policy threshold; Megan's battery score makes hers the priority.",
    items: [item('megan', 'Megan Bowen', 'Surface Laptop 13.8-inch', '42 months / attention', 'warning', 'megan'), item('diego', 'Diego Siciliani', 'Surface Laptop 15-inch', '18 months / healthy', 'success', 'diego'), item('adele', 'Adele Vance', 'Surface Pro 13-inch', '49 months / eligible', 'danger'), item('alex', 'Alex Wilber', 'Surface Laptop 13-inch', '27 months / healthy', 'success')]
  },
  PreviewRequestCost: {
    profile: 'analytics', metricValue: money(2068.98), metricLabel: 'One-time impact',
    insight: 'The request stays under the standard threshold and has no recurring license impact.',
    items: [item('hardware', 'Surface configuration', money(1699), 'One time'), item('accessory', 'USB4 Dock', money(199), 'One time'), item('tax', 'Estimated tax', money(170), 'Estimate'), item('remaining', 'Budget remaining', money(30481), 'After approval', 'success')]
  },
  ReviewPolicyException: {
    profile: 'queue', metricValue: '+18%', metricLabel: 'Above policy threshold',
    insight: 'The requested Studio configuration exceeds role policy; a standard Laptop option meets stated workloads.',
    items: [item('requester', 'Adele Vance', 'Product Designer', 'Exception EXC-0317'), item('requested', 'Surface Laptop Studio 2', money(2399), '32 GB / 1 TB', 'warning'), item('alternative', 'Surface Laptop 15-inch', money(2099), 'Meets workload evidence', 'success'), item('safeguard', 'Safeguard', 'Director approval', 'Required if exception proceeds')]
  },
  GetTeamTicketTrend: {
    profile: 'analytics', metricValue: `${ticketTrend[ticketTrend.length - 1].value}`, metricLabel: 'Tickets this month',
    insight: 'Product ticket volume is stable; performance incidents remain above the Zava cohort.',
    items: ticketTrend.slice(-4).map((point) => item(point.id, point.label, `${point.value} tickets`, `${point.secondaryValue}% deflected`, point.secondaryValue && point.secondaryValue > 65 ? 'success' : 'warning'))
  },
  DelegateApproval: {
    profile: 'roster', metricValue: '1', metricLabel: 'Eligible delegate',
    insight: 'Alex Wilber has the required role and no conflict with the selected request.',
    items: [item('diego', 'Diego Siciliani', 'Current approver', 'Unavailable Aug 24-28', 'warning', 'diego'), item('alex', 'Alex Wilber', 'Senior Manager', 'Eligible / recommended', 'success'), item('lee', 'Lee Gu', 'IT Operations Lead', 'Not in approval chain', 'neutral', 'lee')]
  },
  GetFleetHealth: {
    profile: 'analytics', metricValue: `${Math.round(fleetCells.reduce((sum, cell) => sum + cell.health, 0) / fleetCells.length)}%`, metricLabel: 'Fleet health',
    insight: 'Europe Engineering is the largest concentrated risk pocket, driven by battery and patch age.',
    items: fleetCells.slice().sort((left, right) => left.health - right.health).slice(0, 5).map((cell) => item(cell.id, `${cell.region} / ${cell.department}`, `${cell.health}%`, `${cell.devices} devices / ${cell.critical} critical`, cell.health < 68 ? 'danger' : cell.health < 78 ? 'warning' : 'success'))
  },
  GetDeviceAgeDistribution: {
    profile: 'analytics', metricValue: `${ageCohorts.slice(4).reduce((sum, cohort) => sum + cohort.value, 0)}`, metricLabel: 'At or past threshold',
    insight: 'The four-year threshold contains a manageable cohort, but the next wave grows materially in FY27.',
    items: ageCohorts.map((cohort) => item(cohort.id, cohort.label, `${cohort.value} devices`, cohort.id === '4-5' || cohort.id === '5-plus' ? 'Refresh candidate' : 'Within lifecycle', cohort.id === '5-plus' ? 'danger' : cohort.id === '4-5' ? 'warning' : 'success'))
  },
  GetTicketDeflectionTrend: {
    profile: 'analytics', metricValue: `${ticketTrend[ticketTrend.length - 1].secondaryValue}%`, metricLabel: 'Deflection rate',
    insight: 'Self-service adoption improved for password and VPN issues while hardware cases still need specialists.',
    items: ticketTrend.slice(-4).map((point) => item(point.id, point.label, `${point.secondaryValue}% deflected`, `${point.value} total tickets`, 'success'))
  },
  GetTopItIssues: {
    profile: 'analytics', metricValue: `${topIssues[4].secondaryValue}%`, metricLabel: 'Impact in top five',
    insight: 'Five categories account for most demand; Software access and VPN are the clearest automation targets.',
    items: topIssues.slice(0, 6).map((issue, index) => item(issue.id, issue.label, `${issue.value} tickets`, `${issue.secondaryValue}% cumulative`, index < 2 ? 'warning' : 'neutral'))
  },
  GetServiceHealth: {
    profile: 'service', metricValue: '3 / 5', metricLabel: 'Services healthy',
    insight: 'Teams media routing and Intune enrollment are degraded; Exchange, SharePoint, and OneDrive are healthy.',
    items: graph.services.map((service) => item(service.id, service.name, service.status === 'healthy' ? 'Healthy' : 'Degraded', service.incidentCount === 0 ? 'No active incidents' : `${service.incidentCount} active incident`, service.status === 'healthy' ? 'success' : 'warning', service.ownerId === 'lee' ? 'lee' : undefined))
  },
  GetLicenseReclaim: {
    profile: 'service', metricValue: money(graph.licenses.reduce((sum, license) => sum + license.annualValue, 0)), metricLabel: 'Annual opportunity',
    insight: 'Power BI Pro has the largest safe reclaim cohort after manager and recent-activity safeguards.',
    items: graph.licenses.map((license) => item(license.product, license.product, `${license.reclaimable} reclaimable`, `${money(license.annualValue)} annual value`, license.reclaimable > 40 ? 'warning' : 'neutral'))
  },
  GetItSpendBridge: {
    profile: 'analytics', metricValue: money(spendBridge[spendBridge.length - 1].value), metricLabel: 'Forecast remaining',
    insight: 'Committed hardware is the largest variance driver; forecast remains positive without deferring refresh work.',
    items: spendBridge.map((point) => item(point.id, point.label, money(Math.abs(point.value)), point.value < 0 ? 'Reduces remaining budget' : 'Available balance', point.id === 'remaining' ? 'success' : point.value < 0 ? 'warning' : 'neutral'))
  },
  PlanRefreshWaves: {
    profile: 'analytics', metricValue: '1', metricLabel: 'Wave above capacity',
    insight: 'Moving 14 Europe devices into FY27 Q1 keeps all waves within weekly deployment capacity.',
    items: graph.refreshWaves.slice(0, 6).map((wave) => item(wave.id, `${wave.quarter} / ${wave.region}`, `${wave.devices} devices`, `Capacity ${wave.capacity} / ${money(wave.cost)}`, wave.devices > wave.capacity ? 'danger' : 'success'))
  },
  CorrelateMajorIncident: {
    profile: 'service', metricValue: '18', metricLabel: 'Correlated signals',
    insight: 'Teams media failures in Europe and North America converge on one routing incident with 82% confidence.',
    items: [item('incident', 'INC-7091', 'Investigating', 'Intermittent Teams media routing', 'warning', 'lee'), item('service', 'Microsoft Teams', 'Primary service', 'Media relay path'), item('regions', 'Affected regions', '2', 'Europe / North America', 'warning'), item('tickets', 'Linked tickets', '12', 'Performance and call quality'), item('owner', 'Accountable owner', 'Lee Gu', 'IT Operations Lead', 'neutral', 'lee')]
  },
  GetProcessJourney: {
    profile: 'journey', metricValue: '3 / 5', metricLabel: 'Current stage',
    insight: 'REQ-2048 is waiting on manager review; budget, policy, and configuration evidence are complete.',
    items: [item('catalog', 'Catalog', 'Complete', 'Surface selected', 'success'), item('configure', 'Configure', 'Complete', '32 GB / 512 GB', 'success'), item('justify', 'Justify', 'Complete', 'Four evidence sources', 'success'), item('review', 'Manager review', 'Current', 'Diego Siciliani', 'warning', 'diego'), item('fulfill', 'Fulfillment', 'Pending', 'Starts after approval')]
  },
  GenerateItBrief: {
    profile: 'brief', metricValue: '3', metricLabel: 'Priority decisions',
    insight: 'Fleet posture is stable, with focused decisions needed on Teams routing, refresh capacity, and Product approvals.',
    items: [item('posture', 'Estate posture', '82% healthy', 'Europe Engineering needs attention', 'warning'), item('incident', 'Service decision', 'INC-7091', 'Keep investigation active', 'warning', 'lee'), item('refresh', 'Lifecycle decision', 'Shift 14 devices', 'Balances FY26 Q4 capacity', 'success'), item('approval', 'People decision', '7 pending', 'Two exceed review target', 'warning', 'diego')]
  },
  ExploreAgentCapabilities: {
    profile: 'education', metricValue: '30', metricLabel: 'Operational tools',
    insight: 'Search realistic Me, Team, and Company scenarios, then use a prompt to open the exact inline experience.',
    items: [item('me', 'Me', '11 capabilities', 'Device health, support, requests, knowledge'), item('team', 'Team', '8 capabilities', 'Approvals, budget, assets, delegation'), item('company', 'Company', '11 capabilities', 'Fleet, service, spend, incidents, briefings')]
  }
};