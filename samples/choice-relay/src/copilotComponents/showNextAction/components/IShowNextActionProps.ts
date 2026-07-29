import type { ICopilotComponentHostContext } from '@microsoft/sp-copilot-component';

export interface IShowNextActionProps {
  selectedOption: string;
  nextAction: string;
  explanation: string;
  idPrefix: string;
  hostContext: ICopilotComponentHostContext;
  onSendFollowUp: (message: string) => Promise<boolean>;
  targetDocument: Document | undefined;
}
