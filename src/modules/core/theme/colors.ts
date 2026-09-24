// Colour tokens from DOC/DESIGN.md §2 (light) and §8.1 (dark).
// Values marked AA in the design doc were adjusted from the reference to pass
// WCAG AA contrast (ADR-027) – do not "fix" them back to the reference values.

export type ColorScheme = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  primaryFill: string;
  primaryPressed: string;
  primarySoft: string;
  primaryTint: string;
  primaryBorderSoft: string;
  onPrimary: string;
  ringProgress: string;
  restBg: string;
  flame: string;
  tagBg: string;
  tagText: string;
  statIcon: string;
  bg: { page: string; plain: string };
  surface: {
    default: string;
    muted: string;
    row: string;
    bubble: string;
    picker: string;
    stage: string;
  };
  text: {
    primary: string;
    strong: string;
    body: string;
    subtle: string;
    secondary: string;
    tertiary: string;
  };
  line: { divider: string; grid: string; rulerTick: string; ringTrack: string };
  boltOff: string;
  muscle: { base: string; primary: string; secondary: string };
  control: {
    bg: string;
    bgStrong: string;
    iconButton: string;
    secondary: string;
    secondaryTinted: string;
    close: string;
    closeIcon: string;
    restAction: string;
    restPill: string;
  };
  level: { beginner: string; intermediate: string; advanced: string };
  semantic: {
    success: string;
    successText: string;
    warning: string;
    warningText: string;
    error: string;
    errorText: string;
  };
  scrim: string;
}

export const lightColors: ThemeColors = {
  primary: '#004BFF',
  primaryFill: '#004BFF',
  primaryPressed: '#003BCC',
  primarySoft: '#E9EDF8',
  primaryTint: '#E7EEFF',
  primaryBorderSoft: '#CCDBFF',
  onPrimary: '#FFFFFF',
  ringProgress: '#0074FF',
  restBg: '#005DFF',
  flame: '#FF4762',
  tagBg: '#FEF0D3',
  tagText: '#22140C',
  statIcon: '#98B7FF',
  bg: { page: '#F8F8F8', plain: '#FFFFFF' },
  surface: {
    default: '#FFFFFF',
    muted: '#EFF0F2',
    row: '#F7F7F9',
    bubble: '#F0F0F0',
    picker: '#F3F4F6',
    stage: '#FAFAFA',
  },
  text: {
    primary: '#000000',
    strong: '#1D2025',
    body: '#3F3F3F',
    subtle: '#575E6E',
    secondary: '#6B6B6B',
    tertiary: '#949494',
  },
  line: { divider: '#E2E2E2', grid: '#E8E9EB', rulerTick: '#CCCCCE', ringTrack: '#EEEEEE' },
  boltOff: '#DFDFDF',
  muscle: { base: '#CBCBCD', primary: '#004BFF', secondary: '#8FB3FF' },
  control: {
    bg: '#F4F4F4',
    bgStrong: '#EEEEEE',
    iconButton: '#F1F1F1',
    secondary: '#F6F6F6',
    secondaryTinted: '#E2E6F2',
    close: '#E5E5E5',
    closeIcon: '#3F3F3F',
    restAction: '#3370FF',
    restPill: '#266CFF',
  },
  level: { beginner: '#004BFF', intermediate: '#BE5901', advanced: '#DB3931' },
  semantic: {
    success: '#12B76A',
    successText: '#0D864E',
    warning: '#F79009',
    warningText: '#AE6506',
    error: '#F04438',
    errorText: '#D92D20',
  },
  scrim: 'rgba(0,0,0,0.60)',
};

export const darkColors: ThemeColors = {
  ...lightColors,
  primary: '#6E9BFF',
  primarySoft: '#1A2A4D',
  primaryTint: '#1A2A4D',
  primaryBorderSoft: '#2B4A8F',
  bg: { page: '#0E1014', plain: '#0E1014' },
  surface: {
    default: '#171A21',
    muted: '#20242D',
    row: '#1A1D25',
    bubble: '#20242D',
    picker: '#20242D',
    stage: '#151820',
  },
  text: {
    primary: '#F2F4F7',
    strong: '#E6E8EC',
    body: '#D0D4DB',
    subtle: '#B4BAC4',
    secondary: '#A0A6B1',
    tertiary: '#6F7682',
  },
  line: { divider: '#2A2F3A', grid: '#262B35', rulerTick: '#3A404C', ringTrack: '#2A2F3A' },
  boltOff: '#3A404C',
  muscle: { base: '#3A404C', primary: '#6E9BFF', secondary: '#3D5FA8' },
  control: {
    ...lightColors.control,
    bg: '#20242D',
    bgStrong: '#262B35',
    iconButton: 'rgba(255,255,255,0.08)',
    secondary: '#262B35',
    secondaryTinted: '#262B35',
    close: '#2A2F3A',
    closeIcon: '#E6E8EC',
  },
  level: { beginner: '#6E9BFF', intermediate: '#FF9A4D', advanced: '#FF6B64' },
  semantic: {
    ...lightColors.semantic,
    successText: '#12B76A',
    warningText: '#F79009',
    errorText: '#F04438',
  },
  scrim: 'rgba(0,0,0,0.70)',
};

export type GradientStops = readonly [string, string];

// Theme-independent gradients (DESIGN §2.1, §2.5, §2.6).
export const gradients = {
  cta: ['#12DDFE', '#014CFF'],
  button: ['#0071FE', '#004DFF'],
  create: ['#0092FF', '#0551FF'],
  darkTile: ['#2E3548', '#2D3245'],
  finishLight: ['#EFF3FF', '#EBF1FF'],
  finishDark: ['#131827', '#101521'],
} as const satisfies Record<string, GradientStops>;

// Challenge & artwork gradients: start = text side (≥ 4.5:1 with white),
// end = artwork side (≥ 3:1 with white).
export const challengeGradients = {
  blue: ['#016EF9', '#004DFF'],
  orange: ['#CD4D07', '#F8681A'],
  cyan: ['#017CC0', '#019BF0'],
  purple: ['#8F36CE', '#6819A1'],
  violet: ['#6D4AFF', '#4B2BD1'],
  slate: ['#2E5579', '#305277'],
  green: ['#328374', '#3C9F8C'],
  teal: ['#01838C', '#01A4B0'],
  red: ['#E12D33', '#E5484D'],
  amber: ['#A86700', '#D38200'],
  mint: ['#208755', '#28A86A'],
  indigo: ['#3D317A', '#3B2E74'],
} as const satisfies Record<string, GradientStops>;

export type ChallengeGradientName = keyof typeof challengeGradients;

// BMI scale segments (DESIGN §2.6), lighter → darker.
export const bmiScale = [
  { from: 15, to: 16, stops: ['#5378E3', '#2438CA'] },
  { from: 16, to: 18.5, stops: ['#7EA7F9', '#3778F6'] },
  { from: 18.5, to: 25, stops: ['#6FDAD2', '#5BC5DD'] },
  { from: 25, to: 30, stops: ['#FCE48A', '#F7CC48'] },
  { from: 30, to: 35, stops: ['#F5C887', '#F0983A'] },
  { from: 35, to: 40, stops: ['#ED6E83', '#EA353E'] },
] as const;
