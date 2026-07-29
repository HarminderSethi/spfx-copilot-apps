import type { ICopilotComponentHostContext } from '@microsoft/sp-copilot-component';

export interface IShowActionChoicesProps {
  question: string;
  options: string[];
  idPrefix: string;
  hostContext: ICopilotComponentHostContext;
  onSendFollowUp: (message: string) => Promise<boolean>;
  targetDocument: Document | undefined;
}
