import type { ReactNode } from 'react';
import { CircleArrowRight } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { artworkLayout, challengeGradients, radius, sizes, spacing, type ChallengeGradientName } from '../theme';
import { GradientBackground } from './GradientBackground';
import { Tag } from './Tag';
import { Text } from './Text';
import { Touchable } from './Touchable';

// Challenge card (DESIGN §4.3). The featured and standard variants in the
// reference are the same frame with a different middle: a 2 x 2 meta grid on
// Training, a description on the challenge list. So the middle is `children`.
export interface GradientCardProps {
  title: string;
  gradient: ChallengeGradientName;
  /** "28 DAYS" above the title. */
  eyebrow?: string;
  /** "CUSTOMIZED FOR YOU" corner tag. */
  tag?: string;
  /** Meta cells or a description. */
  children?: ReactNode;
  /** Card CTA, usually "START DAY 1". */
  footer?: ReactNode;
  artwork?: ReactNode;
  width?: number;
  height?: number;
  compact?: boolean;
  onPress?: () => void;
}

export function GradientCard({
  title,
  gradient,
  eyebrow,
  tag,
  children,
  footer,
  artwork,
  width,
  height = sizes.challengeCard,
  onPress,
  compact = false,
}: GradientCardProps) {
  const body = (
    <View style={[styles.card, { width, minHeight: height }, width !== undefined && styles.carouselCard]}>
      <GradientBackground stops={challengeGradients[gradient]} angle={135} />
      {artwork ? <View style={[styles.artwork, compact && styles.compactArtwork]}>{artwork}</View> : null}
      {tag ? <Tag label={tag} cardRadius={radius.xl} /> : null}

      <View style={[styles.content, compact && styles.compactContent]}>
        {eyebrow ? (
          <Text variant="micro" style={styles.onCard}>
            {eyebrow}
          </Text>
        ) : null}

        <View style={[styles.titleRow, artwork ? styles.withArt : undefined, compact && styles.compactTitle]}>
          <Text variant={compact ? 'bannerTitle' : 'challengeTitle'} adjustsFontSizeToFit minimumFontScale={0.85} numberOfLines={3}
            android_hyphenationFrequency="none" textBreakStrategy="simple" style={[styles.onCard, styles.title, compact && styles.compactText]}>
            {title}
          </Text>
          {onPress ? <CircleArrowRight size={sizes.iconMd} color="#FFFFFF" /> : null}
        </View>

        {children}
      </View>

      {footer ? <View style={[styles.footer, compact && styles.compactFooter]}>{footer}</View> : null}
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
  card: { borderRadius: radius.xl, overflow: 'hidden' },
  // Carousel neighbours must not stretch a short card and push its CTA away.
  carouselCard: { alignSelf: 'flex-start' },
  artwork: { position: 'absolute', ...artworkLayout.challenge },
  content: { padding: spacing[5], gap: spacing[3] },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  title: { flexShrink: 1 },
  withArt: { width: '64%', minHeight: sizes.challengeTitleBlock },
  footer: { padding: spacing[5], paddingTop: 0 },
  compactContent: { padding: spacing[4], gap: spacing[2] },
  compactText: { textTransform: 'uppercase' },
  compactTitle: { minHeight: sizes.trainingChallengeTitle, width: '64%' },
  compactArtwork: { height: sizes.trainingChallengeHero },
  compactFooter: { padding: spacing[4], paddingTop: spacing[0] },
  // Challenge gradients are saturated on both stops, so all card text is white.
  onCard: { color: '#FFFFFF' },
});
