import * as React from 'react';
import type {
  IKudos,
  IKudosFilters,
  IKudosService,
  ILeaderboardEntry,
  ISendKudosInput,
} from '../models/kudos.types';
import { ALL_TEAMS } from '../constants/kudos.constants';

export const DEFAULT_FILTERS: IKudosFilters = {
  department: ALL_TEAMS,
  value: 'all',
  range: 'month',
};

export interface IUseKudos {
  filters: IKudosFilters;
  kudos: IKudos[];
  mostRecognised: ILeaderboardEntry[];
  topGivers: ILeaderboardEntry[];
  departments: string[];
  loading: boolean;
  setFilters: (filters: IKudosFilters) => void;
  send: (input: ISendKudosInput) => Promise<IKudos>;
}

/**
 * Owns the recognition-wall data lifecycle: loads feed + leaderboards +
 * departments whenever the filters change, and prepends optimistically on send.
 * Extracted from KudosApp so the data flow is testable in isolation and reusable
 * by a second surface.
 */
export function useKudos(
  service: IKudosService,
  initialFilters: IKudosFilters = DEFAULT_FILTERS,
): IUseKudos {
  const [filters, setFilters] = React.useState<IKudosFilters>(initialFilters);
  const [kudos, setKudos] = React.useState<IKudos[]>([]);
  const [mostRecognised, setMostRecognised] = React.useState<ILeaderboardEntry[]>([]);
  const [topGivers, setTopGivers] = React.useState<ILeaderboardEntry[]>([]);
  const [departments, setDepartments] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(
    async (f: IKudosFilters): Promise<void> => {
      setLoading(true);
      try {
        const [feed, recognised, givers, depts] = await Promise.all([
          service.getKudos(f),
          service.getMostRecognised(f.range),
          service.getTopGivers(f.range),
          service.getDepartments(),
        ]);
        setKudos(feed);
        setMostRecognised(recognised);
        setTopGivers(givers);
        setDepartments(depts);
      } finally {
        setLoading(false);
      }
    },
    [service],
  );

  React.useEffect(() => {
    load(filters).catch(() => undefined);
  }, [filters, load]);

  const send = React.useCallback(
    async (input: ISendKudosInput): Promise<IKudos> => {
      const created = await service.sendKudos(input);
      setKudos((prev) => [created, ...prev]);
      return created;
    },
    [service],
  );

  return {
    filters,
    kudos,
    mostRecognised,
    topGivers,
    departments,
    loading,
    setFilters,
    send,
  };
}
