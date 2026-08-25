import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IExploreAgentCapabilitiesCopilotComponentProperties } from './ExploreAgentCapabilitiesCopilotComponentProperties';

export default class ExploreAgentCapabilitiesCopilotComponent extends IntentCopilotComponent<IExploreAgentCapabilitiesCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'ExploreAgentCapabilities';
}
