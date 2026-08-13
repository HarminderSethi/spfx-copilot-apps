import type { IGetMyHrDashboardCopilotComponentProperties } from './GetMyHrDashboardCopilotComponentProperties';
import HomeIntentCopilotComponentBase from './HomeIntentCopilotComponentBase';
import { resolveHomeSummaryIntent } from './homeIntentDefinitions';
import type { IResolvedHomeIntent } from './homeIntentTypes';

export default class GetMyHrDashboardCopilotComponent extends HomeIntentCopilotComponentBase<IGetMyHrDashboardCopilotComponentProperties> {
  protected resolveIntent(properties: unknown): IResolvedHomeIntent {
    return resolveHomeSummaryIntent(properties);
  }
}
