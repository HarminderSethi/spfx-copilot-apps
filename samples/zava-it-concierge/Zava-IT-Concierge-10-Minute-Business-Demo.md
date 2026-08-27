# Zava IT Concierge: 10-minute business-value demo

## Audience and outcome

This walkthrough is for employee experience, IT operations, procurement, and finance leaders. It demonstrates fictional Zava data and session-only actions; it does not claim live Microsoft Graph, Intune, service-health, procurement, or finance integration.

The story is the combination of two strengths. AI provides non-deterministic natural-language understanding and brings forward an experience adapted to the user's need. Purpose-built components provide deterministic information, calculations, validation, decisions, and actions. Inline experiences complete focused work directly in the Copilot canvas; full screen adds the context and scale of an application without sending the user to another destination.

## Scenario

Megan's video calls fail when she undocks during customer meetings. She needs immediate support and may need a replacement device. Diego needs to understand whether the issue is isolated, review the resulting request against policy and budget, and make an accountable decision. Lee needs to see whether the same signal reflects broader fleet or service risk. The demo follows that work from employee need to company action without leaving the Copilot canvas. At each level, inline handles the immediate task and full screen preserves that origin while adding the wider context needed by the role.

## 0:00-1:30 - Resolve Megan's immediate need, then add Personal context

**Say:** "Megan does not know which IT system, form, or category owns this problem. She simply describes what is happening while she is already working in Copilot."

**Prompt:** `Report that my video calls drop when I undock.`

**Expected inline component:** `ReportItIssueCopilotComponent`

Show that AI understood the unstructured symptom and adapted the response into a support-specific inline form with prefilled symptom and severity. Walk through the detected device, safe-diagnostics option, and business impact. Add an impact statement, review the issue report, explicitly confirm it, and pause on the session-only receipt. No link or separate service portal is needed.

**Full-screen context:** Select **Full screen** from the issue component. Show that Personal IT opens with Megan's support need still visible as the origin, then adds device health, active requests, replacement options, and continuity guidance. Explain that the immediate operation was completed inline; full screen now answers the broader question, "What else does Megan need to stay productive?" Return to the conversation before the next prompt.

**Business value:** structured intake, better triage evidence, and less employee time lost to incomplete support tickets.

**Safeguard:** prompt values prefill only; no ticket is recorded until visible review and confirmation.

**Story point:** AI resolves intent and context; deterministic UI owns the consequential operation.

## 1:30-2:50 - Turn the support need into a reviewable device request

Connect the next step to Megan's device-health context: the immediate issue is captured, but the evidence also makes replacement planning relevant.

**Prompt:** `Compare Surface devices for hybrid work.`

Show role fit, specifications, stock, lead time, and price. Follow with:

`Configure a Surface Laptop request with 32 GB memory and 512 GB storage.`

Change one field, show the estimate and policy consequence, add a rationale, review, confirm, and pause on the receipt.

Point out that the experience adapted across two natural-language turns: first an information-rich comparison, then an editable transaction. The user completes both inside Copilot rather than following a link into a catalog or procurement application.

**Business value:** standardized hardware, transparent cost, less back-and-forth, and better request evidence.

**Safeguard:** prompt values prefill editable fields; only the visible review and confirmation create a session record.

## 2:50-3:40 - Check whether Megan's issue is isolated

Switch to Diego's perspective. Before approving more hardware, he wants to know whether Megan's experience is a one-off symptom or part of a recurring team pattern.

**Prompt:** `Show my team's six-month IT ticket trend.`

**Expected inline component:** `GetTeamTicketTrendCopilotComponent`

Show the monthly trend, category evidence, exact values, and comparison with the company baseline. Connect Megan's report to the broader collaboration/performance pattern without claiming that one ticket caused the aggregate.

**Story point:** a request for information produces a compact analytical component rather than a transaction form. AI chooses the relevant experience; the component presents exact deterministic evidence inline.

**Business value:** managers can distinguish an isolated employee issue from a recurring team support pattern before prioritizing spend or intervention.

## 3:40-5:15 - Make the decision, then add Team context

The trend supplies context; now Diego returns to the specific request that requires his decision.

**Prompt:** `Show all pending requests awaiting my approval.`

**Expected inline component:** `GetApprovalQueueCopilotComponent`

Use the queue tabs to distinguish pending, approved, and declined records. Open Megan's request and show cost, budget, policy, age, business need, and due status. Add a rationale and advance to confirmation.

