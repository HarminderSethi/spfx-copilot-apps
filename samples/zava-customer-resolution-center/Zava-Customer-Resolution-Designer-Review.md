# Zava Customer Resolution - Designer Review

## Readiness decision - 18 September 2026

**Ready for Microsoft design critique and guided validation. Not ready for final functionality or
accessibility sign-off.** The visual system, alignment, responsive composition, component uniqueness,
and primary inline/full-screen story are locally proven. Final acceptance still depends on completing
the exact-route and interaction gaps below plus authenticated host, keyboard, screen-reader, forced-
colors, and 200% zoom validation.

| Review area | Status | Evidence or remaining condition |
| --- | --- | --- |
| Visual hierarchy and alignment | Ready | 75 current captures, 36 layouts, no overflow or broken media; representative pixels inspected at inline, desktop, mobile, and dark sizes. |
| Component differentiation | Ready | 23 immutable tools, 23 published component screenshots, purpose-specific layouts and visualizations. |
| Responsive composition | Conditionally ready | 340/760 inline and mobile full-screen captures pass; 200% zoom and long localization remain open. |
| Inline list/detail experience | Ready for review | Eleven case-scoped tools support search, direct ID, no-match, detail, and return to search. |
| Core interaction behavior | Conditionally ready | Incident threshold and workspace continuation were exercised live; exact subroutes and selected queue detail remain open. |
| Copilot-visible state | Conditionally ready | Case, query, capability selection, and incident threshold publish bounded deduplicated context; workflow stage/draft and full-screen lens changes need complete coverage. |
| Keyboard and screen reader | Not signed off | Workflow stage focus and polite announcements are implemented; exhaustive keyboard, Narrator/NVDA, iframe focus, and host output require evidence. |
| Failure and permission states | Not ready | Loading, stale, partial failure, permission, policy conflict, bridge failure, and offline fallback boards remain open. |
| Tenant integration | Blocked externally | Requires authenticated Microsoft 365 Copilot/Workbench validation. |

## Findings requiring closure

### High priority before final functionality review

1. Implement exact full-screen subroutes for all catalog destinations. Current navigation proves four
	lens roots but does not yet distinguish every route such as `resolution-room/plan` versus
	`resolution-room/diagnostics`.
2. Publish operation stage, reviewed draft, confirmation, and receipt state to Copilot after material
	changes. Current bounded context covers entity/search and selected analytical state.
3. Complete every retained control audit. Triage fields and some full-screen analytical controls still
	need proof that they alter the review payload, records, calculations, or route.
4. Implement the explicit Copilot follow-up action and fresh-invocation reset required by the keynote
	contract; the host bridge exists, but no shipped UI invokes the follow-up callback.

### Design and accessibility evidence still required

1. Capture designed loading, empty, stale, partial-source, permission, policy-conflict, bridge-failure,
	and offline states. Case and capability no-match states are implemented, but the wider state board is
	not complete.
2. Run automated and manual keyboard focus, Narrator/NVDA, forced-colors, reduced-motion, 200% zoom,
	German expansion, Japanese, and Arabic RTL checks.
3. Measure contrast rather than relying on token intent, especially the dark analytical rail, hero
	overlays, small metadata, semantic badges, and chart labels. The hero persona box is now measured
	and passes at 13.5:1; the remaining surfaces still require systematic measurement.
4. Add copy-success/failure feedback to the capability explorer and verify focus restoration after
	list/detail and workflow transitions.

## Corrections completed in this review

- Resolution Room now guarantees visible, case-specific evidence for all 500 cases; four canonical
	stories use authored packs and remaining cases receive deterministic verified/inference/gap records.
- Customer 360 constellations now own distinct labels, node kinds, weights, angles, and coordinates per
	customer. Recovery matrices also use different remedies, costs, authority, precedent, and outcomes.
- Service Operations now has coordinated period, region, and product filters that materially update
	KPIs, demand path, map bubbles, drivers, and recovery exposure from one analytical state.
- Unscoped `ExploreCustomerHealth` now answers a leadership portfolio question with a health/risk/value
	matrix; scoped entry retains the customer-specific constellation.
- My Queue is now a complete judgment loop: selectable reasoned ranking, selected-case facts, exact
	Resolution Room continuation, guarded resolution confirmation, session queue removal, and automatic
	advance. Browser evidence proves `ZCR-1140` removal and continuation with next-selected `ZCR-1048`.
