import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IGetTeamBudgetCopilotComponentProperties } from './GetTeamBudgetCopilotComponentProperties';

export default class GetTeamBudgetCopilotComponent extends IntentCopilotComponent<IGetTeamBudgetCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'GetTeamBudget';
}
