# Zava Customer Resolution - 5-Minute Technical Demo

## 0:00-1:00 - LLM routing is an explicit contract

Open `src/shared/catalog.ts`, `scripts/configure-intent-components.mjs`, and one generated manifest.
Show 23 immutable Yeoman identities, unique GUIDs/tools/routes, parameter schemas, and descriptions that
all state **Use when** plus **Do not use**. Contrast nearby boundaries: incident analysis versus incident
decision; recovery review versus customer update; case escalation versus workload balancing.

## 1:00-2:00 - Every component reports what is visible

Open `ServiceInlineExperiences.tsx`, `ServiceApp.tsx`, and `ServiceCopilotComponentBase.tsx`. Show the
23-intent `visibleSummary` map, specialized case/incident/capability updates, snapshot deduplication, and
`updateModelContextAsync` publishing text plus structured content. The host receives intent, route,
display mode, selected case/customer/capability, query/view, and a bounded description of the rendered UX.

## 2:00-3:00 - One coherent offline graph, not hardcoded screenshots

Open `domain.ts` and `domain.test.ts`. Show 12 curated customers (three per region), 500 cases, four
canonical customer stories, customer-owned constellation nodes, distinct recovery portfolios, and
explicit or deterministic evidence for every case. Run `npm test`; report the current discovered total.

## 3:00-4:00 - Coordinated visual data products

Open `visualizations/serviceGeometry.ts` and `ServiceCharts.tsx`. Show D3 scales/shapes, Natural Earth
projection, exact-value tables, customer portfolio and workload matrices, incident network, and the
Service Operations period/region/product state. Change filters in the harness to prove paths, map marks,
driver bars, KPIs, and recovery exposure all redraw from one state.

## 4:00-5:00 - Host and release evidence

Open `ServiceThemeProvider.tsx`, `sessionStore.ts`, and `assets/release-evidence.json`. Show the persistent
React 18 root, owner-document Griffel rendering, responsive labeled/icon-only full-screen control,
host-authoritative display mode, and session-only receipts. Run `npm run build`: catalog, React, routing,
media, gallery, publication, tests, plugin, package output, and release hashes must all pass. Authenticated
iframe focus, forced-colors, screen-reader output, and public media rights remain explicit external gates.
