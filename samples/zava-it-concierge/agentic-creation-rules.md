# Agentic Creation Rules - SPFx Copilot Apps

> **Purpose.** This file is the reusable engineering, UX, and release-automation playbook for SPFx
> Copilot App samples. It includes a clearly labeled **Zava IT Concierge specialization** based on
> patterns validated by the Zava sample family. Preserve every mandatory action/gate unless the
> approved brief and `todo.md` record a deliberate exception.
> It covers independently routed Copilot Components, shared full-screen experiences, coherent mock
> data, session-local workflows, visualization-first React UX, automated evidence, and packaging.
>
> **Prime directive:** every sample must be a **self-contained, offline, mock-data showcase** that
> deploys from a committed `.sppkg` in minutes, looks premium, and is structured so the mock can
> later be swapped for live Microsoft 365, SharePoint, Planner, Project, Fabric, financial, or
> governance data with no UI changes.

## Document precedence

- `todo.md` controls this solution's product scope, final component names, UX contracts, phase order,
  and acceptance gates.
- This file controls implementation quality, supported scaffolding, architecture, testing, and safety.
- The validated reference implementations supply proven patterns where neither document is explicit.
- Resolve a conflict in that order and record an approved exception in `todo.md` before coding.

## Default UX contract - override only when the brief says so

These are inherited defaults, not suggestions. A README, supplied design, or approved `todo.md` item
may replace one only by naming the different behavior and its validation criteria. Silence means use
the defaults.

- One shared inline header shows the agent/brand name with the literal current action title. One
  accessible **View in full screen** control sits in the top-right corner when the host supports it.
- The body begins with domain work. Do not add generic prompt echo, extracted-property dumps,
  `From your prompt`, generic `Decision insight`, chatbot bubbles, sparkle/robot chrome, or a second
  prompt box inside the component.
- Prompt properties silently initialize a real selected entity, filter, scenario, or editable draft.
  Show provenance beside a domain field only when the user needs it to judge that field.
- Treat the AI-to-UI handoff as the core product story. AI provides probabilistic, non-deterministic
  natural-language understanding and selects or configures a bounded experience for the user's need.
  The component owns deterministic records, calculations, validation, state transitions, decisions,
  and actions. Never imply that model inference itself completed a consequential operation.
- Information, review, submit, and education experiences have purpose-designed compositions. Share
  framing and mechanics, not one generic card body or evidence rail.
- Expose exactly six conversation starters by default. Starters 1-5 open five distinct, high-value
  operational tools; starter 6 is capability discovery and targets the generated
  `ExploreAgentCapabilities` experience. Each starter contains one primary task and is expected to fire
  exactly one tool.
- Include `ExploreAgentCapabilities` as the default education experience. It is searchable and
  filterable, advertises every operational tool from the canonical catalog, excludes itself, offers
  realistic copyable prompts and safe previews, and never applies a submit/review action from preview.
- Ship a professional agent identity with `copilot/color.png` and `copilot/outline.png`. Use one
  domain-relevant mark that remains recognizable at 16-32 px, coordinate it with manifest
  `accentColor`, and generate/check both files deterministically. Placeholder template icons never
  reach visual review or packaging.
- Use Fluent UI v9 controls and icons, a neutral operational canvas, one primary accent pair, one warm
  contrast accent, and Fluent semantic status colors. Keep headings compact, layouts stable, and cards
  reserved for repeated records, modals, or genuinely bounded tools. Do not nest cards.
- Choose DOM for exact operational content, React SVG for compact analytical graphics, and Babylon only
  when spatial or dimensional interaction materially improves the decision. A supplied design may call
  out a different renderer, but accessibility, fallback, performance, and evidence gates still apply.
- Every visible control works and every consequential action stops at visible review and confirmation.
  Unsupported controls are removed rather than displayed as decorative or disabled promises.
- Keep focused information, review, and action in the Copilot canvas. The primary happy path does not
  send the user through a deep link, app switch, portal handoff, or duplicate external form. Inline
  components answer or complete the immediate task directly in the flow of work.
- Full screen adds context, comparison, planning, or coordinated operations. It preserves the invoking
  entity/filter/draft where supported and never opens generic home merely because a route exists. It
  is the application-scale continuation inside Copilot, not a transition to a separate application.

When the approved design conflicts with one of these defaults, record the override once in `todo.md`,
implement it consistently, and add a focused automated check so later cleanup does not restore the
default accidentally.

## Project specialization - Zava IT Concierge

This section specializes the reusable defaults for this solution. Future samples adopt the mechanics,
not the Zava labels, people, device domain, three-lens information architecture, or named visuals.
The product and visual commitments in the design brief are binding; `todo.md` freezes their
implementation order, component identities, evidence, and approved exceptions.

### Product story and people

- Build one connected device-to-resolution story: diagnose Megan Bowen's Surface device, recommend a
  supported Surface configuration, route Diego Siciliani's budget-aware decision, advance fulfillment,
  and let Lee Gu inspect the resulting company estate impact.
- Use the standard fictional Microsoft 365 demo personas and approved bundled portraits from the Zava
  reference samples. The primary roles are Megan Bowen (employee), Diego Siciliani (manager), and Lee
  Gu (IT operations). Supporting people come from the same approved reference set.
- Human context is evidence, not decoration. Portraits appear beside ownership, approvals, service
  accountability, assignments, and handoffs. Dense charts do not need decorative face piles.
- Use official Microsoft Surface product imagery and Microsoft 365 product icons where they identify
  the represented product or service. Copy approved assets into this sample, optimize them, package
  them locally, and record source/reference path, retrieval date, intended use, and usage note in one
  provenance manifest. Do not fetch media at runtime or invent unreleased product names/specifications.
- Do not introduce unrelated third-party brands or media. Every image has meaningful alternative text
  when informative, or empty alternative text when adjacent content already provides the same identity.

### Visual language and vertical navigation

- Treat the supplied design images as composition references, then push their visual quality through
  stronger hierarchy, coordinated filtering, data-driven dimensional views, and exact inline-to-full-
  screen continuation. Do not reproduce their app chrome or placeholder values blindly.
- Full screen uses one shared vertical tab shell with the stable primary lenses **Me**, **Team**, and
  **Company**. Each tab opens a useful default dashboard. Request/approval and analytics routes remain
  within their owning lens so users retain orientation.
- The desktop/keynote tab rail combines Fluent icons, short labels, selection indicator, and tooltips.
  It may collapse to an icon rail only while labels remain available to assistive technology and on
  hover/focus. At narrow widths use an accessible drawer or selector while preserving lens IDs, order,
  route state, and focus behavior.
- Inline components are compact business applications, not Adaptive Card imitations. Use unframed
  analytical regions, bounded records/forms where needed, and stable chart dimensions. Full screen adds
  breadth, comparison, planning, and evidence rather than enlarging the inline composition.
- Map the README's steel-to-cyan palette specification into named theme/custom tokens once. Component
  styles consume tokens only; semantic success, warning, and danger colors keep their standard meaning.
- Surface hardware imagery, the radial estate-health ring, and accountable people are first-viewport
  signals for the personal experience. The company lens gives its dominant analytical canvas to the
  fleet visualization instead of a grid of equal-weight KPI cards.

### Data-driven visualization contract

- **Model first, renderer second.** Every visual exports one pure typed analytical model containing
  stable record IDs, labels, exact and formatted values, groups/relationships, semantic colors,
  geometry inputs, selection relationships, legend data, and fallback rows. Inline, full-screen,
  screenshot, accessible, and test views consume this same model so they cannot disagree.
- **Choose the cheapest renderer that answers the question well.** Fluent DOM owns tables, lists,
  forms, status boards, and exact-value evidence. React-rendered SVG is the default for compact rings,
  lines, columns, Pareto, waterfall, capacity, and journey charts where direct labels and predictable
  scaling matter most. Babylon is reserved for approved spatial, geographic, relationship, or
  dimensional scenes where depth, camera framing, instances, or guided focus materially improve the
  decision. Do not turn an ordinary bar or line chart into 3D merely to look advanced.
- In React SVG charts, D3 may calculate scales, ticks, bins, stacks, arcs, paths, projections, and
  deterministic layouts, but React owns the SVG elements, events, selection state, and lifecycle.
  D3 never selects or mutates DOM and never owns transitions, timers, drag, brush, or zoom.
- In Babylon scenes, Babylon owns cameras, lights, thin/regular instances, meshes, picking, scene/camera
  animation, and rendering. React still owns business state, filters, selected IDs, accessible content,
  and lifecycle. Keep primary labels, controls, legends, evidence, and keyboard commands in Fluent DOM.
- D3 is optional headless analytical math, not a component architecture. Retain a focused module only
  when it replaces substantial, tested domain-independent calculation that Babylon does not provide:
  - `d3-array` for grouping, rollups, bins, extents, sorting, cumulative totals, and derived series;
  - `d3-scale` for screen/world coordinates, radius/height, time, threshold, and deliberate color domains;
  - `d3-shape` for line/area points, stack extents, pie/arc angles, and link control points consumed by React SVG or Babylon meshes;
  - `d3-geo` plus `topojson-client` only for an approved geographic projection/boundary model;
  - `d3-hierarchy` for partition/treemap and `d3-force` for deterministic relationship layouts;
  - `d3-sankey` only for an approved flow whose layout would otherwise be hand-rolled.
- Before retaining a D3 module, compare a small deterministic local implementation on correctness,
  test surface, maintenance complexity, raw/compressed bytes, and stable output. Record the decision in
  `todo.md`. If no module has material value, remove D3 entirely. Do not retain a package merely because
  it appeared in a reference sample or makes a trivial calculation shorter.
- Do not install or import D3 selection, axis, transition, timer, interpolate/ease, brush, drag, zoom,
  fetch, or formatting modules. D3 calculation functions never receive DOM, canvas, Babylon, React
  state, timing, or animation references. Use `Intl` for formatting, CSS/React state for compact SVG
  transitions, and Babylon `Animation`/`AnimationGroup` for scene effects.
- Install one pinned `@babylonjs/core` version during the visualization spike and use direct ES-module
  class imports for production tree shaking. Never import `@babylonjs/core/Legacy/legacy`, add a React-
  specific Babylon renderer, or use Babylon GUI for primary text and controls. Fluent DOM overlays own
  semantic headings, filters, legends, evidence, tooltips, keyboard commands, and live announcements.
- Build reusable responsive chart cores with compact inline and immersive full-screen profiles. The
  initial signature set is:
  - **Estate Health Landscape:** region x department/device-family footprint, device count as height,
    and labeled health/compliance state as the top treatment. Use headless rollups and band scales for world X/Z,
    linear/sqrt scales for height/footprint, threshold scales for semantic state, and Babylon thin
    instances for the numerous mostly stable marks. Inline uses a fixed camera; full screen uses a
    bounded `ArcRotateCamera`, guided focus, selection, and coordinated evidence.
  - **Incident Correlation Constellation:** user reports converge into symptom/service clusters with
    link strength and incident state. Use a seeded headless D3 force simulation with link, many-body, collision,
    center, and fixed tick count; never let each render settle differently. Prefer regular instances or
    dedicated meshes where nodes change frequently. Inline answers whether reports represent one
    incident; full screen adds time depth, services, people, and declaration evidence.
  - **Refresh Wave Horizon:** quarter/wave depth, device count and cost height, and capacity/policy
    overlays. Use headless rollups/stacks plus band/time/linear scales and Babylon
    thin instances for stable cohort marks. It remains `Scenario - not applied` until review.
- One canonical selected ID coordinates the full dashboard. React derives optional interpretation, KPI context,
  evidence rail, supporting Babylon charts, scene emphasis, legend, and table selection from that same state.
  Camera state never becomes business selection state, and renderers never mutate each other directly.
- Every chart has a decision question, deterministic geometry, visible legend, selected-value detail,
  and a keyboard-reachable exact-value rail or table. Add a domain-specific takeaway only when it
  explains a non-obvious pattern or changes the next action; do not render a generic insight block.
  A 3D chart also has
  Reset view and an adjacent 2D table/list equivalent. Perspective, depth, color,
  lighting, hover, and motion are never the only carriers of exact values or status.
- Provide WebGL capability detection and a complete SVG/2D fallback. Constrain camera motion, expose
  keyboard-operable selection outside the canvas, and retain visible focus. Reduced motion renders the
  settled scene immediately and disables auto-rotation, pulsing, or camera flights.
- Render only while a scene is dirty, animating, or actively manipulated; stop the Babylon render loop
  when settled and pause while hidden. Cap hardware scaling, resize from the host element, and batch
  thin-instance buffers. Freeze static materials/world matrices only after transitions settle and
  unfreeze before updates. Disable pointer-move picking unless a tested hover interaction requires it.
- Dispose animation groups, observables, controls, scene, engine, instance buffers, meshes, materials,
  textures, and render targets on teardown. Instrument draw calls plus CPU/GPU frame time; optimize from
  measured evidence rather than enabling aggressive scene flags blindly.
- Validate each scene with desktop/mobile screenshots, nonblank canvas-pixel checks, WebGL fallback,
  keyboard/table equivalence, reduced motion, 200% zoom, theme contrast, no overflow, direct-import
  bundle audit, draw-call/frame-time evidence, teardown memory check, and context-loss fallback. A
  visually impressive but ambiguous, inaccessible, unstable, or continuously expensive scene fails.

---

## 0. Operating model & how to use this file

### 0.0 Next-sample fast path

Use this short path to start the next sample. The detailed sections below remain the acceptance
criteria; this sequence prevents rediscovery and avoids implementing breadth before the shared model
is proven.

**Quality-level blueprint - establish this before scaling the catalog:**

1. Define one domain-specific visual grammar: neutral operational canvas, one primary accent pair, one
  warm contrast accent, semantic states, typography, spacing, radii, elevation, and three permitted
  gradient roles. Remove or bypass the generator's purple welcome/header styling before visual review.
2. Classify each experience as information, review, submit, or education and sketch its first useful
  state. For action work, sketch the complete list -> detail -> decision -> confirmation -> updated
  list loop before building a single record card.
3. Build one shared inline frame, one full-screen shell, one list/detail action panel, one operation
  reducer, one media catalog, and one chart-model contract. Prove each at narrow and standard widths
  before generating route-specific composition at scale.
4. Make the mock graph tell one coherent story across people, devices/items, money, policy, requests,
  incidents, and outcomes. Bundle every accountable person's portrait before queue/dashboard polish.
5. Select chart form from the decision question, not from novelty. Use DOM for exact operational data,
  React SVG for compact analytical charts, and Babylon only when spatial/dimensional interaction earns it.
6. Validate the first representative information, list/detail review, submit, 2D chart, and signature
  scene end to end. Then scale with catalog-driven metadata and focused tests instead of copying bodies.
7. Capture the real host widths early. Test long labels, nonzero counts, completed statuses, missing
  media fallback, dark mode, 200% zoom, and the full-screen detail expansion before broad polish.

**Execution sequence:**

1. **Write the brief bundle.** Provide README objectives, one or more UX designs, a current-target
  component portfolio, and a prompt-routing matrix. For a small sample these may be sections in
  `todo.md`; a complex multi-family sample may use separate component-plan and demo-prompt documents.
  Decide the short keynote, longer business demo, and technical/code walkthrough before polish so
  implementation evidence naturally supports all three.
2. **Freeze identities and package metadata.** Approve final component/tool names, GUID ownership,
  routes, package IDs, and short plugin metadata before generation. API plugin v2.4
  `name_for_human` MUST be **20 characters or fewer**; use a short plugin-facing name when the full
  product/agent display name is longer. Also cap `description_for_human` at 100 characters and
  `description_for_model` at 2,048.
3. **Promote only high-value tools.** Keep a broader future intent inventory, but generate only the
  approved current-target intents. Supporting detail, history, and retrieval-only variants stay as
  internal full-screen routes until they earn independent conversational routing.
4. **Generate final identities with Yeoman.** Never copy, rename, or repurpose component scaffolds.
5. **Install once and automate immediately.** Pin the shared stack; add catalog, media, gallery,
  generated-plugin, and final package-output validators before scaling bodies. Generate/validate bundle
  membership from the catalog instead of maintaining component entries by hand. Confirm the clean
  baseline compiles.
6. **Prove the shared boundary and three operation slices.** Build owner-document theming, current-user
  fallback, intent resolution, fresh-invocation versioning, display-mode routing, then one complete
  information, review, and submit experience.
7. **Scale from the catalog.** Reuse host/workflow/chart mechanics while keeping domain composition and
  evidence specific. Add focused tests and visual evidence with each family or workspace.
8. **Ship through one command.** Source/catalog/media/gallery audits -> clean production tests ->
  package-solution -> validate the generated plugin -> audit the actual `.sppkg` JavaScript/media/icon
  output and size thresholds. Run a clean-clone/offline rehearsal before public submission.

### 0.1 Supported scaffolding and automation

