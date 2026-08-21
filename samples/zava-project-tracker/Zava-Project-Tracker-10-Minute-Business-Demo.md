# Zava AI Project Portfolio Agent: 10-minute business value demo

## Purpose

Use this version when the audience needs more than the three-minute keynote. It proves the breadth of dynamic inline UX, the connected project/portfolio story, governed decisions, and the value of one full-screen workspace without becoming a feature inventory.

> **Conversation identifies the moment. Purpose-built UX makes the evidence and action trustworthy.**

## Audience

- PMO and portfolio leaders
- Project sponsors and governance boards
- Finance and resource managers
- Microsoft 365 and Copilot adoption leaders
- Product owners evaluating agentic UX patterns

## Before presenting

- Deploy `sharepoint/solution/zava-project-tracker.sppkg` to the demo tenant.
- Use the Megan Bowen persona.
- Open a fresh conversation with the Zava AI Project Portfolio Agent.
- Keep [Zava-Project-Tracker-Demo-Prompts.md](Zava-Project-Tracker-Demo-Prompts.md) available for exact prompts.
- Open Decisions once and select **Reset demo decisions**.
- Keep the host at desktop width for the full-screen section.
- Describe every person, project, value, and receipt as deterministic sample data.

## Demo arc

```text
Discover -> Diagnose -> Compare -> Model -> Expand -> Govern -> Widen -> Personalize -> Confirm
```

The first half stays inline. Full screen appears only after the audience sees three different intent-driven UX shapes.

## Timed script

### 0:00-0:40 - Set the business problem

**Say:**

> "Project leaders do not need another chatbot that summarizes whatever system they already know how to open. They need the right evidence and controls at the moment a question becomes a decision. Zava lets the conversation choose the experience. We will move from one project question to a portfolio trade-off and a governed resource decision, all in one Copilot conversation."

### 0:40-1:15 - Optional discovery for a first-time user

**Paste:**

> **Show me the project and portfolio scenarios you can help with.**

**Expected tool:** `ExploreAgentCapabilities`

**Do:**

1. Point to the four business categories and scenario counts.
2. Search for **capacity**.
3. Select the resource-assignment scenario and inspect its safe preview.

**Say:**

> "A complex agent should not depend on users memorizing thirty tools. The explorer organizes business outcomes, provides realistic prompts, and previews each experience without applying an action."

If the audience already knows the agent, skip this section and use the time for Q&A.

### 1:15-2:05 - Diagnose project health inline

**Paste:**

> **How is Customer Service Copilot doing financially compared with baseline?**

**Expected tool:** `GetProjectHealth`

**Do:** Select **financials**.

**Business points:**

- Health is reconciled across delivery, budget, scope, value, and risk.
- The project is amber, but the evidence says evaluation readiness, not cost, controls launch.
- Prompt scope appears as deterministic controls instead of hidden interpretation.

**Say:**

> "The answer is not simply amber. It explains which dimension drives amber and gives me the evidence needed to challenge that conclusion."

### 2:05-3:00 - Compare two investments inline

**Paste:**

> **Compare Customer Service Copilot with Contract Intelligence on delivery and value, including forecast.**

**Expected tool:** `CompareProjects`

**Do:** Change the highlighted dimension from **delivery** to **capacity**.

**Business points:**

- Common measures prevent two unrelated scorecards from masquerading as a comparison.
- Customer Service Copilot has stronger value; Contract Intelligence has less capacity flexibility.
- The audience sees why the next question is about Pradeep, not generic hiring.

### 3:00-4:10 - Model a safe resource decision inline

**Paste:**

> **Can Pradeep join Customer Service Copilot at 20% from 2026-09-01 through 2026-10-31 as AI platform reviewer?**

**Expected tool:** `ReviewResourceAssignment`

**Do:**

1. Select **Review** on **Customer Service Copilot / AI review**.
2. Show approved load 78%, proposed load 98%, skill fit 96%, and affected milestones.
3. Stop before confirmation.

**Say:**

> "The conversational model proposes the context. The component applies the deterministic rules. A prompt can never assign a person. It can only prepare a scenario for deliberate review."

### 4:10-5:15 - Expand into governed Decisions

**Do:**

1. Select **View in full screen**.
2. Confirm **Decisions** is active and filtered to resource requests.
3. Note that no item is auto-selected and no decision controls are visible.
4. Select **Review** on the Customer Service Copilot request.

**Business points:**

