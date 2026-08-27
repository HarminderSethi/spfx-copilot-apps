import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IGetDeviceAgeDistributionCopilotComponentProperties } from './GetDeviceAgeDistributionCopilotComponentProperties';

export default class GetDeviceAgeDistributionCopilotComponent extends IntentCopilotComponent<IGetDeviceAgeDistributionCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'GetDeviceAgeDistribution';
}