The user approves the solution identity, final component catalog, and intent ownership. The coding
agent MAY automate component creation after that approval, but every component structure MUST come
from the supported SharePoint Yeoman generator. Never create, copy, rename, or reshape a generated
component scaffold by hand.

**Product owner before implementation:**

1. **Approve the final catalog before generation.** The user decides how many Copilot Components the
  solution has and their final names. The user or coding agent may run the generator. Example:

   ```bash
   npm install -g yo @microsoft/generator-sharepoint
   yo @microsoft/sharepoint      # choose "Copilot Component"; repeat / re-run to add more components
   npm install                    # if scaffolded with --skip-install
   ```

  > [!IMPORTANT]
  > When adding a new inline Copilot Component to an existing solution, always create the clean,
  > final-named component with the supported Yeoman generator pattern (replace `NameOfTheComponent`
  > with the intended component name):
  >
  > ```bash
  > yo @microsoft/sharepoint --component-type copilotComponent --component-name NameOfTheComponent --framework none --skip-install
  > ```
  >
  > After generation, update the implementation to follow this playbook. Do not rename the component,
  > transfer another component's GUID, or manually create/copy its structure. If an untouched placeholder
  > has the wrong name, remove it through an explicit scaffold-cleanup step and generate a new component
  > with the final name; never turn it into a different component.

1. **Add the UX design(s)** to the repo (mockups/wireframes under `assets/`, e.g. `assets/*.png`) and
   **write the README objectives** - the summary, the experiences (how many inline / full-screen), the
   signature feature, and the data story. This README-as-brief is the **input** the agent builds from.
2. **Make these rules available to the agent** - reference `agentic-creation-rules.md` one of these ways
   so the agent actually follows it:
   - as a **skill** the agent can load (e.g. a `SKILL.md` that points at / embeds these rules), or
   - as an **agent configuration file** (e.g. `AGENTS.md` / `.github/copilot-instructions.md` / a custom
     `*.agent.md`) that includes or links this file, or
   - **referenced directly in the prompt** ("follow `agentic-creation-rules.md`") when kicking off work.

   Keep a copy of this file in the new sample's root so it travels with the solution.
3. **Approve `todo.md` before implementation.** Dependency installation, mock-data work, and React work
  then follow the order in the approved project plan.

**Agent (this file):**

1. **Follow the approved phase order.** Install the baseline packages (§0.3) before the first React
  implementation. They do not need to precede pure mock-data modeling.
2. **Read the README objectives + the UX design.** Identify how many independently routed inline
  intents are approved and how they continue into full-screen routes. Mirror the final catalog in
  `todo.md`, not any temporary placeholder scaffold.
3. **Generate `todo.md` first** (see §2) from the README + UX. This becomes the user's primary task
   tracker - they review and steer from it. Do **not** start coding until the phased `todo.md` exists.
4. **Implement phase by phase** (see §3), updating `todo.md` as you go (§2.3).
5. **Generate approved components when their phase starts** with the Yeoman command above. Verify
  unique GUIDs, bundles, resources, and registrations before implementing them.
6. **Never deviate** from the Golden Rules (§1) without explicit user approval; never rename a
  generated component or imitate a scaffold through file operations.

### 0.2 Mandatory automation protocol - run for every sample

This sequence is not optional. It exists so a future sample can reach this quality without repeating
the discovery and repair work from Zava. Replace `<count>`, `<name>`, routes, and intent names with the
approved sample values, but keep the actions and gates.

1. **Freeze the brief and catalog.** Read the README/design assets, approve final component names,
   operation ownership, inline/full-screen routes, personas, data story, signature visuals, package
  identity, agent-icon concept, manifest accent color, and plugin-facing metadata limits
  (`name_for_human` <= 20). Write `todo.md`; do not code
   before approval. An intent earns a current-target component when it satisfies at least two of:
   frequent/time-sensitive decision value, meaningful prompt-driven variation, useful interaction or
   review, a distinctive visualization, and a natural full-screen continuation. Keep other candidates
   documented as future tools or internal routes rather than generating them speculatively.
2. **Generate final identities through Yeoman.** Generate every approved Copilot Component with its
   immutable final name. Never copy, rename, or repurpose a generated folder/GUID.
3. **Create catalog automation immediately.** Add one declarative intent catalog plus scripts that
   configure and validate manifests, adapters, schemas, bundles, localized resources, registrations,
  tool descriptions, starter definitions, preview metadata, and documentation. The validator MUST fail
  on duplicate GUID/tool/description, wrong counts, placeholder descriptions/properties, missing
  registrations, missing generated files, duplicate bundle membership, a manifest absent from the
  approved bundle strategy, preview/property type drift, a starter without one declared target, a
  duplicate starter target unless explicitly approved, or a stale generated routing matrix.
4. **Install and pin the shared stack once.** React 17, Fluent v9, Griffel, Jest, and only approved
  optional libraries. Add modular Babylon and focused D3 modules only when the renderer decision and
  measured spike justify them. Run a clean compile before feature implementation.
5. **Build the shared host before 30 bodies.** Implement current-user resolution, `ownerDocument`
   Griffel rendering, theme provider, consistent top-right full-screen action, operation dispatcher,
   intent metadata, and fresh-properties/passive-rerender behavior. Test this boundary first.
6. **Model one coherent offline domain.** Add source-appropriate typed records, deterministic clock,
   service interface/mock implementation, calculations, scenarios, relationships, and bundled media.
   Add referential-integrity and calculation tests before visual scale-out.
7. **Classify every intent by operation.** Information/status, Review/decision, or Request/submit.
   Implement one complete vertical slice of each operation before scaling siblings.
8. **Give every intent a purpose-designed body.** Shared framing/workflow mechanics are allowed;
   shared generic evidence/review bodies are not. Every root/stage gets a unique `data-layout` identity.
9. **Audit every visible control.** A retained filter/toggle/select/button MUST change records,
   grouping, chart marks, calculations, selected evidence, or workflow stage. Remove unsupported
   decorative affordances. Do not ship controls that only change a caption.
10. **Make forms and decisions explicit.** Prompt values prefill only. Use Draft -> Validate -> Review
  -> Confirm -> Receipt -> Reset/queue, with operation-specific review content, visible validation,
  semantic status colors, and session-only language.
11. **Use charts as data products.** Build typed analytical models first, then choose Fluent DOM,
  React SVG, or Babylon from the decision and rendering profile. Selector changes MUST supply materially
  different records, geometry, calculations, selected evidence, or narratives, not merely rename a chart.
12. **Add focused test matrices while implementing.** Assert catalog/layout uniqueness, all information
  defaults, retained control effects, selected detail, no-match/error fallback, all review safeguards,
  and every form's prefill/validation/Edit/review/confirm/receipt/reset lifecycle.
13. **Create a local visual harness before Workbench review.** It MUST render every intent, width, and
  theme without a tenant. Automate screenshots plus runtime, overflow, image, control-label, chart,
  keyboard-focus, reduced-motion, and 200% browser-zoom checks. Fail when deprecated shared chrome,
  broken images, blank required canvases, active engines after teardown, page errors, or console errors
  appear. Save a machine-readable evidence file and validate committed screenshots against it.
14. **Run tenant-host smoke separately.** If `{tenantDomain}` or authentication is unavailable, record
  the exact external prerequisite in `todo.md`; never mark CSP, iframe focus, or screen-reader host
  behavior complete from the local harness.
15. **Package only after all executable gates pass.** Run catalog/media/gallery audits, clean tests with
  zero warnings, production build, Teams/Copilot package generation, `.sppkg` generation,
  generated-plugin validation, final package-output/size audit, diagnostics, and `git diff --check`.
  Stop temporary servers and update `todo.md` immediately.
16. **Include capability education by default.** Generate `ExploreAgentCapabilities`, add it to the
  catalog as education/discovery, and reserve conversation starter 6 for it (§6.4). Starters 1-5 target
  five distinct high-value operational tools. A deliberately smaller starter set or omitted explorer
  requires an explicit approved UX override and replacement discovery path in `todo.md`.
17. **Enforce one request -> one primary tool.** Every tool description starts with a positive use
  boundary and names nearby exclusions. Every conversation starter has one expected target, one primary
  task, and no compound request that invites parallel tools. Generate the all-tool prompt/property/
  collision matrix from the catalog and check it in the build. Actual model selection is rehearsed in
  an authenticated tenant and must show exactly one selected tool per starter/request.
18. **Publish from verified evidence.** Preserve the approved product specification as a design brief
  before converting README to PnP publication format. Generate or validate the routing matrix,
  `assets/sample.json`, visual evidence, release evidence, demo scripts, package hashes, and the final
  `.sppkg`; do not hand-copy counts from terminal memory.

**Required reusable automation assets:**

```text
scripts/configure-intent-components.mjs   # catalog -> adapters/schemas/manifests/registrations
scripts/validate-intent-components.mjs    # fail-fast identity/schema/registration audit
scripts/load-intent-catalog.mjs           # one loader used by all generators and validators
scripts/generate-routing-matrix.mjs       # catalog -> prompt/property/collision doc + --check
scripts/generate-agent-icons.*            # one source mark -> color/outline PNGs + check mode
scripts/validate-generated-ai-plugin.mjs  # shipped ZIP -> plugin v2.4/functions/MCP/length audit
scripts/validate-package-output.mjs        # .sppkg -> JS/media/icon/stale-output/size audit
scripts/validate-gallery-assets.mjs        # sample.json -> metadata/PNG/order/URL coverage audit
scripts/validate-assets.mjs               # provenance paths/hashes/fallback policy audit
scripts/capture-visual-evidence.mjs       # Playwright -> catalog-named PNGs + evidence
scripts/visual-harness/                   # tenant-free all-intent host
assets/sample.json                         # unified gallery metadata; references real assets only
assets/visual-evidence.json                # dimensions/runtime/media/overflow results
assets/release-evidence.json               # artifact counts, sizes, and SHA-256 values
```

Recommended scripts for future samples:

```json
{
  "validate:intents": "node scripts/validate-intent-components.mjs",
  "generate:agent-icons": "pwsh -NoProfile -File scripts/generate-agent-icons.ps1",
  "check:agent-icons": "pwsh -NoProfile -File scripts/generate-agent-icons.ps1 -Check",
  "validate:assets": "node scripts/validate-assets.mjs",
  "generate:routing-matrix": "node scripts/generate-routing-matrix.mjs",
  "check:routing-matrix": "node scripts/generate-routing-matrix.mjs --check",
  "capture:visual": "node scripts/capture-visual-evidence.mjs",
  "check:gallery": "node scripts/validate-gallery-assets.mjs",
  "check:generated-plugin": "node scripts/validate-generated-ai-plugin.mjs",
  "check:package-output": "node scripts/validate-package-output.mjs",
  "start:visual": "node scripts/visual-harness/start.mjs",
  "validate": "npm run validate:intents && npm run check:agent-icons && npm run validate:assets && npm run check:routing-matrix && npm run check:gallery && heft test --clean",
  "build": "npm run validate:intents && npm run check:agent-icons && npm run validate:assets && npm run check:routing-matrix && npm run check:gallery && heft test --clean --production && heft package-solution --production && npm run check:generated-plugin && npm run check:package-output"
}
```

Keep capture and verification separate. `capture:visual` needs a pinned Playwright package and installed
Chromium (`npx playwright install chromium`) and intentionally rewrites PNG evidence. The canonical
build verifies committed evidence but does not silently recapture it. Run capture after material UX,
theme, responsive, media, or browser-rendering changes; then run the build. CI may add a separate
capture-and-diff job on an image-stable runner.

### 0.3 Dependencies - install before the owning implementation

The generator scaffolds `@microsoft/sp-copilot-component`, `zod`, and `zod-to-json-schema`. Before the
first React implementation, the agent adds the **React 17 + Fluent UI v9 + Griffel** baseline (pin to
React 17 - do not take React 18), then verifies the build:

```bash
# React 17 runtime + types (UX rendering)
npm install react@17.0.1 react-dom@17.0.1 --save
npm install @types/react@17.0.45 @types/react-dom@17.0.17 --save-dev

# Fluent UI v9 (components + icons) - pin the validated sample baseline (G4)
npm install @fluentui/react-components@9.74.6 @fluentui/react-icons@2.0.337 --save

# Griffel styling used directly by shared and visualization components
npm install @griffel/react@1.7.7 --save
```

Visualization is a core requirement for the Zava specialization, not a universal dependency. During
an approved visualization spike, add and pin modular `@babylonjs/core` plus only headless D3
calculation modules that pass the value test.
Never add the full `d3` bundle or D3 rendering/interaction modules. Use direct Babylon ES-module imports
over the legacy barrel. Do not add Vega/Vega-Lite or another 2D/3D engine to the current target without
an approved measured exception. Validate CSP, teardown, keyboard behavior, and bundle output immediately.

Add **only when a scenario needs them** (not baseline):

```bash
# PnP React controls - deep imports only; use when they add value (§16)
npm install @pnp/spfx-controls-react --save --save-exact

# PnPjs v4 - only in the live-data (deferred) phase (§16)
npm install @pnp/sp @pnp/graph @pnp/logging --save
```

> Keep versions aligned across samples for consistency (React 17.0.1, Fluent `@fluentui/react-components`
> 9.x, `@fluentui/react-icons` 2.x). Confirm the exact `@microsoft/sp-copilot-component` /
> `@microsoft/spfx-*` dev-preview versions from what the generator produced for the target SPFx build.

**Tool execution rules:**

- Use the repository's Heft/Jest integration. Do not run `npx jest` when Jest is not a direct executable;
  npm may offer to install an unrelated version. Use `heft test` or the repository's focused test task.
- Never run `heft test --clean`, `heft clean`, or the release build while `heft start` watches the same
  tree. Stop the watcher, verify port 4321 is closed, run the gate, then restart only if more work remains.
- Run one focused executable check immediately after the first substantive edit. Scale validation from
  touched model/component to visual capture to the canonical release command.
- Pin Playwright and its browser revision for deterministic evidence. Treat a missing browser binary as
  a tooling prerequisite, not an application failure.
- Use scripts for deterministic generation and bulk checks; manual code edits remain small and scoped.
  Every generator supports a check/dry mode that exits nonzero when committed output is stale.

### 0.4 Example human kickoff prompt (design pic + high-level README)

Once the solution is scaffolded and the objectives + design are in the repo, kick the agent off with a
prompt like the one below. **Attach the design image(s) in the chat** (multimodal) and/or reference them
by path so the agent can read the intended layout. Keep the prompt short - the README and the design are
the real brief; this prompt just points the agent at them and sets the sequence.

```text
Follow agentic-creation-rules.md for this sample.

Context:
- The SPFx solution exists and the final component catalog is approved in todo.md.
- Generate each component with its final name through the supported Yeoman command when its phase starts.
- The high-level objectives are in README.md.
- The UX design is attached (and saved at assets/<design-inline>.png / assets/<design-fullscreen>.png).
- The default UX contract applies unless the approved brief explicitly overrides one of its rules.

Please:
1. Read the README objectives and the attached design, then generate todo.md with Markdown checkboxes
  for me to review. Do NOT start coding until I approve the plan.
2. Freeze one primary tool per request and conversation starter. Put descriptions, starter targets,
  preview properties, routes, and prompt/collision metadata in one catalog-owned source.
3. After approval, follow its phase order. Add React 17, Fluent v9, and Griffel before React work and
  confirm the build (`heft test --clean`). Pure mock-data modeling may happen first.
4. Implement phase by phase against mock data - fully offline, source-appropriate data, Fluent v9,
  purpose-selected visualization, and the polish defined in the rules.
5. Finish with catalog-derived routing docs, Playwright implementation screenshots, PnP metadata,
  business and technical demos, the canonical build, package audit, and a reconciled release tracker.
```

**Why this works:** it anchors the agent to these rules, makes the approved `todo.md` catalog the naming
authority, hands over the design and README as the experience brief, and enforces plan approval before
phased implementation. If only planning is requested, stop before dependency or source changes.

> Tip: for a **single** iteration on one screen you can be more direct - e.g. "Build the full-screen view
> from this design pic, using mock data per `agentic-creation-rules.md`." But for a full sample, prefer
> the plan-first flow above so `todo.md` stays the shared tracker.

---

## 1. Golden rules (non-negotiable)

- **G1 - Copilot Component, not a web part.** No `BaseClientSideWebPart`, **no property pane**, no
  `getPropertyPaneConfiguration`, no `@pnp/spfx-property-controls`.
- **G2 - Heft, not Gulp.** Configs extend the rig. Never add `gulpfile.js`.
- **G3 - React 17 only.** Functional components. `import * as React from 'react'`. Classic JSX
  (`jsx: "react"`). Use `ReactDOM.render` / `ReactDOM.unmountComponentAtNode`. **No** `createRoot`,
  no concurrent APIs, no React 18+ features.
