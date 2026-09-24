import type { ComponentType } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { gradients, radius, sizes, useTheme } from '../theme';
import { GradientBackground } from './GradientBackground';
import { Text } from './Text';

// Button variants from DOC/DESIGN.md §4.1.
export type ButtonVariant = 'cta' | 'primary' | 'secondary' | 'small';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: ComponentType<{ size?: number; color?: string }>;
  accessibilityLabel?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon: Icon,
  accessibilityLabel,
}: ButtonProps) {
  const { colors } = useTheme();
  const isSmall = variant === 'small';
  const onFill = variant !== 'secondary';
  const textColor = onFill ? colors.onPrimary : colors.text.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isSmall ? styles.small : styles.large,
        variant === 'secondary' && { backgroundColor: colors.control.secondary },
        isSmall && { backgroundColor: colors.primaryFill },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {variant === 'cta' && <GradientBackground stops={gradients.cta} angle={90} />}
      {variant === 'primary' && <GradientBackground stops={gradients.button} angle={90} />}
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.content}>
          {Icon ? <Icon size={isSmall ? 18 : 22} color={textColor} /> : null}
          <Text variant={isSmall ? 'bodyStrong' : 'button'} style={{ color: textColor }}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  large: { height: sizes.buttonLg, borderRadius: radius.pill, paddingHorizontal: 24 },
  small: { height: sizes.buttonSm, borderRadius: radius.md, paddingHorizontal: 20 },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.4 },
});
