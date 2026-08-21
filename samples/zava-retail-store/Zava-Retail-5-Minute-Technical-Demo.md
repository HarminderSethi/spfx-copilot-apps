# Zava Retail: 5-minute developer and architecture demo

## Purpose

Use this walkthrough after the business demo or in a developer session. It follows a store request
from declarative-agent routing into the Copilot tool contract, SPFx host adapter, React display modes,
data service, local filters, and the final `.sppkg`.

The technical message is:

> **A Copilot Component combines conversational tool routing with a host-aware React application, and
> packages the agent definition and interactive UX as one SPFx solution.**

## Presenter setup

Open Microsoft 365 Copilot or Copilot Workbench beside VS Code. Pin these files in order:

1. `copilot/declarativeAgent.json`
2. `copilot/instruction.txt`
3. `src/copilotComponents/zavaRetail/ZavaRetailCopilotComponent.manifest.json`
4. `src/copilotComponents/zavaRetail/ZavaRetailCopilotComponentProperties.ts`
5. `src/copilotComponents/zavaRetail/propertyParsers.ts`
6. `src/copilotComponents/zavaRetail/ZavaRetailCopilotComponent.ts`
7. `src/copilotComponents/zavaRetail/ZavaRetailApp.tsx`
8. `src/copilotComponents/zavaRetail/data/ZavaRetailDataService.ts`
9. `src/copilotComponents/zavaRetail/components/FiltersPanel.tsx`
10. `src/copilotComponents/zavaRetail/components/SettingsDialog.tsx`
11. `package.json`
12. `scripts/validate-public-dependencies.mjs`

Keep a terminal in `samples/zava-retail-store` with a recent `npm run build` result available.

## Timed walkthrough

### 0:00-0:35 - Show what a Copilot Component is

**In Copilot:** Ask:

> **Show me the performance of our store in New York**

**Say:**

> "A Copilot Component is an SPFx client-side component that Copilot can call as a tool. Instead of
> returning only text, it owns a DOM element in the Copilot canvas and renders an interactive React
> experience. The SharePoint solution packages that component with its declarative agent."

### 0:35-1:20 - Show routing and the typed tool contract

**In code:** Open the agent instructions, component manifest, properties schema, and parsers.

**Point out:**

- the instruction to call the tool with the requested city in `targetStore`
- `componentType: "CopilotComponent"` and `copilotType: "Ux"`
- the `ZavaRetailTool` identity and compiled Zod schema reference
- declared `inline` and `fullscreen` capabilities
- string-authored `targetStore`, `useMock`, and `dataServiceUrl` values parsed at the host boundary
- schema validation requiring `dataServiceUrl` when mock mode is disabled

**Say:**

> "The declarative agent routes store-performance intent to one named tool. Its Zod-backed contract
> carries the requested store and data-mode settings. Parsing at the boundary keeps the React app
> working with typed booleans, store keys, and optional URLs."

### 1:20-2:00 - Show the SPFx host boundary

**In code:** Open `ZavaRetailCopilotComponent.ts`.

**Point out:**

- `BaseCopilotComponent<IZavaRetailCopilotComponentProperties>`
- host-derived display mode and theme
- React 17 mounting and teardown
- `requestDisplayModeAsync('fullscreen')`

**Say:**

> "This class is the adapter between Copilot and React. It passes authored properties and current
> host state into the app. The inline view can request full screen, but Copilot remains authoritative
> and re-renders the component with the actual display mode."

### 2:00-2:50 - Show the React orchestration and hosted styling

**In code:** Open `ZavaRetailApp.tsx`.

**Point out:**

- one root chooses `InlineView` or `FullScreenView`
- data, loading, errors, filters, section visibility, and carousel index are explicit state
- store and date changes rerun `loadDashboardData`
- Fluent light/dark theme follows the host
- Griffel targets `context.domElement.ownerDocument` for hosted iframe styling

