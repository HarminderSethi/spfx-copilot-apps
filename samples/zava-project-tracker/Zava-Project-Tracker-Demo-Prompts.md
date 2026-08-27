# Zava AI Project Portfolio Agent demo prompts

Use this catalog to test tool selection, property extraction, inline UX, and full-screen landing in Microsoft 365 Copilot. Start a new conversation for routing-collision tests. Each prompt should select exactly one Copilot Component.

> Expected properties are normalized business values, not guaranteed diagnostic formatting. Missing fields remain visible defaults or selectors. Prompt values can prefill, filter, or open a decision draft; they never submit, approve, reject, assign, or write externally. Megan Bowen, Pradeep Gupta, Customer Service Copilot, and the other named people/projects are
> deterministic fictional sample records. The prompts intentionally use them so routing and screenshots
> remain reproducible in every demo tenant.

For the presentation path, use [Zava-Project-Tracker-3-Minute-Demo.md](Zava-Project-Tracker-3-Minute-Demo.md).

## Quick routing matrix

| # | Workspace | Prompt to paste | Expected tool | Expected inline result | Full-screen destination |
| --- | --- | --- | --- | --- | --- |
| 1 | My Work | **What needs my attention across my projects this week?** | `GetMyWorkSummary` | Ranked personal priority brief | `my-work/summary` |
| 2 | My Work | **Group my current tasks by project and show the blocked work.** | `GetMyTasks` | Grouped blocker task board | `my-work/tasks` |
| 3 | My Work | **How does my forecast capacity look over the next six weeks?** | `GetMyCapacity` | Six-week capacity horizon | `my-work/capacity` |
| 4 | My Work | **How is my work contributing to our responsible AI objective this quarter?** | `GetMyGoalContributions` | Objective-to-assignment contribution flow | `my-work/goals` |
| 5 | My Work | **Draft my weekly update for Customer Service Copilot with amber confidence.** | `SubmitWeeklyUpdate` | Editable weekly update draft | `my-work/weekly-update` |
| 6 | My Work | **Log 6 hours of model evaluation for Customer Service Copilot on 2026-08-19.** | `SubmitTimesheet` | Prefilled weekly time grid | `my-work/timesheet` |
| 7 | Project | **How is Customer Service Copilot doing financially compared with baseline?** | `GetProjectHealth` | Project health ring and financial evidence | `project/health` |
| 8 | Project | **Show only the critical path for Customer Service Copilot through launch, including baseline.** | `GetProjectTimeline` | Baseline/forecast critical-path timeline | `project/timeline` |
| 9 | Project | **Which Customer Service Copilot milestones are at risk this quarter?** | `GetProjectMilestones` | Milestone rail with stage gates | `project/milestones` |
| 10 | Project | **Show open AI risks above 60 exposure for Customer Service Copilot.** | `GetProjectRisks` | Filtered risk matrix and mitigation detail | `project/risks` |
| 11 | Project | **Show the current forecast for Customer Service Copilot including commitments.** | `GetProjectBudget` | Budget waterfall and forecast position | `project/budget` |
| 12 | Project | **Show Customer Service Copilot AI spend this month grouped by model in production.** | `GetProjectAiSpend` | AI spend control tower | `project/ai-spend` |
| 13 | Project | **Who is overallocated on Customer Service Copilot next sprint, including skill gaps?** | `GetProjectTeamCapacity` | Person-by-week capacity heatmap | `project/team-capacity` |
| 14 | Project | **Prepare the Customer Service Copilot status report for 2026-08-21 with amber overall status.** | `SubmitProjectStatus` | Editable multidimensional status report | `project/status-report` |
| 15 | Project | **Record 2.4 million input and 620 thousand output GPT-5 evaluation tokens for Customer Service Copilot on 2026-08-19.** | `SubmitAiUsage` | Usage form with calculated cost preview | `project/ai-usage` |
| 16 | Project | **Start a project request for a Supply Chain Exception Agent sponsored by Joni Sherman with a 640 thousand dollar budget.** | `SubmitProjectRequest` | Three-step governed project intake | `project/new-request` |
| 17 | Project | **Request another 75 thousand dollars of production AI budget for Customer Service Copilot by 2026-10-01.** | `RequestAiBudget` | Budget request with cap impact | `project/ai-budget-request` |
| 18 | Project | **Compare Customer Service Copilot with Contract Intelligence on delivery and value, including forecast.** | `CompareProjects` | Aligned project comparison | `project/compare` |
| 19 | Portfolio | **How is the AI project portfolio performing on value this quarter?** | `GetPortfolioHealth` | Value-risk portfolio overview | `portfolio/health` |
| 20 | Portfolio | **Which projects support the responsible AI objective, including unaligned investment?** | `GetStrategicAlignment` | Objective/key-result/project flow | `portfolio/strategy` |
| 21 | Portfolio | **Show launches, dependencies, and stage gates for the next two quarters.** | `GetPortfolioRoadmap` | Cross-project roadmap | `portfolio/roadmap` |
| 22 | Portfolio | **Where will the portfolio exceed forecast? Group the current scenario by project and show variances only.** | `GetPortfolioBudgetForecast` | Portfolio funding waterfall and flow | `portfolio/budget` |
| 23 | Portfolio | **Show portfolio AI unit cost by model for Customer Service Copilot and Contract Intelligence this quarter.** | `GetPortfolioAiSpend` | Metric-driven AI treemap and trend | `portfolio/ai-spend` |
| 24 | Portfolio | **Do we have enough AI platform capacity next quarter in the forecast scenario, including open roles?** | `GetPortfolioCapacity` | Demand/supply horizon and resource flow | `portfolio/capacity` |
| 25 | Portfolio | **Show systemic open AI risks above 50 exposure including dependencies.** | `GetPortfolioRiskExposure` | Dependency risk network and concentration | `portfolio/risks` |
| 26 | Decisions | **What project and portfolio approvals need me this week above 50 thousand dollars?** | `GetApprovalInbox` | Prioritized mixed approval queue | `approvals/inbox` |
| 27 | Decisions | **Review project request PRQ-2606 with focus on strategic fit.** | `ReviewProjectRequest` | Project intake evidence and decision safeguards | `approvals/project-request` |
| 28 | Decisions | **Review budget request BUD-2601 for Customer Service Copilot and show sensitive costs.** | `ReviewProjectBudget` | Budget bridge, alternatives, and consequences | `approvals/budget` |
| 29 | Decisions | **Can Pradeep join Customer Service Copilot at 20% from 2026-09-01 through 2026-10-31 as AI platform reviewer?** | `ReviewResourceAssignment` | Allocation scenario and decision workflow | `approvals/resource-assignment` |
| 30 | Decisions | **Review whether Customer Service Copilot is ready to exit the pilot gate, focusing on criteria.** | `ReviewStageGate` | Exit-criteria and blocker review | `approvals/stage-gate` |
| 31 | Explore | **Show me the project and portfolio scenarios you can help with.** | `ExploreAgentCapabilities` | Searchable capability explorer | `education/capabilities` |

