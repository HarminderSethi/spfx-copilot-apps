# Zava Retail: 3-minute business and vision demo

## The story

**What if a retail leader could move from a question to an interactive store-performance view without leaving Copilot?**

Zava Retail brings sales, customer sentiment, product performance, and regional comparisons into one
experience inside Microsoft 365 Copilot.

> **Copilot understands the store request. The component turns it into a focused business experience.
> The leader can investigate without assembling another report.**

The sample starts with a compact answer in the conversation and expands into an executive dashboard
when more detail is needed. It uses deterministic sample data so the story is reliable in every demo.

## Before presenting

- Deploy `sharepoint/solution/zava-retail-store.sppkg` and open the ZavaRetail Agent in Microsoft 365 Copilot.
- Start a new conversation in a desktop-width window.
- Keep the prompt **Show me the performance of our store in New York** ready to paste.
- Set the dashboard to mock data and restore all visible sections before starting.
- Remember that all retail metrics, products, comparisons, and feedback are sample data.

## Timed presenter script

### 0:00-0:30 - Frame the business problem

**Say:**

> "A regional retail leader often has to combine sales reports, customer feedback, product rankings,
> and store comparisons before deciding where to focus. Zava Retail shows a different model: ask
> Copilot about one store and receive an interactive performance view in the flow of work."

### 0:30-1:00 - Start inside the conversation

**Paste:**

> **Show me the performance of our store in New York**

**Expected UX:** A compact inline card for the New York store with headline metrics and sales trend.

**Do:**

1. Point to the store identity and reporting period.
2. Call out the sales and customer-satisfaction summary.
3. Select **Open full dashboard**.

**Say:**

> "The answer is concise enough for the conversation, but it is not limited to prose. Copilot has
> routed the store request into a purpose-built experience, already focused on New York."

### 1:00-1:50 - Read the whole business picture

**Do:**

1. Pause on the full-screen dashboard.
2. Scan sales versus target, transactions, average basket, CSAT, NPS, and conversion.
3. Point to category mix, top products, feedback, and store comparison.

**Say:**

> "The same component now uses the space needed for operational review. Commercial performance and
> customer experience sit together, so I can connect what sold with how customers responded and how
> this location compares with nearby stores."

### 1:50-2:35 - Investigate without requesting another report

**Do:**

1. Open **Filters**.
2. Switch from New York to Boston or Seattle.
3. Select a previous reporting date.
4. Hide one dashboard section and close the panel.

**Say:**

> "This is where an interactive Copilot experience changes the workflow. I can retarget the store,
> move through the last week, and focus the dashboard on the measures relevant to this conversation.
> The deterministic sample data changes with the selected store and day, so the investigation feels
> coherent rather than static."

### 2:35-3:00 - Land the vision

**Say:**

> "Zava Retail is a sample, but the pattern is broadly useful: natural language finds the right
> business context, and a governed application provides the interaction. Replace the sample service
> behind this contract with approved retail systems, and Copilot becomes an entry point to operational
> insight without replacing the controls around the source data."

## What this demo proves

- A store-specific request can open an interactive UX instead of a long text answer.
- Inline mode supports a fast performance check inside the conversation.
- Full screen provides the depth needed for an executive review.
- Filters let the user compare stores, dates, and measures without issuing new prompts.
- One experience can combine commercial and customer signals.
- A service boundary leaves room for an approved live-data implementation.

## Presenter guardrails

- Do not describe retail metrics, feedback, products, or comparisons as live tenant data.
- Mock mode does not call a retail line-of-business system.
- Live mode is an integration placeholder in this sample; it still builds the dashboard from sample retail data.
- Do not imply that filters write to an external system; they change local component state.
- Keep the story focused on faster understanding and investigation, not on reading every chart.

## Fallback cut

If full-screen transition is unavailable, present the inline summary and explain that the host normally
expands the same component into the dashboard. Use the screenshots in `assets/` to describe store/date
filters, then close on the replaceable data-service pattern.

## Rehearsal checklist

- [ ] The prompt invokes `ZavaRetailTool` for New York on the first attempt.
- [ ] The inline card shows the expected store and summary.
- [ ] Full screen opens successfully.
- [ ] Store and date changes visibly update the dashboard.
- [ ] One section can be hidden and restored.
- [ ] The path completes within three minutes without presenting sample data as live.
