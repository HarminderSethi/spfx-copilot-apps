export type FirstDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface IUserRegionalSettings {
  dateLocale: string;
  firstDayOfWeek: FirstDayOfWeek;
  timeZone: string;
  uiLocale: string;
}

export interface IUserRegionalSettingsInput {
  browserLocale?: string;
  browserTimeZone?: string;
  dateLocale?: string;
  firstDayOfWeek?: number;
  uiLocale?: string;
}

const DEFAULT_LOCALE = "en-US";
const DEFAULT_FIRST_DAY_OF_WEEK: FirstDayOfWeek = 1;

function resolveLocale(
  preferredLocale: string | undefined,
  browserLocale: string | undefined,
): string {
  for (const locale of [preferredLocale, browserLocale, DEFAULT_LOCALE]) {
    if (!locale) {
      continue;
    }

    try {
      const canonicalLocale = new Intl.DateTimeFormat(locale)
        .resolvedOptions().locale;

      if (canonicalLocale) {
        return canonicalLocale;
      }
    } catch {
      continue;
    }
  }

  return DEFAULT_LOCALE;
}

function resolveTimeZone(timeZone: string | undefined): string {
  const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  for (const candidate of [timeZone, browserTimeZone, "UTC"]) {
    if (!candidate) {
      continue;
    }

    try {
      new Intl.DateTimeFormat(DEFAULT_LOCALE, {
        timeZone: candidate,
      }).format();
      return candidate;
    } catch {
      continue;
    }
  }

  return "UTC";
}

function resolveFirstDayOfWeek(value: number | undefined): FirstDayOfWeek {
  return Number.isInteger(value) && value !== undefined && value >= 0 && value <= 6
    ? value as FirstDayOfWeek
    : DEFAULT_FIRST_DAY_OF_WEEK;
}

export function resolveUserRegionalSettings(
  input: IUserRegionalSettingsInput,
): IUserRegionalSettings {
  const dateLocale = resolveLocale(input.dateLocale, input.browserLocale);

  return {
    dateLocale,
    firstDayOfWeek: resolveFirstDayOfWeek(input.firstDayOfWeek),
    timeZone: resolveTimeZone(input.browserTimeZone),
    uiLocale: resolveLocale(input.uiLocale, dateLocale),
  };
}
