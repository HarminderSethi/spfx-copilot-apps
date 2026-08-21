import type { IIntentDefinition, IProjectIntentProperties } from './projectPortfolio';

export type IntentTransientValue = string | number | boolean | string[] | undefined;

export interface IIntentTransientState {
  information?: {
    filter?: string;
    selectedId?: string;
  };
  review?: {
    selectedId?: string;
    statusFilter?: string;
  };
  submit?: {
    stage?: 'edit' | 'review' | 'receipt';
    values?: Record<string, string | number>;
  };
}

export interface IIntentInvocation {
  definition: IIntentDefinition;
  properties: IProjectIntentProperties;
  signature: string;
  version: number;
}

const normalizeValue = (value: unknown): IntentTransientValue => {
  if (typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) return [...value];
  return undefined;
};

export const normalizeIntentProperties = (properties: IProjectIntentProperties): IProjectIntentProperties =>
  Object.keys(properties).sort().reduce<IProjectIntentProperties>((result, key) => {
    const value = normalizeValue(properties[key]);
    if (value !== undefined) result[key] = value;
    return result;
  }, {});

export const getIntentPropertiesSignature = (
  definition: IIntentDefinition,
  properties: IProjectIntentProperties
): string => `${definition.key}|${JSON.stringify(normalizeIntentProperties(properties))}`;

export const resolveIntentInvocation = (
  definition: IIntentDefinition,
  properties: IProjectIntentProperties,
  previousSignature: string | undefined,
  currentVersion: number
): IIntentInvocation => {
  const normalizedProperties = normalizeIntentProperties(properties);
  const signature = getIntentPropertiesSignature(definition, normalizedProperties);
  return {
    definition,
    properties: normalizedProperties,
    signature,
    version: signature === previousSignature ? currentVersion : currentVersion + 1
  };
};