import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IGetServiceHealthCopilotComponentProperties } from './GetServiceHealthCopilotComponentProperties';

export default class GetServiceHealthCopilotComponent extends IntentCopilotComponent<IGetServiceHealthCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'GetServiceHealth';
}
