import type {
  ICopilotComponentHostContext,
  ISPCopilotBridge,
  SPCopilotDisplayMode
} from '@microsoft/sp-copilot-component';

import type { ICitation } from '../core/citations';
import type { IAnswerBlock } from '../core/entityParser';
import type { IWorkIQSensitivityLabel } from '../core/workIQTypes';

/** Localized labels. Mirrors `loc/mystrings.d.ts`. */
export interface IWorkIQAnswersStrings {
  ComponentTitle: string;
  AskingLabel: string;
  AnswerHeading: string;
  MentionsHeading: string;
  SourcesHeading: string;
  SourceGroupMeeting: string;
  SourceGroupFile: string;
  SourceGroupPerson: string;
  SourceGroupOther: string;
  SourceCountLabel: string;
  SourceCountSingularLabel: string;
  NoSourcesMessage: string;
  GroundedLabel: string;
  ModelLabel: string;
  ExpandButtonLabel: string;
  CollapseButtonLabel: string;
  ExpandToFullscreenTitle: string;
  CollapseToInlineTitle: string;
  FollowUpPlaceholder: string;
  FollowUpButtonLabel: string;
  FollowUpSectionTitle: string;
  TurnCountLabel: string;
  MockModeLabel: string;
  MockModeTooltip: string;
  ErrorHeading: string;
  RetryButtonLabel: string;
  EmptyQuestionMessage: string;
  OpenSourceLabel: string;
  PersonChipTooltip: string;
  EventChipTooltip: string;
  FileChipTooltip: string;
  FootnoteTooltip: string;
  SensitivityLabelPrefix: string;
  CopyAnswerLabel: string;
  CopiedLabel: string;
}

/** Everything the UI needs for one rendered turn. Answer text is pre-parsed into `blocks`. */
export interface IWorkIQAnswersProps {
  /** The question that produced this answer, as Copilot passed it in. */
  question: string;
  /** Parsed answer, ready to render. Empty before the first turn resolves. */
  blocks: IAnswerBlock[];
  citations: ICitation[];
  /** Present when the answer drew on labelled content. */
  sensitivityLabel?: IWorkIQSensitivityLabel;
  /** Server-side turn counter; increments across a multi-turn conversation. */
  turnCount: number;
  /** True while a Work IQ call is in flight. */
  isLoading: boolean;
  /** Message from a failed call, if the last attempt failed. */
  errorMessage?: string;
  /** True when answers are canned rather than from the tenant. */
  isMock: boolean;

  /** Sends a follow-up on the same conversation. */
  onAskFollowUp: (question: string) => void;
  /** Retries the last question after a failure. */
  onRetry: () => void;

  hostContext: ICopilotComponentHostContext;
  bridge: ISPCopilotBridge;
  onRequestDisplayMode: (mode: SPCopilotDisplayMode) => Promise<void>;
  /** `domElement.ownerDocument`, so Griffel writes CSS into the component's own iframe. */
  targetDocument: Document | undefined;
  strings: IWorkIQAnswersStrings;
}
