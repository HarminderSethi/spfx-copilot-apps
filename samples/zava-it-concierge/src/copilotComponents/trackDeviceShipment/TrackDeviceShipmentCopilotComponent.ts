import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { ITrackDeviceShipmentCopilotComponentProperties } from './TrackDeviceShipmentCopilotComponentProperties';

export default class TrackDeviceShipmentCopilotComponent extends IntentCopilotComponent<ITrackDeviceShipmentCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'TrackDeviceShipment';
}
