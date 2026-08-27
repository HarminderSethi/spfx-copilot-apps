import type { IGetProfileHealthCopilotComponentProperties } from './GetProfileHealthCopilotComponentProperties';
import HomeIntentCopilotComponentBase from '../getMyHrDashboard/HomeIntentCopilotComponentBase';
import { resolveProfileHealthIntent } from '../getMyHrDashboard/homeIntentDefinitions';
import type { IResolvedHomeIntent } from '../getMyHrDashboard/homeIntentTypes';

export default class GetProfileHealthCopilotComponent extends HomeIntentCopilotComponentBase<IGetProfileHealthCopilotComponentProperties> {
  protected resolveIntent(_properties: unknown): IResolvedHomeIntent {
    return resolveProfileHealthIntent();
  }
}
