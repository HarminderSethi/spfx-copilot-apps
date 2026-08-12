import type { SPHttpClient, MSGraphClientV3 } from '@microsoft/sp-http';
import type { IKudosService } from '../models/kudos.types';
import type { IPeopleService } from './IPeopleService';
import { MockKudosService } from './MockKudosService';
import { MockPeopleService } from './MockPeopleService';
import { SpKudosService, type ICurrentUser } from './SpKudosService';
import { GraphPeopleService } from './GraphPeopleService';

export interface IKudosServices {
  kudos: IKudosService;
  people: IPeopleService;
}

export interface IKudosServiceOptions {
  spHttpClient?: SPHttpClient;
  graph?: MSGraphClientV3;
  webAbsoluteUrl?: string;
  currentUser?: ICurrentUser;
  /** Force the mock backend (e.g. `?kudosMock=1` in the workbench with no list). */
  forceMock?: boolean;
}

/**
 * Chooses the real SharePoint/Graph backend when the host provides a site URL
 * and clients, and falls back to mocks otherwise — so the workbench renders
 * without a provisioned list.
 */
export function createKudosServices(options: IKudosServiceOptions): IKudosServices {
  const { spHttpClient, graph, webAbsoluteUrl, currentUser, forceMock } = options;

  if (forceMock || !webAbsoluteUrl || !spHttpClient || !currentUser) {
    return { kudos: new MockKudosService(), people: new MockPeopleService() };
  }

  return {
    kudos: new SpKudosService(spHttpClient, webAbsoluteUrl, currentUser),
    people: graph ? new GraphPeopleService(graph, webAbsoluteUrl) : new MockPeopleService(),
  };
}