- **G4 - Fluent UI v9 always** (`@fluentui/react-components`, `@fluentui/react-icons`). Define brand
  values once as semantic custom tokens and use Fluent semantic tokens for controls and states. Static,
  responsive composition MAY use CSS Modules; use Griffel when runtime theme/style composition adds
  value. Never duplicate visible styling across generated component wrappers. (See §8 and §17.)
- **G5 - Mock data first, source-shaped where useful.** All data flows through typed service
  interfaces with a mock implementation. Mirror Microsoft Graph only for entities Graph actually
  supplies. Use Planner/Project-shaped or canonical project-domain contracts for other sources (§9).
- **G6 - Offline and deterministic by default.** Do not initiate runtime data or profile-photo
  requests. A usable image URL already supplied by the Copilot/SharePoint host context may render;
  otherwise use bundled images.  Actions may update a session-local mock store and produce receipts,
  but never persist externally in the mock phase (§10, §12).
- **G7 - Derive UI from props.** Read host state (`theme`, `displayMode`, dimensions) from
  `hostContext`; **never mirror host state in component state**. `render()` is idempotent.
- **G8 - Ship a committed `.sppkg`.** For mock-data samples, commit the built package so anyone can
  deploy without building (§17.4).
- **G9 - Accessibility & reduced-motion are requirements, not extras** (§14, §15).
- **G10 - Keep `todo.md` current** with Markdown checkboxes and explicit in-progress/blocked labels (§2).
- **G11 - Approved automation uses Yeoman.** The user approves the final component catalog. The agent
  may generate those components with Yeoman at the owning phase, but never creates or copies scaffold
  files manually (§0.1).
- **G12 - Component names and generated identities are immutable.** Generate each component with its
  final folder/class name. Never rename it, repurpose another scaffold, transfer a GUID, or evolve a
  placeholder into a differently named intent.
- **G13 - Choose and document the full-screen topology before implementation.** Inline intents remain
  independent tools. Full-screen mode may use a shared multi-workspace shell, an isolated scenario
  workspace, or both. Shared shells initialize the owning workspace/route/context; isolated full
  screens remain outside operational navigation and preserve only their own scenario state (§4.1, §7).
- **G14 - Visualization serves decisions.** One typed model feeds the approved DOM, React SVG, and/or
  Babylon rendering profile. D3 supplies analytical math only and never mutates DOM. Every chart needs
  a decision question, clear context, exact-value equivalent, deterministic data, and measured
  bundle/runtime cost (§11, §13-§17).
- **G15 - No decorative controls.** Every visible control changes records, grouping, chart geometry,
  calculations, selected evidence, draft values, or workflow stage. Remove controls that cannot yet
  fulfill their label. Static context is text, not a disabled/fake selector.
- **G16 - Share mechanics, not domain meaning.** Shared headers, actions, queue mechanics, validation
  shells, and receipt shells are encouraged. Information bodies, review evidence, review fields,
  consequences, confirmation commands, and receipt details remain operation-specific.
- **G17 - Review exactly what was edited.** Every visible/editable form value shown in review or receipt
  comes from the same live draft state. No hard-coded review labels that can drift from a selector.
- **G18 - Host-document styling is mandatory.** Griffel/Fluent styles render into
  `context.domElement.ownerDocument` through `RendererProvider`; parent-document style injection is not
  sufficient for Copilot Workbench (§8.1).
- **G19 - Evidence before completion.** Checkboxes become complete only after executable validation and,
  for visual work, saved evidence. Local harness results never substitute for tenant-authenticated CSP,
  iframe focus, or screen-reader host checks.
- **G20 - Semantic states are consistent end to end.** Pending/warning is amber, approved/success is
  green, and rejected/blocked/error is red in decision draft, receipt, and updated queue. Pair color
  with text/icon/data semantics; color is never the only signal.
- **G21 - One record, one queue owner.** Inline review queues and full-screen decision centers consume
  one canonical typed record catalog. When an item-level reviewer is embedded in a parent inbox, the
  parent owns list/filter/processed state and the child exposes evidence, decision, confirmation, and
  receipt only; never render a second nested queue.
- **G22 - Validate generated plugin metadata.** The seed `copilot/ai-plugin.json` is expanded during
  build, so source validation alone is insufficient. Keep API plugin v2.4 `name_for_human` at 20
  characters or fewer and validate the final generated `ai-plugin.json` inside the SharePoint-embedded
  agent ZIP after packaging (§5, §17.4).
- **G23 - Emit shared runtime and media once.** When multiple Copilot Components load the same React,
  Fluent, shared host, services, or mock-data graph, group their entries in one SPFx bundle so Webpack
  emits that graph once. Keep separate bundles only for a measured lazy-loading/isolation benefit and
  document the size trade-off. Never repeat a complete base64 media catalog across bundles. Clean before
  every production package and enforce the artifact gates in §18.
- **G24 - Separate invocation, transient, and confirmed state.** Normalize prompt properties into a
  deterministic signature/version owned by the Copilot component instance. Keep supported inline
  filters, selections, drafts, and review stage in a typed transient snapshot across host display-mode
  rerenders; clear it only for a fresh signature. Persist only confirmed mock actions/receipts in a
  sandbox-safe session store. Never put unconfirmed drafts or host context in shared session storage.
- **G25 - Establish the visual grammar before route scale-out.** One neutral canvas, one primary accent
  pair, one contrast accent, semantic status colors, consistent type/spacing/radius/elevation, and a
  small named gradient vocabulary serve the whole sample. Generic purple AI gradients, sparkle/robot
  motifs, nested cards, and scaffold welcome chrome never reach a review build.
- **G26 - Action surfaces default to work that needs action.** A queue opens on pending/actionable
  records, keeps completed statuses available through counted filters, and uses one list -> detail ->
  decision -> confirmation -> updated-list flow. The list owner retains filters and processed state;
  detail never embeds another queue.
- **G27 - People and products are first-class data.** Every visible accountable person and inspectable
  product has a packaged media mapping, meaningful alternative text, provenance, and initials/silhouette
  fallback before visual sign-off. Never leave the most important queue rows with missing faces.
- **G28 - One request selects one primary tool.** Tool descriptions, agent instructions, starters, and
  collision tests converge on exactly one tool for the user's primary request. Do not invoke adjacent
  tools in parallel because several could contribute context. A true multi-step request is handled
  sequentially, one visible tool at a time, with explicit continuation before a consequential next step.
- **G29 - One catalog drives generated surfaces.** Manifests, Zod bindings, bundle membership, agent
  registration, starter definitions, explorer education, preview properties, routing matrix, and
  expected counts derive from one typed catalog or catalog-owned configuration. Generated output is
  never fixed by hand; update the source and regenerate.
- **G30 - UX evidence is an artifact.** Real implementation screenshots and machine-readable visual
  evidence are versioned publication inputs. Historical design references are labeled and stored
  separately and never presented as current implementation screenshots.
- **G31 - Agent icons are designed assets, not scaffold residue.** Approve one brand/domain mark, derive
  `color.png` and `outline.png` from the same deterministic source, validate their dimensions,
  transparency/color treatment, manifest mapping, provenance, and packaged bytes, and inspect them at
  actual small size before release.

---

## 2. Step 1 - Generate `todo.md` (the tracking mechanism)

### 2.1 What `todo.md` is

The **single source of truth** for the build, mapped to the README commitments. The user evaluates
scope and progress from it. Generate it **before** coding, from the provided UX design.

### 2.2 Required structure

- **Title + intro** linking to `README.md`.
- **Status legend:** use `- [ ]` for open work and `- [x]` for validated work. Add bold `IN PROGRESS`
  or `BLOCKED: <reason>` text to an open item when needed.
- **Progress (latest)** blockquote - a living 1-paragraph summary; keep it updated.
- **Approach & sequencing** - the phase order (§3).
- **One `## Phase N` section per phase**, each broken into `###` subsections with Markdown checkbox
  items using `- [ ]` and `- [x]`.
- **Deferred - Dynamic data / API integration** section (live Graph/PnPjs/tool schema/provisioning).
- **Docs & cleanup** section.
- **Reusable playbook** pointer back to this rules file.
- **Open decisions** list.

### 2.3 Maintenance rules

- Mark items `[x]` immediately after focused validation. Mark active work by adding **IN PROGRESS** to
  the open item; keep at most one active implementation slice unless parallel work is explicit.
- When a decision changes an earlier item, **strike-through and annotate** rather than deleting
  history (e.g. `~~inert~~ **now live (Phase 5)**`).
- Keep the **Progress (latest)** blockquote accurate; refresh it at the end of each phase.
- Do **not** create separate competing Markdown status files - track progress in `todo.md`.
- After completing a later redesign/scale-out phase, reconcile older phase wording. Change stale
  “generate/implement” items to checked “inline complete” items and leave only the genuinely remaining
  full-screen, integration, accessibility, or documentation work open. Do not let historical planning
  bullets contradict current implementation.
- Test/warning/artifact counts in `todo.md` come from the latest saved command output, never memory.
  Update the top Progress block and every duplicated phase count in the same change.
- Split partially proven tasks. Example: check local light/dark/reduced-motion/200%-zoom validation and
  leave tenant high-contrast/screen-reader validation as a separate open item.
- External prerequisites get one precise open checkbox naming the missing value/authentication and the
  checks it blocks. Do not leave broad “finish Phase” tasks open when all local executable work passed.
- Reusable definitions of done are prose rubrics, not unchecked aggregate project tasks. Keep checkbox
  counts meaningful by recording only concrete implementation, validation, publication, or external
  prerequisite work.
- Evidence files supplement `todo.md`; they do not replace it. Store machine-readable matrices and
  screenshots under the sample's review/evidence folder and link/name them in the relevant checkbox.
- At publication time, reconcile the tracker into verified delivered scope, explicitly superseded early
  concepts, exact local evidence, tenant-only blocked validation, and deferred production integration.
  Preserve the original product specification as a design brief rather than keeping hundreds of stale
  unchecked planning bullets that contradict the released architecture.
- Record test totals, screenshot totals, package sizes, JavaScript/chunk counts, and SHA-256 values only
  from machine-readable evidence or the latest complete command. Never infer them from a filtered run or
  copy them from an older progress paragraph.

---

## 3. Phasing and gates

Build UX-first against mock data and defer live API work. `todo.md` owns the actual phase sequence.
The reusable order below is guidance, not a numbering contract, and package installation may occur
before or after pure mock-data modeling as long as it precedes the code that imports those packages:

0. **Phase 0 - Scope & brief.** User approves final names, UX, and the component catalog. User or agent
  generates components only at the approved phase using Yeoman.
1. **Phase 1 - Mock data structure.** Source-shaped mock modules + view models + mapper + relative-time
   resolution + `MockDataService`. (§9)
2. **Phase 2 - Inline experience.** React components for each inline view; responsive; theming. (§6–§8)
3. **Capability education gate (default for every full sample).** Catalog-driven
  `ExploreAgentCapabilities` experience, sixth conversation starter, safe prompt action, isolated
  full-screen preview gallery, and evidence (§6.4).
4. **Phase 3 - Full-screen experience.** Approved navigation topology + useful default workspace
  dashboards + exact intent continuation + isolated scenario workspaces where appropriate + the
  **signature hero feature**. (§4.1, §6, §11, §14)
5. **Phase 4 - Shared UI building blocks & theming.** Extract/reuse controls across views; confirm
   theming. Inline drill-downs SHOULD reuse full-screen controls where sensible.
6. **Phase 5 - Configuration impact (optional but high-value).** Session-persisted settings that
   actually reshape the UX. (§12)
7. **Phase 6 - Showcase polish.** Motion/first impression; make the hero feature the "wow" moment;
  narrative coherence of the mock; visual finish; demo enablement (short keynote, longer business
  journey, technical/code walkthrough); demo reliability. (§11–§15)
8. **Deferred - Dynamic data / API integration.** Live service implementations for Graph, SharePoint,
   Planner, Project, Fabric, finance, or governance sources; real signature-feature backend; tool-input
   rework; provisioning. (§16)
9. **Docs & cleanup.** README from PnP template, `assets/sample.json`, real screenshots, commit
   `.sppkg`. (§18)

**Definition of done per phase:** focused behavior checks pass, required visual/evidence checks are
saved, `heft test --clean` passes with **zero lint warnings/errors**, external prerequisites are
isolated explicitly, and relevant `todo.md` items are reconciled immediately after validation.

---

## 4. Architecture & entry points

Each Copilot Component lives under `src/copilotComponents/<name>/`:

- `` `<Name>CopilotComponent.ts` `` - extends `BaseCopilotComponent<TProperties>`. `render()` mounts the
  React tree into `this.context.domElement`; `onTeardown` unmounts. Pass host state + resolved user
  down as props:

  ```ts
  protected render(): void {
    const element = React.createElement(<Name>App, {
      /* tool inputs */ ...this.properties,
      currentUser: resolveCurrentUser(this.context),
      theme: this.hostContext.theme,
      displayMode: this.hostContext.displayMode,
      availableDisplayModes: this.hostContext.availableDisplayModes,
      onRequestFullscreen: this._handleRequestFullscreen
    });
    ReactDOM.render(element, this.context.domElement);
  }
  protected onTeardown(reason?: string): Promise<void> {
    ReactDOM.unmountComponentAtNode(this.context.domElement);
    return super.onTeardown(reason);
  }
  ```

- `` `<Name>CopilotComponent.manifest.json` `` - `componentType: "CopilotComponent"`, `copilotType: "Ux"`,
  `capabilities.availableDisplayModes`, and the `tools` array (name, localized description,
  `propertiesSchema` → compiled properties module).
- `` `<Name>CopilotComponentProperties.ts` `` - Zod schema with `.describe()` on **every** field; export
  the inferred type and `export default zodToJsonSchema(schema)`.
- `components/` - React views (§6).

**Multiple experiences:** one prompt-addressable intent gets one final-named component, tool, manifest
GUID, optional schema, and inline root. Related intents share services and visual building blocks.
A multi-workspace solution MAY render one shared full-screen shell with immutable `initialWorkspace`,
`initialRoute`, normalized `initialParams`, and a properties-version token. The shell owns navigation,
settings, workspace/route state, focus restoration, and internal transitions. A specialized intent MAY
instead render an isolated full-screen workspace when shared operational navigation would distract from
its task. Do not copy the shell into component folders or use a public generic `view` property to
multiplex inline intents.

Use a shared intent host similar to the reference `ZavaIntentCopilotComponentBase`: resolve fixed intent
metadata, detect fresh prompt-property signatures, render the focused inline view in inline mode, and
render the shared shell in full-screen mode. Passive host rerenders preserve local interaction state;
a fresh property signature reapplies prompt-derived defaults.

Use one typed resolver per intent or closely related family. Normalize unknown host input before it
reaches React, remove `undefined` transfer values, and return one explicit contract:

```ts
type IntentParam = string | number | boolean | string[];

interface IResolvedIntent<TNormalized> {
  definition: IIntentDefinition<unknown>;
  properties: TNormalized;
  params: Record<string, IntentParam>;
  signature: string;
}
```

- Keep exported tool Zod schemas simple and packaging-safe. A separate runtime-only Zod schema MAY use
  `z.enum`, `.min()`, `.max()`, transforms, `safeParse`, and `.catch()` because it is not passed to
  `zodToJsonSchema`; alternatively use plain normalization functions. Invalid input falls back to a
  useful default instead of failing render.
- Build signatures from normalized values in a deterministic field order. Increment a properties-
  version token only when that signature changes. Theme, dimensions, host context, or other passive
  rerenders MUST NOT increment it or reset edits.
- Compact transferred params by omitting `undefined`; do not serialize absent values into full-screen
  state. Test `{}`, partial, invalid, stale, and fresh values at the resolver boundary.
- The `BaseCopilotComponent` subclass owns the current signature, version, and typed transient snapshot
  because the host can replace inline React with full screen while preserving the component instance.
  Inline operation bodies report snapshots through one callback; full screen consumes the same object.
  Representative information, review, and submit paths MUST prove this boundary before scaling adapters.
- Treat snapshot coverage honestly. Silent state transfer is the foundation; a visible prompt/context
  summary neither proves nor is required for continuation. Exact continuation is complete only when the
  destination module consumes the transferred entity, filter, selected evidence, draft, or what-if values.

Use an explicit adapter kind in intent metadata rather than route-specific conditionals:

| Adapter | Inline snapshot | Full-screen continuation |
| --- | --- | --- |
| `selection` | selected record/mark ID | Focus the matching entity, evidence, legend, and table row. |
| `filters` | normalized filter/group/period values | Rebuild the dashboard model with the same scope. |
| `form` | controlled draft plus validation-safe options | Open the owning form/review route with edits intact; never submit. |
| `review` | selected queue record, decision draft, and rationale | Open that record's evidence/decision stage while the outer queue retains list state. |

Test each adapter for fresh invocation, passive rerender, Expand, invalid/stale IDs, and Reset. Transfer
only normalized values needed by the destination; do not render a generic property dump to demonstrate it.

### 4.1 Full-screen topology and routing contract

