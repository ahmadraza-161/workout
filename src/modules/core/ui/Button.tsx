import type { ComponentType } from 'react';
import { ChevronRight, CircleArrowRight } from 'lucide-react-native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { gradients, radius, sizes, useTheme } from '../theme';
import { GradientBackground } from './GradientBackground';
import { Text } from './Text';
import { Touchable } from './Touchable';

// Button variants from DOC/DESIGN.md §4.1. Round icon-only buttons live in
// IconButton, which keeps this file to labelled buttons and links.
//
//   cta       – Start on workout details: cyan-to-blue gradient
//   primary   – Done, Save, Keep exercising, Close: blue gradient
//   secondary – Cancel, Restart: neutral fill
//   small     – Log, Edit, Import: 36 dp brand pill
//   cardCta   – START DAY 1, GO: white pill on a gradient card
//   textLink  – More, View all, All records: brand label + chevron
//   plainLink – Do it later, Skip: underlined neutral label
export type ButtonVariant =
  | 'cta'
  | 'primary'
  | 'secondary'
  | 'small'
  | 'cardCta'
  | 'textLink'
  | 'plainLink';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: ComponentType<{ size?: number; color?: string }>;
  /**
   * Card CTAs take their label colour from the card's gradient start, so the
   * text always reads against the white pill.
   */
  accentColor?: string;
  accessibilityLabel?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon: Icon,
  accentColor,
  accessibilityLabel,
}: ButtonProps) {
  const { colors } = useTheme();

  if (variant === 'textLink' || variant === 'plainLink') {
    const isText = variant === 'textLink';
    return (
      <Touchable
        onPress={onPress}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel ?? label}
      >
        <View style={styles.linkRow}>
          <Text
            variant="body"
            tone={isText ? 'brand' : 'primary'}
            style={isText ? undefined : styles.underline}
          >
            {label}
          </Text>
          {isText ? <ChevronRight size={18} color={colors.primary} /> : null}
        </View>
      </Touchable>
    );
  }

  const isSmall = variant === 'small';
  const isCardCta = variant === 'cardCta';
  const textColor = isCardCta
    ? (accentColor ?? colors.primary)
    : variant === 'secondary'
      ? colors.text.primary
      : colors.onPrimary;

  return (
    <Touchable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      style={[
        styles.base,
        isSmall ? styles.small : isCardCta ? styles.cardCta : styles.large,
        variant === 'secondary' && { backgroundColor: colors.control.secondary },
        isSmall && { backgroundColor: colors.primaryFill },
      ]}
    >
      {variant === 'cta' ? <GradientBackground stops={gradients.cta} angle={90} /> : null}
      {variant === 'primary' ? <GradientBackground stops={gradients.button} angle={90} /> : null}

      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.content}>
          {Icon ? <Icon size={isSmall ? 18 : 22} color={textColor} /> : null}
          <Text
            variant={isSmall ? 'bodyStrong' : isCardCta ? 'buttonSm' : 'button'}
            style={{ color: textColor }}
          >
            {label}
          </Text>
          {isCardCta ? <CircleArrowRight size={22} color={textColor} /> : null}
        </View>
      )}
    </Touchable>
  );
}

const styles = StyleSheet.create({
  base: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  large: { height: sizes.buttonLg, borderRadius: radius.pill, paddingHorizontal: 24 },
  small: { height: sizes.buttonSm, borderRadius: radius.md, paddingHorizontal: 20 },
  cardCta: {
    height: sizes.buttonMd,
    borderRadius: radius.pill,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  linkRow: { flexDirection: 'row', alignItems: 'center', minHeight: sizes.touchMin, gap: 2 },
  underline: { textDecorationLine: 'underline' },
});
