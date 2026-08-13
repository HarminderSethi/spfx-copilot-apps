import { ZAVA_FAMILIES } from '../models/families';
import { getZavaFamilyTheme } from './familyThemes';

describe('family themes', () => {
  test('assigns one distinct theme variant to every family', () => {
    const variants = ZAVA_FAMILIES.map((family) => family.themeVariant);
    expect(new Set(variants).size).toBe(ZAVA_FAMILIES.length);
  });

  test('provides a unique same-hue gradient and accent for every family', () => {
    const themes = ZAVA_FAMILIES.map((family) => getZavaFamilyTheme(family.themeVariant));
    expect(new Set(themes.map((theme) => theme.accentColor)).size).toBe(ZAVA_FAMILIES.length);
    expect(new Set(themes.map((theme) => theme.heroGradient)).size).toBe(ZAVA_FAMILIES.length);
    themes.forEach((theme) => {
      expect(theme.heroGradient).toContain('color-mix(in srgb');
      expect(theme.heroGradient).toContain(theme.accentColor);
      expect(theme.heroGradient).toContain(theme.darkColor);
      expect(theme.heroGradient).toContain(theme.lightColor);
    });
  });
});