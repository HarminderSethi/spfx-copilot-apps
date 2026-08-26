# Zava Employee Agent

Powered by SPFx Copilot Components

> Intro brief for the coding agent — adapted from the _People Compass Agent UX Design Review_ deck. All naming has been updated from "People Compass" to **Zava Employee Agent** to align with the Zava sample-brand convention already used across the `pnp/spfx-copilot-components` gallery (Zava Retail Store, Zava Insurance).

---

## Summary

**Zava Employee Agent** is an HR Hub Copilot App built from SPFx 1.24 Copilot Components (not classic web parts) for Zava, Microsoft's standard fictional demo company. It is the HR front door for Zava's employees — **not another HR chatbot**.

Instead of returning walls of policy text, Copilot renders the work directly in the canvas: balances, forms, cards, matrices, calendars, timelines, and manager cockpits. The design principle is simple:

> **Chat asks; Copilot Apps render the answer, the action, and the proof — in the canvas.**

Each named prompt intent is its own compact inline Copilot Component and MCP app tool. The same invoked component can expand into an immersive shared full-screen mode with a vertical-tab navigation model (one tab per family). Every full-screen dashboard identifies the signed-in user, uses a time-aware greeting, summarizes what matters in that area, and offers an area-specific priority plan. The sample ships with mocked data so anyone can deploy and demo in minutes — no line-of-business integration required, consistent with the other Zava samples.

---

## At a Glance

| Metric | Value |
| --- | --- |
| UX component families | **10** |
| Prompt-addressable Copilot Components/tools | **20** - value-ranked across ten families |
| Full-screen sections (vertical tabs, one per family) | **10** |
| Inline surfaces | **20**, one per component/tool; 30 more tracked for optimal future |
| Hub entry point | **1** - the Zava Employee Agent hub |
| Signature feature | **My HR action plan** - mocked AI-style cross-family summary and direct navigation |

---

## The Ten Component Families

These cover the full employee journey, from daily self-service to manager workflows. Function names below are the representative API surface the coding agent should implement/stub for each family.

<!-- markdownlint-disable MD060 -->

| #   | Component family           | Core employee value                                      | Representative functions                                        |
| --- | -------------------------- | -------------------------------------------------------- | --------------------------------------------------------------- |
| 01  | **My HR Dashboard**        | One personalized summary with all action points          | `GetMyHRDashboard` · `GetNextBestActions`                       |
| 02  | **Policy Q&A**             | Answers with cited policy sources                        | `AskPolicy` · `ComparePolicy` · `GetPolicySources`              |
| 03  | **PTO & Leave**            | Balance, request, status, usage and team coverage        | `GetLeaveBalance` · `RequestTimeOff` · `GetVacationUsage`       |
| 04  | **Payroll Explainer**      | Pay, deductions, documents and variance explanation      | `GetLatestPay` · `ExplainPayChange` · `GetPayDocuments`         |
| 05  | **Benefits & Life Events** | Coverage, comparison, dependents and life-event changes  | `CompareBenefitPlans` · `StartLifeEvent` · `GetEnrollmentChecklist` |
| 06  | **HR Case Desk**           | Answer first, tracked private case second                | `CreateHRCase` · `GetHRCaseStatus` · `DeflectWithKnowledge`     |
| 07  | **Learning & Compliance**  | Mandatory videos, readings and role-based learning paths | `GetRequiredLearning` · `ContinueLearning` · `GetTeamLearningStatus` |
| 08  | **Total Rewards**          | Pay, bonus, equity, pension and benefits value           | `GetTotalRewards` · `GetCompensationHistory` · `ExplainRewardsChange` |
| 09  | **Manager Team Hub**       | Manager actions, approvals, team signals and absence     | `GetTeamHub` · `GetApprovalInbox` · `GetTeamRiskSignals`        |
| 10  | **Org & People Graph**     | People, org, experts, HR contacts and meeting context    | `GetPeopleNetwork` · `ExploreOrganization` · `FindExpert`       |

<!-- markdownlint-enable MD060 -->

---

## Full-Screen Experience Model

The full-screen mode uses one shared shell with a **left vertical-tab rail** for Home, Time, Money, Benefits, Rewards, Policy, Support, Learning, Team, and People. All 20 current-target intent components reuse the shell in full-screen mode; the invoked component determines its fixed initial family and detail route.

Each full-screen section follows a consistent layout pattern:

- A colored header band (per-family accent color) with the signed-in user, a time-aware greeting such as "Good afternoon, Vesa," an area-specific state sentence, and 3–4 key metric tiles.
- An area priority banner that summarizes expected operations and opens a right-side action-plan panel.
- A primary content zone with 2–4 cards (charts, lists, tables, or timelines depending on the family).
- Inline action buttons (e.g., "Request time off," "Compare plans," "Submit request") that trigger guided transactions without leaving the canvas.

The Copilot host remains the conversational input. The component does not add a second persistent prompt box that competes with host chat and settings.

