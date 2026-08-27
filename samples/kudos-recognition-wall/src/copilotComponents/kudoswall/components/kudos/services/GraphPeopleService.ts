import type { MSGraphClientV3 } from '@microsoft/sp-http';
import type { IPerson } from '../models/kudos.types';
import type { IPeopleService } from './IPeopleService';
import { userPhotoUrl } from '../constants/kudos.constants';

interface IGraphUser {
  displayName?: string;
  mail?: string;
  userPrincipalName?: string;
  department?: string;
}

interface IGraphUsersResponse {
  value: IGraphUser[];
}

const SELECT = 'displayName,mail,userPrincipalName,department';
const escapeODataString = (value: string): string => value.replace(/'/g, "''");

/** Directory search + resolution backed by Microsoft Graph /users. */
export class GraphPeopleService implements IPeopleService {
  public constructor(
    private readonly graph: MSGraphClientV3,
    private readonly webAbsoluteUrl: string,
  ) {}

  public async searchPeople(query: string): Promise<IPerson[]> {
    const q = query.trim();
    if (!q) return [];
    const term = escapeODataString(q);
    const response: IGraphUsersResponse = await this.graph
      .api('/users')
      .filter(`startswith(displayName,'${term}') or startswith(mail,'${term}')`)
      .select(SELECT)
      .top(8)
      .get();
    return (response.value ?? []).map((u) => this.toPerson(u)).filter((p): p is IPerson => !!p);
  }

  public async resolvePerson(query: string): Promise<IPerson | undefined> {
    const results = await this.searchPeople(query);
    return results[0];
  }

  private toPerson(user: IGraphUser): IPerson | undefined {
    const upn = user.userPrincipalName ?? user.mail;
    if (!upn || !user.displayName) return undefined;
    return {
      id: upn,
      displayName: user.displayName,
      department: user.department,
      photoUrl: userPhotoUrl(this.webAbsoluteUrl, upn),
    };
  }
}
