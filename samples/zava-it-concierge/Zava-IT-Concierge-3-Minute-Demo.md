# Zava IT Concierge: 3-minute keynote demo

## Setup

- Start a fresh Zava IT Concierge conversation as Megan Bowen.
- Keep the IT Portfolio dashboard ready in a separate rehearsal tab only as a recovery path.
- Use the exact prompts below. Pause after each component renders; never imply that mock data came from a live tenant.
- Keep one story visible throughout: AI understands natural language and selects the experience; deterministic UI lets the user inspect, decide, and act; full screen adds application-scale context without leaving Copilot.

## 0:00-0:50 - Turn an employee symptom into a safe support request

**Say:** "This combines the best of both worlds. AI handles the flexible, non-deterministic work of understanding an employee's natural language and adapting the experience to the need; deterministic controls keep the resulting decision and action in the user's hands."

**Prompt:** `Report that my video calls drop when I undock.`

**Expected inline component:** `ReportItIssueCopilotComponent`

Show how the AI interpreted an unstructured symptom, selected the support workflow, and prefilled the relevant symptom and severity instead of returning only prose. Then show the detected Surface, safe-diagnostics option, and business-impact field. Add a short impact statement, select **Review issue report**, then confirm the request and pause on the session-only receipt.

**Say:** "The AI handled the ambiguity; the component handles the operation deterministically. Megan reviews every field and confirms the action directly here in the Copilot canvas - no link, app switch, or handoff."

## 0:50-1:30 - Make the manager decision

**Prompt:** `Show all pending requests awaiting my approval.`

**Expected inline component:** `GetApprovalQueueCopilotComponent`

Open Megan's queue item. Show requester identity, evidence completeness, cost, policy fit, budget consequence, and due state. Add a rationale, choose **Approve request**, and pause at the confirmation step.

Keep this beat inline so the queue-to-detail decision flow remains visible in the conversation.

**Say:** "Natural language found the right work; deterministic records, policy evidence, rationale, and confirmation make the decision accountable. Diego can complete it in the flow of work without navigating to another application."

## 1:30-2:45 - Expand from an immediate answer to a full IT application

**Prompt:** `Show company fleet health by region and department.`

**Expected inline component:** `GetFleetHealthCopilotComponent`

Start inline. Select one region and department, then show the exact health, device, and critical-device values. Explain that the focused component answers Lee's immediate question directly in the conversation.

Select **Full screen** in the top-right control. Pause to show that the same fleet origin and selected cohort remain in context. Then use three connected areas to tell the wider story:

1. **Service and incident context:** determine whether the fleet signal aligns with active service degradation or a major incident.
2. **Regional and people impact:** identify where risk is concentrated and who owns the response.
3. **Investment response:** connect the evidence to refresh capacity, spend, and license opportunity.

**Say:** "Inline answered one precise question. Full screen did not send Lee to another application or reset the story; it preserved the origin and expanded the same Copilot canvas into a full-scale IT operating experience. This is where investigation, coordination, and planning gain the additional context they need."

## 2:45-3:00 - Close

**Say:** "AI understands what people mean. Deterministic components let them decide and act. Inline keeps focused work in the conversation, and full screen adds complete application context without ever leaving Copilot."

Open the final conversation starter, **Explore capabilities**, only if time remains.

## Required experience checkpoint

The keynote is complete only after these three inline components visibly render in this order:

1. `ReportItIssueCopilotComponent`
2. `GetApprovalQueueCopilotComponent`
3. `GetFleetHealthCopilotComponent`

The final fleet component must expand into the IT control center with its invoking context preserved. Do not replace this full-screen payoff with another inline component.
