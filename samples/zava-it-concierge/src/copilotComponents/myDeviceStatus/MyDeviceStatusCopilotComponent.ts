import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IMyDeviceStatusCopilotComponentProperties } from './MyDeviceStatusCopilotComponentProperties';

export default class MyDeviceStatusCopilotComponent extends IntentCopilotComponent<IMyDeviceStatusCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'MyDeviceStatus';
}
