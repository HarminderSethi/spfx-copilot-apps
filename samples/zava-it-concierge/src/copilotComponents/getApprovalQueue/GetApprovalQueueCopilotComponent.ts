import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IGetApprovalQueueCopilotComponentProperties } from './GetApprovalQueueCopilotComponentProperties';

export default class GetApprovalQueueCopilotComponent extends IntentCopilotComponent<IGetApprovalQueueCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'GetApprovalQueue';
}
