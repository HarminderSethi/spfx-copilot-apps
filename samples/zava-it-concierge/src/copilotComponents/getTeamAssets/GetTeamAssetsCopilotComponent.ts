import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IGetTeamAssetsCopilotComponentProperties } from './GetTeamAssetsCopilotComponentProperties';

export default class GetTeamAssetsCopilotComponent extends IntentCopilotComponent<IGetTeamAssetsCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'GetTeamAssets';
}
