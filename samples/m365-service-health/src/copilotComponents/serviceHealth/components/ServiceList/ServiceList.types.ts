import type { IServiceHealthItem, IServiceHealthStrings } from '../../models';

export interface IServiceListProps {
  items: readonly IServiceHealthItem[];
  strings: IServiceHealthStrings;
  onSelectService: (item: IServiceHealthItem) => void;
}
