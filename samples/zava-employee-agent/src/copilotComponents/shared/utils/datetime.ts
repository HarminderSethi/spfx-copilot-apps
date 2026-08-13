const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export const formatTime = (date: Date, locale?: string): string =>
  date.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' });

export const formatFullDate = (date: Date, locale?: string): string =>
  date.toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

export const formatShortDate = (date: Date, locale?: string): string =>
  date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });

export const formatTimeUntil = (date: Date, now: Date = new Date()): string => {
  const difference = date.getTime() - now.getTime();
  const absolute = Math.abs(difference);
  const future = difference >= 0;

  if (absolute < MINUTE_MS) {
    return future ? 'now' : 'just now';
  }
  if (absolute < HOUR_MS) {
    const minutes = Math.round(absolute / MINUTE_MS);
    return future ? `in ${minutes} min` : `${minutes} min ago`;
  }
  if (absolute < DAY_MS) {
    const hours = Math.round(absolute / HOUR_MS);
    return future ? `in ${hours} h` : `${hours} h ago`;
  }

  const days = Math.round(absolute / DAY_MS);
  return future ? `in ${days} d` : `${days} d ago`;
};

export const formatDateRange = (start: Date, end: Date, locale?: string): string =>
  `${formatShortDate(start, locale)} - ${formatShortDate(end, locale)}`;