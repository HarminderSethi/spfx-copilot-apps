# Zava AI Project Portfolio Agent: 3-minute dynamic UX demo

## The story

**What if one Copilot conversation could render the exact experience needed for each project decision?**

Zava combines two complementary models:

1. **Conversational understanding** selects one purpose-built Copilot Component and extracts only the scope stated in the prompt.
2. **Deterministic UX** makes that interpretation visible through controls, calculations, evidence, and explicit confirmation.

> **AI understands the question. The UX makes it precise. The user remains in control.**

The project-management domain is the proof. The reusable idea is dynamic, trustworthy UX inside the conversation, followed by full screen only when the decision needs more context.

## Before presenting

- Deploy `sharepoint/solution/zava-project-tracker.sppkg` and use the Zava AI Project Portfolio Agent.
- Use the Megan Bowen demo persona so personal, project, and manager paths are available.
- Start a new Copilot conversation. Do not reuse a conversation from rehearsal.
- Keep the host at desktop width for the final Decisions workspace.
- Keep these three prompts ready to paste exactly.
- If prior mocked decisions exist, open Decisions and select **Reset demo decisions** before starting.
- Describe all confirmations as session-only sample actions. No external project system is updated.

## Timed presenter script

### 0:00-0:20 - Frame the idea

**Say:**

> "Most project agents answer every question with more text. Zava does something different. Copilot understands the intent, then selects a purpose-built UX: evidence when I need insight, comparison when I need a trade-off, and review controls when a decision matters. Watch one conversation change shape three times before we open a dashboard."

### 0:20-0:55 - Turn 1: understand project health

**Paste:**

> **How is Customer Service Copilot doing financially compared with baseline?**

**Expected tool:** `GetProjectHealth`

**Expected properties:**

```text
projectId: Customer Service Copilot
focus: financials
compareToBaseline: true
```

**Expected UX:** Project health ring with schedule, budget, scope, value, and risk evidence.

**Do:**

1. Pause on the amber health score and eight-day schedule variance.
2. Select **financials** in the dimension controls.

**Say:**

> "The agent selected project health, not a generic dashboard. The project and focus are visible, and I can change the evidence without asking another question. Financial pressure is not the launch constraint; evaluation readiness is."

### 0:55-1:30 - Turn 2: compare the trade-off

**Paste:**

> **Compare Customer Service Copilot with Contract Intelligence on delivery and value, including forecast.**

**Expected tool:** `CompareProjects`

**Expected properties:**

```text
projectIds: [Customer Service Copilot, Contract Intelligence]
compareOn: delivery
includeForecast: true
```

**Expected UX:** Aligned project comparison across health, schedule, value, risk, and capacity.

**Do:**

1. Point to the delivery and value differences.
2. Select **capacity** as the comparison dimension.

**Say:**

> "Same conversation, different intent, different UX. The comparison uses common scales and named owners. One click changes the decision lens from delivery to capacity, where the shared constraint becomes obvious."

### 1:30-2:20 - Turn 3: model a safe resource decision

**Paste:**

> **Can Pradeep join Customer Service Copilot at 20% from 2026-09-01 through 2026-10-31 as AI platform reviewer?**

**Expected tool:** `ReviewResourceAssignment`

**Expected properties:**

```text
projectId: Customer Service Copilot
personId: Pradeep Gupta
allocationPercent: 20
startDate: 2026-09-01
endDate: 2026-10-31
role: AI platform reviewer
decision: review
```

**Expected UX:** Resource request queue followed by allocation evidence, skill fit, schedule impact, and decision safeguards.

**Do:**

1. Select **Review** on **Customer Service Copilot / AI review**.
2. Point to the 20% proposed allocation, 98% resulting load, 96% skill fit, and two affected milestones.
3. Do not confirm yet.

**Say:**

> "The prompt can prefill a scenario, but it cannot assign anyone. The component pins the approved 78% baseline, calculates a 98% proposed load, and keeps the scenario explicitly not applied."

### 2:20-3:00 - One more thing: continue in Decisions

**Do:**

1. Select **View in full screen**.
2. Confirm that **Decisions** is active and filtered to resource requests.
3. Select **Review** on **Customer Service Copilot / AI review**.
4. Select **Approve 20%**, review the consequence, then select **Confirm decision**.
5. Pause on the session-only receipt.

**Say:**

> "Full screen is not the opening act. It is the continuation. Zava keeps the invoked resource context, but still requires me to select the request explicitly before showing decision controls. Only after review and confirmation does the sample record a receipt. It survives navigation during this browser session, updates the Decisions queue, and can be cleared with Reset demo decisions. No external system was changed."

## What this demo proves

- Three natural-language turns select three materially different inline components.
- Prompt properties visibly scope controls and calculations.
- Inline interactions work before full screen appears.
- Full screen opens the owning workspace instead of a generic home page.
- Decisions remains selection-first and confirmation is explicit.
- Mock actions produce session receipts without external writes.
- The complete path is deterministic and offline after deployment.

## Presenter guardrails

- Do not say that Copilot calculated project metrics; deterministic sample calculations do that.
- Do not imply the 20% assignment was applied to a live resource system.
- The 20% value survives because it is explicit prompt context. Do not claim that every arbitrary slider edit transfers to full screen until all specialized transient adapters are complete.
- Do not turn the final minute into a tab tour. Decisions is enough for the three-minute cut.
- If time is short, stop on the confirmation screen and explain the receipt rather than rushing it.

## Fallback cut

If host full-screen transition is unavailable, complete the three inline turns and finish by reviewing the 20% allocation without confirmation. The core dynamic-UX story remains intact. Tenant-host display-mode behavior is a separate validation prerequisite.

## Rehearsal checklist

- [ ] Each prompt selects the expected tool on the first attempt.
- [ ] Health **financials** and comparison **capacity** controls visibly update.
- [ ] Resource review shows 20% and 98% load.
- [ ] Full screen opens Decisions with resource filtering and no automatic item selection.
- [ ] Explicit Review -> Approve -> Confirm produces a session receipt.
- [ ] Reset demo decisions clears the processed state.
- [ ] The path completes within three minutes without describing mock data as live.
