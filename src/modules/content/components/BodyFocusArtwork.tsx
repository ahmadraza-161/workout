import type { ComponentType } from 'react';
import Svg, { Path } from 'react-native-svg';

// Original silhouettes: category icons should depict the body area, not a heart/clock.
const SHAPES: Record<string, string> = {
  'arm-shoulder': 'M18 46c-6-2-10-8-9-16l3-14 8-5 8 6-4 8-5-3-2 12 8 3c3-8 8-12 16-11 10 1 16 10 14 20-2 10-12 15-24 13z',
  'back-posture': 'M23 8h18l4 9 12 6-6 12-8-5-2 26H23l-2-26-8 5-6-12 12-6zM30 20h4v31h-4z',
  'butt-leg': 'M22 5h20l4 20-6 32h-9l2-29-6 29h-9l2-32z',
  chest: 'M20 7h24l3 9 12 7-7 13-9-6-2 27H23l-2-27-9 6-7-13 12-7zM17 23c5-3 11-3 13 3v10H18zM47 23c-5-3-11-3-13 3v10h12z',
  core: 'M20 5h24l6 15-7 11-2 28H23l-2-28-7-11zM26 19h5v8h-5zM34 19h5v8h-5zM25 31h6v8h-6zM34 31h6v8h-6zM25 43h6v9h-6zM34 43h6v9h-6z',
  'full-body': 'M32 2a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM25 19h14l15 15-5 5-10-10-2 13 7 18h-9l-3-13-3 13h-9l7-18-2-13-10 10-5-5z',
};
type IconProps = { size?: number; color?: string };
function BodyFocusArtwork({ id, size, color }: IconProps & { id: string }) {
  return <Svg width={size} height={size} viewBox="0 0 64 64" accessible={false}>
    <Path d={SHAPES[id]} fill={color} fillRule="evenodd" />
  </Svg>;
}
export const CATEGORY_ICONS: Record<string, ComponentType<IconProps>> = Object.fromEntries(
  Object.keys(SHAPES).map((id) => [id, function CategoryIcon(props: IconProps) {
    return <BodyFocusArtwork id={id} {...props} />;
  }]),
);
