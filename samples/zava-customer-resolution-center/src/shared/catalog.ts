export type ServiceLens = 'my-queue' | 'customer-360' | 'resolution-room' | 'service-operations' | 'education';
export type ServiceOperation = 'information' | 'review' | 'submit' | 'education';
export type ServiceIntentKey =
  | 'TriageCustomerIssue' | 'GetPriorityServiceQueue' | 'ExploreCustomerHealth' | 'BuildResolutionPlan'
  | 'StartExpertSwarm' | 'DetectServiceIncident' | 'ReviewIncidentResponse' | 'ReviewServiceRecovery'
  | 'ComposeCustomerUpdate' | 'TrackResolutionOutcome' | 'CreateKnowledgeFromResolution'
  | 'ExploreServicePerformance' | 'DiagnoseCaseEvidence' | 'ReviewEntitlementCoverage'
  | 'ManageCaseEscalation' | 'BalanceServiceWorkload' | 'CoordinateFieldService'
  | 'ManageCustomerCommitments' | 'RunServiceQualityReview' | 'PlanCustomerWinBack'
  | 'ExploreRegionalServiceImpact' | 'ExploreRecurringServiceDrivers'
  | 'ExploreAgentCapabilities';

export interface IServiceProperties {
  readonly message?: string;
  readonly caseId?: string;
  readonly customerId?: string;
  readonly customerHint?: string;
  readonly product?: string;
  readonly productHint?: string;
  readonly region?: string;
  readonly period?: string;
  readonly language?: string;
  readonly channel?: string;
  readonly focus?: string;
  readonly selectedId?: string;
  readonly query?: string;
  readonly amount?: number;
  readonly similarityThreshold?: number;
}

export interface IServiceIntentDefinition {
  readonly key: ServiceIntentKey;
  readonly title: string;
  readonly lens: ServiceLens;
  readonly route: string;
  readonly operation: ServiceOperation;
  readonly role: string;
  readonly decisionQuestion: string;
  readonly outcome: string;
  readonly excludes: string;
  readonly prompt: string;
  readonly accent: 'teal' | 'coral' | 'citrus';
}

const intent = (
  key: ServiceIntentKey, title: string, lens: ServiceLens, route: string, operation: ServiceOperation,
  role: string, decisionQuestion: string, outcome: string, excludes: string, prompt: string,
  accent: 'teal' | 'coral' | 'citrus' = 'teal'
): IServiceIntentDefinition => ({ key, title, lens, route, operation, role, decisionQuestion, outcome, excludes, prompt, accent });

