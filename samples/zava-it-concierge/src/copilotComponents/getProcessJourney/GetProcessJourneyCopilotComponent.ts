import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IGetProcessJourneyCopilotComponentProperties } from './GetProcessJourneyCopilotComponentProperties';

export default class GetProcessJourneyCopilotComponent extends IntentCopilotComponent<IGetProcessJourneyCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'GetProcessJourney';
}
