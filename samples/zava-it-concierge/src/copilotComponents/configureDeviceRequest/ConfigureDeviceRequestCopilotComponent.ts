import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IConfigureDeviceRequestCopilotComponentProperties } from './ConfigureDeviceRequestCopilotComponentProperties';

export default class ConfigureDeviceRequestCopilotComponent extends IntentCopilotComponent<IConfigureDeviceRequestCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'ConfigureDeviceRequest';
}
