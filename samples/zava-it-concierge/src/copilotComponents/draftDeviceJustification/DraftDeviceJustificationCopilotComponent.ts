import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IDraftDeviceJustificationCopilotComponentProperties } from './DraftDeviceJustificationCopilotComponentProperties';

export default class DraftDeviceJustificationCopilotComponent extends IntentCopilotComponent<IDraftDeviceJustificationCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'DraftDeviceJustification';
}
