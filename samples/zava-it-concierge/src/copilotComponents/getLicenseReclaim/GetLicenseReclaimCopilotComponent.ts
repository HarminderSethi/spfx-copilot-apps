import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IGetLicenseReclaimCopilotComponentProperties } from './GetLicenseReclaimCopilotComponentProperties';

export default class GetLicenseReclaimCopilotComponent extends IntentCopilotComponent<IGetLicenseReclaimCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'GetLicenseReclaim';
}
