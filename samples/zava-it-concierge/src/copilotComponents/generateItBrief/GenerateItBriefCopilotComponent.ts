import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IGenerateItBriefCopilotComponentProperties } from './GenerateItBriefCopilotComponentProperties';

export default class GenerateItBriefCopilotComponent extends IntentCopilotComponent<IGenerateItBriefCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'GenerateItBrief';
}
