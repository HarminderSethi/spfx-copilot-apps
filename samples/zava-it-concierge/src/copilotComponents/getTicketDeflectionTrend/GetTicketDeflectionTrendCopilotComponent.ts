import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IGetTicketDeflectionTrendCopilotComponentProperties } from './GetTicketDeflectionTrendCopilotComponentProperties';

export default class GetTicketDeflectionTrendCopilotComponent extends IntentCopilotComponent<IGetTicketDeflectionTrendCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'GetTicketDeflectionTrend';
}
