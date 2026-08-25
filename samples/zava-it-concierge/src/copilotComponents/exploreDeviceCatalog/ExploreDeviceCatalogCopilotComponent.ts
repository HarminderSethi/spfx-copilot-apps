import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IExploreDeviceCatalogCopilotComponentProperties } from './ExploreDeviceCatalogCopilotComponentProperties';

export default class ExploreDeviceCatalogCopilotComponent extends IntentCopilotComponent<IExploreDeviceCatalogCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'ExploreDeviceCatalog';
}
