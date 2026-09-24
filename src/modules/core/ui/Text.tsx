import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { maxScaleFor, textStyleFor, useTheme, type TextVariant } from '../theme';

export type TextTone =
  | 'primary'
  | 'strong'
  | 'body'
  | 'subtle'
  | 'secondary'
  | 'tertiary'
  | 'brand'
  | 'onPrimary';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  tone?: TextTone;
}

export function Text({ variant = 'body', tone = 'primary', style, ...rest }: TextProps) {
  const { colors } = useTheme();
  const color =
    tone === 'brand' ? colors.primary : tone === 'onPrimary' ? colors.onPrimary : colors.text[tone];
  return (
    <RNText
      maxFontSizeMultiplier={maxScaleFor(variant)}
      style={[textStyleFor(variant), { color }, style]}
      {...rest}
    />
  );
}
