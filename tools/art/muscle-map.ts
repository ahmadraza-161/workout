// Generates the front and back muscle maps (T2.13, ADR-043).
//
// One named group per muscle so the exercise guide can highlight the ones an
// exercise works: strong for primary, faint for secondary, grey otherwise
// (DESIGN §4.4). The shapes are deliberately simple blocks that read at the
// 150 dp the guide draws them at, not an anatomy illustration.
//
// Measured from the reference: highlight #0062FF on muscle grey #CCCBCD over
// a #FAFAFA silhouette. Those values live in the theme; this file only emits
// geometry and group names, so the map recolours with the theme.

import { MUSCLE_GROUPS, type MuscleGroup } from '../content/metrics.ts';

export const MAP_WIDTH = 240;
export const MAP_HEIGHT = 560;

export type MapView = 'front' | 'back';

export interface MusclePath {
  muscle: MuscleGroup;
  /** SVG path data on a 240 x 560 canvas. */
  d: string;
}

const CENTRE = MAP_WIDTH / 2;

/** A rounded blob, which is all these shapes need to be at this size. */
function blob(cx: number, cy: number, rx: number, ry: number): string {
  const k = 0.5523;
  return [
    `M ${cx} ${cy - ry}`,
    `C ${cx + rx * k} ${cy - ry} ${cx + rx} ${cy - ry * k} ${cx + rx} ${cy}`,
    `C ${cx + rx} ${cy + ry * k} ${cx + rx * k} ${cy + ry} ${cx} ${cy + ry}`,
    `C ${cx - rx * k} ${cy + ry} ${cx - rx} ${cy + ry * k} ${cx - rx} ${cy}`,
    `C ${cx - rx} ${cy - ry * k} ${cx - rx * k} ${cy - ry} ${cx} ${cy - ry}`,
    'Z',
  ].join(' ');
}

/** A pair of blobs either side of the centre line. */
function pair(offset: number, cy: number, rx: number, ry: number): string {
  return `${blob(CENTRE - offset, cy, rx, ry)} ${blob(CENTRE + offset, cy, rx, ry)}`;
}

/**
 * The body outline the muscles sit on. Head, torso, arms and legs as one
 * silhouette; it is the same for both views, since a flat figure seen from
 * behind has the same outline.
 */
export const SILHOUETTE = [
  blob(CENTRE, 52, 30, 38),
  blob(CENTRE, 104, 16, 18),
  blob(CENTRE, 186, 62, 68),
  blob(CENTRE, 268, 48, 32),
  pair(74, 190, 16, 56),
  pair(84, 268, 14, 44),
  pair(92, 322, 12, 22),
  pair(30, 360, 26, 66),
  pair(32, 460, 20, 54),
  pair(34, 528, 14, 16),
].join(' ');

/** Front view: the muscles a person sees in a mirror. */
const FRONT: Partial<Record<MuscleGroup, string>> = {
  neck: blob(CENTRE, 100, 17, 15),
  traps: pair(34, 128, 24, 13),
  deltoids: pair(66, 152, 22, 20),
  chest: pair(28, 176, 27, 21),
  biceps: pair(76, 208, 14, 30),
  forearms: pair(86, 268, 12, 38),
  abs: blob(CENTRE, 232, 26, 34),
  obliques: pair(40, 236, 11, 30),
  hip_flexors: pair(22, 282, 14, 16),
  adductors: pair(16, 352, 13, 44),
  quads: pair(32, 368, 22, 60),
  calves: pair(32, 470, 16, 40),
};

/** Back view: everything the mirror hides. */
const BACK: Partial<Record<MuscleGroup, string>> = {
  neck: blob(CENTRE, 100, 17, 15),
  traps: blob(CENTRE, 140, 44, 28),
  rear_deltoids: pair(66, 152, 21, 18),
  upper_back: pair(30, 184, 27, 22),
  lats: pair(38, 216, 22, 30),
  triceps: pair(76, 208, 14, 30),
  forearms: pair(86, 268, 12, 38),
  erector_spinae: blob(CENTRE, 232, 14, 42),
  glutes: pair(26, 300, 25, 24),
  hamstrings: pair(32, 372, 22, 58),
  calves: pair(32, 470, 16, 40),
};

export function musclePaths(view: MapView): MusclePath[] {
  const source = view === 'front' ? FRONT : BACK;
  return MUSCLE_GROUPS.filter((muscle) => source[muscle] !== undefined).map((muscle) => ({
    muscle,
    d: source[muscle]!,
  }));
}

/** Every muscle appears on at least one view, or the guide cannot show it. */
export function coverage(): { muscle: MuscleGroup; views: MapView[] }[] {
  return MUSCLE_GROUPS.map((muscle) => ({
    muscle,
    views: (['front', 'back'] as MapView[]).filter((view) =>
      musclePaths(view).some((path) => path.muscle === muscle),
    ),
  }));
}

/**
 * The map as an SVG string. Colours are left as CSS custom properties so the
 * app can hand it theme tokens and highlight per exercise without regenerating
 * anything.
 */
export function toSvg(view: MapView): string {
  const groups = musclePaths(view)
    .map((path) => `  <path id="${path.muscle}" d="${path.d}" fill="var(--muscle-${path.muscle}, #CCCBCD)" />`)
    .join('\n');

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MAP_WIDTH} ${MAP_HEIGHT}" width="${MAP_WIDTH}" height="${MAP_HEIGHT}">`,
    `  <path id="silhouette" d="${SILHOUETTE}" fill="var(--muscle-base, #FAFAFA)" />`,
    groups,
    '</svg>',
  ].join('\n');
}
