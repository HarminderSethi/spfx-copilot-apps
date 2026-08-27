import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IRunDeviceDiagnosticsCopilotComponentProperties } from './RunDeviceDiagnosticsCopilotComponentProperties';

export default class RunDeviceDiagnosticsCopilotComponent extends IntentCopilotComponent<IRunDeviceDiagnosticsCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'RunDeviceDiagnostics';
}
