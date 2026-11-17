import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { radius, sizes, useTheme } from '../theme';

export type ThumbSize = 'sm' | 'md' | 'lg';

const DIMENSION: Record<ThumbSize, number> = {
  sm: sizes.thumbSm,
  md: sizes.thumbMd,
  lg: sizes.thumbLg,
};

// Square artwork slot for bundled workout photos and exercise pose cutouts.
// `stage` gives exercise thumbnails their theme-aware pale background.
export interface ThumbProps {
  size?: ThumbSize;
  stage?: boolean;
  children?: ReactNode;
}

export function Thumb({ size = 'md', stage = false, children }: ThumbProps) {
  const { colors } = useTheme();
  const dimension = DIMENSION[size];

  return (
    <View
      style={[
        styles.thumb,
        {
          width: dimension,
          height: dimension,
          backgroundColor: stage ? colors.surface.stage : colors.surface.muted,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  thumb: { borderRadius: radius.md, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
});
