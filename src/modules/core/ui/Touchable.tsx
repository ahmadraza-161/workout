import type { ReactNode } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { sizes } from '../theme';

// Press feedback and hit area shared by every tappable element (DESIGN §4.1):
// pressed = scale 0.98 + 90% opacity, disabled = 40% and not focusable.
// `minHitSize` grows the touch target to 48 dp without changing the visual size.
export interface TouchableProps {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Visual size, used to work out how much hit slop is needed to reach 48 dp. */
  visualSize?: number;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'link' | 'tab' | 'switch' | 'checkbox' | 'radio';
  accessibilityState?: { selected?: boolean; disabled?: boolean; checked?: boolean; busy?: boolean };
  testID?: string;
}

export function Touchable({
  children,
  onPress,
  disabled = false,
  style,
  visualSize,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  accessibilityState,
  testID,
}: TouchableProps) {
  const slop = visualSize !== undefined ? Math.max(0, (sizes.touchMin - visualSize) / 2) : 0;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled || !onPress}
      hitSlop={slop > 0 ? slop : undefined}
      focusable={!disabled}
      accessible
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled, ...accessibilityState }}
      style={({ pressed }) => [style, pressed && styles.pressed, disabled && styles.disabled]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.4 },
});
