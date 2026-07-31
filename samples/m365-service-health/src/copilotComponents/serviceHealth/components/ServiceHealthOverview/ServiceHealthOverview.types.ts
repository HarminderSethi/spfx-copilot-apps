import type { IServiceHealthIssue, IServiceHealthResponse, IServiceHealthStrings } from '../../models';

export interface IServiceHealthOverviewProps {
  response: IServiceHealthResponse;
  loadServiceIssues: (serviceId: string) => Promise<IServiceHealthIssue[]>;
  strings: IServiceHealthStrings;
}