Choose the topology from user workflow, information architecture, and expected screen density. Record
the choice in the README and `todo.md`; do not inherit horizontal tabs or a left rail merely because a
reference sample used them.

| Topology | Use when | Contract |
| --- | --- | --- |
| **Shared workspace shell** | Several intents belong to durable work areas that users naturally move between. | One shell owns navigation and dashboard state. Each inline component expands to its owning workspace, exact route, entity, filters, draft/scenario values, and selected evidence. |
| **Isolated full screen** | The scenario is self-contained, educational, highly immersive, or should not disturb operational workspace state. | Render a dedicated full-screen root outside shared navigation. Preserve the scenario's own context and provide a clear host-owned way back. Do not add a fake primary workspace just to house it. |
| **Hybrid** | Most intents share operational workspaces but one or more scenarios need isolation. | Use the shared shell for operational intents and explicit isolated roots for approved exceptions, all selected from catalog metadata rather than component-name conditionals. |

Model the catalog explicitly:

```ts
type FullscreenDestination =
  | {
      kind: 'workspace';
      workspace: string;
      route: string;
    }
  | {
      kind: 'isolated';
      route: string;
    };

interface IIntentDefinition<TProperties> {
  fullscreen: FullscreenDestination;
  normalize: (properties: TProperties) => Record<string, unknown>;
}
```

**Navigation orientation:**

- Horizontal tabs suit 3-5 peer workspaces with short stable labels and preserve more horizontal chart
  width. Keep the row visible or predictably reachable; on narrow screens allow horizontal scrolling
  or use one accessible workspace selector.
- Vertical navigation suits more workspaces, longer labels, icon-supported categories, or workflows
  where persistent cross-area switching matters more than maximum chart width. Collapse it to an icon
  rail only when every icon has an accessible label and tooltip; replace it with a selector/drawer on
  narrow screens.
- A solution may switch orientation at an approved breakpoint, but workspace identity, order, route
  state, keyboard behavior, and focus destination MUST remain stable. Orientation is layout, not a
  different information architecture.
- Use the available canvas. Full-screen content fills the host width with a readable responsive
  maximum that increases on desktop and projector displays. Do not strand a dashboard in an inline-
  sized center column or stretch compact inline components across the full canvas.

**Workspace dashboard contract:**

- Every primary workspace opens to a useful default dashboard, not an empty shell, route dropdown, or
  enlarged copy of one inline component.
- A dashboard coordinates several decision-relevant regions: identity/scope hero, 3-5 reconciled
  metrics, one dominant visual or work queue, supporting evidence, and clear operations.
- Selectors such as project, account, employee, store, period, or scenario update all compatible
  dashboard regions together. Show the selected scope and offer Reset where state can accumulate.
- Enter dashboards without opening a detail/review/action panel automatically. An explicit Review or
  action launcher opens one bounded panel; preserve the dashboard behind it and restore launcher focus
  on close.
- A deep-linked inline intent becomes the highlighted focused module inside the broader dashboard.
  The user sees both the exact answer they expanded and the surrounding workspace context.
- Workspace landing is only the shell foundation, not proof of exact route continuation. Until the
  route-specific module and its transferred state are visible and tested, track that continuation as
  open rather than claiming the catalog route alone completes it.
- Keep route selection secondary. Prefer visible dashboard sections and direct evidence actions over a
  mandatory “View” dropdown that hides most information one route at a time.

**Exact continuation contract:**

1. Inline answers the immediate conversational question and allows meaningful local interaction.
2. Expand requests host full-screen mode without optimistic local mode changes.
3. The same component resolves its catalog destination and supplies normalized prompt parameters plus
   transient interaction state when supported.
4. Shared shells focus the owning dashboard/route; isolated roots focus their scenario heading.
5. Preserve entity, comparison set, filters, selected evidence, draft fields, and safe what-if values.
   A fresh invocation reapplies new prompt defaults; a passive host rerender does not reset user work.
6. Full screen adds context and operations. It never resets to a generic home page or merely scales the
   inline layout wider.

**Required validation:**

- Test one exact landing per workspace and every isolated destination.
- Test fresh invocation versus passive rerender and at least one transient inline interaction surviving
  Expand for each operation model (information, review, submit).
- Test keyboard navigation and focus for both navigation orientations used by the solution.
- Capture every default dashboard at mobile, standard, desktop/keynote, light, and dark states. Assert
  no horizontal overflow, blank charts, inaccessible controls, or inline-width content stranded on a
  large canvas.

### 4.2 Repeatable implementation sequence

Use this order to avoid rebuilding navigation and state after route bodies already exist:

1. **Inventory destinations with the intent catalog.** Assign every intent exactly one workspace route
  or isolated route. Validate that all manifests support full screen before building UI.
2. **Choose navigation from the information architecture.** Decide horizontal, vertical, or responsive
  orientation from workspace count, labels, workflow, and chart-width needs. Freeze workspace IDs and
  order; visual orientation may adapt later without changing routing.
3. **Build one shell and one isolated-root adapter.** Implement host mode detection, catalog destination
  resolution, exact landing, focus management, settings location, and responsive canvas constraints.
  Do this before creating multiple full-screen pages.
4. **Build useful default dashboards first.** Implement one representative workspace dashboard with
  scope selector, metrics, dominant visual/queue, evidence, and operations. Validate it at mobile and
  keynote widths, then scale the composition pattern to sibling workspaces without copying one generic
  card grid.
5. **Embed the invoked intent as focused context.** Reuse the validated intent body inside the owning
  dashboard when deep-linked. Key stateful review/submit bodies by route/entity so switching requests
  cannot leak stale local state.
6. **Add transient-state transfer deliberately.** Separate prompt-normalized invocation state from local
  interaction state. Test selection/filter/draft/scenario continuity during Expand and reset only when
  the properties-version signature proves a fresh invocation.
7. **Add cross-workspace journeys after defaults work.** Use typed destinations from evidence, queues,
  and decision threads. Never use browser URLs for internal navigation or add a route dropdown as the
  only way to discover workspace content.
8. **Automate the visual matrix.** Add harness controls for every real host checkpoint, including a
  desktop/keynote width. Remove harness-only transitions that make measurements stale. Measure the
  settled host and dashboard widths, not just the selected option label.
9. **Validate and package once per material slice.** Run focused shell/dashboard tests immediately,
  capture screenshots and machine-readable evidence, then run the complete production package gate.

**Efficiency heuristic:** share host mechanics, navigation, responsive primitives, metrics, and panel
framing; keep workspace composition, domain evidence, calculations, and decision operations specific.
This gives future samples a reusable architecture without making every product look like the same
dashboard with different labels.

---

## 5. Tool input schema (Zod)

```ts
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
const schema = z.object({ message: z.string().describe('...') });
export type I<Name>Props = z.infer<typeof schema>;
export default zodToJsonSchema(schema);
```

- Every field MUST have `.describe()` - the text drives how Copilot populates the tool.
- All prompt fields SHOULD be optional so `{}` produces a useful default and extraction can be partial.
  This sample's catalog validator makes `.optional()` mandatory.
- The authored Copilot Component schema is JSON Schema draft-07, but SPFx packaging translates it into
  API plugin v2.4 `functions[].parameters` and mirrored MCP `tools[].inputSchema`. Validate generated
  `ai-plugin.json` from the agent ZIP embedded under `sharepoint/solution/debug/ClientSideAssets/`, not
  only the Zod source or the seed `copilot/ai-plugin.json`.
- The packaged API plugin parameter subset supports top-level `type: object`, `properties`, and optional
  `required`; each parameter supports `type`, `items`, string `enum`, `description`, and `default`.
  Supported types are `string`, `array`, `boolean`, `integer`, and `number`; array items are simple
  parameters. Property names match `^[A-Za-z0-9_]+$`.
- Copilot Component property schemas MUST NOT emit `minLength`, `maxLength`, `maxItems`, `minimum`,
  or `maximum`. Do not use Zod string `.min()`, string `.max()`, string `.length()`, array `.max()`,
  or numeric `.min()`/`.max()` in exported tool schemas. Preserve bounds, trimming, and empty-value
  handling in plain normalization code or a separate runtime-only schema that is never exported.
- Published plugin v2.4 metadata limits are: `name_for_human` 20 characters,
  `description_for_human` 100, and `description_for_model` 2,048. Other unspecified plugin strings
  SHOULD stay within 4,000 characters. These limits apply to authored/generated plugin metadata,
  including function and parameter descriptions; they do not define a maximum extracted runtime
  property value. Enforce business-safe runtime value lengths in normalization/UI validation without
  emitting unsupported `maxLength` into the tool schema.
- Accept only SPFx's deployment-time `{{TENANT_MCP_URL}}` and `{{TENANT_ORIGIN}}` placeholders in the
  generated Remote MCP runtime. Validate every other string, parameter keyword/type, function/MCP tool
  mirror, read-only annotation, output template, and CSP shape at build time.
- Use `z.object({})` when prompt extraction cannot improve the initial experience. Do not add ceremonial
  placeholder inputs. Finalize useful optional parameters with the initial component implementation.

### 5.1 Prompt routing and conversation starters - exactly one tool

Routing quality is authored before it is model-tested. The local build can prove metadata alignment and
collision coverage; only an authenticated host rehearsal can prove actual model selection. Never claim
the latter from string matching alone.

**Tool description contract:**

- Begin with a positive boundary: `Use for ...` or `Use when ...` naming the exact task and required
  entities. End with `Do not use ...` naming the nearest sibling intents.
- Keep one business operation per tool. Do not combine browse + configure, diagnose + submit, queue +
  decide, overall health + age distribution, or broad summary + specific metric in one description.
- Prefer specific entities and verbs over broad nouns. When two tools share vocabulary, define a
  discriminating verb, scope, identifier, or outcome and add the pair to the collision matrix.
- Broad help/capability language routes only to education. Specific task language always wins over an
  explorer or broad-summary fallback.

**Conversation starter contract:**

- Every starter is one natural sentence with one primary verb, one scope, and one expected tool. Do not
  join tasks with `and`, `then`, a slash, or multiple sentences when that can invite more than one tool.
- Store starters and their expected target names in catalog-owned configuration. Generate
  `declarativeAgent.json` from that source and validate exact title/text/order/target coverage.
- Prefer distinct high-value first-run tasks across operation types and audiences. Do not repeat the
  same target merely to expose more phrasing unless the product owner explicitly approves that trade-off.
- Expose exactly six starters by default. Starters 1-5 target five distinct high-value operational
  tools across the sample's important audiences or operation types. Starter 6 targets
  `ExploreAgentCapabilities`; its prompt is broad discovery only.
- Changing the count or omitting capability exploration is an explicit UX exception. Record the reason,
  replacement discovery path, expected targets, and validation in the brief and `todo.md`.
- The declarative-agent schema may not encode a hard target. In that case the expected target is a
  validation/rehearsal contract, not a claim that local code controls model routing.

**Catalog-derived routing matrix:**

Generate one row per current tool containing tool name, operation, scope/lens, copy/paste prompt,
optional property previews, exact full-screen destination, positive boundary, nearest negative
collision boundary, and fresh-invocation expectation. Add an explicit starter table. `--check` rebuilds
the expected content in memory and byte-compares it with the committed file; it does not merely check
that the file exists.

**Required gates:**

1. Local validator: unique descriptions; every description has positive/negative boundaries; all
   starter expected targets exist; starter title/text/order match generated JSON; explorer is last when
   required; preview values match schema types; routing matrix is current.
2. Collision tests: representative sibling prompts map to one expected name in deterministic routing
   fixtures/documentation. These test authored boundaries, not the production language model.
3. Tenant rehearsal: send every starter and matrix prompt in a fresh authenticated conversation; record
   the selected function/tool and extracted properties; fail any zero-tool or multi-tool primary result.
4. Multi-step prompts: when intentionally tested, require sequential handling and never allow prompt
   extraction to approve, submit, delegate, declare, wipe, or apply a plan automatically.

---

## 6. Component & view structure

- **Root selector** (`<Name>App.tsx`) - thin; picks the view from `displayMode`
  (`'fullscreen'` → full-screen view; anything else → inline). Wraps children in the theme provider.
- **Per-mode views** - each component owns a focused `<Name>Inline.tsx`; a multi-tab application may
  delegate full-screen mode to one shared shell rather than create `<Name>Fullscreen.tsx` 30 times.
  Approved isolated destinations use a dedicated root selected from catalog metadata.
- **Building blocks** - `components/inline/`, `components/fullscreen/`. **Reuse** full-screen controls in
  inline drill-downs where it makes sense (My Day reuses `AgendaTimeline` + `TasksPanel` in inline;
  keeps a separate inline list only where the compact UX differs).