export const INTENTS: readonly IServiceIntentDefinition[] = [
  intent('TriageCustomerIssue','Triage customer issue','my-queue','my-queue/new-case','submit','Amina Yusuf','What did the customer experience, and what must we establish first?','Creates a review-ready case with entitlement and SLA preview.','Do not use after a case and resolution goal already exist.',"A customer cannot activate 42 devices. Help me triage the issue.",'coral'),
  intent('GetPriorityServiceQueue','Priority service queue','my-queue','my-queue/priority','information','Megan Bowen','Which customer case needs my judgment now?','Ranks cases with exact SLA, impact, sentiment, and ownership reasons.','Do not use for detailed diagnosis of one selected case.','Show the customer cases that need my judgment now.','citrus'),
  intent('ExploreCustomerHealth','Explore customer health','customer-360','customer-360/overview','information','Megan Bowen','Why does this issue matter to the relationship?','Connects service history, goals, commitments, adoption, and retention exposure.','Do not use for aggregate service operations.','Show why Northwind service health is falling.','teal'),
  intent('BuildResolutionPlan','Build resolution plan','resolution-room','resolution-room/plan','submit','Amina Yusuf','Is the proposed resolution grounded enough to act?','Builds an editable evidence-linked plan with owners and SLA consequence.','Do not use to declare an incident or approve recovery.','Build a resolution plan for Alpine House store activation issue.','teal'),
  intent('StartExpertSwarm','Start expert swarm','resolution-room','resolution-room/swarm','submit','Pradeep Gupta','Who can answer the bounded decision question in time?','Creates a reviewed expert handoff with only the required evidence.','Do not use for queue reassignment.','Bring the right activation specialists into this case.','citrus'),
  intent('DetectServiceIncident','Detect service incident','service-operations','service-operations/incident-detection','information','Pradeep Gupta','Are these cases isolated or one emerging incident?','Rebuilds a deterministic cohort from symptom, version, region, and time.','Do not use to declare or close an incident.','Are today activation cases isolated or a broader incident?','coral'),
  intent('ReviewIncidentResponse','Review incident response','resolution-room','resolution-room/incident-review','review','Pradeep Gupta','Should we declare, monitor, escalate, or close this incident candidate?','Shows impact, confidence, workaround, audience, and consequence before decision.','Do not use for exploratory clustering.','Review the response for the activation incident candidate.','coral'),
  intent('ReviewServiceRecovery','Review service recovery','customer-360','customer-360/service-recovery','review','Megan Bowen','What remedy is fair, effective, and authorized?','Compares policy, authority, cost, precedent, and customer outcome.','Do not use to compose or send customer communication.','Review the recovery options for case ZCR-1048.','citrus'),
  intent('ComposeCustomerUpdate','Compose customer update','customer-360','customer-360/communications','submit','Amina Yusuf','What can we accurately promise the customer now?','Creates a localized reviewed update from customer-safe facts.','Do not expose internal diagnostics or unapproved concessions.','Draft a French and English update for Alpine House.','teal'),
  intent('TrackResolutionOutcome','Track resolution outcome','customer-360','customer-360/outcomes','information','Megan Bowen','Did the resolution restore the customer promise?','Tracks confirmation, SLA, reopen risk, cost, owner, and next check.','Do not use for aggregate service performance.','Show the verified outcome for ZCR-1048.','teal'),
  intent('CreateKnowledgeFromResolution','Create resolution knowledge','resolution-room','resolution-room/knowledge','submit','Pradeep Gupta','What proven resolution can safely be reused?','Creates an evidence-grounded article with applicability and exclusions.','Do not generalize unverified or customer-specific details.','Create knowledge from the verified activation resolution.','teal'),
  intent('ExploreServicePerformance','Explore service performance','service-operations','service-operations/demand','information','Joni Sherman','How is service demand moving, and is resolution catching up?','Shows a demand-to-resolution trend with peak, current volume, and exact change.','Do not use for geography, recurring drivers, or one representative queue.','Show how service demand and resolution are moving today.','coral'),
  intent('ExploreRegionalServiceImpact','Explore regional service impact','service-operations','service-operations/regional-impact','information','Joni Sherman','Which regions carry the greatest customer impact and SLA exposure?','Maps regional case volume, SLA risk, recovery exposure, and exact customer outcomes.','Do not use for demand trends, recurring cause analysis, or one named customer.','Show where regional service impact needs leadership attention.','teal'),
  intent('ExploreRecurringServiceDrivers','Explore recurring service drivers','service-operations','service-operations/recurring-drivers','information','Joni Sherman','Which recurring service drivers create the most avoidable customer effort?','Ranks recurring causes by case volume and share of demand with exact values.','Do not use for geography, demand trends, or one named incident cohort.','Show the recurring service drivers causing the most customer effort.','citrus'),
  intent('DiagnoseCaseEvidence','Diagnose case evidence','resolution-room','resolution-room/diagnostics','information','Pradeep Gupta','Which hypothesis best fits the verified signals?','Compares hypotheses, signals, known changes, prior fixes, and gaps.','Do not use to confirm an unsupported cause.','Diagnose the evidence for case ZCR-1048.','coral'),
  intent('ReviewEntitlementCoverage','Review entitlement coverage','customer-360','customer-360/entitlement','information','Megan Bowen','What response and remedy does the agreement require?','Explains effective clauses, exclusions, SLA, and exception path.','Do not use to approve compensation.','Review Alpine House entitlement coverage.','citrus'),
  intent('ManageCaseEscalation','Manage case escalation','my-queue','my-queue/escalation','review','Diego Siciliani','Where should this case move, with what evidence and acceptance criteria?','Reviews target capacity, authority, owner, package, and SLA consequence.','Do not use to recruit an expert swarm.','Escalate ZCR-1048 to the right team.','coral'),
  intent('BalanceServiceWorkload','Balance service workload','service-operations','service-operations/workload','information','Diego Siciliani','Where is capacity creating SLA risk, and how should work move?','Maps team utilization, open demand, and SLA exposure before a skill-aware reassignment.','Do not silently reassign work through drag and drop.','Show where team capacity is creating SLA risk today.','citrus'),
  intent('CoordinateFieldService','Coordinate field service','resolution-room','resolution-room/field-service','submit','Nestor Wilke','Which sites, people, parts, and windows make the visit ready?','Builds a reviewed dispatch scenario with route and promise consequence.','Do not use for digital-only resolution steps.','Plan visits for stores that failed rollback.','teal'),
  intent('ManageCustomerCommitments','Manage customer commitments','customer-360','customer-360/commitments','review','Megan Bowen','Which company or customer promise is at risk?','Governs bilateral commitments with source, owner, dependency, and impact.','Do not infer completion without evidence.','Show every open commitment for Alpine House.','citrus'),
  intent('RunServiceQualityReview','Run service quality review','service-operations','service-operations/quality-review','review','Diego Siciliani','Was the resolution correct, compliant, and low effort for the customer?','Records transparent findings and accountable coaching or remediation.','Do not use an opaque agent quality score.','Review the quality of case ZCR-1048.','teal'),
  intent('PlanCustomerWinBack','Plan customer win-back','customer-360','customer-360/win-back','submit','Megan Bowen','What actions could credibly restore trust?','Builds a guarded retention plan with harms, owners, offers, and measures.','Do not initiate external outreach automatically.','Build a trust recovery plan for Alpine House.','coral'),
  intent('ExploreAgentCapabilities','Explore agent capabilities','education','education/capabilities','education','All roles','Which customer-resolution scenario should I start?','Makes all 22 operations discoverable through safe previews.','Do not use for a specific operational request.','Explore what the Customer Resolution agent can do.','teal')
];

export const CASE_SCOPED_INTENTS: ReadonlySet<ServiceIntentKey> = new Set<ServiceIntentKey>([
  'BuildResolutionPlan', 'StartExpertSwarm', 'ReviewServiceRecovery', 'ComposeCustomerUpdate',
  'TrackResolutionOutcome', 'CreateKnowledgeFromResolution', 'DiagnoseCaseEvidence',
  'ReviewEntitlementCoverage', 'ManageCaseEscalation', 'CoordinateFieldService',
  'RunServiceQualityReview'
]);

export const getIntent = (key: ServiceIntentKey): IServiceIntentDefinition => {
  const found = INTENTS.find((item) => item.key === key);
  if (!found) throw new Error(`Unknown service intent: ${key}`);
  return found;
};

export const LENS_LABELS: Readonly<Record<ServiceLens, string>> = {
  'my-queue': 'My Queue',
  'customer-360': 'Customer 360',
  'resolution-room': 'Resolution Room',
  'service-operations': 'Service Operations',
  education: 'Capabilities'
};