## Expected property extraction

### My Work

| Tool | Expected properties from the prompt above |
| --- | --- |
| `GetMyWorkSummary` | `period: "week"` |
| `GetMyTasks` | `groupBy: "project"`, `status: "blocked"` |
| `GetMyCapacity` | `scenario: "forecast"`; six-week horizon safely implied by wording |
| `GetMyGoalContributions` | `objectiveId: "responsible AI"`, `period: "quarter"` |
| `SubmitWeeklyUpdate` | `projectId: "Customer Service Copilot"`, `confidence: "amber"` |
| `SubmitTimesheet` | `projectId: "Customer Service Copilot"`, `workDate: "2026-08-19"`, `hours: 6`, `workCategory: "model evaluation"` |

### Project

| Tool | Expected properties from the prompt above |
| --- | --- |
| `GetProjectHealth` | `projectId: "Customer Service Copilot"`, `focus: "financials"`, `compareToBaseline: true` |
| `GetProjectTimeline` | `projectId: "Customer Service Copilot"`, `criticalOnly: true`, `showBaseline: true` |
| `GetProjectMilestones` | `projectId: "Customer Service Copilot"`, `period: "quarter"`, `status: "at risk"` |
| `GetProjectRisks` | `projectId: "Customer Service Copilot"`, `riskType: "AI"`, `minimumExposure: 60`, `status: "open"` |
| `GetProjectBudget` | `projectId: "Customer Service Copilot"`, `scenario: "forecast"`, `includeCommitments: true` |
| `GetProjectAiSpend` | `projectId: "Customer Service Copilot"`, `period: "month"`, `groupBy: "model"`, `environment: "production"` |
| `GetProjectTeamCapacity` | `projectId: "Customer Service Copilot"`, `showSkillGaps: true`; sprint horizon safely implied |
| `SubmitProjectStatus` | `projectId: "Customer Service Copilot"`, `reportingDate: "2026-08-21"`, `overallStatus: "amber"` |
| `SubmitAiUsage` | `projectId: "Customer Service Copilot"`, `usageDate: "2026-08-19"`, `model: "GPT-5"`, `environment: "evaluation"`, `inputTokens: 2400000`, `outputTokens: 620000` |
| `SubmitProjectRequest` | `title: "Supply Chain Exception Agent"`, `sponsorId: "Joni Sherman"`, `estimatedBudget: 640000`, `aiEnabled: true` if agent wording safely implies AI |
| `RequestAiBudget` | `projectId: "Customer Service Copilot"`, `amount: 75000`, `neededBy: "2026-10-01"`, `environment: "production"` |
| `CompareProjects` | `projectIds: ["Customer Service Copilot", "Contract Intelligence"]`, `compareOn: "delivery"`, `includeForecast: true`; value remains visible as a requested secondary lens |

