import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, AppState, StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { radius, spacing, useTheme } from '@/modules/core/theme';
import { Button, Card, Screen, SegmentedControl, Text } from '@/modules/core/ui';

import { STYLE_DURATION, STYLE_EXERCISES, type StyleExercise } from '../rig/authored/motion';
import type { PaletteName } from '../rig/palette';
import { StyleProofFigure } from './StyleProofFigure';

const PREVIEW_FPS = 30;
const POSE_STEP = 0.125;

/** Clock-based preview freezes on pause/background and honors Reduce Motion. */
function usePreviewClock(playing: boolean): number {
  const elapsed = useRef(0);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!playing) return;
    let previous = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      if (AppState.currentState === 'active') elapsed.current += Math.min(now - previous, 100);
      previous = now;
      setSeconds(elapsed.current / 1000);
    }, 1000 / PREVIEW_FPS);
    return () => clearInterval(id);
  }, [playing]);
  return seconds;
}

export function StyleProofScreen() {
  const { colors } = useTheme();
  const [playing, setPlaying] = useState(false);
  const [palette, setPalette] = useState<PaletteName>('a');
  const [step, setStep] = useState(0);
  const seconds = usePreviewClock(playing);
  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled()
      .then((reduced) => {
        if (mounted) setPlaying(!reduced);
      })
      .catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (reduced) => {
      if (reduced) setPlaying(false);
    });
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text variant="h1">{t('dev.rigStyle.title')}</Text>
        <Text tone="secondary">{t('dev.rigStyle.description')}</Text>
        <SegmentedControl
          options={[
            { value: 'a', label: t('dev.rigStyle.blue') },
            { value: 'b', label: t('dev.rigStyle.rose') },
          ]}
          value={palette}
          onChange={(value) => setPalette(value as PaletteName)}
          accessibilityLabel={t('dev.rigStyle.outfit')}
        />
        <View style={styles.controls}>
          <Button
            label={t(playing ? 'dev.rigStyle.pause' : 'dev.rigStyle.play')}
            onPress={() => setPlaying((value) => !value)}
          />
          <Button
            variant="secondary"
            label={t('dev.rigStyle.nextPose')}
            onPress={() => {
              setPlaying(false);
              setStep((value) => value + POSE_STEP);
            }}
          />
        </View>
      </View>
      {STYLE_EXERCISES.map((exercise: StyleExercise) => (
        <Card key={exercise} style={styles.card}>
          <Text variant="h2">{t(`dev.rigStyle.${exercise}`)}</Text>
          <View style={[styles.stage, { backgroundColor: colors.surface.stage }]}>
            <StyleProofFigure
              exercise={exercise}
              progress={seconds / STYLE_DURATION[exercise] + step}
              palette={palette}
              label={t(`dev.rigStyle.${exercise}`)}
            />
          </View>
          <Text tone="secondary">{t(`dev.rigStyle.${exercise}Note`)}</Text>
        </Card>
      ))}
      <Text variant="caption" tone="secondary">
        {t('dev.rigStyle.review')}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing[4], marginBottom: spacing[6] },
  controls: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] },
  card: { gap: spacing[3], marginBottom: spacing[6] },
  stage: { width: '100%', aspectRatio: 1, borderRadius: radius.lg, overflow: 'hidden' },
});
