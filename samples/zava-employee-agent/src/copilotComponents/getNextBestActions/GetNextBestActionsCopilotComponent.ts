import {
  type IGetNextBestActionsCopilotComponentProperties
} from './GetNextBestActionsCopilotComponentProperties';
import HomeIntentCopilotComponentBase from '../getMyHrDashboard/HomeIntentCopilotComponentBase';
import { resolveNextBestActionsIntent } from '../getMyHrDashboard/homeIntentDefinitions';
import type { IResolvedHomeIntent } from '../getMyHrDashboard/homeIntentTypes';

export default class GetNextBestActionsCopilotComponent extends HomeIntentCopilotComponentBase<IGetNextBestActionsCopilotComponentProperties> {
  protected resolveIntent(properties: unknown): IResolvedHomeIntent {
    return resolveNextBestActionsIntent(properties);
  }
}
