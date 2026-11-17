import { useIsFocused } from 'expo-router';
import { useEffect, useRef } from 'react';
import { BackHandler } from 'react-native';

/** Handle Android Back only on the focused route; newer overlays retain priority. */
export function useAndroidBack(onBack: () => boolean, enabled = true): void {
  const focused = useIsFocused();
  const latest = useRef(onBack);
  useEffect(() => { latest.current = onBack; }, [onBack]);
  useEffect(() => {
    if (!focused || !enabled) return;
    // Keep registration stable while timers/drafts change. Re-registering a screen
    // every render would move it ahead of a sheet in Android's reverse listener order.
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => latest.current());
    return () => subscription.remove();
  }, [focused, enabled]);
}
