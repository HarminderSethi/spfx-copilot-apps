import type { IApprovalInboxCopilotComponentProperties } from './ApprovalInboxCopilotComponentProperties';
import { normalizeApprovalInboxProperties } from './ApprovalInboxCopilotComponentProperties';
import CatalogIntentCopilotComponentBase from '../shared/experiences/CatalogIntentCopilotComponentBase';

export default class ApprovalInboxCopilotComponent extends CatalogIntentCopilotComponentBase<IApprovalInboxCopilotComponentProperties> {
  protected intentKey = 'approvalInbox';
  protected normalizeProperties(properties: unknown): Record<string, string> { return normalizeApprovalInboxProperties(properties); }
}
