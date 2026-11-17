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
  finishIcon: 100,
  screenPadding: 16,
  sectionGap: 28,
  contentMax: 600,
  browseCard: 140,
  browseBanner: 160,
  challengeCard: 280,
  categoryTile: 110,
  categoryHero: 240,
  workoutHero: 230,
  onboardingArt: 280,
  onboardingBrand: 32,
  onboardingPortrait: 160,
  onboardingChoice: 64,
  startupLogo: 160,
  challengeTitleBlock: 128,
  challengeHero: 180,
  trainingChallengeCard: 260,
  trainingChallengeTitle: 64,
  trainingChallengeHero: 140,
  exploreBanner: 104,
} as const;

// Android elevation levels. The reference design is flat: cards use none.
export const elevation = { none: 0, sm: 1, md: 4, lg: 12 } as const;

// Reference artwork: reserve text space on heroes; contain full exercise poses.
export const artworkLayout = {
  challenge: { width: '50%', height: sizes.challengeHero, right: 0, top: 0 },
  banner: { width: '50%' },
  pose: { thumbInset: spacing[1], stageInset: spacing[6], guideInset: spacing[4], artInset: spacing[2] },
  card: { bottomInset: spacing[10] },
} as const;

// Fixed export canvas, independent of device font scaling and screen dimensions.
export const shareCardLayout = {
  width: 1080, height: 1350, padding: 96, contentWidth: 888, radius: 72,
  brandY: 160, titleY: 300, subtitleY: 380,
  statsY: 480, statsHeight: 350, statsRadius: 48,
  statX: [230, 540, 850], statValueY: 620, statLabelY: 680,
  streakY: 1010, weeklyY: 1080, footerY: 1240,
  font: { brand: 48, title: 76, subtitle: 38, value: 82, label: 32, streak: 58, weekly: 40, footer: 34 },
  circles: [{ x: 880, y: 190, radius: 260, opacity: 0.12 },
    { x: 160, y: 1170, radius: 310, opacity: 0.14 }],
} as const;

export const motion = {
  startupMinVisible: 1200,
  duration: { instant: 100, fast: 150, base: 250, sheet: 300, slow: 400 },
  // cubic-bezier control points, for Reanimated's Easing.bezier(...)
  easing: {
    standard: [0.2, 0, 0, 1],
    decelerate: [0, 0, 0, 1],
    accelerate: [0.3, 0, 1, 1],
  },
} as const;
