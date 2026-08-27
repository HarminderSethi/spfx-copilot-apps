import ProjectIntentCopilotComponentBase from '../shared/components/ProjectIntentCopilotComponentBase';
import type { IProjectIntentProperties } from '../shared/models/projectPortfolio';

export default class ReviewStageGateCopilotComponent
  extends ProjectIntentCopilotComponentBase<IProjectIntentProperties> {
  protected intentKey = 'ReviewStageGate';
}
