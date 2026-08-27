import type { IIntentDefinition } from '../../intents/intentCatalog';
import type { IntentName } from '../../intents/intentCatalog';
import { buildAgeCohorts, buildFleetCells, buildIncidentNodes, buildSpendBridge, buildTicketTrend, buildTopIssues } from '../../data/analytics';
import { MOCK_GRAPH } from '../../data/mockData';

export type BabylonChartKind = 'ring' | 'columns' | 'landscape' | 'network' | 'horizon' | 'product' | 'journey' | 'line' | 'pareto' | 'waterfall';

export interface IBabylonMark {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly secondaryValue?: number;
  readonly color: string;
  readonly group?: string;
  readonly parentId?: string;
  readonly longitude?: number;
  readonly latitude?: number;
  readonly riskCount?: number;
}

export interface IBabylonChartModel {
  readonly kind: BabylonChartKind;
  readonly title: string;
  readonly ariaLabel: string;
  readonly valueFormat: 'count' | 'currency' | 'percent';
  readonly marks: readonly IBabylonMark[];
}

const MARK_COLORS = ['#0078D4', '#00B7C3', '#0F7B0F', '#986F0B', '#C50F1F', '#8764B8', '#CA5010', '#038387'];
const REGION_COORDINATES: Readonly<Record<string, { readonly longitude: number; readonly latitude: number }>> = {
  'North America': { longitude: -102, latitude: 43 },
  Europe: { longitude: 14, latitude: 50 },
  'Asia Pacific': { longitude: 116, latitude: 14 },
  'Latin America': { longitude: -60, latitude: -17 }
};

interface IChartPoint {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly secondaryValue?: number;
}

function withColors(points: readonly { readonly id: string; readonly label: string; readonly value: number; readonly secondaryValue?: number }[]): readonly IBabylonMark[] {
  return points.map((point, index) => ({ ...point, color: MARK_COLORS[index % MARK_COLORS.length] }));
}

