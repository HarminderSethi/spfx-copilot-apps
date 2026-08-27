import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IReviewPolicyExceptionCopilotComponentProperties } from './ReviewPolicyExceptionCopilotComponentProperties';

export default class ReviewPolicyExceptionCopilotComponent extends IntentCopilotComponent<IReviewPolicyExceptionCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'ReviewPolicyException';
}