- Customer 360 and Resolution Room now distinguish scoped and unscoped entry. Direct tab navigation
	opens a searchable customer directory or active-resolution portfolio; inline `customerId`/`caseId`
	opens exact detail. Both details retain explicit return actions and selection survives tab changes.
- Alpine, Northwind, Contoso, and Fabrikam now have distinct goals, canonical cases, evidence types,
	commitments, relationship consequences, and resolution paths rather than one relabeled detail body.
- Leadership inline answers now deliberately vary visual grammar: performance uses river/map/Pareto,
	incident detection uses a threshold-controlled network, and workload uses a capacity/SLA-risk matrix.
- Browser process evidence confirms Customer directory -> Northwind detail -> directory and Resolution
	portfolio -> Alpine room -> tab switch -> persisted room -> portfolio.
- My Queue now uses Megan Bowen as the pictured queue owner, aligned to the approved bundled portrait
	and customer-priority role; Amina remains the representative for triage, planning, and communication.
- Full-screen hero persona boxes now use an opaque carbon surface instead of a pale translucent layer.
	Browser measurement confirms white text on `#173332` at 13.5:1 contrast across the shared header;
	forced-colors mode uses system Canvas colors.
- Workflow Draft -> Review -> Receipt changes now move focus to the stage heading and announce the
  changed state through a polite live region.
- Copilot model-context publication is deduplicated and inline case/query state is handed to the
  full-screen render path without treating capability IDs as case IDs.
- Capability search has a designed no-match state and a visible route back to all capabilities.
- The incident similarity threshold is now a real slider that rebuilds chart and table cohorts and
  publishes the visible threshold and result count to Copilot.
- Full-screen workspace navigation uses navigation/current-page semantics. **Open prepared plan** now
  moves from My Queue to Resolution Room; unsupported enabled actions were removed.
- Browser behavior evidence confirms threshold 72% -> 90% changes six related cases to two, and
  **Open prepared plan** changes the active layout to `resolution-room-workspace-shell`.

## Experience goal

The product should feel like a calm, high-trust service studio under pressure. It must not resemble a relabeled CRM dashboard or the Revenue Deal Room composition.

## Visual language

- Carbon framing holds operational focus; teal traces verified resolution; coral marks customer harm or contrary evidence; citrus marks time and authority.
- Multi-stop gradients identify workspaces and progress from evidence toward accountable action.
- My Queue is a dense judgment cockpit; Customer 360 is relational and temporal; Resolution Room is an evidence canvas; Service Operations is a global analytical command surface.
- Portraits appear where ownership, expertise, customer empathy, or approval matters. My Queue uses Megan Bowen's approved portrait; Amina retains an explicit initials fallback wherever she appears because no approved portrait is bundled.
- D3 charts expose exact values through adjacent tables and text. The projected map uses bundled Natural Earth geography with no runtime network request.
- Cards are limited to bounded tools, queues, people, and decisions; analytical composition remains broad and unframed where possible.

## Primary review screens

1. `fullscreen-my-queue.png`: ranked judgment queue, SLA consequence, prepared work.
2. `fullscreen-customer-360.png`: promise constellation, runway, timeline, recovery outcome.
3. `fullscreen-resolution-room.png`: evidence-to-action canvas, hypotheses, incident emergence, experts.
4. `fullscreen-service-operations.png`: demand river, world map, Pareto, recovery matrix.
5. `fullscreen-resolution-room-mobile.png`: sequential narrow workflow with no clipping.
6. `fullscreen-service-operations-dark.png`: equivalent dark analytical state.
7. Representative inline submit, information, review, analytical, and education screens.

## Acceptance

- Four dashboard roots have unique `data-layout` identities and visibly different composition.
- All 23 intents render at 340 and 760 pixels in light plus 760 pixels in dark.
- All four dashboards render at mobile, desktop dark, and keynote light.
- Runtime errors, horizontal overflow, broken portraits, blank semantic charts, and missing layout identities are zero.
- Reduced-motion, 200% zoom, forced colors, and authenticated host screen-reader checks remain separate evidence gates until executed.
- Public redistribution of the five persona portraits remains blocked on final media-rights approval.
- Final Microsoft functionality acceptance additionally requires closure of the high-priority findings
	and authenticated host gates in this document and `todo.md`.