const PURPOSE_MARKS: Readonly<Record<IntentName, readonly IChartPoint[]>> = {
  MyDeviceStatus: [
    { id: 'overall-health', label: 'Overall health', value: 76 },
    { id: 'compliance', label: 'Compliance', value: 100 },
    { id: 'warranty-window', label: 'Warranty window', value: 20 },
    { id: 'lifecycle', label: 'Lifecycle readiness', value: 88 }
  ],
  GetDeviceHealth: [
    { id: 'battery', label: 'Battery capacity', value: 62 },
    { id: 'storage', label: 'Storage headroom', value: 71 },
    { id: 'performance', label: 'Performance stability', value: 78 },
    { id: 'patch', label: 'Patch readiness', value: 92 }
  ],
  GetRefreshEligibility: [
    { id: 'assigned', label: 'Device assigned', value: 100 },
    { id: 'age', label: 'Lifecycle elapsed', value: 88 },
    { id: 'warranty', label: 'Warranty elapsed', value: 64 },
    { id: 'eligible', label: 'Eligibility countdown', value: 22 }
  ],
  ExploreDeviceCatalog: [
    { id: 'surface-laptop-13', label: 'Laptop 13-inch', value: 1199 },
    { id: 'surface-laptop-138', label: 'Laptop 13.8-inch', value: 1699 },
    { id: 'surface-pro-13', label: 'Pro 13-inch', value: 1899 }
  ],
  ConfigureDeviceRequest: [
    { id: 'base-device', label: 'Base device', value: 1699 },
    { id: 'memory-option', label: '32 GB memory', value: 300 },
    { id: 'dock-option', label: 'USB4 dock', value: 199 }
  ],
  DraftDeviceJustification: [
    { id: 'workshops', label: 'Customer workshops', value: 4 },
    { id: 'battery-evidence', label: 'Battery evidence', value: 62 },
    { id: 'device-age', label: 'Device age months', value: 42 },
    { id: 'policy-fit', label: 'Policy fit', value: 100 }
  ],
  ReportItIssue: [
    { id: 'reproductions', label: 'Reproductions today', value: 2 },
    { id: 'meetings', label: 'Meetings affected', value: 4 },
    { id: 'diagnostics', label: 'Diagnostic signals', value: 8 },
    { id: 'severity', label: 'Severity score', value: 60 }
  ],
  RunDeviceDiagnostics: [
    { id: 'connectivity', label: 'Connectivity check', value: 100 },
    { id: 'patch-check', label: 'Patch baseline', value: 100 },
    { id: 'battery-check', label: 'Battery capacity', value: 71 },
    { id: 'workload-check', label: 'Workload stability', value: 94 }
  ],
  GetMyRequests: [
    { id: 'submitted', label: 'Request submitted', value: 100 },
    { id: 'manager-review', label: 'Manager review', value: 65 },
    { id: 'procurement', label: 'Procurement', value: 38 },
    { id: 'delivery', label: 'Delivery readiness', value: 12 }
  ],
  FindKnowledgeMatch: [
    { id: 'top-match', label: 'Top match confidence', value: 96 },
    { id: 'device-signal', label: 'Device match', value: 92 },
    { id: 'symptom-signal', label: 'Symptom match', value: 89 },
    { id: 'context-signal', label: 'Context match', value: 84 }
  ],
  TrackDeviceShipment: [
    { id: 'order', label: 'Order confirmed', value: 100 },
    { id: 'imaging', label: 'Zava imaging', value: 100 },
    { id: 'carrier', label: 'Carrier transit', value: 68 },
    { id: 'delivery', label: 'Delivery', value: 32 },
    { id: 'setup', label: 'Employee setup', value: 12 },
    { id: 'return', label: 'Old device return', value: 4 }
  ],
  ReviewDeviceApproval: [
    { id: 'evidence', label: 'Evidence complete', value: 100 },
    { id: 'policy', label: 'Policy fit', value: 100 },
    { id: 'budget', label: 'Budget remaining', value: 31 },
    { id: 'request-age', label: 'Request age days', value: 2 }
  ],
  GetApprovalQueue: [
    { id: 'decision-ready', label: 'Decision ready', value: 5 },
    { id: 'aging', label: 'Past target', value: 2 },
    { id: 'exceptions', label: 'Policy exceptions', value: 1 },
    { id: 'new-today', label: 'New today', value: 3 }
  ],
  GetTeamBudget: [
    { id: 'spent-share', label: 'Spent', value: 49 },
    { id: 'committed-share', label: 'Committed', value: 17 },
    { id: 'pending-share', label: 'Pending', value: 5 },
    { id: 'available-share', label: 'Available', value: 29 }
  ],
  GetTeamAssets: [
    { id: 'healthy-assets', label: 'Healthy devices', value: 82 },
    { id: 'near-refresh', label: 'Near refresh', value: 18 },
    { id: 'eligible-now', label: 'Eligible now', value: 11 },
    { id: 'compliant-assets', label: 'Compliant', value: 94 }
  ],
  PreviewRequestCost: [
    { id: 'hardware', label: 'Surface hardware', value: 1699 },
    { id: 'accessory', label: 'USB4 dock', value: 199 },
    { id: 'tax', label: 'Estimated tax', value: 170 },
    { id: 'request-total', label: 'Request total', value: 2068 },
    { id: 'remaining', label: 'Budget remaining', value: 30481 }
  ],
  ReviewPolicyException: [
    { id: 'role-fit', label: 'Role fit', value: 55 },
    { id: 'cost-threshold', label: 'Policy threshold', value: 118 },
    { id: 'alternative-fit', label: 'Alternative fit', value: 92 },
    { id: 'safeguards', label: 'Safeguards complete', value: 75 }
  ],
  GetTeamTicketTrend: [
    { id: 'may-tickets', label: 'May tickets', value: 37 },
    { id: 'jun-tickets', label: 'June tickets', value: 42 },
    { id: 'jul-tickets', label: 'July tickets', value: 39 },
    { id: 'aug-tickets', label: 'August tickets', value: 41 }
  ],
  DelegateApproval: [
    { id: 'role-match', label: 'Role match', value: 100 },
    { id: 'availability', label: 'Availability', value: 86 },
    { id: 'conflicts', label: 'Conflict risk', value: 4 },
    { id: 'queue-load', label: 'Open approvals', value: 7 }
  ],
  GetFleetHealth: [{ id: 'fleet-placeholder', label: 'Fleet health', value: 77 }],
  GetDeviceAgeDistribution: [
    { id: 'under-1', label: 'Under 1 year', value: 22 },
    { id: '1-2', label: '1-2 years', value: 41 },
    { id: '2-3', label: '2-3 years', value: 48 },
    { id: '3-4', label: '3-4 years', value: 35 },
    { id: '4-5', label: '4-5 years', value: 21 },
    { id: '5-plus', label: '5+ years', value: 13 }
  ],
  GetTicketDeflectionTrend: [
    { id: 'may-deflection', label: 'May deflection', value: 58 },
    { id: 'jun-deflection', label: 'June deflection', value: 61 },
    { id: 'jul-deflection', label: 'July deflection', value: 64 },
    { id: 'aug-deflection', label: 'August deflection', value: 68 }
  ],
  GetTopItIssues: [{ id: 'issue-placeholder', label: 'Top issues', value: 73 }],
  GetServiceHealth: [
    { id: 'exchange', label: 'Exchange Online', value: 100 },
    { id: 'teams', label: 'Microsoft Teams', value: 62 },
    { id: 'sharepoint', label: 'SharePoint Online', value: 100 },
    { id: 'intune', label: 'Microsoft Intune', value: 71 },
    { id: 'onedrive', label: 'OneDrive', value: 100 }
  ],
  GetLicenseReclaim: [
    { id: 'active-share', label: 'Active licenses', value: 79 },
    { id: 'low-use-share', label: 'Low use', value: 11 },
    { id: 'protected-share', label: 'Safeguarded', value: 4 },
    { id: 'reclaimable-share', label: 'Reclaimable', value: 6 }
  ],
  GetItSpendBridge: [{ id: 'spend-placeholder', label: 'Spend bridge', value: 68 }],
  PlanRefreshWaves: [{ id: 'wave-placeholder', label: 'Refresh waves', value: 42 }],
  CorrelateMajorIncident: [{ id: 'incident-placeholder', label: 'Incident signals', value: 82 }],
  GetProcessJourney: [
    { id: 'catalog', label: 'Catalog selected', value: 100 },
    { id: 'configure', label: 'Configuration complete', value: 100 },
    { id: 'justify', label: 'Justification complete', value: 100 },
    { id: 'review', label: 'Manager review', value: 60 },
    { id: 'fulfill', label: 'Fulfillment', value: 10 }
  ],
  GenerateItBrief: [
    { id: 'estate-posture', label: 'Estate posture', value: 82 },
    { id: 'service-posture', label: 'Service posture', value: 60 },
    { id: 'refresh-readiness', label: 'Refresh readiness', value: 71 },
    { id: 'approval-flow', label: 'Approval flow', value: 54 }
  ],
  ExploreAgentCapabilities: [
    { id: 'me-capabilities', label: 'Me capabilities', value: 11 },
    { id: 'team-capabilities', label: 'Team capabilities', value: 8 },
    { id: 'company-capabilities', label: 'Company capabilities', value: 11 },
    { id: 'action-capabilities', label: 'Action workflows', value: 7 }
  ]
};

