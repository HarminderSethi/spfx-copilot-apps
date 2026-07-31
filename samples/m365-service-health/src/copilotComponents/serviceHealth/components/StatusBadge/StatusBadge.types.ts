import type { IServiceHealthStrings } from '../../models';

export interface IStatusBadgeProps {
  status: string | undefined;
  strings: IServiceHealthStrings;
}
