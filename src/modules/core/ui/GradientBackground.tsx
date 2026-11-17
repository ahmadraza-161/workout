import { useId } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import type { GradientStops } from '../theme';

// Gradients are drawn with react-native-svg (ADR-034). Place inside a parent
// with `overflow: 'hidden'` and a border radius to clip the corners.

export type GradientAngle = 90 | 135 | 180;

const VECTORS: Record<GradientAngle, { x1: string; y1: string; x2: string; y2: string }> = {
  90: { x1: '0', y1: '0', x2: '1', y2: '0' },
  135: { x1: '0', y1: '0', x2: '1', y2: '1' },
  180: { x1: '0', y1: '0', x2: '0', y2: '1' },
};

export function GradientBackground({ stops, angle = 90 }: { stops: GradientStops; angle?: GradientAngle }) {
  // SVG ids must be plain identifiers; React ids can contain other characters.
  const id = `g${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const start = gradientStop(stops[0]);
  const end = gradientStop(stops[1]);
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <LinearGradient id={id} {...VECTORS[angle]}>
          <Stop offset="0" stopColor={start.color} stopOpacity={start.opacity} />
          <Stop offset="1" stopColor={end.color} stopOpacity={end.opacity} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}

/** Android SVG gradients need alpha on Stop, separately from the RGB colour. */
export function gradientStop(value: string): { color: string; opacity: number } {
  const rgba = value.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/);
  return rgba ? { color: `#${rgba.slice(1, 4).map((part) => Number(part).toString(16).padStart(2, '0')).join('')}`,
    opacity: Number(rgba[4]) } : { color: value, opacity: 1 };
}
