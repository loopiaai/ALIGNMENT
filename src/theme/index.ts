// ALIGNMENT Design System - Main Export

export * from './colors';
export * from './typography';
export * from './spacing';

import { colors } from './colors';
import { typography, fontFamilies, fontSizes, lineHeights, letterSpacing } from './typography';
import { spacing, borderRadius, iconSizes, screenPadding, cardDimensions, durations, zIndex } from './spacing';

export const theme = {
  colors,
  typography,
  fontFamilies,
  fontSizes,
  lineHeights,
  letterSpacing,
  spacing,
  borderRadius,
  iconSizes,
  screenPadding,
  cardDimensions,
  durations,
  zIndex,
};

export type Theme = typeof theme;
