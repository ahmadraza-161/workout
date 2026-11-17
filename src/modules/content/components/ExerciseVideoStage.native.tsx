import { useIsFocused } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useCallback, useEffect, useState } from 'react';
import { AccessibilityInfo, AppState, StyleSheet, View } from 'react-native';

import { t } from '@/modules/core/i18n';
import { radius, useTheme } from '@/modules/core/theme';

import { getExercise } from '../repository';
import { EXERCISE_VIDEO_PLAYBACK } from '../videos.generated';
import type { ExerciseDemoProps } from './ExerciseDemo';
import { ExerciseImage } from './ExerciseImage';

export function ExerciseVideoStage({ id, variant, playing = true, source }: ExerciseDemoProps & { source: number }) {
  const focused = useIsFocused();
  const [foreground, setForeground] = useState(AppState.currentState === 'active');
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);
  const [failed, setFailed] = useState(false);
  const onFailure = useCallback(() => setFailed(true), []);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => { if (alive) setReduceMotion(enabled); })
      .catch(() => { if (alive) setReduceMotion(true); });
    const motion = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    const app = AppState.addEventListener('change', (state) => setForeground(state === 'active'));
    return () => { alive = false; motion.remove(); app.remove(); };
  }, []);
  // Unmounting the canvas releases the native player when the screen is closed or covered;
  // it loads and autoplays again only when the screen is focused.
  if (failed || reduceMotion !== false || !focused) return <ExerciseImage id={id} variant={variant} />;
  return <VideoCanvas id={id} variant={variant} source={source} playing={playing && foreground}
    onFailure={onFailure} />;
}

function VideoCanvas({ id, variant, playing, source, onFailure }: ExerciseDemoProps & {
  source: number; onFailure: () => void;
}) {
  const { colors } = useTheme();
  const [firstFrame, setFirstFrame] = useState(false);
  const player = useVideoPlayer(source, (video) => {
    video.loop = EXERCISE_VIDEO_PLAYBACK[id]?.loop ?? true;
    video.muted = true;
    video.staysActiveInBackground = false;
    video.showNowPlayingNotification = false;
  });
  useEffect(() => {
    let mounted = true;
    const applyPlayback = () => {
      if (!mounted) return;
      // Never reset currentTime: resume the same repetition after timer pauses.
      try {
        if (playing && player.status === 'readyToPlay') player.play();
        else player.pause();
      } catch {
        // A native player can be released while a queued status event is delivered.
        if (mounted) onFailure();
      }
    };
    const status = player.addListener('statusChange', ({ status: next }) => {
      if (!mounted) return;
      if (next === 'error') onFailure();
      else applyPlayback();
    });
    if (player.status === 'error') onFailure();
    else applyPlayback();
    return () => {
      mounted = false;
      // useVideoPlayer owns native release. Calling pause here can access an
      // already released SharedObject when closing a guide or selecting Image.
      try { status.remove(); } catch { /* Native release already removed listeners. */ }
    };
  }, [player, playing, onFailure]);
  return <View accessible accessibilityRole="image" accessibilityLabel={t(getExercise(id)?.nameKey ?? 'browse.imagePending')}
    style={[variant === 'player' ? styles.player : styles.guide, { backgroundColor: colors.surface.stage }]}>
    <VideoView player={player} style={styles.canvas} contentFit="contain" surfaceType="textureView"
      nativeControls={false} allowsPictureInPicture={false} onFirstFrameRender={() => setFirstFrame(true)} />
    {!firstFrame ? <ExerciseImage id={id} variant={variant} /> : null}
  </View>;
}

const styles = StyleSheet.create({
  guide: { width: '100%', aspectRatio: 3 / 2, borderRadius: radius.lg, overflow: 'hidden' },
  player: { width: '100%', aspectRatio: 5 / 4, borderBottomLeftRadius: radius.xxl,
    borderBottomRightRadius: radius.xxl, overflow: 'hidden' },
  canvas: { position: 'absolute', width: '100%', height: '100%' },
});
