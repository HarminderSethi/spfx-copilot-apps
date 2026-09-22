# Zava Customer Resolution - Routing Matrix

Generated from the immutable intent catalog and canonical conversation starters.

| Tool | Operation | Workspace | Full-screen route | Primary prompt |
| --- | --- | --- | --- | --- |
| `TriageCustomerIssue` | submit | my-queue | `my-queue/new-case` | coral |
| `GetPriorityServiceQueue` | information | my-queue | `my-queue/priority` | citrus |
| `ExploreCustomerHealth` | information | customer-360 | `customer-360/overview` | teal |
| `BuildResolutionPlan` | submit | resolution-room | `resolution-room/plan` | teal |
| `StartExpertSwarm` | submit | resolution-room | `resolution-room/swarm` | citrus |
| `DetectServiceIncident` | information | service-operations | `service-operations/incident-detection` | coral |
| `ReviewIncidentResponse` | review | resolution-room | `resolution-room/incident-review` | coral |
| `ReviewServiceRecovery` | review | customer-360 | `customer-360/service-recovery` | citrus |
| `ComposeCustomerUpdate` | submit | customer-360 | `customer-360/communications` | teal |
| `TrackResolutionOutcome` | information | customer-360 | `customer-360/outcomes` | teal |
| `CreateKnowledgeFromResolution` | submit | resolution-room | `resolution-room/knowledge` | teal |
| `ExploreServicePerformance` | information | service-operations | `service-operations/demand` | coral |
| `ExploreRegionalServiceImpact` | information | service-operations | `service-operations/regional-impact` | teal |
| `ExploreRecurringServiceDrivers` | information | service-operations | `service-operations/recurring-drivers` | citrus |
| `DiagnoseCaseEvidence` | information | resolution-room | `resolution-room/diagnostics` | coral |
| `ReviewEntitlementCoverage` | information | customer-360 | `customer-360/entitlement` | citrus |
| `ManageCaseEscalation` | review | my-queue | `my-queue/escalation` | coral |
| `BalanceServiceWorkload` | information | service-operations | `service-operations/workload` | citrus |
| `CoordinateFieldService` | submit | resolution-room | `resolution-room/field-service` | teal |
| `ManageCustomerCommitments` | review | customer-360 | `customer-360/commitments` | citrus |
| `RunServiceQualityReview` | review | service-operations | `service-operations/quality-review` | teal |
| `PlanCustomerWinBack` | submit | customer-360 | `customer-360/win-back` | coral |
| `ExploreAgentCapabilities` | education | education | `education/capabilities` | teal |

## Conversation Starters

- **Resolve a customer issue:** Build a resolution plan for Alpine House's store activation issue. -> `BuildResolutionPlan`
- **Priority queue:** Show the customer cases that need my judgment now. -> `GetPriorityServiceQueue`
- **Incident signal:** Are today's activation cases isolated or a broader incident? -> `DetectServiceIncident`
- **Customer portfolio:** Which customer relationships need leadership attention? -> `ExploreCustomerHealth`
- **Service operations:** Show where service performance needs leadership intervention. -> `ExploreServicePerformance`
- **Explore capabilities:** Explore what the Customer Resolution agent can do. -> `ExploreAgentCapabilities`
