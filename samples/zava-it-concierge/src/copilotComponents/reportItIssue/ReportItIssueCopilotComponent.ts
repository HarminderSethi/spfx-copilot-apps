import { IntentCopilotComponent } from '../../shared/components/IntentCopilotComponent';
import type { IntentName } from '../../shared/intents/intentCatalog';

import type { IReportItIssueCopilotComponentProperties } from './ReportItIssueCopilotComponentProperties';

export default class ReportItIssueCopilotComponent extends IntentCopilotComponent<IReportItIssueCopilotComponentProperties> {
  protected readonly intentName: IntentName = 'ReportItIssue';
}
