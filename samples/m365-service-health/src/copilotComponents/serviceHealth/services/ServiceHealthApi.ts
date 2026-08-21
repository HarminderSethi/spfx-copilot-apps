import type { MSGraphClientFactory, MSGraphClientV3 } from '@microsoft/sp-http';

import {
  ServiceHealthError,
  type IServiceHealthIssue,
  type IServiceHealthItem,
  type IServiceHealthResponse,
  type ServiceHealthErrorKind
} from '../models';
import { resolveServiceName } from './resolveServiceName';
import { compareSeverity, getIssueSeverity, getServiceSeverity } from './serviceStatus';

const HEALTH_OVERVIEWS_PATH = '/admin/serviceAnnouncement/healthOverviews';
const RETRYABLE_STATUS_CODES = [429, 500, 502, 503, 504];
const MAX_ATTEMPTS = 3;
const BASE_RETRY_DELAY_MS = 600;

// Token acquisition fails before any HTTP exchange, so it surfaces without a usable status code.
const AUTH_FAILURE_PATTERN = /AADSTS|invalid_client|invalid_grant|unauthorized_client|interaction_required|consent_required/i;

interface IGraphErrorLike {
  statusCode?: number;
  code?: string;
  message?: string;
}

function readStatusCode(error: unknown): number | undefined {
  const candidate = error as IGraphErrorLike | undefined;
  return typeof candidate?.statusCode === 'number' ? candidate.statusCode : undefined;
}

function toServiceHealthError(error: unknown): ServiceHealthError {
  if (error instanceof ServiceHealthError) {
    return error;
  }

  const statusCode = readStatusCode(error);
  const kindByStatus: Readonly<Record<number, ServiceHealthErrorKind>> = {
    401: 'unauthenticated',
    403: 'forbidden',
    429: 'throttled'
  };
  const message = error instanceof Error ? error.message : String(error);
  const hasHttpStatus = statusCode !== undefined && statusCode >= 0;

  let kind: ServiceHealthErrorKind;
  if (AUTH_FAILURE_PATTERN.test(message)) {
    kind = 'unauthenticated';
  } else if (!hasHttpStatus) {
    kind = 'network';
  } else {
    kind = kindByStatus[statusCode as number] || 'unknown';
  }

  // The UI only shows a generic sentence, so keep the underlying Graph failure diagnosable.
  console.error('[ServiceHealth] Graph request failed', { kind, statusCode, message, error });

  return new ServiceHealthError(kind, message);
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function withRetry<TResult>(operation: () => Promise<TResult>): Promise<TResult> {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const statusCode = readStatusCode(error);
      const isRetryable = statusCode !== undefined && RETRYABLE_STATUS_CODES.indexOf(statusCode) >= 0;

      if (!isRetryable || attempt === MAX_ATTEMPTS - 1) {
        break;
      }

      await delay(BASE_RETRY_DELAY_MS * Math.pow(2, attempt));
    }
  }

  throw toServiceHealthError(lastError);
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function toHealthItem(raw: unknown): IServiceHealthItem | undefined {
  const record = asRecord(raw);
  const service = asString(record.service) || asString(record.id);
  if (!service) {
    return undefined;
  }

  const status = asString(record.status);

  return {
    id: asString(record.id) || service,
    service,
    status,
    severity: getServiceSeverity(status)
  };
}

function toIssue(raw: unknown, fallbackService: string): IServiceHealthIssue {
  const record = asRecord(raw);
  const isResolved = typeof record.isResolved === 'boolean' ? record.isResolved : undefined;
  const classification = asString(record.classification);
  const posts = Array.isArray(record.posts)
    ? record.posts.map((post) => {
        const postRecord = asRecord(post);
        const description = asRecord(postRecord.description);
        return {
          createdDateTime: asString(postRecord.createdDateTime),
          postType: asString(postRecord.postType),
          description: {
            contentType: asString(description.contentType),
            content: asString(description.content)
          }
        };
      })
    : undefined;

  return {
    id: asString(record.id),
    service: asString(record.service) || fallbackService,
    title: asString(record.title),
    classification,
    severity: getIssueSeverity(classification, isResolved),
    impactDescription: asString(record.impactDescription),
    lastModifiedDateTime: asString(record.lastModifiedDateTime),
    startDateTime: asString(record.startDateTime),
    endDateTime: asString(record.endDateTime),
    origin: asString(record.origin),
    status: asString(record.status),
    feature: asString(record.feature),
    featureGroup: asString(record.featureGroup),
    posts,
    isResolved
  };
}

export class ServiceHealthApi {
  private clientPromise: Promise<MSGraphClientV3> | undefined;

  public constructor(private readonly graphClientFactory: MSGraphClientFactory) {}

  /**
   * Loads the status of every Microsoft 365 service. Issues are fetched lazily
   * per service so the first paint stays small.
   */
  public async getServiceHealth(requestedService: string): Promise<IServiceHealthResponse> {
    const client = await this.getClient();
    const response = await withRetry(async () => client.api(HEALTH_OVERVIEWS_PATH).get());

    const value = asRecord(response).value;
    const rawItems = Array.isArray(value) ? (value as unknown[]) : [];
    const items = rawItems
      .map(toHealthItem)
      .filter((item): item is IServiceHealthItem => item !== undefined)
      .sort((first, second) => compareSeverity(first.severity, second.severity) || first.service.localeCompare(second.service));

    const normalizedRequest = requestedService.trim();
    const wantsSpecificService = normalizedRequest.length > 0 && normalizedRequest.toLowerCase() !== 'all';

    if (!wantsSpecificService) {
      return { requestedService: 'all', items, generatedAt: new Date().toISOString() };
    }

    const match = resolveServiceName(normalizedRequest, items, (item) => item.service);

    return {
      requestedService: match?.service || normalizedRequest,
      unmatchedService: match ? undefined : normalizedRequest,
      items: match ? [match] : items,
      generatedAt: new Date().toISOString()
    };
  }

  /** Loads the issue history for a single service. */
  public async getServiceIssues(serviceId: string): Promise<IServiceHealthIssue[]> {
    const client = await this.getClient();
    const path = `${HEALTH_OVERVIEWS_PATH}/${encodeURIComponent(serviceId)}`;
    const response = await withRetry(async () => client.api(path).expand('issues').get());

    const issues = asRecord(response).issues;
    const rawIssues = Array.isArray(issues) ? (issues as unknown[]) : [];

    return rawIssues.map((issue) => toIssue(issue, serviceId));
  }

  private async getClient(): Promise<MSGraphClientV3> {
    if (!this.clientPromise) {
      this.clientPromise = this.graphClientFactory.getClient('3').catch((error: unknown) => {
        this.clientPromise = undefined;
        throw toServiceHealthError(error);
      });
    }

    return this.clientPromise;
  }
}