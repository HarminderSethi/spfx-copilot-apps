# Zava Customer Resolution - 10-Minute Copilot UX Demo

## Goal

Demonstrate a modern Copilot interaction model. Zava is reference data; the product story is how 21
intent-specific UX components answer visually, publish visible state, and continue into four coherent
workspaces without trapping the user in one record.

## Setup

- Reset session receipts and use light theme.
- Confirm the labeled **Full screen** button appears at wide inline width and becomes icon-only when narrow.
- Keep the capability explorer available as the final breadth proof.
- Use the exact prompts below so routing can be judged independently from narration.

## Journey

### 0:00-1:00 - Portfolio question, visual answer

Prompt: **Which customer relationships need leadership attention?**

Expected: `ExploreCustomerHealth`, unscoped. Show the customer value/risk matrix and exact table. Then
prompt **Show why Northwind Traders service health is falling** to show how `customerId` changes the
same intent into a unique relationship constellation and customer-specific metrics.

### 1:00-2:00 - Actionable personal work

Prompt: **Show the customer cases that need my judgment now.**

Expected: `GetPriorityServiceQueue`. Expand to My Queue. Select `ZCR-1140`, inspect its ranking reasons,
choose **Mark resolved**, review the warning, cancel once, then confirm. The queue drops from six to five
and advances. Use **Open resolution room** to continue with the selected case.

### 2:00-3:15 - Scoped and unscoped Resolution Room

Prompt: **Build a resolution plan for case ZCR-1048.**

Expected: `BuildResolutionPlan`, direct case detail. Show verified, contrary, and missing evidence beside
the plan. Expand to exact Alpine detail. Choose **Back to active resolutions**: demand and incident
charts plus ranked customer rooms now answer the unscoped question. Open another generated case and
show that it still has verified/inference/gap evidence rather than an empty panel.

### 3:15-4:15 - Human correction and incident boundary

Prompt: **Diagnose the evidence for case ZCR-1048.** Contrast hypotheses and contrary network evidence.
Then prompt **Are today's activation cases isolated or a broader incident?** Expected:
`DetectServiceIncident`. Move 72% to 90%; the visible network and table change. Explain why
`ReviewIncidentResponse` is a separate routed decision tool rather than another graph.

### 4:15-5:15 - Customer 360 is a process, not a static profile

Navigate directly to Customer 360 without customer scope. Show all 12 companies and region filters
(three per region). Open Northwind, review its synchronization constellation and commitments, then use
**Back to customer search** and open Contoso. Point out that customer nodes, geometry, evidence,
recovery remedies, authority, and outcomes change with the selected account.

### 5:15-6:15 - Guarded recovery and communication

Prompt: **Review the recovery options for case ZCR-1048.** Expected: `ReviewServiceRecovery`. Compare
cost, authority, precedent, and trust outcome; enter Review but do not imply production approval. Then
prompt **Draft a French and English update for Alpine House.** Expected: `ComposeCustomerUpdate`.
Show that internal evidence is transformed into customer-safe facts and explicit promises.

### 6:15-7:15 - Capacity and leadership visuals

Prompt: **Show where team capacity is creating SLA risk today.** Expected: `BalanceServiceWorkload`.
Show capacity versus SLA-risk bubbles sized by open demand. Contrast it with the incident network and
customer portfolio matrix: three leadership questions, three different visual grammars.

### 7:15-8:30 - Coordinated Service Operations

Open Service Operations. Change Today / EMEA / All products to 7 days / APAC / Zava Commerce. Verify
that KPIs, demand geometry, map bubbles, selected-region detail, recurring drivers, and recovery table
all move. Narrate the decision, not the fictional numbers: one filter state coordinates every view.

### 8:30-9:20 - Safe action lifecycle

Open `StartExpertSwarm`, `CoordinateFieldService`, or `CreateKnowledgeFromResolution`. Show Draft ->
Review -> Confirm -> session receipt -> Reset. Prompt values only prefill. Consequential actions remain
human-controlled and no tenant record is changed.

### 9:20-10:00 - Discoverability and Copilot awareness

Prompt: **What can this agent do?** Search by role or outcome. Explain that each of the 23 tools has a
unique “Use when / Do not use” model description. Ask **What am I looking at?** and show that the active
component publishes its intent, route, selected entity, view/query, and purpose-specific visible summary.

## Guardrails

- The LLM routes and prefills; React owns records, calculations, charts, validation, and confirmation.
- Every scoped detail has a route back to its owning list or portfolio.
- Session receipts never claim production authorization.
- The data is fictional and offline; the UX architecture is the demonstration.

## Rehearsal checklist

- Verify all 23 local manifests load in Copilot Workbench.
- Verify all 12 customers appear under **All regions**, and each region shows three.
- Verify a generated Resolution Room case displays three evidence records.
- Verify Service Operations filters change every coordinated output.
- Use the matching publication screenshots if tenant routing is unavailable.