### My HR Action Plan

The Home dashboard's signature feature is **My HR action plan**, adapted from the _Plan my day_ pattern in the `my-day` sample:

1. A top banner summarizes cross-family signals from coherent mocked data, such as required learning, leave conflicts, benefits enrollment, payroll changes, open cases, and manager approvals.
2. **Build my HR action plan** opens a right-side panel.
3. The panel mimics AI generation with a short thinking state and streamed item reveal, while making no AI or runtime API calls.
4. Each recommendation explains why it matters and includes a direct command to its owning full-screen family detail.
5. Reduced-motion users receive the complete plan immediately, and a panel footnote clearly discloses that suggestions are generated locally from sample data.

Every other family uses the same pattern with an area-specific title, such as **Your leave priorities**, **Your pay insights**, or **Your learning priorities**.

---

## Parameter-Driven Rendering Patterns

Zava Employee Agent uses parameters to change the card **before** it renders — this is core to the "chat asks, Copilot Apps render" principle and should be reflected in the component prop contracts:

<!-- markdownlint-disable MD060 -->

| Pattern            | Example component  | Typical parameters                            | Why it matters                                               |
| ------------------ | ------------------ | --------------------------------------------- | ------------------------------------------------------------ |
| Filtered summary   | `GetMyHRDashboard` | `focusArea`, `period`, `includeSensitive`     | The summary can focus without owning sibling inline intents  |
| Guided transaction | `RequestTimeOff`   | `leaveType`, `startDate`, `endDate`, `reason` | The form opens pre-filled and validates before submit        |
| Explainability     | `ExplainPayChange` | `period`, `compareTo`, `includeDeductions`    | The card shows drivers rather than only a number             |
| Comparison matrix  | `CompareBenefitPlans` | `coverageTier`, `dependentCount`, `priorities` | The user can re-weight benefits fit, not read prose       |
| Private handoff    | `CreateHRCase`     | `category`, `privacyLevel`, `subject`         | Sensitive HR support can avoid leaking details into chat     |
| Manager scope      | `GetTeamHub`       | `teamId`, `includeApprovals`, `includeRisk`   | Manager cards respect role and permissions                   |

<!-- markdownlint-enable MD060 -->

Parameters extracted from the prompt must visibly prefill editable controls and remain subject to validation and user confirmation. For example:

> "I'd like vacation from August 4th to August 12th, 2027 for a family trip."

The `RequestTimeOff` component opens with `leaveType: "vacation"`, ISO `startDate` and `endDate`, and the reason prefilled. It calculates working days and mocked calendar or team-coverage conflicts before the user can confirm. Prompt values never submit a transaction automatically.

The canonical per-family layouts, action-plan model, navigation contract, parameter schemas, and showcase prompts are defined in [`Zava-Employee-Agent-UX-Design.md`](./Zava-Employee-Agent-UX-Design.md).

---

## Zava Brand Context

- **Company:** Zava — Microsoft's standard fictional demo company (successor to Contoso/Fabrikam), already used in `zava-retail-store` and `zava-insurance` samples in this same gallery.
- **Data:** Ship with realistic mocked HR data (employees, balances, pay periods, benefits plans) — no real line-of-business integration required, consistent with sibling Zava samples.
- **Visual identity:** Reuse the Zava brand kit (fonts: Aptos Display/Aptos; palette: `#183D4C`, `#3D7288`, `#97CCE3`, `#BBD5E1`, `#585751`, `#EBEFF3`) where it doesn't conflict with the per-family accent colors shown in the design review.
- **Tone:** Personal and approachable — an HR _front door_, not a chatbot. Employee-first language throughout (e.g., "Your leave balance," "Your next best action") rather than clinical HR-system phrasing.

---

## Build Ask for the Coding Agent

1. Implement **20 SPFx 1.24 Copilot Components** selected for high-value inline decisions, charts, explainability, and guided transactions, using the exact current portfolio in [`Zava-Employee-Agent-Component-Plan.md`](./Zava-Employee-Agent-Component-Plan.md). Retain the other 30 intents as optimal-future candidates.
2. Build the shared **full-screen shell** with the left vertical-tab rail, personalized area hero, settings, priority banner, and right-side panel. Keep conversational input in the Copilot host.
3. Implement **My HR action plan** with deterministic mock ranking, a simulated streamed right-side panel, and direct navigation to family details.
4. Give each component only the optional parameters needed to prefill or filter its fixed intent. Prompt values prefill controls but never bypass review or confirmation; parameterless intents use an empty schema.
5. Treat **Learning & Compliance** as the onboarding-equivalent family (replaces a dedicated onboarding component).
6. Ship with **mocked Zava employee data** end-to-end so the sample can be deployed and demoed in minutes, matching the bar set by `zava-retail-store` and `zava-insurance`.

**Next step:** turn this brief into the sample README and prompt pack for the `pnp/spfx-copilot-components` repository.
