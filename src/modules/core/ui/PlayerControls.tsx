import { Pause, Play, StepBack, StepForward } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { radius, sizes, spacing, useTheme } from '../theme';
import { Text } from './Text';
import { Touchable } from './Touchable';

// Player transport (DESIGN §4.1). The pause button is a wide track whose brand
// fill grows left to right as the exercise runs, exactly as in the reference.
export interface PlayerControlsProps {
  paused: boolean;
  /** 0 to 1 through the current exercise. */
  progress: number;
  onTogglePause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious?: boolean;
  labels: { previous: string; next: string; pause: string; resume: string };
}

export function PlayerControls({
  paused,
  progress,
  onTogglePause,
  onPrevious,
  onNext,
  hasPrevious = true,
  labels,
}: PlayerControlsProps) {
  const { colors } = useTheme();
  const clamped = Math.min(1, Math.max(0, progress));

  return (
    <View style={styles.row}>
      <Touchable onPress={onPrevious} disabled={!hasPrevious} accessibilityLabel={labels.previous}>
        <View style={[styles.side, { backgroundColor: colors.control.bg }]}>
          <StepBack size={24} color={colors.text.strong} />
        </View>
      </Touchable>

      <Touchable
        onPress={onTogglePause}
        accessibilityLabel={paused ? labels.resume : labels.pause}
        style={styles.grow}
      >
        <View style={[styles.pause, { backgroundColor: colors.control.bgStrong }]}>
          <View style={[styles.pauseFill, { width: `${clamped * 100}%`, backgroundColor: colors.primary }]} />
          {paused ? (
            <Play size={28} color={colors.text.strong} fill={colors.text.strong} />
          ) : (
            <Pause size={28} color={colors.text.strong} fill={colors.text.strong} />
          )}
        </View>
      </Touchable>

      <Touchable onPress={onNext} accessibilityLabel={labels.next}>
        <View style={[styles.side, { backgroundColor: colors.control.bg }]}>
          <StepForward size={24} color={colors.text.strong} />
        </View>
      </Touchable>
    </View>
  );
}

// Rest panel actions (DESIGN §4.1). They sit on the full-bleed blue panel, so
// their colours are fixed rather than theme-dependent.
export interface RestActionsProps {
  countdown: string;
  onAddTime: () => void;
  onSkip: () => void;
  onEditRestTime: () => void;
  labels: { rest: string; addTime: string; skip: string; editRestTime: string };
}

export function RestActions({
  countdown,
  onAddTime,
  onSkip,
  onEditRestTime,
  labels,
}: RestActionsProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.rest}>
      <Text variant="displayL" style={{ color: colors.onPrimary }}>
        {labels.rest}
      </Text>
      <Text variant="displayXL" style={{ color: colors.onPrimary }}>
        {countdown}
      </Text>

      <Touchable onPress={onEditRestTime} accessibilityLabel={labels.editRestTime}>
        <View style={[styles.editPill, { backgroundColor: colors.control.restPill }]}>
          <Text variant="bodyStrong" style={{ color: colors.onPrimary }}>
            {labels.editRestTime}
          </Text>
        </View>
      </Touchable>

      <View style={styles.restButtons}>
        <Touchable onPress={onAddTime} accessibilityLabel={labels.addTime} style={styles.grow}>
          <View style={[styles.restButton, { backgroundColor: colors.control.restAction }]}>
            <Text variant="button" style={{ color: colors.onPrimary }}>
              {labels.addTime}
            </Text>
          </View>
        </Touchable>

        <Touchable onPress={onSkip} accessibilityLabel={labels.skip} style={styles.grow}>
          <View style={[styles.restButton, { backgroundColor: colors.surface.default }]}>
            <Text variant="button" style={{ color: colors.primaryFill }}>
              {labels.skip}
            </Text>
          </View>
        </Touchable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
  grow: { flex: 1 },
  side: {
    width: sizes.playerControl,
    height: sizes.playerControl,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pause: {
    height: sizes.playerControl,
    borderRadius: radius.xl,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseFill: { position: 'absolute', left: 0, top: 0, bottom: 0 },
  rest: { alignItems: 'center', gap: spacing[4] },
  editPill: { height: sizes.quickChip, borderRadius: radius.pill, paddingHorizontal: spacing[6], justifyContent: 'center' },
  restButtons: { flexDirection: 'row', gap: spacing[3], alignSelf: 'stretch' },
  restButton: { height: sizes.buttonLg, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
});