### Portfolio

| Tool | Expected properties from the prompt above |
| --- | --- |
| `GetPortfolioHealth` | `portfolioId: "AI project portfolio"`, `period: "quarter"`, `focus: "value"` |
| `GetStrategicAlignment` | `objectiveId: "responsible AI"`, `includeUnaligned: true` |
| `GetPortfolioRoadmap` | two-quarter date window, `showDependencies: true`, `milestoneType: "stage gate"` where extracted |
| `GetPortfolioBudgetForecast` | `scenario: "forecast"`, `groupBy: "project"`, `varianceOnly: true` |
| `GetPortfolioAiSpend` | `period: "quarter"`, `projectIds: ["Customer Service Copilot", "Contract Intelligence"]`, `groupBy: "model"`, `metric: "unitCost"` |
| `GetPortfolioCapacity` | `role: "AI platform"`, `scenario: "forecast"`, `includeOpenRoles: true`; next-quarter date window |
| `GetPortfolioRiskExposure` | `riskType: "AI"`, `minimumExposure: 50`, `status: "open"`, `includeDependencies: true` |

### Decisions and Explore

| Tool | Expected properties from the prompt above |
| --- | --- |
| `GetApprovalInbox` | `due: "week"`, `minimumAmount: 50000` |
| `ReviewProjectRequest` | `requestId: "PRQ-2606"`, `focus: "strategic fit"`, `decision: "review"` |
| `ReviewProjectBudget` | `approvalId: "BUD-2601"`, `projectId: "Customer Service Copilot"`, `showSensitiveCosts: true`, `decision: "review"` |
| `ReviewResourceAssignment` | `projectId: "Customer Service Copilot"`, `personId: "Pradeep Gupta"`, `allocationPercent: 20`, `startDate: "2026-09-01"`, `endDate: "2026-10-31"`, `role: "AI platform reviewer"`, `decision: "review"` |
| `ReviewStageGate` | `projectId: "Customer Service Copilot"`, `gateId: "pilot exit"`, `focus: "criteria"`, `decision: "review"` |
| `ExploreAgentCapabilities` | broad discovery intent; optional `tour: "featured"` only when the user explicitly asks for featured scenarios |

