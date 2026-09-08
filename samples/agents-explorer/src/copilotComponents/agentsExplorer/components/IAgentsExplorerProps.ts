import type { ICopilotComponentHostContext, ISPCopilotBridge, SPCopilotDisplayMode } from '@microsoft/sp-copilot-component';
import type { ICopilotAgent } from '../../../services/AgentsExplorerService';

export interface IAgentsExplorerStrings {
  Title: string;
  SubtitlePrefix: string;
  SearchPlaceholder: string;
  FilterAllLabel: string;
  FilterMyLabel: string;
  FilterSharedLabel: string;
  PublishedLabel: string;
  NotPublishedLabel: string;
  LastModifiedLabel: string;
  UnknownOwnerLabel: string;
  UntitledAgentLabel: string;
  NoAgentsMessage: string;
  ExpandLabel: string;
  CompactLabel: string;
}

export interface IAgentsExplorerProps {
  /** Ownership filter requested by Copilot as a tool argument, if any. */
  ownershipFilter?: 'all' | 'my' | 'shared';
  /** Search text requested by Copilot as a tool argument, if any. */
  searchText?: string;
  /** Display name of the current user, used to resolve "my agents". */
  userDisplayName: string;
  /** Copilot Agents fetched from Dataverse across all reachable environments. */
  agents: ICopilotAgent[];
  /** Set when the agent fetch failed; empty string otherwise. */
  errorMessage: string;
  /** Host context (theme, display mode) from the Copilot host. */
  hostContext: ICopilotComponentHostContext;
  /** Bridge to communicate with the Copilot host (public API surface). */
  bridge: ISPCopilotBridge;
  /** Request the host to change display mode (e.g. 'fullscreen'). */
  onRequestDisplayMode: (mode: SPCopilotDisplayMode) => Promise<void>;
  /**
   * Document the FluentProvider should inject its theme styles into. Pass
   * `domElement.ownerDocument` so Griffel writes CSS into the correct iframe
   * document rather than the top-level page.
   */
  targetDocument: Document | undefined;
  /** Localized strings for UI labels. */
  strings: IAgentsExplorerStrings;
}
