import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  PROOF_EXERCISES,
  RigFigure,
  samplePoseLoop,
  type PaletteName,
  type ProofExercise,
} from '@/modules/demo';
import { radius, spacing, useTheme } from '@/modules/core/theme';
import { Button, Card, SegmentedControl, Text } from '@/modules/core/ui';

// Development-only rig preview (T2.12, cut down to the four proof exercises).
// This is the style gate: the rig is reviewed here before all 119 exercises
// are posed, because re-posing 119 after a style change is the expensive
// mistake this phase exists to avoid.
export default function RigPreview() {
  if (!__DEV__) return <Redirect href="/" />;
  return <Preview />;
}

const PALETTE_OPTIONS = [
  { value: 'a' as const, label: 'Variant A' },
  { value: 'b' as const, label: 'Variant B' },
];

function Preview() {
  const { colors } = useTheme();
  const [palette, setPalette] = useState<PaletteName>('a');
  const [playing, setPlaying] = useState(true);

  return (
    <ScrollView style={{ backgroundColor: colors.bg.page }} contentContainerStyle={styles.page}>
      <View style={styles.header}>
        <Text variant="h1">Rig style proof</Text>
        <Text variant="caption" tone="secondary">
          Four exercises covering the risky cases. Approve the look here before all 119 are posed.
        </Text>
        <SegmentedControl
          options={PALETTE_OPTIONS}
          value={palette}
          onChange={(next) => setPalette(next as PaletteName)}
          accessibilityLabel="Character palette"
        />
        <Button
          label={playing ? 'Pause' : 'Play'}
          variant="secondary"
          onPress={() => setPlaying((value) => !value)}
        />
      </View>

      {PROOF_EXERCISES.map((exercise) => (
        <ExerciseCard key={exercise.slug} exercise={exercise} palette={palette} playing={playing} />
      ))}
    </ScrollView>
  );
}

function ExerciseCard({
  exercise,
  palette,
  playing,
}: {
  exercise: ProofExercise;
  palette: PaletteName;
  playing: boolean;
}) {
  const { colors } = useTheme();
  const t = useLoop(exercise.duration, playing);
  const pose = samplePoseLoop(exercise.poses, t);

  return (
    <View style={styles.exercise}>
      <View style={styles.titleRow}>
        <Text variant="h3">{exercise.name}</Text>
        <Text variant="caption" tone="secondary">
          {exercise.view} · {exercise.poses.length} poses · {exercise.duration}s
        </Text>
      </View>

      <View style={[styles.stage, { backgroundColor: colors.surface.stage }]}>
        <RigFigure
          pose={pose}
          view={exercise.view}
          size={300}
          palette={palette}
          props={exercise.props}
          motionArc={exercise.motionArc}
          floorShadow={exercise.floorShadow}
          accessibilityLabel={exercise.name}
        />
      </View>

      <Card>
        <Text variant="caption" tone="secondary">
          {exercise.proves}
        </Text>
      </Card>

      <View style={styles.keyPoses}>
        {exercise.poses.map((keyPose, index) => (
          <View key={index} style={[styles.keyPose, { backgroundColor: colors.surface.stage }]}>
            <RigFigure
              pose={keyPose}
              view={exercise.view}
              size={110}
              palette={palette}
              props={exercise.props}
              floorShadow={exercise.floorShadow}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

/**
 * Drives a 0-to-1 loop at roughly 30 fps, the rig's export rate. Advancing by
 * a fixed step rather than reading the clock keeps the hook pure and lets a
 * paused loop resume where it stopped. Interval drift does not matter for a
 * preview screen.
 */
function useLoop(durationSeconds: number, playing: boolean) {
  const [t, setT] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const step = 1 / 30 / durationSeconds;
    const id = setInterval(() => setT((current) => (current + step) % 1), 1000 / 30);
    return () => clearInterval(id);
  }, [playing, durationSeconds]);

  return t;
}

const styles = StyleSheet.create({
  page: { paddingBottom: spacing[16], gap: spacing[8] },
  header: { padding: spacing[4], gap: spacing[3] },
  exercise: { paddingHorizontal: spacing[4], gap: spacing[3] },
  titleRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  stage: { borderRadius: radius.lg, alignItems: 'center', paddingVertical: spacing[3] },
  keyPoses: { flexDirection: 'row', gap: spacing[2] },
  keyPose: { borderRadius: radius.md, overflow: 'hidden' },
});
