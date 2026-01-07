// ALIGNMENT Design System - Spacing & Layout

export const spacing = {
  none: 0,
  '2xs': 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
  '7xl': 96,
  '8xl': 128,
};

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  base: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

export const iconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
};

// Screen padding
export const screenPadding = {
  horizontal: spacing.xl,
  vertical: spacing.lg,
  top: spacing['3xl'],
  bottom: spacing['4xl'],
};

// Card dimensions
export const cardDimensions = {
  swipeCard: {
    width: '100%',
    height: 420,
    borderRadius: borderRadius['2xl'],
  },
  matchCard: {
    width: '100%',
    height: 480,
    borderRadius: borderRadius['2xl'],
  },
  slotCard: {
    width: '100%',
    height: 140,
    borderRadius: borderRadius.xl,
  },
};

// Animation durations (in ms)
export const durations = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 800,
  slowest: 1200,
  reveal: 2000,
  dramatic: 3000,
};

// Z-index layers
export const zIndex = {
  base: 0,
  card: 10,
  overlay: 20,
  modal: 30,
  toast: 40,
  tooltip: 50,
};
