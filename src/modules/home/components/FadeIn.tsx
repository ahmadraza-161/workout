import { useEffect, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Animated } from 'react-native';

import { motion, spacing } from '@/modules/core/theme';

/** Staggered entrance for Home sections; Reduce Motion shows them at once. */
export function FadeIn({ order, children }: { order: number; children: ReactNode }) {
  const [progress] = useState(() => new Animated.Value(0));
  useEffect(() => {
    let alive = true;
    const animation = Animated.timing(progress, { toValue: 1, duration: motion.duration.slow,
      delay: order * motion.duration.instant, useNativeDriver: true });
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (!alive) return;
      if (reduce) progress.setValue(1);
      else animation.start();
    }).catch(() => progress.setValue(1));
    return () => { alive = false; animation.stop(); };
  }, [order, progress]);
  return <Animated.View style={{ opacity: progress,
    transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [spacing[4], 0] }) }] }}>
    {children}
  </Animated.View>;
}
