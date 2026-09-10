declare interface IAgentsExplorerCopilotComponentStrings {
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

declare module 'AgentsExplorerCopilotComponentStrings' {
  const strings: IAgentsExplorerCopilotComponentStrings;
  export = strings;
}
