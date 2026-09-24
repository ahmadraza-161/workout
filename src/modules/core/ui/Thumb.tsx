import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { radius, sizes, useTheme } from '../theme';

export type ThumbSize = 'sm' | 'md' | 'lg';

const DIMENSION: Record<ThumbSize, number> = {
  sm: sizes.thumbSm,
  md: sizes.thumbMd,
  lg: sizes.thumbLg,
};

// Square artwork slot used by every row and card. Artwork is drawn as vectors
// at runtime (ADR-024), so this is a container, never an <Image> of a photo.
// `stage` gives the pale animation background used by exercise thumbnails.
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
