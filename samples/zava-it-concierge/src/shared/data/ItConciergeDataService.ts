import { createMockGraph } from './mockData';
import type { IItConciergeGraph } from './models';

export interface IItConciergeDataService {
  getGraph(): Promise<IItConciergeGraph>;
  reset(): IItConciergeGraph;
}

export class MockItConciergeDataService implements IItConciergeDataService {
  private graph: IItConciergeGraph = createMockGraph();

  public getGraph(): Promise<IItConciergeGraph> {
    return Promise.resolve(this.graph);
  }

  public reset(): IItConciergeGraph {
    this.graph = createMockGraph();
    return this.graph;
  }
}

export const itConciergeDataService: IItConciergeDataService = new MockItConciergeDataService();