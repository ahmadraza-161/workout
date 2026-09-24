import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { radius, spacing, useTheme, type GradientStops } from '../theme';
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
  /** Artwork slot filling the right side; vectors only, never a photo. */
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
  artwork,
  gradient,
  height = 160,
  onPress,
}: BannerProps) {
  const { colors } = useTheme();

  const body = (
    <View style={[styles.banner, { height }]}>
      <GradientBackground stops={gradient} angle={135} />
      {artwork ? <View style={styles.artwork}>{artwork}</View> : null}

      <View style={styles.content}>
        <View style={styles.text}>
          <Text variant="cardTitle" style={styles.onArt} numberOfLines={2}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="caption" style={styles.onArt} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
          {countLabel ? (
            <View style={[styles.pill, { backgroundColor: 'rgba(255,255,255,0.90)' }]}>
              <Text variant="captionSm" style={{ color: colors.text.strong }}>
                {countLabel}
              </Text>
            </View>
          ) : null}
        </View>
        {trailing}
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
  artwork: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '45%' },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[5],
    gap: spacing[3],
  },
  text: { flex: 1, gap: spacing[2], alignItems: 'flex-start' },
  // Banners always sit on a saturated gradient, so their text is solid white.
  onArt: { color: '#FFFFFF' },
  pill: { borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 4 },
});
