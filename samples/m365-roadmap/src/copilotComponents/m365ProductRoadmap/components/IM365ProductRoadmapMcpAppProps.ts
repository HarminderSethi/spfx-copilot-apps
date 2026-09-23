import type { Client } from '@modelcontextprotocol/sdk/client/index.js';
import type {
  ICopilotComponentHostContext,
  ISPCopilotBridge,
  ISPRequestDisplayModeResult,
  SPCopilotDisplayMode
} from '@microsoft/sp-copilot-component';

export interface IM365ProductRoadmapMcpAppProps {
  assetBaseUrl: string;
  bridge: ISPCopilotBridge;
  hostContext: ICopilotComponentHostContext;
  locale: string;
  onClientChanged: (client: Client | undefined) => void;
  onRequestDisplayMode: (
    mode: SPCopilotDisplayMode
  ) => Promise<ISPRequestDisplayModeResult>;
  targetDocument: Document;
  toolInput: Record<string, unknown>;
}
