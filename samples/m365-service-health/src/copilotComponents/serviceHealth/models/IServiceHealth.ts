/** Normalized severity used for colors, icons, sorting, and grouping. */
export type ServiceHealthSeverity = 'healthy' | 'advisory' | 'incident' | 'unknown';

export interface IServiceHealthIssuePost {
  createdDateTime?: string;
  postType?: string;
  description?: { contentType?: string; content?: string };
}

export interface IServiceHealthIssue {
  id?: string;
  service?: string;
  title?: string;
  classification?: string;
  severity: ServiceHealthSeverity;
  impactDescription?: string;
  lastModifiedDateTime?: string;
  startDateTime?: string;
  endDateTime?: string;
  origin?: string;
  status?: string;
  feature?: string;
  featureGroup?: string;
  posts?: IServiceHealthIssuePost[];
  isResolved?: boolean;
}

export interface IServiceHealthItem {
  /** Graph `healthOverviews` key, used to fetch issues for the service. */
  id: string;
  service: string;
  status?: string;
  severity: ServiceHealthSeverity;
}

export interface IServiceHealthResponse {
  /** The service the caller asked for, or `all`. */
  requestedService: string;
  /** Set when a specific service was requested but no Graph service matched it. */
  unmatchedService?: string;
  items: IServiceHealthItem[];
  generatedAt: string;
}

export type ServiceHealthErrorKind = 'forbidden' | 'unauthenticated' | 'throttled' | 'network' | 'unknown';

export class ServiceHealthError extends Error {
  public constructor(
    public readonly kind: ServiceHealthErrorKind,
    message: string
  ) {
    super(message);
    this.name = 'ServiceHealthError';
    // Required so `instanceof` works after TypeScript downlevels the class.
    Object.setPrototypeOf(this, ServiceHealthError.prototype);
  }
}
