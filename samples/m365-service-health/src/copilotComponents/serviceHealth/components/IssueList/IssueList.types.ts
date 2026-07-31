import type { IServiceHealthIssue, IServiceHealthStrings } from '../../models';

export interface IIssueListProps {
  service: string;
  issues: readonly IServiceHealthIssue[];
  isLoading: boolean;
  error?: string;
  strings: IServiceHealthStrings;
  onSelectIssue: (issue: IServiceHealthIssue) => void;
  onRetry: () => void;
}
