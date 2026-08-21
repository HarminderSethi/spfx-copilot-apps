import {
  type IGetWorklifeSnapshotCopilotComponentProperties
} from './GetWorklifeSnapshotCopilotComponentProperties';
import HomeIntentCopilotComponentBase from '../getMyHrDashboard/HomeIntentCopilotComponentBase';
import { resolveWorklifeSnapshotIntent } from '../getMyHrDashboard/homeIntentDefinitions';
import type { IResolvedHomeIntent } from '../getMyHrDashboard/homeIntentTypes';

export default class GetWorklifeSnapshotCopilotComponent extends HomeIntentCopilotComponentBase<IGetWorklifeSnapshotCopilotComponentProperties> {
  protected resolveIntent(properties: unknown): IResolvedHomeIntent {
    return resolveWorklifeSnapshotIntent(properties);
  }
}
