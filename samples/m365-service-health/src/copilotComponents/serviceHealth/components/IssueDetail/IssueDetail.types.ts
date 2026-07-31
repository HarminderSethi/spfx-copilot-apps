import type { IServiceHealthIssue, IServiceHealthStrings } from '../../models';

export interface IIssueDetailProps {
  issue: IServiceHealthIssue;
  strings: IServiceHealthStrings;
}

export interface IFactProps {
  label: string;
  value: string;
}
