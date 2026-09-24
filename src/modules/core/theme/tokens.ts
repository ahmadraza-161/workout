// Spacing, radius, size, elevation and motion tokens (DOC/DESIGN.md §5.3, §10, §11).

export const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999,
} as const;

export const sizes = {
  touchMin: 48,
  buttonLg: 56,
  buttonMd: 48,
  buttonSm: 36,
  iconButton: 40,
  iconSm: 16,
  iconMd: 20,
  iconLg: 24,
  iconXl: 28,
  chip: 36,
  quickChip: 44,
  searchBar: 48,
  segmented: 44,
  thumbSm: 56,
  thumbMd: 64,
  thumbLg: 88,
  avatar: 48,
  tabBar: 64,
  header: 56,
  playerControl: 72,
  timerRing: 120,
  timerRingStroke: 6,
  screenPadding: 16,
  sectionGap: 28,
} as const;

// Android elevation levels. The reference design is flat: cards use none.
export const elevation = { none: 0, sm: 1, md: 4, lg: 12 } as const;

export const motion = {
  duration: { instant: 100, fast: 150, base: 250, sheet: 300, slow: 400 },
  // cubic-bezier control points, for Reanimated's Easing.bezier(...)
  easing: {
    standard: [0.2, 0, 0, 1],
    decelerate: [0, 0, 0, 1],
    accelerate: [0.3, 0, 1, 1],
  },
} as const;
