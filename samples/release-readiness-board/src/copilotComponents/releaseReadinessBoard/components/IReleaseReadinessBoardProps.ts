import type {
  ICopilotComponentHostContext,
  SPCopilotDisplayMode
} from '@microsoft/sp-copilot-component';
import type { IReleasePlan } from '../models/IReleaseReadiness';

export interface IReleaseReadinessBoardStrings {
  Title: string;
  ExpandButtonLabel: string;
  DataSourceLabel: string;
  DataSourceLiveLabel: string;
  DataSourceMockLabel: string;
  CompletionLabel: string;
  BlockersLabel: string;
  OverdueLabel: string;
  LastUpdatedLabel: string;
  SearchPlaceholder: string;
  OwnerPlaceholder: string;
  ShowBlockedOnlyLabel: string;
  ReleaseChecksLabel: string;
  StatusDone: string;
  StatusPending: string;
  StatusBlocked: string;
  PostSummaryLabel: string;
  HealthLabel: string;
  RiskHigh: string;
  RiskMedium: string;
  RiskLow: string;
  NoReleasesFound: string;
  NoReleaseMatchesFilter: string;
  NoReleaseSelected: string;
  NoChecksMatchFilters: string;
  NoBlockersRightNow: string;
  StoriesLabel: string;
  BlockerTypeLabel: string;
  ActionCenterLabel: string;
  SuggestUnblockPlanLabel: string;
  DraftOwnerUpdateLabel: string;
  MarkVisibleDoneLabel: string;
  ResetFiltersLabel: string;
  SetDoneLabel: string;
  ReopenLabel: string;
  MarkBlockedLabel: string;
  UnblockLabel: string;
  BlockerSummaryLabel: string;
  OwnerWorkloadLabel: string;
  TargetLabel: string;
}

export interface IReleaseReadinessBoardProps {
  releases: IReleasePlan[];
  dataSourceLabel: string;
  releaseName?: string;
  owner?: string;
  showBlockedOnly?: string;
  userDisplayName: string;
  hostContext: ICopilotComponentHostContext;
  onRequestDisplayMode: (mode: SPCopilotDisplayMode) => Promise<void>;
  onSendFollowUp: (message: string) => Promise<boolean>;
  targetDocument: Document | undefined;
  strings: IReleaseReadinessBoardStrings;
}
