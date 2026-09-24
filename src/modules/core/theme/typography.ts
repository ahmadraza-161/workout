import type { TextStyle } from 'react-native';

// Poppins font files are bundled in assets/fonts and loaded in app/_layout.tsx
// (ADR-026). Each weight is a separate family name on Android.
export const fontFiles = {
  'Poppins-Regular': require('../../../../assets/fonts/Poppins-Regular.ttf'),
  'Poppins-Medium': require('../../../../assets/fonts/Poppins-Medium.ttf'),
  'Poppins-SemiBold': require('../../../../assets/fonts/Poppins-SemiBold.ttf'),
  'Poppins-Bold': require('../../../../assets/fonts/Poppins-Bold.ttf'),
  'Poppins-ExtraBold': require('../../../../assets/fonts/Poppins-ExtraBold.ttf'),
} as const;

export type FontWeight = 400 | 500 | 600 | 700 | 800;

const FAMILY_BY_WEIGHT: Record<FontWeight, keyof typeof fontFiles> = {
  400: 'Poppins-Regular',
  500: 'Poppins-Medium',
  600: 'Poppins-SemiBold',
  700: 'Poppins-Bold',
  800: 'Poppins-ExtraBold',
};

interface TypeToken {
  size: number;
  weight: FontWeight;
  lineHeight: number;
  letterSpacing?: number;
  uppercase?: boolean;
  /** Caps growth from system font scaling (DESIGN §3). Omitted = unlimited. */
  maxScale?: number;
}

// Type scale from DOC/DESIGN.md §3.
export const typeScale = {
  displayXL: { size: 64, weight: 800, lineHeight: 72, maxScale: 1 },
  metricXL: { size: 56, weight: 800, lineHeight: 64, maxScale: 1 },
  displayL: { size: 32, weight: 800, lineHeight: 38, letterSpacing: 0.5, uppercase: true, maxScale: 1.2 },
  h1: { size: 26, weight: 700, lineHeight: 32 },
  cardTitle: { size: 26, weight: 800, lineHeight: 30, letterSpacing: 0.3, uppercase: true, maxScale: 1.2 },
  tabHeader: { size: 24, weight: 800, lineHeight: 30, letterSpacing: 0.5, uppercase: true, maxScale: 1.2 },
  h2: { size: 22, weight: 700, lineHeight: 28 },
  h3: { size: 19, weight: 700, lineHeight: 25 },
  guideHeading: { size: 18, weight: 800, lineHeight: 24, letterSpacing: 0.3, uppercase: true },
  button: { size: 18, weight: 700, lineHeight: 24, letterSpacing: 0.2 },
  statValue: { size: 28, weight: 700, lineHeight: 34 },
  listTitle: { size: 17, weight: 500, lineHeight: 24 },
  title: { size: 16, weight: 600, lineHeight: 22 },
  body: { size: 15, weight: 400, lineHeight: 22 },
  bodyStrong: { size: 15, weight: 600, lineHeight: 22 },
  buttonSm: { size: 15, weight: 800, lineHeight: 20, letterSpacing: 0.5, uppercase: true },
  caption: { size: 13, weight: 400, lineHeight: 18 },
  captionSm: { size: 12, weight: 500, lineHeight: 16 },
  micro: { size: 11, weight: 700, lineHeight: 14, letterSpacing: 0.6, uppercase: true },
} as const satisfies Record<string, TypeToken>;

export type TextVariant = keyof typeof typeScale;

export function textStyleFor(variant: TextVariant): TextStyle {
  const token: TypeToken = typeScale[variant];
  return {
    fontFamily: FAMILY_BY_WEIGHT[token.weight],
    fontSize: token.size,
    lineHeight: token.lineHeight,
    letterSpacing: token.letterSpacing ?? 0,
    textTransform: token.uppercase ? 'uppercase' : 'none',
  };
}

export function maxScaleFor(variant: TextVariant): number | undefined {
  const token: TypeToken = typeScale[variant];
  return token.maxScale;
}
