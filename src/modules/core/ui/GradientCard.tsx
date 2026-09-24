import type { ReactNode } from 'react';
import { CircleArrowRight } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { challengeGradients, radius, spacing, type ChallengeGradientName } from '../theme';
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
  height = 250,
  onPress,
}: GradientCardProps) {
  const body = (
    <View style={[styles.card, { width, height }]}>
      <GradientBackground stops={challengeGradients[gradient]} angle={135} />
      {artwork ? <View style={styles.artwork}>{artwork}</View> : null}
      {tag ? <Tag label={tag} cardRadius={radius.xl} /> : null}

      <View style={styles.content}>
        {eyebrow ? (
          <Text variant="micro" style={styles.onCard}>
            {eyebrow}
          </Text>
        ) : null}

        <View style={styles.titleRow}>
          <Text variant="cardTitle" style={[styles.onCard, styles.title]} numberOfLines={2}>
            {title}
          </Text>
          <CircleArrowRight size={20} color="#FFFFFF" />
        </View>

        {children}
      </View>

      {footer ? <View style={styles.footer}>{footer}</View> : null}
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
  artwork: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '45%' },
  content: { flex: 1, padding: spacing[5], gap: spacing[3] },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  title: { flexShrink: 1 },
  footer: { padding: spacing[5], paddingTop: 0 },
  // Challenge gradients are saturated on both stops, so all card text is white.
  onCard: { color: '#FFFFFF' },
});
