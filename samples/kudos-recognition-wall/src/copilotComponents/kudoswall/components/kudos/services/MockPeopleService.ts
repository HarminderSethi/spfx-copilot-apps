import type { IPerson } from '../models/kudos.types';
import type { IPeopleService } from './IPeopleService';
import { PEOPLE } from './MockKudosService';

const ALL: IPerson[] = Object.values(PEOPLE);

const delay = <T,>(value: T, ms = 180): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

/** Directory stand-in for the workbench — searches the mock roster. */
export class MockPeopleService implements IPeopleService {
  public async searchPeople(query: string): Promise<IPerson[]> {
    const q = query.trim().toLowerCase();
    if (!q) return delay(ALL.slice(0, 6));
    return delay(ALL.filter((p) => p.displayName.toLowerCase().indexOf(q) !== -1).slice(0, 6));
  }

  public async resolvePerson(query: string): Promise<IPerson | undefined> {
    const results = await this.searchPeople(query);
    return results[0];
  }
}
