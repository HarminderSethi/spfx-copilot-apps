import {
  createLightTheme,
  createDarkTheme,
  type BrandVariants,
  type Theme,
} from '@fluentui/react-components';

export const brandRamp: BrandVariants = {
  10: '#04120f',
  20: '#06231e',
  30: '#08302a',
  40: '#0a4038',
  50: '#0c5146',
  60: '#0e6355',
  70: '#107563',
  80: '#148a75',
  90: '#2d9e8a',
  100: '#4cb0a0',
  110: '#6fc1b4',
  120: '#92d0c6',
  130: '#b3dfd8',
  140: '#d0eae6',
  150: '#e4f4f1',
  160: '#f3faf9',
};

export const lightTheme: Theme = createLightTheme(brandRamp);
export const darkTheme: Theme = createDarkTheme(brandRamp);

export function getBrandTheme(isInverted: boolean): Theme {
  return isInverted ? darkTheme : lightTheme;
}
