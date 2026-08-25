# Zava IT Concierge: 5-minute technical demo

## 0:00-0:45 - Architecture

Show the source tree and explain the four layers:

- `src/shared/intents/intentCatalog.ts` is the typed source of truth for 31 tools.
- Generated component classes and manifests bind each tool to one shared React host.
- Deterministic mock data, analytics, and session-only operation reducers keep inline and full-screen views coherent.
- `DashboardFullScreenExperience.tsx` maps every origin into Personal, Team, or IT Portfolio while preserving prompt-derived context.

## 0:45-1:35 - Routing and schemas

Open the catalog and one generated manifest. Every description begins with a positive **Use** boundary and includes a **Do not use** collision boundary. Every prompt property is optional, typed with Zod, represented in preview data, and visibly affects filtering or prefilling.

Show `Zava-IT-Concierge-Prompt-Matrix.md`. It is generated from the catalog and covers all 31 prompts, preview properties, routes, and collision boundaries. Six conversation starters are validated, with capability exploration last.

Run:

```powershell
npm run validate:intents
npm run check:routing-matrix
```

## 1:35-2:25 - Shared inline host and full screen

Open `IntentCanvasApp.tsx`. Call out:

- One branded header combines Zava IT Concierge with the action title.
- A fixed top-right **Full screen** control delegates display mode to the host.
- The generic prompt echo and generic decision-insight rail are absent by default.
- Submit and review tools use editable fields, visible consequences, explicit confirmation, and semantic receipts.

Open `DashboardFullScreenExperience.tsx` and show the keyboard-operated Personal, Team, and IT Portfolio tabs plus the exact origin context.

## 2:25-3:10 - Rendering and lifecycle

Show the renderer split:

- Purpose-built DOM compositions for forms, queues, products, journeys, knowledge, and the explorer.
- React SVG and lazy D3 scale/shape modules for compact analytical charts.
- Lazy D3 Geo, TopoJSON, and Natural Earth data for geographic estate risk.
- Babylon only for genuinely dimensional full-screen scenes, with no inline WebGL engines.

Explain that analytical models are immutable and formatting stays exact for counts, percentages, and currency.

## 3:10-3:50 - Data and safety

Open the mock graph and operation reducer. The seeded graph contains 150 employees, 180 devices, 10 catalog SKUs, and 300 tickets. Confirmed demo actions append session-only receipts; prompts never approve, submit, delegate, declare, wipe, or apply a refresh plan.

Live service integration is deliberately deferred behind service interfaces. The sample makes no runtime network request for business data or media.

## 3:50-4:35 - Visual and accessibility evidence

Run or show the output from:

```powershell
npm run capture:visual
npm run check:gallery
```

The Playwright harness captures 31 inline defaults, three dashboards, mobile and dark views, and representative detail, confirmation, and receipt states. `assets/visual-evidence.json` records dimensions, broken images, overflow, deprecated chrome, page errors, console errors, canvas count, and engine count.

## 4:35-5:00 - Production gate

Run:

```powershell
npm run build
```

The canonical gate validates routing, media, gallery metadata, and generated docs; runs the clean production test suite; packages the solution; validates the generated v2.4 API plugin and 31 mirrored MCP tools; then audits the `.sppkg` for stale output, hashes, bundle/chunk strategy, duplicate media, icon fonts, and size thresholds.

The remaining tenant-only gate is authenticated Copilot host validation for CSP, display-mode transitions, iframe focus, high contrast, and screen-reader output.