# Zava AI Project Portfolio Agent: 5-minute developer and architecture demo

## Purpose

Use this walkthrough after the business demo or in a developer session. It pairs live UX with the source files that implement routing, host integration, deterministic state, safe actions, shared packaging, and release validation.

The technical message is:

> **Many independently routed tools can share one maintainable React application, one coherent data model, and one optimized deployment package.**

## Presenter setup

Open these side by side:

- Microsoft 365 Copilot or the local UX review harness
- VS Code at `samples/zava-project-tracker`
- A terminal in the sample folder

Pin these files in editor tabs:

1. `src/copilotComponents/shared/mockData/intentCatalog.ts`
2. `src/copilotComponents/shared/components/ProjectIntentCopilotComponentBase.tsx`
3. `src/copilotComponents/shared/components/ProjectIntentApp.tsx`
4. `src/copilotComponents/shared/components/ProjectThemeProvider.tsx`
5. `src/copilotComponents/shared/models/intentInvocation.ts`
6. `src/copilotComponents/shared/services/SessionActionStore.ts`
7. `config/config.json`
8. `scripts/validate-intent-components.mjs`
9. `scripts/validate-generated-ai-plugin.mjs`
10. `scripts/validate-package-output.mjs`

## Timed walkthrough

### 0:00-0:35 - Show intent-driven UX

**In UX:** Ask:

> **Compare Customer Service Copilot with Contract Intelligence on delivery and value.**

**Expected component:** `CompareProjects`

**Say:**

> "The orchestrator selects one tool. The chat stays concise because the Copilot Component is the primary response. This is not one generic dashboard with a view parameter; every prompt-addressable intent has its own generated component identity and metadata."

### 0:35-1:10 - Show the catalog and generated identities

**In code:** Open `intentCatalog.ts` and `scripts/validate-intent-components.mjs`.

**Point out:**

- 31 immutable intent definitions
- owning workspace and full-screen route
- title, summary, decision visual, metrics, evidence, action, and people
- education metadata generated from the same catalog
- validation of unique GUIDs, tools, descriptions, 188 optional prompt properties, registrations, and exact bundle manifest coverage

**Say:**

> "The catalog is the product contract. Generated component folders remain immutable, while shared behavior comes from metadata and common React modules. One validator prevents manifest, schema, bundle, and registration drift."

### 1:10-1:50 - Show the shared Copilot host boundary

**In code:** Open `ProjectIntentCopilotComponentBase.tsx`.

**Point out:**

- `BaseCopilotComponent<TProperties>`
- host-owned `displayMode`, dimensions, theme, and available modes
- current-user resolution from page context
- `requestDisplayModeAsync('fullscreen')`
- one shared `ProjectIntentApp` for every generated component
- React 17 `render` and teardown lifecycle

**Say:**

> "Each manifest and class remains independently callable, but every component delegates to one tested host adapter. The host remains authoritative for display mode. The app never optimistically pretends it entered full screen."

### 1:50-2:25 - Show host-document theming

**In code:** Open `ProjectThemeProvider.tsx`.

**Point out:**

- Griffel `createDOMRenderer` targets `context.domElement.ownerDocument`
- `RendererProvider` and Fluent provider use the same target document
- light/dark theme derives from host context
- stable one-time remount avoids style insertion failures in Workbench iframes

**In UX:** Toggle dark theme in the review harness.

**Say:**

> "Workbench can host a component in another document. Styling the parent page is not enough. The renderer targets the actual component document, and tests verify that boundary."

### 2:25-3:05 - Show fresh invocation versus passive rerender

**In code:** Open `intentInvocation.ts` and return briefly to `ProjectIntentCopilotComponentBase.tsx`.

**Point out:**

- supported prompt values are normalized and keys sorted deterministically
- intent plus normalized properties form a signature
- version increments only when prompt-derived intent state changes
- passive theme/size rerenders preserve local state
- a component-instance transient snapshot carries supported information, review, and submit context into full screen

**Say:**

> "This prevents a host resize or theme change from wiping a draft. A genuinely fresh prompt intentionally reapplies defaults. The distinction is explicit and tested rather than inferred inside every form."

### 3:05-3:40 - Show governed session actions

**In UX:** Open a Decisions review and confirm a sample decision, or show an existing session receipt.

**In code:** Open `SessionActionStore.ts`.

**Point out:**

- typed decision/submission receipts
- immutable append behavior
- guarded `sessionStorage` with in-memory fallback for sandboxed hosts
- subscriptions synchronize queues across remounts
- Reset restores deterministic baseline

**Say:**

> "Prompt text never crosses the action boundary. Components review and confirm first, then record a browser-session receipt. A future live service can replace this store while preserving the UX contract."

