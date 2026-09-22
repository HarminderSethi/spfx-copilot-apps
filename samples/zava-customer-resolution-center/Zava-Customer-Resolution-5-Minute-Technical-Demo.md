# Zava Customer Resolution - 5-Minute Technical Demo

## 0:00-1:00 - Six precise routing contracts

Open `src/shared/catalog.ts`, `config/conversation-starters.json`, and the generated routing matrix.
Show the six flagship tools and their nearest-sibling boundaries: create versus diagnose, detect versus
decide, entitlement versus recovery, internal evidence versus customer communication, and demand
versus regional/driver analysis. All 23 immutable Yeoman identities remain available.

## 1:00-2:00 - Compact state machines, not long pages

Open `ServiceInlineExperiences.tsx`. Show `CompactSubmitFlow` and `FlagshipReview`. Submit stages replace
each other and preserve typed draft state. Review tools own a three-item queue, operation-specific
fields, Edit/Confirm, session receipts, responsive queue/detail replacement, and next-item advance.
The generic case browser is deliberately bypassed for these queue-owned workflows.

## 2:00-3:00 - Visual answers are data products

Open `visualizations/ServiceCharts.tsx` and `serviceGeometry.ts`. Show the incident threshold rebuilding
the cohort and the demand period selecting distinct datasets and D3 paths. Each answer has one chart,
three values maximum, concise interpretation, accessible SVG title/description, and a collapsed exact-
value table. Full screen remains the coordinated multi-chart surface.

## 3:00-4:00 - Components report visible state and size

Open `ServiceApp.tsx` and `ServiceCopilotComponentBase.tsx`. Show stage/selection/period summaries,
snapshot deduplication, `updateModelContextAsync`, and the root `ResizeObserver` batching
`requestSizeChangeAsync`. Demonstrate 760 px and 340 px: submit, queue/detail, and chart states resize
without horizontal overflow or stacking every stage.

## 4:00-5:00 - Deterministic safety and release evidence

Open `sessionStore.ts`, focused tests, and visual evidence. Confirm receipts are immutable and local,
prompt properties only prefill, and no customer write or send occurs. Run `npm test` and the canonical
build. Catalog, routing, media, gallery, publication, tests, plugin, package output, and release hashes
must pass before regenerating the committed `.sppkg`. Authenticated host accessibility and public media
rights remain explicit external gates.