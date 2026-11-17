import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import { useIsFocused } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import type { WorkoutSettings } from '@/modules/profile';

import { getCue, type CueFrame } from './cues';

function pauseCues(players: readonly { pause: () => void }[]): void {
  for (const player of players) {
    try { player.pause(); } catch { /* A disposed native player must not crash the timer. */ }
  }
}

export function AwakeDuringWorkout() {
  useKeepAwake('workout-player', { suppressDeactivateWarnings: true });
  return null;
}

export function usePlayerFeedback(frame: CueFrame, settings: WorkoutSettings): boolean {
  const focused = useIsFocused();
  const [foreground, setForeground] = useState(AppState.currentState === 'active');
  const [ready, setReady] = useState(false);
  const previous = useRef<CueFrame | null>(null);
  const short = useAudioPlayer(require('../../../assets/sounds/beep_short.wav'));
  const long = useAudioPlayer(require('../../../assets/sounds/beep_long.wav'));
  const complete = useAudioPlayer(require('../../../assets/sounds/complete.wav'));
  const active = frame.active && foreground && focused;
  const { phase, index, remaining } = frame;

  useEffect(() => {
    const listener = AppState.addEventListener('change', (status) => {
      // Suppress catch-up cues even if the JS timer wakes before the next React render.
      if (status !== 'active') {
        previous.current = null;
        pauseCues([short, long, complete]);
      }
      setForeground(status === 'active');
    });
    let mounted = true;
    void setAudioModeAsync({ playsInSilentMode: false, allowsRecording: false,
      shouldPlayInBackground: false, interruptionMode: 'duckOthers' })
      .then(() => { if (mounted) setReady(true); }).catch(() => { /* Cues are optional. */ });
    return () => {
      mounted = false;
      listener.remove();
      pauseCues([short, long, complete]);
    };
  }, [short, long, complete]);

  useEffect(() => {
    const current = { phase, index, remaining, active };
    const cue = getCue(previous.current, current);
    previous.current = current;
    if (!active || !settings.beeps) {
      pauseCues([short, long, complete]);
    }
    if (!cue) return;
    let cancelled = false;
    if (settings.haptics && cue !== 'tick') {
      void Promise.resolve().then(() => {
        if (!cancelled && AppState.currentState === 'active') {
          return Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm);
        }
      })
        .catch(() => { /* Unsupported hardware must not interrupt a workout. */ });
    }
    if (settings.beeps && ready) {
      const player = cue === 'tick' ? short : cue === 'complete' ? complete : long;
      pauseCues([short, long, complete]);
      void Promise.resolve().then(() => player.seekTo(0)).then(() => {
        if (!cancelled && AppState.currentState === 'active') player.play();
      }).catch(() => { /* Continue the visual timer if audio is unavailable. */ });
    }
    return () => { cancelled = true; };
  }, [phase, index, remaining, active, settings.beeps,
    settings.haptics, ready, short, long, complete]);

  return active && frame.phase !== 'complete';
}
