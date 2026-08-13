import type {
  ZavaCurrency,
  ZavaJurisdiction
} from '../models/zavaEmployee';

const JURISDICTION_LABELS: { [key in ZavaJurisdiction]: string } = {
  FI: 'Finland · EU policy',
  SE: 'Sweden · EU policy',
  US: 'United States · US policy'
};

export const formatZavaCurrency = (
  value: number,
  currency: ZavaCurrency,
  locale?: string
): string => new Intl.NumberFormat(locale || 'en-US', {
  style: 'currency',
  currency,
  maximumFractionDigits: 0
}).format(value);

export const getJurisdictionLabel = (jurisdiction: ZavaJurisdiction): string =>
  JURISDICTION_LABELS[jurisdiction];