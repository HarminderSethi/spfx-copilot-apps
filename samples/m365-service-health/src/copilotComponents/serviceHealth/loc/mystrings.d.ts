declare interface IServiceHealthCopilotComponentStrings {
  ComponentTitle: string;
  OverallSubtitle: string;
  SpecificSubtitle: string;
  UpdatedLabel: string;

  SummaryAllHealthy: string;
  SummaryAllHealthyDetail: string;
  SummaryIssues: string;
  SummaryIssuesDetail: string;
  SummaryUnknown: string;
  SummaryUnknownDetail: string;

  ServiceNotFoundTitle: string;
  ServiceNotFoundDetail: string;

  FilterAllLabel: string;
  FilterAttentionLabel: string;
  FilterHealthyLabel: string;
  SearchPlaceholder: string;
  SearchAriaLabel: string;
  ServiceListAriaLabel: string;
  ServiceCountLabel: string;

  IncidentCountLabel: string;
  AdvisoryCountLabel: string;
  HealthyCountLabel: string;

  RefreshButtonLabel: string;
  ExpandButtonLabel: string;
  CollapseButtonLabel: string;
  BackButtonLabel: string;
  CloseButtonLabel: string;
  RetryButtonLabel: string;
  ViewIssuesButtonLabel: string;

  LoadingLabel: string;
  LoadingIssuesLabel: string;

  ErrorTitle: string;
  ErrorForbidden: string;
  ErrorUnauthenticated: string;
  ErrorThrottled: string;
  ErrorNetwork: string;
  ErrorUnknown: string;

  EmptyServicesTitle: string;
  EmptyServicesDetail: string;
  EmptyFilterTitle: string;
  EmptyFilterDetail: string;
  NoActiveIssuesTitle: string;
  NoActiveIssuesDetail: string;

  IssuesPanelSubtitle: string;
  ActiveIssuesHeading: string;
  ResolvedIssuesHeading: string;
  IssueDetailFallbackTitle: string;

  AffectedServiceLabel: string;
  IssueTypeLabel: string;
  IssueOriginLabel: string;
  IssueStatusLabel: string;
  IssueIdLabel: string;
  StartedLabel: string;
  EndedLabel: string;
  LastUpdatedLabel: string;
  UserImpactHeading: string;
  UpdatesHeading: string;
  NoUpdatesDetail: string;
  NoImpactDetail: string;

  ClassificationAdvisory: string;
  ClassificationIncident: string;
  ClassificationUnknown: string;
  ResolvedBadgeLabel: string;

  StatusServiceOperational: string;
  StatusInvestigating: string;
  StatusRestoringService: string;
  StatusVerifyingService: string;
  StatusServiceRestored: string;
  StatusPostIncidentReviewPublished: string;
  StatusServiceDegradation: string;
  StatusServiceInterruption: string;
  StatusExtendedRecovery: string;
  StatusFalsePositive: string;
  StatusInvestigationSuspended: string;
  StatusResolved: string;
  StatusMitigatedExternal: string;
  StatusMitigated: string;
  StatusResolvedExternal: string;
  StatusConfirmed: string;
  StatusReported: string;
  StatusUnknown: string;


  FallbackHeading: string;
  FallbackServiceLabel: string;
  FallbackDescription: string;
}

declare module 'ServiceHealthCopilotComponentStrings' {
  const strings: IServiceHealthCopilotComponentStrings;
  export = strings;
}
