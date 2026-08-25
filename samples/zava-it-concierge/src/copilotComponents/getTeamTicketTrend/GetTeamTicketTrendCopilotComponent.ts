import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IGetTeamTicketTrendCopilotComponentProperties } from './GetTeamTicketTrendCopilotComponentProperties';

export default class GetTeamTicketTrendCopilotComponent extends IntentCopilotComponent<IGetTeamTicketTrendCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'GetTeamTicketTrend';
}
