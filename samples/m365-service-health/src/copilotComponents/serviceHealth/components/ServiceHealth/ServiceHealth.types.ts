import type {
  ICopilotComponentHostContext,
  SPCopilotDisplayMode
} from '@microsoft/sp-copilot-component';

import type { IServiceHealthIssue, IServiceHealthResponse, IServiceHealthStrings } from '../../models';

export type LoadServiceHealth = () => Promise<IServiceHealthResponse>;
export type LoadServiceIssues = (serviceId: string) => Promise<IServiceHealthIssue[]>;

export interface IServiceHealthProps {
  serviceName: string;
  hostContext: ICopilotComponentHostContext;
  onRequestDisplayMode: (mode: SPCopilotDisplayMode) => Promise<void>;
  loadServiceHealth: LoadServiceHealth;
  loadServiceIssues: LoadServiceIssues;
  targetDocument: Document | undefined;
  strings: IServiceHealthStrings;
}
