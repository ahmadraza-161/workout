import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { sizes, useTheme } from '../theme';

// Prep countdown ring (DESIGN §4.5): 120 dp, 6 dp stroke, round caps, drawn
// with react-native-svg so it stays crisp at any size. The countdown number is
// passed in as `children` so the ring stays presentational.
export interface TimerRingProps {
  /** 0 to 1, clockwise from twelve o'clock. */
  progress: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
}

export function TimerRing({
  progress,
  size = sizes.timerRing,
  stroke = sizes.timerRingStroke,
  children,
}: TimerRingProps) {
  const { colors } = useTheme();
  const clamped = Math.min(1, Math.max(0, progress));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.line.ringTrack}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.ringProgress}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped)}
          fill="none"
          // Start the sweep at twelve o'clock instead of three.
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.centre}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center' },
  centre: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