### 3:40-4:20 - Show one optimized package

**In code:** Open `config/config.json`.

**Point out:**

- 31 component entries retain separate manifests, GUIDs, and entrypoints
- all entries share one production bundle because they consume the same React/Fluent/application graph
- named Fluent SVG icon imports tree-shake to the used subset
- persona media is emitted once in the shared bundle

**Say:**

> "Independent routing does not require thirty-one copies of React, Fluent, the data service, and the icon subset. The shared bundle reduced the package from the early 10.7 MB baseline to about 0.41 MiB while preserving every component identity."

### 4:20-5:00 - Run the release gates

**In terminal:** Run or show the last output from:

```bash
npm run build
```

**In code:** Point to the three validators.

**Expected proof:**

- 31 tools and 188 optional properties
- 39 unified-gallery screenshots
- 168 tests with zero failures/warnings
- generated API plugin v2.4 function/MCP mirroring
- one hashed production JavaScript file
- no stale JS, duplicate media, repeated base64 across bundles, or Fluent icon font
- final `.sppkg` below configured investigation thresholds

**Say:**

> "The package is not considered done because Webpack completed. Source identity, gallery assets, behavior, generated plugin output, and the final archive are all independently validated."

## Architecture map

```text
Natural-language prompt
  -> declarative agent routing instructions
  -> one generated Copilot Component/tool
  -> shared BaseCopilotComponent adapter
  -> normalized invocation + version + transient state
  -> inline operation router OR shared/isolated full-screen root
  -> deterministic services/calculations
  -> explicit review/confirmation
  -> session action receipt
```

## Key technical decisions

| Decision | Why |
| --- | --- |
| One intent per generated component/tool | Clear orchestration metadata and immutable deployment identity |
| Shared React host and operation routers | Avoid duplicated lifecycle, theming, workflow, and error handling |
| Catalog-owned routes and education metadata | Prevent tool/help/full-screen drift |
| Owner-document Griffel renderer | Correct styling in Copilot-hosted iframe documents |
| Normalized invocation signatures | Preserve edits on passive rerenders and reset on fresh prompts |
| Mock service interfaces and immutable seeds | Offline reliability and later live-service replacement |
| Explicit confirmation and session receipts | Safe action semantics without external writes |
| One shared production bundle | Deduplicate common runtime, UI, media, and icon code |
| Post-package validators | Validate what is actually shipped, not only source files |

## Useful code references

- Routing behavior: `copilot/instruction.txt`
- Intent definitions: `src/copilotComponents/shared/mockData/intentCatalog.ts`
- Education metadata: `src/copilotComponents/shared/mockData/capabilityEducation.ts`
- Operation classification: `src/copilotComponents/shared/models/intentOperations.ts`
- Component host: `src/copilotComponents/shared/components/ProjectIntentCopilotComponentBase.tsx`
- Inline router: `src/copilotComponents/shared/components/inline/InlineExperienceRouter.tsx`
- Full-screen shell: `src/copilotComponents/shared/components/fullscreen/ProjectFullscreenShell.tsx`
- Dashboard compositions: `src/copilotComponents/shared/components/fullscreen/FullscreenWorkspaceDashboard.tsx`
- Invocation state: `src/copilotComponents/shared/models/intentInvocation.ts`
- Session receipts: `src/copilotComponents/shared/services/SessionActionStore.ts`
- Source identity audit: `scripts/validate-intent-components.mjs`
- Generated plugin audit: `scripts/validate-generated-ai-plugin.mjs`
- Final package audit: `scripts/validate-package-output.mjs`
- Gallery audit: `scripts/validate-gallery-assets.mjs`

## Presenter guardrails

- This is SPFx `1.24.0-beta.2` preview code; confirm target-tenant support before production adoption.
- Data, people, calculations, and receipts are deterministic mock records.
- The local harness proves UX behavior but not authenticated tenant CSP, iframe focus, high contrast, or screen-reader output.
- Supported transient continuation exists for representative operation state; not every specialized slider/filter is mapped into every full-screen module yet.
- Do not describe session receipts as writes to Planner, Project, SharePoint, Dataverse, Fabric, or finance systems.

## Technical rehearsal checklist

- [ ] Keep the ten source tabs open in the listed order.
- [ ] Reset demo decisions before showing session persistence.
- [ ] Confirm the comparison prompt routes correctly.
- [ ] Toggle dark theme to demonstrate owner-document styling.
- [ ] Show invocation signature/version fields without reading the whole file.
- [ ] Confirm a decision and show the receipt surviving remount/navigation.
- [ ] Show the single shared bundle and 31 manifest entries.
- [ ] Keep recent `npm run build` output visible.
- [ ] Finish within five minutes and leave detailed code questions for Q&A.
