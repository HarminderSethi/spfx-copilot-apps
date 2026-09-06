# Negotiation Lab architecture

This sample demonstrates one guarded Copilot workflow, not a generic negotiation framework.

## Product loop

```text
Choose scenario
  └─ Active board
       ├─ Ask a question → message only → fresh answer board → no state write
       └─ Make an offer → message + exact terms → saved pending turn
                                                 └─ reply preview
                                                      ├─ Accept and finish
                                                      └─ Make another offer
```

The two tabs keep independent local drafts while the current board remains mounted. Switching tabs submits and persists nothing.

Cool / Medium / Hard is selected on the scenario picker, stored as optional `negotiatorStyle` in the existing session JSON, and shown on every session view. Missing values mean Medium. The same small style definition is projected into Ready, AwaitingCounterpart and Completed model context. It guides generated behavior, not allowed values or write authority; changing style requires a new practice.

## Ownership

| Concern | Owner |
| --- | --- |
| Counterpart language and proposed outcome | Copilot |
| Input controls, validation and explicit confirmation | React |
| Current session, pending turn and accepted result | SharePoint |
| List schema creation and updates | APVEE provisioning |

Copilot output is always a proposal. The component validates its correlation, outcome and allowed terms before displaying an actionable preview. Only an explicit React action changes negotiation state.

## Small public surface

- Two components: OpenPractice and ShowReply.
- Two tools: `NegotiationLabOpenPractice` and `NegotiationLabShowReply`.
- Two lists: scenarios and sessions.
- One pure-data `negotiation-lab/v5` replacement snapshot, capped at 6 KB.
- No scoring, private utilities, debrief, event ledger, chat parser, custom API or migration.

OpenPractice handles open, refresh and read-only answer requests. ShowReply requires the saved pending correlation and remains read-only until the learner confirms a result.

## State and delivery rules

- Asking changes no terms, creates no pending turn and consumes no round.
- **Send offer** persists the displayed message and terms before context synchronization and delivery.
- A failed synchronization or delivery leaves that pending turn recoverable through **Retry** or **Edit message and terms**.
- Retry sends the same saved turn; it does not create another exchange.
- ShowReply rejects late, duplicate or mismatched replies.
- A counter must use allowed values, differ from the player's offer and improve at least one term from the counterpart's prior position.
- Acceptance and decline must contain no proposed terms. Both preview and persistence enforce this rule; an invalid reply leaves the saved offer editable.
- **Make another offer** records the reply but retains the learner's previous offer as the next editable draft.
- SharePoint ETags reject writes from stale rendered boards.

## Host lifecycle

The beta.3 host advances the conversation by creating a new component and tearing down the previous iframe. The sample therefore:

- stores one React 18 root and its owner on the reused DOM container, shared across both production bundles;
- prevents late teardown from removing a newer board;
- measures inline content after render and after internal layout changes;
- repaints fullscreen and theme changes; and
- replaces an old board with a compact archived marker rather than a blank surface.

Host JSON-RPC messages such as `tool-input`, `tool-result` and `host-context-changed` are SDK diagnostics, not application logging.

## Deliberate limits

Model context is transcript-silent, not secret. All scenarios are fictional, routing remains model-driven, and this is not a tamper-resistant assessment or production approval system. The sample shows an application-authority pattern; it does not call an LLM API directly from React.

Use one active practice conversation per user. Session creation is not atomic across conversations: simultaneous starts can create multiple active items, and resume selects the most recently modified one. Structured reply validation does not check the semantic consistency of generated prose.
