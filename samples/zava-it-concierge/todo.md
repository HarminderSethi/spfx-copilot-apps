# Zava IT Concierge release tracker

This is the current source of truth for local release readiness. The approved product and UX specification is preserved in [Zava-IT-Concierge-Design-Brief.md](Zava-IT-Concierge-Design-Brief.md), and reusable implementation guidance lives in [agentic-creation-rules.md](agentic-creation-rules.md).

> **Status:** Local release complete on 2026-08-25. Authenticated Microsoft 365 Copilot host validation remains blocked until a tenant domain and authenticated test context are available.

## Final scope

- [x] 30 independently routed operational Copilot Components.
- [x] One catalog-driven `ExploreAgentCapabilities` education component that advertises the 30 operational tools and excludes itself.
- [x] Six conversation starters, each targeting one component; capability exploration is last.
- [x] One shared production bundle entry with purpose-gated lazy chunks.
- [x] Three connected full-screen dashboards: Personal, Team, and IT Portfolio.
- [x] Seven guarded submit/review experiences: device configuration, justification, issue report, device approval, approval queue, policy exception, and delegation.
- [x] Deterministic offline data and session-only confirmed-action receipts.

### Superseded early concepts

The approved three-dashboard redesign supersedes the early five-view route-browser proposal. Fleet analytics, request context, approvals, and process evidence are coordinated inside the owning Personal, Team, or IT Portfolio dashboard instead of opening separate Fleet Analytics Studio and Request Workspace applications.

The early brief also proposed five broad production state machines for device, support, access, outage, and lifecycle integration. The released mock sample does not claim those live end-to-end systems. It demonstrates seven explicit local review/confirmation workflows and one process-journey view. Authenticated cross-system state machines belong to the deferred integration scope below.

## Verified local evidence

The canonical `npm run build` gate passed on 2026-08-25.

| Gate | Verified result |
| --- | --- |
| Intent catalog | 31 intents, 31 immutable GUIDs, one shared bundle, six starters |
| Asset provenance | 17 local files, two validated agent icons, and two documented fallbacks |
| Routing matrix | 31 tools and six explicit starter targets |
| Visual evidence | 39 PNGs: 31 inline defaults, three dashboards, five representative variants |
| Visual runtime checks | Zero broken images, horizontal overflow, deprecated generic chrome, console errors, or page errors |
| Test suite | Eight suites, 35 successes, zero failures |
| Generated API plugin | API plugin v2.4, 31 functions, 31 mirrored MCP tools, 87 descriptions |
| Package | 2,137,549-byte `.sppkg`, SHA-256 `d3e440592c1bde617861ccad11a10d9f6564813dac3def67cb4fdd0202b272e1` |
| Agent ZIP | 12,370 bytes, SHA-256 `bd288a349792de2089b81b38ca0f7ae3dcb70fdd9c219942697c1e9e2769eb7b` |
| Agent icons | Color SHA-256 `dc2e8cf7c5819a494d2a0809b312cb5e1eda3cd04a7132eeb1605dc4c8c2b8ed`; outline SHA-256 `65f0b419ddcc3a13b909310033b1e063f1a07f8c37d32748851d0a9e68f9f934` |
| JavaScript | One primary entry, 42 lazy chunks, 43 production files, 2,506,558 bytes total |
| Largest entry | 1,732,809 bytes, below the 2 MiB release threshold |
| Packaged media | 11 files, zero duplicate hashes |
| Package hygiene | Zero stale outputs, zero duplicate inline images, no Fluent icon-font payload |

Machine-readable records:

- [assets/visual-evidence.json](assets/visual-evidence.json)
- [assets/release-evidence.json](assets/release-evidence.json)
- [assets/sample.json](assets/sample.json)
- [assets/asset-provenance.json](assets/asset-provenance.json)

## Completed product work

### Catalog, routing, and explorer

- [x] Make `src/shared/intents/intentCatalog.ts` the source of truth for names, GUIDs, routes, operation, lens, schemas, preview values, education metadata, and visual identity.
- [x] Give every tool description a positive `Use` boundary and a negative `Do not use` collision boundary.
- [x] Generate component bindings, manifests, bundle membership, agent registration, and conversation starters from catalog-owned configuration.
- [x] Instruct the agent to invoke exactly one tool for the primary request.
- [x] Generate and validate [Zava-IT-Concierge-Prompt-Matrix.md](Zava-IT-Concierge-Prompt-Matrix.md) from all 31 tools.
- [x] Keep capability exploration as the final starter and exclude the explorer from its own 30-tool catalog.
- [x] Test explorer search across title, description, category, and sample prompt; audience/operation filters; page clamping; and featured tools.

### Inline UX

