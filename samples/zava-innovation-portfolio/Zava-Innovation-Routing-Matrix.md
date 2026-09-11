# Zava Innovation Hub routing matrix

Generated from the approved intent catalog and starter configuration.

| Tool | Positive use boundary | Nearest exclusion |
| --- | --- | --- |
| `SubmitInnovationIdea` | Use when a person wants to create and confirm one new idea draft from a problem or opportunity. | Do not use for an existing idea’s status or financial case; use GetMyInnovation or BuildIdeaBusinessCase instead. |
| `GetMyInnovation` | Use when the signed-in person wants status, feedback, milestones, or next actions across their own existing ideas. | Do not use to create an idea or analyze the enterprise portfolio; use SubmitInnovationIdea or ExploreInnovationPortfolio instead. |
| `BuildIdeaBusinessCase` | Use when a screened idea needs projected costs, benefits, payback, assumptions, and confidence modeled before review. | Do not use to approve capital or track realized benefits; use ReviewInnovationFunding or TrackInnovationValue instead. |
| `CelebrateInnovationImpact` | Use when measured value exists and a person wants to recognize named contributors with evidence-grounded praise. | Do not use for general announcements or executive reporting; use GenerateInnovationBrief instead. |
| `GetInnovationReviewQueue` | Use when a reviewer wants to prioritize multiple pending gate reviews by age, evidence, and consequence without deciding them. | Do not use to decide one selected idea; use ReviewIdeaGate instead. |
| `ReviewIdeaGate` | Use when a reviewer must decide whether one selected idea advances, changes, parks, or stops based on gate evidence. | Do not use to prioritize the queue or approve capital; use GetInnovationReviewQueue or ReviewInnovationFunding instead. |
| `ReviewInnovationFunding` | Use when a committee must approve, adjust, defer, or decline one gate-approved capital request and inspect its consequences. | Do not use for gate progression or aggregate budget position; use ReviewIdeaGate or TrackInnovationBudget instead. |
| `ExploreInnovationPortfolio` | Use when leadership wants interactive, multi-dimensional analysis of the enterprise funnel, balance, themes, and portfolio composition. | Do not use for a concise exception scorecard, realized-value tracking, or personal idea status; use GetInnovationPortfolioHealth, TrackInnovationValue, or GetMyInnovation instead. |
| `TrackInnovationValue` | Use when a funded idea or portfolio needs projected benefits compared with realized benefits, variance, milestones, confidence, and owners. | Do not use to model a future business case or inspect overall portfolio composition; use BuildIdeaBusinessCase or ExploreInnovationPortfolio instead. |
| `GenerateInnovationBrief` | Use when leadership needs an editable, evidence-grounded narrative brief that summarizes current findings and decisions. | Do not use for interactive portfolio exploration or a health scorecard; use ExploreInnovationPortfolio or GetInnovationPortfolioHealth instead. |
| `GetInnovationGrowth` | Use when a program owner wants time-based participation, throughput, and conversion trends across innovation programs. | Do not use for geographic comparison or enterprise health; use ExploreGlobalInnovation or GetInnovationPortfolioHealth instead. |
| `ExploreGlobalInnovation` | Use when a program owner wants region-by-region participation, inclusion, and conversion gaps on a geographic view. | Do not use for time-based program growth or an individual submission; use GetInnovationGrowth or GetMyInnovation instead. |
| `TrackInnovationBudget` | Use when finance wants the aggregate innovation budget reconciled across allocated, committed, spent, forecast, and available funds. | Do not use to decide one capital request or measure realized benefits; use ReviewInnovationFunding or TrackInnovationValue instead. |
| `GetInnovationPortfolioHealth` | Use when leadership wants a concise KPI health scorecard that highlights dimensions outside target and accountable exceptions. | Do not use for exploratory funnel and balance analysis or a single idea’s value; use ExploreInnovationPortfolio or TrackInnovationValue instead. |
| `LaunchInnovationChallenge` | Use when a program owner wants to design and confirm a new strategic challenge with audience, criteria, timeline, and measurable outcomes. | Do not use to submit an entrant’s idea or manage an existing pilot; use SubmitInnovationIdea or ManageInnovationExperiment instead. |
| `ManageInnovationExperiment` | Use when a funded pilot needs hypotheses, observations, evidence, and a go, pivot, or stop learning recommendation. | Do not use to design a new challenge, approve funding, or make a gate decision; use LaunchInnovationChallenge, ReviewInnovationFunding, or ReviewIdeaGate instead. |
| `ExploreAgentCapabilities` | Use only when a user asks what the agent can do or needs help choosing an innovation scenario. | Do not use when the request already names a specific operational job; select that job’s tool instead. |

## Conversation starters

| # | Title | Prompt | Expected inline component |
| ---: | --- | --- | --- |
| 1 | Submit an idea | Submit an idea to reduce new-hire onboarding time by half. | `SubmitInnovationIdea` |
| 2 | Global innovation | Compare innovation participation and conversion across regions. | `ExploreGlobalInnovation` |
| 3 | Portfolio funnel | Show stage conversion in our innovation portfolio funnel. | `ExploreInnovationPortfolio` |
| 4 | Portfolio health | Show which innovation portfolio health measures are outside target. | `GetInnovationPortfolioHealth` |
| 5 | Approve an idea | Review Smart Onboarding Journey for gate approval. | `ReviewIdeaGate` |
| 6 | Explore capabilities | Explore what this agent can do. | `ExploreAgentCapabilities` |
