import type { CopilotComponentContext, ICopilotComponentHostContext, SPCopilotDisplayMode } from "@microsoft/sp-copilot-component";
import type { IResourceItem, SitesGroupInfoService } from "../services/SitesGroupInfoService";

export interface IMySitesGroupInfoProps {
  context: CopilotComponentContext;
  service: SitesGroupInfoService;
  target: "m365_groups" | "accessed_sites" | "followed_sites";
  top?: number;
  query?: string;
  initialData?: {
    followedSites: IResourceItem[];
    accessibleSites: IResourceItem[];
    groups: IResourceItem[];
  };
  targetDocument: Document | undefined;
  onRequestDisplayModeChange: (newMode: SPCopilotDisplayMode) => Promise<void>;
  onRequestSizeChange: (width: number, height: number) => Promise<boolean>;
  hostContext: ICopilotComponentHostContext;
}