**In UX:** Expand the component, change the host theme, or open **Filters**.

**Say:**

> "The root coordinates behavior while dedicated views own each display mode. Styling is inserted
> into the document that owns the component, which matters in iframe-based Copilot and Workbench
> hosting. Store and date filters change the data request rather than only relabeling the UI."

### 2:50-3:45 - Show deterministic data and the integration boundary

**In code:** Open `ZavaRetailDataService.ts`.

**Point out:**

- store seeds for Seattle, Boston, and New York
- a deterministic hash and pseudo-random generator keyed by store and date offset
- one `IDashboardData` aggregate consumed by the views
- product assets and store-specific ordering
- mock mode returning deterministic data without external retail calls
- the live-mode placeholder resolving `/me` and `/me/photo/$value`, then returning the same sample retail payload

**Say:**

> "The views consume one dashboard contract. A seeded generator makes each store and reporting date
> distinct but repeatable, which is useful for demos and tests. The current live path demonstrates
> Graph context for the signed-in user, but the retail API call is intentionally still a placeholder.
> A production service would replace this implementation without changing the component views."

### 3:45-4:25 - Show interactive state and recovery

**In UX and code:** Open `FiltersPanel.tsx` and `SettingsDialog.tsx`.

**Point out:**

- store and last-seven-days controls
- section-visibility switches driving the rendered dashboard
- mock/live selection and data-service URL
- errors retaining the last good dashboard so settings remain available for recovery

**Say:**

> "These controls are local application state, not remote writes. If a data request fails, the app
> keeps the last successful dashboard mounted and exposes the error in settings, allowing the user to
> correct configuration without losing the whole experience."

### 4:25-5:00 - Show public dependencies and packaging

**In code:** Open `.npmrc`, `package.json`, and `scripts/validate-public-dependencies.mjs`.

**In terminal:** Run or show the latest output from:

```bash
npm run build
```

**Expected proof:**

- direct and transitive packages resolve through `registry.npmjs.org`
- direct dependency specs contain no file, Git, workspace, or arbitrary URL references
- TypeScript and ESLint complete
- the declarative-agent assets and production bundle are packaged into the `.sppkg`

**Say:**

> "The release command first validates dependency provenance, then compiles, tests, and packages the
> solution. This prevents a private feed URL from returning in the lockfile and keeps the sample
> reproducible for community users. The result is one SharePoint package containing the Copilot UX
> and its agent assets."

## Architecture map

```text
Natural-language store request
  -> declarative agent instruction
  -> ZavaRetailTool and Zod property schema
  -> BaseCopilotComponent host adapter
  -> host display mode + theme + parsed properties
  -> ZavaRetailApp orchestrator
  -> inline summary OR full-screen dashboard
  -> loadDashboardData
  -> deterministic store/date model OR future retail service
  -> Fluent React UI inside the Copilot-owned document
```

## Presenter guardrails

- This sample targets SPFx `1.24.0-beta.2`; describe it as preview technology.
- Retail performance, products, feedback, and comparisons are deterministic sample data.
- Live mode does not currently fetch retail metrics from `dataServiceUrl`; it is an integration placeholder.
- Only live mode attempts to resolve the signed-in user's name and photo through Microsoft Graph.
- `requestDisplayModeAsync` requests full screen; it does not let the component own host layout state.
- Filters and settings do not write to Graph, SharePoint, or a retail system.

## Technical rehearsal checklist

- [ ] Pin the twelve files in the listed order.
- [ ] Confirm the prompt invokes `ZavaRetailTool` with `targetStore` set to New York.
- [ ] Show the manifest and schema before implementation details.
- [ ] Expand once to demonstrate host-owned display mode.
- [ ] Change one store or date and explain deterministic regeneration accurately.
- [ ] Run `npm run check:dependencies` or show a passing `npm run build`.
- [ ] Finish within five minutes and leave implementation details for Q&A.