- [x] Use one React 17, Fluent UI v9, and owner-document Griffel host across all 31 components.
- [x] Present the Zava IT Concierge brand with the action title in the shared header.
- [x] Keep the top-right full-screen control stable and host-authoritative.
- [x] Remove generic `From your prompt` and `Decision insight` rails from default inline UX.
- [x] Preserve intent-specific evidence where it supports a chart or consequential review.
- [x] Use dedicated DOM compositions for products, knowledge, journeys, briefs, education, forms, and queues.
- [x] Use purpose-gated SVG/D3 charts and D3 geography for compact analytics; create zero inline Babylon engines.
- [x] Replace native transactional selects with Fluent `Dropdown` and `Option` controls.
- [x] Require editable rationale, visible consequence, explicit confirmation, and semantic receipt for submit/review operations.

### Full-screen dashboards

- [x] Map every origin exactly once into Personal, Team, or IT Portfolio.
- [x] Preserve the initiating intent and safe prompt properties as origin context.
- [x] Implement keyboard-operated vertical lens tabs, focus movement, responsive layout, and return to conversation.
- [x] Deliver Personal device continuity, support, requests, health, and replacement context.
- [x] Deliver Team people readiness, approval queue, budget, support load, and refresh priorities.
- [x] Deliver IT Portfolio estate geography, regional exposure, incident command, service health, tickets, spend, issues, age, refresh capacity, and licenses.
- [x] Use Babylon only where dimensional depth materially helps a full-screen scene.

### Data, media, and safety

- [x] Design and generate professional Zava IT Concierge `color.png` and `outline.png` agent icons from one geometric Z and estate-health-ring mark; validate manifest mapping, dimensions, transparency, monochrome outline treatment, freshness, and provenance.
- [x] Generate 150 employees, 180 devices, 10 Surface/accessory SKUs, and 300 tickets from deterministic mock data.
- [x] Keep dates, IDs, people, devices, requests, approvals, budgets, incidents, services, tickets, licenses, and refresh plans referentially coherent.
- [x] Package approved demo portraits and official Surface Laptop/Pro renders locally.
- [x] Document Surface Studio/Go/Hub and Microsoft 365 marks as explicit fallbacks rather than fabricating official media.
- [x] Validate all listed local assets by SHA-256.
- [x] Keep prompt values non-consequential until visible review and confirmation.
- [x] Store confirmed receipts only in guarded session storage; no tenant action or business-data network call occurs.

## Completed publication work

- [x] Capture all 31 inline defaults from the real React implementation.
- [x] Capture Personal, Team, and IT Portfolio dashboards.
- [x] Capture Personal mobile, IT Portfolio dark, approval detail, approval confirmation, and request receipt variants.
- [x] Publish PnP `assets/sample.json` with exact file coverage, order, URLs, and descriptive alt text.
- [x] Convert README to PnP sample format and preserve the original specification as the design brief.
- [x] Publish a 3-minute keynote script.
- [x] Publish a 10-minute business-value demo script.
- [x] Publish a 5-minute technical demo script.
- [x] Add deterministic screenshot, gallery, generated-plugin, routing-document, and package validators.
- [x] Commit the ready-to-deploy package path at `sharepoint/solution/zava-it-concierge.sppkg`.

## Canonical commands

```powershell
npm run configure:intents
npm run capture:visual
npm run build
```

`npm run build` performs catalog, asset, routing matrix, and gallery checks; a clean production compile and all tests; solution packaging; generated API plugin validation; and final package auditing.

## Tenant-only blocked validation

- [ ] **BLOCKED: tenant domain and authentication required.** Validate Copilot Workbench CSP and generated tenant placeholders.
- [ ] **BLOCKED: tenant domain and authentication required.** Validate `requestDisplayModeAsync`, full-screen return, and iframe focus continuity in the real host.
- [ ] **BLOCKED: tenant domain and authentication required.** Rehearse all 31 prompts and six starters against authenticated model routing, recording exactly one selected tool per request.
- [ ] **BLOCKED: tenant domain and authentication required.** Validate tenant high contrast, screen-reader output, and host theme behavior.
- [ ] **BLOCKED: tenant domain and authentication required.** Confirm app-catalog deployment, agent installation, permissions, and package behavior in the target tenant.

## Deferred production integration

- [ ] Implement authorized adapters for Microsoft Graph, Intune, Entra, SharePoint, Microsoft 365 service health, procurement, shipment, license, and finance sources.
- [ ] Replace session-only receipts with authenticated APIs, role checks, audit, retry, idempotency, and durable state.
- [ ] Implement organization-specific device, support, access, outage, and lifecycle process state machines only after source-system ownership is approved.
- [ ] Provision tenant resources, consent, data classification, retention, environment configuration, and operational monitoring.
- [ ] Revalidate privacy, localization, failure behavior, performance, and accessibility with production data volumes.

## Open decisions

No local release decisions remain. Tenant-specific URLs, permissions, connectors, policy rules, and production media approvals are intentionally deferred until a target environment is provided.
