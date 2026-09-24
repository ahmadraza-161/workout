// Generates the front and back muscle maps (T2.13, ADR-043).
//
// One named group per muscle so the exercise guide can highlight the ones an
// exercise works: strong for primary, faint for secondary, grey otherwise
// (DESIGN §4.4).
//
// The muscles are placed against the body outline in silhouette.ts rather than
// scattered on a blank canvas, and every shape is clipped to that outline, so
// nothing can float outside the body however roughly it is drawn.
//
// Colours stay as CSS custom properties. The app hands the map theme tokens,
// so it recolours for dark mode and for per-exercise highlighting without
// regenerating anything.

import { MUSCLE_GROUPS, type MuscleGroup } from '../content/metrics.ts';
import { HEIGHT, SILHOUETTE, WIDTH } from './silhouette.ts';

export const MAP_WIDTH = WIDTH;
export const MAP_HEIGHT = HEIGHT;
export { SILHOUETTE };

export type MapView = 'front' | 'back';

export interface MusclePath {
  muscle: MuscleGroup;
  d: string;
}

const MID = WIDTH / 2;

/** A rounded quadrilateral, which follows a limb better than an ellipse. */
function slab(points: [number, number][]): string {
  const round = (value: number) => Math.round(value * 10) / 10;
  const list = points.map(([x, y]) => `${round(x)} ${round(y)}`);
  return `M ${list[0]} L ${list.slice(1).join(' L ')} Z`;
}

/** An oval, for the muscles that genuinely are one. */
function oval(cx: number, cy: number, rx: number, ry: number): string {
  const k = 0.5523;
  const r = (value: number) => Math.round(value * 10) / 10;
  return [
    `M ${r(cx)} ${r(cy - ry)}`,
    `C ${r(cx + rx * k)} ${r(cy - ry)} ${r(cx + rx)} ${r(cy - ry * k)} ${r(cx + rx)} ${r(cy)}`,
    `C ${r(cx + rx)} ${r(cy + ry * k)} ${r(cx + rx * k)} ${r(cy + ry)} ${r(cx)} ${r(cy + ry)}`,
    `C ${r(cx - rx * k)} ${r(cy + ry)} ${r(cx - rx)} ${r(cy + ry * k)} ${r(cx - rx)} ${r(cy)}`,
    `C ${r(cx - rx)} ${r(cy - ry * k)} ${r(cx - rx * k)} ${r(cy - ry)} ${r(cx)} ${r(cy - ry)}`,
    'Z',
  ].join(' ');
}

/** Mirrors a shape built on the right-hand side onto the left as well. */
function both(build: (side: 1 | -1) => string): string {
  return `${build(1)} ${build(-1)}`;
}

const pairedOval = (dx: number, cy: number, rx: number, ry: number) =>
  both((side) => oval(MID + side * dx, cy, rx, ry));

const pairedSlab = (points: [number, number][]) =>
  both((side) => slab(points.map(([dx, y]) => [MID + side * dx, y])));

/** Front view: what a person sees in a mirror. */
const FRONT: Partial<Record<MuscleGroup, string>> = {
  neck: pairedSlab([
    [4, 76],
    [14, 80],
    [16, 94],
    [4, 92],
  ]),
  traps: pairedSlab([
    [8, 90],
    [40, 106],
    [44, 116],
    [10, 104],
  ]),
  deltoids: pairedOval(44, 122, 15, 18),
  chest: pairedSlab([
    [4, 122],
    [34, 126],
    [36, 156],
    [4, 158],
  ]),
  biceps: pairedOval(50, 160, 10, 26),
  forearms: pairedOval(50, 226, 9, 32),
  abs: slab([
    [MID - 20, 164],
    [MID + 20, 164],
    [MID + 17, 240],
    [MID - 17, 240],
  ]),
  obliques: pairedSlab([
    [21, 168],
    [35, 172],
    [32, 234],
    [19, 232],
  ]),
  hip_flexors: pairedOval(18, 258, 13, 16),
  quads: pairedOval(28, 322, 17, 52),
  adductors: pairedOval(12, 322, 8, 44),
  calves: pairedOval(24, 444, 11, 38),
};

/** Back view: everything the mirror hides. */
const BACK: Partial<Record<MuscleGroup, string>> = {
  neck: pairedSlab([
    [3, 76],
    [13, 80],
    [15, 94],
    [3, 92],
  ]),
  traps: slab([
    [MID - 42, 108],
    [MID + 42, 108],
    [MID + 22, 168],
    [MID - 22, 168],
  ]),
  rear_deltoids: pairedOval(44, 122, 15, 18),
  upper_back: pairedSlab([
    [5, 126],
    [34, 130],
    [36, 166],
    [5, 168],
  ]),
  lats: pairedSlab([
    [8, 170],
    [36, 166],
    [30, 218],
    [8, 222],
  ]),
  triceps: pairedOval(50, 160, 10, 26),
  forearms: pairedOval(50, 226, 9, 32),
  erector_spinae: slab([
    [MID - 9, 130],
    [MID + 9, 130],
    [MID + 7, 240],
    [MID - 7, 240],
  ]),
  glutes: pairedOval(22, 264, 20, 24),
  hamstrings: pairedOval(27, 330, 16, 48),
  calves: pairedOval(24, 444, 12, 40),
};

export function musclePaths(view: MapView): MusclePath[] {
  const source = view === 'front' ? FRONT : BACK;
  return MUSCLE_GROUPS.filter((muscle) => source[muscle] !== undefined).map((muscle) => ({
    muscle,
    d: source[muscle]!,
  }));
}

/** Every muscle has to appear on at least one view, or the guide cannot show it. */
export function coverage(): { muscle: MuscleGroup; views: MapView[] }[] {
  return MUSCLE_GROUPS.map((muscle) => ({
    muscle,
    views: (['front', 'back'] as MapView[]).filter((view) =>
      musclePaths(view).some((path) => path.muscle === muscle),
    ),
  }));
}

export function toSvg(view: MapView): string {
  const groups = musclePaths(view)
    .map((path) => `    <path id="${path.muscle}" d="${path.d}" fill="var(--muscle-${path.muscle}, #C4C4C9)" />`)
    .join('\n');

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}">`,
    '  <defs>',
    `    <clipPath id="body"><path d="${SILHOUETTE}" /></clipPath>`,
    '  </defs>',
    `  <path id="silhouette" d="${SILHOUETTE}" fill="var(--muscle-base, #DCDCE0)" />`,
    // Clipping means a muscle shape can never spill past the body outline.
    '  <g clip-path="url(#body)">',
    groups,
    '  </g>',
    '</svg>',
  ].join('\n');
}
