import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IGetDeviceHealthCopilotComponentProperties } from './GetDeviceHealthCopilotComponentProperties';

export default class GetDeviceHealthCopilotComponent extends IntentCopilotComponent<IGetDeviceHealthCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'GetDeviceHealth';
}
