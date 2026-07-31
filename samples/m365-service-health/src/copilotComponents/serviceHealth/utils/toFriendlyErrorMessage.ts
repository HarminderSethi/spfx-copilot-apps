import { ServiceHealthError } from '../models';
import type { IServiceHealthStrings } from '../models';

/** Turns any thrown value into an actionable, localized sentence for the user. */
export function toFriendlyErrorMessage(error: unknown, strings: IServiceHealthStrings): string {
  if (!(error instanceof ServiceHealthError)) {
    return strings.ErrorUnknown;
  }

  switch (error.kind) {
    case 'forbidden':
      return strings.ErrorForbidden;
    case 'unauthenticated':
      return strings.ErrorUnauthenticated;
    case 'throttled':
      return strings.ErrorThrottled;
    case 'network':
      return strings.ErrorNetwork;
    default:
      return strings.ErrorUnknown;
  }
}
