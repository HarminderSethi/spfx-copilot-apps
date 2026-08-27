import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IFindKnowledgeMatchCopilotComponentProperties } from './FindKnowledgeMatchCopilotComponentProperties';

export default class FindKnowledgeMatchCopilotComponent extends IntentCopilotComponent<IFindKnowledgeMatchCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'FindKnowledgeMatch';
}
