import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { artworkLayout, gradients, radius, sizes, spacing, useTheme, type GradientStops } from '../theme';
import { GradientBackground } from './GradientBackground';
import { Text } from './Text';
import { Touchable } from './Touchable';

// Wide artwork banner (DESIGN §4.3). The reference uses this shape five times
// — Recommended, Discover featured, the collection banner, "Explore more" and
// category promos — varying only the title, the subtitle and the trailing slot.
export interface BannerProps {
  title: string;
  subtitle?: string;
  /** Small white pill, e.g. "7 Workouts". */
  countLabel?: string;
  /** Button or "GO" pill on the right. */
  trailing?: ReactNode;
  trailingLabel?: string;
  artworkPlacement?: 'side' | 'background';
  /** Bundled artwork filling the right side. */
  artwork?: ReactNode;
  gradient: GradientStops;
  height?: number;
  onPress?: () => void;
}

export function Banner({
  title,
  subtitle,
  countLabel,
  trailing,
  trailingLabel,
  artworkPlacement = 'side',
  artwork,
  gradient,
  height = sizes.browseBanner,
  onPress,
}: BannerProps) {
  const { colors } = useTheme();

  const body = (
    <View style={[styles.banner, { minHeight: height }]}>
      <GradientBackground stops={gradient} angle={135} />
      {artwork ? <View style={[styles.artwork, artworkPlacement === 'background' && styles.backgroundArtwork]}>{artwork}</View> : null}
      {artwork && artworkPlacement === 'background' ? <View style={styles.scrim}><GradientBackground stops={gradients.bannerScrim} angle={180} /></View> : null}

      <View style={[styles.content, artworkPlacement === 'background' && { minHeight: height, alignItems: 'flex-end' }]}>
        <View style={[styles.text, artwork && artworkPlacement === 'side' ? styles.withArt : undefined]}>
          <Text variant="bannerTitle" style={styles.onArt}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="caption" style={styles.onArt}>
              {subtitle}
            </Text>
          ) : null}
          {countLabel ? (
            <View style={[styles.pill, { backgroundColor: 'rgba(255,255,255,0.90)' }]}>
              <Text variant="captionSm" style={{ color: colors.tagText }}>
                {countLabel}
              </Text>
            </View>
          ) : null}
        </View>
        {trailingLabel ? <View style={[styles.pill, { backgroundColor: colors.onPrimary }]}><Text variant="bodyStrong" tone="brand">{trailingLabel}</Text></View> : trailing}
      </View>
    </View>
  );

  if (!onPress) return body;
  return (
    <Touchable onPress={onPress} accessibilityLabel={title}>
      {body}
    </Touchable>
  );
}

const styles = StyleSheet.create({
  banner: { borderRadius: radius.lg, overflow: 'hidden', justifyContent: 'center' },
  artwork: { position: 'absolute', right: 0, top: 0, bottom: 0, ...artworkLayout.banner },
  backgroundArtwork: { left: spacing[0], width: '100%' },
  scrim: { position: 'absolute', left: spacing[0], right: spacing[0], bottom: spacing[0], height: '70%' },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[5],
    gap: spacing[3],
  },
  text: { flex: 1, gap: spacing[2], alignItems: 'flex-start' },
  withArt: { flex: 0, width: '54%' },
  // Banners always sit on a saturated gradient, so their text is solid white.
  onArt: { color: '#FFFFFF' },
  pill: { borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 4 },
});
