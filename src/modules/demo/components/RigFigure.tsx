import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { PALETTES, type PaletteName } from '../rig/palette';
import type { MotionArc, Shape } from '../rig/render';
import { renderMotionArc, renderPose, renderProp } from '../rig/render';
import type { Pose, View as RigView } from '../rig/pose';
import { CANVAS } from '../rig/skeleton';

export type PropKind = 'wall' | 'chair' | 'doorway' | 'bottles' | 'floorLine';

// Draws one solved pose with react-native-svg. The same rig feeds the Lottie
// exporter at build time and the runtime thumbnails (ADR-024), so a thumbnail
// and its animation can never drift apart.
export interface RigFigureProps {
  pose: Pose;
  view: RigView;
  size: number;
  palette?: PaletteName;
  props?: PropKind[];
  motionArc?: MotionArc;
  floorShadow?: boolean;
  accessibilityLabel?: string;
}

export function RigFigure({
  pose,
  view,
  size,
  palette = 'a',
  props = [],
  motionArc,
  floorShadow,
  accessibilityLabel,
}: RigFigureProps) {
  const tones = PALETTES[palette];

  const shapes: Shape[] = [
    // Props sit behind everything, then the arc, then the figure.
    ...props.flatMap((kind) => renderProp(kind)),
    ...(motionArc ? renderMotionArc(pose, motionArc, tones) : []),
    ...renderPose(pose, { palette: tones, view, floorShadow }),
  ];

  return (
    <View
      accessible={accessibilityLabel !== undefined}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${CANVAS} ${CANVAS}`}>
        {shapes.map((shape, index) => (
          <Path
            key={`${shape.id}-${index}`}
            d={shape.d}
            fill={shape.fill}
            opacity={shape.opacity}
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
            strokeLinecap="round"
          />
        ))}
      </Svg>
    </View>
  );
}
