import type { ServiceHealthSeverity } from '../models';

type StatusLabelKey =
  | 'StatusServiceOperational'
  | 'StatusInvestigating'
  | 'StatusRestoringService'
  | 'StatusVerifyingService'
  | 'StatusServiceRestored'
  | 'StatusPostIncidentReviewPublished'
  | 'StatusServiceDegradation'
  | 'StatusServiceInterruption'
  | 'StatusExtendedRecovery'
  | 'StatusFalsePositive'
  | 'StatusInvestigationSuspended'
  | 'StatusResolved'
  | 'StatusMitigatedExternal'
  | 'StatusMitigated'
  | 'StatusResolvedExternal'
  | 'StatusConfirmed'
  | 'StatusReported'
  | 'StatusUnknown';

export type IServiceStatusStrings = { readonly [key in StatusLabelKey]: string };

interface IStatusDescriptor {
  severity: ServiceHealthSeverity;
  labelKey: StatusLabelKey;
}

/** Maps the Graph `serviceHealthStatus` enum onto a display label and severity. */
const STATUS_MAP: Readonly<Record<string, IStatusDescriptor>> = {
  serviceoperational: { severity: 'healthy', labelKey: 'StatusServiceOperational' },
  servicerestored: { severity: 'healthy', labelKey: 'StatusServiceRestored' },
  postincidentreviewpublished: { severity: 'healthy', labelKey: 'StatusPostIncidentReviewPublished' },
  falsepositive: { severity: 'healthy', labelKey: 'StatusFalsePositive' },
  resolved: { severity: 'healthy', labelKey: 'StatusResolved' },
  resolvedexternal: { severity: 'healthy', labelKey: 'StatusResolvedExternal' },
  investigating: { severity: 'incident', labelKey: 'StatusInvestigating' },
  restoringservice: { severity: 'incident', labelKey: 'StatusRestoringService' },
  verifyingservice: { severity: 'incident', labelKey: 'StatusVerifyingService' },
  servicedegradation: { severity: 'incident', labelKey: 'StatusServiceDegradation' },
  serviceinterruption: { severity: 'incident', labelKey: 'StatusServiceInterruption' },
  confirmed: { severity: 'incident', labelKey: 'StatusConfirmed' },
  extendedrecovery: { severity: 'advisory', labelKey: 'StatusExtendedRecovery' },
  investigationsuspended: { severity: 'advisory', labelKey: 'StatusInvestigationSuspended' },
  mitigated: { severity: 'advisory', labelKey: 'StatusMitigated' },
  mitigatedexternal: { severity: 'advisory', labelKey: 'StatusMitigatedExternal' },
  reported: { severity: 'advisory', labelKey: 'StatusReported' }
};

const UNKNOWN_STATUS: IStatusDescriptor = { severity: 'unknown', labelKey: 'StatusUnknown' };

function getStatusDescriptor(status: string | undefined): IStatusDescriptor {
  return (status && STATUS_MAP[status.toLowerCase()]) || UNKNOWN_STATUS;
}

export function getServiceSeverity(status: string | undefined): ServiceHealthSeverity {
  return getStatusDescriptor(status).severity;
}

export function getServiceStatusLabel(status: string | undefined, strings: IServiceStatusStrings): string {
  return strings[getStatusDescriptor(status).labelKey];
}

/**
 * Issue severity comes from `classification`; Graph only distinguishes advisory
 * from incident, and anything else is treated as an incident so it stays visible.
 */
export function getIssueSeverity(classification: string | undefined, isResolved: boolean | undefined): ServiceHealthSeverity {
  if (isResolved) {
    return 'healthy';
  }

  return classification?.toLowerCase() === 'advisory' ? 'advisory' : 'incident';
}

const SEVERITY_ORDER: Readonly<Record<ServiceHealthSeverity, number>> = {
  incident: 0,
  advisory: 1,
  unknown: 2,
  healthy: 3
};

export function compareSeverity(first: ServiceHealthSeverity, second: ServiceHealthSeverity): number {
  return SEVERITY_ORDER[first] - SEVERITY_ORDER[second];
}