## Meaningful interaction checklist

Use one interaction after each routing smoke test when time permits:

- `GetMyWorkSummary`: change **Priority filter**.
- `GetMyTasks`: change grouping and toggle **Blocked only**.
- `GetMyCapacity`: switch **Committed / Forecast**.
- `GetMyGoalContributions`: change objective and toggle **Include indirect**.
- `GetProjectHealth`: change health focus.
- `GetProjectTimeline` / `GetProjectMilestones`: toggle **Critical only**.
- `GetProjectRisks`: select a risk cell.
- `GetProjectBudget` / `GetPortfolioBudgetForecast`: change scenario and toggle **Variance only**.
- `GetProjectAiSpend`: change period and grouping.
- `CompareProjects`: change comparison dimension.
- `GetPortfolioHealth`: change phase/risk filtering and select a bubble.
- `GetStrategicAlignment`: toggle **Include unaligned**.
- `GetPortfolioAiSpend`: change metric and toggle **By model**.
- `GetPortfolioRiskExposure`: toggle **Dependencies**.
- Reviews: select **Review**, inspect safeguards, and stop before confirmation unless testing receipts.
- Submissions: edit one field, select Review, verify the changed value, and stop before confirmation unless testing receipts.
- Explorer: search, filter, copy a prompt, and inspect a safe preview.

## Routing collision checks

Start a fresh conversation for each pair.

- **How much project budget remains?** -> `GetProjectBudget`; **Request another $75k of AI budget** -> `RequestAiBudget`; **Review the $75k budget request** -> `ReviewProjectBudget`.
- **Show AI spend** -> `GetProjectAiSpend` or `GetPortfolioAiSpend`; **Record AI usage** -> `SubmitAiUsage`.
- **Show my capacity** -> `GetMyCapacity`; **Show project team capacity** -> `GetProjectTeamCapacity`; **Show portfolio capacity gaps** -> `GetPortfolioCapacity`; **Can Pradeep join at 20%?** -> `ReviewResourceAssignment`.
- **Start a project request** -> `SubmitProjectRequest`; **Review project request PRQ-2606** -> `ReviewProjectRequest`.
- **Show project health** -> `GetProjectHealth`; **Is the project ready to exit pilot?** -> `ReviewStageGate`.
- **Compare two projects** -> `CompareProjects`; **Compare this month with last month for one project** -> the owning single-project metric component.
- **What needs my attention?** -> `GetMyWorkSummary`; **What decisions need me?** -> `GetApprovalInbox`.
- **What can this agent do?** -> `ExploreAgentCapabilities`; it must not return a long technical tool list in chat.

## Safe action checks

- Prompt text never submits or confirms automatically.
- Return and Reject require visible rationale before confirmation.
- Blocked stage-gate approval remains disabled.
- Overloaded resource scenarios cannot be approved until allocation is safe.
- Receipts state that no external system was updated.
- Confirmed generic submissions and review decisions persist only in browser-session sample state.
- **Reset demo decisions** clears processed Decisions state.

## Test recording template

For each prompt, record:

1. Selected tool name.
2. Extracted properties shown in Copilot diagnostics, if available.
3. Visible inline layout and one meaningful interaction.
4. Full-screen workspace and route.
5. Whether a fresh prompt resets prompt-derived defaults.
6. Whether any transient state shown in full screen matches the supported continuation contract.
7. Runtime errors, overflow, missing images, unlabeled controls, or blank charts.

```text
Prompt #:
Tool selected:
Properties correct:
Inline UX correct:
Interaction works:
Full-screen route correct:
Fresh reset correct:
Notes:
```
