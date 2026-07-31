const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function toDate(value: string | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? undefined : parsed;
}

export function formatDateTime(value: string | undefined): string | undefined {
  const parsed = toDate(value);

  return parsed?.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

export function formatTime(value: string | undefined): string | undefined {
  const parsed = toDate(value);

  return parsed?.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

type RelativeUnit = 'minute' | 'hour' | 'day';

interface IRelativeTimeFormat {
  format(value: number, unit: RelativeUnit): string;
}

// `Intl.RelativeTimeFormat` is ES2020; the SPFx `lib` target predates it.
const relativeTimeFormatCtor = (Intl as unknown as {
  RelativeTimeFormat?: new (locale?: string, options?: { numeric?: 'auto' | 'always' }) => IRelativeTimeFormat;
}).RelativeTimeFormat;

/** Returns a short "2 hours ago" style label, falling back to an absolute date. */
export function formatRelativeTime(value: string | undefined): string | undefined {
  const parsed = toDate(value);
  if (!parsed) {
    return undefined;
  }

  const elapsed = Date.now() - parsed.valueOf();
  if (!relativeTimeFormatCtor || elapsed < 0 || elapsed >= 7 * DAY) {
    return formatDateTime(value);
  }

  let unit: RelativeUnit = 'minute';
  let amount = Math.round(elapsed / MINUTE);

  if (elapsed >= DAY) {
    unit = 'day';
    amount = Math.round(elapsed / DAY);
  } else if (elapsed >= HOUR) {
    unit = 'hour';
    amount = Math.round(elapsed / HOUR);
  }

  return new relativeTimeFormatCtor(undefined, { numeric: 'auto' }).format(-Math.max(amount, 1), unit);
}

export function sortByDateDescending(first: string | undefined, second: string | undefined): number {
  return (toDate(second)?.valueOf() ?? 0) - (toDate(first)?.valueOf() ?? 0);
}