- Full screen is continuation, not an unrelated application landing page.
- The same twelve review records back inline queues and the unified manager inbox.
- Selection-first design prevents accidental decisions.

### 5:15-6:15 - Widen to project delivery

**Do:** Select the **Project** tab and choose **Customer Service Copilot**.

**Point out:**

- ownership and sponsor
- schedule variance and next gate
- approved versus forecast budget
- AI consumption
- current work, risk, milestones, and expected benefit

**Say:**

> "The resource decision is not isolated. The project cockpit shows the schedule, money, AI usage, work, risks, milestones, and benefit position that make the assignment consequential."

**Presenter guardrail:** Current full-screen dashboards preserve invoked workspace/scope and session receipts. Do not claim that every inline slider/filter is already mapped into every route-specific dashboard module.

### 6:15-7:15 - Widen to portfolio trade-offs

**Do:** Select **Portfolio**.

**Point out:**

- all eight transformations in one investment landscape
- twelve-month run-rate crossing baseline
- expected benefits and AI consumption
- the three executive exceptions
- complete financial ledger

**Say:**

> "At portfolio scale, the question changes from 'can this project have the person?' to 'where does scarce review capacity protect the most value?' The dashboard shows the company trade-off rather than repeating project cards."

### 7:15-8:10 - Bring the consequence back to My Work

**Do:** Select **My Work**.

**Point out:**

- Megan's ranked priorities
- capacity horizon
- upcoming milestones
- contribution to outcomes
- six governed personal actions

**Optional action:** Open **Weekly update**, edit one accomplishment, select **Review submission**, then close without confirming.

**Say:**

> "Portfolio choices eventually become personal commitments. My Work converts governance into what Megan needs to do this week, while reusing the same reviewed submission experiences available inline."

### 8:10-9:20 - Complete the decision with a receipt

**Do:**

1. Return to **Decisions**.
2. Select **Review** on **Customer Service Copilot / AI review**.
3. Select **Approve 20%**.
4. Inspect the consequence.
5. Select **Confirm decision**.
6. Show the updated row and session-only receipt.

**Say:**

> "The action boundary is explicit. The sample records an immutable browser-session receipt, updates the manager inbox, and performs no external write. A production service can later replace the mock store without changing this review contract."

### 9:20-10:00 - Close on business value

**Say:**

> "Zava demonstrates a reusable Copilot pattern: conversation resolves to trusted UX, evidence stays visible, consequential actions require confirmation, and full screen adds context only when the user asks for it. The opportunity is larger than project management. Any domain with many intents, governed actions, and fragmented systems can use the same architecture."

## Business value summary

- **Faster understanding:** questions resolve directly to the right visualization or workflow.
- **Better decisions:** comparisons and consequences use coherent records and calculations.
- **Safer actions:** prompts prefill but never confirm; safeguards remain deterministic.
- **Less navigation:** users begin with intent rather than knowing which application owns the task.
- **Portfolio context:** personal, project, portfolio, and governance views share one data story.
- **Demo reliability:** all runtime data is bundled, deterministic, and offline.

## Optional extension prompts

Use these only when the audience asks for more depth:

- **Where will the portfolio exceed forecast? Group the current scenario by project and show variances only.**
- **Which projects support the responsible AI objective, including unaligned investment?**
- **Record 2.4 million input and 620 thousand output GPT-5 evaluation tokens for Customer Service Copilot.**
- **Start a project request for a Supply Chain Exception Agent sponsored by Joni Sherman.**
- **Review whether Customer Service Copilot is ready to exit the pilot gate.**

## Fallback path

If full-screen mode is unavailable, complete the three inline turns, show the portfolio-health inline component, and end on the resource confirmation screen without confirming. This still proves dynamic routing, interactive evidence, and governed action.

## Rehearsal checklist

- [ ] Reset demo decisions and start a fresh conversation.
- [ ] Each prompt selects the expected tool without manual correction.
- [ ] Health and comparison controls visibly change evidence.
- [ ] Resource scenario shows 20% and 98% load.
- [ ] Full screen opens Decisions without automatic item selection.
- [ ] Project selector coordinates all cockpit regions.
- [ ] Portfolio shows eight projects and a twelve-month run-rate.
- [ ] My Work action opens and closes without losing the dashboard.
- [ ] Confirmed decision survives navigation and Reset clears it.
- [ ] The story completes in ten minutes with inline UX receiving at least half the time.
