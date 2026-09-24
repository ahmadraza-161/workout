import { challengeGradients, darkColors, lightColors } from './colors';
import { contrastRatio } from './contrast';

// Guards the accessibility adjustments (ADR-027, DESIGN §9.1).
const AA_TEXT = 4.5;
const AA_LARGE = 3;

describe('colour tokens', () => {
  it('defines the same token names for light and dark themes', () => {
    const keys = (value: object): string[] =>
      Object.entries(value).flatMap(([k, v]) =>
        typeof v === 'object' ? keys(v).map((child) => `${k}.${child}`) : [k],
      );
    expect(keys(darkColors).sort()).toEqual(keys(lightColors).sort());
  });

  it.each([
    ['primary on white', lightColors.primary, lightColors.surface.default],
    ['primary on page', lightColors.primary, lightColors.bg.page],
    ['white on primary', lightColors.onPrimary, lightColors.primaryFill],
    ['white on rest panel', lightColors.onPrimary, lightColors.restBg],
    ['secondary text on white', lightColors.text.secondary, lightColors.surface.default],
    ['secondary text on page', lightColors.text.secondary, lightColors.bg.page],
    ['secondary text on list rows', lightColors.text.secondary, lightColors.surface.row],
    ['secondary text on chips', lightColors.text.secondary, lightColors.surface.muted],
    ['intermediate level on white', lightColors.level.intermediate, lightColors.surface.default],
    ['advanced level on white', lightColors.level.advanced, lightColors.surface.default],
    ['dark: text on surface', darkColors.text.primary, darkColors.surface.default],
    ['dark: secondary text on surface', darkColors.text.secondary, darkColors.surface.default],
    ['dark: primary on surface', darkColors.primary, darkColors.surface.default],
  ])('%s meets AA (4.5:1)', (_label, foreground, background) => {
    expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it.each(Object.entries(challengeGradients))(
    'challenge gradient %s: start ≥ 4.5:1 and end ≥ 3:1 with white text',
    (_name, [start, end]) => {
      expect(contrastRatio('#FFFFFF', start)).toBeGreaterThanOrEqual(AA_TEXT);
      expect(contrastRatio('#FFFFFF', end)).toBeGreaterThanOrEqual(AA_LARGE);
    },
  );
});
