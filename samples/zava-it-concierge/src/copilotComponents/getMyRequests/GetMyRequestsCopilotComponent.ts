import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IGetMyRequestsCopilotComponentProperties } from './GetMyRequestsCopilotComponentProperties';

export default class GetMyRequestsCopilotComponent extends IntentCopilotComponent<IGetMyRequestsCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'GetMyRequests';
}
