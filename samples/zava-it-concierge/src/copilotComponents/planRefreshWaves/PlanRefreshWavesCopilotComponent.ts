import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IPlanRefreshWavesCopilotComponentProperties } from './PlanRefreshWavesCopilotComponentProperties';

export default class PlanRefreshWavesCopilotComponent extends IntentCopilotComponent<IPlanRefreshWavesCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'PlanRefreshWaves';
}
