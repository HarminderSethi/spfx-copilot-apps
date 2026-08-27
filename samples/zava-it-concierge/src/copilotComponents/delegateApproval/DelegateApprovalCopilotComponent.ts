import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IDelegateApprovalCopilotComponentProperties } from './DelegateApprovalCopilotComponentProperties';

export default class DelegateApprovalCopilotComponent extends IntentCopilotComponent<IDelegateApprovalCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'DelegateApproval';
}