Emphasize that the approval is performed directly in the flow of the Copilot conversation with explicit controls and no application transition.

**Full-screen context:** Open Team operations from the approval queue. Keep Megan's request and Diego's decision context visible, then show the surrounding people readiness, approval workload, available hardware budget, ticket trend, and refresh priorities. Explain that full screen answers the manager's wider question, "How does this decision affect my team and budget?" Return to the conversation before continuing.

**Business value:** shorter approval cycle time with an evidence and consequence trail visible at the decision point.

## 5:15-6:00 - Handle the exception path

Show that the same decision model also handles a request that does not fit standard policy.

**Prompt:** `Review policy exception EXC-0317.`

Compare the requested option with the standard alternative. Show that approval, decline, and safe alternative selection require rationale and confirmation.

**Story point:** AI can understand how the exception is described, but it cannot silently decide the outcome. The deterministic component makes alternatives, consequences, and the user's final choice explicit.

**Business value:** policy exceptions become explicit, reviewable decisions rather than hidden procurement variance.

## 6:00-8:20 - Answer the fleet question, then add Company context

Switch to Lee's perspective. Megan's issue and Diego's decision are now part of a larger question: where is technology risk concentrated, and what should IT coordinate next?

**Prompt:** `Show company fleet health by region and department.`

**Expected inline component:** `GetFleetHealthCopilotComponent`

Start with the inline fleet map and select one region/department cohort to show immediate analytical value in the conversation.

**Full-screen context:** Expand the selected cohort to the IT control center without navigating away from Copilot. Preserve the originating fleet filters and selection, then connect that estate risk to service degradation, incident command, regional exposure, ticket demand, spend, age, refresh capacity, and license reclaim. Explain that full screen answers Lee's wider question, "What connected operational response does this risk require?"

Use one adjacent prompt if the audience leans toward a specific outcome:

- Cost: `Show licenses inactive for more than 90 days.`
- Service continuity: `Correlate signals for major incident INC-7091.`
- Investment planning: `Plan refresh waves with capacity of 42 devices per week.`

**Business value:** inline components keep specific information and operations close to the conversation; full screen supplies the breadth of a complete operating application when the task needs more context.

## 8:20-9:20 - Turn the connected evidence into an executive brief

**Prompt:** `Generate a company IT brief focused on risks and decisions.`

Use the brief to recap the connected scenario rather than presenting a feature inventory: Megan completed a focused support action inline and gained Personal context in full screen; Diego made an evidence-backed decision inline and gained Team context in full screen; Lee answered a fleet question inline and gained a Company operating picture in full screen.

Reinforce four points:

1. AI understands natural language and adapts the experience to what the user is trying to accomplish.
2. Deterministic components keep facts, calculations, decisions, and actions predictable and user-controlled.
3. Focused work happens inline in the Copilot canvas, with no link or transition to another application.
4. Full screen preserves the originating context and adds a complete application experience inside Copilot.

State the adoption boundary: replace service interfaces with authorized tenant adapters, then validate permissions, privacy, retention, localization, accessibility, and audit requirements before production use.

## 9:20-10:00 - Reveal the broader opportunity

Only after the scenario has demonstrated business value, use the **Explore capabilities** starter.

Briefly show that the explorer covers 30 operational tools and can be searched by role, task, and operation. Do not tour the catalog. Use it to make one final point: the employee, manager, and IT-leader journey is one connected example of a broader pattern that teams can extend to additional business scenarios.

**Say:** "We started with a real employee problem, not a menu of AI features. The same pattern can support many more scenarios: natural language finds the right experience, deterministic components complete the work, and broader application context remains available inside Copilot."

## Required experience checkpoint

The business demo must visibly invoke all four showcase components before closing:

1. `ReportItIssueCopilotComponent` - guarded submit operation
2. `GetTeamTicketTrendCopilotComponent` - team analytical information
3. `GetApprovalQueueCopilotComponent` - queue, detail, and decision review
4. `GetFleetHealthCopilotComponent` - inline estate analytics and full-screen payoff

It must also demonstrate all three context-preserving full-screen continuations:

1. **Personal IT** from Megan's issue, adding device, request, replacement, and continuity context.
2. **Team operations** from Diego's approval queue, adding people, workload, budget, trend, and refresh context.
3. **IT control center** from Lee's fleet cohort, adding service, incident, regional, spend, lifecycle, and capacity context.
