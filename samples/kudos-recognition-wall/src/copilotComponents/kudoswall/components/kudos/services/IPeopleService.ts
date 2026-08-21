import type { IPerson } from '../models/kudos.types';

/**
 * Resolves people for the recipient picker and for pre-filled Copilot prompts.
 * Kept separate from IKudosService — recognition data and directory lookups are
 * different concerns with different backends (SharePoint list vs Microsoft Graph).
 */
export interface IPeopleService {
  /** Type-ahead search over the directory. Returns a small, ranked result set. */
  searchPeople(query: string): Promise<IPerson[]>;
  /** Resolve a single person by UPN or display name (used for Copilot prompts). */
  resolvePerson(query: string): Promise<IPerson | undefined>;
}
