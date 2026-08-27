import ProjectIntentCopilotComponentBase from '../shared/components/ProjectIntentCopilotComponentBase';
import type { IProjectIntentProperties } from '../shared/models/projectPortfolio';

export default class GetMyWorkSummaryCopilotComponent
  extends ProjectIntentCopilotComponentBase<IProjectIntentProperties> {
  protected intentKey = 'GetMyWorkSummary';
}
