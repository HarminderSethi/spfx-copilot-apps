import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IReviewDeviceApprovalCopilotComponentProperties } from './ReviewDeviceApprovalCopilotComponentProperties';

export default class ReviewDeviceApprovalCopilotComponent extends IntentCopilotComponent<IReviewDeviceApprovalCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'ReviewDeviceApproval';
}
