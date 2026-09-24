import { Flame } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { radius, spacing, useTheme } from '../theme';
import { Text } from './Text';

// Small indicators from DESIGN §4.5. They are one-liners, so they share a file
// rather than each getting its own.

/** Numbered circle used by COMMON MISTAKES in the exercise guide. */
export function NumberedCircle({ value }: { value: number }) {
  const { colors } = useTheme();
  return (
    <View
      style={[styles.numbered, { backgroundColor: colors.primaryTint }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Text variant="captionSm" tone="brand" style={styles.bold}>
        {value}
      </Text>
    </View>
  );
}

/** Streak flame with its count, in the Training header and the Report card. */
export function StreakFlame({ count }: { count: number }) {
  const { colors } = useTheme();
  return (
    <View style={styles.flame} accessible accessibilityLabel={`${count}`}>
      <Flame size={26} color={colors.flame} fill={colors.flame} />
      <Text variant="listTitle" style={styles.bold}>
        {count}
      </Text>
    </View>
  );
}

/**
 * Thin progress bar. Used for the player's overall workout progress and the
 * onboarding step indicator, which are the same shape at different heights.
 */
export function ProgressBar({ progress, height = 3 }: { progress: number; height?: number }) {
  const { colors } = useTheme();
  const clamped = Math.min(1, Math.max(0, progress));
  return (
    <View
      style={[styles.track, { height, backgroundColor: colors.line.ringTrack }]}
      // Android does not treat a bare accessibilityRole as focusable, so
      // TalkBack skips the bar entirely without `accessible`.
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
    >
      <View style={[styles.fill, { width: `${clamped * 100}%`, backgroundColor: colors.primary }]} />
    </View>
  );
}

/** Circular avatar placeholder for the coach bubble. */
export function Avatar({ size = 48, children }: { size?: number; children?: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, backgroundColor: colors.surface.muted },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  numbered: { width: 24, height: 24, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  flame: { flexDirection: 'row', alignItems: 'center', gap: spacing[1] },
  bold: { fontWeight: '700' },
  track: { width: '100%', overflow: 'hidden' },
  fill: { height: '100%' },
  avatar: { borderRadius: radius.pill, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
});
