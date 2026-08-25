import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { ICorrelateMajorIncidentCopilotComponentProperties } from './CorrelateMajorIncidentCopilotComponentProperties';

export default class CorrelateMajorIncidentCopilotComponent extends IntentCopilotComponent<ICorrelateMajorIncidentCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'CorrelateMajorIncident';
}
