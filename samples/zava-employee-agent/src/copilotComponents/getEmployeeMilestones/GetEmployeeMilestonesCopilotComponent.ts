import {
  type IGetEmployeeMilestonesCopilotComponentProperties
} from './GetEmployeeMilestonesCopilotComponentProperties';
import HomeIntentCopilotComponentBase from '../getMyHrDashboard/HomeIntentCopilotComponentBase';
import { resolveEmployeeMilestonesIntent } from '../getMyHrDashboard/homeIntentDefinitions';
import type { IResolvedHomeIntent } from '../getMyHrDashboard/homeIntentTypes';

export default class GetEmployeeMilestonesCopilotComponent extends HomeIntentCopilotComponentBase<IGetEmployeeMilestonesCopilotComponentProperties> {
  protected resolveIntent(properties: unknown): IResolvedHomeIntent {
    return resolveEmployeeMilestonesIntent(properties);
  }
}
