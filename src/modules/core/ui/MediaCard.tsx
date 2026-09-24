import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { radius, spacing, useTheme } from '../theme';
import { Text } from './Text';
import { Touchable } from './Touchable';

// Artwork card with a title. The reference uses it four ways, differing only
// in where the title sits: overlaid on a scrim (Stretch & Warm Up, For
// beginners, Challenge) or below the artwork (Discover "Stretch" grid).
export interface MediaCardProps {
  title: string;
  artwork?: ReactNode;
  width: number;
  /** Artwork aspect ratio: 1.6 for 2-up cards, 1.4 for the grid. */
  aspect?: number;
  titlePlacement?: 'overlay' | 'below';
  onPress?: () => void;
}

export function MediaCard({
  title,
  artwork,
  width,
  aspect = 1.6,
  titlePlacement = 'overlay',
  onPress,
}: MediaCardProps) {
  const { colors } = useTheme();

  const art = (
    <View style={[styles.art, { width, height: width / aspect, backgroundColor: colors.surface.muted }]}>
      {artwork}
      {titlePlacement === 'overlay' ? (
        <>
          <View style={styles.scrim} />
          <Text variant="captionSm" style={styles.overlayTitle} numberOfLines={2}>
            {title}
          </Text>
        </>
      ) : null}
    </View>
  );

  const body =
    titlePlacement === 'below' ? (
      <View style={{ width, gap: spacing[2] }}>
        {art}
        <Text variant="captionSm" numberOfLines={2}>
          {title}
        </Text>
      </View>
    ) : (
      art
    );

  if (!onPress) return body;
  return (
    <Touchable onPress={onPress} accessibilityLabel={title}>
      {body}
    </Touchable>
  );
}

const styles = StyleSheet.create({
  art: { borderRadius: radius.lg, overflow: 'hidden', justifyContent: 'flex-end' },
  // RN 0.86 dropped StyleSheet.absoluteFillObject, so the inset is spelled out.
  scrim: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.35)' },
  overlayTitle: { color: '#FFFFFF', fontWeight: '700', padding: spacing[3] },
});
