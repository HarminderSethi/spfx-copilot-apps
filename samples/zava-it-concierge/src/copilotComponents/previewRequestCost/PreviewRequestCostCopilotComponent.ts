import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IPreviewRequestCostCopilotComponentProperties } from './PreviewRequestCostCopilotComponentProperties';

export default class PreviewRequestCostCopilotComponent extends IntentCopilotComponent<IPreviewRequestCostCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'PreviewRequestCost';
}
