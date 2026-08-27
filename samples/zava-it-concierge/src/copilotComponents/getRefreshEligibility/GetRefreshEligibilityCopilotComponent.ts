import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IGetRefreshEligibilityCopilotComponentProperties } from './GetRefreshEligibilityCopilotComponentProperties';

export default class GetRefreshEligibilityCopilotComponent extends IntentCopilotComponent<IGetRefreshEligibilityCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'GetRefreshEligibility';
}
