import { getIntentDefinition } from '../mockData/intentCatalog';
import { normalizeIntentProperties, resolveIntentInvocation } from './intentInvocation';

describe('intent invocation state', () => {
  test('normalizes supported properties in deterministic key order', () => {
    expect(normalizeIntentProperties({
      status: undefined,
      projectId: 'PRJ-2601',
      amount: Number.NaN,
      projectIds: ['PRJ-2602', 'PRJ-2601'],
      nested: { unsupported: true }
    })).toEqual({
      projectId: 'PRJ-2601',
      projectIds: ['PRJ-2602', 'PRJ-2601']
    });
  });

  test('increments only for a fresh intent or normalized property change', () => {
    const definition = getIntentDefinition('GetProjectAiSpend');
    const initial = resolveIntentInvocation(definition, { period: 'month', projectId: 'PRJ-2601' }, undefined, 0);
    const passive = resolveIntentInvocation(definition, { projectId: 'PRJ-2601', period: 'month' }, initial.signature, initial.version);
    const freshProperties = resolveIntentInvocation(definition, { projectId: 'PRJ-2603', period: 'month' }, passive.signature, passive.version);
    const freshIntent = resolveIntentInvocation(getIntentDefinition('GetProjectHealth'), freshProperties.properties, freshProperties.signature, freshProperties.version);

    expect(initial.version).toBe(1);
    expect(passive.version).toBe(1);
    expect(freshProperties.version).toBe(2);
    expect(freshIntent.version).toBe(3);
  });
});