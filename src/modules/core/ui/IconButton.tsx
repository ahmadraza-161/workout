import type { ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';

import { radius, sizes, useTheme } from '../theme';
import { Touchable } from './Touchable';

// Round icon buttons (DESIGN §4.1). Every variant keeps a 48 dp hit area even
// when it looks smaller.
//   stage    – player top bar, 40 dp on a pale fill
//   floating – over hero artwork, 40 dp on a dark scrim
//   close    – sheet headers, 32 dp
//   thumbs   – player feedback, 48 dp, AA-adjusted grey (the reference fails contrast)
export type IconButtonVariant = 'stage' | 'floating' | 'close' | 'thumbs';

const DIMENSION: Record<IconButtonVariant, number> = {
  stage: sizes.iconButton,
  floating: sizes.iconButton,
  close: 32,
  thumbs: 48,
};

export interface IconButtonProps {
  icon: ComponentType<{ size?: number; color?: string }>;
  onPress: () => void;
  accessibilityLabel: string;
  variant?: IconButtonVariant;
  disabled?: boolean;
}

export function IconButton({
  icon: Icon,
  onPress,
  accessibilityLabel,
  variant = 'stage',
  disabled = false,
}: IconButtonProps) {
  const { colors } = useTheme();
  const dimension = DIMENSION[variant];

  const background =
    variant === 'floating'
      ? 'rgba(0,0,0,0.35)'
      : variant === 'close'
        ? colors.control.close
        : variant === 'thumbs'
          ? colors.control.thumbs
          : colors.control.iconButton;

  const iconColor =
    variant === 'floating'
      ? '#FFFFFF'
      : variant === 'close'
        ? colors.control.closeIcon
        : variant === 'thumbs'
          ? colors.control.thumbsIcon
          : colors.text.strong;

  const iconSize = variant === 'close' ? 18 : 22;

  return (
    <Touchable
      onPress={onPress}
      disabled={disabled}
      visualSize={dimension}
      accessibilityLabel={accessibilityLabel}
    >
      <View style={[styles.button, { width: dimension, height: dimension, backgroundColor: background }]}>
        <Icon size={iconSize} color={iconColor} />
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  button: { borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
});
