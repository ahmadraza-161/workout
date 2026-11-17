import type { ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';

import { radius, sizes, useTheme } from '../theme';
import { Text } from './Text';
import { Touchable } from './Touchable';

// One chip for every pill in the app (DESIGN §4.2):
//   tab    – Body Focus, Popular Goals: selected = soft fill + brand border
//   filter – challenge list: selected = solid brand fill
//   quick  – Training quick filters: 44 dp, radius 12, leading icon
//   focus  – exercise guide "Abs" / "Lower back": dot + label, not tappable
export type ChipVariant = 'tab' | 'filter' | 'quick' | 'focus';

export interface ChipProps {
  label: string;
  variant?: ChipVariant;
  selected?: boolean;
  onPress?: () => void;
  icon?: ComponentType<{ size?: number; color?: string }>;
}

export function Chip({ label, variant = 'tab', selected = false, onPress, icon: Icon }: ChipProps) {
  const { colors } = useTheme();
  const isQuick = variant === 'quick';
  const isFocus = variant === 'focus';

  const background = isFocus
    ? colors.surface.focusChip
    : variant === 'filter' && selected
      ? colors.primaryFill
      : selected
        ? colors.primarySoft
        : colors.surface.muted;

  const labelColor =
    variant === 'filter' && selected
      ? colors.onPrimary
      : selected
        ? colors.primary
        : variant === 'tab'
          ? colors.text.secondary
          : colors.text.primary;

  const body = (
    <View
      style={[
        styles.chip,
        isQuick ? styles.quick : styles.pill,
        { backgroundColor: background },
        variant === 'tab' && selected && { borderWidth: 1.5, borderColor: colors.primary },
      ]}
    >
      {Icon ? <Icon size={18} color={colors.primary} /> : null}
      {isFocus ? <View style={[styles.dot, { backgroundColor: colors.primary }]} /> : null}
      <Text variant={selected && variant === 'tab' ? 'bodyStrong' : 'body'} style={{ color: labelColor }}>
        {label}
      </Text>
    </View>
  );

  if (!onPress) return body;

  return (
    <Touchable
      onPress={onPress}
      visualSize={isQuick ? sizes.quickChip : sizes.chip}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
    >
      {body}
    </Touchable>
  );
}

const styles = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pill: { minHeight: sizes.chip, borderRadius: radius.pill, paddingHorizontal: 16 },
  quick: { minHeight: sizes.quickChip, borderRadius: radius.md, paddingHorizontal: 16 },
  dot: { width: 8, height: 8, borderRadius: radius.pill },
});
