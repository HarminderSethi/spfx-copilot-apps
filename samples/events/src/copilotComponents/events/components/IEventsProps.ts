import type {
  ICopilotComponentHostContext,
  SPCopilotDisplayMode,
} from '@microsoft/sp-copilot-component';
import type { MSGraphClientFactory } from '@microsoft/sp-http';
import type { IEventsCopilotComponentProperties } from '../EventsCopilotComponentProperties';
import type { FirstDayOfWeek } from '../utils/userRegionalSettings';

export interface IEventsStrings {
  CalendarViewLabel: string;
  ErrorTitle: string;
  EmptyTitle: string;
  CompactButtonLabel: string;
  EventsViewLabel: string;
  ExpandButtonLabel: string;
  LoadingLabel: string;
  ViewLabel: string;
}

export interface IEventsProps {
  properties: IEventsCopilotComponentProperties;
  graphClientFactory: MSGraphClientFactory;
  hostContext: ICopilotComponentHostContext;
  onRequestDisplayMode: (mode: SPCopilotDisplayMode) => Promise<void>;
  onRequestSizeChange: (width: number, height: number) => Promise<boolean>;
  targetDocument: Document | undefined;
  strings: IEventsStrings;
  dateLocale: string;
  firstDayOfWeek: FirstDayOfWeek;
  timeZone: string;
  uiLocale: string;
}
