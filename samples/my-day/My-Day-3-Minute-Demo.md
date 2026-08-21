# My Day: 3-minute business and vision demo

## The story

**What if Copilot could help someone understand and shape their workday without sending them across five different applications?**

My Day brings the signals that compete for attention - meetings, tasks, important mail, company news,
and focus time - into one personal experience inside Microsoft 365 Copilot.

> **Copilot understands the request. The component turns it into a useful experience. The user stays
> focused and in control.**

The sample starts small in the conversation and expands only when the user wants a richer workspace.
Today it runs on deterministic mock data; the vision is to connect the same UX to Microsoft Graph,
SharePoint, and organizational intelligence without redesigning the experience.

## Before presenting

- Deploy `sharepoint/solution/my-day.sppkg` and open the My Day agent in Microsoft 365 Copilot.
- Start a new conversation and use a desktop-width window.
- Keep the prompt **What does my day look like?** ready to paste.
- If settings were changed during rehearsal, restore all panels and Celsius before starting.
- Remember that meetings, tasks, mail, news, weather, and the focus plan are sample data.

## Timed presenter script

### 0:00-0:25 - Frame the business problem

**Say:**

> "Starting the day often means opening the calendar, task list, inbox, intranet, and weather, then
> deciding what matters. The information exists, but the user still has to assemble the day. My Day
> shows a different vision: ask Copilot once and get a personal, actionable experience in the flow of
> work."

### 0:25-1:00 - Start inside the conversation

**Paste:**

> **What does my day look like?**

**Expected UX:** A compact inline card with a time-aware greeting, next meeting, tasks, and news.

**Do:**

1. Point to the signed-in user's name and photo.
2. Select **Next meeting** or **Tasks** to open an inline detail view.
3. Return to the summary.

**Say:**

> "This is not another destination or a long text summary. It is a compact experience grounded in
> the person and the current time. I can inspect the next commitment without leaving the Copilot
> conversation."

### 1:00-1:40 - Expand when the work needs more space

**Do:**

1. Select the expand control.
2. Pause on the full-screen dashboard.
3. Point to the agenda, tasks, important mail, news, and quick actions.

**Say:**

> "The conversation is the entry point, not a constraint. When I need the whole picture, the same
> component expands into a daily cockpit. The signals are organized for scanning, so I can see where
> meetings, deadlines, and communications compete for attention."

### 1:40-2:20 - Turn signals into a plan

**Do:**

1. Select **Plan my day**.
2. Let the thinking state and staged focus items complete.
3. Point to the personalized headline and the links between a meeting, tasks, and important mail.

**Say:**

> "The value is not simply aggregation. My Day turns the signals into a prioritized briefing: what
> to prepare for, what to finish, who needs a reply, and where to protect focus time. In this sample
> the plan is deterministic and transparent, which makes the demo reliable. The future service can
> add organizational context while keeping this same reviewable UX."

### 2:20-2:50 - Let the user shape the workspace

**Do:**

1. Close the plan and open **Settings**.
2. Switch between Celsius and Fahrenheit.
3. Hide **News** and show the dashboard re-flow.

**Say:**

> "The experience also adapts to the person. Preferences change the visible workspace immediately,
> and they remain only for this browser session. The user controls the view; the sample does not write
> to any external system."

### 2:50-3:00 - Land the vision

**Say:**

> "My Day is a small scenario with a broad idea: Copilot can render the right interactive surface at
> the moment of intent. Replace the mock service with Microsoft Graph and SharePoint, and this becomes
> a personal front door to the workday without forcing users to assemble it themselves."

## What this demo proves

- One natural-language request can open a personal, interactive UX instead of a long answer.
- Inline mode supports quick understanding without interrupting the conversation.
- Full screen provides depth only when the user asks for it.
- A coherent set of signals can become a prioritized, reviewable plan.
- User settings visibly reshape the experience without an external write.
- The service boundary supports a future move from mock data to live Microsoft 365 data.

## Presenter guardrails

- Do not describe the meetings, tasks, mail, news, weather, or focus plan as live tenant data.
- Do not say an AI model generated the current plan; `planMyDay` is deterministic sample logic.
- The signed-in user's name and profile photo are resolved from SharePoint context; the work signals
  remain mocked.
- Location fields are illustrative in this version and do not change the mock weather source.
- Do not imply that quick actions write to Outlook, To Do, SharePoint, or another external system.
- Keep the closing focused on reduced context switching and the extensibility vision, not a card tour.

## Fallback cut

If full-screen transition is unavailable, show the inline summary and one drill-down, then explain that
the host normally expands the same component into the dashboard. Finish on the vision of replacing the
mock service with Microsoft Graph and SharePoint while preserving the React UX.

## Rehearsal checklist

- [ ] The prompt invokes the My Day tool on the first attempt.
- [ ] The inline greeting shows the signed-in user and a believable time-relative summary.
- [ ] One inline drill-down opens and returns correctly.
- [ ] Expand opens the full-screen dashboard.
- [ ] Plan my day completes its staged reveal.
- [ ] Temperature and panel visibility settings visibly update the UX.
- [ ] The path completes within three minutes without presenting mock data as live.