export function buildChartModel(intent: IIntentDefinition): IBabylonChartModel {
  const graph = MOCK_GRAPH;
  let kind: BabylonChartKind = 'columns';
  let valueFormat: IBabylonChartModel['valueFormat'] = 'count';
  let marks: readonly IBabylonMark[] = withColors(PURPOSE_MARKS[intent.name as IntentName]);

  if (intent.visualIdentity.kind === 'status-ring' || intent.visualIdentity.kind === 'health-gauges' || intent.visualIdentity.kind === 'budget-gauge' || intent.visualIdentity.kind === 'license-partition') {
    kind = 'ring';
    valueFormat = 'percent';
  } else if (intent.visualIdentity.kind === 'estate-landscape') {
    kind = 'landscape';
    valueFormat = 'percent';
    marks = buildFleetCells(graph).map((cell) => ({
      id: cell.id,
      label: `${cell.region} / ${cell.department}`,
      value: cell.health,
      secondaryValue: cell.devices,
      color: cell.health >= 80 ? '#24A148' : cell.health >= 75 ? '#00A6B2' : cell.health >= 70 ? '#E6A700' : '#D13438',
      group: cell.region,
      longitude: REGION_COORDINATES[cell.region].longitude,
      latitude: REGION_COORDINATES[cell.region].latitude,
      riskCount: cell.critical
    }));
  } else if (intent.visualIdentity.kind === 'incident-constellation') {
    kind = 'network';
    marks = buildIncidentNodes(graph).map((node, index) => ({ id: node.id, label: node.label, value: node.severity, color: MARK_COLORS[index % MARK_COLORS.length], group: node.group, parentId: node.parentId }));
  } else if (intent.visualIdentity.kind === 'refresh-horizon') {
    kind = 'horizon';
    marks = graph.refreshWaves.map((wave, index) => ({ id: wave.id, label: `${wave.quarter} / ${wave.region}`, value: wave.devices, secondaryValue: wave.capacity, color: wave.devices > wave.capacity ? '#C50F1F' : MARK_COLORS[index % 4], group: wave.quarter }));
  } else if (intent.visualIdentity.kind === 'product-stage' || intent.visualIdentity.kind === 'configurator') {
    kind = 'product';
  } else if (['policy-timeline', 'diagnostic-sequence', 'request-timeline', 'shipment-journey', 'process-journey'].indexOf(intent.visualIdentity.kind) >= 0) {
    kind = 'journey';
  } else if (intent.visualIdentity.kind === 'trend-small-multiples' || intent.visualIdentity.kind === 'deflection-trend') {
    kind = 'line';
    if (intent.visualIdentity.kind === 'trend-small-multiples') {
      marks = withColors(buildTicketTrend(graph));
    } else {
      valueFormat = 'percent';
      marks = withColors(buildTicketTrend(graph).map((point) => ({ id: point.id, label: point.label, value: point.secondaryValue ?? 0 })));
    }
  } else if (intent.visualIdentity.kind === 'pareto') {
    kind = 'pareto';
    marks = withColors(buildTopIssues(graph));
  } else if (intent.visualIdentity.kind === 'cost-bridge' || intent.visualIdentity.kind === 'spend-waterfall') {
    kind = 'waterfall';
    valueFormat = 'currency';
    if (intent.visualIdentity.kind === 'spend-waterfall') {
      marks = withColors(buildSpendBridge(graph).map((point) => ({ ...point, value: Math.abs(point.value) })));
    }
  } else if (intent.name === 'GetDeviceAgeDistribution') {
    marks = withColors(buildAgeCohorts(graph));
  } else if (intent.name === 'GetServiceHealth') {
    valueFormat = 'percent';
  }

  return {
    kind,
    title: intent.title,
    ariaLabel: `${intent.title}. ${marks.length} selectable data marks.`,
    valueFormat,
    marks
  };
}