- **Drill-down navigation** - inline owns local `view` state via `useState`; provide a back affordance
  (a shared `InlineDetailHeader` with an optional title so reused cards don't double their title).

**Inline header contract:**

- Use one shared full-width header with `grid-template-columns: minmax(0, 1fr) auto`, stable vertical
  rhythm, and no layout shift between routes. The left identity block shows the agent/brand name and
  optional small brand mark first, then the literal current action title as the heading. Example:
  `Zava IT Concierge` above `Device health`. Do not use a generic greeting or “AI result” title.
- Place one **View in full screen** button in the top-right corner when the host supports full screen.
  Use the Fluent expand icon plus text, a minimum 38 px control height, restrained outlined/tinted brand
  treatment, visible focus, and an accessible name. Keep it visually separate from the primary business
  action so Expand cannot be confused with Approve, Submit, or Run.
- At narrow inline widths, keep a stable 36-38 px icon button, hide only the visible label, and retain
  the full accessible name and tooltip. Never wrap the full-screen label into the title or let the
  button shrink the action heading below a readable width.
- The body starts with the domain content. Do **not** add reusable `From your prompt`, `Prompt context`,
  or generic `Decision insight` blocks to the shared frame. Prompt-derived values silently initialize
  the relevant filter, selected entity, or draft. When users need provenance, show concise domain
  context beside the affected field or evidence, not a dump of extracted property names/values.
- A domain-specific takeaway or evidence panel is optional only when it changes interpretation or the
  next action. Do not reserve an empty right rail or repeat a generic insight sentence on every route.
  Existing sample-specific demo overlays may remain, but future samples do not copy them by default.

### 6.1 Operation models and dispatchers

Classify every intent in one catalog-owned helper before implementing bodies. Do not infer operation
type from component names at render time.

| Operation | Inline contract | Required states |
| --- | --- | --- |
| Information/status | Answer one decision question immediately with a specific visual/list hierarchy. | useful default, filter/group change, selected detail where relevant, no-match, error fallback |
| Review/decision | Start with a ranked queue; selected request opens purpose-specific evidence and consequences. | queue, review, decision draft, confirm, receipt, updated queue |
| Request/submit | Show real labeled controls initialized from prompt properties; never auto-submit. | draft, validation, review, confirm, receipt, prompt-backed reset |

- Use one operation-aware router (`getInlineOperation(intentKey)`) and separate information, review,
  and submit dispatchers. Unknown intents fail loudly in development; do not render a generic KPI body.
- Every intent/stage root has a stable unique `data-layout` value. Add a catalog test that renders all
  intents and asserts the expected count of unique default layouts.
- A shared application root owns only framing: brand/action header, full-screen action, routed body,
  and an optional domain status footer. It does not own a universal intent body, prompt echo, or
  decision-insight rail.

### 6.2 Truthful control audit

Before a route can pass its inline gate, inventory every visible `button`, `select`, input, slider,
tab, and clickable chart mark:

1. Record the control label, state variable, and exact output it changes.
2. Keep it only if a test can prove changed records, grouping, chart marks/data, calculation, selected
   evidence, draft value, validation, or workflow stage.
3. If the intended behavior is not implemented, remove the affordance and present the context as text.
4. Add `aria-pressed` to binary toggles and `aria-label` to controls whose visible text does not provide
   a stable accessible name.
5. Selector choices must create material variance. Different labels over the same records/geometry do
   not satisfy this rule. Grouping selectors must change headings and membership; metric selectors must
   supply different datasets; filters must be capable of producing an intentional no-match state.

### 6.3 Domain-specific reviews and receipts

- Share `ReviewActions`, workflow transitions, and receipt framing only. Build separate review
  components for each operation/domain.
- Keep review records in one canonical typed catalog when the same work appears in inline queues and a
  full-screen decision center. IDs, people, due state, evidence, amounts, safeguards, and receipt inputs
  must come from that source; tests compare the matching queue records directly.
- Give the outer decision center sole ownership of list filters, selection, and processed status.
  Embedded item-level reviews hide their own queue and back-to-queue affordances, report completion to
  the parent, and leave the resulting receipt visible beside the updated list row.
- Review labels and values must map to visible draft fields. If a value appears in review, expose it in
  the source form or identify it explicitly as a derived calculation.
- Confirmation button text names the operation (`Publish weekly update`, `Submit timesheet`,
  `Submit usage record`), never generic `Confirm submission` when several tools differ.
- Receipts name the record created/updated, include matching key values, stable sample ID, session-only
  language, next step, and a Reset/Create another action that restores initial prompt-backed values.
- Review queues preserve filters and mark processed items semantically after returning from receipts.
  Return/Reject rationale requirements are visible beside the field; never hide a character threshold
  behind a disabled button.

#### 6.3.1 List -> detail action process

Use this pattern when users must triage several records and then make a consequential decision on one.
Do not begin with a large generic form or render every record's evidence in the queue.

1. **Default to action.** Open on pending/actionable records and label the view in user language such as
  `Action items`. Keep `Pending`, `Approved`, `Declined`, and `All` available with live counts so users
  can audit prior outcomes without mixing them into the default workload.
2. **Keep the queue compact.** Target roughly 56-58 px rows: 32-36 px accountable-person portrait,
  one strong identity/request line, one secondary status/time line, and one explicit `Review` or `View`
  action. Cost, policy, justification, and full evidence belong in detail, not in the scanning row.
3. **Make filters layout-stable.** Use a full-width segmented group with equal tracks, `aria-pressed`,
  tabular counts, and explicit 4-6 px label/count spacing. Stack the title/count above the filters when
  compact; never squeeze long status labels into leftover header width.
4. **Replace list with detail in the same bounded surface.** Detail starts with Back, a larger portrait,
  status, identity/title, and concise summary; then justification/evidence, 2-column fact grid, decision
  fields, and specific actions. Collapse the fact grid to one column at narrow width.
5. **Separate decision from confirmation.** Require and explain rationale before enabling Approve/Decline;
  show a confirmation step naming the record, action, condition, and rationale; only then append a
  session receipt and update the immutable queue overlay.
6. **Completed records are inspectable, not editable.** `Approved` and `Declined` detail shows the stored
  rationale and outcome with semantic text/icon/color. It does not offer a second decision unless the
  product explicitly defines reopening.
7. **Preserve work context.** Returning to the list retains the selected status filter and reflects the
  changed counts. Remounting restores confirmed decisions from guarded session receipts; drafts and
  unconfirmed rationale do not persist.
8. **Expand the owning layout, not the child queue.** In a dashboard, hide or reflow adjacent summary
  content while detail is open so the review uses the available width. The outer list owns selection,
  filters, and completion; embedded reviewers expose only detail/decision/confirmation/receipt.

Required tests: pending-default IDs and order, all filter counts, compact label fit, selection-to-detail,
Back preserving filter, rationale safeguard, confirmation, immutable update, completed read-only detail,
receipt restoration after remount, missing-media fallback, and narrow/full-screen overflow.

### 6.4 ExploreAgentCapabilities - default education experience

Every full sample includes one final-named `ExploreAgentCapabilities` Copilot Component by default. Its
job is to explain the agent's business capabilities and help users start the right experience. This is
not technical API documentation and not a static help page. A deliberately tiny sample may omit it only
through the explicit UX override process and must provide an approved replacement discovery path.

**Conversation starter contract:**

- Follow the single-tool rules in §5.1. Expose **exactly six conversation starters** by default and
  reserve **conversation starter 6** for `ExploreAgentCapabilities`. Recommended generic copy:

  ```json
  {
    "title": "Explore capabilities",
    "text": "Explore what this agent can do."
  }
  ```

  Starters 1-5 target five distinct high-value operational tools and starter 6 covers the remaining
  breadth through discovery. Do not create compound starters to advertise more tools.

- Agent instructions route broad capability/help prompts (“what can you do?”, “show available
  scenarios”, “help me get started”) to the explorer before broad summary fallbacks.
- Keep the other starters focused on high-value first-run tasks. The explorer starter is the durable
  entry point to the complete breadth of the agent.

**Component identity and ownership:**

- Generate the immutable final-named `ExploreAgentCapabilities` component through Yeoman.
- Classify it as an **education/discovery** operation in the intent catalog rather than forcing it into
  information/review/submit. It may use a dedicated dispatcher because its navigation and preview
  behavior differ from operational answers.
- Exclude the explorer itself from the capabilities it advertises to avoid recursion.

**Single dynamic source of truth:**

- Extend the same catalog that configures tools and routes; never maintain a second hand-written list
  of capabilities in the React component or agent instructions.
- Every advertised intent supplies education metadata:
  - end-user scenario name and one-sentence business outcome;
  - workspace/category and audience;
  - operation model (`information`, `review`, `submit`);
  - one natural-language example prompt with realistic mock entities;
  - optional tags/search keywords and featured rank;
  - deterministic `previewProperties` that render a useful mock preview;
  - preview safety (`readOnly`, `scenario`, and whether actions are disabled in gallery mode).
- Add validator assertions: every advertised intent has complete unique education metadata, prompt text
  maps to the owning tool, categories are valid, preview properties normalize, and the explorer count
  equals the advertised catalog count.

**Inline education UX:**

- Lead with business language: “What are you trying to accomplish?” not component/tool names.
- Group scenarios into 4-7 understandable categories based on the agent domain (for Zava: My Work,
  Project delivery, Portfolio decisions, Approvals). Show counts and searchable/filterable scenarios.
- Each scenario row/card includes outcome, example prompt, operation cue, and a clear action. Avoid a
  wall of 30 cards; use category navigation plus a compact selected-detail panel.
- Selecting a scenario shows the prompt and a lightweight preview/expected result. Do not nest full
  Copilot component frames or duplicate the global component header.
- “Try this prompt” MUST use a documented host prompt-submit API only when one exists and is verified in
  the target host. Otherwise provide an honest `Copy prompt` action and visible instruction to send it
  in chat. Never invent or call an unsupported host API.
- The inline explorer has the same top-right full-screen action and responsive/accessibility standards
  as other components.

**Isolated full-screen education gallery:**

- Full-screen opens a dedicated explorer route, separate from operational dashboard tabs, so users can
  learn without mutating the main project/portfolio state.
- Provide category navigation, search, audience/outcome filters, scenario detail, prompt copy/launch,
  and a deterministic live preview rendered from `previewProperties` through the owning shared React
  experience/router.
- Gallery preview mode is safe and read-only by default. Review/submit experiences stop before final
  confirmation, clearly display `Demo preview - no action applied`, and offer Reset preview.
- Support Previous/Next scenario for guided demos and a “Featured tour” that visits representative
  information, review, and submit experiences. Do not add fake animation or autoplay.
- Render previews inside an isolated boundary with stable keys so changing scenario resets only preview
  state, not the explorer shell. Lazy-load heavy preview code when possible.

**Required tests and evidence:**

- Default-contract rule: validation expects exactly six starters, five distinct operational targets,
  and `ExploreAgentCapabilities` as starter 6. An approved exception must be represented explicitly in
  catalog-owned configuration and validated against its replacement discovery contract.
- Catalog completeness and exclusion of the explorer itself.
- Category/search/filter counts; selected-detail and keyboard navigation; prompt copy success/failure;
  host launch feature detection and fallback; preview reset; Previous/Next and featured tour.
- Preview smoke for every advertised intent using its deterministic properties; no network calls,
  external writes, confirmation side effects, nested global headers, runtime errors, or overflow.
- Narrow/standard/full-screen, light/dark, reduced-motion, 200% zoom, screen-reader naming, and one
  screenshot per category plus representative preview states.

**Reusable extraction goal:** Keep catalog types, category/filter shell, scenario card/detail, prompt
actions, preview boundary, and tests under a shared `capabilityExplorer/` module with domain content
injected from the sample catalog. Future complex Copilot Apps should adopt the module by supplying
metadata, routes, and preview adapters rather than copying Zava-specific UI/data.

---

## 7. Display-mode mechanism (inline ↔ full-screen)

- Read `hostContext.displayMode` on every render. **Never** mirror it in state.
- **Inline → full-screen:** `await this.requestDisplayModeAsync('fullscreen')` (only value accepted).
  Surface one shared **View in full screen** button in the inline header's top-right corner.
- **Full-screen → inline:** host-only; you learn via `onHostContextChanged` re-render.
- Never request a mode not in `hostContext.availableDisplayModes`.
- Pass `onRequestFullscreen` down through props; do not optimistically mutate UI on request.
- Resolve the destination from immutable catalog metadata after the host reports full-screen mode.
  Shared destinations open the exact workspace/route; isolated destinations open their dedicated root.
- Display mode and route are separate concerns: the host owns mode, while the application owns internal
  workspace/route state after full screen is active.
- Do not use Expand as generic “open app” navigation. It is continuation of the current component,
  including its normalized invocation state and, where implemented, transient interaction state.

---

## 8. Theming (Fluent v9)

- **Single provider.** A `<Name>ThemeProvider` wraps the tree once; derive the Fluent theme from the
  `theme` prop (`'dark'` → `webDarkTheme`, else `webLightTheme`; default light when undefined).
- **One style ownership model.** Put sample-wide brand/custom properties on the shared root and static
  responsive compositions in shared CSS Modules. Use Fluent component APIs and Griffel for states or
  runtime composition that benefit from them. Generated per-component SCSS may remain as scaffold
  ownership, but shared routed experiences MUST NOT render its default purple header/welcome styling.
- **Use the control that matches the behavior.** Use icon or icon+text `Button` for commands, familiar
  Fluent icons for tools, `Checkbox`/switch for binary settings, segmented controls/tabs for modes,
  sliders/steppers/inputs for numeric values, and `Dropdown`/`Option` for styled transactional option
  sets. A compact `Select` is acceptable for a simple dense dashboard filter when its native popup and
  host styling are intentional and tested. Do not build rounded text pills that imitate a familiar icon.
- **Fields explain requirements.** Wrap editable controls in `Field` with visible label, required state,
  hint, and validation message. Keep textareas tall enough for the expected rationale, do not hide rules
  behind a disabled button, and give touch controls at least a 44 px target where space permits.
- **Stable layout beats incidental reflow.** Give boards, charts, queues, toolbars, icon buttons, and
  repeated rows explicit grid tracks, min/max constraints, or aspect ratios so hover, loading, long
  labels, counts, and validation cannot resize adjacent regions unexpectedly.

### 8.1 Host-document Griffel renderer

- **Always target the component document.** Resolve
  `const targetDocument = context.domElement.ownerDocument` in the component base and pass it into the
  shared provider. Workbench may host the component in an iframe; parent-document styles do not apply.
- **Iframe style insertion + flicker-free theme flips.** Create one Griffel DOM renderer for the target
  document, wrap with `RendererProvider`, and remount the Fluent provider **exactly once** after the
  first commit via a key that changes 0→1. Keep the key stable thereafter so theme flips preserve
  in-flight state:

  ```tsx
  import { createDOMRenderer, RendererProvider } from '@griffel/react';

  const renderer = React.useMemo(
    () => createDOMRenderer(props.targetDocument),
    [props.targetDocument]
  );
  const [gen, setGen] = React.useState(0);
  React.useEffect(() => setGen(1), []);
  const theme = props.theme === 'dark' ? webDarkTheme : webLightTheme;
  return (
    <RendererProvider renderer={renderer} targetDocument={props.targetDocument}>
      <FluentProvider key={gen} theme={theme} targetDocument={props.targetDocument} className={styles.provider}>
        {children}
      </FluentProvider>
    </RendererProvider>
  );
  ```

- **Tokens only.** No hex/rgb for text. On brand surfaces use `colorNeutralForegroundOnBrand`.
- **Test the actual boundary.** Render into a secondary `Document`, verify generated Griffel style
  buckets appear there, and verify the one-time remount does not loop or reset user state.
- **Verify token names in the live target document.** An undefined CSS custom property invalidates an
  entire gradient. Inspect computed styles for workspace accents in light/dark modes; never assume a
  Fluent token exists because a similarly named token exists.

### 8.2 Operational visual grammar and gradients

Define this vocabulary before building route bodies and keep it in one shared theme/style module:

- **Canvas:** neutral Background 1/2 surfaces with dark equivalents; use color to establish hierarchy,
  not to tint every section. Keep at most three accent colors visible in one operational viewport.
- **Primary accent pair:** one dark, trustworthy anchor plus one brighter highlight. Zava uses steel
  `#0B5A7A` and cyan `#00B7C3`; future samples replace the values, not the roles or contrast checks.
- **Contrast accent:** one warm color may call out deadlines, selected evidence, or a comparison, while
  success/warning/danger retain their semantic meanings. Never repurpose status colors as decoration.
- **Typography and density:** use the host/product type family; 19-22 px compact headings, 12-14 px
  operational body text, 9-11 px supporting metadata, and tabular numerals for money/counts/percentages.
  Queue and roster rows stay compact; dashboards gain whitespace between regions rather than padding
  every item into a large card.
- **Shape and elevation:** 4-8 px radii for bounded tools and repeated records, restrained elevation for
  overlays/selected evidence, one-pixel separators for dense lists. Do not nest cards or float every
  page section in a card.

Only three gradient roles are permitted:

| Role | Use | Treatment |
| --- | --- | --- |
| Surface depth | Separate one hero/tool stage from the neutral canvas | Very low-contrast two-stop light/dark pair; content remains readable without it. |
| Focus halo | Place visual emphasis behind a product, selected mark, or signature scene | Local radial gradient that fades to transparent; never a decorative orb. |
| Analytical ramp | Encode ordered health, risk, progress, or bridge direction | Named data stops with a visible legend and exact values; never the only status signal. |

Do not use full-page gradients, gradient text, arbitrary multi-hue backgrounds, or the generator's
purple/blue AI banner. One gradient-dominant surface per view is normally enough. Centralize each
gradient, provide an explicit dark counterpart and high-contrast solid fallback, and test computed
background images so an invalid custom property cannot silently remove the treatment.

---

## 9. Data (source-shaped mock to canonical view models)

### 9.1 Modules & shapes

- `mockData/*.ts` - one typed array per logical source. Use Graph shapes for users, groups, calendars,
  and other Graph-backed entities; use Planner/Project shapes where those APIs own the data; use
  explicit canonical contracts for portfolio, finance, AI usage, governance, and approval records.
  Bundled TypeScript is imported directly with no runtime fetch. Add a `mockData/index.ts` barrel.
- `models/sources/` contains source-specific raw types. `models/seeds.ts` contains relative-time seeds.
  `models/<name>.ts` contains lean canonical view models consumed by the UI.
- `services/mappers.ts` contains pure source-to-view-model projections reused by later live services.
- `services/I<Name>DataService.ts` + `Mock<Name>DataService.ts` - the interface + mock impl that
  imports the mock arrays, calls `resolveMockData(now)`, runs the mapper, returns a single view-model
  aggregate.

### 9.2 Personas & the real signed-in user

- Use the **standard Microsoft 365 demo personas** (Megan Bowen, Diego Siciliani, Lee Gu, ...) for all
  senders/authors/organizers, represented as Zava employees with consistent `@zava.example.com` demo
  email addresses via a shared `mockData/people.ts`.
- Resolve the signed-in user's name synchronously from page context. If host context already provides
  a usable `https:`, `data:`, or `blob:` photo URL, render it without issuing another request. Do not
  construct `userphoto.aspx` or call Graph for a photo. If no usable host photo exists, use the bundled
  current-user persona image, then Fluent Avatar initials as the final fallback.

### 9.3 Time resolution - always "today", forward-biased

- Author entities with **relative offsets from `now`** (e.g. `startOffsetMin`, `dueOffsetMin`,
  `receivedOffsetMin`), never absolute dates.
- `services/resolveMockData(now = new Date())` computes source-appropriate absolute dates while keeping
  stable IDs and relationships intact.
- Bias: meetings ahead of now; some past to prove "next" filtering; mail/news in the recent past so
  "1h ago" reads naturally. Resolve seeds against a clock memoized for the current fresh properties
  version. Passive rerenders reuse it; a fresh invocation may capture a new clock.
- **Never** hard-code a clock time in copy (e.g. "before the 2:30 sync") - it drifts.

### 9.4 Narrative coherence (storytelling)

- Make the best-of-both-worlds pattern the primary story for every sample and scenario:
  1. The user expresses a need naturally rather than navigating an application hierarchy.
  2. AI interprets the language and selects a bounded tool, record, filter, or editable draft.
  3. A purpose-built inline component presents exact information or deterministic controls directly
     in the flow of work in the Copilot canvas.
  4. The user reviews consequences and explicitly owns every decision or action.
  5. When broader context is useful, full screen preserves the origin and expands into a full-scale
     application experience inside Copilot.
- Describe AI interpretation honestly as probabilistic or non-deterministic. Describe business data,
  calculations, validation, workflow states, and confirmed operations as deterministic. Do not blur
  these responsibilities with claims that AI approved, submitted, deleted, or otherwise committed an
  action on the user's behalf.
- Demonstrate adaptive UX through meaningful differences in composition: an information request opens
  focused evidence, a review request opens records and consequences, and a submit request opens an
  editable guarded workflow. Do not call cosmetic copy changes or a generic generated card adaptive.
- Make the absence of navigation part of the value proposition: no link chase, portal transition, or
  app switch is required for the primary task. Do not add an external destination merely to make the
  sample resemble a conventional chatbot response.
- Curate meetings + tasks + mail + news into **one connected story** so any AI/summary feature reads as
  insightful, not random (My Day themes the day around shipping the app: design-review meeting ↔
  related task ↔ flagged mail ↔ news post).

### 9.5 Mock-data and media automation

- Build mock records as a connected domain, not independent component fixtures. A blocker should affect
  its task, milestone, approval, capacity, risk, and forecast records consistently.
- Give grouped/list experiences enough variance to prove their controls. Include multiple people,
  projects, statuses, due bands, values, and edge cases; avoid one record per group or labels that merely
  restate the grouping choice.
- Add referential-integrity tests: every person/project/objective/work item/milestone/risk/allocation/
  usage/request/approval/route/media key resolves; relationships and IDs are stable and deterministic.
- Store source portraits under `assets/faces/` and generate one typed media catalog. Prefer package-
  hosted asset URLs for substantial media; a generated base64 catalog is acceptable only when the
  production build emits it once in a measured shared bundle. Add a `--check` mode that fails if source
  count, generated count, keys, or output drift. Never edit generated media catalogs manually.
- Use a session-local action overlay for confirmed mock actions. Seed data remains immutable; Reset
  removes overlays and restores the deterministic baseline.
- Current dates derive from one supplied clock per fresh invocation. Do not hard-code stale “today”
  values in copy or let passive host rerenders advance the clock.

---

## 10. Imagery and host-provided media

- **One source, one catalog, one emitted payload.** Keep authored images in shared `assets/` folders and
  expose typed keys from one shared media catalog. Components reference keys/URLs; they never own copied
  binaries or per-component image registries.
- **Prefer package-hosted static files for substantial shared media.** Emit each optimized photo or
  thumbnail once with `ClientSideAssets` and resolve its package URL through the shared catalog. Hashed
  package assets remain offline/tenant-hosted and can use normal browser caching across component loads.
- **Base64 is measured fallback, not a blanket prohibition.** Tiny assets may be inlined. A shared
  persona catalog may also be base64 when one production bundle emits it exactly once and measurement
  shows the resulting package is acceptable. Never repeat encoded photo catalogs across independent
  bundles; base64 adds about 33% before compression and prevents independent browser caching.
- **Host media exception.** A usable `https:`, `data:`, or `blob:` photo URL already supplied by host
  context may render without an app-initiated request. Always retain a package-hosted persona or Fluent
  Avatar initials fallback. Never construct profile-photo endpoints or fetch runtime CDN/stock media.
- **Authoring workflow.** Download royalty-free media once, optimize dimensions/quality for its rendered
  size, record source/license beside it, and generate/check the catalog deterministically. Missing images
  use initials or a gradient/icon fallback; keys remain valid identifiers.
- **Complete the visible cast before polish.** Derive required persona/product keys from queues,
  dashboards, details, and mock records; validate that every visible key resolves. A known portrait is
  not optional merely because initials exist. Initials are a resilient loading/missing-data fallback,
  not the planned final state for one or two conspicuous rows among photographed peers.
- **Use faces where accountability matters.** Show portraits beside requester, approver, owner,
  assignee, incident commander, and handoff. Keep decorative face piles out of dense charts and KPI
  strips. Use 32-36 px portraits in compact rows and a larger 48 px identity in detail when space allows.
- **Cache data, not invocation state.** Immutable seed records, parsed media catalogs, and expensive pure
  lookup/calculation results may live in module-level caches shared by the bundle. Key scenario/date-
  dependent results explicitly. Do not cache mutable drafts, selected evidence, host context, current
  user, or properties-version state across component instances.
- The release audit (§18.4) verifies one emitted copy/hash per substantial image and zero repeated full
  base64 catalogs across JavaScript entries.

### 10.1 Agent app icon contract

Design the app/agent identity during scope and branding, not after packaging. The icon should explain
the product at a glance through one clear silhouette: a brand initial/mark plus at most one restrained
domain cue such as health, workflow, portfolio, support, or people. It must feel credible in Microsoft
365 navigation, not like a decorative illustration.

**Required files:**

- `copilot/color.png`: exactly 192 x 192 PNG. Use a flat opaque brand field coordinated with manifest
  `accentColor`, a high-contrast central mark, generous safe margins, and no photographic detail.
- `copilot/outline.png`: exactly 32 x 32 PNG. Use the same recognizable silhouette in monochrome white
  on transparency. No opaque tile, colored pixels, text label, or detail that disappears at 16-32 px.
- Keep manifest references exactly `color.png` and `outline.png` unless the target schema requires
  different names. Both files live beside the agent manifest and are included in the generated agent ZIP.

**Design rules:**

- Prefer a custom geometric mark over a font-rendered letter so generation does not depend on an
  installed typeface. A single brand initial is valid when paired with one subtle domain signal.
- Keep the mark flat and restrained: no gradients, photos, shadows, tiny strokes, generic robot/chat
  bubbles, or AI sparkles unless the approved product identity specifically requires one.
- Use two or three colors at most in the color icon. Semantic warning/danger colors are not decorative
  brand accents. The outline icon is white only, with alpha used solely for edge smoothing.
- Inspect the color icon at 192, 32, and 16 px. Inspect the outline icon at 32 and 16 px on light,
  dark, and manifest-accent backgrounds. The same silhouette must remain identifiable without a label.

**Automation and evidence:**

- Keep a deterministic generator such as `scripts/generate-agent-icons.ps1` or an equivalent
  cross-platform bitmap script. It owns both files and provides generation plus non-writing `--check`
  or `-Check` behavior that fails when committed PNGs differ from regeneration.
- The generator validates exact dimensions, PNG output, visible-pixel coverage, transparent outline
  corners, and monochrome-white visible outline pixels. Asset validation checks manifest mappings,
  dimensions, manifest `accentColor`, provenance hashes, and source-file existence.
- Record both icons in asset provenance as original/generated work, including the design rationale,
  generator path, intended use, and SHA-256. Do not describe a generated mark as an official Microsoft
  product logo.
- After packaging, inspect the generated agent ZIP and final `.sppkg` to prove both icon entries match
  the current source bytes. Save a visual preview when reviewing a 32 px transparent icon is otherwise
  difficult against the editor canvas.

---

## 11. Signature decision experiences

- Build the signature experiences named in `todo.md` deterministically from coherent mock data. For
  this sample they include the Estate Health Landscape, Incident Correlation Constellation, Surface
  recommendation and configuration journey, budget-aware manager approval, and Refresh Wave Horizon.
- Prefer immediate, explainable decision value over generic AI theater. Use a thinking/shimmer/streaming state
  only when the user explicitly initiates a generation step and the delay helps explain that action.
  Do not add fake waiting to charts, filters, comparisons, forms, or approvals.
- Every signature experience connects one decisive visual, the relevant people, the surprising change
  or constraint, supporting evidence, and an obvious next action within ten seconds.
- **Reduced-motion:** detect `matchMedia('(prefers-reduced-motion: reduce)')` and reveal everything at
  once, no streaming/animation.
- A later live implementation replaces only services/calculators and returns the same view-model shape.

### 11.1 Chart model and selection matrix

Start with a minimal renderer-neutral contract and extend it only when a real chart needs more geometry:

```ts
type ChartKind = 'ring' | 'columns' | 'line' | 'pareto' | 'waterfall' |
  'journey' | 'horizon' | 'network' | 'landscape';

interface IChartMark {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly secondaryValue?: number;
  readonly color: string;
  readonly group?: string;
  readonly parentId?: string;
}

interface IChartModel {
  readonly kind: ChartKind;
  readonly title: string;
  readonly ariaLabel: string;
  readonly valueFormat: 'count' | 'currency' | 'percent';
  readonly marks: readonly IChartMark[];
}
```

| Decision question | Preferred model | Default rendering profile |
| --- | --- | --- |
| How healthy/complete is one thing across a few dimensions? | Ring/gauge | Compact React SVG plus DOM legend; Babylon only if the ring anchors an immersive scene. |
| Which categories are largest or outside target? | Columns/bars | DOM bars for dashboard summaries; React SVG for axes, selection, or projection. |
| How is a measure changing over time? | Line/ribbon | React SVG with direct labels, exact values, and prior-period delta. |
| Which causes explain most of the total? | Pareto | Sorted React SVG bars plus cumulative line and visible 80% threshold. |
| How did a starting value become an ending value? | Waterfall/bridge | React SVG with connectors and running totals. |
| Where is a request in a known process? | Journey | Fluent DOM for ordinary status; SVG only when scale/branching adds value. |
| Is planned work within time/capacity? | Horizon/capacity | React SVG inline; Babylon for a genuinely spatial multi-quarter planning scene. |
| Which signals belong together? | Network | Deterministic fixed-tick layout; SVG for small networks, Babylon for dense spatial focus. |
| Where is risk concentrated across geography or two dimensions? | Landscape/map | Babylon for the signature spatial scene; DOM/SVG summary and exact-value table remain adjacent. |

One canonical selected ID coordinates marks, legend/data rail, optional interpretation, KPI context, evidence, and table
selection. Filters rebuild or filter the model immutably and reset selection only when the selected mark
no longer exists. Every model builder is pure and tested for stable IDs, meaningful mark variance,
correct totals/domains, formatting, empty data, and deterministic output.

---

## 12. Configuration impact - session-persisted settings (optional)

Keep five state classes separate: host state comes from props; normalized invocation state comes from
the current prompt signature; transient selection/filter/draft state stays with the component instance;
user-visible settings may persist for the session; confirmed actions/receipts use the session overlay.
Never persist host context or unconfirmed drafts merely because both use React state.

- A settings drawer whose values persist to **`sessionStorage`** (intentionally session-scoped for the
  demo; call out "stored in this session only, not saved permanently").
- Provide a `utils/settings.ts` with a typed settings interface, `load`/`save` (guarded for sandboxed
  hosts), and a `use<Name>Settings()` hook that reads once and writes on change.
- Make settings **actually reshape the UX**: e.g. a live unit toggle updates a card immediately; a
  **visible-panels** set drives a **dynamic, re-flowing layout** (drop empty columns; keep at least one
  panel visible).

### 12.1 Session-local actions, scenarios, and receipts

- Forms and decisions use Draft -> Validate -> Review -> Confirm -> Receipt. Prompt values prefill a
  draft but never submit, approve, reject, assign, or mutate automatically.
- Validation belongs to visible intent-specific fields, not unrelated hidden defaults. Announce why a
  review/confirm action is disabled with `role="alert"` or described helper text. Do not hide minimum
  rationale/length requirements behind a disabled button.
- All editable controls are controlled by the same draft object consumed by review and receipt.
  Changing project, category, model, environment, date, sponsor, objective, classification, or status
  must visibly change the matching review. Derived values are labeled as calculations.
- Edit returns from review without losing the draft. Create another/Reset restores the initial
  prompt-backed draft, not the just-submitted values.
- Decision status uses consistent semantics through draft, receipt, and queue: pending amber, approved
  green, returned/rejected red. Return/Reject require a visible rationale rule and cannot silently fail.
- Persist confirmed mock actions in a typed session-local store guarded for sandboxed hosts. Apply
  immutable overlays to the seeded baseline so actions and receipts can appear across related inline
  and full-screen routes during the same session.
- Keep in-memory state authoritative and use `sessionStorage` as best-effort persistence; sandbox denial
  MUST NOT break the workflow. Expose immutable reads, append-only record commands, subscriptions for
  cross-route synchronization, and Reset. Test storage reload, denied-storage fallback, subscriptions,
  remount restoration, and UI reset.
- Persist only confirmed actions. Prompt defaults, in-progress drafts, selected evidence, host context,
  and transient workflow stage remain component-instance state unless a product requirement explicitly
  defines resumable drafts and their privacy/lifecycle contract.
- Receipts include stable sample ID, timestamp, actor, result, and next-step text. Provide an explicit
  Reset demo data command that clears the session overlay and restores the deterministic baseline.
- Reuse validated submit/request workflows from dashboard launchers instead of cloning their forms.
  Bound overlays and panels to the Copilot host container, not the browser viewport. Standalone inline
  mode keeps its normal receipt; embedded mode may report confirmed completion to the parent so the
  panel closes and the dashboard can show a session-only success notice.
- What-if scenarios stay separate from confirmed mock actions, pin the approved baseline, and display
  `Scenario - not applied` until the user deliberately moves into a review flow.

**Mandatory lifecycle tests per submit/request intent:** prompt prefill, invalid visible field,
announced validation, Edit preservation, matched review values, explicit confirmation, receipt content,
and prompt-backed reset. **Mandatory lifecycle tests per review intent:** queue count/filter, selection,
evidence, safeguards, rationale, confirmation, semantic receipt, updated queue, and preserved queue state.

---

## 13. Motion & first impression

- Shared `utils/motion.ts` exports keyframes, named duration/easing tokens, reduced-motion detection,
  and one transition coordinator that cancels superseded DOM and Babylon work. Components do not
  invent arbitrary durations or leave stale timers, observables, animation groups, or frames alive.
- Use three motion tiers: micro feedback around 120-180 ms, view/evidence transitions around 220-320 ms,
  and guided Babylon camera focus around 500-700 ms. Use the shortest tier that explains the change.
- **Lens and route transitions:** keep the product bar and vertical tab rail stationary. De-emphasize the
  outgoing canvas, update route/focus state, then reveal the incoming heading and primary visual with a
  subtle 8-12 px directional offset. Keep shell dimensions stable so transition wrappers never cause
  layout shift. Move keyboard focus to the destination heading immediately after route selection.
- **Babylon chart transitions:** use stable record/mark keys and explicit enter/update/exit targets.
  Babylon animation groups interpolate mesh geometry/transforms, material emphasis, DOM label/legend
  state, and cross-highlighting from the settled prior model. Rapid filter changes begin from current
  rendered values and settle only at the latest target, with no flash of stale data.
- **Babylon transitions:** use `Animation`/`AnimationGroup` with named easing mapped to the shared motion
  tokens for mesh transforms, material emphasis, and camera position/target. Run only one guided camera
  focus at a time, preserve orientation cues, constrain camera bounds, and expose Reset view. A new
  selection stops the previous group and starts from current values; completion stops the render loop.
- **Staggered entrance** is reserved for the first useful reveal and bounded groups of 3-6 records. Since
  authored animation timing is static presentation, implement stagger with **static delay classes** in `makeStyles`
  (`delay0..delayN`) + `mergeClasses`, not inline `animationDelay`.
- Skeleton-to-content, evidence swaps, receipts, and error recovery cross-fade in place without moving
  adjacent controls. Workflow forward/back movement is directional; decision results use semantic
  icon/text changes rather than celebratory effects.
- Never use uncontrolled spins, long fly-throughs, parallax backgrounds, particles, bloom, pulsing loops,
  or perpetual auto-rotation as substitutes for information. Do not animate every dashboard region at
  once; prioritize the selected story and leave surrounding context stable.
- **Every animation** includes a `@media (prefers-reduced-motion: reduce)` guard. The shared signal also
  bypasses Babylon mark animation/camera travel, rendering final state immediately.
  Motion never gates exact values, state, focus, validation, or the next action.
- Test repeated navigation/filtering, interruption, teardown, hidden-tab pause, focus continuity,
  screenshot suppression, and zero active render loops after idle. A single uninterrupted recording is
  not sufficient motion evidence.

---

## 14. Layout & responsiveness

- **Fluid width:** root fills `100%` of the host iframe; `boxSizing: 'border-box'`, `minWidth: 0`; no
  fixed pixel width. Treat ~320px as the narrow end.
- **Route-specific composition:** choose stable grid tracks, aspect ratios, and min/max constraints for
  each decision surface. Do not force every route into the same auto-fit card grid.
- **Dashboard-specific composition:** every primary workspace gets an intentional default dashboard
  with several coordinated information regions. Do not require users to cycle a route dropdown to see
  basic scope health, money, work, exceptions, and actions that belong together.
- **Adaptive navigation:** horizontal tabs and vertical rails are both valid. Choose based on workspace
  count, label length, workflow, and chart-width needs. Preserve one workspace model across responsive
  orientation changes and provide correct `tablist`/`tab` semantics or equivalent navigation landmarks.
- **Large / projector displays:** step the content `maxWidth` up via `@media (min-width: …)` (e.g.
  1280 → 1440 → 1680px) so big screens use the canvas.
- **Full-screen use of space:** dashboards should gain columns, analytical width, comparison context,
  or adjacent decision panels as space increases. Cap compact inline previews at realistic inline width;
  do not cap the full operational dashboard to that same width.
- **Isolated experiences:** isolated full-screen roots still follow mobile/desktop/keynote constraints,
  but they do not inherit shared operational navigation or mutate its saved route/filter state.
- Use cards only for repeated entities, approvals, modals, or genuinely bounded tools. Do not nest
  cards or turn full-width sections and every chart into floating cards. Maps, Sankey flows, radial
  views, comparison canvases, and timelines may use unframed analytical space.
- **Action detail gets priority.** A compact queue may share a dashboard row with roster/summary content,
  but opening record detail gives the action panel the full useful row and hides or reflows the neighbor.
  Do not compress evidence, rationale, and confirmation into the queue's summary column.
- **Long labels are a required responsive state.** Test the longest status/filter label with a nonzero
  count. Use equal segmented tracks and stack the filter group below its heading before truncating or
  reducing text to unreadable sizes.

---

## 15. Accessibility & visual finish

- **Dark-mode contrast:** token-based throughout; no hard-coded text colors; audit badges, rings,
  banners, and any brand surfaces.
- **Real links:** external links use `target="_blank"` **and** `rel="noopener noreferrer"`.
- **Empty / light-day states** must be positive and intentional ("You're all caught up on important
  mail.", "No meetings today - enjoy the open calendar.").
- **Iconography:** make it meaningful and domain-specific; status, risk, approval, budget, and capacity
  icons reinforce visible labels rather than decorating the surface.
- Provide `aria-label`s on icon-only controls; decorative visuals use `aria-hidden`.
- Every Babylon visual has a visible title/question, selected-value detail, and keyboard-reachable Fluent
  table/list equivalent. Add interpretation only when it contributes beyond the visible values. Tooltips
  supplement labels and never contain the only exact value. Color, area, link width, angle,
  geography, proximity, or animation is never the sole carrier of meaning.

---

## 16. Visualization libraries and deferred live integration

- **Headless D3 calculation modules** - allow only `d3-array`, `d3-scale`, `d3-shape`, `d3-geo`,
  `d3-hierarchy`, `d3-force`, and approved `d3-sankey` imports that replace substantial algorithms.
  Allow `topojson-client` only with approved local geographic boundaries. Reject D3 selection,
  axis, transition, timer, interpolate/ease, brush, drag, zoom, fetch, formatting, and full-bundle imports.
  Pure calculation functions return typed immutable models and never receive DOM/Babylon references.
- Prefer reusable React SVG components for compact trend/ribbon, capacity, waterfall, radial, Pareto,
  and journey forms. Prefer typed Babylon scene adapters for spatial landscape, dense network, geographic,
  flow, or dimensional forms that earn camera/depth behavior. Headless calculations prepare scales,
  layout, paths, and projections; React owns data, SVG rendering, selection, accessible names, and
  lifecycle; Babylon owns only the marks inside an approved scene.
- **Babylon.js** - use direct imports from `@babylonjs/core` and include only classes/features proven by
  the spike. Prefer a bounded `ArcRotateCamera`, simple hemispheric/directional lighting, thin instances
  for large stable sets, and regular instances for frequently changing marks. Keep labels/controls in
  Fluent DOM. Do not ship the legacy barrel, inspector, physics, loaders, post-process pipelines,
  particles, Babylon GUI, WebXR, or WebGPU code unless an approved measured requirement uses it.
- Profile each production scene with Babylon instrumentation at inline, desktop, and keynote sizes.
  Record draw calls, active meshes/instances, average frame/render time during transition and idle,
  engine/canvas count, and teardown result. Production idle must have no active render loop.
- Do not hand-position data marks with CSS. Use tested analytical model builders and approved headless
  scale/arc/hierarchy/force/flow algorithms so Babylon geometry is derived from data.
- Metric/grouping controls supply materially different arrays, hierarchy shares, paths, group headings,
  and narratives. Add tests that compare geometry/data identities before and after selection.
- Separate comparison series enough to read them. Preserve established values/endpoints, but avoid
  overlapping actual/forecast paths that visually collapse into one line.
- Every SVG uses `role="img"`, a metric-specific `aria-label`, `<title>`, `<desc>`, visible exact values
  where practical, and neighboring evidence or interpretation only when useful. Interactive marks
  support keyboard activation.
- **No parallel visualization engine** - React-rendered SVG and Fluent DOM are first-party rendering
  profiles, not extra chart engines. Vega/Vega-Lite and other chart/3D engines are outside the current
  target. Add one only through an approved exception with a smaller measured bundle/maintenance cost
  than the existing React SVG/Babylon plus headless-analysis implementation; never fetch runtime
  specifications or map tiles.

- **PnP React controls** (`@pnp/spfx-controls-react`) - use when they add value; **deep imports only**
  (`.../lib/ListView`). Pass the component context down. Do **not** use `@pnp/spfx-property-controls`.
- **PnPjs v4** (`@pnp/sp`, `@pnp/graph`) for live data. Singleton `getSP`/`getGraph` initialized **once**
  from the Copilot component context; **selective imports**; always `.select(...)`.
- Keep the mapper and view models unchanged when swapping Mock → live service via a `useMock` flag /
  service factory.

---

## 17. Build, lint & packaging

### 17.1 Commands

- Dev: `heft start --clean` (open `localhost:4321`).
- Validate: `heft test --clean` (build + lint + jest).
- Release/final gate: `npm run build`.
- The future-sample `build` script MUST run this order as one command:

  ```bash
  npm run validate:intents && npm run check:agent-icons && npm run validate:assets && npm run check:routing-matrix && npm run check:gallery && heft test --clean --production && heft package-solution --production && npm run check:generated-plugin && npm run check:package-output
  ```

  Keep both generated-output checks after `package-solution`: `check:generated-plugin` validates
  generated `ai-plugin.json` inside the SharePoint-embedded agent ZIP, then `check:package-output`
  audits the final `.sppkg`. Do not ask operators to remember separate release commands that can package
  an invalid catalog or skip generated output validation.
- Run `npm run capture:visual` before this command whenever source, styles, media, viewport behavior, or
  browser rendering changed. The build validates committed evidence; it does not rewrite screenshots.
- Node.js **>=22.14.0 <23.0.0**.
- **Never run a clean build while `heft start` is watching the same tree.** `heft test --clean` removes
  generated bundle entries, Sass typings, and static-asset typings that the watcher still expects,
  producing noisy missing-module errors unrelated to source. Stop the dev server, run the clean test or
  package gate to completion, then restart the watcher if more visual work is needed. Verify port 4321
  is closed when the review session ends.

### 17.2 Lint / Griffel gotchas (learned - avoid these)

- **No static inline `style={{…}}`.** Use CSS Modules or `makeStyles` classes for authored layout and
  presentation. Restrict inline/SVG attributes to genuinely data-driven geometry such as computed bar
  width/height, mark color, transforms, or positions; keep those values typed and bounded.
- **No `background` shorthand** in `makeStyles` (Griffel) → use `backgroundImage` (+ `backgroundColor`).
- Do not mix a border shorthand in a base Griffel style with `borderColor` in a nested state such as
  `:disabled`; override the complete `border` declaration in that state. Disabled controls must pair
  native `disabled` semantics with visibly muted token-based foreground, background, border, and cursor.
- **Dot-notation** preferred → object keys used with dot access must be valid identifiers (avoid
  hyphenated keys you then index with `['…']`).
- Animations use `animationName` with **inline keyframe objects**; reference shared keyframes from
  `utils/motion.ts`.
- Keep component functions formatted across readable lines. Long single-line JSX makes structural
  patches ambiguous and increases the chance of inserting fragments into neighboring functions.
- For generated/minified legacy lines, use exact one-occurrence replacements only after verifying the
  match count is exactly one. Never run an unbounded repository-wide replacement.
- After the first structural edit, compile immediately before another edit. If a patch corrupts a
  boundary, recover the smallest owning function from the last compiled state/session evidence; do not
  continue stacking edits on malformed JSX.
- CSS Module class names are generated types. Add/rename the SCSS selector and its TSX reference in the
  same slice, then run the focused compile so a transient missing `IStyles` property is not mistaken for
  an application defect.
- Manual code edits use the repository patch tool. Formatting/bulk generation may use approved scripts;
  scripts must be deterministic and rerunnable.

### 17.3 Quality gate

- A phase is not done until focused behavior tests and `heft test --clean` are **green with zero
  warnings**. Build success without behavior/evidence coverage is not completion.
- Report filtered test runs precisely: distinguish selected tests passed, total tests discovered, and a
  complete all-tests gate. Never turn a filtered run's discovered total into an “all tests passed” claim;
  refresh package/evidence totals only after the corresponding complete command runs.
- Maintain one tenant-free UX harness capable of selecting every intent, host width, and theme.
- Minimum inline matrix for a multi-intent sample:
  - every catalog intent at narrow (~340px) and standard (~760px) widths;
  - light and dark themes;
  - runtime/page errors, horizontal overflow, broken images, unlabeled controls, unlabeled/blank charts;
  - keyboard focus/activation for component controls;
  - reduced motion and real browser 200% page-scale emulation;
  - useful default, changed/filter state, selected detail, no-match, and error fallback as applicable.
- Minimum full-screen matrix for a multi-workspace sample:
  - every default workspace dashboard at mobile (~340px), standard/tablet (~760px), desktop (~980px+),
    and keynote/projector width when available;
  - every navigation orientation actually used, including keyboard movement, selection semantics, and
    focus on destination content;
  - one exact inline-to-full-screen continuation per workspace and every isolated destination;
  - selectors materially update coordinated dashboard regions; decision queues open the matching review;
  - runtime/page errors, horizontal overflow, blank charts, unreadable labels, and stranded inline-width
    content checks in light and dark themes.
- Save one screenshot per intent and a JSON evidence summary with timestamp, counts, failures, test total,
  warning count, source/build fingerprint, package artifacts, and external prerequisites. The capture
  MUST include all inline defaults, every default full-screen workspace/isolated root, mobile and dark
  representatives, and detail/confirmation/receipt variants for consequential work. Record broken
  images, horizontal overflow, deprecated shared chrome, console/page errors, canvas count, engine
  count, and required nonblank-pixel checks. Evidence belongs under a predictable `assets/` or
  `ux-review/evidence/` path and is refreshed after material visual changes.
- Use two gates: `capture:visual` deliberately writes PNG/evidence files using pinned Playwright;
  `check:gallery`/`check:visual` performs no capture and fails when metadata, dimensions, fingerprints,
  expected counts, or files are stale. This keeps the canonical build deterministic and browser-optional.
- Local harness evidence cannot prove tenant CSP, `requestDisplayModeAsync`, iframe focus restoration,
  or host screen-reader output. Record unresolved `{tenantDomain}`/authentication as a single explicit
  external gate; do not leave broad implementation tasks ambiguously open.
- Required test families:
  - catalog/layout uniqueness and registration/schema/media audits;
  - intent resolver normalization, compact params, deterministic signatures, and fresh-versus-passive
    properties-version behavior;
  - information defaults plus retained-control effects, detail, no-match, error boundary;
  - review queue/evidence/safeguard/rationale/confirm/receipt/updated-queue semantics;
  - form prompt prefill/validation/Edit/review/confirm/receipt/reset;
  - owner-document style insertion and current-user/media fallbacks;
  - calculations and mock referential integrity.

### 17.4 Ship the package

- Commit the built **`sharepoint/solution/<name>.sppkg`**. Un-ignore **only** the package in
  `.gitignore` (re-include the folder, ignore its contents, un-ignore the `.sppkg`); keep `debug/` and
  other build junk ignored. Repackage after substantive changes.
- Keep exactly the current Teams/Copilot agent ZIP; delete stale pre-rename/generated ZIPs before
  packaging. Inspect ZIP entries to confirm manifest, color icon, outline icon, and plugin/agent files;
  compare icon hashes with `copilot/color.png` and `copilot/outline.png`.
- After packaging, report audit counts, tests/failures, warning count, artifact names/sizes/timestamps,
  diagnostics, `git diff --check`, and whether temporary review/dev servers were stopped.

---

## 18. Optimized delivery and bundle efficiency

Bundle size is a release requirement, not a cleanup task. Optimize the deployable production package,
while using development bundles and source maps only to diagnose which modules cause growth.

### 18.1 Share one runtime across related Copilot Components

- When a solution has multiple Copilot Components that use the same React, Fluent UI, services, or
  experience graph, place their entries in **one shared bundle** in `config/config.json`. Each component
  keeps its own manifest, GUID, tool, and entrypoint inside that bundle. Validate component-entry count
  and exact manifest coverage rather than expecting one bundle per component.
- Separate bundles remain valid when they produce a measured lazy-loading, update, or isolation benefit.
  Record the reason and compare total compressed package size plus the largest initial-load bundle; do
  not assume more bundles are smaller or that one bundle is universally best.
- Keep shared UI, data services, schemas, immutable seeds, and media catalogs behind common modules.
  Avoid importing an unrelated feature graph into an otherwise isolated bundle.
- Use supported named imports from tree-shakable packages. `@fluentui/react-icons` declares
  `sideEffects: false`; import only named icons from its supported package export and verify production
  output contains only those icons. Do not use unsupported internal deep paths. If every component uses
  one shared application graph, bundle consolidation prevents the same tree-shaken icon subset from
  being emitted once per component.

The catalog/configuration script SHOULD generate this shape for a shared graph; do not hand-maintain a
bundle object per component:

```json
{
  "bundles": {
    "<sample>-copilot-components": {
      "components": [
        { "entrypoint": "./lib/copilotComponents/<name>/<Name>CopilotComponent.js", "manifest": "./src/copilotComponents/<name>/<Name>CopilotComponent.manifest.json" }
      ]
    }
  }
}
```

The validator compares catalog count, bundle-entry count, unique manifest count, and exact source-
manifest coverage. It validates component entries, not `Object.keys(config.bundles).length === count`.

### 18.2 Keep media out of repeated JavaScript

- Emit photos and other substantial media as package-hosted files and reference them by URL. A shared
  URL string is cheap; repeating encoded binary content in every JavaScript entry is not.
- Import only the media keys needed by an experience. Do not return a global `media` object containing
  every asset from every mock data service response.
- Optimize source images before packaging and choose dimensions appropriate to their rendered size.
  Preserve a source/license record and a graceful visual fallback.
- If a measured shared bundle keeps an existing base64 catalog, verify it occurs in exactly one
  JavaScript artifact and include its compressed contribution in the release report. Migrate it to
  package-hosted files when image growth, independent caching, or lazy loading justifies the change.

### 18.3 Clean production packaging is mandatory

- The release command MUST run source audits, clean before compiling, package, then inspect generated
  output. Use the canonical §17.1 `npm run build`; its core compile/package sequence remains:

  ```bash
  heft test --clean --production && heft package-solution --production
  ```

- Keep one npm script for the complete §17.1 sequence so local and automated builds cannot drift. Running
  only `heft package-solution --production` can package stale unminified files already present under
  `sharepoint/solution/debug/ClientSideAssets`.
- After packaging, staging MUST contain only the current hashed production component JavaScript and
  its required license/static files. A plain `*-copilot-component.js` beside a hashed
  `*-copilot-component_<hash>.js` is a release failure.
- Reject `*.hot-update.js`, `*.hot-update.json`, source maps, plain development entry bundles, stale
  pre-rename agent ZIPs, and any generated agent ZIP whose SHA-256 does not match the copy embedded in
  the final `.sppkg`. Clean packaging must remove watcher residue before archive creation.
- Do not judge production delivery size from `dist` after a development build. Inspect the `.sppkg`
  archive and its `ClientSideAssets` entries.

### 18.4 Release size gates

For every final build, record the `.sppkg` size, total compressed client-side JavaScript, largest
JavaScript entry, and duplicate media count in `todo.md` or the build log.

- **No stale outputs:** zero unhashed development component bundles in the package.
- **No duplicate media:** each substantial image binary/hash is packaged once; zero complete base64
  image catalogs repeated across component bundles.
- **Investigate regressions:** explain any package increase over 10% from the previous accepted build.
- **Default investigation thresholds:** inspect any production JavaScript entry over 1 MiB raw or any
  sample `.sppkg` over 10 MiB. A justified feature may exceed these values, but not silently.
- Compare both raw and compressed sizes. Use source maps or a bundle analyzer to attribute growth to
  application source, media, Fluent icons, and other dependencies before changing architecture.
- Record bundle strategy (shared or intentionally split), component-entry count, production JavaScript
  file count, and the reason for any exception. Smoke every component after consolidation because one
  shared bundle must still expose each manifest/entry independently.

### 18.5 Required automated package audit

`scripts/validate-package-output.mjs` MUST inspect `paths.zippedPackage` from
`config/package-solution.json` after packaging and fail on:

- zero production JavaScript files or any unhashed/stale JavaScript under `ClientSideAssets/`;
- hot-update artifacts, plain development entries, source maps, stale agent ZIPs, or a packaged agent
  ZIP whose hash differs from the freshly generated ZIP;
- duplicate substantial media hashes in package-hosted files;
- the same inline base64 image payload appearing across multiple JavaScript bundles;
- Fluent icon-font payloads when the sample uses named SVG icon imports.

It MUST report package bytes, production JavaScript file count/total bytes/largest entry, packaged media
count, primary entry count, intentional lazy chunk count, inline image count, duplicate counts,
stale-output count, icon-font presence, agent/package SHA-256 values, and configurable thresholds.
Derive expected primary entries from bundle configuration while allowing intentional hashed lazy chunks;
do not incorrectly require total JavaScript file count to equal bundle count. Use
`MAX_PRODUCTION_ENTRY_BYTES`, `MAX_PRODUCTION_JS_BYTES`, and `MAX_SPPKG_BYTES` as investigation
thresholds, not automatic architectural verdicts. Save or capture this JSON-shaped output in the build
log/evidence and update `todo.md` when the accepted baseline changes.

---

## 19. Docs & sample gallery

- Before replacing a specification-form README, preserve it as `<Sample>-Design-Brief.md`. Publication
  docs must not erase the approved product/UX intent or leave the tracker pointing at obsolete README
  section numbers.
- Document the agent mark, generation/check commands, dimensions, accent-color relationship, and
  provenance. Show the product through implementation screenshots; do not enlarge the icon into a
  substitute hero illustration.
- **README** from the PnP sample template: Summary, Screenshots, Applies to, Prerequisites, **Minimal
  Path to Awesome** (with a "ready-made package" callout linking the `.sppkg`), Features, mock-data and
  safety disclosure, accessibility/responsive evidence, localization/worldwide scope, validation
  status, demo assets, Solution structure, References, author + version history.
  Use plain hyphens `-` in prose (avoid em dashes). One screenshot per row (no crowded tables).
- If a public tenant-testing/deployment video exists, include a GitHub-compatible clickable thumbnail
  (`img.youtube.com` linked to the video) plus a text link. Do not use unsupported iframe embeds in a
  GitHub README.
- Generate one prompt-routing matrix for every current-target tool from the catalog as specified in
  §5.1. Never maintain a second hand-written prompt list that can drift. Use the generated matrix as
  routing test data and demo rehearsal input.
- For a complex catalog, keep a concise component plan that separates current-target tools from future
  candidates and states why each current tool earned independent routing. Keep demo scripts separate
  from this engineering playbook. Publish three useful cuts where scope warrants it:
  - a roughly 3-minute keynote that proves multiple inline UX shapes before one full-screen payoff;
  - a roughly 10-minute business-value journey across evidence, trade-offs, workspaces, and confirmation;
  - a roughly 5-minute developer walkthrough pairing live UX with exact owning code and build output.
  Each script includes audience, setup/reset, prompts, expected tools/properties, presenter actions,
  safety/feature guardrails, fallback path, and rehearsal checklist. Every cut explicitly demonstrates
  the same story spine: natural-language interpretation -> need-specific inline UX -> deterministic
  user-owned information/decision/action -> context-preserving full screen inside Copilot. State that
  the primary flow requires no external link or application transition.
- Document `ExploreAgentCapabilities`, its sixth conversation starter, category model, prompt
  copy/launch behavior, safe preview mode, and how future maintainers add education metadata for a new
  tool without editing the explorer UI.
- **`assets/sample.json`** (PnP gallery schema): unique `name`, `source: "pnp"`, title, short/long
  descriptions, `products`, `metadata` (`SAMPLE-TYPE`, `CLIENT-SIDE-DEV: React`, `SPFX-VERSION`),
  `thumbnails` (reference **only assets that exist**), `authors`, `references`. Keep thumbnails in sync
  with the real files in `assets/`.
- Capture every current inline component plus representative full-screen workspace, mobile, dark,
  education, and receipt states for publication. Promote only settled, validated harness evidence or
  recapture from the current build with animation disabled and the host frame clipped consistently.
- Prefer a deterministic `capture-visual-evidence.mjs` Playwright script: derive intent names from the
  catalog, select harness intent/mode/width controls, disable animation/transition during capture, wait
  for two animation frames, clip `.host` rather than the harness toolbar, use stable kebab-case names,
  and fail on missing/blank/overflowing output. Recapture only after the visual matrix is green.
- `validate-gallery-assets.mjs` MUST parse `sample.json`, enforce required PnP metadata, unique names and
  orders, local file existence, PNG signature/minimum dimensions, descriptive alt text, exact raw GitHub
  URLs, expected screenshot count, and no unlisted publication PNGs.
- Keep historical mockups/design boards clearly named as references and outside publication coverage.
  `sample.json` lists only screenshots captured from the current implementation.
- Generate or validate three separate demo cuts when the sample warrants them: short keynote, business
  value, and technical architecture. Each uses exact matrix prompts and states expected tool, presenter
  interaction, safeguard, fallback/recovery path, and mock/live boundary. Demo prose never claims an
  unimplemented workflow, external write, or tenant validation. Each cut distinguishes probabilistic
  AI interpretation from deterministic component behavior and shows inline work before full-screen
  application context without leaving the Copilot canvas.
- Before public submission, validate README/demo links, run the canonical clean build, report final
  artifact hashes, stop review servers, perform a clean-clone/offline rehearsal, and isolate any
  tenant-authenticated CSP/focus/screen-reader/high-contrast prerequisite as one external gate.
- Do not add another competing rules, skill, or agent-definition file for this sample. This project-
  specific playbook and `todo.md` are the implementation authorities.

---

## 20. Solution structure (mirror this)

```text
samples/<name>/
  README.md
  todo.md                         # phased Markdown checkbox tracker
  agentic-creation-rules.md       # project-specific engineering playbook
  <Sample>-3-Minute-Demo.md       # short inline-first keynote
  <Sample>-10-Minute-Business-Demo.md # comprehensive business-value journey
  <Sample>-5-Minute-Technical-Demo.md # UX + architecture/code walkthrough
  <Sample>-Prompt-Matrix.md        # generated all-tool routing/property/collision matrix
  <Sample>-Design-Brief.md         # preserved approved product/UX specification
  assets/                         # sample.json, screenshots, visual/release evidence, provenance
  scripts/                        # catalog/media/gallery/plugin/package-output validators and generators
  config/                         # Heft/SPFx + copilot-agent.json, config.json, package-solution.json
  copilot/                        # manifest.json, declarativeAgent.json, ai-plugin.json, instruction.txt
    color.png                     # 192 x 192 professional color agent icon
    outline.png                   # 32 x 32 monochrome white icon on transparency
  sharepoint/solution/<name>.sppkg  # committed, ready-to-deploy
  src/copilotComponents/<name>/
    <Name>CopilotComponent.ts / .manifest.json / <Name>CopilotComponentProperties.ts
    components/
      <Name>App.tsx               # root selector
      <Name>ThemeProvider.tsx     # single FluentProvider (stable-key)
      <Name>Inline.tsx             # focused intent surface
  src/copilotComponents/shared/
    experiences/                   # shared intent host, workspace shell, isolated full-screen roots
    dashboards/                    # useful default workspace dashboard compositions
    capabilityExplorer/            # reusable catalog education, prompt actions, previews, gallery
    models/                        # sources/, canonical models, seeds, routes
    services/                      # mock aggregate, mappers, session store, current user
    mockData/                      # source records, people, embedded media
    visualizations/                # analytical models, React SVG charts, Babylon scenes, DOM equivalents
    utils/                         # datetime, formatting, motion, settings
```

---

## 21. Cross-sample consistency checklist (apply to every sample)

- [ ] A named operational visual grammar is implemented centrally: neutral canvas, primary accent pair,
  contrast accent, semantic states, type/density/radius/elevation, and only surface/focus/analytical
  gradients. No generated purple AI header, gradient text, full-page gradient, or nested card grid ships.
- [ ] Every inline component uses the shared brand/action header: agent brand name plus literal action
  title on the left and an accessible View in full screen control at top right; narrow mode preserves
  the heading and collapses only the button's visible label.
- [ ] The shared frame contains no default `From your prompt`, property dump, or generic `Decision insight`
  region. Prompt values initialize real controls/state silently; optional interpretation is domain-specific
  and included only when it changes understanding or action.
- [ ] Every multi-record action experience defaults to actionable work and proves counted status filters,
  compact portrait-led rows, list -> detail -> decision -> confirmation -> updated list, read-only
  completed detail, preserved filters, session restoration, and narrow/full-screen fit.
- [ ] Chart form and renderer are selected from the decision question. One immutable model feeds DOM,
  React SVG, and/or Babylon profiles; compact exact charts do not become 3D by default, and signature
  scenes retain clear context, exact-value selection, and accessible equivalent.
- [ ] Every visible accountable person and inspectable product resolves through the packaged media
  catalog with provenance, meaningful alternative text, and initials/silhouette fallback.
- [ ] A professional agent mark is approved and generated into 192 x 192 `copilot/color.png` plus
  32 x 32 `copilot/outline.png`; the outline is monochrome white on transparency, both icons remain
  recognizable at small size, manifest/accent/provenance checks pass, and packaged hashes match source.

**Zava IT Concierge specialization only:**

- [ ] IT Concierge uses the stable Me, Team, and Company vertical tab model at desktop/keynote widths;
  narrow navigation preserves the same lens IDs, order, route state, semantics, and focus behavior.
- [ ] Official Microsoft Surface/Microsoft 365 assets and reference-sample persona portraits are
  optimized, package-hosted once, represented in the typed media catalog, and recorded in the asset
  provenance manifest; no runtime media requests or unapproved third-party brands exist.
- [ ] Estate Health Landscape, Incident Correlation Constellation, and Refresh Wave Horizon use
  deterministic analytical models plus Babylon rendering with compact/full-screen profiles, truthful
  controls, complete disposal, WebGL/reduced-motion fallbacks, context/legend, and 2D equivalents.

**Reusable checks continue:**

- [ ] Babylon production imports are modular (`@babylonjs/core`, never `Legacy/legacy`); unused GUI,
  physics, loaders, inspector, post-process, particles, WebXR, and WebGPU paths are absent unless an
  approved measured feature needs them. Bundle attribution and duplicate-engine audit pass.
- [ ] Every retained headless D3 module has a recorded measured value decision; the package audit rejects
  full `d3` plus selection, axis, transition, timer, interpolate/ease, brush, drag, zoom, fetch, and
  formatting modules. If none pass the value gate, D3 is absent from dependencies and production output.
- [ ] Lens/route, Babylon mark, evidence, workflow, and camera transitions use shared timing/easing,
  cancel cleanly on rapid input, preserve focus, resolve immediately for reduced motion/capture, and
  leave zero timers, animation groups, or render loops active after idle/teardown.
- [ ] Final component catalog approved; every component generated with its final immutable name through
  Yeoman by the user or agent; no manually copied scaffold.
- [ ] Package identity frozen before generation; API plugin v2.4 `name_for_human` is 20 characters or
  fewer (using a short plugin-facing name if needed), human description <= 100, model description <= 2,048.
- [ ] Current-target tools satisfy the component selection test; future/supporting intents remain
  documented internal routes or candidates rather than speculative component bundles.
- [ ] Every description has a positive use boundary and nearest-sibling exclusions; agent instructions
  require one primary tool; every starter has one explicit expected target and no compound task; local
  starter/matrix checks pass and tenant rehearsal records exactly one selected tool per request.
- [ ] Catalog-driven configure/validate scripts pass: unique GUIDs/tools/descriptions, expected bundles,
  schemas, resources, registrations, and no scaffold placeholders.
- [ ] Copilot Component (no web part / no property pane); Heft; React 17; Fluent v9.
- [ ] Focused inline root + approved shared/isolated/hybrid full-screen topology;
  `requestDisplayModeAsync` for the consistent top-right View in full screen control.
- [ ] Every primary workspace has a useful default dashboard; navigation orientation is justified by
  workspace count/labels/workflow and uses the available mobile, desktop, and projector canvas.
- [ ] Every intent catalog entry owns an exact shared-workspace or isolated full-screen destination;
  Expand preserves normalized invocation and validated transient state rather than opening generic home.
- [ ] Intent resolvers normalize unknown input, compact absent params, and increment a deterministic
  properties-version token only for fresh prompt state, never passive host rerenders.
- [ ] The component instance owns typed transient information/review/submit state across host mode
  rerenders; fresh signatures clear it; destination modules consume transferred state where exact
  continuation is claimed.
- [ ] Operation-aware information/review/submit dispatchers; unique `data-layout` identities; no generic
  fallback body or shared domain review evidence.
- [ ] One generated `ExploreAgentCapabilities` education experience exists by default, complete
  education metadata validates, it advertises all operational tools while excluding itself, and exactly
  six starters validate with five distinct operational targets plus the explorer as starter 6.
- [ ] Single stable-key theme provider; Griffel renderer targets `ownerDocument`; shared semantic custom
  properties plus Fluent tokens; CSS Modules/Griffel ownership is explicit; no static inline styles.
- [ ] Typed service contracts + Mock impl; source-appropriate raw data; canonical view models; mappers;
  relative-time resolution.
- [ ] Standard M365 demo personas; host identity/photo when already available; bundled fallback; one
  connected story.
- [ ] Authored imagery is offline and referenced through one shared media catalog; substantial images
  are package-hosted or a measured base64 catalog is emitted once; no app-initiated media requests;
  graceful fallbacks.
- [ ] Every retained control changes records/grouping/geometry/calculation/evidence/stage; unsupported
  decorative affordances removed; option datasets have material variance.
- [ ] Information intents cover useful default, changed/filter, selected-detail, no-match, and shared
  error fallback where applicable.
- [ ] Review decisions cover queue -> evidence -> draft -> confirm -> semantic receipt -> updated queue;
  visible safeguards/rationale; green approved, red returned/rejected.
- [ ] Submit/request forms cover prompt prefill -> visible validation -> matched review -> confirm ->
  receipt -> prompt-backed reset; every reviewed value is draft-backed or explicitly derived.
- [ ] Confirmed decisions/submissions append typed immutable session receipts; in-memory fallback,
  guarded sessionStorage, subscriptions, remount restoration, and Reset are tested. Unconfirmed drafts
  and host context are not persisted.
- [ ] DOM, React SVG, and Babylon render from typed analytical models; metric/group selectors redraw
  materially different data; accessible names, exact values/context, keyboard behavior, and text/list
  equivalent are supplied.
- [ ] Approved deterministic signature experiences provide immediate decision value and reduced-motion safety.
- [ ] Optional session-persisted settings that reshape the UX; visibility-driven re-flow layout.
- [ ] Staggered entrance + reduced-motion guards; large-display scaling; positive empty states.
- [ ] Tenant-free all-intent harness passes width/theme/runtime/overflow/image/label/chart/keyboard/reduced-
  motion/200%-zoom matrix; screenshots and JSON evidence saved.
- [ ] Capability explorer search/categories/prompt actions/read-only previews/tour pass; every advertised
  intent has deterministic preview coverage and the explorer does not advertise itself.
- [ ] Tenant-authenticated Workbench smoke passes CSP, display-mode request, iframe focus, and screen-reader
  output, or the missing tenant/auth prerequisite is explicitly recorded.
- [ ] Catalog/media audits and `heft test --clean` green (zero warnings); current agent ZIP and committed
  `.sppkg` inspected and regenerated; generated plugin v2.4 metadata/functions/MCP tools and length
  limits pass against the actual SharePoint-embedded ZIP; no stale package artifacts.
- [ ] Bundle strategy is measured: shared component entries deduplicate common runtime/media/icons or
  intentional split bundles document their lazy-loading benefit; production icon output contains only
  supported named imports; package report records JS count/size and duplicate-media count.
- [ ] `check:package-output` runs last and passes against the final `.sppkg`: hashed JS only, no duplicate
  media/base64 payloads across bundles, no hot-update/plain development output, matching embedded agent
  ZIP hash, no accidental Fluent icon font, and size thresholds recorded against the accepted baseline.
- [ ] `check:gallery` passes: every publication screenshot exists, is a valid adequately sized PNG,
  has unique order/alt text/raw URL in `assets/sample.json`, and no publication PNG is unlisted.
- [ ] `capture:visual` covers all inline defaults, full-screen defaults, mobile/dark, and representative
  detail/confirmation/receipt states with zero broken media, overflow, deprecated shared chrome,
  console/page errors, unexpected engines, or blank required canvases; committed evidence is current.
- [ ] Prompt-routing matrix covers every current tool, normalized properties, inline result, exact
  full-screen destination, sibling collisions, and fresh-invocation reset behavior.
- [ ] README includes real screenshots, ready-made package, safety/accessibility/worldwide/validation
  scope, demo links, and a GitHub-compatible tenant-testing video when available.
- [ ] Short keynote, longer business demo, and technical/code demo are rehearsable, accurately scoped,
  linked from README, and do not claim unimplemented state transfer or external writes.
- [ ] Clean-clone/offline build rehearsal passes; final `.sppkg` and agent ZIP hashes are reported;
  temporary servers are stopped; one canonical tenant prerequisite gate names any remaining host checks.
- [ ] `todo.md` generated first and kept current with Markdown checkboxes and validation-backed status.
