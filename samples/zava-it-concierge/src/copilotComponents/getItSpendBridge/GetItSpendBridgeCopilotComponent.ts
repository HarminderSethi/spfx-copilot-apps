import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IGetItSpendBridgeCopilotComponentProperties } from './GetItSpendBridgeCopilotComponentProperties';

export default class GetItSpendBridgeCopilotComponent extends IntentCopilotComponent<IGetItSpendBridgeCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'GetItSpendBridge';
}
