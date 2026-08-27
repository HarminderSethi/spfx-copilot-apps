import ProjectIntentCopilotComponentBase from '../shared/components/ProjectIntentCopilotComponentBase';
import type { IProjectIntentProperties } from '../shared/models/projectPortfolio';

export default class SubmitAiUsageCopilotComponent
  extends ProjectIntentCopilotComponentBase<IProjectIntentProperties> {
  protected intentKey = 'SubmitAiUsage';
}
