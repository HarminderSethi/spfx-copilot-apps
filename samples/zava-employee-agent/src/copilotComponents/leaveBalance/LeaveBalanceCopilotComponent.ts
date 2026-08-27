import type { ILeaveBalanceCopilotComponentProperties } from './LeaveBalanceCopilotComponentProperties';
import { normalizeLeaveBalanceProperties } from './LeaveBalanceCopilotComponentProperties';
import CatalogIntentCopilotComponentBase from '../shared/experiences/CatalogIntentCopilotComponentBase';

export default class LeaveBalanceCopilotComponent extends CatalogIntentCopilotComponentBase<ILeaveBalanceCopilotComponentProperties> {
  protected intentKey = 'leaveBalance';
  protected normalizeProperties(properties: unknown): Record<string, string> { return normalizeLeaveBalanceProperties(properties); }
}
