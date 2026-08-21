import type { IServiceHealthItem, IServiceHealthStrings } from '../../models';

export interface IServiceHealthSummaryProps {
  items: readonly IServiceHealthItem[];
  strings: IServiceHealthStrings;
}
