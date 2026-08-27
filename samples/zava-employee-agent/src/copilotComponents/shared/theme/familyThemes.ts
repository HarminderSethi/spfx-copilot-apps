import { tokens } from '@fluentui/react-theme';

import type { ZavaFamilyThemeVariant } from '../models/families';

export interface IZavaFamilyTheme {
  accentColor: string;
  darkColor: string;
  lightColor: string;
  foregroundColor: string;
  subtleBackgroundColor: string;
  heroGradient: string;
}

const createFamilyTheme = (
  accentColor: string,
  foregroundColor: string,
  subtleBackgroundColor: string
): IZavaFamilyTheme => {
  const darkColor = `color-mix(in srgb, ${accentColor} 40%, ${tokens.colorNeutralForeground1Static})`;
  const lightColor = `color-mix(in srgb, ${accentColor} 48%, ${tokens.colorNeutralForegroundStaticInverted})`;
  return {
    accentColor,
    darkColor,
    lightColor,
    foregroundColor,
    subtleBackgroundColor,
    heroGradient: `linear-gradient(120deg, ${darkColor} 0%, ${darkColor} 52%, ${accentColor} 78%, ${lightColor} 100%)`
  };
};

export const ZAVA_FAMILY_THEMES: Readonly<Record<ZavaFamilyThemeVariant, IZavaFamilyTheme>> = {
  home: createFamilyTheme(tokens.colorBrandBackgroundStatic, tokens.colorBrandForeground1, tokens.colorBrandBackground2),
  time: createFamilyTheme(tokens.colorPaletteTealBorderActive, tokens.colorPaletteTealForeground2, tokens.colorPaletteTealBackground2),
  money: createFamilyTheme(tokens.colorPaletteGreenBorderActive, tokens.colorPaletteGreenForeground2, tokens.colorPaletteGreenBackground2),
  benefits: createFamilyTheme(tokens.colorPaletteBlueBorderActive, tokens.colorPaletteBlueForeground2, tokens.colorPaletteBlueBackground2),
  rewards: createFamilyTheme(tokens.colorPaletteGoldBorderActive, tokens.colorPaletteGoldForeground2, tokens.colorPaletteGoldBackground2),
  policy: createFamilyTheme(tokens.colorPalettePurpleBorderActive, tokens.colorPalettePurpleForeground2, tokens.colorPalettePurpleBackground2),
  support: createFamilyTheme(tokens.colorPaletteCranberryBorderActive, tokens.colorPaletteCranberryForeground2, tokens.colorPaletteCranberryBackground2),
  learning: createFamilyTheme(tokens.colorPaletteCornflowerBorderActive, tokens.colorPaletteCornflowerForeground2, tokens.colorPaletteCornflowerBackground2),
  team: createFamilyTheme(tokens.colorPalettePumpkinBorderActive, tokens.colorPalettePumpkinForeground2, tokens.colorPalettePumpkinBackground2),
  people: createFamilyTheme(tokens.colorPaletteBerryBorderActive, tokens.colorPaletteBerryForeground2, tokens.colorPaletteBerryBackground2)
};

export const getZavaFamilyTheme = (variant: ZavaFamilyThemeVariant): IZavaFamilyTheme =>
  ZAVA_FAMILY_THEMES[variant];