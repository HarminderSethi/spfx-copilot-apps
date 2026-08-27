import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IGetFleetHealthCopilotComponentProperties } from './GetFleetHealthCopilotComponentProperties';

export default class GetFleetHealthCopilotComponent extends IntentCopilotComponent<IGetFleetHealthCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'GetFleetHealth';
}
