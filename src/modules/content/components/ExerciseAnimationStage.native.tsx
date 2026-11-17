import { useIsFocused } from 'expo-router';
import LottieView, { type AnimationObject } from 'lottie-react-native';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, AppState, StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { radius, useTheme } from '@/modules/core/theme';

import { EXERCISE_ANIMATION_PLAYBACK } from '../animations.generated';
import { getExercise } from '../repository';
import type { ExerciseDemoProps } from './ExerciseDemo';
import { ExerciseImage } from './ExerciseImage';

export function ExerciseAnimationStage({ id, variant, playing = true, source }:
  ExerciseDemoProps & { source: AnimationObject }) {
  const { colors } = useTheme();
  const focused = useIsFocused();
  const [foreground, setForeground] = useState(AppState.currentState === 'active');
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => { if (alive) setReduceMotion(enabled); })
      .catch(() => { if (alive) setReduceMotion(true); });
    const motion = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    const app = AppState.addEventListener('change', (status) => setForeground(status === 'active'));
    return () => { alive = false; motion.remove(); app.remove(); };
  }, []);
  if (failed || reduceMotion !== false) return <ExerciseImage id={id} variant={variant} />;
  return (
    <View accessible accessibilityRole="image"
      accessibilityLabel={t(getExercise(id)?.nameKey ?? 'browse.imagePending')}
      style={[variant === 'player' ? styles.player : styles.guide, { backgroundColor: colors.surface.stage }]}>
      <AnimationCanvas id={id} variant={variant} source={source}
        playing={playing && focused && foreground} onFailure={() => setFailed(true)} />
    </View>
  );
}

function AnimationCanvas({ id, variant, source, playing, onFailure }:
  ExerciseDemoProps & { source: AnimationObject; onFailure: () => void }) {
  const animation = useRef<LottieView>(null);
  const started = useRef(false);
  const finished = useRef(false);
  const segment = EXERCISE_ANIMATION_PLAYBACK[id];
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!loaded || finished.current) return;
    // Start after composition load, then resume rather than restart on each pause.
    // The exercise component is keyed by ID so changing exercise resets the loop.
    if (!playing) animation.current?.pause();
    else if (started.current) animation.current?.resume();
    else {
      if (segment) animation.current?.play(segment.startFrame, segment.endFrame);
      else animation.current?.play();
      started.current = true;
    }
  }, [loaded, playing, segment]);
  return (
    <>
      {!loaded ? <ExerciseImage id={id} variant={variant} /> : null}
      <LottieView ref={animation} source={source} autoPlay={false} loop={segment?.loop ?? true} resizeMode="contain"
        style={[styles.canvas, !loaded && styles.hidden]}
        onAnimationLoaded={() => setLoaded(true)} onAnimationFailure={onFailure}
        onAnimationFinish={(cancelled) => { if (segment?.loop === false && !cancelled) finished.current = true; }}
        enableSafeModeAndroid />
    </>
  );
}

const styles = StyleSheet.create({
  guide: { width: '100%', aspectRatio: 3 / 2, borderRadius: radius.lg, overflow: 'hidden' },
  player: { width: '100%', aspectRatio: 5 / 4, borderBottomLeftRadius: radius.xxl,
    borderBottomRightRadius: radius.xxl, overflow: 'hidden' },
  canvas: { position: 'absolute', width: '100%', height: '100%' },
  hidden: { opacity: 0 },
});
