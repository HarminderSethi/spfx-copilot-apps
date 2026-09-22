# Zava Customer Resolution - 4-Minute Copilot UX Keynote

## Setup

Audience: Microsoft 365, Copilot, and design leaders. Reset the demo session, use light theme, and keep
the component wide enough to show the labeled **Full screen** button. Confirmations are session-only.

Core line: **“Copilot is the application surface: natural language selects the right deterministic UX,
and that UX tells Copilot exactly what the person can see.”**

## Run of show

### 0:00-0:40 - A leadership question becomes a visual answer

Prompt: **Which customer relationships need leadership attention?**

Expected tool: `ExploreCustomerHealth`, without `customerId`. Show the inline value/risk matrix: health
versus renewal risk, bubble size as exposure, and exact values below. Point out that the LLM chose this
tool because its positive routing boundary covers customer portfolio risk and excludes service backlog.

Say: “The answer is not prose. Copilot gives us an inspectable visual data product.”

### 0:40-1:20 - Specific context changes the experience

Prompt: **Show why Northwind Traders service health is falling.**

Expected tool: `ExploreCustomerHealth` with `customerId: northwind-traders`. Show Northwind’s unique
constellation, synchronization evidence, commitments, health, risk, and recovery options. Contrast this
with the portfolio matrix: same intent, materially different UX because the entity is now known.

### 1:20-2:00 - Every component tells Copilot what is visible

Ask: **What am I looking at?** Explain that the component publishes intent, route, selected customer,
query/view state, and a bounded semantic summary through `updateModelContextAsync`. Then invoke:
**Are today's activation cases isolated or a broader incident?** Change similarity from 72% to 90%; the
network and exact cohort table change from six related cases to two, and Copilot receives the threshold.

### 2:00-2:45 - Inline expands into a real process

Prompt: **Build a resolution plan for case ZCR-1048.** Expand using the labeled **Full screen** control.
Resolution Room opens directly on Alpine because the case is scoped. Choose **Back to active
resolutions** to reveal the unscoped leadership portfolio, then reopen one room. Move to Customer 360:
without a customer scope it opens the complete 12-company directory, three companies per region.

### 2:45-3:10 - One leadership question, one focused chart

Prompt: **Show how service demand and resolution are moving today.**

Expected tool: `ExploreServicePerformance`. Show the isolated demand-to-resolution river and exact
peak/current/change values. Emphasize that Copilot routed to one chart rather than an overloaded dashboard.

### 3:10-3:35 - A different question routes to a different visual

Prompt: **Show where regional service impact needs leadership attention.**

Expected tool: `ExploreRegionalServiceImpact`. Select APAC on the projected map and show exact regional
case volume, SLA risk, CSAT, and recovery exposure. Mention that recurring-driver questions route to a
third isolated Pareto component rather than adding another chart here.

### 3:35-4:00 - Inline answers become coordinated operations

Expand either leadership chart into Service Operations. Change Today / EMEA / All products to 7 days /
APAC / Zava Commerce. Show that KPIs, trend path, map bubbles, recurring drivers, and recovery exposure
now coordinate because full screen is the right place for multi-chart analysis.

Close: **“The reference data is fictional. The important proof is the Copilot UX pattern: precise
routing to one focused visual answer, visible-state awareness, and coordinated full-screen process only
when the work needs more room.”**

## Fallback order

1. `inline-explore-customer-health.png`
2. `inline-incident-emergence.png`
3. `fullscreen-resolution-room.png`
4. `fullscreen-customer-360.png`
5. `inline-explore-service-performance.png`
6. `inline-explore-regional-service-impact.png`
7. `fullscreen-service-operations.png`
