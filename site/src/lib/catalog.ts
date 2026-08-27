import catalogData from '../generated/catalog.json';

export const catalog = catalogData;
export type ComponentRecord = (typeof catalog.components)[number];

export function sitePath(value = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const suffix = value.replace(/^\//, '');
  return suffix ? `${base}/${suffix}` : `${base}/`;
}