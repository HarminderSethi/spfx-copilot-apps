import {
  advanceHomePropertiesVersion,
  DEFAULT_HOME_PROPERTIES,
  getHomePropertiesSignature,
  normalizeHomeProperties
} from './normalizeHomeProperties';

describe('normalizeHomeProperties', () => {
  test('uses deterministic defaults for absent input', () => {
    expect(normalizeHomeProperties(undefined)).toEqual(DEFAULT_HOME_PROPERTIES);
  });

  test('accepts a complete valid prompt contract', () => {
    expect(normalizeHomeProperties({
      view: 'actions',
      period: 'today',
      focusArea: 'learning',
      includeSensitive: true,
      locale: 'fi-FI',
      privacyLevel: 'private'
    })).toEqual({
      view: 'actions',
      period: 'today',
      focusArea: 'learning',
      includeSensitive: true,
      locale: 'fi-FI',
      privacyLevel: 'private'
    });
  });

  test('falls back per field without discarding other valid prompt values', () => {
    expect(normalizeHomeProperties({
      view: 'unknown',
      period: 'month',
      includeSensitive: 'yes'
    })).toEqual({
      ...DEFAULT_HOME_PROPERTIES,
      period: 'month'
    });
  });

  test('produces a stable signature that changes with prompt values', () => {
    const summary = normalizeHomeProperties({ view: 'summary' });
    const profile = normalizeHomeProperties({ view: 'profile' });
    expect(getHomePropertiesSignature(summary)).toBe(getHomePropertiesSignature({ ...summary }));
    expect(getHomePropertiesSignature(profile)).not.toBe(getHomePropertiesSignature(summary));
  });

  test('advances only when normalized prompt properties change', () => {
    const summary = normalizeHomeProperties({ view: 'summary' });
    const first = advanceHomePropertiesVersion(undefined, 0, summary);
    const passiveRender = advanceHomePropertiesVersion(first.signature, first.version, summary);
    const nextPrompt = advanceHomePropertiesVersion(
      passiveRender.signature,
      passiveRender.version,
      normalizeHomeProperties({ view: 'actions' })
    );
    expect(first.version).toBe(1);
    expect(passiveRender.version).toBe(1);
    expect(nextPrompt.version).toBe(2);
  });
});