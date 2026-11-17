import Svg, { Path } from 'react-native-svg';

import { svgPath } from '../rig/authored/geometry';
import { drawStyleFrame, type StyleExercise } from '../rig/authored/motion';
import { PALETTES, type PaletteName } from '../rig/palette';

/** Style-review renderer; intentionally separate from the unapproved Lottie rig. */
export function StyleProofFigure({
  exercise,
  progress,
  palette,
  label,
}: {
  exercise: StyleExercise;
  progress: number;
  palette: PaletteName;
  label: string;
}) {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 600 600"
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
    >
      {drawStyleFrame(exercise, progress, PALETTES[palette]).map((part) => (
        <Path key={part.id} d={svgPath(part.path)} fill={part.fill} />
      ))}
    </Svg>
  );
}
