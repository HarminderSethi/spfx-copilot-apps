import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IGetTopItIssuesCopilotComponentProperties } from './GetTopItIssuesCopilotComponentProperties';

export default class GetTopItIssuesCopilotComponent extends IntentCopilotComponent<IGetTopItIssuesCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'GetTopItIssues';
}
